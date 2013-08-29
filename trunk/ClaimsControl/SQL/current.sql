--1.023--
ALTER TABLE tblTempClaims ADD LossAmount2 float NOT NULL DEFAULT 0
GO
INSERT INTO tblWords(ObjectID,KeyName,Label,LanguageID)
SELECT (SELECT ID FROM tblObjects_ID WHERE tblName='General'),'notInsured','Neapdrausta',1
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[proc_Accidents]
@AccountID int,
@AccidentID int=null,
@UserID int=null

AS
BEGIN
SET NOCOUNT ON
DECLARE @Spid int=@@Spid
DECLARE @tblClaimsID int=(SELECT ID FROM tblObjects_ID WHERE tblName='tblClaims'), @tblAccidentsID int=(SELECT ID FROM tblObjects_ID WHERE tblName='tblAccidents')
DECLARE @LanguageID int= CASE WHEN @UserID IS NULL THEN 1 ELSE (SELECT LanguageID FROM tblUsers WHERE ID=@UserID) END
DECLARE @NotInsured nvarchar(50)=isnull((SELECT Label FROM dbo.fnWords(@LanguageID,'General') WHERE  KeyName='notInsured'),'Not insured')

DELETE FROM tblTempClaims WHERE Spid=@Spid
IF @AccidentID is null BEGIN
	
	INSERT INTO tblTempClaims(RNo,No,AccidentID,ClaimType,ClaimTypeID,VehiclePlate,Vehicle,Insurer,InsPolicyNo,ClaimStatus,LossAmount,LossAmount2,AmountIsConfirmed,UserName,Spid,VehicleID,InsPolicyID,InsuranceClaimAmount,InsurerClaimID, IsTotalLoss,IsInjuredPersons,ClaimID,Days,PerDay)
	SELECT row_number() Over (order by A.ID,C.ID),cast(A.No as varchar(15))+'-'+cast(C.No as varchar(15)),A.ID,CT.Name,CT.ID,V.Plate,V.Model+isnull(' '+VM.Name,''),
	CASE WHEN C.ClaimTypeID=6 THEN '' ELSE
		CASE WHEN InsPolicyID=0 THEN @NotInsured ELSE I.Name END
	END
	,isnull(IP.PolicyNumber,''),ClaimStatus,LossAmount,CASE WHEN C.ClaimTypeID=2 AND IsInjuredPersons=1 AND InsPolicyID<>0 THEN LossAmount+InsuranceClaimAmount ELSE LossAmount END,AmountIsConfirmed,u.FirstName+' '+u.Surname,@Spid,VehicleID,isnull(InsPolicyID,0),isnull(InsuranceClaimAmount,0),isnull(InsurerClaimID,'-'), isnull(IsTotalLoss,0),isnull(IsInjuredPersons,0),C.ID,isnull(Days,0),isnull(PerDay,0) FROM tblClaims C WITH (NOLOCK)
	--join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on OBJECT_ID('tblClaims')=UA.TableID AND UA.RecordID=C.ID join tblUsers u on u.ID=UA.UserID
	join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on @tblClaimsID=UA.TableID AND UA.RecordID=C.ID join tblUsers u on u.ID=UA.UserID

	join tblClaimTypes CT on CT.ID=C.ClaimTypeID
	join tblVehicles V on V.ID=C.VehicleID join tblVehicleMakes VM on V.MakeID=VM.ID
	left join tblInsPolicies IP on IP.ID=C.InsPolicyID left join tblInsurers I on I.ID=IP.InsurerID
	join tblAccidents A on C.AccidentID=A.ID
	WHERE A.AccountID=@AccountID AND C.IsDeleted=0 AND u.IsDeleted=0 AND V.IsDeleted=0 AND (IP.IsDeleted=0 or IP.IsDeleted is null) AND A.IsDeleted=0

END ELSE BEGIN
	INSERT INTO tblTempClaims(RNo,No,AccidentID,ClaimType,ClaimTypeID,VehiclePlate,Vehicle,Insurer,InsPolicyNo,ClaimStatus,LossAmount,LossAmount2,AmountIsConfirmed,UserName,Spid,VehicleID,InsPolicyID,InsuranceClaimAmount,InsurerClaimID, IsTotalLoss,IsInjuredPersons,ClaimID,Days,PerDay)
	SELECT row_number() Over (order by A.ID,C.ID),cast(A.No as varchar(15))+'-'+cast(C.No as varchar(15)),A.ID,CT.Name,CT.ID,V.Plate,V.Model+isnull(' '+VM.Name,''),
		CASE WHEN C.ClaimTypeID=6 THEN '' ELSE
		CASE WHEN InsPolicyID=0 THEN @NotInsured ELSE I.Name END
	END
	,isnull(IP.PolicyNumber,''),ClaimStatus,LossAmount,CASE WHEN C.ClaimTypeID=2 AND IsInjuredPersons=1  AND InsPolicyID<>0 THEN LossAmount+InsuranceClaimAmount ELSE LossAmount END,AmountIsConfirmed,u.FirstName+' '+u.Surname,@Spid,VehicleID,isnull(InsPolicyID,0),isnull(InsuranceClaimAmount,0),isnull(InsurerClaimID,'-'), isnull(IsTotalLoss,0),isnull(IsInjuredPersons,0),C.ID,isnull(Days,0),isnull(PerDay,0) FROM tblClaims C WITH (NOLOCK)
	join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on @tblClaimsID=UA.TableID AND UA.RecordID=C.ID join tblUsers u on u.ID=UA.UserID
	join tblClaimTypes CT on CT.ID=C.ClaimTypeID
	join tblVehicles V on V.ID=C.VehicleID join tblVehicleMakes VM on V.MakeID=VM.ID
	left join tblInsPolicies IP on IP.ID=C.InsPolicyID left join tblInsurers I on I.ID=IP.InsurerID
	join tblAccidents A on C.AccidentID=A.ID
	WHERE A.AccountID=@AccountID AND C.IsDeleted=0 AND u.IsDeleted=0 AND V.IsDeleted=0 AND (IP.IsDeleted=0 or IP.IsDeleted is null) AND A.IsDeleted=0
	AND AccidentID=@AccidentID
END
Declare @iRow int=1, @Count int=@@RowCount,@AID int,@AID_Prew int=0, @Claims nvarchar(max),@Claims2 nvarchar(max),@ClaimTypeID nvarchar(max), @ClaimsRow nvarchar(max)='', @ClaimsRow2 nvarchar(max)='',@ClaimTypeIDRow nvarchar(max)=''
DELETE FROM tblTempConcString WHERE Spid=@@SPID
------------------------------------------------------------------------------------------------------------
WHILE @iRow<=@Count BEGIN
	SELECT @AID=AccidentID, @Claims=CAST(ClaimStatus AS VARCHAR(5)) +'#|'+No+'#|'+ClaimType+'#|'+VehiclePlate+'#|'+Insurer+'#|'+cast(LossAmount as varchar(25))+'{{'+Vehicle+' ' +InsPolicyNo +' '+UserName+'}}',
	@Claims2=cast(isnull(ClaimID,0) as varchar(10))+'#|'+cast(isnull(VehicleID,0) as varchar(10))+'#|'+cast(InsPolicyID as varchar(10))+'#|'+replace(cast(isnull(InsuranceClaimAmount,0) as varchar(10)),',','.')+'#|'''+InsurerClaimID+'''#|'+cast(IsTotalLoss as varchar(10))+'#|'+cast(IsInjuredPersons as varchar(10))+'#|'+cast(Days as varchar(10))+'#|'+replace(cast(PerDay as varchar(10)),',','.'),
	@ClaimTypeID=ClaimTypeID
	 FROM tblTempClaims WHERE Spid=@Spid AND RNo=@iRow
		IF @AID<>@AID_Prew BEGIN--Nauja eilute
			IF @AID_Prew<>0 INSERT INTO tblTempConcString SELECT @AID_Prew,@ClaimsRow,@ClaimsRow2,@@SPID,@ClaimTypeIDRow--Jei ne pirmas	
			SELECT @AID_Prew=@AID,@ClaimsRow=@Claims,@ClaimsRow2=@Claims2,@ClaimTypeIDRow=@ClaimTypeID--Isidedam pirma
		END ELSE BEGIN
			SELECT @AID_Prew=@AID,@ClaimsRow=@ClaimsRow+'#||'+@Claims,@ClaimsRow2=@ClaimsRow2+'#||'+@Claims2,@ClaimTypeIDRow=@ClaimTypeIDRow+'#'+@ClaimTypeID
		END 
SET @iRow=@iRow+1 END
	IF @ClaimsRow<>'' INSERT INTO tblTempConcString SELECT @AID_Prew,@ClaimsRow,@ClaimsRow2,@@SPID,@ClaimTypeIDRow
		
IF @AccidentID is null BEGIN
	SELECT A.ID, A.No, CONVERT (varchar(10),A.Date,102) Date, isnull(LocationCountry,'')+', '+isnull(LocationDistrict,'')+', '+isnull(LocationAddress,'') Place,AT.Name AccType, isnull(CSUM.CNo,0) CNo_All,isnull(CStat.CNo,0) CNo_NotF,isnull(CSUM.LossSum,0) LossSum,isnull(CSUM.AmountIsConfirmed,0) AmountIsConfirmed,
	A.ShortNote, isnull(A.LongNote,'') LongNote, D.FirstName+' '+D.LastName Driver, u.FirstName+' '+u.Surname UserName, isnull(CC.ConcString,'') Claims_C, isnull(CC.ConcString2,'') Claims_C2,
	datediff(d,A.Date,getdate()) DaysFrom, isnull(doc.No,0) DocNo, isnull(CC.ClaimTypeID,'') Claims_TypeID, D.ID DriverID, A.IsNotOurFault	

	--SELECT isnull(CC.ConcString,'') Claims_C, '['+isnull(CC.ConcString2,'')+']' Claims_C2
	FROM tblAccidents A left join
	(SELECT sum(LossAmount2) LossSum, COUNT(*) CNo, MIN(AmountIsConfirmed) AmountIsConfirmed, AccidentID FROM tblTempClaims WHERE Spid=@Spid GROUP BY AccidentID) CSUM on A.ID=CSUM.AccidentID left join
	(SELECT COUNT(*) CNo, AccidentID FROM tblTempClaims WHERE ClaimStatus<5 AND Spid=@Spid GROUP BY AccidentID) CStat on A.ID=CStat.AccidentID left join
	(SELECT ID AID, ConcString,ConcString2,ClaimTypeID FROM tblTempConcString WHERE Spid=@@SPID) CC on A.ID=CC.AID
	join tblAccidentsTypes AT on AT.ID=A.AccidentTypeID
	join tblDrivers D on D.ID=A.DriverID
	--join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on  OBJECT_ID('tblAccidents')=UA.TableID AND UA.RecordID=A.ID join tblUsers u on u.ID=UA.UserID
	join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on @tblAccidentsID=UA.TableID AND UA.RecordID=A.ID join tblUsers u on u.ID=UA.UserID
	LEFT JOIN (
	--SELECT count(*) No, AccidentID FROM tblDocsInAccident dInA JOIN tblDocs d on dInA.DocID=d.ID GROUP BY dInA.AccidentID) doc ON A.ID=doc.AccidentID
	SELECT count(*) No, RefID FROM tblDocs d JOIN tblUsers u on d.UserID=u.ID WHERE u.AccountID=@AccountID AND d.GroupID<>3 AND d.GroupID<>4 GROUP BY RefID) doc ON A.ID=doc.RefID
	WHERE A.IsDeleted=0 AND A.AccountID=@AccountID ORDER BY A.Date desc --A.No asc
END ELSE BEGIN
	SELECT A.ID, A.No, CONVERT (varchar(10),A.Date,102) Date, isnull(LocationCountry,'')+', '+isnull(LocationDistrict,'')+', '+isnull(LocationAddress,'') Place,AT.Name AccType, isnull(CSUM.CNo,0) CNo_All,isnull(CStat.CNo,0) CNo_NotF,isnull(CSUM.LossSum,0) LossSum,isnull(CSUM.AmountIsConfirmed,0) AmountIsConfirmed,
	A.ShortNote, isnull(A.LongNote,'') LongNote, D.FirstName+' '+D.LastName Driver, u.FirstName+' '+u.Surname UserName, isnull(CC.ConcString,'') Claims_C, isnull(CC.ConcString2,'') Claims_C2,
	datediff(d,A.Date,getdate()) DaysFrom, isnull(doc.No,0) DocNo, isnull(CC.ClaimTypeID,'') Claims_TypeID, D.ID DriverID, A.IsNotOurFault	
	FROM tblAccidents A left join
	(SELECT sum(LossAmount2) LossSum, COUNT(*) CNo, MIN(AmountIsConfirmed) AmountIsConfirmed, AccidentID FROM tblTempClaims WHERE Spid=@Spid GROUP BY AccidentID) CSUM on A.ID=CSUM.AccidentID left join
	(SELECT COUNT(*) CNo, AccidentID FROM tblTempClaims WHERE ClaimStatus<5 AND Spid=@Spid GROUP BY AccidentID) CStat on A.ID=CStat.AccidentID left join
	(SELECT ID AID, ConcString,ConcString2,ClaimTypeID FROM tblTempConcString WHERE Spid=@@SPID) CC on A.ID=CC.AID
	join tblAccidentsTypes AT on AT.ID=A.AccidentTypeID
	join tblDrivers D on D.ID=A.DriverID
	join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on  @tblAccidentsID=UA.TableID AND UA.RecordID=A.ID join tblUsers u on u.ID=UA.UserID
	LEFT JOIN (
	--SELECT count(*) No, AccidentID FROM tblDocsInAccident dInA JOIN tblDocs d on dInA.DocID=d.ID GROUP BY dInA.AccidentID) doc ON A.ID=doc.AccidentID
	SELECT count(*) No, RefID FROM tblDocs d JOIN tblUsers u on d.UserID=u.ID WHERE u.AccountID=@AccountID AND d.GroupID<>3 AND d.GroupID<>4 GROUP BY RefID) doc ON A.ID=doc.RefID
	WHERE A.IsDeleted=0 AND A.AccountID=@AccountID AND A.ID=@AccidentID
END

DELETE FROM tblTempConcString WHERE Spid=@Spid
DELETE FROM tblTempClaims WHERE Spid=@Spid
END
GO
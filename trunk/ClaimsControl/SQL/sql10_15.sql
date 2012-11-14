-- testas

ALTER TABLE dbo.tblDocs ADD GroupID int DEFAULT 5 NULL
GO
ALTER TABLE dbo.tblDocs ADD CONSTRAINT FK_tblDocs_tblDocGroups FOREIGN KEY(GroupID)REFERENCES tblDocGroups(ID)	
GO
ALTER TABLE dbo.tblDocs ALTER COLUMN [DocTypeID] INT NULL;
GO
ALTER TABLE dbo.tblDocs ALTER COLUMN [RefID] INT NULL;	
GO
ALTER TABLE dbo.tblDocs ADD AccidentID int NULL	
GO
ALTER TABLE dbo.tblDocs ADD CONSTRAINT FK_tblDocs_tblAccident FOREIGN KEY(AccidentID)REFERENCES tblAccidents(ID)
GO
ALTER TABLE dbo.tblTempClaims ADD ClaimTypeID int NOT NULL
GO
ALTER TABLE dbo.tblTempConcString ADD ClaimTypeID varchar(max) NOT NULL
GO


ALTER PROCEDURE [dbo].[proc_Accidents]
@AccountID int,
@AccidentID int=null
AS
BEGIN
SET NOCOUNT ON
DECLARE @Spid int=@@Spid 
DECLARE @tblClaimsID int=(SELECT ID FROM tblObjects_ID WHERE tblName='tblClaims'), @tblAccidentsID int=(SELECT ID FROM tblObjects_ID WHERE tblName='tblAccidents')
DELETE FROM tblTempClaims WHERE Spid=@Spid
--Create TABLE #Claims (RNo int,AccidentID int, ClaimType varchar(30),VehiclePlate varchar(10),Vehicle varchar(80),
--Insurer varchar(50),InsPolicyNo varchar(50),ClaimStatus int, LossAmount float, UserName varchar(50))
--UPDATE tblUsersActivities SET TableID=OBJECT_ID('tblClaims') WHERE TableID=386100416
IF @AccidentID is null BEGIN
	
	INSERT INTO tblTempClaims(RNo,No,AccidentID,ClaimType,ClaimTypeID,VehiclePlate,Vehicle,Insurer,InsPolicyNo,ClaimStatus,LossAmount,AmountIsConfirmed,UserName,Spid,VehicleID,InsPolicyID,InsuranceClaimAmount,InsurerClaimID, IsTotalLoss,IsInjuredPersons,ClaimID,Days,PerDay)
	SELECT row_number() Over (order by A.ID,C.ID),cast(A.No as varchar(15))+'-'+cast(C.No as varchar(15)),A.ID,CT.Name,CT.ID,V.Plate,V.Model+isnull(' '+VM.Name,''),
	isnull(I.Name,''),isnull(IP.PolicyNumber,''),ClaimStatus,LossAmount,AmountIsConfirmed,u.FirstName+' '+u.Surname,@Spid,VehicleID,isnull(InsPolicyID,0),isnull(InsuranceClaimAmount,0),isnull(InsurerClaimID,'-'), isnull(IsTotalLoss,0),isnull(IsInjuredPersons,0),C.ID,isnull(Days,0),isnull(PerDay,0) FROM tblClaims C WITH (NOLOCK)
	--join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on OBJECT_ID('tblClaims')=UA.TableID AND UA.RecordID=C.ID join tblUsers u on u.ID=UA.UserID
	join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on @tblClaimsID=UA.TableID AND UA.RecordID=C.ID join tblUsers u on u.ID=UA.UserID

	join tblClaimTypes CT on CT.ID=C.ClaimTypeID
	join tblVehicles V on V.ID=C.VehicleID join tblVehicleMakes VM on V.MakeID=VM.ID
	left join tblInsPolicies IP on IP.ID=C.InsPolicyID left join tblInsurers I on I.ID=IP.InsurerID
	join tblAccidents A on C.AccidentID=A.ID
	WHERE A.AccountID=@AccountID AND C.IsDeleted=0 AND u.IsDeleted=0 AND V.IsDeleted=0 AND (IP.IsDeleted=0 or IP.IsDeleted is null) AND A.IsDeleted=0

	--SELECT * FROM tblAccidents WHERE AccountID=@AccountID
	--SELECT * FROM tblClaims WHERE AccidentID IN (SELECT ID FROM tblAccidents WHERE AccountID=@AccountID)
	--SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0
	--SELECT * FROM tblObjects_ID

END ELSE BEGIN
	INSERT INTO tblTempClaims(RNo,No,AccidentID,ClaimType,ClaimTypeID,VehiclePlate,Vehicle,Insurer,InsPolicyNo,ClaimStatus,LossAmount,AmountIsConfirmed,UserName,Spid,VehicleID,InsPolicyID,InsuranceClaimAmount,InsurerClaimID, IsTotalLoss,IsInjuredPersons,ClaimID,Days,PerDay)
	SELECT row_number() Over (order by A.ID,C.ID),cast(A.No as varchar(15))+'-'+cast(C.No as varchar(15)),A.ID,CT.Name,CT.ID,V.Plate,V.Model+isnull(' '+VM.Name,''),
	isnull(I.Name,''),isnull(IP.PolicyNumber,''),ClaimStatus,LossAmount,AmountIsConfirmed,u.FirstName+' '+u.Surname,@Spid,VehicleID,isnull(InsPolicyID,0),isnull(InsuranceClaimAmount,0),isnull(InsurerClaimID,'-'), isnull(IsTotalLoss,0),isnull(IsInjuredPersons,0),C.ID,isnull(Days,0),isnull(PerDay,0) FROM tblClaims C WITH (NOLOCK)
	join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on @tblClaimsID=UA.TableID AND UA.RecordID=C.ID join tblUsers u on u.ID=UA.UserID
	join tblClaimTypes CT on CT.ID=C.ClaimTypeID
	join tblVehicles V on V.ID=C.VehicleID join tblVehicleMakes VM on V.MakeID=VM.ID
	left join tblInsPolicies IP on IP.ID=C.InsPolicyID left join tblInsurers I on I.ID=IP.InsurerID
	join tblAccidents A on C.AccidentID=A.ID
	WHERE A.AccountID=@AccountID AND C.IsDeleted=0 AND u.IsDeleted=0 AND V.IsDeleted=0 AND (IP.IsDeleted=0 or IP.IsDeleted is null) AND A.IsDeleted=0
	AND AccidentID=@AccidentID
END
--SELECT * FROM tblTempClaims
Declare @iRow int=1, @Count int=@@RowCount,@AID int,@AID_Prew int=0, @Claims nvarchar(max),@Claims2 nvarchar(max),@ClaimTypeID nvarchar(max), @ClaimsRow nvarchar(max)='', @ClaimsRow2 nvarchar(max)='',@ClaimTypeIDRow nvarchar(max)=''
DELETE FROM tblTempConcString WHERE Spid=@@SPID
------------------------------------------------------------------------------------------------------------
WHILE @iRow<=@Count BEGIN
	--SENAS ClaimsControl
	--SELECT @AID=AccidentID, @Claims='{:'+CASE WHEN ClaimStatus=2 THEN '2' ELSE '0' END +':}|'+No+'|'+ClaimType+'|'+VehiclePlate+'|'+Insurer+'|'+cast(LossAmount as varchar(25))+'{{'+Vehicle+' ' +InsPolicyNo +' '+UserName+'}}',
	--@Claims2='['+cast(isnull(ClaimID,0) as varchar(10))+','+cast(isnull(VehicleID,0) as varchar(10))+','+cast(InsPolicyID as varchar(10))+','+replace(cast(isnull(InsuranceClaimAmount,0) as varchar(10)),',','.')+','''+InsurerClaimID+''','+cast(IsTotalLoss as varchar(10))+','+cast(IsInjuredPersons as varchar(10))+','+cast(Days as varchar(10))+','+replace(cast(PerDay as varchar(10)),',','.')+']' FROM tblTempClaims WHERE Spid=@Spid AND RNo=@iRow
	--	IF @AID<>@AID_Prew BEGIN--Nauja eilute
	--		IF @AID_Prew<>0 INSERT INTO tblTempConcString SELECT @AID_Prew,@ClaimsRow,@ClaimsRow2,@@SPID--Jei ne pirmas	
	--		SELECT @AID_Prew=@AID,@ClaimsRow='{#'+@Claims+'#}',@ClaimsRow2=@Claims2--Isidedam pirma
	--	END ELSE BEGIN
	--		SELECT @AID_Prew=@AID,@ClaimsRow=@ClaimsRow+'{#'+@Claims+'#}',@ClaimsRow2=@ClaimsRow2+','+@Claims2
	--	END 

	SELECT @AID=AccidentID, @Claims=CASE WHEN ClaimStatus=2 THEN '2' ELSE '0' END +'#|'+No+'#|'+ClaimType+'#|'+VehiclePlate+'#|'+Insurer+'#|'+cast(LossAmount as varchar(25))+'{{'+Vehicle+' ' +InsPolicyNo +' '+UserName+'}}',
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
		
	--SELECT *	FROM tblTempConcString
--{#KASCO|OVJ635|Lietuvos Draudimas|{:0:}|6000{{FH15 Volvo 152 Vardenis Pavardenis}}#}{#TPVCA|ZZ998|Ergo Lietuva|{:2:}|7000{{Actros Mercedes 160 Vardenis Pavardenis}}#}
--Iki 50 claimsu vienam ivykyje
------------------------------------------------------------------------------------------------------------
--SELECT * FROM tblTempConcString

IF @AccidentID is null BEGIN
	SELECT A.ID, A.No, CONVERT (varchar(10),A.Date,102) Date, isnull(LocationCountry,'')+', '+isnull(LocationDistrict,'')+', '+isnull(LocationAddress,'') Place,AT.Name AccType, isnull(CSUM.CNo,0) CNo_All,isnull(CStat.CNo,0) CNo_NotF,isnull(CSUM.LossSum,0) LossSum,isnull(CSUM.AmountIsConfirmed,0) AmountIsConfirmed,
	A.ShortNote, isnull(A.LongNote,'') LongNote, D.FirstName+' '+D.LastName Driver, u.FirstName+' '+u.Surname UserName, isnull(CC.ConcString,'') Claims_C, isnull(CC.ConcString2,'') Claims_C2,
	datediff(d,A.Date,getdate()) DaysFrom, isnull(doc.No,0) DocNo, isnull(CC.ClaimTypeID,'') Claims_TypeID	

	--SELECT isnull(CC.ConcString,'') Claims_C, '['+isnull(CC.ConcString2,'')+']' Claims_C2
	FROM tblAccidents A left join
	(SELECT sum(LossAmount) LossSum, COUNT(*) CNo, MIN(AmountIsConfirmed) AmountIsConfirmed, AccidentID FROM tblTempClaims WHERE Spid=@Spid GROUP BY AccidentID) CSUM on A.ID=CSUM.AccidentID left join
	(SELECT COUNT(*) CNo, AccidentID FROM tblTempClaims WHERE ClaimStatus<2 AND Spid=@Spid GROUP BY AccidentID) CStat on A.ID=CStat.AccidentID left join
	(SELECT ID AID, ConcString,ConcString2,ClaimTypeID FROM tblTempConcString WHERE Spid=@@SPID) CC on A.ID=CC.AID
	join tblAccidentsTypes AT on AT.ID=A.AccidentTypeID
	join tblDrivers D on D.ID=A.DriverID
	--join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on  OBJECT_ID('tblAccidents')=UA.TableID AND UA.RecordID=A.ID join tblUsers u on u.ID=UA.UserID
	join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on @tblAccidentsID=UA.TableID AND UA.RecordID=A.ID join tblUsers u on u.ID=UA.UserID
	LEFT JOIN (SELECT count(*) No, AccidentID ID FROM tblDocs d GROUP BY AccidentID) doc ON A.ID=doc.ID
	WHERE A.IsDeleted=0 ORDER BY A.Date desc --A.No asc
END ELSE BEGIN
	SELECT A.ID, A.No, CONVERT (varchar(10),A.Date,102) Date, isnull(LocationCountry,'')+', '+isnull(LocationDistrict,'')+', '+isnull(LocationAddress,'') Place,AT.Name AccType, isnull(CSUM.CNo,0) CNo_All,isnull(CStat.CNo,0) CNo_NotF,isnull(CSUM.LossSum,0) LossSum,isnull(CSUM.AmountIsConfirmed,0) AmountIsConfirmed,
	A.ShortNote, isnull(A.LongNote,'') LongNote, D.FirstName+' '+D.LastName Driver, u.FirstName+' '+u.Surname UserName, isnull(CC.ConcString,'') Claims_C, isnull(CC.ConcString2,'') Claims_C2,
	datediff(d,A.Date,getdate()) DaysFrom, isnull(doc.No,0) DocNo, isnull(CC.ClaimTypeID,'') Claims_TypeID	
	FROM tblAccidents A left join
	(SELECT sum(LossAmount) LossSum, COUNT(*) CNo, MIN(AmountIsConfirmed) AmountIsConfirmed, AccidentID FROM tblTempClaims WHERE Spid=@Spid GROUP BY AccidentID) CSUM on A.ID=CSUM.AccidentID left join
	(SELECT COUNT(*) CNo, AccidentID FROM tblTempClaims WHERE ClaimStatus<2 AND Spid=@Spid GROUP BY AccidentID) CStat on A.ID=CStat.AccidentID left join
	(SELECT ID AID, ConcString,ConcString2,ClaimTypeID FROM tblTempConcString WHERE Spid=@@SPID) CC on A.ID=CC.AID
	join tblAccidentsTypes AT on AT.ID=A.AccidentTypeID
	join tblDrivers D on D.ID=A.DriverID
	join (SELECT RecordID,TableID,UserID FROM tblUsersActivities_Updates WHERE Action=0) UA on  @tblAccidentsID=UA.TableID AND UA.RecordID=A.ID join tblUsers u on u.ID=UA.UserID
	LEFT JOIN (SELECT count(*) No, AccidentID ID FROM tblDocs d GROUP BY AccidentID) doc ON A.ID=doc.ID
	WHERE A.IsDeleted=0 AND A.ID=@AccidentID
END

--DROP TABLE #Claims
DELETE FROM tblTempConcString WHERE Spid=@Spid
DELETE FROM tblTempClaims WHERE Spid=@Spid
--PRINT cast(@Spid as varchar(20))
END
GO

ALTER PROCEDURE [dbo].[proc_GetStrFromRecord]
@Tbl varchar(50),
@AccountID int,
@ID int,
@Output nvarchar(max) output
AS
BEGIN
SET NOCOUNT ON
DECLARE @Rez varchar(max)
IF (@Tbl='tblClaims') BEGIN
	DECLARE @t TABLE(ID int, No int,Date smalldatetime,Place nvarchar(250),AccType nvarchar(50),CNo_All int,CNo_NotF int,LossSum float, AmountIsConfirmed bit,
	ShortNote nvarchar(100), LongNote nvarchar(500), Driver nvarchar(200),UserName nvarchar(200),Claims_C nvarchar(max), Claims_C2 nvarchar(max),
	DaysFrom int, DocNo int, Claims_TypeID varchar(max))
	INSERT INTO @t exec [dbo].[proc_Accidents] @AccountID, @ID--@AccidentID
	--SELECT * FROm @t
	--SELECT cast(ID as varchar(15)),cast(No as varchar(15)),dbo.fn_strDate(Date),
	--isnull(Place,''),AccType,cast(CNo_All as varchar(15)),cast(CNo_NotF as varchar(15)),
	--cast(LossSum as varchar(25)),cast(AmountIsConfirmed as char(1)),
	--ShortNote,LongNote,Driver,UserName,Claims_C,Claims_C2	FROM @t

	SELECT @Output=cast(ID as varchar(15))+'|#|'+cast(No as varchar(15))+'|#|'+dbo.fn_strDate(Date)+'|#|'+
	isnull(Place,'')+'|#|'+AccType+'|#|'+cast(CNo_All as varchar(15))+'|#|'+cast(CNo_NotF as varchar(15))+'|#|'+
	cast(LossSum as varchar(25))+'|#|'+cast(AmountIsConfirmed as char(1))+'|#|'+
	ShortNote+'|#|'+LongNote+'|#|'+Driver+'|#|'+UserName+'|#|'+Claims_C+'|#|'+Claims_C2+'|#|'+
	cast(DaysFrom AS VARCHAR(10))+'|#|'+cast(DocNo AS VARCHAR(10))+'|#|'+Claims_TypeID--+'|#|'	
	FROM @t
END
END
GO

ALTER PROCEDURE [dbo].[proc_AccidentsYears]
@AccountID int
AS
BEGIN
SET NOCOUNT ON
	SELECT datepart(year, Date) years FROM tblAccidents WHERE AccountID=@AccountID group BY datepart(year, Date)  order BY datepart(year, Date)desc
END
GO
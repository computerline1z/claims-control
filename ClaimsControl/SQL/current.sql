-----------------------------------------------1.021----------------------------------------------------------
CREATE TYPE RelationsTbl AS TABLE (ID int)
GO
USE [ClaimsControl]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[proc_InsertRelations]
--@AccountID int,
@relTbl RelationsTbl READONLY,
--laukø vardai
@MainID int,
@IDField varchar(100),
@Field varchar(100),
@DataTable varchar(100),
@DeletePrevious bit
AS
BEGIN
SET NOCOUNT ON
DECLARE @sql nvarchar(500),@RowAff int
--Istrinam visus buvusius ID
IF @DeletePrevious=1 BEGIN
	SET @sql = 'DELETE FROM '+@DataTable+' WHERE '+@IDField+'=@MainID'--Dokumentø ID skirsis nepriklausomai nuo Accounto todël to uþtenka
	--EXEC sp_executesql N'SELECT * FROM @tbl', N'@tbl tbltype READONLY', @tbl
	EXEC  sp_executesql  @sql, N'@MainID int', @MainID
END

SET @sql = 'INSERT INTO '+@DataTable+'('+@IDField+','+@Field+ ')SELECT @MainID, ID FROM @relTbl SELECT @RNo=@@ROWCOUNT'
INSERT INTO tblLogs(Msg,Date)SELECT CAST(@MainID as varchar(10))+', '+CAST(ID as varchar(10)),GETDATE() FROM @relTbl 
--INSERT INTO tblDocsInActivity(ActivityID,DocID)SELECT * FROM @relTbl SELECT @RNo=@@ROWCOUNT


EXECUTE  sp_executesql  @sql, N'@MainID int, @relTbl RelationsTbl READONLY, @RNo int output',@MainID, @relTbl, @RowAff OUTPUT

IF @RowAff=0 BEGIN
	RAISERROR ('No records inserted.',16,1);
END
END
GO
UPDATE tblInsurers SET Name='' WHERE ID=0
GO
-----------------------------------------------1.020-------UPDATED---------------------------------------------------
INSERT INTO tblObjects_ID(tblName,Date)
VALUES('tblDocsInActivity', GETDATE()),--50
('tblDocsInFin', GETDATE())--51
GO

USE [ClaimsControl]
GO
/****** Object:  StoredProcedure [dbo].[proc_Claims]    Script Date: 06/26/2013 16:49:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Description:	[dbo].[proc_Claims] 2
-- =============================================
CREATE PROCEDURE [dbo].[proc_Claims]
@AccountID int
AS
BEGIN
SET NOCOUNT ON

SELECT c.ID,c.ClaimTypeID,c.AccidentID,isNull(c.InsPolicyID,'') InsPolicyID,c.VehicleID,c.No,isNull(c.IsTotalLoss,'')IsTotalLoss,c.LossAmount,c.InsuranceClaimAmount,c.IsInjuredPersons,
c.InsuranceClaimAmount,
c.IsInjuredPersons,isNull(c.InsurerClaimID,'')InsurerClaimID,c.ClaimStatus,c.AmountIsConfirmed,isNull(c.Days,'')Days,isNull(c.PerDay,'')PerDay,dbo.fn_strDate(c.DateNotification)DateNotification,
dbo.fn_strDate(c.DateDocsSent)DateDocsSent
FROM tblClaims c JOIN tblAccidents a on a.ID=c.AccidentID WHERE a.AccountID=@AccountID AND c.IsDeleted=0

END
GO

-- =============================================
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
Declare @iRow int=1, @Count int=@@RowCount,@AID int,@AID_Prew int=0, @Claims nvarchar(max),@Claims2 nvarchar(max),@ClaimTypeID nvarchar(max), @ClaimsRow nvarchar(max)='', @ClaimsRow2 nvarchar(max)='',@ClaimTypeIDRow nvarchar(max)=''
DELETE FROM tblTempConcString WHERE Spid=@@SPID
------------------------------------------------------------------------------------------------------------
--SELECT * FROM tblTempClaims
--SELECT @Count
WHILE @iRow<=@Count BEGIN
	--SELECT @AID=AccidentID, @Claims=CASE WHEN ClaimStatus=2 THEN '2' ELSE '0' END +'#|'+No+'#|'+ClaimType+'#|'+VehiclePlate+'#|'+Insurer+'#|'+cast(LossAmount as varchar(25))+'{{'+Vehicle+' ' +InsPolicyNo +' '+UserName+'}}',
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
		
	--SELECT *	FROM tblTempConcString
--{#KASCO|OVJ635|Lietuvos Draudimas|{:0:}|6000{{FH15 Volvo 152 Vardenis Pavardenis}}#}{#TPVCA|ZZ998|Ergo Lietuva|{:2:}|7000{{Actros Mercedes 160 Vardenis Pavardenis}}#}
--Iki 50 claimsu vienam ivykyje
------------------------------------------------------------------------------------------------------------
--SELECT * FROM tblTempConcString
--SELECT @AccountID
IF @AccidentID is null BEGIN
	SELECT A.ID, A.No, CONVERT (varchar(10),A.Date,102) Date, isnull(LocationCountry,'')+', '+isnull(LocationDistrict,'')+', '+isnull(LocationAddress,'') Place,AT.Name AccType, isnull(CSUM.CNo,0) CNo_All,isnull(CStat.CNo,0) CNo_NotF,isnull(CSUM.LossSum,0) LossSum,isnull(CSUM.AmountIsConfirmed,0) AmountIsConfirmed,
	A.ShortNote, isnull(A.LongNote,'') LongNote, D.FirstName+' '+D.LastName Driver, u.FirstName+' '+u.Surname UserName, isnull(CC.ConcString,'') Claims_C, isnull(CC.ConcString2,'') Claims_C2,
	datediff(d,A.Date,getdate()) DaysFrom, isnull(doc.No,0) DocNo, isnull(CC.ClaimTypeID,'') Claims_TypeID, D.ID DriverID	

	--SELECT isnull(CC.ConcString,'') Claims_C, '['+isnull(CC.ConcString2,'')+']' Claims_C2
	FROM tblAccidents A left join
	(SELECT sum(LossAmount) LossSum, COUNT(*) CNo, MIN(AmountIsConfirmed) AmountIsConfirmed, AccidentID FROM tblTempClaims WHERE Spid=@Spid GROUP BY AccidentID) CSUM on A.ID=CSUM.AccidentID left join
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
	datediff(d,A.Date,getdate()) DaysFrom, isnull(doc.No,0) DocNo, isnull(CC.ClaimTypeID,'') Claims_TypeID, D.ID DriverID	
	FROM tblAccidents A left join
	(SELECT sum(LossAmount) LossSum, COUNT(*) CNo, MIN(AmountIsConfirmed) AmountIsConfirmed, AccidentID FROM tblTempClaims WHERE Spid=@Spid GROUP BY AccidentID) CSUM on A.ID=CSUM.AccidentID left join
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

--DROP TABLE #Claims
DELETE FROM tblTempConcString WHERE Spid=@Spid
DELETE FROM tblTempClaims WHERE Spid=@Spid
--PRINT cast(@Spid as varchar(20))
END
GO
----------------------------------------------------------
sp_RENAME 'tblDocsInFin.[FinID]' , 'ActivityID', 'COLUMN'
GO
-----------------------------------------------------------
USE [ClaimsControl]
GO
/****** Object:  StoredProcedure [dbo].[proc_Finances]    Script Date: 06/30/2013 21:47:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	[dbo].[proc_Finances] 2
--Pasikeitus sios sproc iseinantiems duomenimis reikia atitinkamai pakeist:
-- [dbo].[proc_Update_AddNew]
-- [dbo].[proc_Update_Delete]
--kadangi pastarosios naudoja sios paskutinius stulpelius (Claims_C,Claims_C2)
-- =============================================
ALTER PROCEDURE [dbo].[proc_Finances]
@AccountID int
AS
BEGIN
SET NOCOUNT ON
SELECT f.ID,f.ClaimID,f.Amount,dbo.fn_strDate(f.Date) Date,isnull(f.Purpose,'') Purpose, isnull(f.Note,'') Note,f.FinancesTypeID, ua.UserID, dbo.fn_strDate(ua.Date) EntryDate,
CASE WHEN doc.No IS NULL  then '' ELSE '('+cast(doc.No as varchar(10))+')' END Docs
	FROM tblFinances f
JOIN tblClaims c on f.ClaimID=c.ID
JOIN tblAccidents acc on c.AccidentID=acc.ID
JOIN tblUsersActivities_Updates ua on ua.RecordID=f.ID AND ua.TableID=(SELECT ID FROM tblObjects_ID WHERE tblName='tblFinances')

LEFT JOIN (SELECT count(*) No, ActivityID FROM tblDocsInFin GROUP BY ActivityID) doc ON f.ID=doc.ActivityID

WHERE acc.AccountID=@AccountID and ua.Action=0 and ua.TableID=(SELECT ID FROM tblObjects_ID WHERE tblName='tblFinances')
and c.IsDeleted=0 and f.IsDeleted=0 ORDER by ua.Date desc
END
GO
-----------------------------------------------------------



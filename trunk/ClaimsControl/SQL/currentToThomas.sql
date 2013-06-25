
------------------1.019 local --------------------------------------------------------------------------------------------------
USE [ClaimsControl]
GO
/****** Object:  StoredProcedure [dbo].[proc_Accidents]    Script Date: 06/23/2013 20:13:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	[dbo].[proc_Accidents] 2,74
--Pasikeitus sios sproc iseinantiems duomenimis reikia atitinkamai pakeist:
-- [dbo].[proc_Update_AddNew]
-- [dbo].[proc_Update_Delete]
--kadangi pastarosios naudoja sios paskutinius stulpelius (Claims_C,Claims_C2)
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
	datediff(d,A.Date,getdate()) DaysFrom, isnull(doc.No,0) DocNo, isnull(CC.ClaimTypeID,'') Claims_TypeID	

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
	datediff(d,A.Date,getdate()) DaysFrom, isnull(doc.No,0) DocNo, isnull(CC.ClaimTypeID,'') Claims_TypeID	
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





USE [ClaimsControl]
GO
ALTER TABLE tblDocs DROP COLUMN FileName
GO
/****** Object:  Table [dbo].[tblActivity]    Script Date: 05/05/2013 16:59:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblActivities](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ClaimID] [int] NOT NULL,
	[ActivityTypeID] [int] NOT NULL,
	[FromText] [nvarchar](500) NULL,
	[FromID] [int] NULL,
	[ToText] [nvarchar](500) NULL,
	[ToID] [int] NULL,
	[Subject] [nvarchar](200) NULL,
	[Body] [nvarchar](max) NULL,
	[DueDate] [date] NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_tblActivities] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[tblActivities] ADD  CONSTRAINT [DF_tblActivity_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO

--Atsiþymim apie naujas lenteles------------------------
ALTER TABLE tblObjects_ID DROP COLUMN tblID_trinti
GO
INSERT INTO tblObjects_ID(tblName,Date)
VALUES('tblActivities', GETDATE()),--48
('tblFinances', GETDATE()),--49
('tblFinTypes', GETDATE()--50)
GO
--Indeksuojam----------------------------
CREATE INDEX IX_tblUsersActivities_Updates_TableID ON tblUsersActivities_Updates (TableID)
GO
CREATE INDEX IX_tblUsersActivities_Updates_RecordID ON tblUsersActivities_Updates (RecordID)
GO

--pridedam tipus-------------------------
ALTER TABLE dbo.tblActivities ADD CONSTRAINT FK_tblActivity_tblActivityTypes FOREIGN KEY(ActivityTypeID)REFERENCES tblActivityTypes(ID) 
GO
INSERT INTO tblActivityTypes(ActivityType)
VALUES('MailSend'),('MailUpload'),('Task'),('Phone'),('Meeting'),('Note')
GO

--------------
ALTER TABLE dbo.tblActivities ADD CONSTRAINT FK_tblActivity_tblClaims FOREIGN KEY(ClaimID)REFERENCES tblClaims(ID) 
GO

-------------------
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblDocsInActivity](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ActivityID] [int] NOT NULL,
	[DocID] [int] NOT NULL,
 CONSTRAINT [PK_tblDocsInActivity] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
CREATE INDEX IX_tblDocsInActivity_ActivityID ON tblDocsInActivity (ActivityID)
GO
--------------------
ALTER TABLE dbo.tblDocsInActivity ADD CONSTRAINT FK_tblDocsInActivity_tblActivity FOREIGN KEY(ActivityID)REFERENCES tblActivities(ID) 
GO
ALTER TABLE dbo.tblDocsInActivity ADD CONSTRAINT FK_tblDocsInActivity_tblDocs FOREIGN KEY(DocID)REFERENCES tblDocs(ID) 
GO

--------------
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Að
-- Create date: long ago
-- Description:	[dbo].[proc_Activities] 2
-- FromID mostly same as UserID except in meeting and phone (there is from and toText)
--kadangi pastarosios naudoja sios paskutinius stulpelius (Claims_C,Claims_C2)
-- =============================================
CREATE PROCEDURE [dbo].[proc_Activities]
@AccountID int
AS
BEGIN
SET NOCOUNT ON
SELECT a.ID,a.ClaimID,a.ActivityTypeID,isnull(a.FromText,'') FromText,ISNULL(a.FromID,'') FromID,isnull(a.ToText,'') ToText,
isnull(a.ToID,'')ToID,isnull(a.Subject,'') Subject,isnull(a.Body,'')Body,dbo.fn_strDate(DueDate) DueDate,ua.UserID,
dbo.fn_strDate(ua.Date) EntryDate, CASE WHEN doc.No IS NULL  then '' ELSE '('+cast(doc.No as varchar(10))+')' END Docs-- isnull(doc.No,'') Docs
	FROM tblActivities a
JOIN tblClaims c on a.ClaimID=c.ID
JOIN tblAccidents acc on c.AccidentID=acc.ID
JOIN tblUsersActivities_Updates ua on ua.RecordID=a.ID AND ua.TableID=(SELECT ID FROM tblObjects_ID WHERE tblName='tblActivities')
LEFT JOIN (SELECT count(*) No, ActivityID FROM tblDocsInActivity GROUP BY ActivityID) doc ON a.ID=doc.ActivityID
WHERE acc.AccountID=@AccountID and ua.Action=0 and ua.TableID=(SELECT ID FROM tblObjects_ID WHERE tblName='tblActivities')
and c.IsDeleted=0 and a.IsDeleted=0 ORDER BY ua.Date desc
END
GO
---------------------------------------------tblClaimFin ir pan-----------------------------------------------------------------
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblFinances](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ClaimID] [int] NOT NULL,
	[Amount] [float] NOT NULL,
	[Date] [date] NULL,
	[Purpose] [nvarchar](200) NULL,
	[Note] [nvarchar](max) NULL,
	[FinancesTypeID] [int] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_tblFinances] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[tblFinTypes](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_tblFinancesTypes] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
---------------------------------------------
INSERT INTO tblFinTypes(Name)
VALUES('Sàskaita'),('Nuraðymo aktas'),('Þala turtui'),('Þala asmeniui'),('Iðmoka'),('Kompensacija nuketëjusiam'),('Kaltininko kompensacija')
GO
---------------------------------------------

ALTER TABLE [dbo].[tblFinances]  WITH CHECK ADD  CONSTRAINT [FK_tblClaimFin_tblClaimFinTypes] FOREIGN KEY([FinancesTypeID])
REFERENCES [dbo].[tblFinTypes] ([ID])
GO
ALTER TABLE [dbo].[tblFinances] CHECK CONSTRAINT [FK_tblClaimFin_tblClaimFinTypes]
GO
ALTER TABLE [dbo].[tblFinances]  WITH CHECK ADD  CONSTRAINT [FK_tblClaimFin_tblClaims] FOREIGN KEY([ClaimID])
REFERENCES [dbo].[tblClaims] ([ID])
GO
ALTER TABLE [dbo].[tblFinances] CHECK CONSTRAINT [FK_tblClaimFin_tblClaims]
GO

CREATE TABLE [dbo].[tblDocsInFin](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FinID] [int] NOT NULL,
	[DocID] [int] NOT NULL,
 CONSTRAINT [PK_tblDocsInFin] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [dbo].[tblDocsInFin]  WITH CHECK ADD  CONSTRAINT [FK_tblDocsInFin_tblClaimFin] FOREIGN KEY([FinID])
REFERENCES [dbo].[tblFinances] ([ID])
GO
ALTER TABLE [dbo].[tblDocsInFin] CHECK CONSTRAINT [FK_tblDocsInFin_tblClaimFin]
GO
ALTER TABLE [dbo].[tblDocsInFin]  WITH CHECK ADD  CONSTRAINT [FK_tblDocsInFin_tblDocs] FOREIGN KEY([DocID])
REFERENCES [dbo].[tblDocs] ([ID])
GO
ALTER TABLE [dbo].[tblDocsInFin] CHECK CONSTRAINT [FK_tblDocsInFin_tblDocs]
GO

CREATE PROCEDURE [dbo].[proc_Finances]
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

LEFT JOIN (SELECT count(*) No, FinID FROM tblDocsInFin GROUP BY FinID) doc ON f.ID=doc.FinID

WHERE acc.AccountID=@AccountID and ua.Action=0 and ua.TableID=(SELECT ID FROM tblObjects_ID WHERE tblName='tblFinances')
and c.IsDeleted=0 and f.IsDeleted=0 ORDER by ua.Date desc
END
GO
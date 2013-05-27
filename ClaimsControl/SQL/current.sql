

------------------1.019 local --------------------------------------------------------------------------------------------------
USE [ClaimsControl]
GO
/****** Object:  Table [dbo].[tblActivity]    Script Date: 05/05/2013 16:59:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblActivity](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ClaimID] [int] NOT NULL,
	[ActivityTypeID] [int] NOT NULL,
	[FromText] [nvarchar](500) NULL,
	[From] [int] NULL,
	[ToText] [nvarchar](500) NULL,
	[To] [int] NULL,
	[Subject] [nvarchar](200) NULL,
	[Body] [nvarchar](max) NULL,
	[DueDate] [date] NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_tblActivity] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
CREATE TABLE [dbo].[tblClaimDamage](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ClaimID] [int] NOT NULL,
	[Amount] [float] NOT NULL,
	[Purpose] [nvarchar](200) NOT NULL,
	[Note] [nvarchar](max) NULL,
	[Type] [int] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_tblClaimDamage] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
CREATE TABLE [dbo].[tblClaimCompensation](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ClaimID] [int] NOT NULL,
	[Date] [date] NOT NULL,
	[Amount] [float] NOT NULL,
	[Note] [nchar](10) NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_tblClaimCompensation] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[tblActivity] ADD  CONSTRAINT [DF_tblActivity_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[tblClaimDamage] ADD  CONSTRAINT [DF_tblClaimDamage_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[tblClaimCompensation] ADD  CONSTRAINT [DF_tblClaimCompensation_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO



--Atsiþymim apie naujas lenteles
ALTER TABLE tblObjects_ID DROP COLUMN tblID_trinti
GO
INSERT INTO tblObjects_ID(tblName,Date)
VALUES('tblActivity', GETDATE()),--48
('tblClaimDamage', GETDATE()),--49
('tblClaimCompensation', GETDATE()--50)
GO
--Indeksuojam
CREATE INDEX IX_tblUsersActivities_Updates_TableID ON tblUsersActivities_Updates (TableID)
GO
CREATE INDEX IX_tblUsersActivities_Updates_RecordID ON tblUsersActivities_Updates (RecordID)
GO

--pridedam tipus
ALTER TABLE dbo.tblActivity ADD CONSTRAINT FK_tblActivity_tblActivityTypes FOREIGN KEY(ActivityTypeID)REFERENCES tblActivityTypes(ID) 
GO
INSERT INTO tblActivityTypes(ActivityType)
VALUES('MailSend'),('MailUpload'),('Task'),('Phone'),('Meeting'),('Note')
GO

ALTER TABLE dbo.tblActivity ADD CONSTRAINT FK_tblActivity_tblClaims FOREIGN KEY(ClaimID)REFERENCES tblClaims(ID) 
GO
ALTER TABLE dbo.tblClaimDamage ADD CONSTRAINT FK_tblClaimDamage_tblClaims FOREIGN KEY(ClaimID)REFERENCES tblClaims(ID) 
GO
ALTER TABLE dbo.tblClaimCompensation ADD CONSTRAINT FK_tblClaimCompensation_tblClaims FOREIGN KEY(ClaimID)REFERENCES tblClaims(ID) 
GO

SELECT * FROM tblUsersActivities_Updates WHERE Action=0 AND

SELECT * FROM tblUsersActivities_Updates WHERE Action=0 AND TableID IN (48,49,50)

------------------1.018 no updates --------------------------------------------------------------------------------------------------
------------------1.017 no updates --------------------------------------------------------------------------------------------------
------------------1.016 local local and ClaimsControl --------------------------------------------------------------------------------------------------
ALTER TABLE tblClaims ADD DateNotification date NULL
ALTER TABLE tblClaims ADD DateDocsSent date NULL
------------------1.015 no updates --------------------------------------------------------------------------------------------------
------------------1.014 local and ClaimsControl --------------------------------------------------------------------------------------------------
proc_Update_Edit
proc_Update_AddNew
------------------1.013 local and ClaimsControl --------------------------------------------------------------------------------------------------
[dbo].[proc_InsPolicies]
------------------1.012 local and ClaimsControl --------------------------------------------------------------------------------------------------
[dbo].[proc_Vehicles]
[dbo].[proc_Drivers]
[dbo].[proc_Update_Delete]
------------------1.011 local --------------------------------------------------------------------------------------------------

------------------1.010 local and ClaimsControl--------------------------------------------------------------------------------------------------
--ALTER TABLE tblDrivers DROP COLUMN DrivingCategory 
--sp_RENAME 'tblDrivers.[DateExpierence]' , 'DateBorn', 'COLUMN'
--UPDATE tblDrivers SET DateBorn='1970-05-16' where DateBorn is null
--ALTER TABLE tblDrivers ALTER COLUMN DateBorn date NOT NULL
--ALTER TABLE tblDrivers ALTER COLUMN EndDate date NULL
--DROP INDEX tblDrivers.IX_tblDrivers_FullName
--UPDATE tblDrivers SET FirstName='Vardenis'+cast(id as varchar(4)) WHERE FirstName is null
--UPDATE tblDrivers SET LastName='Pavardenis'+cast(id as varchar(4)) WHERE LastName is null
--ALTER TABLE tblDrivers ALTER COLUMN FirstName nvarchar(200) NOT NULL
--ALTER TABLE tblDrivers ALTER COLUMN LastName nvarchar(200) NOT NULL
--ALTER TABLE tblDrivers ADD CONSTRAINT ucDrivers UNIQUE (FirstName,LastName,DateBorn,AccountID)
--ALTER TABLE tblDrivers ADD NotUnique bit NOT NULL CONSTRAINT dcNotUnique DEFAULT 0

--proc_Drivers dar pridët
--visos 3 updatinimo proceduros

--sp_RENAME 'tblObjects_Lang.[MsgLT]' , 'Msg', 'COLUMN'
--ALTER TABLE tblObjects_Lang ADD LanguageID int NOT NULL DEFAULT 1
--ALTER TABLE tblObjects_Lang ADD CONSTRAINT ucReference UNIQUE (ReferenceKey,LanguageID)
--sp_rename 'tblObjects_Lang', 'tblUserMsg'
--alter table tblUserMsg add constraint FK_tblUserMsg_tblLanguage FOREIGN KEY (LanguageID) REFERENCES tblLanguage(ID)

--INSERT INTO tblUserMsg
--SELECT 10,'IX_tblUsers_Email','Ðis el. paðto adresas(''{{}}'') jau yra priskirtas kitam naudotojui.',1--DescID þymiu 10 naujus ir patikrintus
--INSERT INTO tblUserMsg
--SELECT 10,'IX_tblUsers_Email_anotherAccount','Ðis el. paðto adresas(''{{}}'') jau yra naudojamas kitos ámonës paskyroje.',1
--INSERT INTO tblUserMsg
--SELECT 10,'ucDrivers','Jau yra ávestas vairuotojas su tokiu paèiu vardu, pavarde ir gimimo data.',1
--INSERT INTO tblUserMsg
--SELECT 10,'IX_tblAccounts_Email','Toks e-paðto adresas(''{{}}'') jau yra naudojamas. Pasirinkite kità.',1

--DROP INDEX tblVehicles.IX_tblVehicles_Plate
--CREATE UNIQUE NONCLUSTERED INDEX [IX_tblVehicles_Plate] ON [dbo].[tblVehicles] ([Plate] ASC,[AccountID] ASC)
--WHERE [IsDeleted] = 0
--WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
--INSERT INTO tblUserMsg
--SELECT 10,'IX_tblVehicles_Plate','Transporto priemonë tokiu valstybiniu numeriu(''{{}}'') jau yra ávesta.',1

-------------------------------------------------------------------------------------------------------------------------------------
--SELECT * FROM tblDocGroups
--UPDATE tblDocGroups SET Name='Transporto priemoniø dokumentai' WHERE Name='TP Dokumentai'
--SELECT * FROM tblAccidents WHERE AccountID=3
----SELECT * FROM tblDocsInAccident WHERE AccidentID IN (SELECT ID FROM tblAccidents WHERE AccountID=3)
--SELECT * FROM [ClaimsControl].[dbo].[tblDocs] WHERE UserID IN (Select ID from tblUsers WHERE AccountID=3)
--Select * from tblDrivers WHERE AccountID=3
--Select * from tblVehicles WHERE AccountID=3
--SELECT * FROM tblVehicleTypes
--UPDATE tblDocGroups SET Name='Transporto priemoniø dokumentai' WHERE Name='TP Dokumentai'
--UPDATE tblVehicleTypes SET Name='Priekaba, puspriekabë' WHERE ID=2--Furgonas
--UPDATE tblVehicleTypes SET Name='Krovininis automobilis' WHERE ID=3--Savivartis
--UPDATE tblVehicleTypes SET Name='Lengvasis automobilis' WHERE ID=4--Puspriekabë
--UPDATE tblVehicleTypes SET Name='Autobusas' WHERE ID=5--Priekaba
--UPDATE tblVehicles SET TypeID=1 WHERE TypeID IN(6,7,8)
--DELETE FROM tblVehicleTypes WHERE ID IN(6,7,8)

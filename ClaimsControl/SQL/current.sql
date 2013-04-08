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



SELECT * FROM [ClaimsControl].[dbo].[tblUserMsg]

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

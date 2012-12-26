USE [ClaimsControl]
GO

/****** Object:  Index [IX_tblUsers_Email]    Script Date: 12/26/2012 15:28:05 ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[tblUsers]') AND name = N'IX_tblUsers_Email')
DROP INDEX [IX_tblUsers_Email] ON [dbo].[tblUsers] WITH ( ONLINE = OFF );

/****** Object:  Index [IX_tblAccounts_Email]    Script Date: 12/26/2012 15:46:11 ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[tblAccounts]') AND name = N'IX_tblAccounts_Email')
DROP INDEX [IX_tblAccounts_Email] ON [dbo].[tblAccounts] WITH ( ONLINE = OFF );

IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[tblDrivers]') AND name = N'IX_tblDrivers_FullName')
DROP INDEX [IX_tblDrivers_FullName] ON [dbo].[tblDrivers] WITH ( ONLINE = OFF )

/****** Object:  Index [IX_tblVehicles_Plate]    Script Date: 12/26/2012 16:34:08 ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[tblVehicles]') AND name = N'IX_tblVehicles_Plate')
DROP INDEX [IX_tblVehicles_Plate] ON [dbo].[tblVehicles] WITH ( ONLINE = OFF )
GO

USE [ClaimsControl]
GO

/****** Object:  Index [IX_tblUsers_Email]    Script Date: 12/26/2012 15:28:05 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_tblUsers_Email] ON [dbo].[tblUsers] ([Email] ASC)
WHERE [IsDeleted] = 0
WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, 
      DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY];
      
/****** Object:  Index [IX_tblAccounts_Email]    Script Date: 12/26/2012 15:46:11 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_tblAccounts_Email] 
ON [dbo].[tblAccounts] ([Email] ASC)
WHERE [Email] IS NOT NULL
WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, 
      DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY];

/****** Object:  Index [IX_tblDrivers_FullName]    Script Date: 12/26/2012 16:14:14 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_tblDrivers_FullName] ON [dbo].[tblDrivers] 
(
	[FirstName] ASC,
	[LastName] ASC,
	[AccountID] ASC
)
WHERE [IsDeleted] = 0
WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, 
      DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY];

/****** Object:  Index [IX_tblVehicles_Plate]    Script Date: 12/26/2012 16:34:08 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_tblVehicles_Plate] ON [dbo].[tblVehicles] ([Plate] ASC)
WHERE [IsDeleted] = 0
WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
GO



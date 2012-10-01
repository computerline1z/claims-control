/****** Object:  Table [dbo].[tblFileDescriptor]    Script Date: 09/30/2012 19:20:20 ******/
USE [ClaimsControl]
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
GO

IF  NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tblFileDescriptor]') AND type in (N'U'))
BEGIN
	CREATE TABLE [dbo].[tblFileDescriptor](
		[ID] [uniqueidentifier] NOT NULL,
		[MimeType] [nvarchar](50) NULL,
		[DateCreation] [datetime] NOT NULL,
		[DateModification] [datetime] NULL,
		[Icon] [image] NULL,
		[Owner] [uniqueidentifier] NOT NULL,
		[IsPublic] [bit] NOT NULL,
		[Path] [nvarchar](max) NOT NULL,
		[Version] [timestamp] NOT NULL,
	CONSTRAINT [PK_FileDescriptor] PRIMARY KEY CLUSTERED 
	(
		[ID] ASC
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];

	ALTER TABLE [dbo].[tblFileDescriptor]  WITH NOCHECK ADD  CONSTRAINT [CK_tblFileDescriptor] CHECK NOT FOR REPLICATION (([dbo].[fn_Check_User_ID]([Owner])=(1)))
	ALTER TABLE [dbo].[tblFileDescriptor] CHECK CONSTRAINT [CK_tblFileDescriptor]
	ALTER TABLE [dbo].[tblFileDescriptor] ADD  CONSTRAINT [DF_FileDescriptor_ID]  DEFAULT (newid()) FOR [ID]
END

GO



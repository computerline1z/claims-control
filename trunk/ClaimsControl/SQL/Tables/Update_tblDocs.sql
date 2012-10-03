USE [ClaimsControl]
DECLARE @TableID [INT], 
        @ColumnMaxLength [INT],
        @IsNullable [BIT];

SELECT @TableID = OBJECT_ID(N'DBO.tblDocs');

-- Pakeisti vardo ilgá (PATH ant serverio gali bûti pakankamai ilgas).
SELECT @ColumnMaxLength = max_length FROM sys.columns 
WHERE object_id = @TableID AND [name] LIKE 'FileName';
IF @ColumnMaxLength > 0 AND @ColumnMaxLength <= 300
	ALTER TABLE dbo.tblDocs ALTER COLUMN [FileName] NVARCHAR (MAX);
-- Mime tipui 5 simboliø nepakanka
SELECT @ColumnMaxLength = max_length FROM sys.columns 
WHERE object_id = @TableID AND [name] LIKE 'FileType';
IF @ColumnMaxLength < 50
	ALTER TABLE dbo.tblDocs ALTER COLUMN [FileType] NVARCHAR (128);
-- Mime tipui 5 simboliø nepakanka
SELECT @IsNullable = is_nullable FROM sys.columns 
WHERE object_id = @TableID AND [name] LIKE 'RefID';
IF @IsNullable = 0
	ALTER TABLE dbo.tblDocs ALTER COLUMN [RefID] INT;

-- Nauji laukai
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = @TableID AND [name] LIKE 'Icon')
BEGIN
	ALTER TABLE dbo.tblDocs ADD [Icon] [image] NULL;
	ALTER TABLE dbo.tblDocs ADD [IsPublic] [bit] NOT NULL DEFAULT 0;
	ALTER TABLE dbo.tblDocs ADD [Version] [timestamp] NOT NULL;
END

-- Papildomas Foreign_key
UPDATE [dbo].[tblDocs] SET [RefID] = NULL
FROM [dbo].[tblDocs] dc
WHERE dc.[RefID] IS NOT NULL AND
	  NOT EXISTS (SELECT * FROM [dbo].[tblDocs] parent WHERE parent.[ID] = dc.[RefID]);
IF NOT EXISTS (
	SELECT * FROM sys.foreign_keys 
	WHERE object_id = OBJECT_ID(N'FK_tblDocs_tblDocs') AND parent_object_id = @TableID
	)
BEGIN
	ALTER TABLE [dbo].[tblDocs]  WITH CHECK 
		ADD  CONSTRAINT [FK_tblDocs_tblDocs] FOREIGN KEY([RefID])
		REFERENCES [dbo].[tblDocs] ([ID]);
END
GO

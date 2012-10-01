USE [ClaimsControl]
GO

/****** Object:  UserDefinedFunction [dbo].[fn_Check_User_ID]    Script Date: 09/30/2012 19:03:33 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fn_Check_User_ID]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[fn_Check_User_ID]
GO

USE [ClaimsControl]
GO

/****** Object:  UserDefinedFunction [dbo].[fn_Check_User_ID]    Script Date: 09/30/2012 19:03:33 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Gediminas Bukauskas	
-- Create date: 2012-09-30
-- Description:	Return count of records in the [ClaimsControlUsers].[dbo].[aspnet_Users] table.
-- =============================================
CREATE FUNCTION [dbo].[fn_Check_User_ID]
(
	@UserId [uniqueidentifier]
)
RETURNS INT
AS
BEGIN
	DECLARE @ResultVar [int];

	SELECT @ResultVar = COUNT(*)
	FROM [ClaimsControlUsers].[dbo].[aspnet_Users] usr
	WHERE usr.[UserId] = @UserId;

	RETURN @ResultVar

END

GO



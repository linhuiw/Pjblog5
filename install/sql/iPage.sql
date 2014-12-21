Create PROC iPage
-- Add the parameters for the stored procedure here
@TableName VARCHAR(200),     --表名
@FieldList VARCHAR(2000),    --显示列名，如果是全部字段则为*
@PrimaryKey VARCHAR(100),    --单一主键或唯一值键
@Where VARCHAR(2000),        --查询条件 不含'where'字符，如id>10 and len(userid)>9
@Order VARCHAR(1000),        --排序 不含'order by'字符，如id asc,userid desc，必须指定asc或desc
--注意当@SortType=3时生效，记住一定要在最后加上主键，否则会让你比较郁闷
@SortType INT,               --排序规则 1:正序asc 2:倒序desc 3:多列排序方法
@RecorderCount INT,          --记录总数 0:会返回总记录
@PageSize INT,               --每页输出的记录数
@PageIndex INT,              --当前页数
@TotalCount INT OUTPUT,      --记返回总记录
@TotalPageCount INT OUTPUT   --返回总页数
AS
-- SET NOCOUNT ON added to prevent extra result sets from
-- interfering with SELECT statements.
SET NOCOUNT ON
IF ISNULL(@TotalCount,'') = '' SET @TotalCount = 0
SET @Order = RTRIM(LTRIM(@Order))
SET @PrimaryKey = RTRIM(LTRIM(@PrimaryKey))
SET @FieldList = REPLACE(RTRIM(LTRIM(@FieldList)),' ','')
WHILE CHARINDEX(', ',@Order) > 0 OR CHARINDEX(' ,',@Order) > 0
BEGIN
SET @Order = REPLACE(@Order,', ',',')
SET @Order = REPLACE(@Order,' ,',',')
END
IF ISNULL(@TableName,'') = '' OR ISNULL(@FieldList,'') = ''
OR ISNULL(@PrimaryKey,'') = ''
OR @SortType < 1 OR @SortType >3
OR @RecorderCount < 0 OR @PageSize < 0 OR @PageIndex < 0
BEGIN
   PRINT('ERR_00参数错误')
   RETURN
END
IF @SortType = 3
BEGIN
IF (UPPER(RIGHT(@Order,4))!=' ASC' AND UPPER(RIGHT(@Order,5))!=' DESC')
BEGIN
   PRINT('ERR_02排序错误') RETURN END
END
DECLARE @new_where1 VARCHAR(1000)
DECLARE @new_where2 VARCHAR(1000)
DECLARE @new_order1 VARCHAR(1000)
DECLARE @new_order2 VARCHAR(1000)
DECLARE @new_order3 VARCHAR(1000)
DECLARE @Sql VARCHAR(8000)
DECLARE @SqlCount NVARCHAR(4000)
IF ISNULL(@where,'') = ''
BEGIN
SET @new_where1 = ' '
SET @new_where2 = ' WHERE '
END
ELSE
BEGIN
SET @new_where1 = ' WHERE ' + @where
SET @new_where2 = ' WHERE ' + @where + ' AND '
END
IF ISNULL(@order,'') = '' OR @SortType = 1 OR @SortType = 2
BEGIN
IF @SortType = 1
   BEGIN
   SET @new_order1 = ' ORDER BY ' + @PrimaryKey + ' ASC'
   SET @new_order2 = ' ORDER BY ' + @PrimaryKey + ' DESC'
   END
IF @SortType = 2
   BEGIN
   SET @new_order1 = ' ORDER BY ' + @PrimaryKey + ' DESC'
   SET @new_order2 = ' ORDER BY ' + @PrimaryKey + ' ASC'
   END
END
ELSE
BEGIN
SET @new_order1 = ' ORDER BY ' + @Order
END
IF @SortType = 3 AND CHARINDEX(','+@PrimaryKey+' ',','+@Order)>0
BEGIN
SET @new_order1 = ' ORDER BY ' + @Order
SET @new_order2 = @Order + ','
SET @new_order2 = REPLACE(REPLACE(@new_order2,'ASC,','{ASC},'),'DESC,','{DESC},')
SET @new_order2 = REPLACE(REPLACE(@new_order2,'{ASC},','DESC,'),'{DESC},','ASC,')
SET @new_order2 = ' ORDER BY ' + SUBSTRING(@new_order2,1,LEN(@new_order2)-1)
IF @FieldList <> '*'
   BEGIN
   SET @new_order3 = REPLACE(REPLACE(@Order + ',','ASC,',','),'DESC,',',')
   SET @FieldList = ',' + @FieldList
   WHILE CHARINDEX(',',@new_order3)>0
    BEGIN
    IF CHARINDEX(SUBSTRING(','+@new_order3,1,CHARINDEX(',',@new_order3)),','+@FieldList+',')>0
     BEGIN
     SET @FieldList =
     @FieldList + ',' + SUBSTRING(@new_order3,1,CHARINDEX(',',@new_order3))
     END
    SET @new_order3 = SUBSTRING(@new_order3,CHARINDEX(',',@new_order3)+1,LEN(@new_order3))
    END
   SET @FieldList = SUBSTRING(@FieldList,2,LEN(@FieldList))
   END
END
SET @SqlCount = 'SELECT @TotalCount=COUNT(*),@TotalPageCount=CEILING((COUNT(*)+0.0)/'
+ CAST(@PageSize AS VARCHAR)+') FROM ' + @TableName + @new_where1
IF @RecorderCount = 0
BEGIN
EXEC SP_EXECUTESQL @SqlCount,N'@TotalCount INT OUTPUT,@TotalPageCount INT OUTPUT',
@TotalCount OUTPUT,@TotalPageCount OUTPUT
END
ELSE
BEGIN
SELECT @TotalCount = @RecorderCount
END
IF @PageIndex > CEILING((@TotalCount+0.0)/@PageSize)
BEGIN
SET @PageIndex = CEILING((@TotalCount+0.0)/@PageSize)
END
IF @PageIndex = 1 OR @PageIndex >= CEILING((@TotalCount+0.0)/@PageSize)
BEGIN
IF @PageIndex = 1 --返回第一页数据
   BEGIN
   SET @Sql = 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM '
   + @TableName + @new_where1 + @new_order1
   END
IF @PageIndex >= CEILING((@TotalCount+0.0)/@PageSize) --返回最后一页数据
   BEGIN
   SET @Sql = 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM ('
   + 'SELECT TOP ' + STR(ABS(@PageSize*@PageIndex-@TotalCount-@PageSize))
   + ' ' + @FieldList + ' FROM '
   + @TableName + @new_where1 + @new_order2 + ' ) AS TMP '
   + @new_order1
   END
END
ELSE
BEGIN
IF @SortType = 1 --仅主键正序排序
   BEGIN
   IF @PageIndex <= CEILING((@TotalCount+0.0)/@PageSize)/2 --正向检索
    BEGIN
    SET @Sql = 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM '
    + @TableName + @new_where2 + @PrimaryKey + ' > '
    + '(SELECT MAX(' + @PrimaryKey + ') FROM (SELECT TOP '
    + STR(@PageSize*(@PageIndex-1)) + ' ' + @PrimaryKey
    + ' FROM ' + @TableName
    + @new_where1 + @new_order1 +' ) AS TMP) '+ @new_order1
    END
   ELSE --反向检索
    BEGIN
    SET @Sql = 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM ('
    + 'SELECT TOP ' + STR(@PageSize) + ' '
    + @FieldList + ' FROM '
    + @TableName + @new_where2 + @PrimaryKey + ' < '
    + '(SELECT MIN(' + @PrimaryKey + ') FROM (SELECT TOP '
    + STR(@TotalCount-@PageSize*@PageIndex) + ' ' + @PrimaryKey
    + ' FROM ' + @TableName
    + @new_where1 + @new_order2 +' ) AS TMP) '+ @new_order2
    + ' ) AS TMP ' + @new_order1
    END
   END
IF @SortType = 2 --仅主键反序排序
   BEGIN
   IF @PageIndex <= CEILING((@TotalCount+0.0)/@PageSize)/2 --正向检索
    BEGIN
    SET @Sql = 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM '
    + @TableName + @new_where2 + @PrimaryKey + ' < '
    + '(SELECT MIN(' + @PrimaryKey + ') FROM (SELECT TOP '
    + STR(@PageSize*(@PageIndex-1)) + ' ' + @PrimaryKey
    +' FROM '+ @TableName
    + @new_where1 + @new_order1 + ') AS TMP) '+ @new_order1
    END
   ELSE --反向检索
    BEGIN
    SET @Sql = 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM ('
    + 'SELECT TOP ' + STR(@PageSize) + ' '
    + @FieldList + ' FROM '
    + @TableName + @new_where2 + @PrimaryKey + ' > '
    + '(SELECT MAX(' + @PrimaryKey + ') FROM (SELECT TOP '
    + STR(@TotalCount-@PageSize*@PageIndex) + ' ' + @PrimaryKey
    + ' FROM ' + @TableName
    + @new_where1 + @new_order2 +' ) AS TMP) '+ @new_order2
    + ' ) AS TMP ' + @new_order1
    END
   END
IF @SortType = 3 --多列排序，必须包含主键，且放置最后，否则不处理
   BEGIN
   IF CHARINDEX(',' + @PrimaryKey + ' ',',' + @Order) = 0
    BEGIN
    PRINT('ERR_02') RETURN
    END
   IF @PageIndex <= CEILING((@TotalCount+0.0)/@PageSize)/2 --正向检索
    BEGIN
    SET @Sql = 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM ( '
    + 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM ( '
    + ' SELECT TOP ' + STR(@PageSize*@PageIndex) + ' ' + @FieldList
    + ' FROM ' + @TableName + @new_where1 + @new_order1 + ' ) AS TMP '
    + @new_order2 + ' ) AS TMP ' + @new_order1
    END
   ELSE --反向检索
    BEGIN
    SET @Sql = 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM ( '
    + 'SELECT TOP ' + STR(@PageSize) + ' ' + @FieldList + ' FROM ( '
    + ' SELECT TOP ' + STR(@TotalCount-@PageSize *@PageIndex+@PageSize) + ' ' + @FieldList
    + ' FROM ' + @TableName + @new_where1 + @new_order2 + ' ) AS TMP '
    + @new_order1 + ' ) AS TMP ' + @new_order1
    END
   END
END
EXEC(@Sql)
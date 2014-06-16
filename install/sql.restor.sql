RESTORE DATABASE blog
 FROM DISK='E:\CodeProgress\Pjblog5\install\blog.common.bak', DISK='E:\CodeProgress\Pjblog5\install\blog.system.bak' with replace,  
  move   'blog'   to   'D:\Program Files (x86)\MsSQLServer Example\MSSQL10.MSSQLSERVER\MSSQL\DATA\blog.mdf',  
  move   'blog_log'   to   'D:\Program Files (x86)\MsSQLServer Example\MSSQL10.MSSQLSERVER\MSSQL\DATA\blog_log.ldf'
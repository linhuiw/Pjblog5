CREATE TABLE [blog_comments](
	[id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[com_article_id] [int] NULL,
	[com_member_id] [int] NULL,
	[com_content] [ntext] NULL,
	[com_root] [int] NULL,
	[com_parent] [int] NULL,
	[com_postdate] [datetime] NULL,
	[com_username] [varchar](255) NULL,
	[com_usermail] [varchar](255) NULL,
	[com_usersite] [varchar](255) NULL,
	[com_ispassed] [bit] NULL
)

ALTER TABLE [blog_comments] ADD CONSTRAINT [DF_blog_comments_com_article_id]  DEFAULT ((0)) FOR [com_article_id]
ALTER TABLE [blog_comments] ADD CONSTRAINT [DF_blog_comments_com_member_id]  DEFAULT ((0)) FOR [com_member_id]
ALTER TABLE [blog_comments] ADD CONSTRAINT [DF_blog_comments_com_root]  DEFAULT ((0)) FOR [com_root]
ALTER TABLE [blog_comments] ADD CONSTRAINT [DF_blog_comments_com_parent]  DEFAULT ((0)) FOR [com_parent]
ALTER TABLE [blog_comments] ADD CONSTRAINT [DF_blog_comments_com_ispassed] DEFAULT ((1)) FOR [com_ispassed]
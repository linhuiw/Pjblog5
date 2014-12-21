CREATE TABLE [{$tb}links](
	[id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[link_name] [varchar](255) NULL,
	[link_des] [ntext] NULL,
	[link_src] [ntext] NULL,
	[link_type] [int] NULL,
	[link_hide] [bit] NULL,
	[link_index] [bit] NULL,
	[link_icon] [ntext] NULL
)

ALTER TABLE [{$tb}links] ADD  CONSTRAINT [DF_{$tb}links_link_type]  DEFAULT ((0)) FOR [link_type]
ALTER TABLE [{$tb}links] ADD  CONSTRAINT [DF_{$tb}links_link_hide]  DEFAULT ((0)) FOR [link_hide]
ALTER TABLE [{$tb}links] ADD  CONSTRAINT [DF_{$tb}links_link_index]  DEFAULT ((0)) FOR [link_index]
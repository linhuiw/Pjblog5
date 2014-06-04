CREATE TABLE blog_articles ( id int(10) NOT NULL auto_increment,art_title varchar(255),art_des text(1073741823),art_category int(10) default '0',art_content text(1073741823),art_tags text(1073741823),art_draft bit default 0,art_tname varchar(255),art_postdate datetime,art_modifydate datetime,art_author int(10) default '0',art_comment_count int(10), PRIMARY KEY (id) );

CREATE TABLE blog_attments ( id int(10) NOT NULL auto_increment,att_des text(1073741823),att_type varchar(50),att_src text(1073741823), PRIMARY KEY (id) );

CREATE TABLE blog_categorys ( id int(10) NOT NULL auto_increment,cate_name varchar(255),cate_des text(1073741823),cate_count int(10) default '0',cate_parent int(10) default '0',cate_src text(1073741823),cate_outlink bit default 0, PRIMARY KEY (id) );

CREATE TABLE blog_code ( id int(10) NOT NULL auto_increment,code_name varchar(255),code_des text(1073741823),code_status bit default 0, PRIMARY KEY (id) );

CREATE TABLE blog_comments ( id int(10) NOT NULL auto_increment,com_article_id int(10) default '0',com_member_id int(10) default '0',com_content text(1073741823),com_parent int(10) default '0',com_postdate datetime, PRIMARY KEY (id) );

CREATE TABLE blog_global ( id int(10) NOT NULL auto_increment,blog_name varchar(255),blog_title varchar(255),blog_des text(1073741823),blog_mail varchar(255),blog_copyright varchar(50),blog_keywords text(1073741823),blog_description text(1073741823),blog_theme varchar(255),blog_themename varchar(255),blog_thememail varchar(255),blog_themeweb text(1073741823),blog_themeversion varchar(255),blog_status int(10) default '0',blog_close bit default 0, PRIMARY KEY (id) );

insert into blog_global values ('1','PJBlog5','PJBlog 5 Beta','PJBlog5','contact@PJBlog5.com','','pjblog','pjblog','','','','','','0','0' );
CREATE TABLE blog_groups ( id int(10) NOT NULL auto_increment,group_mark varchar(50),group_name varchar(255),group_des text(1073741823),group_code text(1073741823), PRIMARY KEY (id) );

CREATE TABLE blog_links ( id int(10) NOT NULL auto_increment,link_name varchar(255),link_des text(1073741823),link_src text(1073741823),link_type int(10) default '0',link_hide bit default 0, PRIMARY KEY (id) );

CREATE TABLE blog_members ( id int(10) NOT NULL auto_increment,member_mark varchar(255),member_nick varchar(255),member_hashkey varchar(40),member_salt varchar(10),member_mail varchar(255),member_group varchar(50),member_comments int(10) default '0',member_messages int(10) default '0',member_forbit bit default 0, PRIMARY KEY (id) );

CREATE TABLE blog_messages ( id int(10) NOT NULL auto_increment,msg_member_id int(10),msg_content text(1073741823),msg_postdate datetime,msg_reply text(1073741823),msg_username varchar(255),msg_usermail varchar(255), PRIMARY KEY (id) );

CREATE TABLE blog_plugins ( id int(10) NOT NULL auto_increment,plu_mark varchar(255),plu_name varchar(255),plu_des text(1073741823),plu_author varchar(255),plu_mail varchar(255),plu_web text(1073741823),plu_version int(10) default '1',plu_folder varchar(255), PRIMARY KEY (id) );

CREATE TABLE blog_tags ( id int(10) NOT NULL auto_increment,tag_name varchar(255),tag_count int(10) default '0', PRIMARY KEY (id) );


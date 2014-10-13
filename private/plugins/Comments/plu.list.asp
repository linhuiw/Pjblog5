<%
	var page = http.query('page');
	if ( !page || page.length === 0 ){
		page = 1;
	};
	page = Number(page);
	if ( page < 1 ){
		page = 1;
	};
	
	var genre = http.query('g');
	if ( !genre || genre.length === 0 ){
		genre = 2;
	};
	genre = Number(genre);
	if ( genre < 0 || genre > 2 ){
		genre = 0;
	};
	
	var sql = '',
		dis = '';
	switch(genre)
	{
	case 0:
	  	sql = 'Select * From blog_comments Where com_root=0 And com_article_id>0 Order By com_postdate DESC';
		dis = '评论'
		break;
	case 1:
	  	sql = 'Select * From blog_comments Where com_root=0 And com_article_id=0 Order By com_postdate DESC';
		dis = '留言'
		break;
	default:
		sql = 'Select * From blog_comments Where com_ispassed=0 Order By com_postdate DESC';
		dis = '评论/留言'
	}
	
	// todo: 直接调用exports模块的getList
	var ModExports = require('private/plugins/' + pfolder + '/exports');
		ModExports.add('pid', pid);
	var Export = new ModExports();
		setting = Export.setting;

	var rec = new dbo.RecordSet(conn),
		data = {},
		keep = [],
		user = [],
		users = {},
		art = [],
		arts = {},
		date = require("date");
	
	rec
		.sql(sql)
		.open();

	var xes = rec.AdoPage(page, setting.back_perpage, function(object){
		data[object("id").value + ""] = {
			id: object("id").value,
			com_article_id: object("com_article_id").value,
			com_member_id: object("com_member_id").value,
			com_content: object("com_content").value,
			com_root: 0,
			com_postdate: new Date(object("com_postdate").value).getTime(),
			com_username: object("com_username").value,
			com_usermail: object("com_usermail").value,
			com_usersite: object("com_usersite").value,
			com_ispassed: object("com_ispassed").value,
			items: []
		};
		keep.push(object("id").value);
		if ( user.indexOf(object("com_member_id").value) === -1 && object("com_member_id").value > 0 ){
			user.push(object("com_member_id").value);
		};
		if ( art.indexOf(object("com_article_id").value) === -1 && object("com_article_id").value > 0 ){
			art.push(object("com_article_id").value);
		};
	});
	
	var obj = rec;
	
	if ( keep.length > 0 && genre != 2 ){
		rec = new dbo.RecordSet(conn);
		rec
			.sql("Select * From blog_comments Where com_root in (" + keep.join(",") + ") Order By com_postdate DESC")
			.open()
			.each(function(object){
				var root = object("com_root").value;
				if ( data[root + ""] && data[root + ""].items ){
					data[root + ""].items.push({
						id: object("id").value,
						com_article_id: object("com_article_id").value,
						com_member_id: object("com_member_id").value,
						com_content: object("com_content").value,
						com_root: root,
						com_postdate: new Date(object("com_postdate").value).getTime(),
						com_username: object("com_username").value,
						com_usermail: object("com_usermail").value,
						com_usersite: object("com_usersite").value,
						com_ispassed: object("com_ispassed").value
					});
					if ( user.indexOf(object("com_member_id").value) === -1 && object("com_member_id").value > 0 ){
						user.push(object("com_member_id").value);
					};
					if ( art.indexOf(object("com_article_id").value) === -1 && object("com_article_id").value > 0 ){
						art.push(object("com_article_id").value);
					};
				}
			})
			.close();
	};
	
	if ( user.length > 0 ){
		rec = new dbo.RecordSet(conn);
		rec
			.sql("Select id,member_avatar,member_nick From blog_members Where id in (" + user.join(",") + ")")
			.open()
			.each(function(object){
				users[object("id").value + ""] = {
					member_avatar: object("member_avatar").value,
					member_nick: object("member_nick").value,
					id: object("id").value
				}
			})
			.close();
	};
	
	if ( art.length > 0 && genre == 0 ){
		rec = new dbo.RecordSet(conn);
		rec
			.sql("Select id,art_title From blog_articles Where id in (" + art.join(",") + ")")
			.open()
			.each(function(object){
				arts[object("id").value + ""] = {
					art_title: object("art_title").value,
					id: object("id").value
				}
			})
			.close();
	}
%>
<!--导航菜单开始-->
<%LoadCssFile('private/plugins/' + pfolder + '/js/layout.css')%>
<div class="navtabs comment">
<%if (genre==0) {%>
   <span><a href="?m=<%=m%>&t=<%=pid%>&g=2"><i class="fa fa-comments-o"></i>批量管理</a></span>
   <span><a href="?m=<%=m%>&t=<%=pid%>&g=1"><i class="fa fa-envelope-o"></i>留言管理</a></span>
<%} else if (genre==1) {%>
   <span><a href="?m=<%=m%>&t=<%=pid%>&g=2"><i class="fa fa-comments-o"></i>批量管理</a></span>
   <span><a href="?m=<%=m%>&t=<%=pid%>&g=0"><i class="fa fa-comment-o"></i>评论管理</a></span>
<%} else if (genre==2) {%>
    <span><a href="javascript:;" class="app-selectall"><i class="fa fa-check-square-o"></i>全部选择</a></span>
    <span><a href="javascript:;" class="app-passall"><i class="fa fa-check"></i>批量通过</a></span>
    <!--<span><a href="javascript:;" class="app-remall"><i class="fa fa-trash"></i>批量删除</a></span>-->
    <span><i class="fa fa-ellipsis-v"></i></span>
    <span><a href="?m=<%=m%>&t=<%=pid%>&g=1"><i class="fa fa-envelope-o"></i>留言管理</a></span>
    <span><a href="?m=<%=m%>&t=<%=pid%>&g=0"><i class="fa fa-comment-o"></i>评论管理</a></span>
<%}%>
</div>
<!--导航菜单结束-->
<div id="comment">
	<form name="comments" id="comments" action="public/async.asp?m=<%=pmark%>&p=passall&t=plugin">
	<%
		var md5 = require("md5");
		for ( var i in data ){
			(function( mid, aid ){
				var ms;
				if ( mid > 0 ){
					ms = users[mid + ""];
				}else{
					ms = {
						member_nick: data[i].com_username,
						member_avatar: blog.AppPlatForm + "/avatars/" + md5.make(data[i].com_usermail) + ".jpg",
						id: 0
					}
				}
				var as = {};
				if (genre == 0) {
					as.prefix = '评论了';
					as.href = 'article.asp?id=' + arts[aid + ""].id;
					as.title = arts[aid + ""].art_title;
				}else if (genre == 1){
					as.prefix = '发表了';
					as.href = 'plugin.asp?id=' + pid;
					as.title = '留言';
				}else{
					as.prefix = '新发布';
					as.href = '#';
					as.title = '评论/留言';
				}
	%>
    <div class="parent">
    	<div class="fleft">
        	<p class="img">
            	<a href="javascript:;" target="_blank"><!--todo: 链接到网址-->
        			<img src="<%=ms.member_avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
            	</a>
            </p>
            <p align="center">
            	<input type="checkbox" name="ids" value="<%=data[i].id%>" />
            </p>
        </div>
        <div class="info">
        	<div class="nick"><a href="?m=user&n=<%=ms.member_nick%>" target="_blank"><%=ms.member_nick%></a> 于 <%=date.format(new Date(data[i].com_postdate), "y-m-d h:i:s")%> <%=as.prefix%><a href="<%=as.href%>" target="_blank"><%=as.title%></a>：</div>
            <div class="des"><i class="fa fa-angle-right"></i><%=data[i].com_content%></div>
            <div class="tools">
            	<i class="fa fa-caret-right"></i>操作：
            	<a href="javascript:;" class="app-remove" app-cid="<%=data[i].id%>"><i class="fa fa-trash-o"></i>删除这条<%=dis%></a>
                <%if (!data[i].com_ispassed) {%>
                <a href="javascript:;" class="app-pass" app-cid="<%=data[i].id%>"><i class="fa fa-check"></i>通过这条<%=dis%></a>
                <%}%>
            </div>
        </div>
    </div>
    <%
				if ( data[i].items.length > 0 ){
					for ( var j = 0 ; j < data[i].items.length ; j++ ){
						var _data = data[i].items[j];
						var _ms;
						if ( _data.com_member_id > 0 ){
							_ms = users[_data.com_member_id + ""];
						}else{
							_ms = {
								member_nick: _data.com_username,
								member_avatar: blog.AppPlatForm + "/avatars/" + md5.make(_data.com_usermail) + ".jpg",
								id: 0
							}
						}
						var _as = {};
						if (genre == 0) {
							_as.prefix = '评论了';
							_as.href = 'article.asp?id=' + arts[_data.com_article_id + ""].id;
							_as.title = arts[_data.com_article_id + ""].art_title;
						}else{
							_as.prefix = '发表了';
							_as.href = 'plugin.asp?id=' + pid;
							_as.title = '留言';
						}
	%>
    <div class="child">
    	<div class="fleft">
            <p class="img">
            	<a href="javascript:;" target="_blank"><!--todo: 链接到网址-->
        			<img src="<%=_ms.member_avatar%>" onerror="this.src='http://app.webkits.cn/avatars/default.png'" />
            	</a>
            </p>
            <p align="center">
            	<input type="checkbox" name="ids" value="<%=_data.id%>" />
            </p>
        </div>
        <div class="info">
        	<div class="nick"><a href="?m=user&n=<%=_ms.member_nick%>" target="_blank"><%=_ms.member_nick%></a> 于 <%=date.format(new Date(_data.com_postdate), "y-m-d h:i:s")%> <%=as.prefix%><a href="<%=as.href%>" target="_blank"><%=as.title%></a>：</div>
            <div class="des"><i class="fa fa-angle-right"></i><%=_data.com_content%></div>
            <div class="tools">
            	<i class="fa fa-caret-right"></i>操作：
            	<a href="javascript:;" class="app-remove" app-cid="<%=_data.id%>"><i class="fa fa-trash-o"></i>删除这条<%=dis%></a>
                <%if (!_data.com_ispassed) {%>
                <a href="javascript:;" class="app-pass" app-cid="<%=_data.id%>"><i class="fa fa-check"></i>通过这条<%=dis%></a>
                <%}%>
            </div>
        </div>
    </div>
    <%					
					}	
				}
			})(data[i].com_member_id, data[i].com_article_id);
		};
	%>
    </form>
    <div class="pages">
    	<%
			if ( xes && xes.pageCount && xes.pageCount > 0 ){
				var pages = obj.BuildPage(page, xes.pageCount);
				if ( pages.to > 1 ){
					for ( var i = pages.from ; i <= pages.to ; i++  ){
						if ( i === pages.current ){
		%>
        <span><%=i%></span>
		<%				}else{%>
        					<%if (genre == 0) {%>
        <a href="?m=<%=m%>&t=<%=pid%>&g=0&page=<%=i%>"><%=i%></a>
        					<%} else if (genre == 1) {%>
		<a href="?m=<%=m%>&t=<%=pid%>&g=1&page=<%=i%>"><%=i%></a>					
							<%} else {%>
         <a href="?m=<%=m%>&t=<%=pid%>&g=2&page=<%=i%>"><%=i%></a>                   
                            <%}%>
		<%		
						};
					};
				};
			};
			obj.close();
		%>
    </div>
</div>
<%
LoadJscript(function(params){ 
	window.mark = params.mark;
	window.dis = params.dis;
}, {mark: pmark, dis: dis});
%>
<%
	var page = http.query("page");
	if ( !page || page.length === 0 ){
		page = "1";
	};
	page = Number(page);
	if ( page < 1 ){
		page = 1;
	};

	var rec = new dbo.RecordSet(conn),
		data = {},
		keep = [],
		user = [],
		users = {},
		art = [],
		arts = {},
		date = require("date");
	
	rec
		.sql("Select * From blog_comments Where com_parent=0 Order By com_postdate DESC")
		.open();
	
	var xes = rec.AdoPage(page, 10, function(object){
		data[object("id").value + ""] = {
			id: object("id").value,
			com_article_id: object("com_article_id").value,
			com_member_id: object("com_member_id").value,
			com_content: object("com_content").value,
			com_parent: 0,
			com_postdate: new Date(object("com_postdate").value).getTime(),
			items: []
		};
		keep.push(object("id").value);
		if ( user.indexOf(object("com_member_id").value) === -1 ){
			user.push(object("com_member_id").value);
		};
		if ( art.indexOf(object("com_article_id").value) === -1 ){
			art.push(object("com_article_id").value);
		};
	});
	
	var obj = rec;
	
	if ( keep.length > 0 ){
		rec = new dbo.RecordSet(conn);
		rec
			.sql("Select * From blog_comments Where com_parent in (" + keep.join(",") + ") Order By com_postdate DESC")
			.open()
			.each(function(object){
				var parent = object("com_parent").value;
				if ( data[parent + ""] && data[parent + ""].items ){
					data[parent + ""].items.push({
						id: object("id").value,
						com_article_id: object("com_article_id").value,
						com_member_id: object("com_member_id").value,
						com_content: object("com_content").value,
						com_parent: parent,
						com_postdate: new Date(object("com_postdate").value).getTime()
					});
					if ( user.indexOf(object("com_member_id").value) === -1 ){
						user.push(object("com_member_id").value);
					};
					if ( art.indexOf(object("com_article_id").value) === -1 ){
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
	
	if ( art.length > 0 ){
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
<div id="comment">
	<%
		for ( var i in data ){
			(function( mid, aid ){
				var ms = users[mid + ""];
				var as = arts[aid + ""];
	%>
    <div class="parent clearfix">
    	<div class="img fleft"><img src="<%=ms.member_avatar%>" /></div>
        <div class="info">
        	<div class="nick"><a href="?m=user&n=<%=ms.member_nick%>" target="_blank"><%=ms.member_nick%></a> 于 <%=date.format(new Date(data[i].com_postdate), "y-m-d h:i:s")%> 在<a href="article.asp?id=<%=as.id%>" target="_blank">《<%=as.art_title%>》</a>文章中发表评论：</div>
            <div class="des"><i class="fa fa-angle-right"></i><%=data[i].com_content%></div>
            <div class="tools">
            	<i class="fa fa-caret-right"></i>操作：
            	<a href="javascript:;" class="app-remove" app-cid="<%=data[i].id%>"><i class="fa fa-trash-o"></i>删除这条评论</a>
            </div>
        </div>
    </div>
    <%
				if ( data[i].items.length > 0 ){
					for ( var j = 0 ; j < data[i].items.length ; j++ ){
						var _data = data[i].items[j];
						var _ms = users[_data.com_member_id + ""];
						var _as = arts[_data.com_article_id + ""];
	%>
    <div class="child clearfix">
    	<div class="img fleft"><img src="<%=_ms.member_avatar%>" /></div>
        <div class="info">
        	<div class="nick"><a href="?m=user&n=<%=_ms.member_nick%>" target="_blank"><%=_ms.member_nick%></a> 于 <%=date.format(new Date(_data.com_postdate), "y-m-d h:i:s")%> 在<a href="article.asp?id=<%=_as.id%>" target="_blank">《<%=_as.art_title%>》</a>文章中发表评论：</div>
            <div class="des"><i class="fa fa-angle-right"></i><%=_data.com_content%></div>
            <div class="tools">
            	<i class="fa fa-caret-right"></i>操作：
            	<a href="javascript:;" class="app-remove" app-cid="<%=_data.id%>"><i class="fa fa-trash-o"></i>删除这条评论</a>
            </div>
        </div>
    </div>
    <%					
					}	
				}
			})(data[i].com_member_id, data[i].com_article_id);
		};
	%>
    
    <div class="pages clearfix">
    	<%
			if ( xes && xes.pageCount && xes.pageCount > 0 ){
				var pages = obj.BuildPage(page, xes.pageCount);
				if ( pages.to > 1 ){
					for ( var i = pages.from ; i <= pages.to ; i++  ){
						if ( i === pages.current ){
		%>
        <span><%=i%></span>
		<%				}else{%>
        <a href="?m=<%=m%>&page=<%=i%>"><%=i%></a>
        <%		
						};
					};
				};
			};
			obj.close();
		%>
    </div>
</div>
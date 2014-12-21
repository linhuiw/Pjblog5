<%if ( sups.position("home") ) {%><title><%=data.global.blog_name%> - <%=data.global.blog_title%></title>
<meta name="description" content="<%=data.global.blog_description%>" />
<meta name="keywords" content="<%=data.global.blog_keywords%>" /><%};%><%if ( sups.position("category") ) {%><title><%=data.actives.category.cate_name%> - <%=data.global.blog_name%></title>
<meta name="description" content="<%=data.actives.category.cate_des%>" />
<meta name="keywords" content="<%=data.actives.category.cate_name%>" /><%};%><%if ( sups.position("tag") ) {%><title><%=data.actives.tag.tag_name%> - <%=data.global.blog_name%></title>
<meta name="description" content="<%=data.global.blog_name%>上关于<%=data.actives.tag.tag_name%>的所有日志聚合" />
<meta name="keywords" content="<%=data.actives.tag.tag_name%>" /><%};%><%if ( sups.position("article") ) {%><title><%=data.article.art_title%>-<%=data.global.blog_name%></title>
<meta name="description" content="<%=data.article.art_des%>" />
<meta name="keywords" content="<%=(function(tags){var x = []; for ( var i = 0 ; i < tags.length ; i++ ){ x.push(tags[i].tag_name); }; return x;})(data.article.art_tags).join(",")%>" /><%};%>
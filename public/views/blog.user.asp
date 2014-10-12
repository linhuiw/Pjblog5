<%
var groups = {}, g = [];

(new dbo.RecordSet(conn))
	.sql("Select * From blog_groups")
	.open()
	.each(function(object){
		if ( object("id").value > 1 ){
			groups[object("id").value + ""] = object("group_name").value;
			g.push({
				id: object("id").value,
				name: object("group_name").value
			});
		}
	})
	.close();
	
LoadJscript(function(g){
	window.groups = g.groups;
	window.group = g.group;
	window.uid = g.uid;
}, { groups: g, group: groups, uid: uid });
%>

<div id="user-box" class="animated bounceInUp">
	<div class="searchbox track">
    	<a href="javascript:;" class="search-all"><i class="fa fa-bars"></i></a>
        <a href="javascript:;" class="do-search"><i class="fa fa-search"></i></a>
        <div class="search-input"><input type="text" name="keyword" placeholder="输入用户昵称查询..." /></div>
    </div>
    <div class="userbox track clearfix"></div>
    <div class="detailbox track"></div>
</div>

<%
function AllData(icon, counts, title, des, color){
%>
<li class="list-group-item">
<div class="media"> <span class="pull-left thumb-sm <%=icon%>" style="font-size:20px; text-align:center; position:relative; top:7px;"></span>
  <div class="pull-right <%=color%> m-t-sm badge"> <%=counts%> </div>
  <div class="media-body">
    <div><%=title%></div>
    <small class="text-muted" style="font-size:11px;"><%=des%></small> </div>
</div>
</li>
<%
}
%>

<div class="row">
    <div class="col-sm-6">
      <section class="panel panel-info">
        <header class="panel-heading"><i class="fa fa-tachometer"></i> <span>系统综合数据</span></header>
        <ul class="list-group alt">
          <%AllData("fa fa-file-text-o", conn.Execute("Select count(id) From blog_articles")(0).value, "文章总数", "您的网站上一共发表的文章数目统计", "bg-success");%>
          <%AllData("fa fa-user", conn.Execute("Select count(id) From blog_members")(0).value, "用户总数", "您网站粉丝总数统计", "bg-primary");%>
          <%AllData("fa fa-comments", conn.Execute("Select count(id) From blog_comments")(0).value, "评论总数", "粉丝给您的评论总数", "bg-info");%>
          <%AllData("fa fa-envelope-o", conn.Execute("Select count(id) From blog_messages")(0).value, "留言总数", "粉丝给您的留言总数", "bg-dark");%>
          <%AllData("icon-drawer icon", conn.Execute("Select count(id) From blog_plugins")(0).value, "插件总数", "您网站上附加功能插件总数统计", "bg-warning");%>
          <%AllData("fa fa-compress", conn.Execute("Select count(id) From blog_links")(0).value, "友链总数", "城市邻居，地球邻居，你的友链总数统计", "bg-danger");%>
        </ul>
      </section>
    </div>
    
    <div class="col-sm-6">
      <section class="panel panel-success">
        <header class="panel-heading"><i class="fa fa-tasks"></i> <span>系统组件支持</span></header>
        <ul class="list-group alt">
          <%
            (function(j){
                for ( var i in Library ){
                    if ( /^com\_/.test(i) ){
                        j++;
                        try{ new ActiveXObject(Library[i]);
        %>
          <li class="list-group-item">
            <div class="media"> <span class="pull-left thumb-sm" style="font-size:20px; text-align:center; position:relative; top:2px; color:#ddd; font-style:oblique;"><%=j%></span>
              <div class="pull-right text-success m-t-sm"> <i class="fa fa-circle"></i> </div>
              <div class="media-body">
                <div>Coms: <%=Library[i].toUpperCase()%></div>
                <small class="text-muted" style="font-size:11px;">Create New ActiveXObject("<%=Library[i].toUpperCase()%>")</small> </div>
            </div>
          </li>
          <%
                        }catch(e){
        %>
          <li class="list-group-item">
            <div class="media"> <span class="pull-left thumb-sm" style="font-size:20px; text-align:center; position:relative; top:2px; color:#ddd; font-style:oblique;"><%=j%></span>
              <div class="pull-right text-danger m-t-sm"> <i class="fa fa-circle"></i> </div>
              <div class="media-body">
                <div>Coms: <%=Library[i].toUpperCase()%></div>
                <small class="text-muted" style="font-size:11px;">Create New ActiveXObject("<%=Library[i].toUpperCase()%>")</small> </div>
            </div>
          </li>
          <%
                        }
                    }
                }
            })(0);
        %>
        </ul>
      </section>
    </div>
    
    <div class="col-sm-4">
    	<section class="panel panel-danger">
        	<header class="panel-heading"><i class="fa fa-wrench"></i> <span>云端升级</span></header>a
        </section>
    </div>
    <div class="col-sm-4">
    	<section class="panel panel-warning">
        	<header class="panel-heading"><i class="fa fa-comments"></i> <span>云端评论</span></header>a
        </section>
    </div>
    <div class="col-sm-4">
    	<section class="panel panel-info">
        	<header class="panel-heading"><i class="fa fa-windows"></i> <span>云端资讯</span></header>a
        </section>
    </div>
</div>

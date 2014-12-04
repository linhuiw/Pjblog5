<%
modules.scriptExec(function( data ){
	window.modules.user = data;
}, {
	group: iPress.setURL('async', 'user', { m: 'changeGroup' }),
	status: iPress.setURL('async', 'user', { m: 'changeStatus' })
});
%>
<div class="iPress-wrap">
  <div class="row">
		<%
			if ( pages.arrays.length > 1 ){
		%>
		<nav style="padding:0px 15px;">
		  <ul class="pagination">
			<li class="<%=pages.value.index === pages.value.prev ? "disabled": ""%>">
				<a href="<%=iPress.setURL('control', 'wrap', { m: 'user', s: pages.value.prev })%>">
					<i class="fa fa-angle-left"></i>
				</a>
			</li>
		  <%
				pages.arrays.forEach(function( o ){
					if ( pages.value.index === o ){
		%>
				<li class="disabled"><a href="<%=iPress.setURL('control', 'wrap', { m: 'user', s: o })%>"><%=o%></a></li>
		<%		
					}else{
		%>
				<li><a href="<%=iPress.setURL('control', 'wrap', { m: 'user', s: o })%>"><%=o%></a></li>
		<%			
					}
				});
		%>
			<li class="<%=pages.value.index === pages.value.next ? "disabled": ""%>">
				<a href="<%=iPress.setURL('control', 'wrap', { m: 'user', s: pages.value.next })%>">
					<i class="fa fa-angle-right"></i>
				</a>
			</li>
		  </ul>
		</nav>
		<%	
			};

			list.result.forEach(function( o ){
		%>
    <div class="col-md-4">
      <div class="contact-box">
        <div class="col-md-4">
          <div class="text-center"> <img alt="image" class="img-circle m-t-xs img-responsive" src="<%=o.member_avatar%>/128" onerror="this.src='public/assets/bootstrap/img/avatars.png'">
            <div class="m-t-xs font-bold">
              <div class="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown"> <span class="name"><%=o.member_group.group_name%></span> <span class="caret"></span> </button>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                	<%
						for ( var i in groups ){
					%>
                    <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;" class="text-left post-group" data-id="<%=o.id%>" data-gid="<%=groups[i].id%>"><%=groups[i].group_name%></a></li>
                    <%
						};
					%>
                </ul>
              </div>
              </div>
          </div>
        </div>
        <div class="col-md-8">
          <h3><strong><%=o.member_nick%></strong></h3>
          <p class="text-auto-hide adress"><i class="fa fa-map-marker"></i><%=!o.member_address || o.member_address.length === 0 ? "该家伙很懒，什么都没留下。" : o.member_address%></p>
          <address>
          <div class="status p"><i class="fa fa-dot-circle-o"></i><span>状态：</span><b><%=o.member_forbit ? "拒绝登陆" : "正常访问"%></b> <a href="javascript:;" data-id="<%=o.id%>" class="post-status"><i class="fa fa-wrench"></i></a></div>
          <div class="sex p"><i class="fa fa-child"></i><span>性别：</span><b><%=o.member_sex === 0 ? "保密" : ( o.member_sex === 1 ? "男" : "女" )%></b></div>
          <div class="web p"><i class="fa fa-home"></i><span>主页：</span><b><%=o.member_website%></b></div>
          <div class="birthday p"><i class="fa fa-calendar"></i><span>生日：</span><b><%=date.format(new Date(o.member_birthday), "y-m-d h:i:s")%></b></div>
          <div class="logindate p"><i class="fa fa-unlock-alt"></i><span>登录：</span><b><%=date.format(new Date(o.member_logindate), "y-m-d h:i:s")%></b></div>
          </address>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <%
			});
	%>
  </div>
</div>

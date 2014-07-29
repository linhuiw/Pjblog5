<%
	var agree = Number(http.form("agree") || "0");
	if ( agree !== 1 ){
%>
<div class="wrap">
	<div class="content copyright shadow">
        <p>抱歉，您将无法继续安装，为了确保版权的合法性，请先同意协议后安装!</p>
    </div>
    <div class="step"><a href="?step=1" class="btn">上一步</a></div>
</div>
<%		
	}else{
		var next = true;
%>
<div class="wrap">
	<div class="content copyright shadow">
		<h6>检查用户空间组件情况</h6>
        <table cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
            	<%
					;(function( params, j ){
						for ( var i in params ){
							if ( /^com\_/.test(i) ){
								j++;
								try{
									new ActiveXObject(params[i]);
				%>
                <tr>
                	<td class="tleft" width="50"><%=j%>.</td>
                    <td class="blue"><%=params[i].toUpperCase()%></td>
                    <td width="80"><font color="green">存在</font></td>
                </tr>
                <%
								}catch(e){
									next = false;
				%>
                <tr>
                	<td class="tleft" width="50"><%=j%>.</td>
                    <td class="blue"><%=params[i].toUpperCase()%></td>
                    <td width="80"><font color="red">缺失</font></td>
                </tr>
                <%					
								}
							}
						}
					})( Library, j = 0 );
				%>
            </tbody>
        </table>
    </div>
    <div class="step"><%if ( next ){%><a href="?step=3&t=local" class="btn fleft">本地安装</a><a href="?step=3&t=online" class="btn">在线安装</a><%};%></div>
</div>
<%		
	}
%>
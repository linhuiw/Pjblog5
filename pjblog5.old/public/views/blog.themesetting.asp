<%
var global = require("private/chips/" + blog.cache + "blog.global");
var selector = "private/themes/" + global.blog_theme + "/setting.js";
var path = resolve(selector);
if ( fs.exist(path) ){
	var data = require(selector);
	var rec = new dbo.RecordSet(conn);
	var n = 0;
%>
<form action="public/async.asp?m=theme&p=SaveThemesSettingValue" method="post" style="margin:0;" id="postform">
<div class="setform">
    <h5><i class="fa fa-hand-o-right"></i> <a href="javascript:;" class="opensetting" app-fo="<%=global.blog_theme%>">打开配置文件</a></h5>
    <table cellpadding="0" cellspacing="0" width="100%" border="0">
		<%
			rec
				.sql("Select * From blog_themes")
				.open()
				.each(function(object){
					if ( data[object("tm_key").value] ){
						var name = object("tm_key").value,
							value = object("tm_value").value;
						
						n++;
						
						if ( data[name].type === "textarea" ){
		%>
        		<tr>
                	<td width="200"><%=data[name].des%></td>
                    <td><textarea style="width:90%;height:80px;" name="<%=name%>"><%=value%></textarea></td>
                </tr>
        <%					
						}
						else if ( data[name].type === "select" ) {
		%>
        		<tr>
                	<td width="200"><%=data[name].des%></td>
                    <td>
                    	<select name="<%=name%>">
							<%
                                for ( var j = 0 ; j < data[name].childs.length ; j++ ){
                                    if ( data[name].childs[j].value === value ){
                                        Library.log('<option value="' + data[name].childs[j].value + '" selected="selected">' + data[name].childs[j].name + '</option>');
                                    }else{
                                        Library.log('<option value="' + data[name].childs[j].value + '">' + data[name].childs[j].name + '</option>');
                                    };
                                };
                            %>
                        </select>
                    </td>
                </tr>
        <%					
						}
						else if ( data[name].type === "password" ) {
		%>
        		<tr>
                	<td width="200"><%=data[name].des%></td>
                    <td><input type="password" name="<%=name%>" value="<%=value%>" style="width:90%;" /></td>
                </tr>
        <%
						}
						else{
		%>
        		<tr>
                	<td width="200"><%=data[name].des%></td>
                    <td><input type="text" name="<%=name%>" value="<%=value%>" style="width:90%;" /></td>
                </tr>			
        <%					
						}
					};
				})
				.close();
				if ( n > 0 ){
		%>
        		<tr>
                	<td width="200"></td>
                    <td><input type="submit" value="保存参数" /></td>
                </tr>
        <%				
				}
		%>
    </table>
</div>
</form>
<%
};
%>
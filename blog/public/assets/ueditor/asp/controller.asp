<!--#include file="../../../../appjs/service/tron.asp" -->
<!--#include file="../../../../public/map.asp" -->
<%
;(function( USER ){
    var user = new USER(),
        globalcache = require("private/chips/" + blog.cache + "blog.global"),
        common = user.adminStatus(function( rets, object ){
            uid = object("id").value;
            token = object("member_token").value;
            openid = object("member_openid").value;
        });
    if ( !common.login || !common.admin ){
        (function(global, ret){
            //if ( !global.blog_appid ){
                Response.Write ( '<a href="javascript:;" id="loginform">您暂未获得授权，无法登陆。</a>' );
                Response.End();
            //}else{
    //<a href="ret.GetAuthorizeURL(global.blog_appid, "control.asp")" id="loginform"><strong><i class="fa fa-share-alt-square"></i>后台授权登录</strong></a>
            //};
        })(globalcache, require("public/library/oauth2"));  
    }

    UEditor_CallForJS();
})( 
    require("../../../../public/services/user")
);
%>
<script language="vbscript" runat="server">

Sub UEditor_CallForJS()

    Dim action
    action = Request.Item("action")

    Session.Contents.Remove("ueditor_asp_uploadTemplateName")
    Session.Contents.Remove("ueditor_asp_base64Upload")
    Session.Contents.Remove("ueditor_asp_listTemplateName")


    Select Case action

        Case "config"
            Server.Execute("action_config.asp")

        Case "uploadimage"
            Session.Value("ueditor_asp_uploadTemplateName") = "image"
            Server.Execute("action_upload.asp")

        Case "uploadscrawl"
            Session.Value("ueditor_asp_uploadTemplateName") = "scrawl"
            Session.Value("base64Upload") = "scrawl.png"
            Server.Execute("action_upload.asp")

        Case "uploadvideo"
            Session.Value("ueditor_asp_uploadTemplateName") = "video"
            Server.Execute("action_upload.asp")

        Case "uploadfile"
            Session.Value("ueditor_asp_uploadTemplateName") = "file"
            Server.Execute("action_upload.asp")

        Case "listimage"
            Session.Value("ueditor_asp_listTemplateName") = "image"
            Server.Execute("action_list.asp")

        Case "listfile"
            Session.Value("ueditor_asp_listTemplateName") = "file"
            Server.Execute("action_list.asp")

        Case "catchimage"
            Server.Execute("action_crawler.asp")
    End Select

End Sub
</script>
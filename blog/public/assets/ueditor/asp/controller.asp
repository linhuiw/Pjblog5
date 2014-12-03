<!--#include file="../../../config.asp" -->
<%
;(function( USER ){
	require(":public/library/connect");
	function adminPromise(){
		if ( blog.admin ){
			return true;
		};
		
		var users = USER;
		var user = new users();
		var info = user.status();
		if ( info.status !== 2 ){
			iPress.error = 503;
			return false;
		}else{
			blog.user = info;
			blog.admin = true;
			return true;
		}
	}
	if ( adminPromise() ){
    	UEditor_CallForJS();
	}else{
		console.json({ success: true, message: "您没有权限" });
	}
})(require(":public/library/user"));
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
<%
modules.scriptExec(function( data ){
	window.modules.theme = data;
}, {
	install: iPress.setURL('async', 'theme', { m: 'install' }),
	remove: iPress.setURL('async', 'theme', { m: 'remove' })
})
%>
<div class="iPress-wrap">
	<div class="row">
    	<div class="col-md-4" style="margin-bottom:30px;">
        	<div class="ibox float-e-margins">
                <div class="ibox-title">
                    <h5>当前应用主题</h5>
                </div>
                <div>
                    <div class="ibox-content no-padding border-left-right">
                    	<div class="preview">
                        <img alt="image" class="img-responsive" src="<%=theme.bigpreview%>">
                        </div>
                    </div>
                    <div class="ibox-content profile-content">
                        <h4><strong><%=theme.name%></strong></h4>
                        <p><i class="fa fa-user"></i> <a href="<%=theme.site%>" target="_blank"><%=theme.author%></a> <code class="pull-right">v.<%=theme.version%></code></p>
                        <h5>
                        主题描述
                    </h5>
                        <p>
                            <%=theme.des%>
                        </p>
                        <%if ( theme.setting && theme.setting.length > 0 ){%>
                        <div class="user-button" style="margin-top:30px;">
                            <div class="row">
                                <div class="col-md-12">
                                    <button type="button" class="btn btn-info btn-sm btn-block" data-toggle="modal" data-target=".bs-example-modal-lg"><i class="fa fa-cogs"></i> 主题自定义参数设置</button>
                                    <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                                      <div class="modal-dialog modal-lg">
                                        <div class="modal-content">
                                          <div class="modal-header">
                                            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                                            <h4 class="modal-title" id="myLargeModalLabel">当前主题自定义参数设置</h4>
                                          </div>
                                          <div class="modal-body">
                                          	<form action="<%=iPress.setURL("async", "theme", { m: "setParams" })%>" method="post" class="ajax-form">
                                                <table class="table table-bordered">
                                                <%=formatParams(theme.folder)%>
                                                </table>
                                                <p><button type="submit" class="btn btn-info">保存自定义配置参数</button></p>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <%};%>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-8">
        <div class="row">
        <%
			themes.forEach(function(o){
		%>
        	<div class="col-sm-4 theme-detail">
            	<div class="previews">
                	<img alt="image" class="img-responsive" src="<%=o.shortpreview%>">
                    <div class="info trans">
                    	<h4 class="text-auto-hide"><%=o.name%></h4>
                    	<div class="row">
                        	<a href="javascript:;" class="col-xs-6 install" data-id="<%=o.folder%>"><i class=" fa fa-plug"></i></a>
                            <a href="javascript:;" class="col-xs-6 remove" data-id="<%=o.folder%>"><i class="fa fa-close"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        <%
			});
		%>
        </div>
        </div>
    </div>
</div>
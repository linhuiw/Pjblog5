<%
;(function(mark){
	var topArticleExports = load(mark);
	if ( topArticleExports ){
		var t = { id: id, tags: tags, mark: mark };
		LoadJscript(function(tags){ window.tag = tags; }, t);
	}
})("c230c7e78ef7db0518aa014807c2578f7303d425");
%>
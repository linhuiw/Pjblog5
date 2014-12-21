<%
;(function(){
	if (tags.length < 1) { return }		//没有tag则直接返回
	
	Library.log("<style>\n" + setting.node + " .highlight{\n");
	Library.log(setting.style);
	Library.log("\n}\n</style>");	
%>
<script>
	;(function(){
		var tags = [];
<%
		var pattern = "";
		for (var i=0; i<tags.length; i++) {
			if (/[A-Za-z]+/.test(tags[i].tag_name)) {
				pattern += "|\\b" + tags[i].tag_name + "\\b";
			}else{
				pattern += "|" + tags[i].tag_name;
			}
			Library.log("  tags.push({name:'" + tags[i].tag_name.toLowerCase() + "', href:'" + tags[i].href + "'});\n");
		}
		pattern = pattern.replace("|", "");	
%>	
		var re = /(<%=pattern%>)/ig;
		var node = '<%=setting.node%>';
		var taghref = <%=setting.href%>;
		var content = $(node).html();
		
		if (taghref == 0) {
			content = content.replace(re, function(result){
				for (var i=0; i<tags.length; i++) {
					if (result == tags[i].name.toLowerCase()) {
						var html = '<a href="' + tags[i].href + '" class="highlight" target="_blank">' + result + '</a>';
						return html;
					}
				}
				return result;
			});
		}else {
			content = content.replace(re, '<span class="highlight">$1</span>');
		}

		// 移除标签内部的高亮
		content = content.replace(/(<[^>]+?)<.*?class="highlight".*?>(.*?)<\/.*?>([^<]+?>)/ig, function(result){
			result = result.replace(/<[^<>]*?class="highlight".*?>(.*?)<\/.*?>/ig, '$1');
			return result;
		});	
		// 移除超链接标签嵌套
		content = content.replace(/(<a[^>]*>[^<]*<a[^>]*>.*?<\/a>[^<]*<\/a>)/ig, function(result){
			result = result.replace(/<[^<>]*?class="highlight".*?>(.*?)<\/.*?>/ig, '$1');
			return result;
		});	
		// 移除pre标签内的高亮
		content = content.replace(/(<pre[\S\s]+?<\/pre>)/ig, function(result){
			result = result.replace(/<[^<>]*?class="highlight".*?>(.*?)<\/.*?>/ig, '$1');
			return result;
		});
		
		$(node).html(content);
	})();
</script>
<%
})();
%>
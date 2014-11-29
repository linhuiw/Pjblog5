<%
console.log("evio是" + evio + "<br />");

for (var i in iis) {
	console.log(i + ": " + (iis[i] ? "支持" : "不支持") + "<br />")
}

for (var i in statistics) {
	console.log(i + ": " + statistics[i] + "<br />")
}
%>
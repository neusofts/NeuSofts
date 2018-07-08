document.writeln("<LINK href=\"images\/images\/style.css\" type=text\/css rel=stylesheet>");
document.writeln("<div class=\"clear\"><\/div>");
document.writeln("<div id=\"css8_footer\">");
document.writeln("		<div id=\"css8_footer1\">");
document.writeln("				&copy; 2008 <A href=\"http:\/\/www.neusofts.com\/?p=238\">CHM 开发手册集锦<\/A> all rights reserved ");
document.writeln("<\/div>");
document.writeln("<\/div>");

void (function (d) {
	var
		str = '',
		active = false,
		menuArr = ['Object', 'Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Function', 'Math', 'Number', 'RegExp', 'String'],
		h1 = d.getElementsByTagName('h1')[1],	//Arguments（函数参数对象）
		i = d.getElementsByTagName('i')[0]		//Arguments、Arguments.callee、TypeError
	;
	
	if (d.getElementsByTagName('h1').length > 1) {
		str = h1.innerText;
	} else {
		if (!i) {
			return false;
		}
		
		str = i.innerText;
	}
	
	menuArr.forEach(function(v, k){
		if (!active && str.indexOf(v) > -1) {
			d.getElementsByTagName('li')[k].className = 'home';
			d.title = v + ' - ' + d.title;
			active = true;
		}
	});
}(document));
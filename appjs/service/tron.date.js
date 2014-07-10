exports.format = function( DateObject, type ){
		
	if ( Object.prototype.toString.call(DateObject).split(" ")[1].toLowerCase().replace("]", "") !== "date" ){
		DateObject = new Date(DateObject);
	}
	
	var date = DateObject,
		year = (date.getFullYear()).toString(),
		_month = date.getMonth(),
		month = (_month + 1).toString(),
		day = (date.getDate()).toString(),
		hour = (date.getHours()).toString(),
		miniter = (date.getMinutes()).toString(),
		second = (date.getSeconds()).toString(),
		_day, _year;
		
	var dateArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];	
	
	month = month.length === 1 ? "0" + month : month;
	_day = day;
	day = day.length === 1 ? "0" + day : day;
	hour = hour.length === 1 ? "0" + hour : hour;
	miniter = miniter.length === 1 ? "0" + miniter : miniter;
	second = second.length === 1 ? "0" + second : second;
		
	return type.replace(/y/g, year)
			.replace(/m/g, month)
			.replace(/d/g, day)
			.replace(/h/g, hour)
			.replace(/i/g, miniter)
			.replace(/s/g, second)
			.replace(/D/g, _day)
			.replace(/M/g, dateArray[_month]);
			
}
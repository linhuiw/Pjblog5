module.exports = new Class(function(querys, getforms){
	var topList = [], recList = [], pfolder = this.pfolder;
	
	fs(contrast(':private/plugins/' + pfolder + '/top.json')).exist().then(function(){
		topList = require(':private/plugins/' + pfolder + '/top.json');
	})
	fs(contrast(':private/plugins/' + pfolder + '/rec.json')).exist().then(function(){
		recList = require(':private/plugins/' + pfolder + '/rec.json');
	})
	
	this.data = {};
	this.data.topList = topList;
	this.data.recList = recList;
	this.data.query = querys;
	
	return this.data;
});	
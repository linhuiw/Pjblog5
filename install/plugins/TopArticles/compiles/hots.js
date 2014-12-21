module.exports = new Class(function( id, mark, folder ){
	var modes = require('../exports');
	var mode = new modes(id, mark, folder);
	return mode.getModuleData();
});
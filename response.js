var extend = require('extend');

// object containing methods for creating standard error and success response
var response = {
	error: function(err) {
		return {
			err: err
	    };
	},
	success: function(data) {
		console.log(JSON.stringify(data));
		return {
			results: data
	    };
	},
	successExtended: function(data, additionalDatas) {
		var results = {
			results: data
		};

		if (typeof additionalDatas === 'object') {
			results = extend(true, results, additionalDatas);
		}

		console.log('results: ' + JSON.stringify(results));

		return results;
	}
};

module.exports = response;
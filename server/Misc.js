"use strict";

//Helper class with some common functions

module.exports = {
	getErrorResponse: function(code, description) {
		return { type : "error", data : { code : code, error: description }}
	},

	random: function(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}
}
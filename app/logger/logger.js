"use strict";

angular.module('crLogger', []).factory("loggerService", [ function() {
	var loggerService = {
		enabled: true
	}

	loggerService.getLogger = function(type) {
		var logger = {
			type: type,
			enabled: true
		}

		logger.log = function() {
			if (loggerService.enabled) {
				var args = [ "!"+logger.type+" |" ];
				for (var i = 0; i < arguments.length; i++) {
					args.push(arguments[i]);
				}
				console.log.apply(console,args);
			}
		}

		logger.info = function() {
			var args = [ "#info:" ];
			for (var i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}

			logger.log.apply(logger,args);
		}

		logger.error = function() {
			var args = [ "#error:" ];
			for (var i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			logger.log.apply(logger, args);
		}

		logger.warn = function() {
			var args = [ "#warn:" ];
			for (var i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			logger.log.apply(logger, args);
		}		

		logger.debug = function() {
			var args = [ "#debug:" ];
			for (var i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			logger.log.apply(logger, args);
		}

		logger.trace = function() {
			var args = [ "#trace:" ];
			for (var i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			logger.log.apply(logger, args);
		}					

		return logger;
	}

	return loggerService;
}]);
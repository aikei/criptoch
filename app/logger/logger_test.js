"use strict";

describe("crLogger module", function() {

	beforeEach(module("crLogger"));

	describe("loggerService", function() {

		var logger = null;

		it("Get a logger", inject(function(loggerService) {
			logger = loggerService.getLogger("myLog");
			expect(logger).toBeDefined();
		}));

		it("Check logger type", function() {
			expect(logger.type).toBe("myLog");
		});

		it("Check log function is present", function() {
			expect(typeof logger.log).toBe("function");
		});

		it("Check info function is present", function() {
			expect(typeof logger.info).toBe("function");
		});

		it("Check error function is present", function() {
			expect(typeof logger.error).toBe("function");
		});	

		it("Check warn function is present", function() {
			expect(typeof logger.warn).toBe("function");
		});	

		it("Check debug function is present", function() {
			expect(typeof logger.debug).toBe("function");
		});	

		it("Check trace function is present", function() {
			expect(typeof logger.trace).toBe("function");
		});

		it("Log info", function() {
			logger.info("Info");
		});
	});
});
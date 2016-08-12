"use strict";

//var nodeCrypto = require("./crypto.js");

const text = "Hello";
const key = Math.floor(Math.random()*1000000).toFixed();

var cipherText = null;

describe("Crypto module test", function() {

	it("Correctly encrypts", function() {
		cipherText = window.nodeCrypto.encrypt(text,key);
		expect(cipherText).not.toBe(text);
	});

	it("Correctly decrypts", function() {
		var decryptedText = window.nodeCrypto.decrypt(cipherText,key);
		expect(decryptedText).toBe(text);
	});

});
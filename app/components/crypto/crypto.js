const crypto = require("crypto");

const algorithm = "aes-128-ctr";

var obj = {};

obj.encrypt = function(text, key) {
	var cipher = crypto.createCipher(algorithm, key);
	var encrypted = cipher.update(text,"utf8","hex");
	encrypted += cipher.final("hex");
	return encrypted;
}

obj.decrypt = function(text, key) {
	var decipher = crypto.createDecipher(algorithm, key);
	var plainText = decipher.update(text,"hex","utf8");
	plainText += decipher.final("utf8");
	return plainText;
}


try {
	window.nodeCrypto = obj;
} catch(err) {
	module.exports = obj;
}
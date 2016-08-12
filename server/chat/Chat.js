"use strict";

module.exports = Chat;

//A class describing chat room
function Chat(key) {
	var self = this;
	self.users = [];
	self.key = key;
}

Chat.prototype.addUser = function(name, socketId) {
	var self = this;
	name = name || self.users.length+1;
	var usr = {
		name : name,
		socketId : socketId
	}
	self.users.push(usr);
	return usr;
}
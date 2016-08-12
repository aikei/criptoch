"use strict";

const debug = require("debug-logger")("RequestHandler");


var handler = null;

module.exports = function() {
	if (!handler)
		handler = new RequestHandler();
	return handler;
}

function RequestHandler() {
	var self = this;
	debug.trace("constructor");
	self.chats = {};
}

RequestHandler.prototype.onRequest = function(request, response) {
	var self = this;
	debug.trace("onRequest");
	try {
		if (self[request.type+"Handler"]) {
				self[request.type+"Handler"](request, response);
		} else if (socket.chatKey) {
			if (self.chats[socket.chatKey]) {
				self.chats[socket.chatKey].onRequest(request, response);
			} else {
				response(Misc.getErrorResponse("ERR_NO_CHAT","No such chat"));
			}
		} else {
			response(Misc.getErrorResponse("WRONG_REQUEST", "Wrong request"));
		}
	} catch(err) {
		debug.error("Error processing request:");
		debug.error(err);
		response(Misc.getErrorResponse("ERR_PROC","Error processing request"));
	}
}

RequestHandler.prototype.generateKey = function() {
	return Misc.random(0,Number.MAX_VALUE);
}

RequestHandler.prototype.startChatHandler = function(request, response) {
	var self = this;
	var chat = new Chat(self.generateKey());
	self.chats[chat.key] = chat;
}
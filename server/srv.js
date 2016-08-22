"use strict";

//const Misc = require("./misc.js");
const http = require("http");
const https = require("https");
const debug = require("debug-logger")("srv");
const socketio = require('socket.io');
const Misc = require("./Misc.js");
const Chat = require("./chat/Chat.js");
const config = require("./config.js");
const fs = require("fs");

if (config.SSL) {
	var options = 
	{ 
	  key : config.keyPath,
	  cert : config.certPath
	}
}

//Main logic class: handles connections, requests and responses. 
//Creates new chats and passes messages between chat users.
function Server() {
	debug.trace("constructor");
	var self = this;
	self.connections = Object.create(null);
	self.chats = Object.create(null);
	self.start();
	debug.info("server started");
}

//Initialization function
Server.prototype.start = function() {
	var self = this;
	debug.trace("start");

	if (config.SSL) {
		var httpServer = https.createServer(options)
	} else {
		httpServer = http.createServer();
	}

	httpServer.listen(6677);

	httpServer.on("error", function(err) {
		debug.warn("Server error: ",err);
	});

	self.io = socketio.listen(httpServer, { pingInterval: 5000, pingTimeout: 15000 });

	self.io.on('connection', function (socket) {
		debug.info("connection: socket "+socket.id);

		//create a 'custom' object to easily keep some custom data
		socket.custom = {};

		socket.on("request", function(request, response) {
			debug.trace("request received: "+JSON.stringify(request));
			self.onRequest(socket, request, response);
		});

		socket.on("sync", function(clientTime, response) {
			var serverTime = Date.now();
			response(clientTime,serverTime);
		});

		socket.on("disconnect", function() {
			debug.trace("disconnect : socket "+socket.id+" / user "+socket.custom.usrName);
			if (socket.custom.chatKey) {
				self.sendResponseToChatRoom(socket.custom.chatKey, {
					type : "userDisconnected",
					data : {
						name : socket.custom.usrName
					}
				})
			}
		});
	});
}

//sends message to all players in a chatroom
Server.prototype.sendResponseToChatRoom = function(chatRoom, resp) {
	var self = this;
	debug.trace("sending response: "+JSON.stringify(resp)+" to chat: "+chatRoom);
	self.io.to(chatRoom).emit("serverResponse", resp);
}

//Main request handler
Server.prototype.onRequest = function(socket, request, response) {
	var self = this;
	debug.trace("onRequest");
	try {
		//we check if there is a method ending with Handler, and call it if it is present
		if (self[request.type+"Handler"]) {
				self[request.type+"Handler"](socket, request, response);
		} else if (socket.custom.chatKey) {
			if (self.chats[socket.custom.chatKey]) {
				self.chats[socket.custom.chatKey].onRequest(request, response);
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

//generate a random chat key
Server.prototype.generateKey = function() {
	return Misc.random(0,1e+21).toFixed();
}

Server.prototype.joinChat = function(socket, data) {

}

//Handler for 'startChat' request
Server.prototype.startChatHandler = function(socket, request, response) {
	var self = this;
	debug.trace("startChatHandler, request: "+JSON.stringify(request));
	var chat = new Chat(self.generateKey());
	debug.info("chat key: "+chat.key);
	self.chats[chat.key] = chat;
	request.data.chatKey = chat.key;
	self.joinChatHandler(socket, request, response);
}

//Handler for 'joinChat' request
Server.prototype.joinChatHandler = function(socket, request, response) {
	var self = this;
	debug.trace("joinChatHandler, request: "+JSON.stringify(request));
	if (!request.data.chatKey) {
		response(Misc.getErrorResponse("ERR_NO_KEY", "No chat key specified"));
		return;
	}

	var chat = self.chats[request.data.chatKey];
	if (!chat) {
		response(Misc.getErrorResponse("ERR_NO_CHAT", "No chat with this key"));
		return;
	}

	socket.join(String(chat.key));
	var usr = chat.addUser(request.data.name, socket.id);
	socket.custom.chatKey = chat.key;
	socket.custom.usrName = usr.name;
	self.sendResponseToChatRoom(chat.key, {
		type: "userJoined",
		data : {
			name : usr.name,
			key : chat.key
		}
	});	
	response(null);
}

//Handler for 'sendMessage' request
Server.prototype.sendMessageHandler = function(socket, request, response) {
	var self = this;
	debug.trace("sendMessageHandler");
	if (!socket.custom.chatKey) {
		debug.warn("User does not particiate in any chat");
		response(Misc.getErrorResponse("ERR_NO_KEY","This user does not participate in any chat"));
		return;
	}

	var chat = self.chats[socket.custom.chatKey];
	if (!chat) {
		response(Misc.getErrorResponse("ERR_NO_CHAT","No chat with key "+socket.custom.chatKey));
		return;
	}

	self.sendResponseToChatRoom(chat.key, {
		type : "newMessage",
		data : {
			name : socket.custom.usrName,
			text : request.data.text
		}
	});

	response(null);
}


var srv = new Server();

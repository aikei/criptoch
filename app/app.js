'use strict';

// Declare app level module which depends on views, and components

var module = angular.module('crApp', [
  'ngRoute',
  'crApp.startView',
  'crApp.chatView',
  'crApp.version',
  "crLogger"
]);

//connector service handles socket.io connection to the server
module.factory("connector", [ "$rootScope", "loggerService", function($rootScope, loggerService) {
  var service = {};
  var serverUrl = window.location.hostname;
  var logger = loggerService.getLogger("connector");
  logger.trace("connector factory");
  serverUrl += ":6677";
  service.socket = null;

  service.connect = function(namespace) {
    if (service.socket) {
      service.socket.disconnect();
    }
    namespace = namespace || "";
    service.socket = io.connect(serverUrl+namespace, {
      transports: [ "websocket" ]
    });

    service.socket.on("serverResponse", function(resp) {
      logger.info("serverResponse received: "+JSON.stringify(resp));
      $rootScope.$broadcast("serverResponse",resp);
    });

    service.socket.on("connect", function() {
      logger.trace("socket connected");
    });

    service.socket.on("error", function(err) {
      logger.trace("socket error: "+JSON.stringify(err));
    });
  }

  service.startChat = function(response) {
    service.sendRequest({ type : "startChat" }, response);
  }

  service.joinChat = function(chatKey, response) {
    service.sendRequest({
      type : "joinChat", 
      data : {
        chatKey : chatKey
      }
    }, response);
  }

  service.sendRequest = function(request, response) {
    logger.trace("sending request: "+JSON.stringify(request));
    if (!response) {
      response = function() {};
    }
    if (typeof request === "string") {
      request = { type : request }
    }
    if (!request.data) {
      request.data = {};
    }
    service.socket.emit("request", request, response);
  }

  service.isConnected = function() {
    return service.socket !== null;
  }
  if (!service.isConnected()) {
    service.connect();
  }
  return service;
}]);

//chat info service provides chatKey, current user name and list of all users
module.factory("chatInfo", [ "$rootScope", function($rootScope) {
  var chatInfo = {
    chatKey: null,
    name : null,
    users: {}
  }
  return chatInfo;
}]);

//redirect to /startView on load
module.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');
	$routeProvider.otherwise({redirectTo: '/startView'});
}]);




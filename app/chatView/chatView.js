"use strict";

angular.module("crApp.chatView", ["ngRoute", "crLogger"])

.config(["$routeProvider", function($routeProvider, $rootScope) {


	$routeProvider.when("/chatView", {
		templateUrl: "chatView/chatView.html",
		controller: "ChatViewCtrl"
	});


}])

.controller("ChatViewCtrl", [ "$scope", "$location", "connector", "loggerService", "chatInfo", function($scope, $location, connector, loggerService, chatInfo) {
	var logger = loggerService.getLogger("ChatViewCtrl");
	var ctrl = this;
	logger.info("chatView isConnected: "+connector.isConnected());

	$scope.messages = [];
	$("#entry_field").textinput();

	$scope.onEntryFieldKeyPress = function(event) {
		console.log("keypress, event: ",event);
		if (event.which === 13) {
			$scope.onSend();
		}		
	}

	ctrl.colors = { 
		1: "blue",
		2: "red",
		3: "green",
		4: "purple",
		5: "gray"
	}

	$scope.getNameColor = function(name) {
		logger.trace("getNameColor, name: "+name);
		if (ctrl.colors[name]) {
			return ctrl.colors[name];
		} else {
			return "yellow";
		}
	}

	$("#entry_field").focus();
	$("#chat_header").toolbar();
	$("#chat_header_text").html("Chat "+chatInfo.chatKey);

	$("#chat_area").css("height",window.screen.availHeight*0.6);
	$("#entry_field").css("height",window.screen.availHeight*0.1);

	$scope.onSend = function() {
		logger.trace("onSend");
		var txt = $("#entry_field").val();
		if (txt.length > 0) {
			$("#entry_field").val("");
			logger.info("window.nodeCrypto: ",window.nodeCrypto)
			txt = window.nodeCrypto.encrypt(txt,chatInfo.chatKey+chatInfo.password);
			connector.sendRequest({ type: "sendMessage", data: { text: txt }});
		}		
	}

	$scope.$on("serverResponse", function(event, resp) {
		logger.info("serverResponse received: "+JSON.stringify(resp));
		if (resp.type === "newMessage") {
			resp.data.text = window.nodeCrypto.decrypt(resp.data.text,chatInfo.chatKey+chatInfo.password);
			$scope.messages.push(resp.data);
			$scope.$apply();
			
			var chatArea = $("#chat_area");
			var height = chatArea[0].scrollHeight;
			chatArea.scrollTop(height);			
		}
	});

	$scope.copyToClipboard = function() {
		logger.trace("copyToClipboard");
		var elem = document.getElementById("hidden_input");
		var currentFocus = document.activeElement;
		elem.focus();
		elem.setSelectionRange(0, elem.value.length);
		var success;
		try {
			success = document.execCommand("copy");
		} catch(err) {
			logger.warn("Error coping to clipboard: "+JSON.stringify(err));
			success = false;
		}
		if (currentFocus && typeof currentFocus.focus === "function") {
        	currentFocus.focus();
    	}
	}

	logger.info("chatInfo: "+JSON.stringify(chatInfo));
	if (chatInfo.chatKey === null) {
		logger.info("chatKey is null, returning");
		$location.path("/startView");
	}
}]);
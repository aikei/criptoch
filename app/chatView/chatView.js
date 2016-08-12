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
	logger.info("chatView isConnected: "+connector.isConnected());

	$scope.messages = [];
	$("#entry_field").textinput();
	$("#send_button").click(function() {
		onSend();
	});

	$("#entry_field").keypress(function(event) {
		if (event.which === 13) {
			onSend();
		}
	});

	$("#entry_field").focus();
	$("#chat_header").toolbar();

	$("#chat_header_text").html("Chat "+chatInfo.chatKey);

	function onSend() {
		var txt = $("#entry_field").val();
		if (txt.length > 0) {
			$("#entry_field").val("");
			logger.info("window.nodeCrypto: ",window.nodeCrypto)
			txt = window.nodeCrypto.encrypt(txt,chatInfo.chatKey);
			connector.sendRequest({ type: "sendMessage", data: { text: txt }});
		}		
	}

	$scope.$on("serverResponse", function(event, resp) {
		logger.info("serverResponse received: "+JSON.stringify(resp));
		if (resp.type === "newMessage") {
			resp.data.text = window.nodeCrypto.decrypt(resp.data.text,chatInfo.chatKey);
			$scope.messages.push(resp.data);
			$scope.$apply();
			
			var chatArea = $("#chat_area");
			var height = chatArea[0].scrollHeight;
			chatArea.scrollTop(height);			
		}
	});

	function copyToClipboard(elem) {
		logger.trace("copyToClipboard");
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

	$("#copy_button").click(function() {
		copyToClipboard(document.getElementById("hidden_input"));
	});

	logger.info("chatInfo: "+JSON.stringify(chatInfo));
	if (chatInfo.chatKey === null) {
		logger.info("chatKey is null, returning");
		$location.path("/startView");
	}
}]);
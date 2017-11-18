var proxy = {
	client: null,
	transport: null,
	log: {},
	loggedIn: false,
	intervalId: null,

	getDate: function() {
		return "[" + (new Date()).toISOString().split("T")[1].substr(0, 8) + "]"
	},

	init: function(url, licenseID, transport, version, opts) {
		this.transport = transport;
		if (version !== "") {
			version = "/v" + version;
		}
		switch (this.transport) {
			case "websocket":
				var protocol = (opts.secure) ? "wss://" : "ws://";
				var fullUrl = protocol + url + "/customer" + version + "/rtm/ws?license_id=" + licenseID;
				this.initWebsocket(fullUrl, "websocket");
				break;
			case "websocket-no-cookies":
				var protocol = (opts.secure) ? "wss://" : "ws://";
				var fullUrl = protocol + url + "/customer" + version + "/rtm/ws?license_id=" + licenseID + "&customer_id=" + opts.customerID;
				this.initWebsocket(fullUrl, "websocket without cookies");
				break;
			default:
				var protocol = (opts.secure) ? "https://" : "http://";
				var baseUrl = protocol + url;
				var path = "/customer" + version + "/rtm/sio";
				var query = { license_id: licenseID }
				this.initSocketIO(baseUrl, path, opts.transports, query);
		}
	},

	initWebsocket: function(url, currentTransport) {
		this.client = new WebSocket(url);
		this.client.onmessage = $.proxy(function(e) {
			this.onMessage(JSON.parse(e.data));
		}, this);
		this.client.onopen = $.proxy(function() {
			this.onConnect(currentTransport);
		}, this);
		this.client.onclose = $.proxy(this.onDisconnect, this);
		this._send = $.proxy(function(obj) {
			this.client.send(JSON.stringify(obj));
		});
		this.intervalId = setInterval($.proxy(function() {
			this.send('ping')
		}, this), 5000);
	},

	initSocketIO: function(baseUrl, path, transports, query) {
		this.client = io(baseUrl, { path: path, query: query, transports: transports });
		this.client.on("message", $.proxy(this.onMessage, this));
		this.client.on("connect", $.proxy(function() {
			this.onConnect(this.client.io.engine.transport.query.transport);
		}, this));
		this.client.on("disconnect", $.proxy(this.onDisconnect, this));
		this._send = $.proxy(function(obj) {
			this.client.emit("message", obj);
		});
	},

	onConnect: function(currentTransport) {
		var token = $("input[name=token]").val()
		console.log(this.getDate() + "%c connected on ", "color:grey;font-weight:bold", currentTransport);

		this.login(window.location.href, 'Bearer ' + token);
	},

	onDisconnect: function() {
		clearInterval(this.intervalId);
		console.log(this.getDate() + "%c disconnect", "color:grey;font-weight:bold");
	},

	onMessage: function(msg) {
		if (msg.type == "response") {
			if (this.log[msg.request_id]) {
				time = parseInt(+new Date - this.log[msg.request_id].timestamp)
				if (time > 1000) {
					time = parseFloat(time / 1000).toFixed(2)
					time = "(" + time + "s)"
				} else {
					time = "(" + time + "ms)"
				}
				delete(this.log[msg.request_id]);
				console.groupCollapsed(this.getDate() + "%c response: " + msg.action, (msg.success) ? "color:#649266" : "color:#a25f5b", time);
				console.log(JSON.stringify(msg, null, 4));
				console.groupEnd();

				if (msg.action == "login" && msg.success) {
					this.loggedIn = true;
					this.loggingIn = false;
					var url = $("select[name=api]").val();
					var licenseID = $("input[name=licenseID]").val();
					var transport = $("select[name=transport]").val();
					var customerID = $("input[name=customerID]").val();
					var version = $("select[name=version]").val();
					var token = $("input[name=token]").val();
					addToHistory(url, licenseID, transport, customerID, version, token);
					initHistory();
				}
			}
		} else {
			console.groupCollapsed(this.getDate() + "%c push: " + msg.action, "color:#016d9e");
			console.log(JSON.stringify(msg, null, 4));
			console.groupEnd();
		}
	},

	disconnect: function() {
		_this.client.close();
	},

	generateID: function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + '-' + s4() + '-' + s4();
	},

	send: function(action, payload, requestID) {
		if (requestID == null) {
			requestID = this.generateID();
		}
		obj = { "request_id": requestID, "action": action };
		if (payload) {
			obj.payload = payload;
		}
		this._send(obj);

		if (action === "ping") {
			return
		}

		this.log[requestID] = { action: action, timestamp: +new Date };
		console.groupCollapsed(this.getDate() + "%c sent: " + action, "color:grey");
		console.log(JSON.stringify(obj, null, 4));
		console.groupEnd();
	},

	login: function(pageUrl, token) {
		this.loggingIn = true;
		this.send("login", { "last_chats_limit": 5, token: token });
	},

	startChat: function(chat, initialEvents) {
		var obj = {}
		if (chat) {
			obj.chat = chat
		}
		if (initialEvents) {
			obj.initial_events = initialEvents
		}
		this.send("start_chat", obj);
	},

	joinChat: function(chatID, usersIDs) {
		this.send("join_chat", { "chat_id": chatID, "agent_ids": usersIDs });
	},

	closeThread: function(chatID) {
		this.send("close_thread", { "chat_id": chatID });
	},

	superviseChat: function(chatID, agentsIDs) {
		obj = { "chat_id": chatID };
		if (agentIDs) {
			obj.agent_ids = agentIDs;
		}
		this.send("supervise_chat", obj);
	},

	banCustomer: function(customerID, days) {
		this.send("ban_customer", { "customer_id": customerID, "ban": { "days": days } });
	},

	getChatThreads: function(chatID, threadIDs) {
		obj = { "chat_id": chatID };
		if (threadIDs) {
			obj.thread_ids = threadIDs;
		}
		this.send("get_chat_threads", obj);
	},

	getChatThreadsSummary: function(chatID, offset, limit) {
		obj = { "chat_id": chatID };
		if (offset) {
			obj.offset = offset;
		}
		if (limit) {
			obj.limit = limit;
		}
		this.send("get_chat_threads_summary", obj);
	},

	getChatsSummary: function(offset, limit) {
		obj = {};
		if (offset) {
			obj.offset = offset;
		}
		if (limit) {
			obj.limit = limit;
		}
		this.send("get_chats_summary", obj);
	},

	getArchives: function(page, filters) {
		obj = {}
		if (page) {
			obj.pagination = { "page": page }
		}
		if (filters) {
			obj.filters = filters
		}
		this.send("get_archives", obj);
	},

	markEventAsSeen: function(chatID, eventID) {
		this.send("mark_event_as_seen", { "chat_id": chatID, "event_id": eventID });
	},

	updateLastSeenTimestamp: function(chatID, timestamp) {
		this.send("update_last_seen_timestamp", { "chat_id": chatID, "timestamp": timestamp });
	},

	sendSneakPeek: function(chatID, text) {
		this.send("send_sneak_peek", { "chat_id": chatID, "sneak_peek_text": text });
	},

	removeFromChat: function(chatID, agentIDs, customerIDs) {
		obj = { "chat_id": chatID };
		if (agentIDs) {
			obj.agent_ids = agentIDs;
		}
		if (customerIDs) {
			obj.customer_ids = customerIDs;
		}
		this.send("remove_from_chat", obj);
	},

	sendMessage: function(chatID, text) {
		this.send("send_message", { "chat_id": chatID, "message": { "text": text } });
	},

	sendEvent: function(chatID, event) {
		this.send("send_event", { "chat_id": chatID, "event": event });
	},

	sendTypingIndicator: function(chatID) {
		this.send("send_typing_indicator", { "chat_id": chatID });
	},

	updateCustomer: function(customer) {
		this.send("update_customer", { "customer": customer });
	},

	updateChatThreadProperties: function(chatID, threadID, properties) {
		this.send("update_chat_thread_properties", { "chat_id": chatID, "thread_id": threadID, "properties": properties });
	},

	updateChatProperties: function(chatID, properties) {
		this.send("update_chat_properties", { "chat_id": chatID, "properties": properties });
	},

	updateAgent: function(agentID, routingStatus) {
		obj = {};

		if (agentID) {
			obj['agent_id'] = agentID;
		}
		if (routingStatus) {
			obj['routing_status'] = routingStatus
		}
		this.send("update_agent", obj);
	},

	updateChatScopes: function(chatID, addScopes, removeScopes) {
		obj = {
			chat_id: chatID
		};

		if (addScopes) {
			obj.add_scopes = addScopes;
		}
		if (removeScopes) {
			obj.remove_scopes = removeScopes;
		}

		this.send("update_chat_scopes", obj);
	},

	examples: {
		startChatMessage: function() {
			let initialEvents = [{
				"type": "message",
				"text": "hello from initial_events!"
			}]
			let initialProperties = {
				"rating": {
					"score": 1,
				}
			}

			proxy.startChat({ type: "license" }, {
				properties: initialProperties,
				thread: {
					events: initialEvents,
					properties: initialProperties
				}
			})
		},
		startChatPreChat: function() {
			proxy.startChat({ type: "license" }, null, [{
				"type": "filled_form",
				"fields": [{
						"type": "title",
						"name": "title",
						"label": "How are you my friend?",
					},
					{
						"type": "information",
						"name": "information",
						"label": "This is a simple example of useless information. Keep reading...",
					},
					{
						"type": "text",
						"name": "name",
						"label": "Your name",
						"value": "Jan Kowalski"
					},
					{
						"type": "email",
						"name": "email",
						"label": "Your email",
						"value": "jan@kowalski.com"
					}
				]
			}])
		},
		sendFilledForm: function(chatID) {
			proxy.sendEvent(chatID, {
				"type": "filled_form",
				"fields": [{
						"type": "title",
						"name": "title-1",
						"label": "How are you my friend?",
					},
					{
						"type": "information",
						"name": "info-1",
						"label": "This is a simple example of useless information. Keep reading...",
					},
					{
						"type": "text",
						"name": "name",
						"required": true,
						"label": "Your name",
						"value": "Jan Kowalski"
					},
					{
						"type": "email",
						"name": "email",
						"required": true,
						"label": "Your email",
						"value": "jan@kowalski.com"
					}
				]
			});
		},
	}

}

addToHistory = function(url, licenseID, transport, customerID, version, token) {
	customerHistory = {
		url: url,
		licenseID: licenseID,
		transport: transport,
		customerID: customerID,
		version: version,
		token: token,
	};
	localStorage.setItem("customer_history", encodeURIComponent(JSON.stringify(customerHistory)));
}

initHistory = function() {
	var $loginForm = $('form[name=login]');
	var $transport = $loginForm.find('select[name=transport]');
	var $customerID = $loginForm.find('input[name=customerID]');
	var $api = $loginForm.find("select[name=api]");
	var $licenseID = $loginForm.find("input[name=licenseID]");
	var $version = $("select[name=version]");
	var $token = $("input[name=token]");

	$api.find("option[value=\"" + customerHistory.url + "\"]").prop("selected", true);
	$transport.find("option[value=\"" + customerHistory.transport + "\"]").prop("selected", true);
	$licenseID.val(customerHistory.licenseID);
	$customerID.toggle($transport.val() === "websocket-no-cookies");
	$customerID.val(customerHistory.customerID);
	$token.val(customerHistory.token);
	$version.find("option[value=\"" + customerHistory.version + "\"]").prop("selected", true);

}

var customerHistory = null

$(function() {

	var client = null
	var $loginForm = $('form[name=login]');
	var $transport = $loginForm.find('select[name=transport]');
	var $customerID = $loginForm.find('input[name=customerID]');
	var $token = $loginForm.find('input[name=token]');
	var $api = $loginForm.find("select[name=api]");
	var $licenseID = $loginForm.find("input[name=licenseID]");
	var $version = $("select[name=version]");
	var $token = $("input[name=token]");
	var $getToken = $("a.get-token");

	customerHistory = localStorage.getItem("customer_history");
	if (customerHistory == null) {
		customerHistory = {};
	} else {
		customerHistory = JSON.parse(decodeURIComponent(customerHistory));
		initHistory();
	}


	$transport.on("change", function(event) {
		$customerID.toggle($transport.val() === "websocket-no-cookies");
	});

	$loginForm.on("submit", function(event) {
		event.preventDefault();
		return false;
	});

	$getToken.on("click", function() {
		event.preventDefault();
		var url = $api.find(':selected').data('sso') + '/customer/?license_id=' + $licenseID.val();
		var win = window.open(url, '_blank');
		if (!win) {
			console.log("blocked: " + url)
		}
		return false;
	});

	$loginForm.find(".connect").on("click", function(event) {

		if (!proxy.loggedIn && !proxy.loggingIn) {
			var url = $api.val();
			var licenseID = $licenseID.val();
			var transport = $transport.val();
			var version = $version.val();
			var token = $token.val();

			var opts = {
				secure: $api.find(':selected').data('secure')
			}

			if ($transport.val() === "websocket-no-cookies") {
				opts.customerID = $customerID.val();
			}

			if ($transport.find(':selected').data('transports')) {
				opts.transports = $transport.find(':selected').data('transports').split(',');
			}

			proxy.init(url, licenseID, transport, version, opts);
		}
		// if (!proxy.loggingIn) {
		// 	proxy.loggingIn = true;
		// 	proxy.login(window.location.href);
		// }
	})

	$loginForm.find(".disconnect").on("click", function(event) {
		proxy.disconnect();
		proxy.loggedIn = false;
		proxy.loggingIn = false;
	})
})
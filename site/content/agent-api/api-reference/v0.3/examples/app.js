var proxy = {
    client: null,
    transport: null,
    lastToken: "",
    lastURL: "",
    log: {},

    getDate: function() {
        return "[" + (new Date()).toISOString().split("T")[1].substr(0, 8) + "]"
    },

    init: function(url, transport, version, opts) {
        this.lastURL = url
        this.transport = transport
        if (version !== "") {
            version = "/v" + version;
        }
        switch (this.transport) {
            case "websocket":
                var protocol = (opts.secure) ? "wss://" : "ws://";
                var fullUrl = protocol + url + "/agent" + version + "/rtm/ws";
                this.initWebsocket(fullUrl, "websocket");
                break;
            default:
                var protocol = (opts.secure) ? "https://" : "http://";
                var baseUrl = protocol + url;
                var path = "/agent" + version + "/rtm/sio";
                this.initSocketIO(baseUrl, path, opts.transports);
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
        setInterval($.proxy(function() {
            this.send('ping')
        }, this), 5000)
    },

    initSocketIO: function(baseUrl, path, transports) {
        this.client = io(baseUrl, { path: path, transports: transports });
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
        console.log(this.getDate() + "%c connect on", "color:grey;font-weight:bold", currentTransport);
        token = $('form[name=login]').find("input[name=authorization]").val();
        proxy.login('Bearer ' + token)
    },

    onDisconnect: function() {
        console.log(this.getDate() + "%c disconnect", "color:grey;font-weight:bold");
    },

    onMessage: function(msg) {
        if (msg.type == "response") {
            if (this.log[msg.id]) {
                time = parseInt(+new Date - this.log[msg.id].timestamp)
                if (time > 1000) {
                    time = parseFloat(time / 1000).toFixed(2)
                    time = "(" + time + "s)"
                } else {
                    time = "(" + time + "ms)"
                }
                delete(this.log[msg.id]);
                console.groupCollapsed(this.getDate() + "%c response: " + msg.action, (msg.success) ? "color:#649266" : "color:#a25f5b", time);
                console.log(JSON.stringify(msg, null, 4));
                console.groupEnd();

                if (msg.action == "login") {
                    var token = $("input[name=authorization]").val();
                    if (msg.success) {
                        this.loggedIn = true;
                        this.loggingIn = false;
                        var url = $("select[name=api]").val();
                        var transport = $("select[name=transport]").val();
                        var version = $("select[name=version]").val();
                        addToHistory(url, token, msg.payload.my_profile.id, msg.payload.license_id, transport, version);
                        initHistory();
                    } else {
                        if (msg.payload.error.type == "login" && agentHistory.list[token]) {
                            if (confirm("This token is invalid. Do you want to remove it from history?")) {
                                delete agentHistory.list[token];
                                saveToHistory();
                                window.location.reload();
                            }
                        }
                    }
                }
            }
        } else {
            console.groupCollapsed(this.getDate() + "%c push: " + msg.action, "color:#016d9e");
            console.log(JSON.stringify(msg, null, 4));
            console.groupEnd();
        }
    },

    disconnect: function() {
        this.client.close();
    },

    generateID: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + '-' + s4() + '-' + s4();
    },

    send: function(action, payload, id, authorID) {
        if (id == null) {
            id = this.generateID();
        }
        obj = { "id": id, "action": action };
        if (payload) {
            obj.payload = payload;
        }
        if (authorID) {
            obj.author_id = authorID
        }
        this._send(obj);

        if (action === "ping") {
            return
        }

        this.log[id] = { action: action, timestamp: +new Date };
        console.groupCollapsed(this.getDate() + "%c sent: " + action, "color:grey");
        console.log(JSON.stringify(obj, null, 4));
        console.groupEnd();
    },

    authorization: function(token) {
        this.lastToken = token
        this.send("authorization", { "token": token })
    },

    login: function(token) {
        this.lastToken = token
        this.send("login", {
            "token": token,
            "application": {
                "name": "AgentAPI Test App",
                "version": scriptVersion,
            },
            "push_notifications": {
                "firebase_token": "some_truly_random_string",
                "platform": "ios"
            }
        });
    },

    changePushNotifications: function(token, enabled) {
        this.send("change_push_notifications", { firebase_token: token, enabled: enabled });
    },

    startChat: function(chat) {
        obj = {}

        if (chat) {
            obj.chat = chat
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

    sendBroadcast: function(scopes, content) {
        this.send("send_broadcast", { scopes: scopes, content: content });
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

    getFilterdChats: function(filters) {
        obj = {
            "filters": filters,
        };
        if (!filters) {
            obj.filters = {
                "properties": {
                    "routing": {
                        "pinned": {
                            "values": [true]
                        }
                    }
                },
                include_active: false
            }
        }
        this.send("get_filtered_chats", obj);
    },

    getArchives: function(page, limit, filters) {
        obj = {}
        obj.pagination = { "page": page, "limit": limit }

        if (filters) {
            obj.filters = filters
        }
        this.send("get_archives", obj);
    },

    markEventAsSeen: function(chatID, eventID) {
        console.log("markEventAsSeen is deprecated.")
            // this.send("mark_event_as_seen", {"chat_id": chatID, "event_id": eventID});
    },

    updateLastSeenTimestamp: function(chatID, timestamp) {
        this.send("update_last_seen_timestamp", { "chat_id": chatID, "timestamp": timestamp });
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

    sendMessage: function(chatID, text, recipients) {
        this.send("send_message", { "chat_id": chatID, "message": { "text": text, "recipients": recipients } });
    },

    sendEvent: function(chatID, event) {
        this.send("send_event", { "chat_id": chatID, "event": event });
    },

    sendTypingIndicator: function(chatID, isTyping, recipients) {
        obj = { "chat_id": chatID, "is_typing": isTyping }
        if (recipients) {
            obj.recipients = recipients;
        }
        this.send("send_typing_indicator", obj);
    },

    updateCustomer: function(chatID, customer) {
        this.send("update_customer", { "chat_id": chatID, "customer": customer });
    },

    updateChatProperties: function(chatID, props) {
        this.send("update_chat_properties", { "chat_id": chatID, "properties": props });
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
                "routing": {
                    "pinned": true,
                }
            }

            proxy.startChat({
                properties: initialProperties,
                thread: {
                    events: initialEvents,
                    // properties: initialProperties
                }
            })
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
            });
        },
    }

}

addToHistory = function(url, token, login, licenseID, transport, version) {
    var last = {
        url: url,
        licenseID: licenseID,
        token: token,
        login: login,
        transport: transport,
        version: version,
    }

    agentHistory.last = last
    agentHistory.list[token] = last
    saveToHistory()
}

saveToHistory = function() {
    localStorage.setItem("agent_history", encodeURIComponent(JSON.stringify(agentHistory)));
}

initHistory = function() {
    var $authselect = $('select[name=authorization_select]');
    var $auth = $('input[name=authorization]');
    var $api = $("select[name=api]");
    var $transport = $("select[name=transport]");
    var $version = $("select[name=version]");

    if (agentHistory) {
        $api.find("option[value=\"" + agentHistory.last.url + "\"]").prop("selected", true);

        $authselect.empty()
        for (var i in agentHistory.list) {
            $option = $("<option></option>");
            $option.val(i);
            $option.text(
                "[" + agentHistory.list[i].licenseID + "] " +
                agentHistory.list[i].login +
                " (" + i + ")");
            $authselect.append($option);
        }
        $authselect.show()
        $authselect.find("option[value=\"" + agentHistory.last.token + "\"]").prop("selected", true);
        $auth.val($authselect.val());

        $transport.find("option[value=\"" + agentHistory.last.transport + "\"]").prop("selected", true);
        $version.find("option[value=\"" + agentHistory.last.version + "\"]").prop("selected", true);
    }

}

fetchHeader = function(url, header, callback) {
    var req = new XMLHttpRequest();
    req.open("HEAD", url, true);
    req.send(null);
    req.onload = function() {
        if (req.status == 200) {
            callback(req.getResponseHeader(header));
        } else {
            callback(false);
        }
    }
}

var scriptVersion = null;
var agentHistory = null;

$(function() {

    var client = null;
    var $login = $('form[name=login]');
    var $auth = $('input[name=authorization]');
    var $authselect = $('select[name=authorization_select]');
    var $transport = $("select[name=transport]");
    var $api = $("select[name=api]");
    var $version = $("select[name=version]");

    fetchHeader('app.js', 'Last-Modified', function(val) {
        scriptVersion = val;
    });

    agentHistory = localStorage.getItem("agent_history");
    if (agentHistory == null) {
        agentHistory = {
            last: {},
            list: {}
        };
    } else {
        $authselect.show();
        agentHistory = JSON.parse(decodeURIComponent(agentHistory));
        initHistory();
    }

    $authselect.on("change", function(event) {
        value = $authselect.val();
        $auth.val(value);
    });

    $login.on("submit", function(event) {
        event.preventDefault();
        return false;
    })

    $login.find(".connect").on("click", function(event) {
        url = $login.find("select[name=api]").val();
        var transport = $transport.val();
        var version = $version.val();

        var opts = {
            secure: $api.find(':selected').data('secure'),
        }

        if ($transport.val() !== "websocket") {
            opts.transports = $transport.find(':selected').data('transports').split(',');
        }

        proxy.init(url, transport, version, opts);
    })

    $login.find(".disconnect").on("click", function(event) {
        proxy.disconnect();
    })
})
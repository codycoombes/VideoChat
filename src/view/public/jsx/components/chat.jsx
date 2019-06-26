import React from 'react';
import ReactDOM from 'react-dom';
import { ChatFeed, Message, ChatInput } from 'react-chat-ui'

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this._onMessageSubmit = this._onMessageSubmit.bind(this);
		var name = this.props.username || randomName();
		setupSocket(name, this.props.room);
		this.state = {
			messages: [],
			user_id: 0,
			room: this.props.room,
			user_name: name, //TODO: query db for user_name, pass in with props
			token: "",
			delegate: this.props.delegate,
		};
		var that = this;
		ws.onmessage = function (event) {
			var payload = JSON.parse(event.data);
			var actionSpec = payload.actionSpec;
			switch (payload.actionType) {
				case 'messageBroadcast':
					payload.actionSpec = JSON.parse(actionSpec);
					var messageText = payload.actionSpec.message;
					var senderName = payload.actionSpec.name;
					var token = payload.actionSpec.token;
					var id = (token === that.state.token) ? 0 : 1;
					if (id !== 0) {
						messageText = messageText;
					}
					that.state.messages.push(new Message({
						id: id,
						message: messageText,
						senderName: senderName
					}));
					that.forceUpdate();
					break;
				case 'syncBroadcast':
					that.props.callback(actionSpec);
					// that.syncVideoIn(actionSpec, player);
					break;
				default: console.log(payload.actionType);
			}
		}
	}
	componentDidMount() {
		console.log("component Chat didMount()");
		this.scrollToBottom();
	}
	componentDidUpdate() {
		this.scrollToBottom();
	}

	_onMessageSubmit(e) {
		var input = this.refs.message;
		e.preventDefault();
		if (!input.value) { return false; }
		this._pushMessage(input.value)
		input.value = '';
	}
	_pushMessage(messageText) {
		console.log("_pushMessage:", messageText);
		this.state.token = randomString()
		messageRoom(
			this.state.user_name,
			this.state.room,
			messageText,
			this.state.token);
	}
	syncVideoOut(player) {
		var playing = player.isPlaying();
		var currentTime = player.currentTime();
		if (!playing) {
			player.pauseVideo();
			console.log("trying to pause video");
		} else {
			player.playVideo();
			console.log("trying to play video");
		}
		var payload = {};
		payload["actionType"] = 'sync';
		var actionSpec = {}
		actionSpec["room"] = this.props.room;
		actionSpec["playing"] = playing;
		actionSpec["timestamp"] = currentTime;
		payload["actionSpec"] = actionSpec;
		ws.send(JSON.stringify(payload));
		console.log(JSON.stringify(payload));
	}

	scrollToBottom() {
		const node = ReactDOM.findDOMNode(this.messagesEnd);
		node.scrollIntoView({ behavior: "smooth" });
	}
	render() {
		var flexHeight = {
			flex: 1,
			minHeight: '75vh',
			background: '#fff'
		}
		return (
			<div>
				<div style={flexHeight}>
					<ChatFeed
						messages={this.state.messages}
						hasInputField={false}
					/>
				</div>
				<form onSubmit={this._onMessageSubmit}>
					<input ref="message" placeholder="Type a message..." style={styles.inputStyle} />
				</form>
				<div style={{ float: "left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }} />
			</div>
		);
	}
}

const styles = {
	chatPanel: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
	},
	chatHistory: {
		overflow: 'scroll',
	},
	chatbubbleWrapper: {
		marginTop: 10,
		marginBottom: 10,
		overflow: 'auto',
		position: 'relative',
	},
	img: {
		borderRadius: 100,
		bottom: 0,
		left: 0,
		position: 'absolute',
		width: 36,
		zIndex: 100,
	},
	inputStyle: {
		flex: 1,
		flexDirection: 'column',
		border: 'none',
		borderTopWidth: '1',
		borderTopStyle: 'solid',
		borderTopColor: '#ddd',
		fontSize: '16',
		outline: 'none',
		padding: '30',
		width: '100%',
	},
}

const ws = new WebSocket('ws://localhost:8088');
function messageRoom(name, room, message, token) {
	var payload = {};
	payload["actionType"] = 'message';
	var actionSpec = {};
	actionSpec["name"] = name;
	actionSpec["room"] = room;
	actionSpec["message"] = message;
	actionSpec["token"] = token;
	payload["actionSpec"] = actionSpec;
	ws.send(JSON.stringify(payload));
}
function setupSocket(name, room) {
	console.log("setupSocket()");
	ws.onopen = function (event) {
		var payload = {};
		payload["actionType"] = "join"
		var actionSpec = {};
		actionSpec["name"] = name
		actionSpec["room"] = room
		payload["actionSpec"] = actionSpec
		ws.send(JSON.stringify(payload));
	};
	window.onbeforeunload = function (e) {
		console.log("closing ws connection")
	}
	ws.onclose = function (e) {
		console.log("ws.onclose on client side");
	}

	function sendAction(actionType) {
		switch (actionType) {
			case 'join':
				joinRoom(nameValue, roomValue);
				break;
			case 'message':
				messageRoom(nameValue, roomValue, messageValue);
				break;
			case 'sync':
				syncVideoOut(player);
				break;
			default: console.log("sendAction unknown actionType: ", actionType);
		}
	}
	function joinRoom(name, room) {
		var payload = {};
		payload["actionType"] = "join";
		var actionSpec = {};
		actionSpec["name"] = name;
		actionSpec["room"] = room;
		payload["actionSpec"] = actionSpec;
		ws.send(JSON.stringify(payload));
	}
}
function randomString() {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = '';
	for (var i = 5; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}
function randomName() {
	return "Unknown-" + randomString();
}


import {doCheckLogin, doLogout} from "../actions/loginActions"

class WebSocketHelper {


    actions = null;
    dispatch = null;
    ws = null;


    static wsURL = (path)  => {
        var protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
	console.log("location.pathname is " + location.pathname);
	var pathname = location.pathname;
	
        var url = protocol + location.host + pathname;
        // if(location.hostname === 'localhost') {
        //    url += '/' + location.pathname.split('/')[1]; // add context path
        // }
        console.log("WebsocketConnection:"+url+path);
        return url + path;
    }


    static ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }


    openConnection(pActions,pDispatch, wsPath) {

        console.log("Inside openConnection of WebSocketHelper");
        if (this.ws && this.ws.readyState == WebSocket.OPEN) {
            console.log("closing previous webSocket connection before opening a new connection ");
            this.ws.close();
        }

        this.actions = pActions;
        this.dispatch = pDispatch;
        this.ws = new WebSocket(WebSocketHelper.wsURL(wsPath));

        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage =  this.onMessage.bind(this);
        this.ws.onclose = this.onClose.bind(this);

    }


    onOpen(event) {
        console.log("received event on open " + JSON.stringify(event) + " " + JSON.stringify(event.data));

        var sendObject = { name : "initConnection", data : "hello world!"};
        this.ws.send(JSON.stringify(sendObject));

    }

    onMessage = (event) => {
        if (event.data instanceof ArrayBuffer ) {
            this.actions.receiveArrayBuffer(event.data);
        } else {
            // we expect it to be JSON ...
            var json = JSON.parse(event.data);
            this.actions.receiveJSON(json);
        }
    };

    onClose = (event) => {
        console.log("Receiving onClose on webSocket connection, checking if we are still logged in.");
        // then the current websocket is closed, and we check, if we somehow still are logged in ....
        doCheckLogin(this.actions);
    }



    close() {

        console.log("WebSocketHelper close ....");
        if (this.ws && this.ws.readyState == WebSocket.OPEN) {
            console.log("Now closing the WebSocket ");
            this.ws.close();
        }
    }



    callWebSocketFunction(name, data) {

        var sendObject = { name : name, data : data};
        this.ws.send(JSON.stringify(sendObject));
    }
}


export default WebSocketHelper;

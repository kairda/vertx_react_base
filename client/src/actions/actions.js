import Request from 'superagent';
import WebSocketHelper from './../websocket/websocket-helper';

import { handleBusinessMessages } from "./businessActions"

class Actions {

    dispatch = null;
    wsh = null;

    initDispatch(pDispatch) {
        this.dispatch = pDispatch;
    }

    doWebSocketConnection(wsPath) {
        this.wsh = new WebSocketHelper();
        this.wsh.openConnection(this,this.dispatch, wsPath);
    }

    doCloseWebSocketConnection() {
        if (this.wsh) {
            this.wsh.close();
        }
        this.wsh = null;
    }


    doServerCall(name, endFunction) {
        Request.get(name)
            .end(endFunction);
    }

    doServerCallWebSocket(name, data) {
        if (this.wsh) {
            this.wsh.callWebSocketFunction(name, data);
        }
    }

    receiveArrayBuffer(data) {
        var mystrdata = WebSocketHelper.ab2str(event.data);
        console.log("Received arrayBuffer, converted to string ..." + mystrdata);
    }

    receiveJSON(json) {
        if (!handleBusinessMessages(this.dispatch, json)) {
            console.log("Could not handle message " + JSON.stringify(json));
        }
    }
}

export default Actions;

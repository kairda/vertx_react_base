import Request from 'superagent';
import WebSocketHelper from './../websocket/websocket-helper';

import { Component } from 'react';
import { connect } from 'react-redux';

import { handleBusinessMessages } from "./businessActions"

class Actions extends Component {

    dispatch = null;
    wsh = null;

    initDispatch(pDispatch) {
        this.dispatch = pDispatch;
    }

    doWebSocketConnection(wsPath) {
        if (this.wsh != null) {
            this.wsh.close();
        }
        this.wsh = new WebSocketHelper();
        this.wsh.openConnection(this,this.dispatch, wsPath);
    }

    doCloseWebSocketConnection() {
        if (this.wsh) {
            console.log("Calling close on WebSocketHelper");
            this.wsh.close();
        }
        this.wsh = null;
    }


    doServerCall(name, endFunction) {
        Request.get(name)
            .end(endFunction);
    }

    doServerPostCall(name,headers,endFunction) {

        Request.post('/api/login')
            .set('Accept', 'application/json')
            .send( headers )
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

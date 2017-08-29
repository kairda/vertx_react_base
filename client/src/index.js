import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux'
import { createStore } from 'redux'

import combinedReducer from './redux/combinedReducer'

import Actions from "./actions/actions"
import { doCheckLogin} from "./actions/loginActions"

import NavBar from './NavBar';
import App from './App';


var actions = new Actions();

const store = createStore(
    combinedReducer, { counter : { counter : 0 },
        login : { loginInfo : "Not logged in" } ,
        base : { actions: actions } }
);

actions.initDispatch(store.dispatch);

// if we are logged in, then the websocket-connection is started ...

let app = <App />

// having the "Provider" with the global store
// allows App to be connected ... (see App.js)
render((
    <Provider store={store}>
        <NavBar content={app}/>
    </Provider>
    )
    , document.getElementById("root"));

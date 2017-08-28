import React from 'react';
import { render } from 'react-dom';


import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { counterReducer} from "./redux/counterReducer"

import { doServerCall, doCheckLogin } from "./actions/actions"

const store = createStore(
    counterReducer, { counter : 0, loginInfo : "Not logged in" }
);

// this does the initial call to the server to that the value of the counter
// is incremented when the app starts.


doCheckLogin(store.dispatch);

doServerCall(store.dispatch);

import NavBar from './NavBar';

import App from './App';


let app = <App />
// having the "Provider" with the global store
// allows App to be connected ... (see App.js)
render((
    <Provider store={store}>
        <NavBar  content={app}/>
    </Provider>
    )
    , document.getElementById("root"));

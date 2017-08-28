import React from 'react';
import { render } from 'react-dom';


import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { counterReducer} from "./redux/counterReducer"

import { doServerCall} from "./actions/actions"

const store = createStore(
    counterReducer, { counter : 0  }
);

// this does the initial call to the server to that the value of the counter
// is incremented when the app starts.
doServerCall(store.dispatch);

import App from './App';



// having the "Provider" with the global store
// allows App to be connected ... (see App.js)
render((
    <Provider store={store}>
        <App  />
    </Provider>), document.getElementById("root"));

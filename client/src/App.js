import React, {Component} from 'react';

import {connect} from 'react-redux';


class App extends Component {

    constructor(props) {
        // console.log("Props is " + JSON.stringify(props));
        super(props);
    }


    render() {
        return (

            <div>
                <h1>Hello, Material Components!</h1>

                <section>
                    <h2>Counter</h2>
                    <h3>Zählt hoch</h3>
                    <p>
                        Counter is {this.props.counter}
                    </p>
                </section>

                <button
                    onClick={this.props.doServerCall.bind(this, this.props.actions)}
                    disabled={!this.props.isLoggedIn}>
                    Server-Call Counter Increase
                </button>

            </div>

        );
    }
}


// the state is the global store state
// we connect the local property "counter" to the global state
export default connect((state) => ( {
        isLoggedIn: state.login.isLoggedIn,
        counter: state.counter.counter,
        actions: state.base.actions
    } ),
    (dispatch) => ( {                         // the dispatch is provided by react-redux
        doServerCall: (actions) => {           // it is used to put transport the action to
            actions.doServerCallWebSocket('counter')      // the reducers, resulting in a change in the global state
        },
        doActionCall: (actions) => {
            actions.doServerCallWebSocket('action')
        }
    }))(App);
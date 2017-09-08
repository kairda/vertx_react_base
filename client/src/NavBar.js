import React, {Component} from 'react';
import {connect} from 'react-redux';

import { Container } from 'react-bootstrap'
import {doCheckLogin, doTryLogin, doLogout} from "./actions/loginActions"

import LoginView from './views/LoginView'

class NavBar extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        // this will check, if we are logged in ...
        this.props.doCheckLogin(this.props.actions);
    }

    render() {
        return (
            <div>
                <div style={{ width: "100%", height: "40px"}}>Simple Plain Example
                    <span style={{ align: "right"}}>{this.props.loginInfo}</span></div>


                <section className="container">
                    {!this.props.isLoggedIn ?
                        <div>
                            <LoginView/>

                        </div> :
                        <div>
                            <button
                                onClick={this.props.doLogoutServerCall.bind(this, this.props.actions, this.props.loginInfo)}>
                                Logout
                            </button>

                            <div className="container">
                            {this.props.content}
                            </div>
                        </div>
                    }
                </section>
            </div>
        );
    }
}

// the state is the global store state
// we connect the local property "counter" to the global state
export default connect((state) => ({
        isLoggedIn: state.login.isLoggedIn,
        loginInfo: state.login.loginInfo,
        actions: state.base.actions
    }),
    (dispatch) => ({
        doCheckLogin: (actions) => {
            doCheckLogin(actions)
        },
        doLoginServerCall: (actions, loginInfo) => {
            doTryLogin(actions, loginInfo, "kai", "sausages");
        },
        doLogoutServerCall: (actions, loginInfo) => {
            doLogout(actions, loginInfo);
        }
    }))(NavBar);
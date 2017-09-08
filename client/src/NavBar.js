import React, {Component} from 'react';
import {connect} from 'react-redux';

import Toolbar from 'react-md/lib/Toolbars';

import Button from 'react-md/lib/Buttons/Button';

import ToolbarMenu from './ToolbarMenu';

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


    nav = <Button key="nav" icon>menu</Button>;

    actions =  [
        <ToolbarMenu key="menu"/>
    ];
    render() {


        return (

            <div>
                <Toolbar
                    colored
                    title="Simple react-md Sample"
                    nav={this.nav}
                    actions={this.actions}
                />

                <section>
                    {!this.props.isLoggedIn ?
                        <div>
                            <LoginView/>

                        </div> :
                        <div>
                            <Button flat
                                onClick={this.props.doLogoutServerCall.bind(this, this.props.actions, this.props.loginInfo)}
                                label="Logout" />

                            {this.props.content}
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
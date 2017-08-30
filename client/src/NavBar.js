import React, {Component} from 'react';
import {connect} from 'react-redux';

import { Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle,  Content, Button } from 'react-mdc-web'
import {doCheckLogin, doTryLogin, doLogout } from "./actions/loginActions"

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
                <Toolbar>
                    <ToolbarRow>
                        <ToolbarSection align="start">
                            <a href="#" className="material-icons mdc-toolbar__icon--menu">menu</a>
                            <ToolbarTitle>Title</ToolbarTitle>
                            {this.props.loginInfo}
                        </ToolbarSection>
                    </ToolbarRow>
                </Toolbar>

            <Content>
                {!this.props.isLoggedIn ?
                <div>
                    <LoginView />

                </div> :
                    <div>
                    <Button raised primary
                            onClick={this.props.doLogoutServerCall.bind(this, this.props.actions, this.props.loginInfo)}>
                        Logout
                    </Button>

                        {this.props.content}
                    </div>
                }
            </Content>
            </div>
        );
    }
}

// the state is the global store state
// we connect the local property "counter" to the global state
export default connect((state) => ({ isLoggedIn: state.login.isLoggedIn, loginInfo: state.login.loginInfo, actions: state.base.actions}),
    (dispatch) => ({
        doCheckLogin: (actions) => {
            doCheckLogin(actions)
        },
        doLoginServerCall: (actions, loginInfo ) => {
            doTryLogin(actions,loginInfo, "kai", "sausages");
        },
        doLogoutServerCall: (actions, loginInfo) => {
            doLogout(actions,loginInfo);
        }
    }))(NavBar);
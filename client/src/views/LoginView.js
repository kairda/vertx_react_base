import React, {Component} from 'react'
import {connect} from 'react-redux';

import {Row, Column} from 'react-foundation';
import { Button } from 'react-foundation';

import {doTryLogin} from '../actions/loginActions';

class LoginView extends Component {

    constructor(props) {
        super(props);

        // default username and password ...
        this.state = {username: 'kai', password: 'sausages'};

    }

    onChangeUserName(value) {

        this.setState({username: value});
    }

    doClickLogin() {
        console.log('doClickLogin clicked with ' + this.state.username);
        this.props.doLoginAction(this.props.actions, this.props.loginInfo,
            this.state.username, this.state.password);
    }

    render() {

        return (
            <div>

                <h2>Provide login details</h2>

                <Row className="display">
                    <Column small={6} centerOnSmall>

                        <label>Username:</label><input
                        id="username"
                        type="text"
                        value={this.state.username}
                        onChange={(value) => {
                            this.setState({username: value});
                        }}
                    />
                    </Column>
                </Row>

                <Row className="display">
                    <Column small={6} centerOnSmall>
                        <label>Password:</label><input
                        id="password"
                        type="password"
                        value={this.state.password}
                        onChange={(value) => {
                            this.setState({password: value});
                        }}
                    />
                    </Column>
                </Row>
                <br/>
                <Button  isHollow onClick={this.doClickLogin.bind(this)}>Login</Button>

            </div>
        );
    }
}


export default connect((state) => ({loginInfo: state.login.loginInfo, actions: state.base.actions}),
    (dispatch) => ({
        doLoginAction: (actions, loginInfo, username, password) => {
            doTryLogin(actions, loginInfo, username, password);
        }
    }))(LoginView)
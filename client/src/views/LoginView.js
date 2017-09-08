import React, {Component} from 'react'

import {connect} from 'react-redux';

import {doTryLogin} from '../actions/loginActions';

import {Button, Jumbotron} from 'react-bootstrap';


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
            <div >
                <Jumbotron>

                    <h2>Provide login details</h2>

                    <div className="form-group">
                        <label htmlFor="usr">Username</label>
                        <input type="text" className="form-control" id="usr" value={this.state.username}
                               onChange={(evt) => {
                                   this.setState({username: evt.target.value});
                               }} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pwd">Password:</label>
                        <input type="password" className="form-control" id="pwd" value={this.state.password}
                               onChange={(evt) => {
                                   this.setState({password: evt.target.value});
                               }} />
                    </div>
                    <Button onClick={this.doClickLogin.bind(this)}>Login</Button>

                </Jumbotron>
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
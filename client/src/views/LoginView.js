import React, {Component} from 'react'

import {Card, CardHeader, CardTitle, CardText, CardActions, Button, Textfield } from 'react-mdc-web/lib';

import {connect} from 'react-redux';

import {doTryLogin } from "../actions/loginActions";

class LoginView extends Component {

    constructor(props) {
        super(props);

        // default username and password ...
        this.state = { username : "kai", password : "sausages" };

    }



    doClickLogin() {
        console.log("doClickLogin clicked with " + this.state.username);
        this.props.doLoginAction(this.props.actions,this.props.loginInfo,this.state.username,this.state.password);
    }

    render() {

        return (
            <div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Provide login details
                        </CardTitle>
                    </CardHeader>
                    <CardText>
                        <Textfield
                            floatingLabel="Username"
                            value={this.state.username}
                            onChange={({target : {value : username}}) => {
                                this.setState({ username:  username })
                            }}
                        />
                        <br/>
                        <Textfield
                        floatingLabel="Password"
                        type="password"
                        value={this.state.password}
                        onChange={({target : {value : password}}) => {
                            this.setState({ password : password })
                        }}
                    />
                    </CardText>
                    <CardActions>
                        <Button compact onClick={this.doClickLogin.bind(this)}>Login</Button>

                        <Button compact accent>Cancel</Button>
                    </CardActions>
                </Card>

            </div>
        );
    }
}



export default connect( (state) => ({ loginInfo: state.login.loginInfo, actions: state.base.actions}),
    (dispatch) => ({
        doLoginAction: (actions, loginInfo, username, password) => {
            doTryLogin(actions, loginInfo, username, password );
        }
    }))(LoginView)
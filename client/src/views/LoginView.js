import React, { Component } from 'react'

import { connect } from 'react-redux';

import { doTryLogin } from '../actions/loginActions';

class LoginView extends Component {

    constructor(props) {
      super(props);

        // default username and password ...
      this.state = { username: 'kai', password: 'sausages' };

    }

    onChangeUserName( value )  {

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
                <label>Username:</label><input
                            id="username"
                            type="text"
                            value={this.state.username}
                            onChange={(value) => { this.setState( { username : value } ); } }
                        />
                        <br/>
                <label>Password:</label><input
                            id="password"
                            type="password"
                            value={this.state.password}
                            onChange={(value) => { this.setState( { password : value } ); } }
                        />
                <br/>
                <button onClick={this.doClickLogin.bind(this)}>Login</button>

            </div>
        );
    }
}


export default connect((state) => ({ loginInfo: state.login.loginInfo, actions: state.base.actions }),
    (dispatch) => ({
      doLoginAction: (actions, loginInfo, username, password) => {
        doTryLogin(actions, loginInfo, username, password);
      }
    }))(LoginView)
import React, { Component } from 'react'
import { connect } from 'react-redux';

import Button  from 'muicss/lib/react/Button'
import Container from 'muicss/lib/react/container';
import Input from 'muicss/lib/react/input';

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
            <Container fluid={true}>

                <h2>Provide login details</h2>
                <Input
                            id="username"
                            label="Username:"
                            floatingLabel={true}
                            type="text"
                            value={this.state.username}
                            onChange={(evt) => { this.setState( { username : evt.target.value } ); } }
                        />
                        <br/>
                <Input
                            id="password"
                            label="Password"
                            floatingLabel={true}
                            type="password"
                            value={this.state.password}
                            onChange={(evt) => { this.setState( { password : evt.target.value } ); } }
                        />
                <br/>
                <Button color="primary" onClick={this.doClickLogin.bind(this)}>Login</Button>

            </Container>
        );
    }
}


export default connect((state) => ({ loginInfo: state.login.loginInfo, actions: state.base.actions }),
    (dispatch) => ({
      doLoginAction: (actions, loginInfo, username, password) => {
        doTryLogin(actions, loginInfo, username, password);
      }
    }))(LoginView)
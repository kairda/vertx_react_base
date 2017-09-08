import React, { Component } from 'react'


import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Button from 'react-md/lib/Buttons/Button';

import TextField from 'react-md/lib/TextFields';

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

                <Card style={{ maxWidth: 400 }} className="md-block-centered">
                        <CardTitle title="Provide login details"
                                   subtitle="Card Subtitle"/>
                    <CardText>
                        <TextField
                            id="username"
                            label="Username"
                            placeholder=""
                            className="md-cell md-cell--bottom"
                            value={this.state.username}
                            onChange={(value) => { this.setState( { username : value } ); } }
                        />
                        <br/>
                        <TextField
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Password"
                            className="md-cell md-cell--bottom"
                            value={this.state.password}
                            onChange={(value) => { this.setState( { password : value } ); } }
                        />
                    </CardText>
                    <CardActions expander>
                        <Button flat primary onClick={this.doClickLogin.bind(this)}
                         label="Login" />

                        <Button flat label="Cancel"/>
                    </CardActions>
                    <CardText expandable>
                        What-Ever should be put in the expandable ....
                    </CardText>
                </Card>

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
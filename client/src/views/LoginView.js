import React, {Component} from 'react'

import {connect} from 'react-redux';

import {doTryLogin } from "../actions/loginActions";

class LoginView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("componentDidUpdate was called ...")
        if (mdc) {
            console.log("mdc.autoInit called .... ");
            mdc.autoInit();
        }
    }

    render() {

        return (
            <div>


                {this.props.isLoggedIn === true ?
                    <h4>You are already logged in ... </h4> :

                    <div>
                        <h2 className="mdc-typography--display2">You need to login ....</h2>

                        <section className="my-card-container">
                            <div className="mdc-card">
                                <section className="mdc-card__primary">
                                    <h1 className="mdc-card__title mdc-card__title--large">Provide login details</h1>
                                    <h2 className="mdc-card__subtitle">go for it ... </h2>
                                </section>
                                <section className="mdc-card__supporting-text">

                                    <div className="mdc-form-field">
                                        <div className="mdc-textfield" data-mdc-auto-init="MDCTextfield">
                                            <input id="username" ref="username" type="text" className="mdc-textfield__input"/>
                                            <label htmlFor="username" className="mdc-textfield__label">
                                                Username
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mdc-form-field">
                                        <div className="mdc-textfield" data-mdc-auto-init="MDCTextfield">
                                            <input id="password" ref="password" type="password" className="mdc-textfield__input"/>
                                            <label htmlFor="password" className="mdc-textfield__label">
                                                Password
                                            </label>
                                        </div>
                                    </div>

                                </section>
                                <section className="mdc-card__actions">
                                    <button className="mdc-button mdc-button--compact mdc-card__action"
                                            onClick={this.props.doLoginAction.bind(this, this.props.actions, this.props.loginInfo,
                                            'kai','sausages')}>
                                        Login ...
                                    </button>
                                    <button className="mdc-button mdc-button--compact mdc-card__action">Cancel</button>
                                </section>
                            </div>
                        </section>
                    </div>}
            </div>
        );
    }
}

export default connect( (state) => ({ isLoggedIn : state.login.isLoggedIn, loginInfo: state.login.loginInfo, actions: state.base.actions}),
    (dispatch) => ({
        doLoginAction: (actions, loginInfo, username, password) => {
            console.log("Inside do LoginAction of login-view with username and password "
             + username + " " + password );
            doTryLogin(actions, loginInfo, username, password );
        }
    }))(LoginView)
import React, {Component} from 'react';
import {connect} from 'react-redux';

import App from './App';


class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <header className="mdc-toolbar">
                    <div className="mdc-toolbar__row">
                        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
                            <a href="#" className="material-icons mdc-toolbar__icon--menu">menu</a>
                            <span className="mdc-toolbar__title">Title</span>
                            <span className="mdc-toolbar--flexible-space-minimized">{this.props.loginInfo}</span>
                        </section>
                    </div>
                </header>
                {this.props.content}
            </div>
        );
    }
}

// the state is the global store state
// we connect the local property "counter" to the global state
export default connect( (state) => ({ loginInfo : state.loginInfo }))(NavBar);
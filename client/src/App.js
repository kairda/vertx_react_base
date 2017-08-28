import React, { Component } from 'react';


import { connect } from 'react-redux';
import { doServerCall} from "./actions/actions"




class App extends Component {

    constructor(props) {
        // console.log("Props is " + JSON.stringify(props));
        super(props);
    }


  render() {
    return (

    <div>
          <h2 className="mdc-typography--display2">Hello, Material Components!</h2>

        <section className="my-card-container">
        <div className="mdc-card">
            <section className="mdc-card__primary">
                <h1 className="mdc-card__title mdc-card__title--large">Title goes here</h1>
                <h2 className="mdc-card__subtitle">Subtitle here</h2>
            </section>
            <section className="mdc-card__supporting-text">
                Counter is {this.props.counter}
            </section>
            <section className="mdc-card__actions">
                <button className="mdc-button mdc-button--compact mdc-card__action">Action 1</button>
                <button className="mdc-button mdc-button--compact mdc-card__action">Action 2</button>
            </section>
        </div>
            <div className="mdc-card">
                <section className="mdc-card__primary">
                    <h1 className="mdc-card__title mdc-card__title--large">Title goes here</h1>
                    <h2 className="mdc-card__subtitle">Subtitle here</h2>
                </section>
                <section className="mdc-card__supporting-text">
                    Counter is {this.props.counter}
                </section>
                <section className="mdc-card__actions">
                    <button className="mdc-button mdc-button--compact mdc-card__action">Action 1</button>
                    <button className="mdc-button mdc-button--compact mdc-card__action">Action 2</button>
                </section>
            </div>
        </section>



          <div className="mdc-textfield" data-mdc-auto-init="MDCTextfield">
              <input type="text" className="mdc-textfield__input" id="demo-input"/>
                  <label className="mdc-textfield__label">Tell us how you feel!</label>
          </div>


        <button type="button" className="mdc-button mdc-button--raised mdc-button--primary"
            onClick={this.props.doServerCall}>
            Server-Call Counter Increase
        </button>

        <main>
            <h1 className="mdc-typography--display1">Tell us about yourself!</h1>

            <form action="#" id="greeting-form">
                <div>
                    <div className="mdc-form-field">
                        <div className="mdc-textfield" data-mdc-auto-init="MDCTextfield">
                            <input id="firstname" type="text" className="mdc-textfield__input"/>
                                <label htmlFor="firstname" className="mdc-textfield__label">
                                    First Name
                                </label>
                        </div>
                    </div>

                    <div className="mdc-form-field">
                        <div className="mdc-textfield" data-mdc-auto-init="MDCTextfield">
                            <input id="lastname" type="text" className="mdc-textfield__input"/>
                                <label htmlFor="lastname" className="mdc-textfield__label">
                                    Last Name
                                </label>
                        </div>
                    </div>
                </div>

                <button type="submit"
                        className="mdc-button
                   mdc-button--raised
                   mdc-button--primary
                   mdc-ripple-surface"
                        data-mdc-auto-init="MDCRipple">
                    Print Greeting
                </button>
            </form>

            <p className="mdc-typography--headline" id="greeting"></p>
        </main>

    </div>
    );
  }
}


// the state is the global store state
// we connect the local property "counter" to the global state
export default connect((state) => ( { counter : state.counter } ),
    (dispatch) => ( {                         // the dispatch is provided by react-redux
            doServerCall: () => {           // it is used to put transport the action to
                doServerCall(dispatch)      // the reducers, resulting in a change in the global state
            } }) )(App);
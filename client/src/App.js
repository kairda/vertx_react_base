import React, { Component } from 'react';

class App extends Component {
  render() {
    return (

/*      <div className="App">
        <div className="App-header">
          <img src="img/logo.svg" className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>client/src/App.js</code> and save to reload. And more ... <br/>
            See how Kai did this ....
        </p>
          <p> Another paragraph ... Currently reloading and no cache set for development &ouml;!</p>
          <p> This cache problem is persistent!</p>
          <p> This cache problem is persistent!</p>
      </div>
*/
    <div>
          <h2 className="mdc-typography--display2">Hello, Material Components!</h2>
          <div className="mdc-textfield" data-mdc-auto-init="MDCTextfield">
              <input type="text" className="mdc-textfield__input" id="demo-input"/>
                  <label className="mdc-textfield__label">Tell us how you feel!</label>
          </div>

        <button type="button" className="mdc-button mdc-button--raised mdc-button--primary">
            Press Me
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

export default App;

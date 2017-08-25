// app-client.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import NavigationDrawer from 'react-md/lib/NavigationDrawers';


import './index.css';
import './App.css';


import WebFontLoader from 'webfontloader';

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
});

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: {
      }
    };
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
        <NavigationDrawer
            drawerTitle="react-md with CRA"
            toolbarTitle="Welcome to react-md"
        >
            <div className="App">
                <div className="App-header">
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
            </div>
        </NavigationDrawer>
    )
  }
}
const app = document.getElementById('app');
ReactDOM.render(<App />, app);

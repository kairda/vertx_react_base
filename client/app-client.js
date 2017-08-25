// app-client.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

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
      <div>
        Hello World!
      </div>
    )
  }
}
const app = document.getElementById('app');
ReactDOM.render(<App />, app);

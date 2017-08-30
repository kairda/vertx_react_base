import React, { Component } from 'react';

import { Card, CardHeader, CardText, CardActions, Title, Subheading2, Display1, Display2, Button } from 'react-mdc-web';
import { connect } from 'react-redux';



class App extends Component {

    constructor(props) {
        // console.log("Props is " + JSON.stringify(props));
        super(props);
    }


  render() {
    return (

       <div>
          <Display2>Hello, Material Components!</Display2>

        <section className="my-card-container">

            <Card>
            <CardHeader>
                <Title>Counter</Title>
                <Subheading2>Zählt hoch</Subheading2>
            </CardHeader>
            <CardText>
                Counter is {this.props.counter}
            </CardText>
            <CardActions>
                <Button compact primary
                        onClick={this.props.doActionCall.bind(this,this.props.actions)}>Action 1</Button>
                <Button compact>Action 2</Button>
            </CardActions>
            </Card>

            <Card>
                <CardHeader>
                    <Title>Counter - der gleiche ... </Title>
                    <Subheading2>Zählt auch hoch</Subheading2>
                </CardHeader>
                <CardText>
                    Counter is {this.props.counter}
                </CardText>
                <CardActions>
                    <Button compact primary
                            onClick={this.props.doActionCall.bind(this,this.props.actions)}>Action 1</Button>
                    <Button compact>Action 2</Button>
                </CardActions>
            </Card>


        </section>

        <Button raised primary
                onClick={this.props.doServerCall.bind(this,this.props.actions)}
                disabled={!this.props.isLoggedIn}>
            Server-Call Counter Increase
        </Button>

       </div>

    );
  }
}


// the state is the global store state
// we connect the local property "counter" to the global state
export default connect((state) => ( { isLoggedIn : state.login.isLoggedIn, counter : state.counter.counter, actions: state.base.actions } ),
    (dispatch) => ( {                         // the dispatch is provided by react-redux
            doServerCall: (actions) => {           // it is used to put transport the action to
                actions.doServerCallWebSocket('counter')      // the reducers, resulting in a change in the global state
            },
            doActionCall: (actions) => {
                actions.doServerCallWebSocket('action')
            }}) )(App);
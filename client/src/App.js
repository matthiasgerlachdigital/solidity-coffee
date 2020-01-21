import React from 'react';
import logo from './logo.svg';
import './App.css';
import { DrizzleContext } from "drizzle-react";



//  exporting an anonymous function as default as an object literal expression
export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            const {drizzle, drizzleState, initialized} = drizzleContext;

            if (!initialized) {
                return "Loading...";
            }
            console.log("drizzle: ", drizzle);
            console.log("drizzleState", drizzleState);
            return (
                <App drizzle={drizzle} drizzleState={drizzleState}/>
            );
        }}
    </DrizzleContext.Consumer>
)


class App extends React.Component {
    state = {coffeeLevel:null};

    render() {
        const { Coffee } = this.props.drizzle.contracts;

        Coffee.methods.getCoffeeLevel().call().then(
            (res ) => {
                this.setState({coffeeLevel:res});
            },
            (err) => {
                console.log(err);
            }
        );

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    <p>Coffee Level: {this.state.coffeeLevel}</p>
                </header>
            </div>
        );
    }
}

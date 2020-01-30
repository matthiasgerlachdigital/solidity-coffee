import React from 'react';
import logo from './logo.png';
import './App.css';
import { DrizzleContext } from "drizzle-react";
import CoffeeLevelDisplay from "./CoffeeLevelDisplay.js"
import DirtLevelDisplay from "./DirtLevelDisplay";
import StoreUserButton from "./StoreUserButton.js"



//  exporting an anonymous function as default as an object literal expression
export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            const {drizzle, drizzleState, initialized} = drizzleContext;

            if (!initialized) {
                return "Loading...";
            }
            return (
                <App drizzle={drizzle} drizzleState={drizzleState}/>
            );
        }}
    </DrizzleContext.Consumer>
)


class App extends React.Component {
    state = {coffeeLevel:null};

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <CoffeeLevelDisplay drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
                    <DirtLevelDisplay drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
                    <StoreUserButton drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
                </header>
            </div>
        );
    }
}

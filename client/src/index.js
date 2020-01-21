import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// 1. Import drizzle, drizzle-react
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";

// getting our smart contract in
import Coffee from './../src/contracts/Coffee.json';

// setting up drizzle
const options = {
    contracts: [Coffee],
    // this is necessary to wire the contract to the local truffle network
    web3: {
        fallback: {
            type: "ws",
            // define the port of the network here  (7545, ganache or 9545 for truffle develop)
            url: "ws://127.0.0.1:9545",
        }
    }
};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
    <DrizzleContext.Provider drizzle={drizzle}>
        <App/>
    </DrizzleContext.Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

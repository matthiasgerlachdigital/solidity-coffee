[back to index](00_index.md)

# React integration with drizzle
To build a user interface for the contract, drizzle seemed to be a good tool within the truffle universe. It took me some time to work out how this all works with my own contract. My starting point was the "Getting Started with Drizzle and React" [React Drizzle][1]. 

Since I already had my own running contract - the coffee contract - I did not need to do everything in the list. When it came to the real interaction with the contract (steps 8 and following), I experienced some difficulties and switched to other tutorials. Here is what I did for the different steps in the tutorial: 

1. **Setting up the development environment:** skipped this, as I already had the working contract and environment. (see [00_firststeps](10_firststeps.md))
2. **Creating a Truffle project from scratch:** skipped that, see above.
3. **Writing the smart contract:** skipped that, see above.
4. **Compiling and migrating the smart contract:** skipped that, see above.
5. **Testing the smart contract: skipped that, this is something covered in detail in [20_solidity_tdd](20_solidity_tdd.md)
6. **Creating our React.js project:** This I followed thoroughly.  
7. **Wiring up the front-end client:** Dito, that helped a lot, either. Instead of replacing everything in truffle-config.js, I rather added the two lines at the right places in the file to not lose the other configs for truffle.
8. **Wire up the React app with Drizzle:** Here, I encountered problems, and dug into other tutorials that seemed more up do date. See below. 
9. **Write a component to read from Drizzle:** Again, I did this a bit different from the tutorial, as it did not work for me as I wanted it to. 
10. **Write a component to write to the smart contract:** Skipped this for now. 

## Wire up React and Drizzle 
Testing the react app after installing drizzle with ``npm start`` in the client directory worked. Check out the note about using an incognito window if you have MetaMask installed and you will succeed as well! 
 
Somehow, the way described in the tutorial did not work so well for me. I stumbled into problems of really connecting to the contract instance. So I tried to simplify the way. In addition, I had problems understanding the example as we have a contract named "SimpleStorage" and the drizzleStore, which made it hard to me to replace the "right" functions at the right places with the calls to my contract. 

On searching for answers I went to different places on the Internet and found the [drizzle-react github][2]. This seemed to be up to date and I started integrating it. 

I'll try to describe the things I did different for each of the sections of the tutorial in the coming sections. 

### Setup the store 
Looking to [drizzle-react github][2], we will see that this is quite similar. But does not state to do this in the index.js file. It also does not say anything about the options. So these are the things I needed to get right. 

#### Include the right contract 
Well, this is my contract, therefore I included the ```import Coffee from './../src/contracts/Coffee.json'```. 

#### Get the options right 
```javascript
const options = {
      // reference to my contract 
     contracts: [Coffee],
     // this is necessary to wire the contract to the local truffle network
     web3: {
         fallback: {
             type: "ws",
             // define the port of the network here  
             // (7545, ganache or 9545 for truffle develop)
             url: "ws://127.0.0.1:9545",
         }
     }
 }
```

#### Get the DrizzleContext right 
This was tricky. Given the layout generated by ``create-react-app`` the provide needed to fit in somewhere. After some trial and error, I wrapped my App directly in the ``ReactDOM.render``method. Btw. this is different to the tutorial in [React Drizzle][1]. 

#### Update package.json
``drizzle-react`` was not found in the imports, so I needed to do something. My IDE kindly asked me whether I wanted to put this into the dev-dependencies in the ``package.json``file. Then it worked.  

##  Wire up the React app with Drizzle
Now comes the part which took me the longest. [drizzle-react github][2] states that we can "access the ``drizzle`` instance and ``drizzleState`` (...) in any child instance of the App", given we use the ``DrizzleContext.Consumer``. To cut the whole story short, I learned that for **any** component that wants to access the contract via the ``DrizzleContext``` the file structure is always the same: 

```javascript

import React from "react";
import { DrizzleContext } from "drizzle-react";

// anonymous default export as expression 
export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
      if (!initialized) {
        return "Loading...";
      }
      return (
        <MyComponent drizzle={drizzle} drizzleState={drizzleState} />
      );
    }}
  </DrizzleContext.Consumer>
)

class MyComponent extends React.Component {
 // do stuff here using this.props.drizzle and this.props.drizzleState
}
```

Main learnings: 
* React requires object literals / expressions as input. Expressions - as opposed to statements - evaluate to a value, which is the rendered JSX in our case. 
* sometimes you need to migrate your contract (again) to ensure a connection :-) 
* make that function a class: create-react-app creates a ```function App()```, but it seems to be a lot easier to create a class that handles all the things to access the contract. See below. 

### Access the contract
Within the class that shall display something, we need to 
* get the information from the contract and 
* get it over to the return expression for display 

Getting the information from the contract made me use javascript promises again. Calling the contract instance with ```Coffee.methods.getCoffeeLevel().call()``` returns a promise, which needs to be resolved to actually display a value. I solved this using ```then()``` and assign the ``result`` to the coffeeLevel state that I added to my component as a field. 

State is used to get the information over to the return expression. It needs to be set using the ``this.setState()`` methods of our class.

## Test the setup with truffle.develop 
After implementing this, I used the power of the truffle console to test whether this worked. What's neat, the test-cases developed when writing the contract (see [20_solidity_tdd](20_solidity_tdd.md)) can be used directly, via copy-paste. Just ensure you are not copying the semicolon by accident. 

We are going to do the tests as described in [drawcoffee.js](../test/drawcoffee.js).

See the truffle documentation [Truffle Console][3] for details. 

### Set up everything
Unless the UI already works in an incognito window and displays a value - '0' in my case, now it would be the time to set that up: 
1. Start the react app using ```yarn start```
2. Start the truffle console using ```truffle develop```
3. ```truffle (develop)> migrate ``` your contract 

### Get an instance of the contract 
```truffle (develop)> let contract = await Coffee.deployed()```

### Draw a coffee 
We need to fulfil the prerequisites dictated by the contract, i.e.: 
1. store one user: ```truffle (develop)> contract.storeUser(accounts[0], {from:accounts[0]})```
2. refillCoffee before the first drawing: ```truffle (develop)> await coffee.refillCoffee()```

By now, the UI should display a CoffeeLevel of '25'. So this seems to work. Now, if we're drawing a coffee using ```truffle (develop)> await coffee.drawCoffee(1,{from:accounts[0]})```, that value should decrease. Yeah! 

## Writing to the contract 
This was straightforward. Just did it as described in the tutorial [React Drizzle][1].

## References 
[1] https://www.trufflesuite.com/tutorials/getting-started-with-drizzle-and-react

[2] drizzle-react: https://github.com/trufflesuite/drizzle/blob/develop/packages/react-plugin/README.md

[3] https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts
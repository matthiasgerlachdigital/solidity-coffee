# solidity-coffee
Smart contract for using, cleaning and refilling coffee machines. Inspired by the hyperledger based version of Heise c't. See also: https://github.com/jamct/hyperledger-coffee. 

## Recommended reading / dev setup 
Follow these two steps to learn about how to use truffle, and get a brief understanding on 
ethereum. 

1. Start with Etherum Overview: https://www.trufflesuite.com/tutorials/ethereum-overview 
2. Learn Truffle (https://www.trufflesuite.com/tutorials/pet-shop) 

## Getting started with the contract
1. **Contract instance on your local blockchain:** in a terminal, do 
    a. start truffle:```truffle develop```
    b. run the tests: ```truffle (develop)> test```
    c. migrate the contract: ```truffle (develop)> migrate ```
2. **UI server on your machine:** In a second terminal, 
    a. cd into the client directory 
    b. ```npm install```, to install all relevant dependencies 
    c. run ```yarn start ``` in the client directory to start the UI (if you have MetaMask installed, ensure to open in an incognito window)
3. Run manual tests in the truffle console to view the changing interface 

## Interesting stuff 
* Testcases run slow if connected to the UI. 

## Next steps (unsorted)
* Extending the UI to cover all the contract functions 
* Creating a coin to pay coffee with 
* Including oracles for external components (like the coffee machine)


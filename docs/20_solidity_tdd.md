[back to index](00_index.md)

# Test Driven Development in Truffle 

It took me some time to go through the pet-shop example from the truffle site. At the end, I saw the pet-shop being displayed. But I wanted to do something else and create my own contract from scratch, but could not find something "realistic", attractive, yet simple enough to start learning with.  

## Coffee - The subject matter 
And then I read the c‘t-Article on organizing the coffee-machine refill and cleaning using a blockchain [CT_ARTICLE][1]. I liked the idea, but they built it on the hyperledger blockchain, implemented in Go [COFFEE_GIT][2]. I wanted Ethereum and Solidity. 

So my idea went like this: not having to deal with the "what“ and learning a bit about the differences between the two approaches on the go. In my other life as an architect, I realize that it is typically the subject matter that is complicated, not the technology. So I embraced the coffee-idea and started off. 

## TDD for Solidity Contracts  
It is possible to do test driven development for Solidity Contracts, and it is quite satisfying. You write your test, think about the subject matter while writing the test and the test fails. You adapt the contract, think about how to do it right and the test passes - yeah! 

This is how I went about the Coffee contract. I tried to copy the methods from the "original" [COFFEE_GIT][2] as much as I could. 

Oh, and I wrote the test cases in JavaScript, as this may pave me the way towards writing a sleek user interface for my contract at some point in time. 

## What I learned (quick read)
* **truffle develop is your friend** - truffle develop gives you a full development and test enviroment including 10 accounts and a console. What more do you want. 
* **RTFM** - indeed most of the learnings were out in the clear in the truffle or solidity documentation. Often, I needed to see things fail to read again, and find my fault. 
* **to .call() or not to .call()** - using .call() on contract functions does not alter the state of the contract 
* **promises everywhere** - calling a contract is asynchronous - and you will almost always be returned a promise, at least for the direct calls of contract functions. 
* **async/await** makes the code more compact, but makes it harder to react on errors returned from the contract 
* **testcases in one 'contract' use the same contract** - if one test case at the beginning alters the state of the contract, the remaining testcases can/must build on that expected state. 
* **contract return \<bn\>** - I was always expecting uints from the contract calls, but they are wrapped in \<bn\> objects that I needed to convert to uints using toNumber(). 
* **ensure you wait for your result** - if you forget to *await* the result of a contract call, you will get strange behaviour and seemingly wrong types as results. 
* **await / then() helps with exceptions from the contract** - if you are using, e.g., ´require´ or ´revert statements in your contract and you expect an exception, you can catch it with the second parameter in then(). Do not forget to await the result of your function. 

There is probably a lot more to it ... 

## References 
[1]: c't 23/2019, pp. 82; https://www.heise.de/select/ct/2019/23/1572964271250058 

[2]: GIT Repo for the c't coffee project: https://github.com/jamct/hyperledger-coffee

[back to index](00_index.md)

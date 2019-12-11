var Coffee = artifacts.require("coffee");

contract("Coffee - drawing a coffee changes coffeeLevel ", accounts  =>  {


  it("should expect cleaning and refill upon contract creation", async() => {
    const initialCoffeeLevel = 25;
    const initialDirtLevel = 60;

    let contract = await Coffee.deployed();
    const coffeeLevelBefore = await contract.getCoffeeLevel();
    const dirtLevelBefore = await contract.getDirtLevel();
    assert.equal(coffeeLevelBefore.toNumber(),0,"coffee level before should be 0");
    assert.equal(dirtLevelBefore.toNumber(), 0,"dirt level before should be 0");
    await contract.refillCoffee();
    const coffeeLevelAfterRefill = await contract.getCoffeeLevel();
    assert.equal(coffeeLevelAfterRefill.toNumber(), initialCoffeeLevel, "coffee level after refill should be 25");
    await contract.cleanMachine();
    const dirtLevelAfterCleaning = await contract.getDirtLevel();
    assert.equal(dirtLevelAfterCleaning.toNumber(),initialDirtLevel,"dirt level after cleaning should be 60");
  });

  it("should only allow drawing coffee for registered user (register two users)", async() => {
    let contract = await Coffee.deployed();
    let listOfUsers = await contract.getListOfUsers.call();
    assert.notInclude(listOfUsers, accounts[0], "List of users should not include accounts[0]");
    await contract.drawCoffee.call(1, {from:accounts[0]}).then(
        (res) => {
          assert(false, "drawing a coffee without being registered should fail");
        },
        (err) => {
          assert.typeOf(err,'error', "we expect an error");
          assert.include(JSON.stringify(err),'register', "expect error message to contain 'you need to register to draw a coffee'" + err);
        }
    );
    await contract.storeUser(accounts[0], {from:accounts[0]});
    await contract.storeUser(accounts[1], {from:accounts[1]});
    let numberOfUsers = await contract.userCount.call();
    assert.equal(numberOfUsers, 2, "now we should have two registered users");
    listOfUsers = await contract.getListOfUsers.call();
    assert.include(listOfUsers, accounts[0], "should now include our user ");
    await contract.drawCoffee.call(1, {from:accounts[0]}).then(
        (res) => {
          assert.include(res,'Enjoy', "drawing a coffee as a registered user should return enjoy your coffee");
        },
        (err) => {
          assert(false, "something went wrong when drawing a coffee as registered user" + err);
        }
    );
  });

  it("should decrease coffee level by the number of cups", async() =>  {
    const initialCoffeeLevel = 25;
    const initialDirtLevel = 60;

    let contract = await Coffee.deployed();
    const coffeeLevelBefore = await contract.getCoffeeLevel();
    assert.equal(coffeeLevelBefore.toNumber(), initialCoffeeLevel, "we did not do anything yet, expect initialCoffee Level");
    // draw one cup
    const cupsToDraw1 = 1;
    await contract.drawCoffee(cupsToDraw1);
    let coffeeLevelAfter = await contract.getCoffeeLevel();
    let expectedCoffeeLevel = coffeeLevelBefore.toNumber() - cupsToDraw1;
    assert.equal(coffeeLevelAfter.toNumber(),expectedCoffeeLevel, "value should be decreased by "+ cupsToDraw1);
    // draw three cups
    const cupsToDraw2 = 3;
    await contract.drawCoffee(cupsToDraw2);
    coffeeLevelAfter = await contract.getCoffeeLevel();
    expectedCoffeeLevel -=  cupsToDraw2;
    assert.equal(coffeeLevelAfter.toNumber(),expectedCoffeeLevel, "value should be decreased by "+ cupsToDraw2);
  });

  it("should return 'enjoy' your coffee if a coffee could be drawn", async() => {
    let contract = await Coffee.deployed();
    await contract.drawCoffee.call(1).then(
        async (ret) => {
            assert.include(ret,'Enjoy' ," should include the string Enjoy");
            await contract.drawCoffee(1).then( () => {
              assert(true, "we should be able to do the real transaction drawing a coffee ");
            }, reason => {
              assert(false, "problem calling drawCoffee "+ reason);
            });
        }, (err) => {
            assert(false, "should not reach this statement" + err);
        });
  });

  it("should tell the user to refill coffee if below REFILL_THRESHOLD", async() => {
    let contract = await Coffee.deployed();
    await contract.setCoffeeLevel(3);
    let currentCoffeeLevel = await contract.getCoffeeLevel();
    assert.equal(currentCoffeeLevel.toNumber(),3, "set the current coffee level to 3 (the REFILL_THRESHOLD");
    await contract.drawCoffee(1).then(
        (res) => {
          assert(false, "coffee runs out, we should not get a fulfilled promise" + res);
        },
        (err) => {
          assert.typeOf(err,'error', "we expect an error");
          assert.include(JSON.stringify(err),'refill', "should return the message to refill coffee");
        }
    );
  });

  it("should tell the user to clean, if dirty", async () => {
    assert(false, "still todo");

  });


  });

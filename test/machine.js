var Coffee = artifacts.require("Coffee");

contract("Coffee - machine interactions",  accounts =>  {

//
// COFFEE AND MACHINE FUNCTIONS
//

  it("should initialize with a coffee level of 0", async () => {
    let contract = await Coffee.deployed();
    let initialCoffeeLevel = await contract.getCoffeeLevel.call();
    assert.equal(initialCoffeeLevel, 0, "initial coffee level is 0");
  });

  it ("should initialize with a dirt level of 0", async () => {
    let contract = await Coffee.deployed();
    const initialDirtLevel = await contract.getDirtLevel();
    assert.equal(initialDirtLevel.toNumber(),0,"initial dirt level is 0");
  });

  it("should set/get the coffee level ", async() => {
    let contract = await Coffee.deployed();
    let coffeeLevel = 0;
    const maxLevel = 100;
    const increment = 5;
    for (i=0; coffeeLevel < maxLevel; i++ ) {
      coffeeLevel += increment;
      contract.setCoffeeLevel(coffeeLevel);
      let actualCoffeeLevel = await contract.getCoffeeLevel.call();
      assert.equal(coffeeLevel,actualCoffeeLevel,"returned coffee level should be the set coffee level (round"+ i + ")");
    }
  });

  it("should set/get the dirt level", async() =>  {
    let contract = await Coffee.deployed();
    let dirtLevel = 0;
    const maxLevel = 100;
    const increment = 5;
    for (i=0; dirtLevel < maxLevel; i++ ) {
      dirtLevel += increment;
      contract.setDirtLevel(dirtLevel);
      let actualDirtLevel = await contract.getDirtLevel.call();
      assert.equal(dirtLevel,actualDirtLevel,"returned coffee level should be the set coffee level (round"+ i + ")");
    }
  });

  it("should reset the coffeeLevel to 25, when coffee is refilled ", async() => {
    const targetLevel = 25;
    let contract = await Coffee.deployed();
    await contract.refillCoffee();
    let coffeeLevel = await contract.getCoffeeLevel();
    assert.equal(targetLevel, coffeeLevel.toNumber(), "ensure coffee level is 25 (targetLevel)");
  });

  it("should reset the dirtLevel to 60, when machine is cleaned ", async() => {
    const targetLevel = 60;
    let contract = await Coffee.deployed();
    await contract.cleanMachine();
    let dirtLevel = await contract.getDirtLevel();
    assert.equal(targetLevel, dirtLevel.toNumber(), "ensure coffee level is 25 (targetLevel)");
  });

});

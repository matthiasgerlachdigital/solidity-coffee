pragma solidity ^0.5.0;

/* This is the contract inspired by the hyperledger coffee contract */
contract Coffee {
    address NULLADDRESS;
    uint REFILL_THRESHOLD=3;
    address[10] users;
    // the number of users in for coffee drinking
    uint public userCount=0;
    // the user that is on duty
    uint userCounter;
    uint coffeeLevel;
    uint dirtLevel;


    //
    // USER FUNCTIONS
    //
    /* Adding a new user */
    function storeUser(address new_address) public returns (address set_address){
      require(new_address == msg.sender, "you are not allowed t o add other users than yourself");
      if (getUser() == msg.sender) {
          // how can I inform my users that the account already exists?
          return msg.sender;
      }
          // how can I inform my users that the account does not exist already and is created?
          users[userCount++] = new_address;
          set_address = new_address;
  }

    /* Check if a user is already on the contract */
    function getUser() public view returns (address) {
      // search the database, if the calling user exists
      address user = NULLADDRESS;
        for (uint i=0; i < userCount; i++) {
            if (users[i] == msg.sender) {
            user = msg.sender;
            }
        }
      return user;
    }

    /* List our users */
    function getListOfUsers() public view returns (address[10] memory) {
      return users;
    }

    /* Get User counter (see, who´s next) */
    function getCounter() public view returns (uint) {
     return userCounter;
    }

    /* Increment user counter */
    function setCounter(uint increment) public returns (uint) {
        userCounter = (userCounter + increment) % userCount;
        return userCounter;
    }

    /* Find user to clean or refill */
    function getDutyUser() public view returns (address) {
        assert(userCounter < 10);
        return users[userCounter];
    }

    //
    // COFFEE AND MACHINE FUNCTIONS
    //

    // Set coffeeLevel
    function setCoffeeLevel(uint newLevel) public {
        coffeeLevel = newLevel;
    }

    // Get coffeeLevel
    function getCoffeeLevel() public view returns (uint level) {
        return coffeeLevel;
    }

    // Set dirtLevel
    function setDirtLevel(uint newLevel) public {
        dirtLevel = newLevel;
    }

    // Get dirtLevel
    function getDirtLevel() public view returns (uint level) {
        return dirtLevel;
    }

    // Method to be called externally: refill the machine (set coffeeCounter to 25)
    function refillCoffee() public {
        coffeeLevel = 25;
    }

    // Method to be called externally: clean the machine (set dirtCounter to 60)
    function cleanMachine() public {
        dirtLevel = 60;
    }

    // Draw a coffee. Contains our main business logic
 function drawCoffee(uint cups) public returns (string memory err) {
     require(getUser() !=  NULLADDRESS, "you need to register to draw a coffee");
     uint newCoffeeLevel;
     if (coffeeLevel > REFILL_THRESHOLD + cups) {
        coffeeLevel -= cups;
        return "Enjoy your Coffee";
     } else {
        revert(string(abi.encodePacked("please refill coffee, or tell ")));
     }
 }
}
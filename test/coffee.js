var Coffee = artifacts.require('Coffee');

contract('Coffee - simple user adding ', accounts => {


//
// USER FUNCTIONS
//

    it ("should return NULL for an unknown user ", async () => {
        let contract = await Coffee.deployed();
        const account0 = accounts[0];
        const getUserResult = await contract.getUser.call({from: account0});
        assert.equal(getUserResult, '0x0000000000000000000000000000000000000000' , "expect null value to be returned for an unknown user");
    });

    it("should add one new user", async () => {
        const account0 = accounts[0];
        let contract = await Coffee.deployed();
        // check what the call would return
        let set_address = await contract.storeUser.call(account0, {from:account0});
        assert.equal(set_address,account0,"storeUser returns the address of the calling user");
        // do the real transaction (we do not use the return value yet)
        let transaction = await contract.storeUser(account0, {from:account0});
        let get_address = await contract.getUser.call({from:account0});
        assert.equal(get_address,account0,"getUser returns the address previously set by storeUser");
    });

    /*
    By now we added one user, this one should not be added a second time.
     */
    it ("should not add a user twice", async () =>
    {
        const account0 = accounts[0];
        let contract = await Coffee.deployed();
        await contract.storeUser(account0, {from:account0}).then(
            async (ret) => {
                let userCount = await contract.userCount.call();
                await contract.getListOfUsers().then(
                    (userList) => {
                        let account0Users = userList.filter(user => user == account0);
                        assert.equal(account0Users.length, 1,"Should onyl have one account0 user in the list ");
                    });
            }
        )
    });


    it ("should prevent user to add other user then themselves", async () => {
        let contract = await Coffee.deployed();
        const account0 = accounts[0];
        const account1 = accounts[1];
        contract.storeUser.call(account1, {from: account0})
            .then(
                res => {assert(false, "fulfilled promise should not be reached")},
                err => {assert(true, "should contain an error message");
                });
        let set_address = await contract.getUser.call({from: account0});
        assert.notEqual(set_address,account1, "the other account should not be set");
    });

});

contract('Coffee - add several users ', accounts => {

    // we expect that all accounts are part of the list
    let expectedList = [];
    for (i=0; i < 10; i++) {
        expectedList.push(accounts[i]);
    }

    it("should support adding at least 10 new users", async () => {
        // we are testing this with 10 accounts
        let contract = await Coffee.deployed();
        for (i = 0; i < 10; i++) {
            const testaddress = accounts[i];
            await contract.storeUser.call(testaddress, {from: testaddress});
            contract.storeUser(testaddress, {from: testaddress})
                .then(
                    () => {
                        contract.getUser.call({from: testaddress})
                            .then(
                                (get_address) => {
                                    assert.include(get_address, testaddress, "now the address should be returned for that account");
                                },
                                () => {
                                    assert(false, "problem when calling getUser");
                                });
                    });
        }
        contract.getListOfUsers()
            .then(
                (result) => {
                    assert.deepEqual(result,expectedList, "should be a list of all accounts");
                },
                (err) => {
                    assert(false, "something went wrong");
                });
    });

    /* At this point we added all accounts. Some even two times. But we expect a list of ten users. */
    it("should get a list of users", async() => {
        let contract = await Coffee.deployed();
        contract.userCount.call()
            .then(
                (res) => {
                    assert.equal(res.toNumber(), 10, "User count should be ten by now");
                }
            );
        contract.getListOfUsers().then(
            (result) => {
                assert.deepEqual(result,expectedList, "should be a list of all accounts");
            },
            (err) => {
                assert(false, "something went wrong");
            }
        )
    });

    it("should return 0 for getCounter", async () => {
        let contract = await Coffee.deployed();
        let test =  await contract.getCounter.call({from:accounts[0]});
        assert.equal(test.toNumber(), 0, "this should be 0");
    });

    it("should increment the userCounter by (modulo) givenValue", async () => {
        let contract = await Coffee.deployed();
        const increment = 6;
        const numberOfRounds = 5;
        const length = await contract.userCount();
        let before  = await contract.getCounter();
        assert.equal(before, 0, "before should be zero, because we incremented nothing yet");
        for (i = 0; i < numberOfRounds ; i++) {
            before = await contract.getCounter();
            await contract.setCounter(increment);
            let ret = await contract.getCounter();
            let after = ret.toNumber();
            let expectedAfter =  (+before + increment ) % length;
            assert.equal(after, expectedAfter , "after should be (before + increment) % length (round: "+i +")");
        }
    });

    it ("should return the current address for the counter ", async () => {
        const increment = 5;
        let contract = await Coffee.deployed();
        let currentUser = await contract.getDutyUser.call();
        let currentCount = await contract.getCounter();
        assert.equal(currentUser, accounts[currentCount.toNumber()], "duty user at the index should be the same as the index on the accounts array");
        await contract.setCounter(increment);
        currentUser = await contract.getDutyUser.call();
        currentCount = await contract.getCounter();
        assert.equal(currentUser, accounts[currentCount.toNumber()], "after incrementing, new user should be returned");
    });
});

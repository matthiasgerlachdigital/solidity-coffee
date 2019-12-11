const Coffee = artifacts.require("Coffee");

module.exports = function(_deployer) {
        _deployer.deploy(Coffee);
};

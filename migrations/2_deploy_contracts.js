const identity_management = artifacts.require("./identity_management.sol");

module.exports = function(deployer) {
  deployer.deploy(identity_management);
};
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()


module.exports = {
  defaultNetwork: "hardhat",
  networks:{
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },

  },
  solidity: "0.8.18",
  namedAccounts: {
    deployer:{
      default:0,
    },
    oracle:{
      default:1,

    },
    authority:{
      default:2,
    },
    worker3:{
      default:3,
    },
    worker4:{
      default:4,
    },
    worker5:{
      default:5,
    },
    worker6:{
      default:6
    },
    worker7:{
      default:7
    },
    worker8:{
      default:8
    },
    worker9:{
      default:9
    },
  },

   mocha: {
       timeout: 500000, // 500 seconds max for running tests
   },
};

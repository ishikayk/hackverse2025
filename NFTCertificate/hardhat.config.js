require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.28",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        eduChain: {
            url: process.env.EDU_CHAIN_RPC_URL, 
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};

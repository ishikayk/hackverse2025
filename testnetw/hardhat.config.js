require("dotenv").config();  // Load environment variables
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    educhain: {
      url: process.env.ALCHEMY_API_URL,  // ✅ Correct way to reference .env variable
      chainId: 656476, // ✅ Chain ID (decimal of 0xa045c)
      accounts: [process.env.PRIVATE_KEY]

    }
  }
};

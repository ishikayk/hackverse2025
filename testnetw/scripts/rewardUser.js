require("dotenv").config();
const Web3 = require("web3");

const ABI = [ /* EduChainToken ABI from Hardhat deployment */ ];
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const web3 = new Web3(process.env.ALCHEMY_API_URL);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

async function rewardUser(userAddress, score) {
    let rewardAmount;
    if (score >= 90) rewardAmount = web3.utils.toWei("50", "ether"); // 50 EDU
    else if (score >= 75) rewardAmount = web3.utils.toWei("20", "ether"); // 20 EDU
    else rewardAmount = 0;

    if (rewardAmount > 0) {
        await contract.methods.rewardUser(userAddress, rewardAmount).send({ from: account.address });
        console.log(`Sent ${rewardAmount} EDU to ${userAddress}`);
    } else {
        console.log(`User ${userAddress} does not qualify for a reward.`);
    }
}

// Example usage:
rewardUser("0x9f736DBEc3F51A945E437AE9A9b00D2bC2CD416b", 92);

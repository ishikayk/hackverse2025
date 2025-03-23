const CONTRACT_ADDRESS = "0xf8A0361D410dBF656B3351FAdcd506aB2b67e293";  // Replace with your EduChain contract address
const ABI = [ /* Paste your contract ABI here */ ];
const EDUCHAIN_RPC_URL = "https://open-campus-codex-sepolia.drpc.org";  // ✅ Your EduChain RPC URL

let web3 = new Web3(new Web3.providers.HttpProvider(EDUCHAIN_RPC_URL));
let contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
let userAccount;

// 🚀 **Connect Wallet**
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userAccount = accounts[0];
        document.getElementById("walletAddress").innerText = `Wallet: ${userAccount}`;
        contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    } else {
        alert("Please install MetaMask!");
    }
}

// 🚀 **Check EDU Token Balance**
async function checkBalance() {
    if (!userAccount) {
        alert("Connect your wallet first!");
        return;
    }

    try {
        const balance = await contract.methods.balanceOf(userAccount).call();
        document.getElementById("balanceDisplay").innerText = `Your balance: ${web3.utils.fromWei(balance, "ether")} EDU`;
    } catch (error) {
        console.error("Error fetching balance:", error);
        document.getElementById("balanceDisplay").innerText = "⚠️ Error fetching balance.";
    }
}

// 🚀 **Claim Rewards Based on Score**
async function claimRewards() {
    if (!userAccount) {
        alert("Connect your wallet first!");
        return;
    }

    try {
        // **Simulated score** (Replace this with real backend API call)
        const userScore = Math.floor(Math.random() * 100);
        let rewardAmount;

        if (userScore >= 90) rewardAmount = web3.utils.toWei("50", "ether"); // 50 EDU
        else if (userScore >= 75) rewardAmount = web3.utils.toWei("20", "ether"); // 20 EDU
        else rewardAmount = "0";

        if (rewardAmount !== "0") {
            await contract.methods.rewardUser(userAccount, rewardAmount).send({ from: userAccount });
            document.getElementById("rewardMessage").innerText = `✅ You claimed ${web3.utils.fromWei(rewardAmount, "ether")} EDU tokens!`;
        } else {
            document.getElementById("rewardMessage").innerText = "❌ You did not qualify for rewards this time.";
        }

        checkBalance(); // Update balance after claiming rewards
    } catch (error) {
        console.error("Error claiming rewards:", error);
        document.getElementById("rewardMessage").innerText = "⚠️ Error claiming rewards.";
    }
}

// **Event Listeners**
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("checkBalance").addEventListener("click", checkBalance);
document.getElementById("claimRewards").addEventListener("click", claimRewards);

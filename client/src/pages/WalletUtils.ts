// WalletUtils.ts

import Web3 from 'web3';

const CONTRACT_ADDRESS = "0xf8A0361D410dBF656B3351FAdcd506aB2b67e293";  // Replace with your EduChain contract address
const ABI: any[] = [ /* Paste your contract ABI here */ ];
const EDUCHAIN_RPC_URL = "https://open-campus-codex-sepolia.drpc.org";  // ✅ Your EduChain RPC URL

let web3: Web3 = new Web3(new Web3.providers.HttpProvider(EDUCHAIN_RPC_URL));
let contract: any = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
let userAccount: string | null = null;

// 🚀 **Connect Wallet**
export async function connectWallet(): Promise<string | null> {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" })
            .then((response: unknown) => {
                // Ensure the response is a string array
                if (Array.isArray(response) && response.every((item) => typeof item === 'string')) {
                    return response;
                }
                throw new Error("Invalid response from MetaMask");
            })
            .catch((error: any) => {
                console.error("Error requesting accounts:", error);
                return [];
            });

        if (accounts.length > 0) {
            userAccount = accounts[0];
            contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
            return userAccount;
        } else {
            alert("No accounts found in MetaMask!");
            return null;
        }
    } else {
        alert("Please install MetaMask!");
        return null;
    }
}

// 🚀 **Check EDU Token Balance**
export async function checkBalance(): Promise<string> {
    if (!userAccount) {
        alert("Connect your wallet first!");
        return "⚠️ Connect your wallet first.";
    }

    try {
        const balance: string = await contract.methods.balanceOf(userAccount).call();
        return web3.utils.fromWei(balance, "ether");
    } catch (error) {
        console.error("Error fetching balance:", error);
        return "⚠️ Error fetching balance.";
    }
}

// 🚀 **Claim Rewards Based on Score**
export async function claimRewards(): Promise<string> {
    if (!userAccount) {
        alert("Connect your wallet first!");
        return "⚠️ Connect your wallet first.";
    }

    try {
        // **Simulated score** (Replace this with real backend API call)
        const userScore: number = Math.floor(Math.random() * 100);
        let rewardAmount: string;

        if (userScore >= 90) rewardAmount = web3.utils.toWei("50", "ether"); // 50 EDU
        else if (userScore >= 75) rewardAmount = web3.utils.toWei("20", "ether"); // 20 EDU
        else rewardAmount = "0";

        if (rewardAmount !== "0") {
            await contract.methods.rewardUser(userAccount, rewardAmount).send({ from: userAccount });
            return `✅ You claimed ${web3.utils.fromWei(rewardAmount, "ether")} EDU tokens!`;
        } else {
            return "❌ You did not qualify for rewards this time.";
        }
    } catch (error) {
        console.error("Error claiming rewards:", error);
        return "⚠️ Error claiming rewards.";
    }
}
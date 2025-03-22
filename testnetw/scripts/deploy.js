const hre = require("hardhat");

async function main() {
  const EduChainToken = await hre.ethers.getContractFactory("EduChainToken");
  const token = await EduChainToken.deploy();
  
  await token.waitForDeployment();
  
  console.log("EduChainToken deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


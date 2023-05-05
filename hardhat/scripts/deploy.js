const hre = require("hardhat");
const writeFileSync = require("fs");
async function main() {
  const MagicNumber = await hre.ethers.getContractFactory("MagicNumber");
  const magicNumber = await MagicNumber.deploy();

  await magicNumber.deployed();

  console.log(`Contract deployed to ${magicNumber.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers, run} from "hardhat";

async function main() {
  const SocialMedia = await ethers.getContractFactory("SocialMedia");
  const socialMedia = await SocialMedia.deploy();
  const WAIT_BLOCK_CONFIRMATIONS = 6;

  await socialMedia.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

  await socialMedia.deployed();

  console.log("socialMedia contract address", socialMedia.address);

  await run(`verify:verify`, {
    address: socialMedia.address,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { run } from "hardhat";

async function main(): Promise<void> {
  const contractAddress = process.argv[2];
  
  if (!contractAddress) {
    console.error("❌ Please provide the contract address as an argument");
    console.log("Usage: npx hardhat run scripts/verify.ts --network sepolia <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log("Verifying contract on Etherscan...");
  console.log("Contract Address:", contractAddress);
  console.log("==================================================");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log("==================================================");
    console.log("✅ Contract verified successfully!");
    console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}#code`);
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
      console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}#code`);
    } else {
      console.error("❌ Verification failed:", error.message);
      process.exitCode = 1;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
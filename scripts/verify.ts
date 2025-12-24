import { run } from "hardhat";

async function main(): Promise<void> {
  // Use the deployed contract address (with access control)
  const contractAddress = "0xdB43ef44E2Ad3B1f33F0573ADD326B86D6832e0B";
  
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
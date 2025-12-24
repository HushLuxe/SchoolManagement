import { run } from "hardhat";

async function main(): Promise<void> {
  // Use the deployed contract address
  const contractAddress = "0xEb25C627B387f8f860B0622a0f2d2343f2a454C3";
  
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
import { ethers } from "hardhat";

async function main(): Promise<void> {
  console.log("Deploying SchoolManagement contract...");
  console.log("==================================================");

  // Get the ContractFactory
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  const SchoolManagement = await ethers.getContractFactory("SchoolManagement");
  
  // Deploy the contract
  console.log("\nDeploying contract...");
  const schoolManagement = await SchoolManagement.deploy();
  
  // Wait for deployment to finish
  await schoolManagement.waitForDeployment();
  
  const contractAddress = await schoolManagement.getAddress();
  console.log("\n✅ SchoolManagement deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Contract Owner:", deployer.address);
  console.log("==================================================");
  
  // Example usage
  console.log("\n--- Testing contract deployment ---");
  
  // Register test students with realistic names
  console.log("\nRegistering students...");
  const tx1 = await schoolManagement.registerStudent("Mary Jane", 20);
  await tx1.wait();
  console.log("✓ Registered: Mary Jane, Age 20");
  
  const tx2 = await schoolManagement.registerStudent("Joy Okoye", 22);
  await tx2.wait();
  console.log("✓ Registered: Joy Okoye, Age 22");
  
  const tx3 = await schoolManagement.registerStudent("Lewis John", 19);
  await tx3.wait();
  console.log("✓ Registered: Lewis John, Age 19");
  
  // Get student count
  const studentCount = await schoolManagement.getStudentCount();
  console.log(`\nTotal students registered: ${studentCount}`);
  
  // Get all students
  console.log("\n--- All Students ---");
  const allStudents = await schoolManagement.getAll();
  for (let i = 0; i < allStudents.length; i++) {
    console.log(`${i + 1}. ${allStudents[i].name} (Age: ${allStudents[i].age}, Status: ${allStudents[i].status === 0n ? 'ACTIVE' : allStudents[i].status === 1n ? 'DEFERRED' : 'RUSTICATED'})`);
  }
  
  // Test updating student status
  console.log("\n--- Updating Student Status ---");
  const tx4 = await schoolManagement.updateStudentStatus(2, 1); // DEFERRED status for Joy Okoye
  await tx4.wait();
  console.log("✓ Joy Okoye status updated to DEFERRED");
  
  // Verify update
  const student = await schoolManagement.getById(2);
  console.log(`Verified: ${student.name} - Status: ${student.status === 0n ? 'ACTIVE' : student.status === 1n ? 'DEFERRED' : 'RUSTICATED'}`);
  
  console.log("\n--- Deployment and testing completed successfully! ---");
  console.log(`\nContract Address: ${await schoolManagement.getAddress()}`);
  console.log("Save this address to interact with the contract!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
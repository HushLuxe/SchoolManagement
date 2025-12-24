const hre = require("hardhat");

async function main() {
  console.log("Deploying SchoolManagement contract...");

  // Get the ContractFactory
  const SchoolManagement = await hre.ethers.getContractFactory("SchoolManagement");
  
  // Deploy the contract
  const schoolManagement = await SchoolManagement.deploy();
  
  // Wait for deployment to finish
  await schoolManagement.waitForDeployment();
  
  const contractAddress = await schoolManagement.getAddress();
  console.log("SchoolManagement deployed to:", contractAddress);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployed by:", deployer.address);
  
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
    const statusText = allStudents[i].status === 0n ? 'ACTIVE' : allStudents[i].status === 1n ? 'DEFERRED' : 'RUSTICATED';
    console.log(`${i + 1}. ${allStudents[i].name} (Age: ${allStudents[i].age}, Status: ${statusText})`);
  }
  
  // Test updating student status
  console.log("\n--- Updating Student Status ---");
  const tx4 = await schoolManagement.updateStudentStatus(2, 1); // DEFERRED status for Joy Okoye
  await tx4.wait();
  console.log("✓ Joy Okoye status updated to DEFERRED");
  
  // Verify update
  const student = await schoolManagement.getById(2);
  const statusText = student.status === 0n ? 'ACTIVE' : student.status === 1n ? 'DEFERRED' : 'RUSTICATED';
  console.log(`Verified: ${student.name} - Status: ${statusText}`);
  
  console.log("\n--- Deployment and testing completed successfully! ---");
  const contractAddress = await schoolManagement.getAddress();
  console.log(`\nContract Address: ${contractAddress}`);
  console.log("Save this address to interact with the contract!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
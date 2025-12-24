const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SchoolManagement", function () {
  let schoolManagement;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get Signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const SchoolManagement = await ethers.getContractFactory("SchoolManagement");
    schoolManagement = await SchoolManagement.deploy();
    await schoolManagement.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await schoolManagement.owner()).to.equal(owner.address);
    });

    it("Should have zero students initially", async function () {
      const count = await schoolManagement.getStudentCount();
      expect(Number(count)).to.equal(0);
    });

    it("Should have zero studentId initially", async function () {
      const id = await schoolManagement.studentId();
      expect(Number(id)).to.equal(0);
    });
  });

  describe("Student Registration", function () {
    it("Should register a student successfully", async function () {
      const tx = await schoolManagement.registerStudent("John Doe", 20);
      const receipt = await tx.wait();
      
      const count = await schoolManagement.getStudentCount();
      expect(Number(count)).to.equal(1);
      
      const student = await schoolManagement.getById(1);
      expect(student.name).to.equal("John Doe");
      expect(Number(student.age)).to.equal(20);
      expect(Number(student.status)).to.equal(0);
    });

    it("Should not register student with empty name", async function () {
      await expect(
        schoolManagement.registerStudent("", 20)
      ).to.be.revertedWith("Name cannot be empty");
    });

    it("Should not register student with invalid age", async function () {
      await expect(
        schoolManagement.registerStudent("John Doe", 0)
      ).to.be.revertedWith("Invalid age");
    });

    it("Should not register student with age over 150", async function () {
      await expect(
        schoolManagement.registerStudent("John Doe", 200)
      ).to.be.revertedWith("Invalid age");
    });

    it("Should not allow non-owner to register student", async function () {
      await expect(
        schoolManagement.connect(addr1).registerStudent("John Doe", 20)
      ).to.be.revertedWith("Only owner can perform this action");
    });
  });

  describe("Student Updates", function () {
    beforeEach(async function () {
      await schoolManagement.registerStudent("John Doe", 20);
    });

    it("Should update student name", async function () {
      await schoolManagement.updateStudent(1, "Jane Doe");

      const student = await schoolManagement.getById(1);
      expect(student.name).to.equal("Jane Doe");
    });

    it("Should update student status", async function () {
      await schoolManagement.updateStudentStatus(1, 1); // 1 = DEFERRED

      const student = await schoolManagement.getById(1);
      expect(Number(student.status)).to.equal(1);
    });

    it("Should not update non-existent student", async function () {
      await expect(
        schoolManagement.updateStudent(999, "Jane Doe")
      ).to.be.revertedWith("Invalid student ID");
    });

    it("Should not update with empty name", async function () {
      await expect(
        schoolManagement.updateStudent(1, "")
      ).to.be.revertedWith("Name cannot be empty");
    });

    it("Should not allow non-owner to update student", async function () {
      await expect(
        schoolManagement.connect(addr1).updateStudent(1, "Jane Doe")
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should not allow non-owner to update student status", async function () {
      await expect(
        schoolManagement.connect(addr1).updateStudentStatus(1, 1)
      ).to.be.revertedWith("Only owner can perform this action");
    });
  });

  describe("Student Retrieval", function () {
    beforeEach(async function () {
      await schoolManagement.registerStudent("John Doe", 20);
      await schoolManagement.registerStudent("Jane Smith", 22);
      await schoolManagement.registerStudent("Bob Johnson", 19);
    });

    it("Should get student by ID", async function () {
      const student = await schoolManagement.getById(2);
      expect(student.name).to.equal("Jane Smith");
      expect(Number(student.age)).to.equal(22);
      expect(Number(student.status)).to.equal(0); // ACTIVE
    });

    it("Should get all students", async function () {
      const students = await schoolManagement.getAll();
      expect(students.length).to.equal(3);
      expect(students[0].name).to.equal("John Doe");
      expect(students[1].name).to.equal("Jane Smith");
      expect(students[2].name).to.equal("Bob Johnson");
    });

    it("Should get student by index", async function () {
      const student = await schoolManagement.getStudentByIndex(1);
      expect(student.name).to.equal("Jane Smith");
    });

    it("Should find students by name", async function () {
      await schoolManagement.registerStudent("John Doe", 25);
      const foundStudents = await schoolManagement.findStudentByName("John Doe");
      expect(foundStudents.length).to.equal(2);
    });

    it("Should not get non-existent student", async function () {
      await expect(
        schoolManagement.getById(999)
      ).to.be.revertedWith("Invalid student ID");
    });

    it("Should not get student with invalid index", async function () {
      await expect(
        schoolManagement.getStudentByIndex(999)
      ).to.be.revertedWith("Index out of bounds");
    });
  });

  describe("Student Deletion", function () {
    beforeEach(async function () {
      await schoolManagement.registerStudent("John Doe", 20);
      await schoolManagement.registerStudent("Jane Smith", 22);
      await schoolManagement.registerStudent("Bob Johnson", 19);
    });

    it("Should delete student by ID", async function () {
      await schoolManagement.deleteById(2);

      const count = await schoolManagement.getStudentCount();
      expect(Number(count)).to.equal(2);
      
      await expect(
        schoolManagement.getById(2)
      ).to.be.revertedWith("Student not found");
    });

    it("Should maintain order after deletion", async function () {
      await schoolManagement.deleteById(2); // Remove Jane Smith
      
      const students = await schoolManagement.getAll();
      expect(students.length).to.equal(2);
      expect(students[0].name).to.equal("John Doe");
      expect(students[1].name).to.equal("Bob Johnson");
    });

    it("Should not delete non-existent student", async function () {
      await expect(
        schoolManagement.deleteById(999)
      ).to.be.revertedWith("Invalid student ID");
    });

    it("Should not allow non-owner to delete student", async function () {
      await expect(
        schoolManagement.connect(addr2).deleteById(1)
      ).to.be.revertedWith("Only owner can perform this action");
    });
  });

  describe("Event Emissions", function () {
    it("Should register and verify student data", async function () {
      await schoolManagement.registerStudent("Test Student", 20);
      
      const student = await schoolManagement.getById(1);
      expect(student.name).to.equal("Test Student");
      expect(Number(student.age)).to.equal(20);
      expect(Number(student.status)).to.equal(0);
    });

    it("Should update student and verify changes", async function () {
      await schoolManagement.registerStudent("Original Name", 20);
      await schoolManagement.updateStudent(1, "Updated Name");
      
      const student = await schoolManagement.getById(1);
      expect(student.name).to.equal("Updated Name");
    });

    it("Should update status and verify changes", async function () {
      await schoolManagement.registerStudent("Test Student", 20);
      await schoolManagement.updateStudentStatus(1, 2); // 2 = RUSTICATED
      
      const student = await schoolManagement.getById(1);
      expect(Number(student.status)).to.equal(2);
    });

    it("Should delete student successfully", async function () {
      await schoolManagement.registerStudent("Test Student", 20);
      await schoolManagement.deleteById(1);
      
      const count = await schoolManagement.getStudentCount();
      expect(Number(count)).to.equal(0);
    });
  });
});
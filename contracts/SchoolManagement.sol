// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SchoolManagement {
    
    address public owner;
    
    // Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    enum Status {
        ACTIVE,
        DEFERRED,
        RUSTICATED
    }

    struct Students {
        uint id;
        string name;
        uint age;
        Status status;
    }

    Students[] public students;
    uint public studentId;

    // Events
    event StudentRegistered(uint indexed studentId, string name, uint age, Status status);
    event StudentUpdated(uint indexed studentId, string newName);
    event StudentDeleted(uint indexed studentId);
    event StudentStatusChanged(uint indexed studentId, Status newStatus);

    function registerStudent(string memory _name, uint _age) public onlyOwner {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0 && _age < 150, "Invalid age");
        
        studentId = studentId + 1;
        students.push(Students(studentId, _name, _age, Status.ACTIVE));
        
        emit StudentRegistered(studentId, _name, _age, Status.ACTIVE);
    }

    function updateStudent(uint _id, string memory _newName) public onlyOwner {
        require(bytes(_newName).length > 0, "Name cannot be empty");
        require(_id > 0 && _id <= studentId, "Invalid student ID");
        
        for (uint i = 0; i < students.length; i++) {
            if (students[i].id == _id) {
                students[i].name = _newName;
                emit StudentUpdated(_id, _newName);
                return;
            }
        }
        
        revert("Student not found");
    }

    function updateStudentStatus(uint _id, Status _newStatus) public onlyOwner {
        require(_id > 0 && _id <= studentId, "Invalid student ID");
        
        for (uint i = 0; i < students.length; i++) {
            if (students[i].id == _id) {
                students[i].status = _newStatus;
                emit StudentStatusChanged(_id, _newStatus);
                return;
            }
        }
        
        revert("Student not found");
    }

    // This function removes student from array completely
    function deleteById(uint _id) public onlyOwner {
        require(_id > 0 && _id <= studentId, "Invalid student ID");
        
        for (uint i = 0; i < students.length; i++) {
            if (students[i].id == _id) {
                // Remove student by shifting array elements
                for (uint j = i; j < students.length - 1; j++) {
                    students[j] = students[j + 1];
                }
                students.pop();
                emit StudentDeleted(_id);
                return;
            }
        }
        
        revert("Student not found");
    }

    function getById(uint _id) public view returns (Students memory) {
        require(_id > 0 && _id <= studentId, "Invalid student ID");
        
        for (uint i = 0; i < students.length; i++) {
            if (students[i].id == _id) {
                return students[i];
            }
        }
        
        revert("Student not found");
    }

    function getAll() public view returns (Students[] memory) {
        return students;
    }

    function getStudentCount() public view returns (uint) {
        return students.length;
    }

    function getStudentByIndex(uint _index) public view returns (Students memory) {
        require(_index < students.length, "Index out of bounds");
        return students[_index];
    }

    function findStudentByName(string memory _name) public view returns (Students[] memory) {
        Students[] memory foundStudents = new Students[](students.length);
        uint count = 0;
        
        for (uint i = 0; i < students.length; i++) {
            if (keccak256(bytes(students[i].name)) == keccak256(bytes(_name))) {
                foundStudents[count] = students[i];
                count++;
            }
        }
        
        // Create properly sized array
        Students[] memory result = new Students[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = foundStudents[i];
        }
        
        return result;
    }
}
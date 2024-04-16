// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2; // Change the compiler version to match the required version

contract TaskManager {
    address public admin;
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    struct Task {
        string name;
        bool completed;
    }

    event TaskAdded(uint256 taskId, string name);
    event TaskCompleted(uint256 taskId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addTask(string memory _name) public onlyAdmin {
        tasks[taskCount] = Task(_name, false);
        emit TaskAdded(taskCount, _name);
        taskCount++;
    }

    function toggleTask(uint256 _taskId) public onlyAdmin {
        require(_taskId < taskCount, "Invalid task ID");
        tasks[_taskId].completed = !tasks[_taskId].completed;
        emit TaskCompleted(_taskId);
    }
}

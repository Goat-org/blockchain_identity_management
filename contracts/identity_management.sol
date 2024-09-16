pragma solidity ^0.5.0;

contract identity_management {
    uint public taskCount = 0;

    // Structure to store user data
    struct User {
        string fName;
        string lName;
        string birthDate;
    }

    // Mapping to store user information using their address
    mapping(address => User) public users;

    // Event to log user data submission
    event UserSubmitted(address indexed userAddress, string fName, string lName, string birthDate);

    // Function to submit the form data
    function submitForm(string memory _fName, string memory _lName, string memory _birthDate) public {
        // Create a new user and store it in the mapping
        users[msg.sender] = User(_fName, _lName, _birthDate);

        // Emit an event for logging purposes
        emit UserSubmitted(msg.sender, _fName, _lName, _birthDate);
    }

    // Function to retrieve user data
    function getUser(address _userAddress) public view returns (string memory, string memory, string memory) {
        User memory user = users[_userAddress];
        return (user.fName, user.lName, user.birthDate);
    }
}


    
    
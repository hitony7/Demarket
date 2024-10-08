// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This contract implements a simple decentralized escrow system
contract DecentralizedEscrow {
    // State variables to store the addresses of the buyer, seller, and arbiter
    address public buyer;
    address public seller;
    address public arbiter;
    // State variable to store the amount of ether in escrow
    uint256 public amount;
    // State variable to track if the transaction is disputed
    bool public isDisputed;

    // Constructor to initialize the contract with the seller and arbiter addresses
    // The buyer is the address deploying the contract and sending ether
    constructor(address _seller, address _arbiter) payable {
        buyer = msg.sender; // The buyer is the contract deployer
        seller = _seller; // The seller's address
        arbiter = _arbiter; // The arbiter's address
        amount = msg.value; // The amount of ether sent to the contract
        isDisputed = false; // Initially, there is no dispute
    }

    // Function for the buyer to confirm receipt of goods/services
    function confirmReceipt() external {
        require(msg.sender == buyer, "Only buyer can confirm receipt"); // Only the buyer can call this
        require(!isDisputed, "Transaction is disputed"); // Cannot confirm if there is a dispute
        //implement for Commission send to arbiter
        // based on karma based off of the buyer
        payable(seller).transfer(amount); // Transfer the escrowed amount to the seller
    }

    // Function to raise a dispute by either the buyer or the seller
    function dispute() external {
        require(
            msg.sender == buyer || msg.sender == seller,
            "Only buyer or seller can dispute"
        ); // Only buyer or seller can dispute
        isDisputed = true; // Set the dispute flag to true
    }

    // Function for the arbiter to resolve a dispute
    // The arbiter decides whether to release funds to the seller or refund the buyer
    function resolveDispute(bool releaseToSeller) external {
        require(msg.sender == arbiter, "Only arbiter can resolve disputes"); // Only the arbiter can resolve disputes
        require(isDisputed, "No dispute to resolve"); // There must be a dispute to resolve
        if (releaseToSeller) {
            payable(seller).transfer(amount); // Transfer funds to the seller if true
        } else {
            payable(buyer).transfer(amount); // Refund the buyer if false
        }
        isDisputed = false; // Reset the dispute flag
    }
}

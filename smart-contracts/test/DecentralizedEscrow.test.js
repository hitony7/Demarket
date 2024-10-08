// Import the DecentralizedEscrow contract artifact
const DecentralizedEscrow = artifacts.require("DecentralizedEscrow");

// Test suite for the DecentralizedEscrow contract
contract("DecentralizedEscrow", (accounts) => {
  // Destructure the first three accounts for buyer, seller, and arbiter
  const [buyer, seller, arbiter] = accounts;

  // Declare a variable to hold the deployed escrow contract instance
  let escrow;

  // Before each test, deploy a new instance of the escrow contract
  beforeEach(async () => {
    escrow = await DecentralizedEscrow.new(seller, arbiter, { from: buyer, value: web3.utils.toWei("1", "ether") });
  });

  // Test case: Verify that the contract sets the correct addresses for buyer, seller, and arbiter
  it("should set the correct buyer, seller, and arbiter", async () => {
    assert.equal(await escrow.buyer(), buyer, "Buyer address mismatch");
    assert.equal(await escrow.seller(), seller, "Seller address mismatch");
    assert.equal(await escrow.arbiter(), arbiter, "Arbiter address mismatch");
  });

  // Test case: Verify that the buyer can confirm receipt and funds are transferred
  it("should allow the buyer to confirm receipt", async () => {
    await escrow.confirmReceipt({ from: buyer });
    const balance = await web3.eth.getBalance(escrow.address);
    assert.equal(balance, 0, "Contract balance should be 0 after confirmation");
  });

  // Test case: Verify that either buyer or seller can initiate a dispute
  it("should allow the buyer or seller to dispute", async () => {
    await escrow.dispute({ from: buyer });
    assert.isTrue(await escrow.isDisputed(), "Dispute flag should be set to true");
  });

  // Test case: Verify that the arbiter can resolve a dispute in favor of the seller
  it("should allow the arbiter to resolve a dispute in favor of the seller", async () => {
    await escrow.dispute({ from: buyer });
    await escrow.resolveDispute(true, { from: arbiter });
    const balance = await web3.eth.getBalance(escrow.address);
    assert.equal(balance, 0, "Contract balance should be 0 after resolution");
  });

  // Test case: Verify that the arbiter can resolve a dispute in favor of the buyer
  it("should allow the arbiter to resolve a dispute in favor of the buyer", async () => {
    await escrow.dispute({ from: buyer });
    await escrow.resolveDispute(false, { from: arbiter });
    const balance = await web3.eth.getBalance(escrow.address);
    assert.equal(balance, 0, "Contract balance should be 0 after resolution");
  });
});
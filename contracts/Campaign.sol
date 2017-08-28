// b9lab MODULE 4

pragma solidity ^0.4.6;

contract Campaign {
 
    address public owner;
    uint    public deadline;
    uint    public goal;
    uint    public fundsRaised;
    
    struct FunderStruct {
        address funder;
        uint amount;
    }
    
    FunderStruct[] public funderStructs;
    
    event LogContribution(address sender, uint amount);
    event LogRefund(address funder, uint amount);
    event LogWithdrawal(address beneficiary, uint amount);
    
    function Campaign(uint campaignDuration, uint campaignGoal) {
        owner = msg.sender;
        deadline = block.number + campaignDuration;
        goal = campaignGoal;
    }
    
    function isSuccess() public constant returns(bool isIndeed) {
        return (fundsRaised >= goal);
    }
    
    function hasFailed() public constant returns(bool hasIndeed) {
        return (fundsRaised < goal && block.number > deadline);
    }

    function contribute() public payable returns(bool success) {
        require(msg.value > 0 && !isSuccess() && !hasFailed());
        
        fundsRaised += msg.value;
        
        FunderStruct memory newFunder;
        newFunder.funder = msg.sender;
        newFunder.amount = msg.value;
        funderStructs.push(newFunder);
        
        LogContribution(msg.sender, msg.value);

        return true;
    }
    
    function withdrawFunds() public returns(bool success) {
        require(msg.sender == owner);
        require(isSuccess());

        uint amount = this.balance;

        owner.transfer(amount);
        
        LogWithdrawal(owner, amount);

        return true;
    }
    
    function sendRefunds() public returns(bool success) {
        require(msg.sender == owner);
        require(hasFailed());

        uint funderCount = funderStructs.length;
        
        for (uint i = 0; i < funderCount; i++) {
            funderStructs[i].funder.transfer(funderStructs[i].amount);
            LogRefund(funderStructs[i].funder, funderStructs[i].amount);
        }

        return true;
    }
    
}
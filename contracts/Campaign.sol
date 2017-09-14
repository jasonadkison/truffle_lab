// b9lab MODULE 7

pragma solidity ^0.4.15;

import "./Stoppable.sol";

contract Campaign is Stoppable {

    address public sponsor;
    uint    public deadline;
    uint    public goal;
    uint    public fundsRaised;
    uint    public fundsWithdrawn;

    struct FunderStruct {
        uint amountContributed;
        uint amountRefunded;
    }

    mapping (address => FunderStruct) public funderStructs;

    event LogContribution(address sender, uint amount);
    event LogRefund(address funder, uint amount);
    event LogWithdrawal(address beneficiary, uint amount);

    modifier onlySponsor {
        require(msg.sender == sponsor);
        _;
    }

    function Campaign(address campaignSponsor, uint campaignDuration, uint campaignGoal) {
        sponsor = campaignSponsor;
        deadline = block.number + campaignDuration;
        goal = campaignGoal;
    }

    function isSuccess()
        public
        constant
        returns(bool isIndeed)
    {
        return (fundsRaised >= goal);
    }

    function hasFailed()
        public
        constant
        returns(bool hasIndeed)
    {
        return (fundsRaised < goal && block.number > deadline);
    }

    function contribute()
        public
        onlyIfRunning
        payable
        returns(bool success)
    {
        require(msg.value > 0 && !isSuccess() && !hasFailed());

        fundsRaised += msg.value;

        funderStructs[msg.sender].amountContributed += msg.value;

        LogContribution(msg.sender, msg.value);

        return true;
    }

    function withdrawFunds()
        onlySponsor
        onlyIfRunning
        returns(bool success)
    {
        require(isSuccess());

        uint amount = fundsRaised - fundsWithdrawn;

        require(amount > 0);

        fundsWithdrawn += amount;

        owner.transfer(amount);

        LogWithdrawal(owner, amount);

        return true;
    }

    function requestRefund()
        public
        onlyIfRunning
        returns(bool success)
    {
        require(hasFailed());
        uint amountOwed = funderStructs[msg.sender].amountContributed - funderStructs[msg.sender].amountRefunded;
        require(amountOwed > 0);
        funderStructs[msg.sender].amountRefunded += amountOwed;
        msg.sender.transfer(amountOwed);
        LogRefund(msg.sender, amountOwed);
        return true;
    }

}

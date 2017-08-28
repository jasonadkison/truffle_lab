const Campaign = artifacts.require("./Campaign.sol");

contract('Campaign', accounts => {

    var contract;
    var goal = 1000;
    var duration = 10;
    var deadline;
    var owner = accounts[0];

    beforeEach(() => {
        return Campaign.new(duration, goal, {from:owner})
            .then(instance => {
                contract = instance;
                deadline = web3.eth.blockNumber + duration;
            });
    });

    it('should say hello', () => {
        assert.strictEqual(true, true, 'failure error');
    });

    it('should be owned by owner', () => {
        return contract.owner({from:owner})
            .then(_owner => {
                assert.strictEqual(_owner, owner, 'contract is not owned by owner');
            });
    });

    it('should have a deadline', () => {
        return contract.deadline({from:owner})
            .then(_deadline => {
                assert.equal(_deadline.toString(10), deadline, 'deadline is wrong');
            });
    });

    it('should process contributions', () => {
        var fundsRaised;
        var contribution1;
        var contribution2;
        return contract.contribute({from: accounts[1], value: 10})
            .then(txn => {
                return contract.contribute({from: accounts[2], value: 5});
            })
            .then(txn2 => {
                return contract.fundsRaised({from:owner});
            })
            .then(_raised => {
                fundsRaised = _raised;
                return contract.funderStructs(0, {from:owner});
            })
            .then(_funder1 => {
                contribution1 = _funder1[1].toString(10);
                return contract.funderStructs(1, {from:owner});
            })
            .then(_funder2 => {
                contribution2 = _funder2[1].toString(10);
                assert.equal(fundsRaised.toString(10), 15, 'incorrect sum of funds raised');
                assert.equal(contribution1, 10, 'contribution 1 failed to track');
                assert.equal(contribution2, 5, 'contribution 2 failed to track');
                return contract.isSuccess({from:owner});
            })
            .then(_isSuccess => {
                assert.strictEqual(_isSuccess, false, 'campaign incorrectly declared successful');
                return contract.hasFailed({from:owner});
            })
            .then(_isFailed => {
                assert.strictEqual(_isFailed, false, 'campaign incorrectly declared as failed');
            });
                  
    });
});

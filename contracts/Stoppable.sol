pragma solidity ^0.4.15;

import "./Owned.sol";

contract Stoppable is Owned {

    bool public running;

    event LogRunSwitch(address sender, bool switchSetting);

    modifier onlyIfRunning {
        require(running);
        _;
    }

    function Stoppable() {
        running = true;
    }

    function runSwitch(bool onOff)
        onlyOwner
        returns(bool success)
    {
        running = onOff;
        LogRunSwitch(msg.sender, onOff);
        return true;
    }
}

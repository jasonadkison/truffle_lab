pragma solidity ^0.4.15;

import "./Campaign.sol";

contract CampaignHub is Stoppable {

    address[] public campaigns;
    mapping(address => bool) campaignExists;

    event LogNewCampaign(address sponsor, address campaign, uint duration, uint goal);
    event LogCampaignStopped(address sender, address campaign);
    event LogCampaignStarted(address sender, address campaign);
    event LogCampaignNewOwner(address sender, address oldOwner, address newOwner);

    modifier onlyValidCampaign(address campaign) {
        require(campaignExists[campaign]);
        _;
    }

    function getCampaignCount()
        public
        constant
        returns(uint campaignCount)
    {
        return campaigns.length;
    }

    function newCampaign(uint campaignDuration, uint campaignGoal)
        public
        returns(address campaignContract)
    {
        Campaign trustedCampaign = new Campaign(msg.sender, campaignDuration, campaignGoal);
        campaigns.push(trustedCampaign);
        campaignExists[trustedCampaign] = true;
        LogNewCampaign(msg.sender, trustedCampaign, campaignDuration, campaignGoal);
        return trustedCampaign;
    }

    function stopCampaign(address campaign)
        onlyOwner
        onlyValidCampaign(campaign)
        returns(bool)
    {
        Campaign trustedCampaign = Campaign(campaign);
        require(trustedCampaign.runSwitch(false));
        LogCampaignStopped(msg.sender, campaign);
        return true;
    }

    function startCampaign(address campaign)
        onlyOwner
        onlyValidCampaign(campaign)
        returns(bool)
    {
        Campaign trustedCampaign = Campaign(campaign);
        require(trustedCampaign.runSwitch(true));
        LogCampaignStarted(msg.sender, campaign);
        return true;
    }

    function changeCampaignOwner(address campaign, address newOwner)
        onlyOwner
        onlyValidCampaign(campaign)
        returns(bool)
    {
        Campaign trustedCampaign = Campaign(campaign);
        require(trustedCampaign.changeOwner(newOwner));
        LogCampaignNewOwner(msg.sender, campaign, newOwner);
    }

}

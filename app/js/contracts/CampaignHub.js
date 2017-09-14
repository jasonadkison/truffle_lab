import contract from 'truffle-contract';
import hub_artifacts from '../../../build/contracts/CampaignHub.json';
const CampaignHub = contract(hub_artifacts);

export default CampaignHub;

import Web3 from 'web3';
import Promise from 'bluebird';
import CampaignHub from './CampaignHub.js';
import Campaign from './Campaign.js';

// Assume we're running a local node. Metamask is buggy or we'd prefer it here instead.
// This app is for learning purposes anyways.
window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// Promisify web3 methods for convenience.
// web3 1.* beta supports promises out of the box, but is buggy
Promise.promisifyAll(window.web3.eth, { suffix: 'Promise' });
Promise.promisifyAll(window.web3.version, { suffix: 'Promise' });

CampaignHub.setProvider(window.web3.currentProvider);
Campaign.setProvider(window.web3.currentProvider);

export { CampaignHub, Campaign };

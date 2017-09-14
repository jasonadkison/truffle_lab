import { CampaignHub, Campaign } from './contracts';

export const fetchAccounts = () => {
  return (dispatch) => {
    return window.web3.eth.getAccountsPromise()
      .then(accounts => {
        if (!accounts.length) {
          throw new Error('No accounts found.');
        }
        const account = accounts[0];
        const balance = window.web3.eth.getBalance(account).toString(10);

        dispatch({ type: 'RECEIVE_ACCOUNTS', accounts });
        dispatch({ type: 'RECEIVE_ACCOUNT', account });
        dispatch({ type: 'RECEIVE_BALANCE', balance});
      })
      .catch((e) => {
        console.error(e);
      });
  };
};

export const fetchAccount = (account) => {
  return (dispatch, getState) => {
    return window.web3.eth.getBalancePromise(account)
      .then(_balance => {
        const balance = _balance.toString(10);
        dispatch({ type: 'RECEIVE_ACCOUNT', account });
        dispatch({ type: 'RECEIVE_BALANCE', balance });

        const { campaigns } = getState();
        campaigns.forEach(item => {
          dispatch(getFunder(item.campaign));
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };
};

export const createCampaign = ({ goal, duration }) => {
  return (dispatch, getState) => {
    const { account } = getState();
    return CampaignHub.deployed().then(instance => {
      return instance.newCampaign(duration, goal, { from: account, gas: 4000000 });
    });
  };
};

export const watchForNewCampaigns = () => {
  return dispatch => {
    return CampaignHub.deployed().then(instance => {
      return instance.LogNewCampaign({}, { fromBlock: 0 })
        .watch(function(err, newCampaign) {
          if (err) {
            console.error('Campaign Error: ', err);
          } else {
            dispatch({
              type: 'RECEIVE_LOG',
              item: {
                ...newCampaign,
                args: {
                  ...newCampaign.args,
                  user: newCampaign.args.sponsor,
                  amount: newCampaign.args.goal.toString(10),
                },
              },
            });
            dispatch(fetchCampaign(newCampaign.args.campaign));
          }
        });
    });
  };
}

export const watchReceived = address => {
  return dispatch => {
    const campaign = Campaign.at(address);
    return campaign.LogContribution({}, { fromBlock: 0 })
      .watch(function(err, received) {
        if (err) {
          console.error('Received error', address, err);
        } else {
          console.log('Contribution', received);
          dispatch({
            type: 'RECEIVE_LOG',
            item: {
              ...received,
              args: {
                ...received.args,
                user: received.args.sender,
                amount: parseInt(received.args.amount),
                campaign: address,
              },
            },
          });
        }
      });
  };
};

export const watchRefunded = address => {
  return dispatch => {
    const campaign = Campaign.at(address);
    return campaign.LogRefund({}, { fromBlock: 0 })
      .watch(function(err, refund) {
        if (err) {
          console.error('Refund error', address, err);
        } else {
          console.log('Refund', refund);
          dispatch({
            type: 'RECEIVE_LOG',
            item: {
              ...refund,
              args: {
                ...refund.args,
                user: refund.args.funder,
                amount: parseInt(refund.args.amount),
                campaign: address,
              },
            },
          });
        }
      });
  };
};

export const getFunder = address => {
  return (dispatch, getState) => {
    const { account } = getState();
    const campaign = Campaign.at(address);
    return campaign.funderStructs.call(account, { from: account })
      .then(funder => {
        dispatch({
          type: 'RECEIVE_FUNDER',
          campaign: address,
          account: account,
          contribution: parseInt(funder[0].toString(10)),
          refunded: parseInt(funder[1].toString(10)),
        });
      });
  };
};

export const fetchCampaign = address => {
  console.log('fetch campaign', address);
  return (dispatch, getState) => {
    const { account } = getState();
    const campaign = Campaign.at(address);
    const callParams = { from: account };
    const c = { campaign: address };

    return campaign.sponsor.call(callParams)
      .then(sponsor => {
        c.sponsor = sponsor;
        return campaign.deadline.call(callParams);
      })
      .then(deadline => {
        c.deadline = deadline.toString(10);
        return campaign.goal.call(callParams);
      })
      .then(goal => {
        c.goal = goal.toString(10);
        return campaign.fundsRaised.call(callParams);
      })
      .then(fundsRaised => {
        c.accepted = fundsRaised.toString(10);
        return campaign.fundsWithdrawn.call(callParams);
      })
      .then(withdrawn => {
        c.withdrawn = withdrawn.toString(10);
        return campaign.isSuccess.call(callParams);
      })
      .then(isSuccess => {
        c.isSuccess = isSuccess;
        return campaign.hasFailed.call(callParams);
      })
      .then(hasFailed => {
        c.hasFailed = hasFailed;

        c.status = 'open';
        if (c.isSuccess) c.status = 'success';
        if (c.hasFailed) c.status = 'failed';

        dispatch(watchReceived(address));
        dispatch(watchRefunded(address));
        dispatch(getFunder(address));

        dispatch({ type: 'RECEIVE_CAMPAIGN', campaign: c });
      });

  };
};

export function contribute(address, amount) {
  return (dispatch, getState) => {
    const { account } = getState();
    const campaign = Campaign.at(address);
    const txParams = { from: account, value: parseInt(amount), gas: 4000000 };
    return campaign.contribute(txParams);
  };
}

export function refund(campaignAddress) {
  return (dispatch, getState) => {
    const { account } = getState();
    const campaign = Campaign.at(campaignAddress);
    return campaign.requestRefund({ from: account, gas: 4000000 });
  };
}

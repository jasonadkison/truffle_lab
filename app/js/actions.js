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
  return (dispatch) => {
    return window.web3.eth.getBalancePromise(account)
      .then(_balance => {
        const balance = _balance.toString(10);
        dispatch({ type: 'RECEIVE_ACCOUNT', account });
        dispatch({ type: 'RECEIVE_BALANCE', balance });
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

        // TODO: trigger watch recieved & funded on address

        // TODO: get funder

        dispatch({ type: 'RECEIVE_CAMPAIGN', campaign: c });
      });

  };
};

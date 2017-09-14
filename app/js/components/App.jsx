import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../store.js';
import NewCampaignForm from './NewCampaignForm.jsx';
import Balance from './Balance.jsx';
import ContributionForm from './ContributionForm.jsx';
import Campaigns from './Campaigns.jsx';
import Logs from './Logs.jsx';

import { fetchAccounts, watchForNewCampaigns } from '../actions.js';

export default class App extends Component {
  componentDidMount() {
    store.dispatch(fetchAccounts());
    store.dispatch(watchForNewCampaigns());
  }
  render() {
    return (
      <Provider store={store}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <h3>Campaign Hub</h3>
              <NewCampaignForm />
              <Balance />
              <div>

                <div className="panel panel-default">
                  <div className="panel-body">

                    <ContributionForm />
                    <Campaigns />
                    <Logs />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}

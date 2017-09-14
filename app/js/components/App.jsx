import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../store.js';
import NewCampaignForm from './NewCampaignForm.jsx';
import Temp from './Temp.jsx';
import Balance from './Balance.jsx';

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
              <Temp />
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}

import React, { Component } from 'react';
import ContributionForm from './ContributionForm.jsx';
import Campaigns from './Campaigns.jsx';
import Logs from './Logs.jsx';

export default class Temp extends Component {
  onSubmitContribution = e => {
    e.preventDefault();
    console.log('on submit contribution');
  }
  render() {
    return (
      <div>

        <div className="panel panel-default">
          <div className="panel-body">

            <ContributionForm />
            <Campaigns />
            <Logs />

          </div>
        </div>
      </div>
    );
  }
}

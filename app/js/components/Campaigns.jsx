import React, { Component } from 'react';
import { connect } from 'react-redux';
import { refund } from '../actions.js';

class Campaigns extends Component {
  onClickRefund = (e, campaign) => {
    e.preventDefault();
    this.props.dispatch(refund(campaign));
  }
  render() {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Goal</th>
            <th>Funds Accepted</th>
            <th>Funds Withdrawn</th>
            <th>Deadline</th>
            <th>User Contributed</th>
            <th>User Refunded</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.props.campaigns.map(item => (
            <tr key={item.campaign}>
              <td>{item.campaign}</td>
              <td>{item.goal}</td>
              <td>{item.accepted}</td>
              <td>{item.withdrawn}</td>
              <td>{item.deadline}</td>
              <td>{item.funderContribution}</td>
              <td>{item.funderRefund}</td>
              <td>{item.status}</td>
              <td>
                <input
                  type="submit"
                  className="btn btn-success addnew pull-right"
                  value="Refund"
                  disabled={
                    (item.status !== 'failed' || item.funderContribution - item.funderRefund <= 0)
                  }
                  onClick={e => {
                    this.onClickRefund(e, item.campaign);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default connect(state => {
  return {
    campaigns: state.campaigns,
  };
})(Campaigns);

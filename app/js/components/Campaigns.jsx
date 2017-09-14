import React, { Component } from 'react';
import { connect } from 'react-redux';

class Campaigns extends Component {
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
              <td>item.userAccepted</td>
              <td>item.userRefunded</td>
              <td>{item.status}</td>
              <td>
                <form>
                  <input type="submit" className="btn btn-success addnew pull-right" value="Refund" />
                </form>
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
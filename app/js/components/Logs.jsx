import React, { Component } from 'react';
import { connect } from 'react-redux';

class Logs extends Component {
  render() {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Event</th>
            <th>Amount</th>
            <th>Campaign</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {this.props.logs.map(item => (
            <tr key={item.transactionHash}>
              <td>{item.event}</td>
              <td>{item.args.amount}</td>
              <td>{item.args.campaign}</td>
              <td>{item.args.user}</td>
            </tr>
          ))}

        </tbody>
      </table>
    );
  }
}

export default connect(state => {
  return {
    logs: state.logs,
  };
})(Logs);

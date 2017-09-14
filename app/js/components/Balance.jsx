import React, { Component } from 'react';
import { connect } from 'react-redux';

class Balance extends Component {
  render() {
    const { balance, account } = this.props;
    return (
      <h6>
        Your Balance (wei): {balance} <span style={{color: '#777'}}>(account: {account})</span>
      </h6>
    );
  }
}

export default connect((state) => {
  return {
    balance: state.balance,
    account: state.account,
  };
})(Balance);

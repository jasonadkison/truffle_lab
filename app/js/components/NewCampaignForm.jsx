import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAccount, createCampaign } from '../actions';

const initialState = {
  goal: '',
  duration: '',
};

class NewCampaignForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }
  onChangeGoal = e => {
    e.preventDefault();
    if (e.target.value !== '' && e.target.value < 1) return;
    this.setState({ goal: e.target.value });
  }
  onChangeDuration = e => {
    e.preventDefault();
    if (e.target.value !== '' && e.target.value < 1) return;
    this.setState({ duration: e.target.value });
  }
  onSubmitNewCampaign = e => {
    e.preventDefault();
    const { goal, duration } = this.state;
    this.props.dispatch(createCampaign({ goal, duration }))
      .then(() => {
        this.setState({ ...initialState });
        this.props.dispatch(fetchAccount(this.props.account));
      });
  }
  onChangeAccount = e => {
    e.preventDefault();
    this.props.dispatch(fetchAccount(e.target.value));
  }
  render() {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <form id="campaignForm" onSubmit={this.onSubmitNewCampaign}>
                <input
                  type="number"
                  name="goal"
                  placeholder="goal in Wei"
                  size="10"
                  required
                  value={this.state.goal}
                  onChange={this.onChangeGoal}
                />
                <input
                  type="number"
                  name="duration"
                  placeholder="duration in Blocks"
                  value={this.state.duration}
                  onChange={this.onChangeDuration}
                  required
                />
                <input type="submit" className="btn btn-primary addnew" value="New Campaign" />
              </form>
            </td>
            <td>
              <select name="account" onChange={this.onChangeAccount} value={this.props.account}>
                <option>Choose Account</option>
                {this.props.accounts.map(account => (
                  <option key={account} value={account}>
                    {account}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default connect(state => {
  return {
    accounts: state.accounts,
    account: state.account,
  };
})(NewCampaignForm);

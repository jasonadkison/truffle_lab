import React, { Component } from 'react';
import { connect } from 'react-redux';
import { contribute, fetchAccount } from '../actions.js';

const initialState = { campaign: '', amount: '' };

class ContributionForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }
  onChangeCampaign = e => {
    e.preventDefault();
    if (e.target.value !== '' && !e.target.value.length) return;
    this.setState({ campaign: e.target.value });
  }
  onChangeAmount = e => {
    e.preventDefault();
    if (e.target.value !== '' && e.target.value < 1) return;
    this.setState({ amount: parseInt(e.target.value, 10) });
  }
  onSubmitContribution = e => {
    e.preventDefault();
    const { campaign, amount } = this.state;
    this.props.dispatch(contribute(campaign, amount))
      .then(() => {
        this.setState({ ...initialState });
      });
  }
  render() {
    return (
      <form onSubmit={this.onSubmitContribution}>
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th>Choose Campaign to Contribute</th>
              <th>Contribution in Wei</th>
              <th></th>
            </tr>
            <tr>
              <td>
                <select
                  required
                  onChange={this.onChangeCampaign}
                  value={this.state.campaign}
                >
                  <option></option>
                  {this.props.campaigns.map(item => (
                    <option key={item.campaign} value={item.campaign}>
                      {item.campaign}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0 in Wei"
                  required
                  value={this.state.amount}
                  onChange={this.onChangeAmount}
                />
              </td>
              <td><input type="submit" className="btn btn-primary addnew pull-right" value="Contribute" /></td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  }
}

export default connect(state => ({
  campaigns: state.campaigns
}))(ContributionForm);

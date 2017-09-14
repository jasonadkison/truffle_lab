import React, { Component } from 'react';
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

            <form id="contributeForm" onSubmit={this.onSubmitContribution}>
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th>Choose Campaign to Contribute</th>
                    <th>Contribution in Wei</th>
                    <th></th>
                  </tr>
                  <tr>
                    <td>
                      <select name="campaign" required>
                        <option></option>
                      </select>
                    </td>
                    <td><input type="text" className="form-control" data-ng-model="contribution" placeholder="0 in Wei" required /></td>
                    <td><input type="submit" className="btn btn-primary addnew pull-right" value="Contribute" /></td>
                  </tr>
                </tbody>
              </table>
            </form>

            <Campaigns />
            <Logs />

          </div>
        </div>
      </div>
    );
  }
}

import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const balance = (state = '', action) => {
  if (action.type === 'RECEIVE_BALANCE') {
    return action.balance;
  }
  return state;
};

const accounts = (state = [], action) => {
  if (action.type === 'RECEIVE_ACCOUNTS') {
    return [...action.accounts];
  }
  return state;
};

const account = (state = '', action) => {
  if (action.type === 'RECEIVE_ACCOUNT') {
    return action.account;
  }
  return state;
};

const logs = (state = [], action) => {
  if (action.type === 'RECEIVE_LOG') {
    return [...state, action.item];
  }
  return state;
};

const campaigns = (state = [], action) => {
  if (action.type === 'RECEIVE_CAMPAIGN') {
    if (state.filter(item => item.campaign === action.campaign.campaign).length) {
      return state.map(item => {
        if (item.campaign === action.campaign.campaign) {
          return {
            ...item,
            ...action.campaign,
          };
        };
        return item;
      });
    }
    return [...state, action.campaign];
  }
  if (action.type === 'RECEIVE_FUNDER') {
    return state.map(item => {
      if (item.campaign === action.campaign) {
        return {
          ...item,
          funderAddress: action.account,
          funderContribution: action.contribution,
          funderRefund: action.refunded,
        };
      }
      return item;
    })
  }
  return state;
}

const reducers = combineReducers({
  accounts,
  account,
  balance,
  logs,
  campaigns,
});

const middleware = applyMiddleware(thunk);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducers,
  composeEnhancers(middleware)
);

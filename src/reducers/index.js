import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { routerReducer } from 'react-router-redux';

import user from './user';
import settings from './settings';
import captureStatus from './captureStatus';
import errors from './errors';
import requests from './requests';

const combinedReducer = combineReducers({
  user,
  settings,
  captureStatus,
  errors,
  requests,
  routing: routerReducer,
});

const rootReducer = (state, action) => {
  switch (action.type) {
    case REHYDRATE:
      return Object.keys(state).reduce((result, current) => {
        const newState = result;
        if (action.payload[current]) {
          newState[current] = { ...state[current], ...action.payload[current] };
        } else {
          newState[current] = state[current];
        }
        if (current === 'user') {
          newState[current] = { ...newState[current], rehydrated: true };
        }
        if (current === 'settings') {
          newState[current] = { ...newState[current], externalOBSCapture: newState[current].pendingExternalOBSCapture };
        }
        return newState;
      }, {});
    default:
      return state;
  }
};

const reducers = (state, action) => {
  const intermediateState = combinedReducer(state, action);
  const finalState = rootReducer(intermediateState, action);
  return finalState;
};

export default reducers;

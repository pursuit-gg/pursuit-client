import { LOCATION_CHANGE } from 'react-router-redux';
import {
  ADD_ERROR,
  REMOVE_ERROR,
  ADD_TO_ERROR_ARRAY,
  REMOVE_FROM_ERROR_ARRAY,
  CLEAR_ERRORS,
  RESET_STATE_ON_LOGOUT,
} from '../actions/types';

const INITIAL_STATE = {};

const errors = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_ERROR:
      return Object.assign(
        {},
        state,
        { [action.key]: { id: action.id, message: action.errorMsg } },
      );
    case REMOVE_ERROR:
      return Object.keys(state)
        .filter(key => key !== action.key)
        .reduce((result, current) => {
          const newObj = result;
          newObj[current] = state[current];
          return newObj;
        }, {});
    case ADD_TO_ERROR_ARRAY:
      if (state[action.key] === undefined) {
        return {
          ...state,
          [action.key]: [action.val],
        };
      }
      return {
        ...state,
        [action.key]: [...state[action.key], action.val],
      };
    case REMOVE_FROM_ERROR_ARRAY:
      if (state[action.key] === undefined) {
        return state;
      }
      return {
        ...state,
        [action.key]: state[action.key].filter(val => (val !== action.val)),
      };
    case CLEAR_ERRORS:
      return {};
    case LOCATION_CHANGE:
      return {
        ...(state.login ? { login: state.login } : {}),
      };
    case RESET_STATE_ON_LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default errors;

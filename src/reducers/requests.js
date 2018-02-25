import {
  ADD_REQUEST,
  REMOVE_REQUEST,
  CLEAR_REQUESTS,
  RESET_STATE_ON_LOGOUT,
} from '../actions/types';

const INITIAL_STATE = {};

const requests = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_REQUEST: {
      return {
        ...state,
        [action.key]: [...(state[action.key] || []), action.value],
      };
    }
    case REMOVE_REQUEST:
      if (state[action.key]) {
        const index = state[action.key].indexOf(action.value);
        return {
          ...state,
          [action.key]: state[action.key].slice(0, index).concat(state[action.key].slice(index + 1)),
        };
      }
      return {
        ...state,
      };
    case CLEAR_REQUESTS:
      return {};
    case RESET_STATE_ON_LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default requests;

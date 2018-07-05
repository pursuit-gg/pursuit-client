import {
  MATCH_NOTIFICATIONS_LOADED,
  RESET_STATE_ON_LOGOUT,
} from '../actions/types';

const INITIAL_STATE = {
  matches: {},
};

const notifications = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MATCH_NOTIFICATIONS_LOADED:
      return {
        ...state,
        matches: action.matchNotifications,
      };
    case RESET_STATE_ON_LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default notifications;

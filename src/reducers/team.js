import {
  TEAM_LOADED,
  RESET_STATE_ON_LOGOUT,
} from '../actions/types';

const INITIAL_STATE = {
  name: null,
};

const team = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAM_LOADED:
      return {
        ...state,
        name: action.team.name,
      };
    case RESET_STATE_ON_LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default team;

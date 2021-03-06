import {
  AUTH_SUCCESS,
  AUTH_CHANGE,
  CLEAR_USER_AUTH,
  CLEAR_USER_SUCCESS_MESSAGE,
  UPDATE_USER_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  id: null,
  username: null,
  avatarUrl: null,
  email: null,
  unconfirmedEmail: null,
  hasTeamAccess: false,
  successMessage: '',
  client: null,
  accessToken: null,
  uid: null,
  tokenType: null,
  rehydrated: false,
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        id: action.user.id,
        username: action.user.username,
        avatarUrl: action.user.avatar_url,
        email: action.user.email,
        unconfirmedEmail: action.user.unconfirmed_email,
        hasTeamAccess: action.user.has_team_access,
        client: action.client,
        accessToken: action.accessToken,
        uid: action.uid,
        tokenType: action.tokenType,
      };
    case CLEAR_USER_AUTH:
      return { ...INITIAL_STATE, rehydrated: state.rehydrated };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        id: action.user.id,
        username: action.user.username,
        avatarUrl: action.user.avatar_url,
        email: action.user.email,
        unconfirmedEmail: action.user.unconfirmed_email,
        successMessage: action.message,
      };
    case AUTH_CHANGE:
      if (state.unconfirmedEmail === null) { return state; }
      return {
        ...state,
        email: state.unconfirmedEmail,
        unconfirmedEmail: null,
        uid: state.unconfirmedEmail,
      };
    case CLEAR_USER_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: '',
      };
    default:
      return state;
  }
};

export default user;

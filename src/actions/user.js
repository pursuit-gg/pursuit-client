import { push } from 'react-router-redux';
import mixpanel from 'mixpanel-browser';

import {
  AUTH_SUCCESS,
  AUTH_CHANGE,
  CLEAR_USER_AUTH,
  CLEAR_USER_SUCCESS_MESSAGE,
  RESET_STATE_ON_LOGOUT,
  UPDATE_USER_SUCCESS,
} from 'actions/types';
import {
  MP_USER_SIGNUP,
  MP_USER_COMPLETED_SIGNUP,
  MP_USER_LOGIN,
} from 'actions/mixpanelTypes';
import {
  signUpPost,
  loginPost,
  updateUserPost,
} from 'requests/users';
import { addError, removeError } from 'actions/errors';
import { addRequest, removeRequest } from 'actions/requests';

export function resetStateOnLogout() {
  return {
    type: RESET_STATE_ON_LOGOUT,
  };
}

function authSuccess(json, signUp) {
  mixpanel.identify(json.data.id);
  mixpanel.people.set({
    $user_id: json.data.id,
    $username: json.data.username,
    $email: json.data.email,    // only special properties need the $
    $created: json.data.created_at,
    $last_login: new Date(),         // properties can be dates...
  });
  mixpanel.register({
    username: json.data.username,
    user_id: json.data.id,
  });
  return {
    type: AUTH_SUCCESS,
    user: json.data,
    client: json.client,
    accessToken: json.accessToken,
    uid: json.uid,
    tokenType: json.tokenType,
    meta: {
      mixpanel: {
        event: signUp ? MP_USER_SIGNUP : MP_USER_LOGIN,
        props: { location: 'client' },
      },
    },
  };
}

function clearUserAuth() {
  return {
    type: CLEAR_USER_AUTH,
  };
}

export function clearUserMessage() {
  return {
    type: CLEAR_USER_SUCCESS_MESSAGE,
  };
}

export function authChange() {
  return {
    type: AUTH_CHANGE,
  };
}

function updateUserSuccess(json, signupCompleted) {
  mixpanel.identify(json.data.id);
  mixpanel.people.set({
    $username: json.data.username,
    $email: json.data.email,
  });
  mixpanel.register({
    username: json.data.username,
  });
  if (signupCompleted) {
    mixpanel.track(MP_USER_COMPLETED_SIGNUP, {
      location: 'client',
    });
  }
  return {
    type: UPDATE_USER_SUCCESS,
    user: json.data,
    message: 'User Updated Successfully',
  };
}

export const updateUser = (params, continueOnboarding = false) => (
  (dispatch, getState) => {
    dispatch(addRequest('updateUser'));
    dispatch(removeError('updateUser'));
    dispatch(clearUserMessage());
    updateUserPost(getState().user, params).then((data) => {
      dispatch(updateUserSuccess(data, continueOnboarding));
      dispatch(removeRequest('updateUser'));
      if (continueOnboarding) {
        dispatch(push('/onboarding'));
      } else {
        dispatch(push('/home'));
      }
    })
    .catch((err) => {
      dispatch(addError('updateUser', err));
      dispatch(removeRequest('updateUser'));
    });
  }
);

export const signUp = (email, password) => (
  (dispatch) => {
    dispatch(addRequest('signup'));
    dispatch(removeError('signup'));
    signUpPost(email, password)
      .then((data) => {
        dispatch(authSuccess(data, true));
        dispatch(push('/set_username'));
        dispatch(removeRequest('signup'));
      })
      .catch((err) => {
        dispatch(addError('signup', err));
        dispatch(removeRequest('signup'));
      });
  }
);

export const login = (email, password, redirectToOnboarding) => (
  (dispatch) => {
    dispatch(addRequest('login'));
    dispatch(removeError('login'));
    loginPost(email, password)
      .then((data) => {
        dispatch(authSuccess(data, false));
        dispatch(removeRequest('login'));
        if (redirectToOnboarding) {
          dispatch(push('/onboarding'));
        } else {
          dispatch(push('/home'));
        }
      })
      .catch((err) => {
        dispatch(addError('login', err));
        dispatch(removeRequest('login'));
      });
  }
);

export const logoutUser = () => (
  (dispatch) => {
    mixpanel.reset();
    dispatch(clearUserAuth());
    dispatch(resetStateOnLogout());
    dispatch(push('/welcome'));
  }
);

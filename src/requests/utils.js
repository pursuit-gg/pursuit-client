import 'whatwg-fetch';
import { logoutUser, authChange } from 'actions/user';
import { addError } from 'actions/errors';

export const AUTH_CHANGE_ERR_MESSAGE = 'auth_changed';

let store; // keep a reference to global store for noAuth logic
export const sendStoreToRequestUtils = (configuredStore) => {
  store = configuredStore;
};

const isUnauthorizedResponse = (response, method) => (
  response.status === 401 ||
    (response.status === 404 &&
      (method === 'PUT' || method === 'DELETE') &&
      response.url.match(/\/v1\/users$/)
    )
);

const isUnauthorizedError = (error, method, url) => (
  (error.status === 401 ||
    (error.status === 404 &&
      (method === 'PUT' || method === 'DELETE') &&
      url.match(/\/v1\/users$/)
    )
  ) &&
  error.message === AUTH_CHANGE_ERR_MESSAGE
);

export const handleNoAuth = (user, error) => {
  let errorMessage = error.message;
  if (user.unconfirmedEmail !== null) {
    store.dispatch(authChange());
    errorMessage = AUTH_CHANGE_ERR_MESSAGE;
  } else {
    const loggedOutError = error;
    loggedOutError.message = 'We were unable to complete the request. Please sign in again.';
    store.dispatch(logoutUser());
    store.dispatch(addError('login', loggedOutError));
  }
  return errorMessage;
};

export const checkStatus = (response, opts = {}) => {
  if (response.status >= 200 && response.status < 300) {
    const responseWithHeaders = {};
    responseWithHeaders.accessToken = response.headers.get('access-token');
    responseWithHeaders.uid = response.headers.get('uid');
    responseWithHeaders.client = response.headers.get('client');
    responseWithHeaders.tokenType = response.headers.get('token-type');
    return response.json().then((json) => {
      responseWithHeaders.data = json.data;
      return responseWithHeaders;
    });
  }
  if (response.status === 500) {
    const error = new Error('Internal Server Error');
    error.status = 500;
    throw error;
  }
  return response.json().then((data) => {
    const error = new Error(data.error);
    error.status = response.status;
    error.statusText = response.statusText;
    if (data.errors) {
      if (data.errors.full_messages) {
        error.message = data.errors.full_messages[0];
      } else {
        error.message = data.errors[0];
      }
    }
    if (opts.user && isUnauthorizedResponse(response, opts.method)) {
      error.message = handleNoAuth(opts.user, error);
    }
    throw error;
  });
};

export const authorizedRequest = (method, url, user, formData = null) => (
  fetch(url, {
    method,
    headers: {
      client: user.client,
      'access-token': user.accessToken,
      uid: user.uid,
      'token-type': 'Bearer',
    },
    body: formData,
  }).then(response => checkStatus(response, { method, user }))
    .catch((err) => {
      if (isUnauthorizedError(err, method, url)) {
        return authorizedRequest(method, url, store.getState().user, formData);
      }
      throw err;
    })
);

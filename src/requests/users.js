/* global FormData */
/* global fetch */

import 'whatwg-fetch';
import { checkStatus, authorizedRequest } from './utils';

const baseUrl = process.env.REACT_APP_MITHRIL_ROOT_URL;

export const signUpPost = (email, password) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  return fetch(`${baseUrl}/users`, {
    method: 'POST',
    body: formData,
  }).then(checkStatus);
};

export const updateUserPost = (user, params) => {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });
  return authorizedRequest('PUT', `${baseUrl}/users`, user, formData);
};

export const loginPost = (email, password) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  return fetch(`${baseUrl}/users/sign_in`, {
    method: 'POST',
    body: formData,
  }).then(checkStatus);
};

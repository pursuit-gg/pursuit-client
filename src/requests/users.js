/* global FormData */
/* global fetch */

import 'whatwg-fetch';
import { checkStatus } from './utils';

const baseUrl = process.env.REACT_APP_MITHRIL_ROOT_URL;

export const loginPost = (email, password) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  return fetch(`${baseUrl}/users/sign_in`, {
    method: 'POST',
    body: formData,
  }).then(checkStatus);
};

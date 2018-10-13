import { authorizedRequest } from './utils';

const baseUrl = `${process.env.REACT_APP_MITHRIL_ROOT_URL}/fortnite`;

export const indexMatchNotificationsRequest = user => (
  authorizedRequest('GET', `${baseUrl}/notifications/matches`, user)
);

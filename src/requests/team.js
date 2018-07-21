import { authorizedRequest } from './utils';

const baseUrl = process.env.REACT_APP_MITHRIL_ROOT_URL;

export const showTeamRequest = user => (
  authorizedRequest('GET', `${baseUrl}/team`, user)
);

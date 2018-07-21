import {
  TEAM_LOADED,
} from 'actions/types';
import {
  addError,
  removeError,
} from 'actions/errors';
import {
  showTeamRequest,
} from 'requests/team';
import {
  addRequest,
  removeRequest,
} from 'actions/requests';

function teamLoaded(data) {
  return {
    type: TEAM_LOADED,
    team: data.team,
  };
}

export const loadTeam = () => (
  (dispatch, getState) => {
    dispatch(addRequest('loadTeam'));
    dispatch(removeError('loadTeam'));
    showTeamRequest(getState().user)
      .then((json) => {
        dispatch(teamLoaded(json.data));
        dispatch(removeRequest('loadTeam'));
      })
      .catch((err) => {
        dispatch(addError('loadTeam', err));
        dispatch(removeRequest('loadTeam'));
      });
  }
);

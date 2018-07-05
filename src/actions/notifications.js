import {
  MATCH_NOTIFICATIONS_LOADED,
} from 'actions/types';
import {
  addError,
  removeError,
} from 'actions/errors';
import {
  indexMatchNotificationsRequest,
} from 'requests/notifications';
import {
  addRequest,
  removeRequest,
} from 'actions/requests';

function matchNotificationsLoaded(data) {
  return {
    type: MATCH_NOTIFICATIONS_LOADED,
    matchNotifications: data.match_notifications,
  };
}

export const loadMatchNotifications = () => (
  (dispatch, getState) => {
    dispatch(addRequest('loadMatchNotifications'));
    dispatch(removeError('loadMatchNotifications'));
    indexMatchNotificationsRequest(getState().user)
      .then((json) => {
        dispatch(matchNotificationsLoaded(json.data));
        dispatch(removeRequest('loadMatchNotifications'));
      })
      .catch((err) => {
        dispatch(addError('loadMatchNotifications', err));
        dispatch(removeRequest('loadMatchNotifications'));
      });
  }
);

/* global window, Audio */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import ReactTimeout from 'react-timeout';
import mixpanel from 'mixpanel-browser';

import {
  captureStarted,
  captureStopped,
  captureErrored,
  clearCaptureError,
  queueCaptureUpload,
  requeueCaptureUpload,
  startCaptureUpload,
  captureUploading,
  captureUploadFinished,
  captureUploadCancelled,
  captureUploadErrored,
} from 'actions/captureStatus';
import { loadTeam } from 'actions/team';
import { loadMatchNotifications } from 'actions/notifications';
import { newMatchCheck, numNewMatches } from 'helpers/notifications';
import notificationSound from 'sounds/notification.mp3';

import './RequireAuthContainer.m.css';

const ipcRenderer = window.require('electron').ipcRenderer;

const handleUploadRestarting = (props) => {
  if (props.captureStatus.currentUpload !== null) {
    if (props.isAuthenticated &&
        !props.manualCaptureUpload &&
        !props.captureStatus.uploadPaused) {
      ipcRenderer.send(
        'upload-capture-folder',
        props.captureStatus.currentUpload.folder,
        props.captureStatus.currentUpload.userId,
        props.captureStatus.currentUpload.spectator,
        props.uploadBandwidth,
      );
    } else {
      props.requeueCaptureUpload();
    }
  } else if (props.captureStatus.uploadQueue.length !== 0 &&
             props.isAuthenticated &&
             !props.manualCaptureUpload &&
             !props.captureStatus.uploadPaused) {
    props.startCaptureUpload();
  }
};

class RequireAuthContainer extends Component {
  constructor(props) {
    super(props);
    this.notifSound = new Audio(notificationSound);
  }

  componentWillMount() {
    this.checkAuth(this.props);
    if (this.props.isAuthenticated) {
      ipcRenderer.send('set-spectator-mode', this.props.spectator);
      ipcRenderer.send('sign-in', this.props.user.id);
      mixpanel.identify(this.props.user.id);
      mixpanel.people.set({
        $username: this.props.user.username,
        $email: this.props.user.email,
      });
      mixpanel.register({
        username: this.props.user.username,
        user_id: this.props.user.id,
      });
      if (this.props.user.hasTeamAccess) {
        this.props.loadTeam();
      }
      this.props.loadMatchNotifications();
      this.fetchInterval = this.props.setInterval(() => {
        this.props.loadMatchNotifications();
      }, 15000);
      this.props.clearCaptureError();
    }
    handleUploadRestarting(this.props);
  }

  componentDidMount() {
    ipcRenderer.on('queue-capture-folder-upload', (event, folder, userId, spectator) => {
      this.props.queueCaptureUpload(folder, userId, spectator, this.props.manualCaptureUpload);
      if (this.props.captureStatus.error === 'no_captures') {
        this.props.clearCaptureError();
      }
    });
    ipcRenderer.on('capture-folder-upload-finished', (event, folder, userId, spectator) => {
      this.props.captureUploadFinished(folder, userId, spectator);
    });
    ipcRenderer.on('capture-folder-upload-cancelled', (event, folder, userId, spectator) => {
      this.props.captureUploadCancelled(folder, userId, spectator);
    });
    ipcRenderer.on('capture-folder-uploading', (event, folder, userId, spectator, progress) => {
      this.props.captureUploading(folder, userId, spectator, progress);
    });
    ipcRenderer.on('capture-folder-upload-error', (event, folder, userId, spectator, uploadErr) => {
      this.props.captureUploadErrored(folder, userId, spectator, uploadErr);
    });
    ipcRenderer.on('start-capture', (event, scaleRes) => {
      this.props.captureStarted(scaleRes);
      if (this.props.captureStatus.error === 'not_tracking') {
        this.props.clearCaptureError();
      }
    });
    ipcRenderer.on('stop-capture', () => {
      this.props.captureStopped();
    });
    ipcRenderer.on('capture-error', (event, error) => {
      this.props.captureErrored(error);
    });
    ipcRenderer.on('pending-uploads-check', () => {
      ipcRenderer.send('pending-uploads', this.props.captureStatus.uploadQueue.length, this.props.captureStatus.currentUpload, this.props.manualCaptureUpload);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.checkAuth(nextProps);
    if (!this.props.user.rehydrated && nextProps.user.rehydrated) {
      if (nextProps.isAuthenticated) {
        ipcRenderer.send('set-spectator-mode', nextProps.spectator);
        ipcRenderer.send('sign-in', nextProps.user.id);
        mixpanel.identify(nextProps.user.id);
        mixpanel.people.set({
          $username: nextProps.user.username,
          $email: nextProps.user.email,
        });
        mixpanel.register({
          username: nextProps.user.username,
          user_id: nextProps.user.id,
        });
        if (nextProps.user.hasTeamAccess) {
          this.props.loadTeam();
        }
        this.props.loadMatchNotifications();
        this.fetchInterval = this.props.setInterval(() => {
          this.props.loadMatchNotifications();
        }, 15000);
        this.props.clearCaptureError();
      }
      handleUploadRestarting(nextProps);
    } else {
      if (nextProps.captureStatus.currentUpload !== null &&
          (this.props.captureStatus.currentUpload === null ||
          this.props.captureStatus.currentUpload.folder !== nextProps.captureStatus.currentUpload.folder)) {
        ipcRenderer.send(
          'upload-capture-folder',
          nextProps.captureStatus.currentUpload.folder,
          nextProps.captureStatus.currentUpload.userId,
          nextProps.captureStatus.currentUpload.spectator,
          nextProps.uploadBandwidth,
        );
      }
      if (!this.props.captureStatus.uploadPaused && nextProps.captureStatus.uploadPaused) {
        ipcRenderer.send('cancel-capture-folder-uploads');
      }
    }
    if (this.props.spectator !== nextProps.spectator) {
      ipcRenderer.send('set-spectator-mode', nextProps.spectator);
    }
    if (this.props.matchProcessedSound && newMatchCheck(this.props.matchNotifications, nextProps.matchNotifications)) {
      this.notifSound.currentTime = 0;
      // catch error from play promise and discard if play interrupted
      // error due to unmounting before async play occurs
      const playPromise = this.notifSound.play();
      playPromise.catch((err) => {
        if (err.name !== 'AbortError') {
          throw err;
        }
      });
    }
    if (numNewMatches(nextProps.matchNotifications) !== numNewMatches(this.props.matchNotifications)) {
      ipcRenderer.send('new-match-notifications', numNewMatches(nextProps.matchNotifications));
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('queue-capture-folder-upload');
    ipcRenderer.removeAllListeners('capture-folder-upload-finished');
    ipcRenderer.removeAllListeners('capture-folder-upload-cancelled');
    ipcRenderer.removeAllListeners('capture-folder-uploading');
    ipcRenderer.removeAllListeners('capture-folder-upload-error');
    ipcRenderer.removeAllListeners('start-capture');
    ipcRenderer.removeAllListeners('stop-capture');
    ipcRenderer.removeAllListeners('capture-errored');
    ipcRenderer.removeAllListeners('pending-uploads-check');
    ipcRenderer.send('new-match-notifications', 0);
    ipcRenderer.send('cancel-capture-folder-uploads');
    ipcRenderer.send('sign-out', this.props.user.id);
    this.props.clearInterval(this.fetchInterval);
  }

  checkAuth(props) {
    if (props.user.rehydrated && !props.isAuthenticated) {
      this.props.goWelcome();
    }
  }

  render() {
    return (
      <div styleName="fullWidth">
        {this.props.isAuthenticated
          ? this.props.children
          : null
        }
      </div>
    );
  }
}

RequireAuthContainer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  spectator: PropTypes.bool.isRequired,
  captureStatus: PropTypes.object.isRequired,
  manualCaptureUpload: PropTypes.bool.isRequired,
  uploadBandwidth: PropTypes.number.isRequired,
  matchProcessedSound: PropTypes.bool.isRequired,
  matchNotifications: PropTypes.object.isRequired,
  goWelcome: PropTypes.func.isRequired,
  captureStarted: PropTypes.func.isRequired,
  captureStopped: PropTypes.func.isRequired,
  captureErrored: PropTypes.func.isRequired,
  clearCaptureError: PropTypes.func.isRequired,
  queueCaptureUpload: PropTypes.func.isRequired,
  requeueCaptureUpload: PropTypes.func.isRequired,
  startCaptureUpload: PropTypes.func.isRequired,
  captureUploading: PropTypes.func.isRequired,
  captureUploadFinished: PropTypes.func.isRequired,
  captureUploadCancelled: PropTypes.func.isRequired,
  captureUploadErrored: PropTypes.func.isRequired,
  loadTeam: PropTypes.func.isRequired,
  loadMatchNotifications: PropTypes.func.isRequired,
  setInterval: PropTypes.func.isRequired,
  clearInterval: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user, team, captureStatus, settings, notifications }) => ({
  isAuthenticated: user.client != null && user.accessToken != null,
  user,
  spectator: user.hasTeamAccess && team.name !== null,
  captureStatus,
  manualCaptureUpload: settings.manualCaptureUpload,
  uploadBandwidth: settings.uploadBandwidth,
  matchProcessedSound: settings.matchProcessedSound,
  matchNotifications: notifications.matches,
});

const mapDispatchToProps = dispatch => ({
  goWelcome: () => {
    dispatch(push('/welcome'));
  },
  captureStarted: (scaleRes) => {
    dispatch(captureStarted(scaleRes));
  },
  captureStopped: () => {
    dispatch(captureStopped());
  },
  captureErrored: (error) => {
    dispatch(captureErrored(error));
  },
  clearCaptureError: () => {
    dispatch(clearCaptureError());
  },
  queueCaptureUpload: (folder, userId, spectator, manualCaptureUpload) => {
    dispatch(queueCaptureUpload(folder, userId, spectator, manualCaptureUpload));
  },
  requeueCaptureUpload: () => {
    dispatch(requeueCaptureUpload());
  },
  startCaptureUpload: () => {
    dispatch(startCaptureUpload());
  },
  captureUploading: (folder, userId, spectator, progress) => {
    dispatch(captureUploading(folder, userId, spectator, progress));
  },
  captureUploadFinished: (folder, userId, spectator) => {
    dispatch(captureUploadFinished(folder, userId, spectator));
  },
  captureUploadCancelled: (folder, userId, spectator) => {
    dispatch(captureUploadCancelled(folder, userId, spectator));
  },
  captureUploadErrored: (folder, userId, spectator, error) => {
    dispatch(captureUploadErrored(folder, userId, spectator, error));
  },
  loadTeam: () => {
    dispatch(loadTeam());
  },
  loadMatchNotifications: () => {
    dispatch(loadMatchNotifications());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReactTimeout(RequireAuthContainer));

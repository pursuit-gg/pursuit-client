/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import mixpanel from 'mixpanel-browser';

import {
  captureStarted,
  captureStopped,
  queueCaptureUpload,
  requeueCaptureUpload,
  captureUploading,
  captureUploadFinished,
  captureUploadErrored,
} from 'actions/captureStatus';

const ipcRenderer = window.require('electron').ipcRenderer;

class RequireAuthContainer extends Component {
  componentWillMount() {
    this.checkAuth(this.props);
    if (this.props.isAuthenticated) {
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
    }
    if (this.props.captureStatus.currentUpload !== null) {
      this.props.requeueCaptureUpload();
    }
  }

  componentDidMount() {
    ipcRenderer.on('queue-capture-folder-upload', (event, folder, userId) => {
      this.props.queueCaptureUpload(folder, userId, this.props.manualCaptureUpload);
    });
    ipcRenderer.on('capture-folder-upload-finished', (event, folder, userId) => {
      this.props.captureUploadFinished(folder, userId);
    });
    ipcRenderer.on('capture-folder-uploading', (event, folder, userId, progress) => {
      this.props.captureUploading(folder, userId, progress);
    });
    ipcRenderer.on('capture-folder-upload-error', (event, folder, userId, uploadErr) => {
      this.props.captureUploadErrored(folder, userId, uploadErr);
    });
    ipcRenderer.on('start-capture', (event, scaleRes) => {
      this.props.captureStarted(scaleRes);
    });
    ipcRenderer.on('stop-capture', () => {
      this.props.captureStopped();
    });
  }

  componentWillReceiveProps(nextProps) {
    this.checkAuth(nextProps);
    if (!this.props.user.rehydrated && nextProps.user.rehydrated && nextProps.isAuthenticated) {
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
    }
    if (nextProps.captureStatus.currentUpload !== null && (this.props.captureStatus.currentUpload === null ||
        this.props.captureStatus.currentUpload.folder !== nextProps.captureStatus.currentUpload.folder)) {
      ipcRenderer.send(
        'upload-capture-folder',
        nextProps.captureStatus.currentUpload.folder,
        nextProps.captureStatus.currentUpload.userId,
      );
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('queue-capture-folder-upload');
    ipcRenderer.removeAllListeners('capture-folder-upload-finished');
    ipcRenderer.removeAllListeners('capture-folder-uploading');
    ipcRenderer.removeAllListeners('capture-folder-upload-error');
    ipcRenderer.removeAllListeners('start-capture');
    ipcRenderer.removeAllListeners('stop-capture');
    ipcRenderer.send('sign-out', this.props.user.id);
  }

  checkAuth(props) {
    if (props.user.rehydrated && !props.isAuthenticated) {
      this.props.goLogin();
    }
  }

  render() {
    return (
      <div>
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
  captureStatus: PropTypes.object.isRequired,
  manualCaptureUpload: PropTypes.bool.isRequired,
  goLogin: PropTypes.func.isRequired,
  captureStarted: PropTypes.func.isRequired,
  captureStopped: PropTypes.func.isRequired,
  queueCaptureUpload: PropTypes.func.isRequired,
  requeueCaptureUpload: PropTypes.func.isRequired,
  captureUploading: PropTypes.func.isRequired,
  captureUploadFinished: PropTypes.func.isRequired,
  captureUploadErrored: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user, captureStatus, settings }) => ({
  isAuthenticated: user.client != null && user.accessToken != null,
  user,
  captureStatus,
  manualCaptureUpload: settings.manualCaptureUpload,
});

const mapDispatchToProps = dispatch => ({
  goLogin: () => {
    dispatch(push('/login'));
  },
  captureStarted: (scaleRes) => {
    dispatch(captureStarted(scaleRes));
  },
  captureStopped: () => {
    dispatch(captureStopped());
  },
  queueCaptureUpload: (folder, userId, manualCaptureUpload) => {
    dispatch(queueCaptureUpload(folder, userId, manualCaptureUpload));
  },
  requeueCaptureUpload: () => {
    dispatch(requeueCaptureUpload());
  },
  captureUploading: (folder, userId, progress) => {
    dispatch(captureUploading(folder, userId, progress));
  },
  captureUploadFinished: (folder, userId) => {
    dispatch(captureUploadFinished(folder, userId));
  },
  captureUploadErrored: (folder, userId, error) => {
    dispatch(captureUploadErrored(folder, userId, error));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RequireAuthContainer);

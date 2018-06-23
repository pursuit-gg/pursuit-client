/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import './Root.m.css';

const ipcRenderer = window.require('electron').ipcRenderer;

class Root extends Component {
  componentWillMount() {
    ipcRenderer.on('go-to-page', (event, page) => {
      this.props.goToPage(page);
    });
    if (this.props.rehydrated) {
      ipcRenderer.send('set-startup-settings', this.props.launchOnStartup, this.props.minimizeOnStartup);
      ipcRenderer.send('set-minimize-to-tray', this.props.minimizeToTray);
      ipcRenderer.send('set-external-obs-capture', this.props.externalOBSCapture);
      ipcRenderer.send('set-manual-upload-notifications', this.props.manualUploadNotifications);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.rehydrated && nextProps.rehydrated) {
      ipcRenderer.send('set-startup-settings', nextProps.launchOnStartup, nextProps.minimizeOnStartup);
      ipcRenderer.send('set-minimize-to-tray', nextProps.minimizeToTray);
      ipcRenderer.send('set-external-obs-capture', nextProps.externalOBSCapture);
      ipcRenderer.send('set-manual-upload-notifications', this.props.manualUploadNotifications);
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('go-to-page');
  }

  render() {
    return (
      <div styleName="wrapper">
        {this.props.children}
      </div>
    );
  }
}

Root.propTypes = {
  children: PropTypes.object.isRequired,
  rehydrated: PropTypes.bool.isRequired,
  launchOnStartup: PropTypes.bool.isRequired,
  minimizeOnStartup: PropTypes.bool.isRequired,
  minimizeToTray: PropTypes.bool.isRequired,
  externalOBSCapture: PropTypes.bool.isRequired,
  manualUploadNotifications: PropTypes.bool.isRequired,
  goToPage: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user, settings }) => ({
  rehydrated: user.rehydrated,
  launchOnStartup: settings.launchOnStartup,
  minimizeOnStartup: settings.minimizeOnStartup,
  minimizeToTray: settings.minimizeToTray,
  externalOBSCapture: settings.externalOBSCapture,
  manualUploadNotifications: settings.manualUploadNotifications,
});

const mapDispatchToProps = dispatch => ({
  goToPage: (page) => {
    dispatch(push(page));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);

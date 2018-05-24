/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './Root.m.css';

const ipcRenderer = window.require('electron').ipcRenderer;

class Root extends Component {
  componentWillMount() {
    if (this.props.rehydrated) {
      ipcRenderer.send('set-launch-on-startup', this.props.launchOnStartup);
      ipcRenderer.send('set-external-obs-capture', this.props.externalOBSCapture);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.rehydrated && nextProps.rehydrated) {
      ipcRenderer.send('set-launch-on-startup', nextProps.launchOnStartup);
      ipcRenderer.send('set-external-obs-capture', nextProps.externalOBSCapture);
    }
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
  externalOBSCapture: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ user, settings }) => ({
  rehydrated: user.rehydrated,
  launchOnStartup: settings.launchOnStartup,
  externalOBSCapture: settings.externalOBSCapture,
});

export default connect(mapStateToProps, {})(Root);

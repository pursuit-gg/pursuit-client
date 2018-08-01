/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './CapturePreview.m.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const getDimensions = (scaleRes) => {
  const baseHeight = 97;
  const matches = scaleRes.match(/(\d+)x(\d+)/);
  const width = matches ? parseInt(matches[1], 10) : 1920;
  const height = matches ? parseInt(matches[2], 10) : 1080;
  return { width: `${Math.round((width / height) * baseHeight)}px`, height: `${baseHeight}px` };
};

class CapturePreview extends Component {
  constructor(props) {
    super(props);
    this.updatePreview = this.updatePreview.bind(this);
  }

  componentDidMount() {
    const { x, y, width, height } = this.preview.getBoundingClientRect();
    const scaleFactor = window.devicePixelRatio;
    ipcRenderer.send(
      'update-obs-display',
      true,
      Math.round(width * scaleFactor),
      Math.round(height * scaleFactor),
      Math.round(x * scaleFactor),
      Math.round(y * scaleFactor),
    );
    ipcRenderer.send('create-obs-display');
    window.addEventListener('resize', this.updatePreview);
    window.addEventListener('scroll', this.updatePreview);
    window.addEventListener('move', this.updatePreview);
  }

  componentDidUpdate() {
    this.updatePreview();
  }

  componentWillUnmount() {
    const { x, y, width, height } = this.preview.getBoundingClientRect();
    const scaleFactor = window.devicePixelRatio;
    ipcRenderer.send(
      'update-obs-display',
      false,
      Math.round(width * scaleFactor),
      Math.round(height * scaleFactor),
      Math.round(x * scaleFactor),
      Math.round(y * scaleFactor),
    );
    ipcRenderer.send('remove-obs-display');
    window.removeEventListener('resize', this.updatePreview);
    window.removeEventListener('scroll', this.updatePreview);
    window.removeEventListener('move', this.updatePreview);
  }

  updatePreview() {
    const { x, y, width, height } = this.preview.getBoundingClientRect();
    const scaleFactor = window.devicePixelRatio;
    ipcRenderer.send(
      'update-obs-display',
      true,
      Math.round(width * scaleFactor),
      Math.round(height * scaleFactor),
      Math.round(x * scaleFactor),
      Math.round(y * scaleFactor),
    );
  }

  render() {
    return (
      <div styleName="wrapper" style={getDimensions(this.props.scaleRes)} ref={(c) => { this.preview = c; }}>
        {!this.props.capturing &&
          <h5> Not Tracking </h5>
        }
      </div>
    );
  }
}

CapturePreview.propTypes = {
  scaleRes: PropTypes.string.isRequired,
  capturing: PropTypes.bool.isRequired,
  spectator: PropTypes.bool.isRequired, //used to trigger the componentDidUpdate to update the preview
};

const mapStateToProps = ({ user, team, captureStatus }) => ({
  scaleRes: captureStatus.scaleRes,
  capturing: captureStatus.capturing,
  spectator: user.hasTeamAccess && team.name !== null,
});

export default connect(mapStateToProps, {})(CapturePreview);

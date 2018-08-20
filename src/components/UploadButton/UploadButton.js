import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { startCaptureUpload, pauseCaptureUpload } from 'actions/captureStatus';
import pauseImg from 'images/captureStatusIcons/whitePause.png';

import './UploadButton.m.css';

class UploadButton extends Component {
  constructor(props) {
    super(props);
    this.getUploadState = this.getUploadState.bind(this);
  }

  getUploadState() {
    if (this.props.captureStatus.uploadPaused) {
      if (this.props.captureStatus.currentUpload === null) {
        return 'paused';
      }
      return 'pausing';
    }
    if (this.props.captureStatus.currentUpload === null) {
      if (this.props.captureStatus.uploadQueue.length === 0) {
        return 'synced';
      }
      return 'pending';
    }
    if (this.props.captureStatus.currentUpload.error) {
      return 'error';
    }
    return 'uploading';
  }

  handleButtonClick(uploadState) {
    if (uploadState === 'pending' || uploadState === 'paused') {
      this.props.startCaptureUpload();
    } else if (uploadState === 'uploading' || uploadState === 'error') {
      this.props.pauseCaptureUpload();
    }
  }

  render() {
    const uploadState = this.getUploadState();
    if (uploadState === 'synced') {
      return null;
    }
    return (
      <div styleName="wrapper">
        <button
          type="button"
          onClick={() => this.handleButtonClick(uploadState)}
          styleName="slim aqua"
          disabled={uploadState === 'pausing'}
        >
          {uploadState === 'pending' &&
            <h5> upload </h5>
          }
          {(uploadState === 'uploading' || uploadState === 'error') &&
            <h5> <img styleName="buttonIcon" src={pauseImg} alt="pause" /> pause upload </h5>
          }
          {uploadState === 'paused' &&
            <h5> resume upload </h5>
          }
          {uploadState === 'pausing' &&
            <h5> pausing... </h5>
          }
        </button>
      </div>
    );
  }
}

UploadButton.propTypes = {
  captureStatus: PropTypes.object.isRequired,
  startCaptureUpload: PropTypes.func.isRequired,
  pauseCaptureUpload: PropTypes.func.isRequired,
};

const mapStateToProps = ({ captureStatus }) => ({
  captureStatus,
});

const mapDispatchToProps = dispatch => ({
  startCaptureUpload: () => {
    dispatch(startCaptureUpload());
  },
  pauseCaptureUpload: () => {
    dispatch(pauseCaptureUpload());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadButton);


import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';
import IndeterminateProgressBar from 'components/IndeterminateProgressBar/IndeterminateProgressBar';

import './UploadProgressBar.m.css';

const uploadTimeDisplay = (seconds) => {
  let time = '';
  if (seconds >= 3600) {
    time += String(Math.floor(Math.abs(seconds) / 3600));
    time += ' hours ';
  }
  if (seconds >= 60) {
    time += Math.floor((Math.abs(seconds) % 3600) / 60);
    time += ' minutes ';
  }
  if (seconds < 60) {
    return String(seconds) + ' seconds';
  }
  return time;
};

const UploadProgressBar = ({ captureStatus, manualCaptureUpload }) => {
  if (!captureStatus.currentUpload && captureStatus.uploadQueue.length === 0) {
    return null;
  }
  return (
    <div styleName="wrapper">
      <h5 className="bold">
        {uploadTimeDisplay((captureStatus.uploadQueue.length + 1) * 30)}
      </h5>
      <h5>
        of gameplay left to upload <Tooltip
          placement="top"
          mouseLeaveDelay={0}
          overlay="Pursuit takes screenshots every 2s while Overwatch is open. We upload these screenshots to analyze and process your stats."
        ><i className="fa fa-info-circle" /></Tooltip>
      </h5>
      {!manualCaptureUpload &&
        <div styleName="animatedProgressWrapper">
          <IndeterminateProgressBar />
        </div>
      }
    </div>
  );
};

UploadProgressBar.propTypes = {
  captureStatus: PropTypes.object.isRequired,
  manualCaptureUpload: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ captureStatus, settings }) => ({
  captureStatus,
  manualCaptureUpload: settings.manualCaptureUpload,
});

export default connect(mapStateToProps, {})(UploadProgressBar);

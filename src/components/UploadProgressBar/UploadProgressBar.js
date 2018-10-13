import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';
import IndeterminateProgressBar from 'components/IndeterminateProgressBar/IndeterminateProgressBar';

import './UploadProgressBar.m.css';

const uploadTimeDisplay = (seconds) => {
  let time = '';
  if (seconds >= 3600) {
    const hours = String(Math.floor(Math.abs(seconds) / 3600));
    time += hours;
    time += ` hour${hours === 1 ? '' : 's'} `;
  }
  if (seconds >= 60) {
    const minutes = Math.floor((Math.abs(seconds) % 3600) / 60);
    time += minutes;
    time += ` minute${minutes === 1 ? '' : 's'} `;
  }
  if (seconds < 60) {
    return String(seconds) + ' seconds';
  }
  return time;
};

const UploadProgressBar = ({ captureStatus }) => {
  if (!captureStatus.currentUpload && captureStatus.uploadQueue.length === 0) {
    return null;
  }
  let uploadCount = captureStatus.currentUpload ? 1 : 0;
  uploadCount += captureStatus.uploadQueue.length;
  return (
    <div styleName="wrapper">
      <h5 className="bold">
        {uploadTimeDisplay(uploadCount * 20)}
      </h5>
      <h5>
        of gameplay left to upload <Tooltip
          placement="top"
          mouseLeaveDelay={0}
          overlay="Pursuit takes screenshots every 1s while Fortnite is open. We upload these screenshots to analyze and process your stats."
        ><i className="fa fa-info-circle" /></Tooltip>
      </h5>
      <div styleName="animatedProgressWrapper">
        <IndeterminateProgressBar
          paused={Boolean(captureStatus.uploadPaused || !captureStatus.currentUpload)}
          error={Boolean(captureStatus.currentUpload && captureStatus.currentUpload.error)}
        />
      </div>
    </div>
  );
};

UploadProgressBar.propTypes = {
  captureStatus: PropTypes.object.isRequired,
};

const mapStateToProps = ({ captureStatus }) => ({
  captureStatus,
});

export default connect(mapStateToProps, {})(UploadProgressBar);

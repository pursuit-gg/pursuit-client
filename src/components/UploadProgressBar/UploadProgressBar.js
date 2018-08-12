import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';

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

const UploadProgressBar = ({ captureStatus }) => {
  if (!captureStatus.currentUpload) {
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
          overlay="Pursuit takes screenshots every 2s while Overwatch is open. We upload these screenshots to analyze and process your stats"
        ><i className="fa fa-info-circle" /></Tooltip>
      </h5>
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

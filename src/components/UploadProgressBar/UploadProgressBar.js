import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';

import './UploadProgressBar.m.css';

const UploadProgressBar = ({ captureStatus }) => {
  if (!captureStatus.currentUpload) {
    return null;
  }
  return (
    <div styleName="wrapper">
      <h5 className="bold">
        {captureStatus.uploadQueue.length} Pending Upload{captureStatus.uploadQueue.length !== 1 ? 's ' : ' '}
        <Tooltip
          placement="top"
          mouseLeaveDelay={0}
          overlay="An upload is 2 minutes of gameplay. Pending uploads may go up if Overwatch is running."
        ><i className="fa fa-info-circle" /></Tooltip>
      </h5>
      { captureStatus.currentUpload.error ?
        <div styleName="progressError" />
        :
        <div styleName="progressBackground">
          <div styleName="progressBar" style={{ width: `${captureStatus.currentUpload.progress}%` }} />
        </div>
      }
      <p> {Math.round(captureStatus.currentUpload.progress)}% Complete </p>
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

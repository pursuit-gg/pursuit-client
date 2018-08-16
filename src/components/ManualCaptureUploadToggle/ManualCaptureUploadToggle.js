import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { connect } from 'react-redux';
import mixpanel from 'mixpanel-browser';

import { MP_AUTO_UPLOAD_MODE_TOGGLE } from 'actions/mixpanelTypes';
import { startCaptureUpload } from 'actions/captureStatus';
import { setManualCaptureUpload } from 'actions/settings';
import './ManualCaptureUploadToggle.m.css';

class ManualCaptureUploadToggle extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.setManualCaptureUpload(!this.props.manualCaptureUpload);
    if (this.props.manualCaptureUpload && !this.props.captureStatus.uploadPaused &&
        this.props.captureStatus.currentUpload === null &&
        this.props.captureStatus.uploadQueue.length !== 0) {
      this.props.startCaptureUpload();
    }
    mixpanel.track(MP_AUTO_UPLOAD_MODE_TOGGLE, {
      state: !this.props.manualCaptureUpload,
    });
    mixpanel.people.set({
      auto_upload: !this.props.manualCaptureUpload,
    });
  }

  render() {
    return (
      <div styleName="wrapper">
        <h5 styleName="text">
          Auto <Tooltip
            placement="top"
            mouseLeaveDelay={0}
            overlay="Automatic uploading means that Pursuit will automatically upload game data while you are playing. Toggle this off if you are seeing performance issues."
          ><i className="fa fa-info-circle" /></Tooltip>
        </h5>
        <label htmlFor="manualCaptureToggle" styleName="switch">
          <input
            id="manualCaptureToggle"
            type="checkbox"
            checked={!this.props.manualCaptureUpload}
            onChange={this.toggle}
          />
          <span styleName="slider round" />
        </label>
      </div>
    );
  }
}

ManualCaptureUploadToggle.propTypes = {
  manualCaptureUpload: PropTypes.bool.isRequired,
  captureStatus: PropTypes.object.isRequired,
  setManualCaptureUpload: PropTypes.func.isRequired,
  startCaptureUpload: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settings, captureStatus }) => ({
  manualCaptureUpload: settings.manualCaptureUpload,
  captureStatus,
});

export default connect(mapStateToProps, { setManualCaptureUpload, startCaptureUpload })(ManualCaptureUploadToggle);

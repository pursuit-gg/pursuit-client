import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { connect } from 'react-redux';
import mixpanel from 'mixpanel-browser';

import { MP_AUTO_UPLOAD_MODE_TOGGLE } from 'actions/mixpanelTypes';
import { setManualCaptureUpload } from 'actions/settings';
import './ManualCaptureUploadToggle.m.css';

class ManualCaptureUploadToggle extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.setManualCaptureUpload(!this.props.manualCaptureUpload);
    mixpanel.track(MP_AUTO_UPLOAD_MODE_TOGGLE, {
      state: this.props.manualCaptureUpload,
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
  setManualCaptureUpload: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settings }) => ({
  manualCaptureUpload: settings.manualCaptureUpload,
});

export default connect(mapStateToProps, { setManualCaptureUpload })(ManualCaptureUploadToggle);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { startCaptureUpload } from 'actions/captureStatus';
import './UploadButton.m.css';

class UploadButton extends Component {
  constructor(props) {
    super(props);
    this.getUploadState = this.getUploadState.bind(this);
    this.getStateText = this.getStateText.bind(this);
  }

  getUploadState() {
    if (this.props.captureStatus.currentUpload === null) {
      if (this.props.captureStatus.uploadQueue.length === 0) {
        return 'synced';
      }
      return 'pending';
    }
    if (this.props.captureStatus.currentUpload !== null &&
        this.props.captureStatus.currentUpload.error !== null) {
      return 'error';
    }
    return 'uploading';
  }

  getStateText() {
    switch (this.getUploadState()) {
      case 'synced':
        return 'Up To Date';
      case 'pending':
        return 'Ready For Upload';
      case 'error':
        return 'Upload Error';
      case 'uploading':
        return 'Uploading';
      default:
        return '';
    }
  }

  render() {
    const uploadState = this.getUploadState();
    const stateText = this.getStateText();
    return (
      <div styleName="wrapper">
        <h2 styleName="statusText"> {stateText} </h2>
        <button
          type="button"
          onClick={this.props.startCaptureUpload}
          styleName={`slim ${uploadState}`}
          disabled={uploadState !== 'pending'}
        >
          {uploadState === 'synced' &&
            <div styleName="iconWrapper">
              <i className="fa fa-check" />
            </div>
          }
          {uploadState === 'pending' &&
            <h5> upload </h5>
          }
          {uploadState === 'error' &&
            <div styleName="iconWrapper">
              <i className="fa fa-times" />
            </div>
          }
          {uploadState === 'uploading' &&
            <div styleName="iconWrapper">
              <i className="fa fa-spinner fa-spin" />
            </div>
          }
        </button>
        {uploadState === 'error' &&
          <p styleName="errorText" className="italic"> We&apos;ll keep trying to upload </p>
        }
      </div>
    );
  }
}

UploadButton.propTypes = {
  captureStatus: PropTypes.object.isRequired,
  startCaptureUpload: PropTypes.func.isRequired,
};

const mapStateToProps = ({ captureStatus }) => ({
  captureStatus,
});

const mapDispatchToProps = dispatch => (
  {
    startCaptureUpload: () => {
      dispatch(startCaptureUpload());
    },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(UploadButton);


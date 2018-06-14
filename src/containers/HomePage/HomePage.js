/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mixpanel from 'mixpanel-browser';

import { MP_CLIENT_LOAD } from 'actions/mixpanelTypes';
import { setShowCapturePreview, closeTroubleshootingTip } from 'actions/settings';
import ManualCaptureUploadToggle from 'components/ManualCaptureUploadToggle/ManualCaptureUploadToggle';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import UploadButton from 'components/UploadButton/UploadButton';
import UploadProgressBar from 'components/UploadProgressBar/UploadProgressBar';
import CapturePreview from 'components/CapturePreview/CapturePreview';
import tracking from 'images/captureStatusIcons/tracking.png';
import notTracking from 'images/captureStatusIcons/notTracking.png';
import obsMode from 'images/captureStatusIcons/obsMode.png';
import upToDate from 'images/captureStatusIcons/upToDate.png';
import uploading from 'images/captureStatusIcons/uploading.png';
import error from 'images/captureStatusIcons/error.png';
import discord from 'images/genericIcons/discordLogo.png';
import './HomePage.m.css';

const electron = window.require('electron');

class HomePage extends Component {
  componentDidMount() {
    mixpanel.track(MP_CLIENT_LOAD, {});
  }

  render() {
    return (
      <div styleName="wrapper">
        <div styleName="buttonWrapper">
          <DefaultButton
            text="Open Match History"
            onClick={(e) => {
              e.preventDefault();
              electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/profile`);
            }}
            slim
            color="Aqua"
          />
        </div>
        <div styleName="subSection">
          <h4 styleName="subHeading"> Tracking </h4>
          {!this.props.externalOBSCapture && this.props.captureStatus.capturing &&
            <div styleName="statusWrapper">
              <img src={tracking} alt="tracking" styleName="statusIcon" />
              <h2 styleName="statusText">
                Tracking
                <p className="italic"> Keep this running while you play Overwatch </p>
              </h2>
            </div>
          }
          {!this.props.externalOBSCapture && !this.props.captureStatus.capturing &&
            <div styleName="statusWrapper">
              <img src={notTracking} alt="not tracking" styleName="statusIcon" />
              <h2 styleName="statusText">
                Not Tracking
                <p className="italic"> Launch Overwatch and we&apos;ll automatically start tracking </p>
              </h2>
            </div>
          }
          {this.props.externalOBSCapture &&
            <div styleName="statusWrapper">
              <img src={obsMode} alt="OBS Mode" styleName="statusIcon" />
              <h2 styleName="statusText">
                OBS Mode
              </h2>
            </div>
          }
          {!this.props.externalOBSCapture &&
            <div styleName="capturePreviewWrapper">
              <h5 className="center italic">
                <a
                  styleName="showPreview"
                  className="inlineBlock"
                  onClick={() => this.props.setShowCapturePreview(!this.props.showCapturePreview)}
                >
                  {this.props.showCapturePreview ? 'Hide Capture Preview' : 'Show Capture Preview'}
                </a>
              </h5>
              {this.props.showCapturePreview && <CapturePreview />}
            </div>
          }
          {this.props.externalOBSCapture &&
            <div styleName="seeCapturesWrapper">
              <DefaultButton
                text="See Captures"
                onClick={(e) => {
                  e.preventDefault();
                  electron.shell.openExternal(`file://${electron.remote.app.getPath('userData')}/Captures`);
                }}
                slim
                color="Aqua"
              />
            </div>
          }
          {this.props.externalOBSCapture &&
            <h5 styleName="obsModeText"> Detailed instructions on how to use the plugin are <a
              className="blueLink"
              onClick={() => electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/obs`)}
            >here</a>.</h5>
          }
        </div>
        <div styleName="subSection">
          <h4 styleName="subHeading"> Uploading </h4>
          {!this.props.manualCaptureUpload && this.props.captureStatus.currentUpload === null &&
            <div styleName="statusWrapper">
              <img src={upToDate} alt="up to date" styleName="statusIcon" />
              <h2 styleName="statusText"> Up To Date </h2>
              <div styleName="toggleWrapper">
                <ManualCaptureUploadToggle />
              </div>
            </div>
          }
          {!this.props.manualCaptureUpload && this.props.captureStatus.currentUpload !== null &&
            this.props.captureStatus.currentUpload.error === null &&
            <div styleName="statusWrapper">
              <img src={uploading} alt="uploading" styleName="statusIcon" />
              <h2 styleName="statusText"> Uploading </h2>
              <div styleName="toggleWrapper">
                <ManualCaptureUploadToggle />
              </div>
            </div>
          }
          {!this.props.manualCaptureUpload && this.props.captureStatus.currentUpload !== null &&
            this.props.captureStatus.currentUpload.error !== null &&
            <div styleName="statusWrapper">
              <img src={error} alt="error" styleName="statusIcon" />
              <h2 styleName="statusText">
                Upload Error
                <p className="italic"> We&apos;ll keep trying to upload </p>
              </h2>
              <div styleName="toggleWrapper">
                <ManualCaptureUploadToggle />
              </div>
            </div>
          }
          {this.props.manualCaptureUpload &&
            <div styleName="statusWrapper">
              <UploadButton />
              <div styleName="toggleWrapper">
                <ManualCaptureUploadToggle />
              </div>
            </div>
          }
          <UploadProgressBar />
        </div>
        <div styleName="tipWrapper">
          <p> Once you finish a match, it should appear in <br />your match history within 10 minutes. </p>
        </div>
        {!this.props.troubleshootingTipClosed &&
          <div styleName="troubleshootingTip">
            <h2 styleName="troubleshootingTipTitle">
              {this.props.computerType === 'laptop' ? 'Laptop Support' : 'Not seeing a match?'}
            </h2>
            <a styleName="closeX" onClick={this.props.closeTroubleshootingTip}>
              <h1> X </h1>
            </a>
            {this.props.computerType === 'laptop' &&
              <h5>
                If you aren&apos;t seeing matches after uploading, check the capture preview.
                If it&apos;s black, you must relaunch the app using the instructions
                <a
                  styleName="whiteLink"
                  onClick={(e) => {
                    e.preventDefault();
                    electron.shell.openExternal('https://docsend.com/view/am2bnwi');
                  }}
                > here</a>.
              </h5>
            }
            {this.props.computerType !== 'laptop' &&
              <div>
                <h5> Make sure that Overwatch is running in: </h5>
                <h5> - English </h5>
                <h5> - 16:9 aspect ratio </h5>
                <h5> - 1080p resolution or higher </h5>
              </div>
            }
          </div>
        }
        <div styleName="troubleshootingFooter">
          <p className="inline"> Pursuit not working? </p>
          <DefaultButton
            text="Troubleshooting"
            onClick={(e) => {
              e.preventDefault();
              electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/troubleshoot`);
            }}
            slim
            color="Aqua"
            styles={{ marginLeft: '5px' }}
          />
        </div>
        <a
          styleName="discordFooter"
          onClick={(e) => {
            e.preventDefault();
            electron.shell.openExternal('https://discord.gg/wqymsEZ');
          }}
        >
          <img styleName="discordLogo" src={discord} alt="discord" />
          <h5> Join us on Discord </h5>
        </a>
      </div>
    );
  }
}

HomePage.propTypes = {
  showCapturePreview: PropTypes.bool.isRequired,
  manualCaptureUpload: PropTypes.bool.isRequired,
  externalOBSCapture: PropTypes.bool.isRequired,
  captureStatus: PropTypes.object.isRequired,
  troubleshootingTipClosed: PropTypes.bool.isRequired,
  computerType: PropTypes.string,
  setShowCapturePreview: PropTypes.func.isRequired,
  closeTroubleshootingTip: PropTypes.func.isRequired,
};

HomePage.defaultProps = {
  computerType: 'desktop',
};

const mapStateToProps = ({ settings, captureStatus }) => ({
  showCapturePreview: settings.showCapturePreview,
  manualCaptureUpload: settings.manualCaptureUpload,
  externalOBSCapture: settings.externalOBSCapture,
  captureStatus,
  computerType: settings.computerType,
  troubleshootingTipClosed: settings.troubleshootingTipClosed,
});

export default connect(mapStateToProps, { setShowCapturePreview, closeTroubleshootingTip })(HomePage);

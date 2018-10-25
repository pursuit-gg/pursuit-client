/* global window */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import mixpanel from 'mixpanel-browser';

import {
  MP_USER_SETTING_CHANGE,
} from 'actions/mixpanelTypes';
import {
  setLaunchOnStartup,
  setMinimizeOnStartup,
  setMinimizeToTray,
  setUploadBandwidth,
  setExternalOBSCapture,
  setMatchProcessedSound,
  setNotificationsBadge,
  setManualUploadNotifications,
} from 'actions/settings';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import SelectInput from 'components/SelectInput/SelectInput';
import xIcon from 'images/genericIcons/lightGreyX.svg';
import './SettingsPage.m.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const availableUploadBandwidths = [
  { title: '768 Kbps', val: 0.75 },
  { title: '1 Mbps', val: 1 },
  { title: '1.5 Mbps', val: 1.5 },
  { title: '2 Mbps', val: 2 },
  { title: '3 Mbps', val: 3 },
  { title: '4 Mbps', val: 4 },
  { title: '5 Mbps', val: 5 },
  { title: '10 Mbps', val: 10 },
  { title: '20 Mbps', val: 20 },
  { title: '50 Mbps', val: 50 },
  { title: 'unlimited', val: 0 },
];

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: 'general' };
  }

  render() {
    const {
      launchOnStartup,
      minimizeOnStartup,
      minimizeToTray,
      uploadBandwidth,
      externalOBSCapture,
      pendingExternalOBSCapture,
      matchProcessedSound,
      notificationsBadge,
      manualUploadNotifications,
    } = this.props;
    return (
      <div styleName="wrapper">
        <div styleName="header">
          <h1 styleName="headerText"> CLIENT SETTINGS </h1>
          <Link to="/home" styleName="xIconWrapper">
            <img src={xIcon} alt="close" styleName="xIcon" />
          </Link>
        </div>
        <div styleName="navTabs">
          <a
            styleName={this.state.tab === 'general' ? 'navTab currentNavTab' : 'navTab'}
            onClick={() => this.setState({ tab: 'general' })}
          >
            <h5 className={this.state.tab === 'general' ? 'bold' : ''}> General </h5>
          </a>
          <a
            styleName={this.state.tab === 'notifications' ? 'navTab currentNavTab' : 'navTab'}
            onClick={() => this.setState({ tab: 'notifications' })}
          >
            <h5 className={this.state.tab === 'notifications' ? 'bold' : ''}> Notifications </h5>
          </a>
        </div>
        {this.state.tab === 'general' &&
          <div styleName="subSection">
            <h4 styleName="subHeading"> Startup </h4>
            <div styleName="settingWrapper">
              <label htmlFor="launchOnStartup" className="flex">
                <input
                  id="launchOnStartup"
                  type="checkbox"
                  styleName="checkbox"
                  checked={launchOnStartup}
                  onChange={() => {
                    ipcRenderer.send('set-startup-settings', !launchOnStartup, minimizeOnStartup);
                    this.props.setLaunchOnStartup(!launchOnStartup);
                    mixpanel.track(MP_USER_SETTING_CHANGE, { setting: 'open_on_startup', before: launchOnStartup, after: !launchOnStartup });
                    mixpanel.people.set({ open_on_startup: !launchOnStartup });
                  }}
                />
              </label>
              <h5 styleName="settingText"> Launch automatically on startup </h5>
            </div>
            <div styleName="settingWrapper">
              <label htmlFor="minimizeOnStartup" className="flex">
                <input
                  id="minimizeOnStartup"
                  type="checkbox"
                  styleName="checkbox"
                  checked={minimizeOnStartup}
                  disabled={!launchOnStartup}
                  onChange={() => {
                    ipcRenderer.send('set-startup-settings', launchOnStartup, !minimizeOnStartup);
                    this.props.setMinimizeOnStartup(!minimizeOnStartup);
                    mixpanel.track(MP_USER_SETTING_CHANGE, { setting: 'minimize_on_startup', before: minimizeOnStartup, after: !minimizeOnStartup });
                    mixpanel.people.set({ minimize_on_startup: !minimizeOnStartup });
                  }}
                />
              </label>
              <h5 styleName={`settingText ${launchOnStartup ? '' : 'disabledText'}`}> Start minimized </h5>
            </div>
          </div>
        }
        {this.state.tab === 'general' &&
          <div styleName="subSection">
            <h4 styleName="subHeading"> Close </h4>
            <div styleName="settingWrapper">
              <label htmlFor="minimizeToTray" className="flex">
                <input
                  id="minimizeToTray"
                  type="checkbox"
                  styleName="checkbox"
                  checked={minimizeToTray}
                  onChange={() => {
                    ipcRenderer.send('set-minimize-to-tray', !minimizeToTray);
                    this.props.setMinimizeToTray(!minimizeToTray);
                    mixpanel.track(MP_USER_SETTING_CHANGE, { setting: 'minimize_to_tray', before: minimizeToTray, after: !minimizeToTray });
                    mixpanel.people.set({ minimize_to_tray: !minimizeToTray });
                  }}
                />
              </label>
              <h5 styleName="settingText"> Minimize to tray when closed </h5>
            </div>
          </div>
        }
        {this.state.tab === 'general' &&
          <div styleName="subSection">
            <h4 styleName="subHeading"> Upload Limit </h4>
            <div styleName="settingWrapper">
              <h5> Maximum upload rate: </h5>
              <div styleName="dropdownWrapper">
                <SelectInput
                  options={availableUploadBandwidths}
                  selectOption={(bandwidth) => {
                    this.props.setUploadBandwidth(bandwidth);
                    mixpanel.track(MP_USER_SETTING_CHANGE, { setting: 'upload_bandwidth', before: uploadBandwidth, after: bandwidth });
                    mixpanel.people.set({ upload_bandwidth: bandwidth });
                  }}
                  selectedOption={availableUploadBandwidths.filter(bandwidth => bandwidth.val === uploadBandwidth)[0]}
                />
              </div>
            </div>
            <p styleName="settingSubtext">
              Pursuit operates best with at least 3 Mbps. <br />
              If you experience latency spikes in game try a lower value. <br />
            </p>
          </div>
        }
        {this.state.tab === 'general' &&
          <div styleName="subSection">
            <h4 styleName="subHeading"> Other </h4>
            <div styleName="settingWrapper">
              <label htmlFor="externalOBSCapture" className="flex">
                <input
                  id="externalOBSCapture"
                  type="checkbox"
                  styleName="checkbox"
                  checked={pendingExternalOBSCapture}
                  onChange={() => {
                    this.props.setExternalOBSCapture(!pendingExternalOBSCapture);
                    mixpanel.track(MP_USER_SETTING_CHANGE, { setting: 'obs_mode', before: pendingExternalOBSCapture, after: !pendingExternalOBSCapture });
                    mixpanel.people.set({ obs_mode: !pendingExternalOBSCapture });
                  }}
                />
              </label>
              <h5 styleName="settingText"> OBS Mode </h5>
              {pendingExternalOBSCapture !== externalOBSCapture &&
                <p styleName="settingText restartText" className="bold"> (<a
                  styleName="restartText"
                  className="underline"
                  onClick={() => ipcRenderer.send('restart')}
                >restart</a> Pursuit to apply) </p>
              }
            </div>
            <p styleName="settingSubtext checkboxOffset"> OBS plugin instructions <a
              className="blueLink"
              onClick={() => electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/obs`)}
            >here</a>.</p>
          </div>
        }
        {this.state.tab === 'notifications' &&
          <div styleName="subSection">
            <h4 styleName="subHeading"> Notifications </h4>
            <div styleName="settingWrapper">
              <label htmlFor="matchProcessedSound" className="flex">
                <input
                  id="matchProcessedSound"
                  type="checkbox"
                  styleName="checkbox"
                  checked={matchProcessedSound}
                  onChange={() => {
                    this.props.setMatchProcessedSound(!matchProcessedSound);
                    mixpanel.track(MP_USER_SETTING_CHANGE, { setting: 'match_processed_sound', before: matchProcessedSound, after: !matchProcessedSound });
                    mixpanel.people.set({ match_processed_sound: !matchProcessedSound });
                  }}
                />
              </label>
              <h5 styleName="settingText"> Sound notifications for new matches </h5>
            </div>
            <p styleName="settingSubtext checkboxOffset">
              Play a sound when a new match is processed.
            </p>
            <div styleName="settingWrapper">
              <label htmlFor="notificationsBadge" className="flex">
                <input
                  id="notificationsBadge"
                  type="checkbox"
                  styleName="checkbox"
                  checked={notificationsBadge}
                  onChange={() => {
                    ipcRenderer.send('set-notifications-badge', !notificationsBadge);
                    this.props.setNotificationsBadge(!notificationsBadge);
                    mixpanel.track(MP_USER_SETTING_CHANGE, { setting: 'notifications_badge', before: notificationsBadge, after: !notificationsBadge });
                    mixpanel.people.set({ notifications_badge: !notificationsBadge });
                  }}
                />
              </label>
              <h5 styleName="settingText"> Enable badge </h5>
            </div>
            <p styleName="settingSubtext checkboxOffset">
              Show a red badge on the app icon when you have new matches.
            </p>
            <div styleName="settingWrapper">
              <label htmlFor="manualUploadNotifications" className="flex">
                <input
                  id="manualUploadNotifications"
                  type="checkbox"
                  styleName="checkbox"
                  checked={manualUploadNotifications}
                  onChange={() => {
                    ipcRenderer.send('set-manual-upload-notifications', !manualUploadNotifications);
                    this.props.setManualUploadNotifications(!manualUploadNotifications);
                    mixpanel.track(MP_USER_SETTING_CHANGE, { setting: 'manual_upload_notifications', before: manualUploadNotifications, after: !manualUploadNotifications });
                    mixpanel.people.set({ manual_upload_notifications: !manualUploadNotifications });
                  }}
                />
              </label>
              <h5 styleName="settingText"> Reminder to Upload </h5>
            </div>
            <p styleName="settingSubtext checkboxOffset">
              If in manual upload, we&apos;ll send a reminder to upload your screenshots.
            </p>
          </div>
        }
        <div styleName="buttonWrapper">
          <DefaultButton
            text="Account Settings"
            onClick={(e) => {
              e.preventDefault();
              electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/settings`);
            }}
            color="Aqua"
          />
        </div>
      </div>
    );
  }
}

SettingsPage.propTypes = {
  launchOnStartup: PropTypes.bool.isRequired,
  minimizeOnStartup: PropTypes.bool.isRequired,
  minimizeToTray: PropTypes.bool.isRequired,
  uploadBandwidth: PropTypes.number.isRequired,
  externalOBSCapture: PropTypes.bool.isRequired,
  pendingExternalOBSCapture: PropTypes.bool.isRequired,
  matchProcessedSound: PropTypes.bool.isRequired,
  notificationsBadge: PropTypes.bool.isRequired,
  manualUploadNotifications: PropTypes.bool.isRequired,
  setLaunchOnStartup: PropTypes.func.isRequired,
  setMinimizeOnStartup: PropTypes.func.isRequired,
  setMinimizeToTray: PropTypes.func.isRequired,
  setUploadBandwidth: PropTypes.func.isRequired,
  setExternalOBSCapture: PropTypes.func.isRequired,
  setMatchProcessedSound: PropTypes.func.isRequired,
  setNotificationsBadge: PropTypes.func.isRequired,
  setManualUploadNotifications: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settings }) => ({
  launchOnStartup: settings.launchOnStartup,
  minimizeOnStartup: settings.minimizeOnStartup,
  minimizeToTray: settings.minimizeToTray,
  uploadBandwidth: settings.uploadBandwidth,
  externalOBSCapture: settings.externalOBSCapture,
  pendingExternalOBSCapture: settings.pendingExternalOBSCapture,
  matchProcessedSound: settings.matchProcessedSound,
  notificationsBadge: settings.notificationsBadge,
  manualUploadNotifications: settings.manualUploadNotifications,
});

const mapDispatchToProps = dispatch => ({
  setLaunchOnStartup: (launchOnStartup) => {
    dispatch(setLaunchOnStartup(launchOnStartup));
  },
  setMinimizeOnStartup: (minimizeOnStartup) => {
    dispatch(setMinimizeOnStartup(minimizeOnStartup));
  },
  setMinimizeToTray: (minimizeToTray) => {
    dispatch(setMinimizeToTray(minimizeToTray));
  },
  setUploadBandwidth: (uploadBandwidth) => {
    dispatch(setUploadBandwidth(uploadBandwidth));
  },
  setExternalOBSCapture: (externalOBSCapture) => {
    dispatch(setExternalOBSCapture(externalOBSCapture));
  },
  setMatchProcessedSound: (matchProcessedSound) => {
    dispatch(setMatchProcessedSound(matchProcessedSound));
  },
  setNotificationsBadge: (notificationsBadge) => {
    dispatch(setNotificationsBadge(notificationsBadge));
  },
  setManualUploadNotifications: (manualUploadNotifications) => {
    dispatch(setManualUploadNotifications(manualUploadNotifications));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

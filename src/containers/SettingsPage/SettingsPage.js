/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import mixpanel from 'mixpanel-browser';

import { MP_OPEN_ON_STARTUP_TOGGLE, MP_OBS_MODE_TOGGLE, MP_UPLOAD_BANDWIDTH_SELECT } from 'actions/mixpanelTypes';
import { setLaunchOnStartup, setExternalOBSCapture, setUploadBandwidth } from 'actions/settings';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import SelectInput from 'components/SelectInput/SelectInput';
import xIcon from 'images/genericIcons/darkGreyX.svg';
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

const SettingsPage = ({
  launchOnStartup,
  externalOBSCapture,
  pendingExternalOBSCapture,
  uploadBandwidth,
  setAutoStartup,
  setOBSMode,
  setBandwidth,
}) => (
  <div styleName="wrapper">
    <div styleName="header">
      <h1 styleName="headerText"> CLIENT SETTINGS </h1>
      <Link to="/home" styleName="xIconWrapper">
        <img src={xIcon} alt="close" styleName="xIcon" />
      </Link>
    </div>
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
              ipcRenderer.send('set-launch-on-startup', !launchOnStartup);
              setAutoStartup(!launchOnStartup);
              mixpanel.track(MP_OPEN_ON_STARTUP_TOGGLE, {
                state: !launchOnStartup,
              });
              mixpanel.people.set({
                open_on_startup: !launchOnStartup,
              });
            }}
          />
        </label>
        <h5 styleName="settingText"> Launch automatically on startup </h5>
      </div>
    </div>
    <div styleName="subSection">
      <h4 styleName="subHeading"> Upload Limit </h4>
      <div styleName="settingWrapper">
        <h5> Maximum upload rate: </h5>
        <div styleName="dropdownWrapper">
          <SelectInput
            options={availableUploadBandwidths}
            selectOption={bandwidth => setBandwidth(bandwidth)}
            selectedOption={availableUploadBandwidths.filter(bandwidth => bandwidth.val === uploadBandwidth)[0]}
          />
        </div>
      </div>
      <p styleName="settingSubtext" className="italic">
        We recommend 2 Mbps for auto upload.<br />
        Lowering the speed can help with ping issues. <br />
        For more info click <a
          className="blueLink"
          onClick={(e) => {
            e.preventDefault();
            electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/troubleshoot/upload`);
          }}
        >here</a>.
      </p>
    </div>
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
              setOBSMode(!pendingExternalOBSCapture);
              mixpanel.track(MP_OBS_MODE_TOGGLE, {
                state: !pendingExternalOBSCapture,
              });
              mixpanel.people.set({
                obs_mode: !pendingExternalOBSCapture,
              });
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

SettingsPage.propTypes = {
  launchOnStartup: PropTypes.bool.isRequired,
  externalOBSCapture: PropTypes.bool.isRequired,
  pendingExternalOBSCapture: PropTypes.bool.isRequired,
  uploadBandwidth: PropTypes.number.isRequired,
  setAutoStartup: PropTypes.func.isRequired,
  setOBSMode: PropTypes.func.isRequired,
  setBandwidth: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settings }) => ({
  launchOnStartup: settings.launchOnStartup,
  externalOBSCapture: settings.externalOBSCapture,
  pendingExternalOBSCapture: settings.pendingExternalOBSCapture,
  uploadBandwidth: settings.uploadBandwidth,
});

const mapDispatchToProps = dispatch => ({
  setAutoStartup: (launchOnStartup) => {
    dispatch(setLaunchOnStartup(launchOnStartup));
  },
  setOBSMode: (externalOBSCapture) => {
    dispatch(setExternalOBSCapture(externalOBSCapture));
  },
  setBandwidth: (uploadBandwidth) => {
    mixpanel.track(MP_UPLOAD_BANDWIDTH_SELECT, { upload_bandwidth: uploadBandwidth });
    mixpanel.people.set({ upload_bandwidth: uploadBandwidth });
    dispatch(setUploadBandwidth(uploadBandwidth));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

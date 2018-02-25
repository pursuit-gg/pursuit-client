/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { setLaunchOnStartup } from 'actions/settings';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import xIcon from 'images/genericIcons/darkGreyX.svg';
import './SettingsPage.m.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const SettingsPage = ({ launchOnStartup, setAutoStartup }) => (
  <div styleName="wrapper">
    <div styleName="header">
      <h1 styleName="headerText"> CLIENT SETTINGS </h1>
      <Link to="/home" styleName="xIconWrapper">
        <img src={xIcon} alt="close" styleName="xIcon" />
      </Link>
    </div>
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
          }}
        />
      </label>
      <h5 styleName="settingText"> Launch automatically on startup </h5>
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
  setAutoStartup: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settings }) => ({
  launchOnStartup: settings.launchOnStartup,
});

const mapDispatchToProps = dispatch => ({
  setAutoStartup: (launchOnStartup) => {
    dispatch(setLaunchOnStartup(launchOnStartup));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

/* global window */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import mixpanel from 'mixpanel-browser';

import { logoutUser } from 'actions/user';
import { setUpdateAvailable } from 'actions/settings';
import { numNewMatches } from 'helpers/notifications';
import logo from 'images/logo/logoSmall.png';
import lightBulb from 'images/genericIcons/whiteLightBulb.png';
import './ProfileHeader.m.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { app } = electron.remote;
const appVersion = app.getVersion();

class ProfileHeader extends Component {
  constructor(props) {
    super(props);
    this.installUpdate = this.installUpdate.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('update-downloaded', () => {
      this.props.setUpdateAvailable(true);
      mixpanel.track('Update - Downloaded', {
        current_version: appVersion,
      });
    });
    ipcRenderer.on('update-not-available', () => {
      this.props.setUpdateAvailable(false);
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('update-downloaded');
    ipcRenderer.removeAllListeners('update-not-available');
  }

  installUpdate() {
    this.props.setUpdateAvailable(false);
    ipcRenderer.send('install-update');
  }

  render() {
    const { user, logout, updateIsAvailable } = this.props;
    const newMatches = numNewMatches(this.props.matchNotifications);
    return (
      <div styleName="header">
        <img styleName="logo" src={logo} alt="pursuit" />
        <div styleName="dropdown">
          {user.username === null &&
            <h5 className="bold"> Options </h5>
          }
          {user.username !== null &&
            <h5 className="bold"> { user.username } </h5>
          }
          <div styleName="triangleDown" />
          <div styleName="dropdown-content">
            <h5><a
              onClick={(e) => {
                e.preventDefault();
                electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/fortnite/dashboard`);
              }}
            >Dashboard {newMatches > 0 ? `(${newMatches})` : ''}</a></h5>
            <h5><Link to="/settings"> Settings </Link></h5>
            <h5><a
              onClick={(e) => {
                e.preventDefault();
                electron.shell.openExternal('mailto:james@pursuit.gg');
              }}
            >Report a Bug</a></h5>
            <h5><Link to="/about"> About </Link></h5>
            <h5><a onClick={logout}> Logout </a></h5>
          </div>
        </div>
        {updateIsAvailable &&
          <div styleName="update">
            <div styleName="lightbulbBackground">
              <img src={lightBulb} alt="light bulb icon" styleName="lightbulb" />
            </div>
            <div styleName="updateDropdown">
              <h5><a onClick={this.installUpdate}> Update and Restart </a></h5>
            </div>
          </div>
        }
        {this.props.spectator &&
          <h5 styleName="spectator" className=""> Team Mode </h5>
        }
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  user: PropTypes.object,
  spectator: PropTypes.bool.isRequired,
  matchNotifications: PropTypes.object.isRequired,
  updateIsAvailable: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  setUpdateAvailable: PropTypes.func.isRequired,
};

ProfileHeader.defaultProps = {
  user: {},
};

const mapStateToProps = ({ user, team, settings, notifications }) => ({
  user,
  spectator: user.hasTeamAccess && team.name !== null,
  matchNotifications: notifications.matches,
  updateIsAvailable: settings.updateAvailable,
});

const mapDispatchToProps = dispatch => (
  {
    logout: () => {
      dispatch(logoutUser());
    },
    setUpdateAvailable: (isAvailable) => {
      dispatch(setUpdateAvailable(isAvailable));
    },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader);

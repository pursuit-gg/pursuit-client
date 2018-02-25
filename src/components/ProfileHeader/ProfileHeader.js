/* global window */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import mixpanel from 'mixpanel-browser';

import { logoutUser } from 'actions/user';
import { setUpdateAvailable } from 'actions/settings';
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
    ipcRenderer.on('update-downloaded', (event, info) => {
      this.props.setUpdateAvailable(true);
      mixpanel.track('Update - Downloaded', {
        username: this.props.user.username,
        user_id: this.props.user.id,
        current_version: appVersion,
        update_version: info.version,
      });
    });
    ipcRenderer.on('update-not-available', (event, info) => {
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
                electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/profile`);
              }}
            >Match History</a></h5>
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
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
  setUpdateAvailable: PropTypes.func.isRequired,
  updateIsAvailable: PropTypes.bool.isRequired,
};

ProfileHeader.defaultProps = {
  user: {},
};

const mapStateToProps = ({ user, settings }) => ({
  user,
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

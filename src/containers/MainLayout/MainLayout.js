import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProfileHeader from 'components/ProfileHeader/ProfileHeader';
import './MainLayout.m.css';

const MainLayout = ({ spectator, children }) => (
  <div styleName="content">
    <ProfileHeader />
    <div styleName={spectator ? 'blizWarningSpectator' : 'blizWarning'}>
      <h5 styleName="blizWarningMessage" className="bold">
        Blizzard has issued warnings on using any third party software while playing Overwatch.
        While we are looking into this, please stop using Pursuit. We&apos;ll post updates on
        our Twitter and Discord.
      </h5>
      <h5 styleName="blizWarningMessage paddingTop"> Reminder to: </h5>
      <ul styleName="warningList">
        <li styleName="warningListItem">
          <h5> Disable Pursuit from launching automatically from the settings </h5>
        </li>
        <li styleName="warningListItem">
          <h5> Quit Pursuit from your tray to avoid it running in the background </h5>
        </li>
      </ul>
    </div>
    <div styleName={spectator ? 'addSpectatorTop' : 'addTop'}>
      {children}
    </div>
  </div>
);

MainLayout.propTypes = {
  spectator: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
};

const mapStateToProps = ({ user, team }) => ({
  spectator: user.hasTeamAccess && team.name !== null,
});

export default connect(mapStateToProps, {})(MainLayout);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProfileHeader from 'components/ProfileHeader/ProfileHeader';
import './MainLayout.m.css';

const MainLayout = ({ spectator, children }) => (
  <div styleName="content">
    <ProfileHeader />
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

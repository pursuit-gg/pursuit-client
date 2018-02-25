import React from 'react';
import PropTypes from 'prop-types';

import ProfileHeader from 'components/ProfileHeader/ProfileHeader';
import './MainLayout.m.css';

const MainLayout = ({ children }) => (
  <div styleName="content">
    <ProfileHeader />
    <div styleName="addTop">
      {children}
    </div>
  </div>
);

MainLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default MainLayout;

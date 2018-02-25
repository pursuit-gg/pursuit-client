import React from 'react';
import PropTypes from 'prop-types';

import logo from 'images/logo/logoLarge.png';
import './PublicContainer.m.css';

const PublicContainer = ({ children }) => (
  <div styleName="wrapper">
    <div styleName="header">
      <img src={logo} alt="logo" />
    </div>
    {children}
  </div>
);

PublicContainer.propTypes = {
  children: PropTypes.object.isRequired,
};

export default PublicContainer;

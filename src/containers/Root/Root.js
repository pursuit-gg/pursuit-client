import React from 'react';
import PropTypes from 'prop-types';

import './Root.m.css';

const Root = ({ children }) => (
  <div styleName="wrapper">
    {children}
  </div>
);

Root.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Root;

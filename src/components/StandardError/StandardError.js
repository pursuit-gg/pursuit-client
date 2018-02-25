import React from 'react';
import PropTypes from 'prop-types';

import './StandardError.m.css';

const getTextStyles = (banner, withSpacing, right, left) => {
  let styles = withSpacing ? 'spacing ' : '';
  styles = `${styles}${banner ? 'largeText' : ''}`;
  styles = `${styles}${right ? 'right' : ''}`;
  styles = `${styles}${left ? 'left' : ''}`;
  return styles;
};

const StandardError = ({ text, banner, withSpacing, right, left }) => (
  <div styleName={banner ? 'banner' : 'textWrapper'}>
    <p styleName={getTextStyles(banner, withSpacing, right, left)}> { text } </p>
  </div>
);

StandardError.propTypes = {
  text: PropTypes.string.isRequired,
  withSpacing: PropTypes.bool,
  banner: PropTypes.bool,
  right: PropTypes.bool,
  left: PropTypes.bool,
};

StandardError.defaultProps = {
  withSpacing: false,
  banner: false,
  right: false,
  left: false,
};

export default StandardError;

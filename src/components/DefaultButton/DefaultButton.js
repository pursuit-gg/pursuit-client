import React from 'react';
import PropTypes from 'prop-types';

import './DefaultButton.m.css';


const getStyles = (outline, slim, color, stateDisable, spacedHz) => {
  let styles = slim ? 'slim ' : 'basic ';
  styles = `${styles}${stateDisable ? 'greyDisable ' : ''}`;
  styles = `${styles}${spacedHz ? 'spacedHz ' : ''}`;
  styles = `${styles}${outline ? 'outline' : 'solid'}`;
  styles = `${styles}${color}`;
  return styles;
};

const DefaultButton = ({
  type,
  text,
  onClick,
  disabled,
  outline,
  slim,
  color,
  isFetching,
  stateDisable,
  spacedHz,
  styles,
}) => (
  <button
    type={type}
    onClick={onClick}
    styleName={`${getStyles(outline, slim, color, stateDisable, spacedHz)}`}
    disabled={disabled || stateDisable}
    style={{ ...styles }}
  >
    <span styleName={`${isFetching ? 'transparent' : ''}`}> {text} </span>
    {isFetching &&
      <div styleName={`${slim ? 'spinnerWrapperSlim' : 'spinnerWrapper'}`}>
        <i className="fa fa-spinner fa-spin" />
      </div>
    }
  </button>
);

DefaultButton.defaultProps = {
  type: 'button',
  disabled: false,
  outline: false,
  slim: false,
  color: 'Mint',
  stateDisable: false,
  isFetching: false,
  spacedHz: false,
  styles: {},
};

DefaultButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  slim: PropTypes.bool,
  color: PropTypes.string,
  isFetching: PropTypes.bool,
  stateDisable: PropTypes.bool,
  spacedHz: PropTypes.bool,
  styles: PropTypes.object,
};

export default DefaultButton;


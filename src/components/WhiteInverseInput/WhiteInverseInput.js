import React from 'react';
import PropTypes from 'prop-types';

import './WhiteInverseInput.m.css';

const WhiteInverseInput = ({ type, value, label, onChange }) => (
  <div styleName="wrapper">
    {label.length > 0 &&
      <h5 styleName="label" className="bold"> {label} </h5>
    }
    <input
      type={type}
      value={value}
      onChange={onChange}
      styleName="outlinedInput"
    />
  </div>
);

WhiteInverseInput.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

WhiteInverseInput.defaultProps = {
  label: '',
};

export default WhiteInverseInput;

import React from 'react';
import PropTypes from 'prop-types';

import DefaultButton from 'components/DefaultButton/DefaultButton';
import sadFace from 'images/genericIcons/sadFace.png';
import './FetchError.m.css';

const FetchError = ({ reload, reloadClick }) => (
  <div styleName="wrapper">
    <p styleName="errorTitle"> We couldn&apos;t load this page. </p>
    {reload &&
      <DefaultButton text="Retry" onClick={reloadClick} color="Grapefruit" />
    }
    <img styleName="sadFace" src={sadFace} alt="sadFace" />
  </div>
);

FetchError.propTypes = {
  reloadClick: PropTypes.func,
  reload: PropTypes.bool,
};

FetchError.defaultProps = {
  reloadClick: () => {},
  reload: true,
};

export default FetchError;

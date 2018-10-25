import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DarkCard.m.css';

class DarkCard extends Component {
  render() {
    return (
      <div styleName={`wrapper ${this.props.slim ? 'slimPadding' : 'fullPadding'}`}>
        {this.props.children}
      </div>
    );
  }
}

DarkCard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  slim: PropTypes.bool.isRequired,
};

DarkCard.defaultProps = {
  slim: false,
};

export default DarkCard;

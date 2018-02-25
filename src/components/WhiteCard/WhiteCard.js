import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './WhiteCard.m.css';

class WhiteCard extends Component {
  render() {
    return (
      <div styleName={`wrapper ${this.props.slim ? 'slimPadding' : 'fullPadding'}`}>
        {this.props.children}
      </div>
    );
  }
}

WhiteCard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  slim: PropTypes.bool.isRequired,
};

WhiteCard.defaultProps = {
  slim: false,
};

export default WhiteCard;

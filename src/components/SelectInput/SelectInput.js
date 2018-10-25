import React, { Component } from 'react';
import PropTypes from 'prop-types';

import triangleWhite from 'images/genericIcons/triangleWhite.svg';

import './SelectInput.m.css';

class SelectInput extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.selectOption = this.selectOption.bind(this);
    this.wrapperStyle = this.wrapperStyle.bind(this);
  }

  selectOption(option) {
    this.setState({ open: false });
    this.props.selectOption(option);
  }

  wrapperStyle() {
    if (this.props.small) {
      return 'smallWrapper';
    } else if (this.props.large) {
      return 'largeWrapper';
    }
    return 'wrapper';
  }

  render() {
    const { options, selectedOption } = this.props;
    return (
      <div styleName={`${this.wrapperStyle()}`}>
        {!this.state.open &&
          <div styleName="closedDropdown" onClick={() => this.setState({ open: true })}>
            {this.props.large &&
              <h3 className="ellipsis"> {selectedOption.title} </h3>
            }
            {this.props.small &&
              <p className="ellipsis"> {selectedOption.title} </p>
            }
            {!this.props.large && !this.props.small &&
              <h5 className="ellipsis"> {selectedOption.title} </h5>
            }
            <img styleName="triangle" src={triangleWhite} alt="dropdown arrow" />
          </div>
        }
        {this.state.open &&
          <div styleName="openDropdown">
            {options.map(option => (
              <a
                key={option.title}
                styleName="selectOptionTitle"
                onClick={() => this.selectOption(option.val)}
              >
                {this.props.large ?
                  <h3 className={`ellipsis ${selectedOption.title === option.title ? 'bold' : ''}`}>
                    {option.title}
                  </h3>
                  :
                  <h5 className={`ellipsis ${selectedOption.title === option.title ? 'bold' : ''}`}>
                    {option.title}
                  </h5>
                }
              </a>
            ))}
          </div>
        }
        {this.state.open &&
          <div styleName="openDropdownOverlay" onClick={() => this.setState({ open: false })} />
        }
      </div>
    );
  }
}

SelectInput.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.object.isRequired,
  large: PropTypes.bool.isRequired,
  small: PropTypes.bool.isRequired,
};

SelectInput.defaultProps = {
  large: false,
  small: false,
};

export default SelectInput;

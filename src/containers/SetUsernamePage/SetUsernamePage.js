import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateUser, clearUserMessage } from 'actions/user';

import DarkCard from 'components/DarkCard/DarkCard';
import DarkInput from 'components/DarkInput/DarkInput';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import StandardError from 'components/StandardError/StandardError';

import logoLarge from 'images/logo/logoLarge.png';

import './SetUsernamePage.m.css';

class SetUsernamePage extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearUserMessage();
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleSubmit(event) {
    this.props.updateUser(this.state, true);
    event.preventDefault();
  }

  render() {
    return (
      <div styleName="wrapper">
        <img src={logoLarge} alt="Pursuit" />
        <h1 styleName="title"> Set Up Your Account </h1>
        <DarkCard>
          <form onSubmit={this.handleSubmit}>
            <DarkInput
              type="text"
              label="Username"
              value={this.state.username}
              onChange={this.handleChange}
            />
            <div className="center">
              <DefaultButton
                type="submit"
                text="Next"
                isFetching={this.props.isFetching}
                disabled={this.props.isFetching}
              />
              {this.props.error !== null &&
                <StandardError text={this.props.error.message} withSpacing />
              }
            </div>
          </form>
        </DarkCard>
      </div>
    );
  }
}

SetUsernamePage.propTypes = {
  updateUser: PropTypes.func.isRequired,
  clearUserMessage: PropTypes.func.isRequired,
  error: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
};

SetUsernamePage.defaultProps = {
  error: null,
};

const mapStateToProps = ({ errors, requests }) => {
  const error = errors.updateUser;
  const isFetching = (Boolean(requests.updateUser) && Boolean(requests.updateUser.length));
  return { error, isFetching };
};

export default connect(mapStateToProps, { updateUser, clearUserMessage })(SetUsernamePage);

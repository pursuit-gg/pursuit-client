import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateUser, clearUserMessage } from 'actions/user';
import WhiteCard from 'components/WhiteCard/WhiteCard';
import WhiteInverseInput from 'components/WhiteInverseInput/WhiteInverseInput';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import StandardError from 'components/StandardError/StandardError';
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

  handleChange(event, mode) {
    switch (mode) {
      case 'username':
        this.setState({ username: event.target.value });
        break;
      default:
        break;
    }
  }

  handleSubmit(event) {
    this.props.updateUser(this.state, this.props.redirectToOnboarding);
    event.preventDefault();
  }

  render() {
    return (
      <div styleName="wrapper">
        <h1 styleName="title"> Set Up Your Account </h1>
        <WhiteCard>
          <form onSubmit={this.handleSubmit}>
            <WhiteInverseInput
              type="text"
              label="Username"
              value={this.state.username}
              onChange={event => this.handleChange(event, 'username')}
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
        </WhiteCard>
      </div>
    );
  }
}

SetUsernamePage.propTypes = {
  updateUser: PropTypes.func.isRequired,
  clearUserMessage: PropTypes.func.isRequired,
  error: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  redirectToOnboarding: PropTypes.bool.isRequired,
};

SetUsernamePage.defaultProps = {
  error: null,
};

const mapStateToProps = ({ settings, errors, requests }) => {
  const redirectToOnboarding = !settings.onboardingComplete;
  const error = errors.updateUser;
  const isFetching = (Boolean(requests.updateUser) && Boolean(requests.updateUser.length));
  return { redirectToOnboarding, error, isFetching };
};

export default connect(mapStateToProps, { updateUser, clearUserMessage })(SetUsernamePage);

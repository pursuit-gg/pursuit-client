import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { login } from 'actions/user';
import DarkInput from 'components/DarkInput/DarkInput';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import StandardError from 'components/StandardError/StandardError';
import './LoginForm.m.css';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, mode) {
    switch (mode) {
      case 'email':
        this.setState({ email: event.target.value });
        break;
      case 'password':
        this.setState({ password: event.target.value });
        break;
      default:
        break;
    }
  }

  handleSubmit(event) {
    this.props.login(this.state.email, this.state.password, this.props.redirectToOnboarding);
    event.preventDefault();
  }

  render() {
    return (
      <div styleName="wrapper">
        <form onSubmit={this.handleSubmit}>
          <DarkInput
            type="email"
            label="Email"
            value={this.state.email}
            onChange={event => this.handleChange(event, 'email')}
          />
          <DarkInput
            type="password"
            label="Password"
            value={this.state.password}
            onChange={event => this.handleChange(event, 'password')}
          />
          <div className="center">
            <DefaultButton
              type="submit"
              text="Sign In"
              isFetching={this.props.isFetching}
              disabled={this.props.isFetching}
            />
            {this.props.error !== null &&
              <StandardError text={this.props.error.message} withSpacing />
            }
          </div>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  redirectToOnboarding: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  error: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
};

LoginForm.defaultProps = {
  error: null,
};

const mapStateToProps = ({ settings, errors, requests }) => {
  const redirectToOnboarding = !settings.onboardingComplete;
  const error = errors.login;
  const isFetching = (Boolean(requests.login) && Boolean(requests.login.length));
  return { redirectToOnboarding, error, isFetching };
};

export default connect(mapStateToProps, { login })(LoginForm);

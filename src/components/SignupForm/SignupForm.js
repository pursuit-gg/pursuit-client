import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { signUp } from 'actions/user';
import DarkInput from 'components/DarkInput/DarkInput';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import StandardError from 'components/StandardError/StandardError';
import './SignupForm.m.css';

class SignupForm extends Component {
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
    this.props.signUp(this.state.email, this.state.password);
    event.preventDefault();
  }

  render() {
    return (
      <div styleName="wrapper">
        <form onSubmit={this.handleSubmit}>
          <DarkInput
            type="email"
            label="Enter your email"
            value={this.state.email}
            onChange={event => this.handleChange(event, 'email')}
          />
          <DarkInput
            type="password"
            label="Create Password"
            value={this.state.password}
            onChange={event => this.handleChange(event, 'password')}
          />
          <div className="center">
            <DefaultButton
              type="submit"
              text="Sign Up"
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

SignupForm.propTypes = {
  signUp: PropTypes.func.isRequired,
  error: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
};

SignupForm.defaultProps = {
  error: null,
};

const mapStateToProps = ({ errors, requests }) => {
  const error = errors.signup;
  const isFetching = (Boolean(requests.signup) && Boolean(requests.signup.length));
  return { error, isFetching };
};

export default connect(mapStateToProps, { signUp })(SignupForm);

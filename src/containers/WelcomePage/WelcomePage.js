import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import welcomebg from 'images/onboarding/welcomebg.png';
import logo from 'images/logo/logoLargeWhite.png';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import './WelcomePage.m.css';

const WelcomePage = ({ goToLogin, goToSignUp }) => (
  <div
    styleName="wrapper"
    style={{ backgroundImage: `url(${welcomebg})`, backgroundSize: 'cover' }}
  >
    <div styleName="header">
      <img src={logo} alt="logo" />
    </div>
    <h1 styleName="title"> Welcome </h1>
    <h2 styleName="description"> Overwatch analytics that help you understand every game and accelerate improvement! </h2>
    <h2 styleName="description"> No FPS drops. Promise! </h2>
    <div>
      <DefaultButton
        text="Sign Up"
        onClick={goToSignUp}
        color="Mint"
        styles={{ width: '300px', margin: '15px' }}
      />
    </div>
    <div>
      <DefaultButton
        text="Log In"
        onClick={goToLogin}
        color="Mint"
        outline
        styles={{ width: '300px' }}
      />
    </div>
  </div>
);

WelcomePage.propTypes = {
  goToLogin: PropTypes.func.isRequired,
  goToSignUp: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  goToLogin: () => dispatch(push('/login')),
  goToSignUp: () => dispatch(push('/signup')),
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);

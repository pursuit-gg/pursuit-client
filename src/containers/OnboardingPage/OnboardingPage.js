import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import mixpanel from 'mixpanel-browser';

import {
  MP_ONBOARDING_NEXT,
  MP_ONBOARDING_SKIP,
  MP_ONBOARDING_CHANGE_SCREEN,
} from 'actions/mixpanelTypes';
import { setOnboardingComplete } from 'actions/settings';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import logoLarge from 'images/logo/logoLarge.png';
import logoLargeWhite from 'images/logo/logoLargeWhite.png';
import clientImage from 'images/onboarding/client.png';
import arrow from 'images/onboarding/arrow.svg';
import './OnboardingPage.m.css';

const stepTitles = [
  'Make sure Pursuit is running when you play Overwatch.',
  'Toggle off auto uploading if you are experiencing latency or performance issues.',
];

class OnboardingPage extends Component {
  constructor(props) {
    super(props);
    this.state = { step: 1 };
    this.setStep = this.setStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.goToHome = this.goToHome.bind(this);
  }

  setStep(step) {
    mixpanel.track(MP_ONBOARDING_CHANGE_SCREEN, {
      username: this.props.user.username,
      user_id: this.props.user.id,
      current_step: this.state.step,
      next_step: step,
    });
    this.setState({ step });
  }

  nextStep() {
    mixpanel.track(MP_ONBOARDING_NEXT, {
      username: this.props.user.username,
      user_id: this.props.user.id,
      step: this.state.step,
    });
    this.setState({ step: this.state.step + 1 });
  }

  goToHome(skip) {
    const eventName = skip ? MP_ONBOARDING_SKIP : MP_ONBOARDING_NEXT;
    mixpanel.track(eventName, {
      username: this.props.user.username,
      user_id: this.props.user.id,
      step: this.state.step,
    });
    this.props.goToHome();
  }

  render() {
    if (this.state.step === 1) {
      return (
        <div styleName="orangeBackground">
          <div styleName="wrapper">
            <img styleName="logo" src={logoLargeWhite} alt="Pursuit" />
            <h2 styleName="welcomeMessage">
              Welcome to Pursuit!<br /><br />
              To ensure accurate tracking,<br />
              please read through the following<br />
              set-up instructions carefully.
            </h2>
            <DefaultButton
              text="Next"
              onClick={() => this.nextStep()}
            />
          </div>
        </div>
      );
    }
    return (
      <div styleName="wrapper">
        <img styleName="logo" src={logoLarge} alt="Pursuit" />
        <h2 styleName="title"> {stepTitles[this.state.step - 2]} </h2>
        <div styleName="imageWrapper">
          {this.state.step === 3 &&
            <img
              styleName="arrow"
              src={arrow}
              alt="arrow"
            />
          }
          <img
            styleName="imageScale"
            src={clientImage}
            alt="screenshot of app"
          />
        </div>
        {this.state.step < 3 &&
          <DefaultButton
            text="Next"
            onClick={() => this.nextStep()}
          />
        }
        {this.state.step === 3 &&
          <DefaultButton
            text="FINISH"
            onClick={() => this.goToHome(false)}
          />
        }
        <p> <a styleName="faintLink" onClick={() => this.goToHome(true)}> Skip </a> </p>
        <div styleName={this.state.step === 1 ? 'circle active' : 'circle'} onClick={() => this.setStep(1)} />
        <div styleName={this.state.step === 2 ? 'circle active' : 'circle'} onClick={() => this.setStep(2)} />
        <div styleName={this.state.step === 3 ? 'circle active' : 'circle'} onClick={() => this.setStep(3)} />
      </div>
    );
  }
}

OnboardingPage.propTypes = {
  goToHome: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = dispatch => ({
  goToHome: () => {
    dispatch(setOnboardingComplete(true));
    dispatch(push('/home'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingPage);

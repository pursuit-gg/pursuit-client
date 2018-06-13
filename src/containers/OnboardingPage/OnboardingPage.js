import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import mixpanel from 'mixpanel-browser';

import {
  MP_ONBOARDING_NEXT,
} from 'actions/mixpanelTypes';
import { setOnboardingComplete, setUploadBandwidth } from 'actions/settings';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import logoLarge from 'images/logo/logoLarge.png';
import logoLargeWhite from 'images/logo/logoLargeWhite.png';
import clientImage from 'images/onboarding/client.png';
import arrow from 'images/onboarding/arrow.svg';
import './OnboardingPage.m.css';

const stepTitles = [
  'When Overwatch is running the tracking icon will turn from grey to blue.',
  'Upload your matches after your session, or set Pursuit to upload them automatically.',
];

class OnboardingPage extends Component {
  constructor(props) {
    super(props);
    this.state = { step: 1 };
    this.nextStep = this.nextStep.bind(this);
    this.goToHome = this.goToHome.bind(this);
  }

  nextStep() {
    mixpanel.track(MP_ONBOARDING_NEXT, {
      step: this.state.step,
    });
    this.setState({ step: this.state.step + 1 });
  }

  goToHome() {
    mixpanel.track(MP_ONBOARDING_NEXT, {
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
        {this.state.step === 3 &&
          <h5 styleName="notice"> (this may cause ping spikes with slower internet connections) </h5>
        }
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
        <div styleName="indicators">
          <div styleName={this.state.step === 1 ? 'circle active' : 'circle'} />
          <div styleName={this.state.step === 2 ? 'circle active' : 'circle'} />
          <div styleName={this.state.step === 3 ? 'circle active' : 'circle'} />
        </div>
      </div>
    );
  }
}

OnboardingPage.propTypes = {
  goToHome: PropTypes.func.isRequired,
};


const mapDispatchToProps = dispatch => ({
  goToHome: () => {
    dispatch(setUploadBandwidth(3));
    dispatch(setOnboardingComplete(true));
    dispatch(push('/home'));
  },
});

export default connect(() => ({}), mapDispatchToProps)(OnboardingPage);

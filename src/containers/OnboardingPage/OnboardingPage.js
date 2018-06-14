import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import mixpanel from 'mixpanel-browser';

import {
  MP_ONBOARDING_NEXT,
} from 'actions/mixpanelTypes';
import { setOnboardingComplete, setUploadBandwidth, setComputerType } from 'actions/settings';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import logoLarge from 'images/logo/logoLarge.png';
import logoLargeWhite from 'images/logo/logoLargeWhite.png';
import clientImg from 'images/onboarding/client.png';
import setGraphicsCardImg from 'images/onboarding/setgraphicscard.png';
import './OnboardingPage.m.css';

const bandwidthLookup = {
  '1-5': 1.5,
  '6-10': 2,
  '11-20': 3,
  '21+': 5,
};

class OnboardingPage extends Component {
  constructor(props) {
    super(props);
    this.state = { step: 1, selectedUpload: '6-10' };
    this.nextStep = this.nextStep.bind(this);
    this.goToHome = this.goToHome.bind(this);
    this.selectUpload = this.selectUpload.bind(this);
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
    const uploadBandwidth = bandwidthLookup[this.state.selectedUpload];
    this.props.goToHome(uploadBandwidth);
  }

  selectUpload(event) {
    this.setState({ selectedUpload: event.target.value });
  }

  renderTrackingDesc() {
    return (
      <div styleName="title">
        <h2>
          Pursuit&apos;s tracking symbol will turn blue when the game is running.
          You should see the game in the capture preview.
        </h2>
        <img
          alt="client tracking"
          styleName="imageScale imageDropshadow"
          src={clientImg}
        />
      </div>
    );
  }

  renderUploadSelection() {
    return (
      <div styleName="title">
        <h2> Choose your internet <br /> <span styleName="orangeUnderline"> upload</span> speed. </h2>
        <div styleName="radioWrapper">
          <div styleName="radio">
            <input
              type="radio"
              value="1-5"
              checked={this.state.selectedUpload === '1-5'}
              onChange={this.selectUpload}
            />
            <h5 className="inline"> 1-5 Mbps </h5>
          </div>
          <div styleName="radio">
            <input
              type="radio"
              value="6-10"
              checked={this.state.selectedUpload === '6-10'}
              onChange={this.selectUpload}
            />
            <h5 className="inline"> 6-10 Mbps </h5>
          </div>
          <div styleName="radio">
            <input
              type="radio"
              value="11-20"
              checked={this.state.selectedUpload === '11-20'}
              onChange={this.selectUpload}
            />
            <h5 className="inline"> 11-20 Mbps </h5>
          </div>
          <div styleName="radio">
            <input
              type="radio"
              value="21+"
              checked={this.state.selectedUpload === '21+'}
              onChange={this.selectUpload}
            />
            <h5 className="inline"> 21+ Mbps</h5>
          </div>
        </div>
        <h5 className="italic textLeft">
          We set Pursuit&apos;s bandwidth limits based on your upload speed.
          If you experience latency issues you can change this in your settings.
        </h5>
      </div>
    );
  }

  renderLaptopStep() {
    return (
      <div styleName={this.state.step === 1 ? 'orangeBackground' : ''}>
        <div styleName="wrapper">
          {this.state.step === 1 ?
            <img src={logoLargeWhite} alt="Pursuit" /> :
            <img src={logoLarge} alt="Pursuit" />
          }
          {this.state.step === 1 &&
            <div>
              <h1 styleName="title"> SET GRAPHICS CARD </h1>
              <div className="textLeft">
                <h2> To use Pursuit on a laptop, you <span styleName="strongBlue"> must </span> follow these steps. </h2>
                <h2> - Close Pursuit </h2>
                <h2> - Right click on the icon, select "Run with graphics processor" </h2>
                <h2> - Select your dedicated graphics card. </h2>
              </div>
              <img
                alt="run with graphics processor"
                styleName="imageScale"
                src={setGraphicsCardImg}
              />
            </div>
          }
          {this.state.step === 2 &&
            this.renderTrackingDesc()
          }
          {this.state.step === 3 &&
           this.renderUploadSelection()
          }
          {this.state.step < 3 &&
            <DefaultButton
              text={this.state.step === 1 ? 'Done' : 'Next'}
              onClick={() => this.nextStep()}
            />
          }
          {this.state.step === 3 &&
            <DefaultButton
              text="FINISH"
              onClick={() => this.goToHome()}
            />
          }
        </div>
      </div>
    );
  }

  renderDesktopStep() {
    return (
      <div styleName="wrapper">
        <img src={logoLarge} alt="Pursuit" />
        {this.state.step === 1 &&
          this.renderTrackingDesc()
        }
        {this.state.step === 2 &&
          this.renderUploadSelection()
        }
        {this.state.step < 2 &&
          <DefaultButton
            text="Next"
            onClick={() => this.nextStep()}
            styles={{ marginTop: '30px' }}
          />
        }
        {this.state.step === 2 &&
          <DefaultButton
            text="FINISH"
            onClick={() => this.goToHome()}
          />
        }
      </div>
    );
  }

  renderSetComputerType() {
    return (
      <div styleName="orangeBackground">
        <div styleName="wrapper">
          <img styleName="largeTopSpacer" src={logoLargeWhite} alt="Pursuit" />
          <h1 styleName="setupTitle"> SET UP FOR : </h1>
          <div styleName="computerTypeButtons">
            <DefaultButton
              text="Laptop"
              onClick={() => this.props.setComputerType('laptop')}
              styles={{ margin: '10px', width: '140px' }}
            />
            <DefaultButton
              text="Desktop"
              onClick={() => this.props.setComputerType('desktop')}
              styles={{ margin: '10px', width: '140px' }}
            />
          </div>
          <h5 styleName="footer"> Set up varies slightly, and we want to make sure you get <br /> all the right info. </h5>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.computerType === null) {
      return this.renderSetComputerType();
    } if (this.props.computerType === 'laptop') {
      return this.renderLaptopStep();
    }
    return this.renderDesktopStep();
  }
}

OnboardingPage.propTypes = {
  goToHome: PropTypes.func.isRequired,
  setComputerType: PropTypes.func.isRequired,
  computerType: PropTypes.string,
};

OnboardingPage.defaultProps = {
  computerType: null,
};

const mapStateToProps = ({ settings }) => (
  { computerType: settings.computerType }
);

const mapDispatchToProps = dispatch => ({
  setComputerType: computerType => dispatch(setComputerType(computerType)),
  goToHome: (uploadBandwidth) => {
    dispatch(setUploadBandwidth(uploadBandwidth));
    dispatch(setOnboardingComplete(true));
    dispatch(push('/home'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingPage);

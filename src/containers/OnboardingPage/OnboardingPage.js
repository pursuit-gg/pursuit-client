/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import mixpanel from 'mixpanel-browser';

import {
  MP_ONBOARDING_NEXT,
  MP_USER_SETTING_CHANGE,
} from 'actions/mixpanelTypes';
import { setOnboardingComplete, setUploadBandwidth, setComputerType } from 'actions/settings';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import logoLarge from 'images/logo/logoLarge.png';
import logoLargeWhite from 'images/logo/logoLargeWhite.png';
import clientImg from 'images/onboarding/client.png';
import setGraphicsCardImg from 'images/onboarding/setgraphicscard.png';
import './OnboardingPage.m.css';

const ipcRenderer = window.require('electron').ipcRenderer;

class OnboardingPage extends Component {
  constructor(props) {
    super(props);
    this.state = { step: 1, selectedUpload: '3' };
    this.nextStep = this.nextStep.bind(this);
    this.goToHome = this.goToHome.bind(this);
    this.selectUpload = this.selectUpload.bind(this);
  }

  componentWillMount() {
    if (this.props.computerType === 'laptop') {
      ipcRenderer.send('set-minimize-to-tray', false);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.computerType !== nextProps.computerType && nextProps.computerType === 'laptop') {
      ipcRenderer.send('set-minimize-to-tray', false);
    }
  }

  componentWillUnmount() {
    ipcRenderer.send('set-minimize-to-tray', this.props.minimizeToTray);
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
    this.props.goToHome(parseFloat(this.state.selectedUpload));
  }

  selectUpload(event) {
    this.setState({ selectedUpload: event.target.value });
  }

  renderTrackingDesc() {
    return (
      <div>
        <h2 styleName="title">
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
      <div styleName="uploadBadwidthStepWrapper">
        <h2> Pick a bandwidth limit for uploading: </h2>
        <div styleName="radioWrapper">
          <div styleName="radio">
            <input
              type="radio"
              value="1.5"
              checked={this.state.selectedUpload === '1.5'}
              onChange={this.selectUpload}
            />
            <h5 className="inline"> 1.5 Mbps </h5>
          </div>
          <div styleName="radio">
            <input
              type="radio"
              value="2"
              checked={this.state.selectedUpload === '2'}
              onChange={this.selectUpload}
            />
            <h5 className="inline"> 2 Mbps </h5>
          </div>
          <div styleName="radio">
            <input
              type="radio"
              value="3"
              checked={this.state.selectedUpload === '3'}
              onChange={this.selectUpload}
            />
            <h5 className="inline"> 3 Mbps (Recommended)</h5>
          </div>
          <div styleName="radio">
            <input
              type="radio"
              value="5"
              checked={this.state.selectedUpload === '5'}
              onChange={this.selectUpload}
            />
            <h5 className="inline"> 5 Mbps</h5>
          </div>
        </div>
        <h5 className="italic textLeft">
          Pursuit operates best with at least 3 Mbps. <br /> If you experience latency spikes in game try a lower value in your settings.
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
              <div className="textLeft" styleName="smallSpacing">
                <h2> To use Pursuit on a laptop, you <span styleName="strongBlue"> must </span> follow these steps. </h2>
                <h2> - Close Pursuit </h2>
                <h2> - Right click on the icon, select "Run with graphics processor" </h2>
                <h2> - Select your dedicated graphics card. </h2>
              </div>
              <img
                alt="run with graphics processor"
                styleName="imageScale smallSpacing"
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
  computerType: PropTypes.string,
  minimizeToTray: PropTypes.bool.isRequired,
  setComputerType: PropTypes.func.isRequired,
  goToHome: PropTypes.func.isRequired,
};

OnboardingPage.defaultProps = {
  computerType: null,
};

const mapStateToProps = ({ settings }) => ({
  computerType: settings.computerType,
  minimizeToTray: settings.minimizeToTray,
});

const mapDispatchToProps = dispatch => ({
  setComputerType: (computerType) => {
    dispatch(setComputerType(computerType));
  },
  goToHome: (uploadBandwidth) => {
    mixpanel.track(MP_USER_SETTING_CHANGE, { setting: 'upload_bandwidth', before: 0, after: uploadBandwidth });
    mixpanel.people.set({ upload_bandwidth: uploadBandwidth });
    dispatch(setUploadBandwidth(uploadBandwidth));
    dispatch(setOnboardingComplete(true));
    dispatch(push('/home'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingPage);

import {
  SETTINGS_SET_UPDATE_AVAILABLE,
  SETTINGS_SET_MANUAL_CAPTURE_UPLOAD,
  SETTINGS_SET_ONBOARDING_COMPLETE,
  SETTINGS_SET_LAUNCH_ON_STARTUP,
  SETTINGS_SET_EXTERNAL_OBS_CAPTURE,
  SETTINGS_SET_UPLOAD_BANDWIDTH,
} from '../actions/types';

const INITIAL_STATE = {
  updateAvailable: false,
  manualCaptureUpload: false,
  onboardingComplete: false,
  launchOnStartup: true,
  externalOBSCapture: false,
  pendingExternalOBSCapture: false,
  uploadBandwidth: 0,
};

const settings = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETTINGS_SET_UPDATE_AVAILABLE:
      return {
        ...state,
        updateAvailable: action.updateAvailable,
      };
    case SETTINGS_SET_MANUAL_CAPTURE_UPLOAD:
      return {
        ...state,
        manualCaptureUpload: action.manualCaptureUpload,
      };
    case SETTINGS_SET_ONBOARDING_COMPLETE:
      return {
        ...state,
        onboardingComplete: action.onboardingComplete,
      };
    case SETTINGS_SET_LAUNCH_ON_STARTUP:
      return {
        ...state,
        launchOnStartup: action.launchOnStartup,
      };
    case SETTINGS_SET_EXTERNAL_OBS_CAPTURE:
      return {
        ...state,
        pendingExternalOBSCapture: action.externalOBSCapture,
      };
    case SETTINGS_SET_UPLOAD_BANDWIDTH:
      return {
        ...state,
        uploadBandwidth: action.uploadBandwidth,
      };
    default:
      return state;
  }
};

export default settings;

import {
  SETTINGS_SET_UPDATE_AVAILABLE,
  SETTINGS_SET_COMPUTER_TYPE,
  SETTINGS_SET_ONBOARDING_COMPLETE,
  SETTINGS_CLOSE_TROUBLESHOOTING_TIP,
  SETTINGS_SET_SHOW_CAPTURE_PREVIEW,
  SETTINGS_SET_MANUAL_CAPTURE_UPLOAD,
  SETTINGS_SET_LAUNCH_ON_STARTUP,
  SETTINGS_SET_MINIMIZE_ON_STARTUP,
  SETTINGS_SET_MINIMIZE_TO_TRAY,
  SETTINGS_SET_UPLOAD_BANDWIDTH,
  SETTINGS_SET_EXTERNAL_OBS_CAPTURE,
  SETTINGS_SET_MANUAL_UPLOAD_NOTIFICATIONS,
} from '../actions/types';

const INITIAL_STATE = {
  updateAvailable: false,
  computerType: null,
  onboardingComplete: false,
  troubleshootingTipClosed: false,
  showCapturePreview: true,
  manualCaptureUpload: false,
  launchOnStartup: true,
  minimizeOnStartup: true,
  minimizeToTray: true,
  uploadBandwidth: 0,
  externalOBSCapture: false,
  pendingExternalOBSCapture: false,
  manualUploadNotifications: true,
};

const settings = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETTINGS_SET_UPDATE_AVAILABLE:
      return {
        ...state,
        updateAvailable: action.updateAvailable,
      };
    case SETTINGS_SET_COMPUTER_TYPE:
      return {
        ...state,
        computerType: action.computerType,
      };
    case SETTINGS_SET_ONBOARDING_COMPLETE:
      return {
        ...state,
        onboardingComplete: action.onboardingComplete,
      };
    case SETTINGS_CLOSE_TROUBLESHOOTING_TIP:
      return {
        ...state,
        troubleshootingTipClosed: true,
      };
    case SETTINGS_SET_SHOW_CAPTURE_PREVIEW:
      return {
        ...state,
        showCapturePreview: action.showCapturePreview,
      };
    case SETTINGS_SET_MANUAL_CAPTURE_UPLOAD:
      return {
        ...state,
        manualCaptureUpload: action.manualCaptureUpload,
      };
    case SETTINGS_SET_LAUNCH_ON_STARTUP:
      return {
        ...state,
        launchOnStartup: action.launchOnStartup,
      };
    case SETTINGS_SET_MINIMIZE_ON_STARTUP:
      return {
        ...state,
        minimizeOnStartup: action.minimizeOnStartup,
      };
    case SETTINGS_SET_MINIMIZE_TO_TRAY:
      return {
        ...state,
        minimizeToTray: action.minimizeToTray,
      };
    case SETTINGS_SET_UPLOAD_BANDWIDTH:
      return {
        ...state,
        uploadBandwidth: action.uploadBandwidth,
      };
    case SETTINGS_SET_EXTERNAL_OBS_CAPTURE:
      return {
        ...state,
        pendingExternalOBSCapture: action.externalOBSCapture,
      };
    case SETTINGS_SET_MANUAL_UPLOAD_NOTIFICATIONS:
      return {
        ...state,
        manualUploadNotifications: action.manualUploadNotifications,
      };
    default:
      return state;
  }
};

export default settings;

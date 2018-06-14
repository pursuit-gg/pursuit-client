import {
  SETTINGS_SET_UPDATE_AVAILABLE,
  SETTINGS_SET_MANUAL_CAPTURE_UPLOAD,
  SETTINGS_SET_ONBOARDING_COMPLETE,
  SETTINGS_SET_LAUNCH_ON_STARTUP,
  SETTINGS_SET_EXTERNAL_OBS_CAPTURE,
  SETTINGS_SET_UPLOAD_BANDWIDTH,
  SETTINGS_SET_COMPUTER_TYPE,
} from 'actions/types';

export function setUpdateAvailable(isAvailable) {
  return {
    type: SETTINGS_SET_UPDATE_AVAILABLE,
    updateAvailable: isAvailable,
  };
}

export function setManualCaptureUpload(manualCaptureUpload) {
  return {
    type: SETTINGS_SET_MANUAL_CAPTURE_UPLOAD,
    manualCaptureUpload,
  };
}

export function setOnboardingComplete(onboardingComplete) {
  return {
    type: SETTINGS_SET_ONBOARDING_COMPLETE,
    onboardingComplete,
  };
}

export function setComputerType(computerType) {
  return {
    type: SETTINGS_SET_COMPUTER_TYPE,
    computerType,
  };
}

export function setLaunchOnStartup(launchOnStartup) {
  return {
    type: SETTINGS_SET_LAUNCH_ON_STARTUP,
    launchOnStartup,
  };
}

export function setExternalOBSCapture(externalOBSCapture) {
  return {
    type: SETTINGS_SET_EXTERNAL_OBS_CAPTURE,
    externalOBSCapture,
  };
}

export function setUploadBandwidth(uploadBandwidth) {
  return {
    type: SETTINGS_SET_UPLOAD_BANDWIDTH,
    uploadBandwidth,
  };
}

import {
  SETTINGS_SET_UPDATE_AVAILABLE,
  SETTINGS_SET_SHOW_CAPTURE_PREVIEW,
  SETTINGS_SET_MANUAL_CAPTURE_UPLOAD,
  SETTINGS_SET_ONBOARDING_COMPLETE,
  SETTINGS_SET_LAUNCH_ON_STARTUP,
  SETTINGS_SET_MINIMIZE_ON_STARTUP,
  SETTINGS_SET_MINIMIZE_TO_TRAY,
  SETTINGS_SET_EXTERNAL_OBS_CAPTURE,
  SETTINGS_SET_UPLOAD_BANDWIDTH,
  SETTINGS_SET_COMPUTER_TYPE,
  SETTINGS_CLOSE_TROUBLESHOOTING_TIP,
} from 'actions/types';

export function setUpdateAvailable(isAvailable) {
  return {
    type: SETTINGS_SET_UPDATE_AVAILABLE,
    updateAvailable: isAvailable,
  };
}

export function setShowCapturePreview(showCapturePreview) {
  return {
    type: SETTINGS_SET_SHOW_CAPTURE_PREVIEW,
    showCapturePreview,
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

export function setLaunchOnStartup(launchOnStartup) {
  return {
    type: SETTINGS_SET_LAUNCH_ON_STARTUP,
    launchOnStartup,
  };
}

export function setMinimizeOnStartup(minimizeOnStartup) {
  return {
    type: SETTINGS_SET_MINIMIZE_ON_STARTUP,
    minimizeOnStartup,
  };
}

export function setMinimizeToTray(minimizeToTray) {
  return {
    type: SETTINGS_SET_MINIMIZE_TO_TRAY,
    minimizeToTray,
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

export function setComputerType(computerType) {
  return {
    type: SETTINGS_SET_COMPUTER_TYPE,
    computerType,
  };
}

export function closeTroubleshootingTip() {
  return {
    type: SETTINGS_CLOSE_TROUBLESHOOTING_TIP,
  };
}

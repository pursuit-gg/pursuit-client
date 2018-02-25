import {
  SETTINGS_SET_UPDATE_AVAILABLE,
  SETTINGS_SET_MANUAL_CAPTURE_UPLOAD,
  SETTINGS_SET_ONBOARDING_COMPLETE,
  SETTINGS_SET_LAUNCH_ON_STARTUP,
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

export function setLaunchOnStartup(launchOnStartup) {
  return {
    type: SETTINGS_SET_LAUNCH_ON_STARTUP,
    launchOnStartup,
  };
}

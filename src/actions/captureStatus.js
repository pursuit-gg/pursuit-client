import {
  CAPTURE_STARTED,
  CAPTURE_STOPPED,
  QUEUE_CAPTURE_UPLOAD,
  REQUEUE_CAPTURE_UPLOAD,
  START_CAPTURE_UPLOAD,
  CAPTURE_UPLOADING,
  CAPTURE_UPLOAD_FINISHED,
  CAPTURE_UPLOAD_ERRORED,
} from 'actions/types';

export function captureStarted(scaleRes) {
  return {
    type: CAPTURE_STARTED,
    scaleRes,
  };
}

export function captureStopped() {
  return {
    type: CAPTURE_STOPPED,
  };
}

export function queueCaptureUpload(folder, userId, manualCaptureUpload) {
  return {
    type: QUEUE_CAPTURE_UPLOAD,
    capture: {
      folder,
      userId,
      progress: 0,
      error: null,
    },
    manualCaptureUpload,
  };
}

export function requeueCaptureUpload() {
  return {
    type: REQUEUE_CAPTURE_UPLOAD,
  };
}

export function startCaptureUpload() {
  return {
    type: START_CAPTURE_UPLOAD,
  };
}

export function captureUploading(folder, userId, progress) {
  return {
    type: CAPTURE_UPLOADING,
    capture: {
      folder,
      userId,
      progress,
      error: null,
    },
  };
}

export function captureUploadFinished(folder, userId) {
  return {
    type: CAPTURE_UPLOAD_FINISHED,
    capture: {
      folder,
      userId,
      progress: 100,
      error: null,
    },
  };
}

export function captureUploadErrored(folder, userId, error) {
  return {
    type: CAPTURE_UPLOAD_ERRORED,
    capture: {
      folder,
      userId,
      progress: 0,
      error,
    },
  };
}

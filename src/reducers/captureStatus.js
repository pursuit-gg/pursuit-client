import {
  CAPTURE_STARTED,
  CAPTURE_STOPPED,
  CAPTURE_ERRORED,
  QUEUE_CAPTURE_UPLOAD,
  REQUEUE_CAPTURE_UPLOAD,
  START_CAPTURE_UPLOAD,
  PAUSE_CAPTURE_UPLOAD,
  CAPTURE_UPLOADING,
  CAPTURE_UPLOAD_FINISHED,
  CAPTURE_UPLOAD_CANCELLED,
  CAPTURE_UPLOAD_ERRORED,
} from '../actions/types';

const INITIAL_STATE = {
  capturing: false,
  uploadPaused: false,
  scaleRes: '1920x1080',
  uploadQueue: [],
  currentUpload: null,
  latestUploadAt: null,
  error: null,
};

const alreadyQueued = (uploadQueue, currentUpload, newUpload) => {
  const newUploadMatch = newUpload.folder.match(/[\\/](\d+)$/);
  if (!newUploadMatch) {
    return true;
  }
  if (currentUpload) {
    const currentUploadMatch = currentUpload.folder.match(/[\\/](\d+)$/);
    if (currentUploadMatch && currentUploadMatch[1] === newUploadMatch[1]) {
      return true;
    }
  }
  const matchingFolders = uploadQueue.reduce((matchCount, queuedUpload) => {
    const queuedUploadMatch = queuedUpload.folder.match(/[\\/](\d+)$/);
    if (queuedUploadMatch && queuedUploadMatch[1] === newUploadMatch[1]) {
      return matchCount + 1;
    }
    return matchCount;
  }, 0);
  return matchingFolders > 0;
};

const captureStatus = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CAPTURE_STARTED:
      return {
        ...state,
        capturing: true,
        scaleRes: action.scaleRes || state.scaleRes,
      };
    case CAPTURE_STOPPED:
      return {
        ...state,
        capturing: false,
      };
    case CAPTURE_ERRORED:
      return {
        ...state,
        error: action.error,
      };
    case QUEUE_CAPTURE_UPLOAD:
      if (alreadyQueued(state.uploadQueue, state.currentUpload, action.capture)) {
        return state;
      }
      if (action.manualCaptureUpload || state.uploadPaused || state.currentUpload !== null) {
        return {
          ...state,
          uploadQueue: [...state.uploadQueue, action.capture].sort((a, b) =>
            (a.folder > b.folder ? 1 : -1),
          ),
        };
      }
      return {
        ...state,
        uploadQueue: [...state.uploadQueue, action.capture].sort((a, b) =>
          (a.folder > b.folder ? 1 : -1),
        ).slice(1),
        currentUpload: [...state.uploadQueue, action.capture].sort((a, b) =>
          (a.folder > b.folder ? 1 : -1),
        )[0],
      };
    case REQUEUE_CAPTURE_UPLOAD:
      if (state.currentUpload === null) {
        return state;
      }
      return {
        ...state,
        uploadQueue: [state.currentUpload, ...state.uploadQueue],
        currentUpload: null,
      };
    case START_CAPTURE_UPLOAD:
      if (state.currentUpload !== null) {
        return state;
      }
      return {
        ...state,
        uploadPaused: false,
        uploadQueue: state.uploadQueue.slice(1),
        currentUpload: (state.uploadQueue[0] || null),
      };
    case PAUSE_CAPTURE_UPLOAD:
      return {
        ...state,
        uploadPaused: true,
      };
    case CAPTURE_UPLOADING:
      if (state.currentUpload === null || state.currentUpload.folder !== action.capture.folder) {
        return state;
      }
      return {
        ...state,
        currentUpload: action.capture,
      };
    case CAPTURE_UPLOAD_FINISHED:
      if (state.currentUpload === null || state.currentUpload.folder !== action.capture.folder) {
        return state;
      }
      return {
        ...state,
        uploadQueue: state.uploadPaused ? state.uploadQueue : state.uploadQueue.slice(1),
        currentUpload: state.uploadPaused ? null : (state.uploadQueue[0] || null),
        latestUploadAt: state.uploadQueue.length === 0 ? new Date().toISOString() : state.latestUploadAt,
      };
    case CAPTURE_UPLOAD_CANCELLED:
      if (alreadyQueued(state.uploadQueue, null, action.capture)) {
        return state;
      }
      return {
        ...state,
        uploadQueue: [...state.uploadQueue, action.capture].sort((a, b) =>
          (a.folder > b.folder ? 1 : -1),
        ),
        currentUpload:
          state.currentUpload === null || state.currentUpload.folder !== action.capture.folder ?
          state.currentUpload : null,
      };
    case CAPTURE_UPLOAD_ERRORED:
      if (state.currentUpload === null || state.currentUpload.folder !== action.capture.folder) {
        return state;
      }
      return {
        ...state,
        currentUpload: action.capture,
      };
    default:
      return state;
  }
};

export default captureStatus;

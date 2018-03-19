import {
  CAPTURE_STARTED,
  CAPTURE_STOPPED,
  QUEUE_CAPTURE_UPLOAD,
  REQUEUE_CAPTURE_UPLOAD,
  START_CAPTURE_UPLOAD,
  CAPTURE_UPLOADING,
  CAPTURE_UPLOAD_FINISHED,
  CAPTURE_UPLOAD_ERRORED,
} from '../actions/types';

const INITIAL_STATE = {
  capturing: false,
  scaleRes: '1920x1080',
  uploadQueue: [],
  currentUpload: null,
  latestUploadAt: null,
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
    case QUEUE_CAPTURE_UPLOAD:
      if (action.manualCaptureUpload || state.currentUpload !== null) {
        return {
          ...state,
          uploadQueue: [...state.uploadQueue, action.capture],
        };
      }
      return {
        ...state,
        uploadQueue: [...state.uploadQueue, action.capture].slice(1),
        currentUpload: [...state.uploadQueue, action.capture][0],
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
        uploadQueue: state.uploadQueue.slice(1),
        currentUpload: (state.uploadQueue[0] || null),
      };
    case CAPTURE_UPLOADING:
      if (state.currentUpload.folder !== action.capture.folder) {
        return state;
      }
      return {
        ...state,
        currentUpload: action.capture,
      };
    case CAPTURE_UPLOAD_FINISHED:
      if (state.currentUpload.folder !== action.capture.folder) {
        return state;
      }
      return {
        ...state,
        uploadQueue: state.uploadQueue.slice(1),
        currentUpload: (state.uploadQueue[0] || null),
        latestUploadAt: state.uploadQueue.length === 0 ? new Date().toISOString() : state.latestUploadAt,
      };
    case CAPTURE_UPLOAD_ERRORED:
      if (state.currentUpload.folder !== action.capture.folder) {
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

import {
  ADD_ERROR,
  REMOVE_ERROR,
  ADD_TO_ERROR_ARRAY,
  REMOVE_FROM_ERROR_ARRAY,
  CLEAR_ERRORS,
} from '../actions/types';

export function addError(key, err, id = null) {
  return {
    type: ADD_ERROR,
    key,
    errorMsg: err.message,
    id,
  };
}

export function removeError(key) {
  return {
    type: REMOVE_ERROR,
    key,
  };
}

export function addToErrorArray(key, val) {
  return {
    type: ADD_TO_ERROR_ARRAY,
    key,
    val,
  };
}

export function removeFromErrorArray(key, val) {
  return {
    type: REMOVE_FROM_ERROR_ARRAY,
    key,
    val,
  };
}

export function clearErrors() {
  return {
    type: CLEAR_ERRORS,
  };
}

import {
  ADD_REQUEST,
  REMOVE_REQUEST,
  CLEAR_REQUESTS,
} from '../actions/types';

export function addRequest(key, value = true, meta = {}) {
  return {
    type: ADD_REQUEST,
    value,
    key,
    meta,
  };
}

export function removeRequest(key, value = true) {
  return {
    type: REMOVE_REQUEST,
    value,
    key,
  };
}

export function clearRequests() {
  return {
    type: CLEAR_REQUESTS,
  };
}

import {Map, List} from 'immutable'

export default function reducer(state = Map(), action) {
  switch (action.type) {
    case 'RESET_ERROR_MESSAGE':
      return null;
    default:
      return action.error ? action.error : state;
  }
  return state;
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  }
}
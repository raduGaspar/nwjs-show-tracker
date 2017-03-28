import { default as SC } from '../constants/Shows';

const initialState = {
  shows: [],
};

export default function shows(state = initialState, action) {
  switch (action.type) {
    case SC.SET_SHOWS: {
      return {
        ...state,
        shows: action.shows,
      };
    }
    default:
      return state;
  }
}

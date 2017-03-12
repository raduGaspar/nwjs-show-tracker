import { default as MC } from '../constants/Menu';

const initialState = {
  visible: true,
};

export default function menu(state = initialState, action) {
  switch (action.type) {
    case MC.TOGGLE_MENU: {
      return {
        ...state,
        visible: !state.visible,
      };
    }
    default:
      return state;
  }
}

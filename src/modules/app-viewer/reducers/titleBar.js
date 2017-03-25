import { default as TC } from '../constants/TitleBar';

const initialState = {
  visible: true,
};

export default function titleBar(state = initialState, action) {
  switch (action.type) {
    case TC.TOGGLE_TITLE_BAR: {
      return {
        ...state,
        visible: !state.visible,
      };
    }
    default:
      return state;
  }
}

import { default as TC } from '../constants/TitleBar';
import { default as SC } from '../constants/Shows';

// actions
export const toggleTitleBar = () => ({ type: TC.TOGGLE_TITLE_BAR });
export const setShows = shows => ({ type: SC.SET_SHOWS, shows });

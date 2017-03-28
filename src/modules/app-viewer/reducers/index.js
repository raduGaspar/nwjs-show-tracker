import { combineReducers } from 'redux';
import titleBar from './titleBar';
import shows from './shows';
import { default as GUtils } from '../../../utils/GUtils';

const appReducer = combineReducers({
  titleBar,
  shows,
  globals: GUtils.globals,
});

export default appReducer;

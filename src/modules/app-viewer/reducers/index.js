import { combineReducers } from 'redux';
import titleBar from './titleBar';
import { default as GUtils } from '../../../utils/GUtils';

const appReducer = combineReducers({
  titleBar,
  globals: GUtils.globals,
});

export default appReducer;

import { combineReducers } from 'redux';
import menu from './menu';
import { default as GUtils } from '../../../utils/GUtils';

const appReducer = combineReducers({
  menu,
  globals: GUtils.globals,
});

export default appReducer;

import { combineReducers } from 'redux';
import menu from './menu';

const appReducer = combineReducers({
  menu,
});

export default appReducer;

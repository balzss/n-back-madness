import { combineReducers } from 'redux';
import viewState from './viewState';
import gameOptions from './gameOptions';

const rootReducer = combineReducers({
    viewState,
    gameOptions
});

export default rootReducer;

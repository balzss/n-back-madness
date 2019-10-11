import { SET_VIEW_STATE, VIEW_STATES } from '../actions';

function viewState(state = VIEW_STATES.HOME_VIEW, action) {
    switch (action.type) {
        case SET_VIEW_STATE:
            return action.viewState;
        default:
            return state;
    }
}

export default viewState;

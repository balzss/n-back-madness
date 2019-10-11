import { SET_N_BACK } from '../actions';

const defaultOptions = {
    nBack: 1,
    totalRounds: 21,
    singleQuestionTime: 3000
}

function gameOptions(state = defaultOptions, action) {
    switch (action.type) {
        case SET_N_BACK:
            return {
                ...state,
                nBack: action.nBack
            };
        default:
            return state;
    }
}

export default gameOptions;

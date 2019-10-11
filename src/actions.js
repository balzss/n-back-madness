// Action types

export const SET_VIEW_STATE = 'SET_VIEW_STATE';
export const SET_N_BACK = 'SET_N_BACK';
export const SET_TOTAL_ROUNDS = 'SET_TOTAL_ROUNDS';

export const VIEW_STATES = {
    HOME_VIEW: 'HOME_VIEW',
    GAME_VIEW: 'GAME_VIEW',
    STATS_VIEW: 'STATS_VIEW'
};

export function setViewState(viewState) {
    return { type: SET_VIEW_STATE, viewState };
}

export function setNBack(nBack) {
    return { type: SET_N_BACK, nBack };
}

export function setTotalRounds(totalRounds) {
    return { type: SET_TOTAL_ROUNDS, totalRounds };
}

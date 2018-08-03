import {
	createSelector,
} from 'reselect';

import {
	State,
} from '../reducers';

const getState = (state: State) => {
	return state.historyState;
};

export const getHistoryID = createSelector([
	getState,
], (state) => {
	return state.historyID;
});

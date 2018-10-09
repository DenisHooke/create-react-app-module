import { combineReducers } from 'redux';

function initReducers(reducers) {
    return combineReducers({
        ...reducers,
    });
}

export default initReducers;

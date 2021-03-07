import {combineReducers} from 'redux'
import {routeState} from './routeState';
const rootReducer = combineReducers({routeState});
export type RootState = ReturnType<typeof rootReducer>
export {rootReducer};
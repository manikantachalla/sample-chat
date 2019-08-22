import { combineReducers, ReducersMapObject } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { Action } from '../action/model'
import { AppState } from '../state/state-model'
import { activeReducer, messageListReducer, otherUsersReducer } from './reducers'

type ReducerAppState = AppState
export const reducerMapObj: ReducersMapObject<ReducerAppState, Action<any>> = {
    active: activeReducer,
    messageList: messageListReducer,
    otherUsers: otherUsersReducer
}

export const mainReducer = combineReducers<AppState>(reducerMapObj)

export type AppDispatch = ThunkDispatch<AppState, {}, Action>

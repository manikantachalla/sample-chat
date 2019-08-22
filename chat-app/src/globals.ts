import { History } from 'history'
import { Store } from 'redux'

import { AppState } from './state/state-model'

let _history: History | undefined
export const setHistory = (history: History) => _history = history
export const getHistory = (): History => {
    if (!_history) throw new Error("History is not set")
    return _history
}

let _reduxStore: Store<AppState> | undefined
export const setReduxStore = (store: Store<AppState>) => _reduxStore = store
export const hasReduxStore = () => !!_reduxStore
export const getReduxStore = (): Store<AppState> => {
    if (!_reduxStore) throw new Error("Redux store is not set")
    return _reduxStore
}

export const getReduxState = (): AppState => {
    const store = getReduxStore()
    return store.getState()
}

export const EMPTY_FUNC = () => { }
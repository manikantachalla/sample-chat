import { createStore } from 'redux'

import { Action } from './action/model'
import { makeStoreEnhancer } from './app-setup/app-config-helpers'
import { setReduxStore } from './globals'
import { mainReducer } from './reducers/main-reducer'
import { AppState } from './state/state-model'


export const preBootSetup = async () => {
    const enhancer = makeStoreEnhancer()

    const store = createStore<AppState, Action, any, any>(mainReducer, enhancer)
    setReduxStore(store)
}
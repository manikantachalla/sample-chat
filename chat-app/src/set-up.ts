import { createStore } from 'redux'

import { Action } from './action/model'
import { makeHistory, makeStoreEnhancer } from './app-setup/app-config-helpers'
import { setHistory, setReduxStore } from './globals'
import { setGlobalApiHost } from './network/browser-http-client'
import { mainReducer } from './reducers/main-reducer'
import { AppState } from './state/state-model'


export const preBootSetup = async () => {

    const apiHost = process.env.API_HOST ? process.env.API_HOST : undefined    //empty strings should become undefined
    setGlobalApiHost(apiHost)
    //TODO
    const history = makeHistory("chat-app") //TODO
    setHistory(history)
    const enhancer = makeStoreEnhancer(history)

    const store = createStore<AppState, Action, any, any>(mainReducer, enhancer)
    setReduxStore(store)
}
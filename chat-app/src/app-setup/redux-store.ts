/* import * as localforage from 'localforage'
import { createStore, StoreEnhancer } from 'redux'
import { enableBatching } from 'redux-batched-actions'
import { createPersistor, getStoredState, PersistorConfig } from 'redux-persist'
import createCompressEncryptor from 'redux-persist-transform-compress-encrypt'
import { GeniusError } from 'shared/src/common/error'
import { GeniusLogger } from 'shared/src/common/log'

import { Action } from '../actions/common'
import { AppBaseState } from '../models/redux-state/base-state'
import { CommonRouteUrls } from '../routes/route-urls'

const log = new GeniusLogger('redux-store')

export interface ReduxStoreConfig<T extends AppBaseState> {
    persistKeyPrefix: string
    storeEnhancer: StoreEnhancer<T>
    persistBlacklistKeys?: (keyof T)[]
    reducer: (state: T, action: Action<any>) => T
    initAndUpgradeState: (oldState?: T) => Promise<T>
}

//For redux-persist v4
export class ReduxStore<T extends AppBaseState> {
    constructor(public config: ReduxStoreConfig<T>) { }

    persistorConfig(): PersistorConfig {
        const { persistKeyPrefix, persistBlacklistKeys } = this.config

        const compressEncryptor = createCompressEncryptor({
            secretKey: 'if-you-found-this-come-work-with-us',
            onError: function (error) {
                throw new GeniusError('', "INVALID_STATE", error)
            }
        })

        const persistorConfig: PersistorConfig = {
            keyPrefix: persistKeyPrefix,
            blacklist: ['routing', 'loading', 'tabInfo'].concat(persistBlacklistKeys || []),
            storage: localforage,
            debounce: 100,
            transforms: [compressEncryptor]
        }

        return persistorConfig
    }

    async makeStore() {
        const { storeEnhancer, reducer, initAndUpgradeState } = this.config

        const persistorConfig = this.persistorConfig()
        let restoredState: T | undefined
        try {
            restoredState = await this.asyncGetStoredState(persistorConfig)
        } catch (e) {
            //not throwing, just continuing
            new GeniusError("Error in fetching existing state. Purging and starting fresh.", "INVALID_STATE", e)
        }
        if (!restoredState || !restoredState.stateMeta || !restoredState.stateMeta.version || window.location.pathname.endsWith(CommonRouteUrls.reset())) {
            restoredState = undefined
        }
        let upgradedState = await initAndUpgradeState(restoredState)
        const store = createStore(enableBatching(reducer), upgradedState, storeEnhancer)

        //Persistor needs to be created to enable persisting of store else it doesn't persist
        let persistor = createPersistor(store, persistorConfig)
        //Purge the persistor if we were unable to fetch the earlier stored state
        if (!restoredState || !restoredState.stateMeta || !restoredState.stateMeta.version) {
            persistor.purge()
        }

        return { store, persistor }
    }

    async asyncGetStoredState(persistorConfig: PersistorConfig) {
        return new Promise<T | undefined>((resolve, reject) => {
            getStoredState<T | undefined>(persistorConfig, (err, restoredState) => {
                if (err) { return reject(GeniusError.fromObj(err)) }
                return resolve(restoredState as T | undefined)
            })
        })
    }
} */
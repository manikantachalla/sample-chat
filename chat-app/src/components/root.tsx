import { History } from 'history'
import * as React from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'

import { AppState } from '../state/state-model'

export interface RootProps {
    store: Store<AppState>
    //TODO remove if not needed
    history: History
}

export class Root extends React.Component<RootProps> {
    render() {
        const { store, history, children } = this.props
        return <Provider store={store}>
                {children}
            {/* //TODO */}
            {/* <ConnectedRouter history={history}> */}
            {/* </ConnectedRouter> */}
        </Provider>
    }
}

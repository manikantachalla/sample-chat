import * as React from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'

import { AppState } from '../state/state-model'

export interface RootProps {
    store: Store<AppState>
}

export class Root extends React.Component<RootProps> {
    render() {
        const { store, children } = this.props
        return <Provider store={store}>
            {children}
        </Provider>
    }
}

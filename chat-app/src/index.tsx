import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ErrorBoundary } from './components/error-boundary'
import { Root } from './components/root'
import { ChatScreen } from './containers/chat-screen'
import { getHistory, getReduxStore } from './globals'
import { preBootSetup } from './set-up'


const boot = async () => {
    await preBootSetup()
    const store = getReduxStore()
    const history = getHistory()

    ReactDOM.render(
        <ErrorBoundary>
            <Root store={store} history={history} >
                <ChatScreen />
            </Root>
        </ErrorBoundary>,
        document.getElementById("root")
    )
}

boot().catch(e => {
    throw e
})
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ErrorBoundary } from './components/error-boundary'
import { Root } from './components/root'
import { ChatScreen } from './containers/chat-screen'
import { getReduxStore } from './globals'
import { preBootSetup } from './set-up'


const boot = async () => {
    await preBootSetup()
    const store = getReduxStore()

    ReactDOM.render(
        <ErrorBoundary>
            <Root store={store}  >
                <ChatScreen />
            </Root>
        </ErrorBoundary>,
        document.getElementById("root")
    )
}

boot().catch(e => {
    throw e
})
import { createBrowserHistory, History } from 'history'
import { routerMiddleware } from 'react-router-redux'
import { applyMiddleware, compose, Middleware, Store } from 'redux'
import thunk from 'redux-thunk'

//logs all the actions dispatched
const reduxLogger = process.env.NODE_ENV !== 'production' ? require('redux-logger').logger : undefined

export const makeHistory = (appBasePath: string) => {
    const history = createBrowserHistory({ basename: appBasePath || undefined })

    //Took the solution from https://github.com/ReactTraining/react-router/issues/2144#issuecomment-150939358
    history.listen(location => {
        // Use setTimeout to make sure this runs after React Router's own listener
        setTimeout(() => window.scrollTo(0, 0), 0);
    })

    return history
}

export const makeStoreEnhancer = (history: History) => {
    let middlewares: Middleware[] = [
        routerMiddleware(history),
        thunk
    ]

    if (reduxLogger) {
        middlewares.push(reduxLogger)
    }

    //To support redux dev tools via chrome extension
    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ?
            (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
                // Specify here name, actionsBlacklist, actionsCreators and other options
            }) : compose

    return composeEnhancers(
        applyMiddleware(...middlewares)
        // other store enhancers if any
    )
}
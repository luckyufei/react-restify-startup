import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
// import DevTools from 'containers/DevTools'
import api from 'store/middlewares/api'
import rootReducer from 'store/reducers'

export default function configureStore(initialState, history, debug = false) {
  let finalCreateStore;
  if (debug) {
    finalCreateStore = compose(
      applyMiddleware(thunk, routerMiddleware(history), api),
      applyMiddleware(createLogger())
      // DevTools.instrument()
    )(createStore)
  } else {
    finalCreateStore = compose(
      applyMiddleware(thunk, routerMiddleware(history), api)
    )(createStore);
  }

  const store = finalCreateStore(rootReducer, initialState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('store/reducers', () => {
      const nextRootReducers = require('store/reducers');
      store.replaceReducer(nextRootReducers)
    })
  }

  return store
}

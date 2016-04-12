import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import makeRoutes from './routes'
import configureStore from 'store/configureStore'
import log from 'utils/log'
// import "./styles/common.scss"
window.log = log ;
window.log.level = window.log.L_ALL; 

const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: __BASEPATH__
});
const initialState = window.__INITIAL_STATE__ ; 
const store = configureStore(initialState, browserHistory, __DEBUG__);
window.__store__ = store; 
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
});
const component =  (
  <Router history={history}>
     {makeRoutes(store)}
  </Router>
)
render(
   <Provider store={store}>
          {component}
      </Provider>,
  document.getElementById('root')
)

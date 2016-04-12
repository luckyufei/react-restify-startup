import {combineReducers} from 'redux'
import {routerReducer as router} from 'react-router-redux'

import todos from './todos'
import error from './error'

export default combineReducers({
  router,
  todos,
  error,
})
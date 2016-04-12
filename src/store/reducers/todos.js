
import { handleActions, createAction } from 'redux-actions'
import Immutable, { List, Map, Record } from 'immutable'

const Todo = Record({
  text: 'Use Redux',
  completed: false,
  id: 0
})

const
  ADD_TODO = "add todo",
  DELETE_TODO = "delete todo",
  EDIT_TODO = "edit todo",
  COMPLETE_TODO = "complete todo",
  COMPLETE_ALL = "complete all",
  CLEAR_COMPLETED = "clear complete"
  ;
const initialState = List([new Todo()])

export const addTodo = createAction(ADD_TODO)
export const deleteTodo = createAction(DELETE_TODO)
export const editTodo = createAction(EDIT_TODO)
export const completeTodo = createAction(COMPLETE_TODO)
export const completeAll = createAction(COMPLETE_ALL)
export const clearCompleted = createAction(CLEAR_COMPLETED)

export default handleActions({
  [ADD_TODO](state, action) {
    return state.push(new Todo({
      text: action.payload,
      id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
    }));
  },

  [DELETE_TODO](state, action) {
    return state.filter(todo => todo.id !== action.payload)
  },

  [EDIT_TODO](state, action) {
    return state.map(todo => {
      return todo.id === action.payload.id
        ? todo.set('text', action.payload.text)
        : todo
    });
  },

  [COMPLETE_TODO](state, action) {
    let ret = state.map(todo => {
      return todo.id === action.payload
        ? todo.set('completed', !todo.completed)
        : todo
    })
    log.info(`complete todo ret: ${ret.toString()}`);
    return ret;
  },

  [COMPLETE_ALL](state, action) {
    const areAllMarked = state.every(todo => todo.completed)
    return state.map(todo => todo.set('completed', !areAllMarked))
  },

  [CLEAR_COMPLETED](state, action) {
    return state.filter(todo => todo.completed === false)
  }
}, initialState);


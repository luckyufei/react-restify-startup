import { camelizeKeys } from 'humps'

// Action key that carries API call info interpreted by this Redux middleware.
function handleFetch(rest, data) {
  return rest(data).then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json)
    }

    const camelizedJson = camelizeKeys(json.ret);
    return  camelizedJson;
  });
}

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default (store) => (next) => (action) => {
  if (typeof action.rest === 'undefined' || typeof action.rest !== 'function') {
    return next(action)
  }
  
  let { rest, data } = action;
  let types = rest.types; 

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction['rest'];
    return finalAction
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return handleFetch(rest, Object.assign({}, data)).then(
    (response) => {
      return next({
        type: successType,
        params: data,
        response
      });
    },
    error => next({
      type: failureType,
      error: error.message || 'Something bad happened'
    })
    )

}

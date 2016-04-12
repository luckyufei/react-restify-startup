import React from 'react'
import { Route, IndexRoute,Redirect } from 'react-router'
import {App} from "containers"

export default (store) => {

  function handleShowIssueDetail(router, replaceState, cb){
    console.log('routes: setupCurrentIssue:',router.params.issueId);
    let {dispatch, getState} = store;
     dispatch(setupCurrentIssue(router.params.issueId));
    cb();
  }

  return (
    <Route path="/beta2.0" component={App}>
    </Route>
  );
}

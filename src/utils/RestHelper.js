import 'isomorphic-fetch'
import log from './log'
import partial from 'lodash/function/partial'
import isFunction from 'lodash/lang/isFunction'
import isArray from 'lodash/lang/isArray'

const APP_JSON_CONTENT_TYPE = "application/json;charset=utf-8",
  REG_URL_PARAM = /\{(\w+)\}/ig,
  basehttp = location.protocol + "//" + location.host + "/" + __ROOTPATH__,
  baseUrl = basehttp;

function ajaxAsync(method, uri, data = {}, options) {
  let headers = {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': APP_JSON_CONTENT_TYPE,
      'Accept': APP_JSON_CONTENT_TYPE
    }
  };

  if (method !== 'GET' && method !== 'DELETE') {
    headers.body = JSON.stringify(data);
  }

  //console.log("fetch header: %s, url: %s", JSON.stringify(headers));

  return fetch(getReqUrl(method, uri, data, options), headers).then(response => {
    return response.json().then(json => ({json, response}))
  }).then(({json, response})=> {
    if (!response.ok) {
      log.error(`request fail. status: ${response.status}`);
      return Promise.reject(json);
    }

    if (json.status !== 200) {
      log.error(`${uri} request fail. status: ${response.status}, msg: ${response.msg}`);
      return Promise.reject(json);
    }

    return Promise.resolve({json, response});
  });
}

function getReqUrl(method, uri, data, options) {
  var url = uri;
  //console.log("getReqUrl: ", method, ", data: ", data);
  //startWith 有兼容性问题，babel没有处理
  if (uri.slice(0, basehttp.length) == basehttp) {
    url = uri;
  } else {
    url = baseUrl + uri;
  }
  //console.log("before data: ", JSON.stringify(data), ", url: ", url, ", userId: ", data.userId);
  url = url.replace(REG_URL_PARAM, function (...args) {
    let key = args && !!args[1] && args[1];
    let ret = key ? data[key] : args[0];
    delete data[key];
    return ret;
  });
  if (!Object.keys(data).length) {
    return url;
  }
  if (method === 'GET' || method === 'DELETE') {
    url += (data ? "?" + $param(data) : "");
  }
  if (options && options.query) {
    url += ("?" + $param(options.query));
  }
  return url;
}

function get(uri, data, options) {
  return ajaxAsync('GET', uri, data, options);
}

function post(uri, data, options) {
  return ajaxAsync('POST', uri, data, options);
}

function put(uri, data, options) {
  return ajaxAsync('PUT', uri, data, options);
}

function remove(uri, data, options) {
  return ajaxAsync('DELETE', uri, data, options);
}

function _handleArrayConfig(arrayConfig) {
  let [method ,uri] = arrayConfig;
  return partialHttp(method.toLowerCase(), uri);
}

function $param(json) {
  return Object.keys(json).reduce(function (sum, key) {
    return `${(sum.length ? sum + '&' : sum)}${key}=${json[key]}`;
  }, "");
}

function partialHttp(method, uri) {
  switch (method) {
    case 'get':
      return partial(get, uri);
    case 'post':
      return partial(post, uri);
    case 'put':
      return partial(put, uri);
    case 'delete':
      return partial(remove, uri);
  }
}

function _handleObjectConfig(entity, action, actionConfig) {
  let {method, uri, schema, types} = actionConfig;
  let httpFn = partialHttp(method, uri);
  if (!!schema) {
    httpFn.schema = schema;
  }
  httpFn.types = types || _generateServiceTypes(entity, action);
  return httpFn;
}

function _generateServiceTypes(entity, action) {
  let typePrefix = entity.toUpperCase() + "_" + action.toUpperCase(),
    actionArr = action.split(/(?=[A-Z])/);
  if (actionArr.length > 1) {
    typePrefix = actionArr.map(val => val.toUpperCase()).join('_');
  }
  return [typePrefix + "_REQ", typePrefix + "_SUCC", typePrefix + "_FAIL"];
}

export default {
  get: get,
  post: post,
  put: put,
  remove: remove,
  basehttp: basehttp,

  publish: function (serviceConfig) {
    let publish = {};

    Object.keys(serviceConfig).forEach(entity => {
      let _exports = {},
        services = serviceConfig[entity],
        uri = serviceConfig.uri || '';

      Object.keys(services).forEach(action => {
        let actionConfig = services[action],
          destFn;
        if (['get', 'post', 'put', 'remove'].indexOf(action) !== -1) {
          if (isFunction(actionConfig)) {
            destFn = actionConfig;
          } else {
            actionConfig.method = action;
            !!actionConfig.uri || (actionConfig.uri = uri);
            destFn = _handleObjectConfig(entity, action, actionConfig);
          }
        } else {
          switch (typeof actionConfig) {
            case 'function':
              destFn = actionConfig;
              break;
            case 'array':
              destFn = _handleArrayConfig(actionConfig);
              break;
            case 'object':
              destFn = _handleObjectConfig(entity, action, actionConfig);
              break;
          }
        }
        if (!destFn.types) {
          destFn.types = _generateServiceTypes(entity, action);
        }
        _exports[action] = destFn;
        publish[entity] = _exports;
      });
    });
    return publish;
  }
}
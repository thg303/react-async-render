'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * react-async-render
 * (c) 2015-2016 eBay Software Foundation
 * react-async-render may be freely distributed under the MIT license.
 */

var _require = require('redux'),
    createStore = _require.createStore,
    applyMiddleware = _require.applyMiddleware,
    combineReducers = _require.combineReducers;

var thunk = require('redux-thunk');

var createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
var reducer = require('./reducer');

module.exports = function (reducers, initData) {
  reducers = reducers || {};
  var _reducers = _extends({}, reducers, {
    initialize: reducer
  });
  var store = createStoreWithMiddleware(combineReducers(_reducers), initData);
  return store;
};
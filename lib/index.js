'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * react-async-render
 * (c) 2015-2016 eBay Software Foundation
 * react-async-render may be freely distributed under the MIT license.
 */

var _require = require('./provider'),
    Provider = _require.Provider,
    contextTypes = _require.contextTypes,
    Script = _require.Script;

var React = require('react');

var _require2 = require('react-dom/server'),
    renderToStaticMarkup = _require2.renderToStaticMarkup;

var createStore = require('./store');
var Q = require('kew');

var InitScript = function (_React$Component) {
  _inherits(InitScript, _React$Component);

  function InitScript() {
    _classCallCheck(this, InitScript);

    return _possibleConstructorReturn(this, (InitScript.__proto__ || Object.getPrototypeOf(InitScript)).apply(this, arguments));
  }

  _createClass(InitScript, [{
    key: 'render',
    value: function render() {
      var store = this.props.store;
      var initState = {};
      if (store && typeof store.getState == 'function') {
        initState = store.getState();
      }
      var body = "window.__INITIAL_STATE__ = " + JSON.stringify(initState);
      return React.createElement('script', { dangerouslySetInnerHTML: { __html: body } });
    }
  }]);

  return InitScript;
}(React.Component);

exports.render = function (appComponent, appReducer) {
  var store = createStore(appReducer || {});

  var allPromises;

  var onResolve = function onResolve(promises) {
    allPromises = promises;
  };

  var app = React.createElement(
    Provider,
    { store: store, onResolve: onResolve },
    appComponent
  );

  var html = renderToStaticMarkup(app);
  var script = '';
  if (allPromises) {
    return allPromises().then(function (results) {
      if (results && results.length) {
        html = renderToStaticMarkup(app);
      }
      var scriptTag = React.createElement(InitScript, { store: store });
      script = renderToStaticMarkup(scriptTag);
      return { store: store, script: script, html: html };
    });
  } else {
    return Q.resolve({ store: store, script: script, html: html });
  }
};
exports.renderToString = function (appComponent, appReducer) {
  return exports.render(appComponent, appReducer).then(function (_ref) {
    var store = _ref.store,
        html = _ref.html,
        script = _ref.script;

    return html;
  });
};

exports.contextTypes = contextTypes;
exports.mixin = require('./mixin');
exports.Provider = exports.AsyncProvider = Provider;
exports.store = exports.createStore = createStore;
exports.reducers = exports.initReducers = { initialize: require('./reducer') };
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

var React = require('react');
var Q = require('kew');

var _require = require('react-redux'),
    connect = _require.connect,
    Provider = _require.Provider;

var _require2 = require('./actions'),
    init = _require2.init;

function Queue(initFunc) {
  var queue = [];
  var initAny = initFunc;
  this.addToQueue = function (promise) {
    queue.push(promise);
  };
  this.resetQueue = function () {
    queue = [];
  };
  this.resolveAll = function () {
    var p;
    if (queue.length) {
      p = Q.all(queue).then(function (results) {
        if (results && results.length) {
          var _results = results.slice(0);
          for (var i = 0, m = _results.length; i < m; i++) {
            var result = _results[i];
            if (typeof initAny == 'function') {
              initAny(result);
            }
          }
        }
        return results;
      }, function (err) {
        console.error('##### error:', err.stack);
      });
    } else {
      p = Q.fcall(function () {
        return [];
      });
    }
    return p;
  };
}

var InitProvider = function (_React$Component) {
  _inherits(InitProvider, _React$Component);

  function InitProvider(props) {
    _classCallCheck(this, InitProvider);

    var _this = _possibleConstructorReturn(this, (InitProvider.__proto__ || Object.getPrototypeOf(InitProvider)).call(this, props));

    _this.state = {
      store: _this.props.store || require('./store')()
    };
    return _this;
  }

  _createClass(InitProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        asyncQ: new Queue(this.props.initAny)
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        Provider,
        { store: this.state.store },
        React.createElement(
          InnerProvider,
          { onResolve: this.props.onResolve },
          this.props.children
        )
      );
    }
  }]);

  return InitProvider;
}(React.Component);

InitProvider.childContextTypes = {
  asyncQ: React.PropTypes.object
};

var InnerProvider = function (_React$Component2) {
  _inherits(InnerProvider, _React$Component2);

  function InnerProvider(props) {
    _classCallCheck(this, InnerProvider);

    return _possibleConstructorReturn(this, (InnerProvider.__proto__ || Object.getPrototypeOf(InnerProvider)).call(this, props));
  }

  _createClass(InnerProvider, [{
    key: 'render',
    value: function render() {
      this.context.asyncQ.resetQueue();
      if (typeof this.props.onResolve == 'function') {
        this.props.onResolve(this.context.asyncQ.resolveAll);
      }
      var children = this.props.children;

      if (typeof children === 'function') {
        return children();
      }
      return children;
    }
  }]);

  return InnerProvider;
}(React.Component);

InnerProvider.contextTypes = {
  asyncQ: React.PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    initAny: function initAny(obj) {
      return dispatch(init(obj.key, obj.data));
    }
  };
}

exports.Provider = connect(null, mapDispatchToProps)(InitProvider);
exports.contextTypes = InnerProvider.contextTypes;
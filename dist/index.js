(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@babel/runtime/helpers/slicedToArray'), require('@babel/runtime/helpers/defineProperty'), require('@babel/runtime/helpers/classCallCheck'), require('@babel/runtime/helpers/createClass')) :
  typeof define === 'function' && define.amd ? define(['@babel/runtime/helpers/slicedToArray', '@babel/runtime/helpers/defineProperty', '@babel/runtime/helpers/classCallCheck', '@babel/runtime/helpers/createClass'], factory) :
  (global = global || self, global.Tracker = factory(global._slicedToArray, global._defineProperty, global._classCallCheck, global._createClass));
}(this, (function (_slicedToArray, _defineProperty, _classCallCheck, _createClass) { 'use strict';

  _slicedToArray = _slicedToArray && Object.prototype.hasOwnProperty.call(_slicedToArray, 'default') ? _slicedToArray['default'] : _slicedToArray;
  _defineProperty = _defineProperty && Object.prototype.hasOwnProperty.call(_defineProperty, 'default') ? _defineProperty['default'] : _defineProperty;
  _classCallCheck = _classCallCheck && Object.prototype.hasOwnProperty.call(_classCallCheck, 'default') ? _classCallCheck['default'] : _classCallCheck;
  _createClass = _createClass && Object.prototype.hasOwnProperty.call(_createClass, 'default') ? _createClass['default'] : _createClass;

  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  // 页面进入事件
  // 页面退出事件
  // 页面停留时长
  // 点击事件
  // 曝光事件
  var Tracker = /*#__PURE__*/function () {
    function Tracker() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, Tracker);
      this.endpoint = options.endpoint || 'https://gf9j42gsjk.execute-api.ap-northeast-2.amazonaws.com/test';
      this.version = options.version || '1.0.0';
      this.sessionTimeout = options.sessionTimeout || 360;
      this.cookieMaxAge = options.cookieMaxAge || 7 * 24 * 60 * 60; // default: cookie过期时间7天
      this.refer = '';
      this.init();
    }
    return _createClass(Tracker, [{
      key: "init",
      value: function init() {
        var _this = this;
        window.addEventListener('pushState', function () {
          return _this.onPageEnterAndLeave('pushState');
        });
        window.addEventListener('popstate', function () {
          return _this.onPageEnterAndLeave('popstate');
        });
        window.addEventListener('pageshow', function () {
          return _this.onPageEnterAndLeave('pageshow');
        });
        window.addEventListener('replaceState', function () {
          return _this.onPageEnterAndLeave('replaceState');
        });
      }
    }, {
      key: "onPageEnterAndLeave",
      value: function onPageEnterAndLeave(eventName) {
        var routeStack = this.getRouteStack() || [];
        var len = routeStack.length;
        this.onPageLeave();
        this.onPageEnter();
        if (len > 5) {
          routeStack.shift();
        }
        routeStack.push(window.location.href);
        this.setRouteStack(routeStack);
      }
    }, {
      key: "onPageEnter",
      value: function onPageEnter() {
        var routeStack = this.getRouteStack() || [];
        var len = routeStack.length;
        if (len) {
          this.refer = routeStack[len - 1];
        } else {
          this.refer = '';
        }
        if (this.preCallApi()) {
          var _time = new Date().getTime();
          var pageviewEvent = {};
          pageviewEvent.event_type = 'enter';
          pageviewEvent.event_name = 'page_enter';
          pageviewEvent.args = JSON.stringify(getUrlParam(window.location.href));
          this.setPageStartTime();
          this.sendData(pageviewEvent);
          this.updatePreVisitTime(_time);
        }
      }
    }, {
      key: "onPageLeave",
      value: function onPageLeave() {
        var routeStack = this.getRouteStack() || [];
        var len = routeStack.length;
        if (!len) {
          return;
        }
        this.refer = routeStack[len - 2];
        if (this.preCallApi()) {
          var _time2 = new Date().getTime();
          var pageviewEvent = {};
          pageviewEvent.page = routeStack[len - 1];
          pageviewEvent.event_type = 'leave';
          pageviewEvent.event_name = 'page_leave';
          pageviewEvent.args = JSON.stringify(getUrlParam(pageviewEvent.page));
          pageviewEvent.duration = this.getPageStartTime() ? Date.now() - this.getPageStartTime() : '';
          this.sendData(pageviewEvent);
          this.updatePreVisitTime(_time2);
        }
      }
    }, {
      key: "onPageClose",
      value: function onPageClose() {
        if (this.preCallApi()) {
          var _time3 = new Date().getTime();
          var pageviewEvent = {};
          pageviewEvent.page = window.location.href;
          pageviewEvent.event_type = 'leave';
          pageviewEvent.event_name = 'page_close';
          pageviewEvent.args = JSON.stringify(getUrlParam(window.location.href));
          pageviewEvent.duration = this.getPageStartTime() ? Date.now() - this.getPageStartTime() : '';
          this.sendData(pageviewEvent);
          this.updatePreVisitTime(_time3);
        }
      }
    }, {
      key: "onEvent",
      value: function onEvent(map) {
        var _this2 = this;
        console.log('event....');
        var event = {};
        event.page = window.location.href;
        if (map) {
          for (var k in map) {
            if (k && map[k]) {
              event[k] = map[k];
            }
          }
        }
        if (this.preCallApi()) {
          var _time4 = new Date().getTime();
          this.sendData(event).then(function () {
            _this2.updatePreVisitTime(_time4);
          });
        }
      }
    }, {
      key: "completeFields",
      value: function completeFields(data) {
        var fields = {
          timestamp: new Date().toISOString(),
          page: window.location.href,
          device: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: navigator.userAgent,
          os: navigator.platform,
          referer: document.referer,
          sid: this.getSessionId(),
          refer: this.refer,
          dpi: window.devicePixelRatio,
          resolution: window.screen.availWidth + '*' + window.screen.availHeight,
          sdk_type: 'JS',
          sdk_version: '1.0.0'
        };
        return _objectSpread(_objectSpread({}, fields), data);
      }
    }, {
      key: "sendData",
      value: function sendData() {
        var _this3 = this;
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return new Promise(function (resolve, reject) {
          fetch(_this3.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(function (response) {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
          }).then(function (jsonResponse) {
            resolve(jsonResponse);
          })["catch"](function (error) {
            reject(error);
          });
        });
      }
    }, {
      key: "updatePreVisitTime",
      value: function updatePreVisitTime() {
        setCookie('preVisitTme', time, this.cookieMaxAge);
      }
    }, {
      key: "setPageStartTime",
      value: function setPageStartTime() {
        sessionStorage.setItem('pageStartTime', Date.now());
      }
    }, {
      key: "getPageStartTime",
      value: function getPageStartTime() {
        return sessionStorage.getItem('pageStartTime');
      }
    }, {
      key: "setRouteStack",
      value: function setRouteStack(value) {
        sessionStorage.setItem('routeStack', JSON.stringify(value));
      }
    }, {
      key: "getRouteStack",
      value: function getRouteStack() {
        var value = sessionStorage.getItem('routeStack');
        return value && JSON.parse(value);
      }
    }, {
      key: "startSession",
      value: function startSession() {
        if (this.getSessionId()) {
          if (this.isSessionTimeout()) {
            this.createNewSession();
          } else {
            this.updatePreVisitTime(new Date().getTime());
          }
        } else {
          this.createNewSession();
        }
      }
    }, {
      key: "generateId",
      value: function generateId() {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var tmpid = [];
        var r;
        tmpid[8] = tmpid[13] = tmpid[18] = tmpid[23] = '-';
        tmpid[14] = '4';
        for (var i = 0; i < 36; i++) {
          if (!tmpid[i]) {
            r = 0 | Math.random() * 16;
            tmpid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
          }
        }
        return tmpid.join('');
      }
    }, {
      key: "getSessionId",
      value: function getSessionId() {
        return getCookie('sessionId');
      }
    }, {
      key: "setSessionId",
      value: function setSessionId(sid) {
        if (sid) {
          setCookie('sessionId', sid, this.cookieMaxAge);
        }
      }
    }, {
      key: "createNewSession",
      value: function createNewSession() {
        var time = new Date().getTime();
        var sid = this.generateId();
        this.setSessionId(sid);
        this.updatePreVisitTime(time);
      }
    }, {
      key: "isSessionTimeout",
      value: function isSessionTimeout() {
        var time = new Date().getTime();
        var preTime = getCookie('preVisitTime');
        if (preTime) {
          return time - preTime > this.sessionTimeout * 1000;
        }
        return true;
      }
    }, {
      key: "preCallApi",
      value: function preCallApi() {
        if (this.isSessionTimeout()) {
          this.startSession();
        } else {
          this.updatePreVisitTime(new Date().getTime());
        }
        return true;
      }
    }]);
  }();
  function getUrlParam(url) {
    var list = (url || window.location.href).match(/[?&][^=]*=[^?&=]*/g) || [];
    return list.reduce(function (params, str) {
      var _str$slice$split = str.slice(1).split('='),
        _str$slice$split2 = _slicedToArray(_str$slice$split, 2),
        key = _str$slice$split2[0],
        value = _str$slice$split2[1];
      params[key] = value;
      return params;
    }, {});
  }
  function getCookie(name) {
    var cookieName = encodeURIComponent(name) + '=';
    var cookieStart = document.cookie.indexOf(cookieName);
    var cookieValue = null;
    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  }
  function setCookie(name, value, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires) {
      // set the expires time
      var expiresTime = new Date();
      expiresTime.setTime(expires);
      cookieText += ';expires=' + expiresTime.toGMTString();
    }
    if (path) {
      cookieText += ';path=' + path;
    }
    if (domain) {
      cookieText += ';domain=' + domain;
    }
    if (secure) {
      cookieText += ';secure';
    }
    document.cookie = cookieText;
  }

  // // 监听单页应用url hash变化
  // if (('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode == 8)) {
  //   window.onhashchange = onPageEnterAndLeave;
  // }

  // // 监听单页应用url history变化
  // window.addEventListener('replaceState', onPageEnterAndLeave);
  // window.addEventListener('pushState', onPageEnterAndLeave);

  // function onPageEnterAndLeave() {
  //   if (window.__TRACKER__) {
  //     window.__TRACKER__.onPageLeave();  // 页面离开
  //     window.__TRACKER__.onPageEnter();  // 页面进入
  //   }
  // }

  var pushStateEvent = new Event('pushState');
  var replaceStateEvent = new Event('replaceState');
  var customEvents = {
    pushState: pushStateEvent,
    replaceState: replaceStateEvent
  };

  // 重写history.pushState和history.replaceState方法
  history.pushState = writeHistory('pushState');
  history.replaceState = writeHistory('replaceState');

  // 重写history方法，为pushState和replaceState新增监听事件
  function writeHistory(type) {
    var originFn = history[type];
    return function () {
      originFn.apply(this, arguments);
      window.dispatchEvent(customEvents[type]); // 触发监听事件
    };
  }

  var TrackerGlobal = new Tracker();
  window.__TRACKER__ = {
    startSession: function startSession() {
      TrackerGlobal.startSession();
    },
    onPageClose: function onPageClose() {
      TrackerGlobal.onPageClose();
    },
    onPageEnter: function onPageEnter() {
      TrackerGlobal.onPageEnter();
    },
    onPageLeave: function onPageLeave() {
      TrackerGlobal.onPageLeave();
    },
    onEvent: function onEvent(map) {
      TrackerGlobal.onEvent(map);
    }
  };

  // 自动加载方法
  var autoLoad = function autoLoad() {
    window.__TRACKER__.startSession();
  };
  autoLoad(); // 初始化

  // 监听页面关闭
  window.onbeforeunload = function () {
    window.__TRACKER__.onPageClose();
  };

  return Tracker;

})));


// 页面进入事件
// 页面退出事件
// 页面停留时长
// 点击事件
// 曝光事件

class Tracker {

  constructor(options = {}) {
    // this.endpoint = options.endpoint || 'https://tb8j240eza.execute-api.ap-northeast-2.amazonaws.com/test';
    // this.endpoint = options.endpoint || 'https://vf7vx6k4t2.execute-api.ap-northeast-2.amazonaws.com/test';
    this.endpoint = options.endpoint || 'https://vf7vx6k4t2.execute-api.ap-northeast-2.amazonaws.com/prod';
    this.version = options.version || '1.0.0';
    this.sessionTimeout = options.sessionTimeout || 360;
    this.cookieMaxAge = options.cookieMaxAge || 7 * 24 * 60 * 60 // default: cookie过期时间7天
    this.refer = '';
    this.userId = options.userId || '';
    this.deviceId = options.deviceId || '';
    this.lang = options.lang || navigator.language || '';
    this.country = options.country || '';
    this.init();
  }

  init() {
    window.addEventListener('pushState', () => this.onPageEnterAndLeave('pushState'));
    window.addEventListener('popstate', () => this.onPageEnterAndLeave('popstate'));
    // window.addEventListener('pageshow', () => this.onPageEnterAndLeave('pageshow'));
    // window.addEventListener('replaceState', () => this.onPageEnterAndLeave('replaceState'));

    window.onbeforeunload = () => {
      this.onPageClose();
    }

    this.startSession();
    this.onPageEnter();
  }

  onPageEnterAndLeave(eventName) {
    const routeStack = this.getRouteStack() || [];
    const len = routeStack.length;

    // console.log(routeStack)

    if (eventName === 'replaceState') {
      // 路由堆栈不存在(首次触发)或者堆栈最新的路由和当前路由相同，不触发任何日志操作
      if (!routeStack[len-1] || routeStack[len-1] === window.location.href) {
        console.info('tracker: eventName --> replaceState fix 无需埋点')
        return
      }
    }

    this.onPageLeave();
    this.onPageEnter();

    if (len > 5) {
      routeStack.shift();
    }

    routeStack.push(window.location.href);
    this.setRouteStack(routeStack);
  }

  onPageEnter() {
    const routeStack = this.getRouteStack() || [];
    const len = routeStack.length;

    if (len) {
      this.refer = routeStack[len - 1];
    } else {
      this.refer = '';
    }

    if (this.preCallApi()) {
      const time = new Date().getTime();
      const pageviewEvent = {};
      pageviewEvent.page = window.location.href
      pageviewEvent.event_type = 'enter';
      pageviewEvent.event_name = 'page_enter';
      pageviewEvent.params = JSON.stringify(getUrlParam(window.location.href));
      this.setPageStartTime();
      this.sendData(pageviewEvent);
      this.updatePreVisitTime(time);
    }
  }

  onPageLeave() {
    const routeStack = this.getRouteStack() || [];
    const len = routeStack.length;

    if (!len) {
      return;
    }

    this.refer = routeStack[len - 2];

    

    if (this.preCallApi()) {
      const time = new Date().getTime()
      const pageviewEvent = {};
      pageviewEvent.page = routeStack[len - 1];
      pageviewEvent.event_type = 'leave'
      pageviewEvent.event_name = 'page_leave';
      pageviewEvent.params = JSON.stringify({
        ...getUrlParam(pageviewEvent.page),
          duration:this.getPageStartTime() ? Date.now() - this.getPageStartTime() : ''
      });
      this.sendData(pageviewEvent);
      this.updatePreVisitTime(time);
    }
  }

  onPageClose() {
    if (this.preCallApi()) {
      const time = new Date().getTime()
      const pageviewEvent = {};
      pageviewEvent.page = window.location.href;
      pageviewEvent.event_type = 'leave'
      pageviewEvent.event_name = 'page_close';
      pageviewEvent.args = JSON.stringify(getUrlParam(window.location.href));
      pageviewEvent.params = {
        duration:this.getPageStartTime() ? Date.now() - this.getPageStartTime() : ''
      }
      this.sendData(pageviewEvent);
      this.updatePreVisitTime(time);
    }
  }

  onEvent(map) {
    const event = {};
    event.page = window.location.href;
    if (map) {
      for (const k in map) {
        if (k && map[k]) {
          event[k] = map[k]
        }
      }
    }

    if (this.preCallApi()) {
      const time = new Date().getTime();
      this.sendData(event)
        .then(() => {
          this.updatePreVisitTime(time);
        })
    }
  }

  completeFields(data) {
    const fields = {
      timestamp: new Date().toISOString(),
      page: window.location.href,
      device: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      browser: navigator.userAgent,
      os: navigator.platform,
      referer: document.referer || '',
      session_id: this.getSessionId(),
      user_id: this.userId,
      deviceid: this.deviceId,
      refer: this.refer,
      dpi: window.devicePixelRatio,
      resolution: window.screen.availWidth + '*' + window.screen.availHeight,
      sdk_type: 'JS',
      sdk_version: '1.0.0'
    }

    return {
      ...fields,
      ...data,
    }
  }

  sendData(data = {}) {
    return new Promise((resolve, reject) => {
      const fields = this.completeFields(data);
      const reqBody = {
        content: JSON.stringify(fields)
      }

      fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .then(jsonResponse => {
        resolve(jsonResponse)
      })
      .catch(error => {
        reject(error)
      })
    })
  }

  updatePreVisitTime(time) {
    setCookie('preVisitTme', time, this.cookieMaxAge);
  }

  setPageStartTime() {
    sessionStorage.setItem('pageStartTime', Date.now());
  }

  getPageStartTime() {
    return sessionStorage.getItem('pageStartTime');
  }

  setRouteStack(value) {
    sessionStorage.setItem('routeStack', JSON.stringify(value));
  }

  getRouteStack() {
    const value = sessionStorage.getItem('routeStack');
    return value && JSON.parse(value);
  }

  setPageStartTime() {
    sessionStorage.setItem('pageStartTime', Date.now())
  }

  getPageStartTime() {
    return sessionStorage.getItem('pageStartTime')
  }


  startSession() {
    if (this.getSessionId()) {
      if (this.isSessionTimeout()) {
        this.createNewSession()
      } else {
        this.updatePreVisitTime(new Date().getTime())
      }
    } else {
      this.createNewSession()
    }
  }

  generateId() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const tmpid = []
    let r
    tmpid[8] = tmpid[13] = tmpid[18] = tmpid[23] = '-'
    tmpid[14] = '4'

    for (let i = 0; i < 36; i++) {
      if (!tmpid[i]) {
        r = 0 | Math.random() * 16
        tmpid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
    return tmpid.join('')
  }

  getSessionId() {
    return getCookie('sessionId');
  }

  setSessionId(sid) {
    if (sid) {
      setCookie('sessionId', sid, this.cookieMaxAge);
    }
  }

  getUserId() {
    return this.userId;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  getDeviceId() {
    return this.deviceId;
  }

  setDeviceId(deviceId) {
    this.deviceId = deviceId;
  }

  createNewSession() {
    const time = new Date().getTime();
    const sid = this.generateId();
    this.setSessionId(sid);
    this.updatePreVisitTime(time)
  }

  isSessionTimeout() {
    const time = new Date().getTime();
    const preTime = getCookie('preVisitTime');
    if (preTime) {
      return time - preTime > this.sessionTimeout * 1000
    }
    return true;
  }

  preCallApi() {
    if (this.isSessionTimeout()) {
      this.startSession();
    } else {
      this.updatePreVisitTime(new Date().getTime())
    }

    return true;
  }

}

function getUrlParam(url) {
  const list = (url || window.location.href).match(/[?&][^=]*=[^?&=]*/g) || []
  return list.reduce((params, str) => {
    let [key, value] = str.slice(1).split('=')
    params[key] = value
    return params
  }, {})
}
// 设置cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

// 获取cookie
function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(';');
  for(var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == ' ') {
          cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) == 0) {
          return cookie.substring(nameEQ.length, cookie.length);
      }
  }
  return null;
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

const pushStateEvent = new Event('pushState');
const replaceStateEvent = new Event('replaceState');
const customEvents = {
  pushState: pushStateEvent,
  replaceState: replaceStateEvent,
};

// 重写history.pushState和history.replaceState方法
history.pushState = writeHistory('pushState');
history.replaceState = writeHistory('replaceState');

// 重写history方法，为pushState和replaceState新增监听事件
function writeHistory(type) {
  const originFn = history[type];
  return function() {
    originFn.apply(this, arguments);
    window.dispatchEvent(customEvents[type]);  // 触发监听事件
  };
}


export default Tracker;
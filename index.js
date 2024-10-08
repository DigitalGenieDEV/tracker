

import Tracker from './lib/track'


const TrackerGlobal = new Tracker();

window.__TRACKER__ = {
  startSession() {
    TrackerGlobal.startSession();
  },
  onPageClose() {
    TrackerGlobal.onPageClose();
  },
  onPageEnter() {
    TrackerGlobal.onPageEnter();
  },
  onPageLeave() {
    TrackerGlobal.onPageLeave();
  },
  onEvent(map) {
    TrackerGlobal.onEvent(map);
  },
};

  // 自动加载方法
  const autoLoad = function() {
    window.__TRACKER__.startSession();
  };

  autoLoad(); // 初始化

   // 监听单页应用url hash变化
  if (('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode == 8)) {
    window.onhashchange = onPageEnterAndLeave;
  }

  function onPageEnterAndLeave() {
    if (window.__TRACKER__) {
      // window.__TRACKER__.onPageLeave();  // 页面离开
      // window.__TRACKER__.onPageEnter();  // 页面进入
    }
  }

   // 监听页面关闭
   window.onbeforeunload = function() {
    window.__TRACKER__.onPageClose();
  };

export default Tracker
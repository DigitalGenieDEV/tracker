

import globalTracker from './global_tracker'


window.__TRACKER__ = {
  startSession() {
    globalTracker.startSession();
  },
  onPageClose() {
    globalTracker.onPageClose();
  },
  onPageEnter() {
    globalTracker.onPageEnter();
  },
  onPageLeave() {
    globalTracker.onPageLeave();
  },
  onEvent(map) {
    globalTracker.onEvent(map);
  },
};

  // // 自动加载方法
  // const autoLoad = function() {
  //   window.__TRACKER__.startSession();
  // };

  // autoLoad(); // 初始化

  // //  // 监听单页应用url hash变化
  // // if (('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode == 8)) {
  // //   window.onhashchange = onPageEnterAndLeave;
  // // }

  // // function onPageEnterAndLeave() {
  // //   if (window.__TRACKER__) {
  // //     window.__TRACKER__.onPageLeave();  // 页面离开
  // //     window.__TRACKER__.onPageEnter();  // 页面进入
  // //   }
  // // }

  //  // 监听页面关闭
  //  window.onbeforeunload = function() {
  //   window.__TRACKER__.onPageClose();
  // };

export default globalTracker
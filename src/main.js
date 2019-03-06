// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import './plugins/fastClick'
import  '@/Util'
import store from './store'

import './directives' // 指令

FastClick.attach(document.body)

// 获取第一条待办
Vue.prototype.$getTodoNext = function (path, action) {
  let url = window.apiBasePath + '/app/perf/step/needList',
      param = {
        type: 1, // 1待办 2 已处理
        pageNo: 1,
        pageSize: 5
      };
  return this.$Ajax({url, param}).then((res)=>{
    if(!res || !res.data.needList) return;
    if (res.data.needList.length > 0) {
      this.$toDetail(res.data.needList[0]);
    }
    return Promise.resolve(res.data.needList)
    // this.toDetail(res.data.needList[0], path, action);
  }).catch( (err) => {
      console.log(err, "getTodoNext");
  });
};
Vue.prototype.$toDetail = function(item){
  let processId = item.checkRsId,
      userId = item.avatarUserId,
      clickType = item.clickType,
      newsId = item.id,
      queryId = `${item.checkType}-${item.checkYear}-${item.checkTime}`;
  if(clickType === 'CHECK_TASK' || clickType === 'CHECK') { // CHECK_TASK 评分 CHECK目标确认  
    this.$router.replace({
      path: '/evaluate',
      query: {
        processId,
        userId,
        newsId
      }
    })
  } else if (clickType === 'MAKE') {
    this.$router.replace({
      path: '/detail',
      query: {
          processId,
          userId
      }
    });
  } else if (clickType === 'CHECK_RESULT') {
    this.$router.replace({
      path: '/inputResult',
      query: {
        queryId,
        userId
      }
    });
  }
},

// 后端接口前缀
window.apiBasePath = '/alid';
if(location.href.indexOf('localhost:')>-1 || location.href.indexOf('vaiwan.com')>-1){ // 本地
  window.apiBasePath = '/alid';
  window.localDevelop = true;
}
if(location.href.indexOf('/y/mb/index.html')>-1){ // 岳峰
  window.apiBasePath = '/alid/y';
  window.localDevelop = true;
}
if(location.href.indexOf('/h/mb/index.html')>-1){ // 大侠
  window.apiBasePath = '/alid/h';
  window.localDevelop = true;
}

Vue.config.productionTip = false  // false 开发环境

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

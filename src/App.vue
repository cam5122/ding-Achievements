<template>
  <div id="app" v-if="isLogin">
 <!--    <transition :name="transitionName"> -->
     <!-- 实现路由的 -->
  <keep-alive :include="needCache">
    <router-view></router-view>
  </keep-alive>
<!--     </transition> -->
    <div class="footerbar-wrapper" v-if="!isCommonPerson && (this.$route.path==='/my' || this.$route.path==='/workStation' || this.$route.path==='/report')">
      <footer-bar></footer-bar>
    </div>
  </div>
</template>

<script>
  import * as dd from 'dingtalk-jsapi'
  import authLogin from './authLogin' //引入鉴权文件
  import footerBar from '@/components/FooterBar';
  import buryData from "@/utils/bury";
/**
 * userAtuth：Array
 * 1 普通员工
 * 2 钉钉主管理员
 * 3 绩效主管理员
 * 4 绩效子管理员
 * 5 主管
 * 6 考评组负责人
 * ------权限--------------
 * 我的绩效 1 2 3 4 5 6
 * 团队绩效 3 4 5
 * 绩效报表 3 4 5
 * 设置  2 3 4 6 ---> 指标库 3 4
 *                   发起奇效考核 3 4
 *                   基础设置 3 4
 *                   考评组 3 4 6
 *                   权限设置 2 3 4
 */
export default {
  name: "app",
  data() {
    return {
      transitionName: "fade",
      isLogin: false,
      isCommonPerson: false,
      needCache: ["workStation", "my", "report"]
    };
  },
  components: {
    footerBar
  },
  beforeMount() {
    let isDev = location.host.indexOf('test.dingteam.com');
    window.corpId = this.$getUrlParam("corpid");
    window.suiteId = isDev>-1?'1326002':'1489001';
    window.appId = isDev>-1?'3425':'3769';

    buryData.buryData.suiteId = window.suiteId;
    buryData.buryData.corpId = window.corpId;

    if (window.localDevelop) {
      let userId = this.$getUrlParam("userId") || "0130282665899693"; // 要模拟的用户id 03041931481048783 大侠  2006541419786821 南轲 020654045323792 灰 07252830646328 云天 1531525443754620 小巫 0238561852684220 刘翔 0130282665899693 洛萨
      let corpId = window.corpId = "ding2585e7fd381d17fe";
      let url = "/alid/app/personnel/mock/login?userId=" + userId + "&corpId=" + corpId;
      this.$Ajax({ url }).then(res => {
        this.getUserAuth().then( res =>{
          this.isLogin = true;
        }).catch(err =>{
          console.log(err);
        });
      });
    } else {
      if(!window.corpId){
        this.$Alert({
          tit: '登录失败',
          text: '链接缺少corpid参数',
          succ: ()=>{
            dd.biz.navigation.close();
          }
        });
        return;
      }
      // jsapi鉴权并免登
      authLogin({
        corpid: window.corpId,
        suiteid: window.suiteId,
        appid: window.appId,
      }).then(res => {
        console.log('免登成功');
        if (
            navigator.userAgent.indexOf("iPhone") > -1 ||
            navigator.userAgent.indexOf("iPad") > -1
        ) {
            dd.ui.pullToRefresh.disable();
            dd.ui.webViewBounce.disable();
            this.resetBottomButtonStyle();
        }
        this.getUserAuth()
      },err => {
        console.log('免登失败');
      })
    }
    this.setHelp();
    this.$router.afterEach((to, from) => {
      if (to.name == 'Help') {
        this.cleanHelp();
        return;
      }
      this.setHelp();
    });
  },
  watch: {
    $route(to, from) {
      let title = this.$route.query.title || (to.meta && to.meta.title ? to.meta.title : "智能绩效");
      this.$setTitle(title);
      if (from == null) return;
      if (from.path == '/welcome') { // 欢迎页面，特殊处理
        this.transitionName = "slide-left";
        return
      };
      const toDepth = this.getIndex(to);
      const fromDepth = this.getIndex(from);
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    },
  },
  methods: {
    // 发起审批
    openURL(processCode) {
      let url ="https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?dd_share=false&showmenu=true&back=native&swfrom=&corpid=" + window.corpId +"&processCode=" +processCode +"#/custom";
      this.$openLink(url);
    },
    // 获取待办数量
    getTodoCount() {
      let url = window.apiBasePath + '/app/perf/step/needCount'
      return this.$Ajax({
        url,
        hideLoad: true
      }).then((res) => {
        if (!res) return
        this.$store.commit('setState', {
          todoCount: res.data || {}
        })
      }).catch( (err) => {
        console.log(err, "needCount");
      });
    },
    // 获取权限信息
    getUserAuth() {
      let url = window.apiBasePath + "/app/perf/org/userAuth";
      return this.$Ajax({ url }).then(res => {
        this.isLogin = true;
        if (!res) return;
        // res.data.userAuth = [1];
        // res.data.corpAuth = false;
        buryData.buryData.userId = res.data.userId;
        buryData.buryData.userName = res.data.userName;
        buryData.buryData.corpName = res.data.corpName;
        buryData.buryData.cookie = this.$getCookie("LWEQYTOKEN");

        res.data.userAuth = res.data.userAuth || [1];
        this.$store.commit("setState", {
          userAuthData: res.data || {}
        });
        this.getTodoCount();
        if (!res.data.userAuth || (res.data.userAuth.includes(1) && res.data.userAuth.length === 1)) {
          this.isCommonPerson = true;
          this.$store.commit("setState", {
            isCommonPerson: true
          });
          // console.log(this.$getUrlParam("isNotice"));
          if (!this.$getUrlParam("isNotice")) {
            this.$router.replace({path: '/my'});
            return;
          }
        }
        let processId = this.$getUrlParam("processId") || '';
        if(processId){
          this.$router.push({
            path: '/detail',
            query: {processId}
          });
          return;
        }
        if(res.data.isFirstLogin){ // 第一次进，显示欢迎页
        // if(res.data.userAuth === 3 && res.data.isFirstLogin){ // 管理员第一次进，显示欢迎页
          this.$router.replace('/welcome');
        }
      }, err => {this.isLogin = true});
    },
    getIndex(route) {
      let routes = this.$router.options.routes;
      let len = routes.length;
      for (let i = 0; i < len; i++) {
        if (routes[i].name == route.name) {
          return i;
        }
      }
      return 100000;
    },
    cleanHelp() {
      if (!dd)
        return;
        // 帮助
        console.log('----设置帮助---')
        dd.biz.navigation.setRight({
            show: false,//控制按钮显示， true 显示， false 隐藏， 默认true
            control: false,//是否控制点击事件，true 控制，false 不控制， 默认false
            text: '',//控制显示文本，空字符串表示显示默认文本
            onSuccess : (result) => {
            },
            onFail : function(err) {}
        });
    },
    setHelp() {
      if (!dd)
        return;
      // 帮助
      console.log('----设置帮助---')
      dd.biz.navigation.setRight({
          show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
          control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          text: '帮助',//控制显示文本，空字符串表示显示默认文本
          onSuccess : (result) => {
              this.$router.push('/help')
          },
          onFail : function(err) {}
      });
    },
    loadStyleCode: function (code) {
        if (!code) {
            return;
        }
        let style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(code));
        document.querySelector('head').appendChild(style);
    },

    /**
     * 底部按钮，在键盘弹出时隐藏
     * iphone 6:中文:258*375，英文：216*375
     * iphone 6 plus:英文：226*414，中文：271*414
     * iphone 5:216*320
     */
    resetBottomButtonStyle: function () {
        const height = window.screen.availHeight || window.screen.height;
        // 键盘高度以300px计算
        const KEYBOARD_HEIGHT = 300;
        const maxAvailHeight = height - KEYBOARD_HEIGHT;
        maxAvailHeight > 0 && this.loadStyleCode(`@media only screen and (max-height: ${maxAvailHeight}px){#footer-btn{display:none}}`)
    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "./less/reset.less";
@import "./less/comm.less";
body {
  font-family: "PingFangSC","Helvetica Neue", Helvetica, STHeiTi, sans-serif;
  background-color: #F4F4F4;
}
#app /deep/ .weui-cells {
    margin-top: 0;
}
// #app {
//   position: fixed;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   right: 0;
// }
</style>

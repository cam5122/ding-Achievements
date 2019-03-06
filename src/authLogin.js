/*
  调用方式：

  import authLogin from 'xxxx/authLogin'

  authLogin({
    signatureApi: xxxx, // 签名接口[GET]，默认 '/alid/getJsapiSignature'
    loginApi: xxxx, // 免登接口[GET]，默认 '/alid/oauth2'
    corpid: xxxxx, // 企业自用应用，签名接口不需要此字段，但免登接口需要，此处不传的话，可以通过签名接口返回
    suiteid: xxxxx, // 企业自用应用不需要传此字段
    appid: xxxxx, // 企业自用应用不需要传此字段
  }).then(res => {
    // 免登成功操作
  },err => {
    // 免登失败操作
  })

*/

import * as dd from 'dingtalk-jsapi'
import axios from "axios"

let corpIdCache = ''; // 不传corpid的话，通过signatureApi接口获取保存起来，给免登接口用

const jsApiList = [ // 所有需要使用到的jsapi在这里注册。
  "device.notification.prompt",
  "device.notification.actionSheet",
  "runtime.permission.requestOperateAuthCode",
  "biz.navigation.quit",
  "biz.util.openModal",
  "biz.util.openSlidePanel",
  "biz.util.downloadFile",
  "biz.util.openLocalFile",
  "biz.util.isLocalFileExist",
  "biz.util.ut",
  "biz.customContact.choose",
  "biz.customContact.multipleChoose",
  "runtime.permission.requestAuthCode",
  "service.request.httpOverLwp",
  "device.notification.alert",
  "device.notification.showPreloader",
  "device.notification.hidePreloader",
  "device.notification.confirm",
  "device.notification.toast",
  "biz.util.datepicker",
  "biz.util.timepicker",
  "biz.util.datetimepicker",
  "biz.ding.post",
  "biz.telephone.call",
  "biz.user.get",
  "biz.contact.choose",
  "biz.contact.createGroup",
  "biz.contact.complexChoose",
  "biz.contact.complexPicker",
  "biz.contact.departmentsPicker",
  "biz.contact.externalComplexPicker",
  "biz.util.chosen",
  "biz.util.openLink",
  "biz.util.open",
  "biz.util.uploadImage",
  "biz.util.previewImage",
  "biz.util.share",
  "biz.navigation.back",
  "biz.navigation.setTitle",
  "biz.navigation.setLeft",
  "biz.navigation.setRight",
  "biz.navigation.close",
  "biz.chat.pickConversation",
  "biz.chat.chooseConversation",
  "biz.chat.toConversation",
  "biz.clipboardData.setData",
  "biz.chat.chooseConversationByCorpId",
  "biz.navigation.setIcon",
  "biz.util.scan",
  "biz.chat.openSingleChat",
  "ui.progressBar.setColors",
  "ui.pullToRefresh.disable",
  "ui.webViewBounce.disable",
  "ui.input.plain",
]

// jsapi鉴权
function jsapiConfig({corpid, suiteid, appid, signatureApi = '/alid/getJsapiSignature', ...options}) {
  return new Promise((resolve, rejects) => {
    let url = window.location.href;
    if (url.indexOf("#/") > -1) {
      url = url.substr(0, url.indexOf("#/"));
    }
    let params = {url}
    if(corpid) params.corpid = corpid;
    if(suiteid) params.suiteid = suiteid;
    if(appid) params.appid = appid;
    
    axios({ url: signatureApi, params: params }).then(res => {
      const data = res.data || {};
      corpIdCache = corpid || data.corpId; // 如果未传入corpid的话，就从这里拿
      
      dd.config({
        agentId: data.agentId,
        corpId: corpIdCache,
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: jsApiList
      });

      resolve();

      dd.error(err => {
        let str = JSON.stringify(err);
        console.log(str);
        rejects(str);
      });

    }, err => {
      const str = signatureApi + '接口请求失败';
      console.log(str);
      rejects(str);
    });
  });
}

// 免登
function login({corpid, suiteid, loginApi = '/alid/oauth2', ...options}) {  
  return new Promise((resolve, rejects) => {
    dd.runtime.permission.requestAuthCode({
      corpId: corpid || corpIdCache,
      onSuccess: res => {
        let params = {};
        params.corpid = corpid || corpIdCache;
        params.code = res.code;
        if(suiteid) params.suiteid = suiteid;

        axios({ url: loginApi, params: params }).then(result => {
          if (result.data) {
            resolve(result.data);
            return;
          }
          const str = loginApi + '接口返回数据有误：' + JSON.stringify(result.data);
          console.log(str);
          rejects(str);
        }, err => {
          const str = loginApi + '接口请求失败';
          console.log(str);
          rejects(str);
        });
      },
      onFail: err => {
        let str = "requestAuthCode失败：" + JSON.stringify(err);
        console.log(str);
        rejects(str);
      }
    });
  });  
}

// 获取cookie
function getCookie (name) {
  var arr = [];
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

  if (arr = document.cookie.match(reg)) {
      return (arr[2]);
  } else {
      return null;
  }
}

// base64解码
function base64_decode (str) {
  var c1, c2, c3, c4;
  var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
      58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
      7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
      37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
  ];
  var i = 0,
      len = str.length,
      string = '';

  while (i < len) {
      do {
          c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      } while (
          i < len && c1 == -1
      );

      if (c1 == -1) break;

      do {
          c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      } while (
          i < len && c2 == -1
      );

      if (c2 == -1) break;

      string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

      do {
          c3 = str.charCodeAt(i++) & 0xff;
          if (c3 == 61)
              return string;

          c3 = base64DecodeChars[c3]
      } while (
          i < len && c3 == -1
      );

      if (c3 == -1) break;

      string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

      do {
          c4 = str.charCodeAt(i++) & 0xff;
          if (c4 == 61) return string;
          c4 = base64DecodeChars[c4]
      } while (
          i < len && c4 == -1
      );

      if (c4 == -1) break;

      string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
  }
  return string;
}

// 获取cookie的token值
function getToken (name) {
  var token = getCookie(name);

  if (!token || token == '' || typeof token == 'undefined') {
      return false;
  }

  token = base64_decode(token);

  token = token.substring(0, token.length - 20);

  token = token.substring(20);

  token = JSON.parse(token);

  return token;
}

function ddAlert(text, title) {
  dd.device.notification.alert({
    message: text || '',
    title: title || '',//可传空
    buttonName: '确定',
    onSuccess : function() {},
    onFail : function(err) {
      window.alert(text);
    }
  });
}

export default function authLogin(options) {
  return new Promise((resolve, rejects) => {
    jsapiConfig(options).then(() => {
      let cookieObj = getToken("LWEQYTOKEN");
      if (cookieObj && cookieObj.c && cookieObj.c == options.corpid) {
        console.log("有效cookie，不需要调API免登");
        resolve();
        return;
      }
      console.log("木有cookie，需要调API免登");
      login(options).then(() => {
        resolve();
      }, err => {
        ddAlert(err, '免登失败');
        rejects();
      });
    }, err => {
      ddAlert(err, '签名失败');
      rejects();
    });
  });
}

//
//
//                                  _oo8oo_
//                                 o8888888o
//                                 88" . "88
//                                 (| -_- |)
//                                 0\  =  /0
//                               ___/'==='\___
//                             .' \\|     |// '.
//                            / \\|||  :  |||// \
//                           / _||||| -:- |||||_ \
//                          |   | \\\  -  /// |   |
//                          | \_|  ''\---/''  |_/ |
//                          \  .-\__  '-'  __/-.  /
//                        ___'. .'  /--.--\  '. .'___
//                     ."" '<  '.___\_<|>_/___.'  >' "".
//                    | | :  `- \`.:`\ _ /`:.`/ -`  : | |
//                    \  \ `-.   \_ __\ /__ _/   .-` /  /
//                =====`-.____`.___ \_____/ ___.`____.-`=====
//                                  `=---=`
//
//
//               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//                         佛祖保佑          永无bug
//

import Vue from 'vue'
import axios from 'axios'
import * as dd from 'dingtalk-jsapi'
import { ToastPlugin, LoadingPlugin } from 'vux'

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

axios.defaults.timeout = 50000; //设置默认超时
axios.defaults.headers = { //设置默认请求头
  'X-Requested-With': 'XMLHttpRequest'
}

// axios.interceptors.request.use((res) => {
//     // 对数据请求做点什么
//     return res
// }),(err) => {

// }
// 添加响应拦截器
axios.interceptors.response.use( (response) => {
    // 对响应数据做点什么
     return response;
    }, (error) => {
        // 对响应错误做点什么
        if (error && error.response) {
            switch (error.response.status) {
            case 400:
                error.message = '错误请求'
                break;
            case 401:
                error.message = '未授权，请重新登录'
                break;
            case 403:
                error.message = '拒绝访问'
                break;
            case 404:
                error.message = '请求错误,未找到该资源'
                break;
            case 405:
                error.message = '请求方法未允许'
                break;
            case 408:
                error.message = '请求超时'
                break;
            case 500:
                error.message = '服务器端出错'
                break;
            case 501:
                error.message = '网络未实现'
                break;
            case 502:
                error.message = '网络错误'
                break;
            case 503:
                error.message = '服务不可用'
                break;
            case 504:
                error.message = '网络超时'
                break;
            case 505:
                error.message = 'http版本不支持该请求'
                break;
            default:
                error.message = `连接错误${error.response.status}`
            }
        } else {
            error.message = "连接到服务器失败"
        }
        return Promise.reject(error);
    }
);

Date.prototype.Format = function(fmt) {
    var uConfig = {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六'
    };
    var o = {
        'M+': this.getMonth() + 1, // 月份
        'u+': uConfig[this.getDay()], // 星期
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds()
            // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    return fmt;
}

// 二次封装Axios
Vue.prototype.$Ajax = function(options) {
    if(!options.hideLoad){
        var loadtimer = setTimeout(()=>{ // 350ms内完成则不显示loading
            this.$showLoading(options.loadText || '');
        },350);
    }
    let obj = {};
    if(typeof options === 'string'){ // 传字符串则为url
        obj.url = options;
    }else{
        obj = options;
    }
    if (obj.url.indexOf('?') > -1) {
        obj.url = obj.url + '&_nocache=' + new Date().getTime();
    } else {
        obj.url = obj.url + '?_nocache=' + new Date().getTime();
    }
    return  axios({
        method: obj.type || 'get',
        url:  obj.url || '',
        params: obj.param || null,
        data: obj.data || null
    }).then((response)=>{
        this.$hideLoading();
        if(loadtimer) clearTimeout(loadtimer);
        if(obj.noCheckData){ // 不需要数据校验
            return response.data;
        }else if(this.$ajaxCallBack(response.data)){
            return response.data;
        }else{
            return false;
        }
    },(error) => {
        this.$hideLoading();
        if(loadtimer) clearTimeout(loadtimer);
        this.$Toast(error.message);
    });
}
// 通用ajax判断
Vue.prototype.$ajaxCallBack = function (res) {
    let result=res;
    let str=JSON.stringify(res);
    if(str.indexOf('JSONP_')>-1){//匹配跨域接口去除字段JSONP
        const regex1 = /\((.+?)\)/g;
        result=JSON.parse(res.match(regex1).toString().replace('(','').replace(')',''));
    }

    if (typeof result === 'undefined') {
        this.$Toast('集合返回失败');
        return false;
    }

    if (parseInt(result.auth) === 0) {
        this.$Toast('登录已经失效, auth=0',false,3000);
        return false;
    }

    if (typeof result.errcode === 'undefined') {
        this.$Toast('未返回errcode');
        return false;
    }

    if (result.errcode !== 0) {
        this.$Toast(result.data || result.errmsg || '未返回errmsg');
        return false;
    }

    if (typeof result.data === 'undefined') {
        this.$Toast('data未返回');
        return false;
    }
    return true;
}

// 二次封装VUX弹窗组件
// Alert
Vue.prototype.$Alert = function (textObj, tit, succ){
    let option = {};
    if (typeof textObj === 'string') {
        option.text = textObj;
        option.tit = tit;
        option.succ = succ;
    } else {
        option = textObj || {};
    }


    dd.device.notification.alert({
        message: option.text || '成功',
        title: option.tit || '',
        buttonName: option.buttonName || "知道了",
        onSuccess: function () {
            option.succ && option.succ();
        },
        onFail: function (err) { }
    });

    // this.$vux.alert.show({
    //     title: option.tit || '',
    //     content: option.text || '成功',
    //     buttonText: option.buttonName || "知道了",
    //     onHide() {
    //         option.succ && option.succ();
    //     }
    // });
}
// Comfirm
Vue.prototype.$Confirm = function(obj){
    var obj = obj || {};

    dd.device.notification.confirm({
        message: obj.text || '',
        title: obj.title || '',
        buttonLabels: [obj.cancelText || '取消', obj.confirmText || '确定'],
        onSuccess: function (result) {
            //onSuccess将在点击button之后回调
            /*
            {
                buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
            }
            */
            if (result.buttonIndex === 0 && obj.fail) obj.fail();
            if (result.buttonIndex === 1 && obj.succ) obj.succ();
        },
        onFail: function (err) { }
    });

    // this.$vux.confirm.show({
    //     title: obj.title || '',
    //     content: obj.text || '',
    //     confirmText: obj.confirmText || '确定',
    //     cancelText: obj.cancelText || '取消',
    //     onCancel () {
    //         if(obj.fail){obj.fail()}
    //     },
    //     onConfirm () {
    //         if(obj.succ){obj.succ()}
    //     }
    // });
}
// Toast
Vue.prototype.$Toast = function(text,icon,time){
    this.$vux.toast.show({
        text: text || '系统繁忙',
        type: icon===true?'success':icon===false?'cancel':'text',
        time: time || 2500
    });
}
// ShowLoading
Vue.prototype.$showLoading = function(text){
    this.$vux.loading.show({
        text: text || '加载中'
    });
}
// HideLoading
Vue.prototype.$hideLoading = function(){
    this.$vux.loading.hide();
}


// 钉钉 JS_API
// 获取用户信息
Vue.prototype.$getUser = function(succ,fail){

    dd.biz.user.get({
        onSuccess: function (info) {
            if(succ){succ(info)}
        },
        onFail: function (err) {
            if(succ){fail(err)}
        }
    });
}
// 设置标题
Vue.prototype.$setTitle = function(txt){
    dd.biz.navigation.setTitle({
        title: txt || '', //控制显示文本，空字符串表示显示默认文本或icon
        onSuccess: () => {},
        onFail: (err) => {}
    });
}
// 设置右上角按钮
Vue.prototype.$setRight = function(succ, txt, isshow, iscontrol){

    dd.biz.navigation.setRight({
        show: isshow || false, //控制按钮显示， true 显示， false 隐藏， 默认true
        control: iscontrol || false, //是否控制点击事件，true 控制，false 不控制， 默认false
        text: txt || '更多', //控制显示文本，空字符串表示显示默认文本或icon
        onSuccess: () => {
            if(succ){succ();}
        },
        onFail: (err) => {}
    });

}
// 下拉单选
Vue.prototype.$chosen = function(options,key,succ){

    dd.biz.util.chosen({
        source: options,
        selectedKey:key, // 默认选中的key
        onSuccess : function(result) {
            if(succ){
                succ(result);
            }
        //onSuccess将在点击完成之后回调
            /*
            {
                key: '选项2',
                value: '234'
            }
            */
        },
        onFail : function(err) {}
    })
}
// 日期
Vue.prototype.$datepicker= function(date,format,succ) {

    dd.biz.util.datepicker({
        format: format || 'yyyy-MM-dd',
        value: date||'', //默认显示日期
        onSuccess: (result) => {
            if(succ){
                succ(result.value);
            }
            //onSuccess将在点击完成之后回调
            /*{
                value: "2015-02-10"
            }
            */
        },
        onFail: (err) => {}
    });
}
// 时间
Vue.prototype.$timepicker= function(time,succ) {

    dd.biz.util.timepicker({
        format: 'HH:mm',
        value: time||'', //默认显示时间
        onSuccess : (result) => {
            if(succ){
                succ(result.value);
            }
            //onSuccess将在点击完成之后回调
            /*{
                value: "10:00"
            }
            */
        },
        onFail : function(err) {}
    })

}
// 日期时间
Vue.prototype.$datetimepicker= function(datetime,succ) {

    dd.biz.util.datetimepicker({
        format: 'yyyy-MM-dd HH:mm',
        value: datetime||'', //默认显示
        onSuccess : function(result) {
            if(succ){
                succ(result.value);
            }
            //onSuccess将在点击完成之后回调
            /*{
                value: "2015-06-10 09:50"
            }
            */
        },
        onFail : function(err) {}
    })

}

// 打开应用内页面
Vue.prototype.$openLink= function(url) {

    dd.biz.util.openLink({
        url: url,//要打开链接的地址
        onSuccess : function(result) {
            /**/
        },
        onFail : function(err) {}
    })

}
// 打开应用内页面
Vue.prototype.$openPage= function(userId,corpId,userName) {

    dd.biz.util.open({
        name: userName || 'profile',//页面名称，目前支持以下页面：个人资料页(profile)  聊天页面(chat)   免费电话页面( call)   联系人添加页(contactAdd)  添加好友页面(friendAdd)   员工管理页面( manageOrg)
        params: { //传参
            "id": userId,
            "corpId": corpId || window.corpId
        },
        onSuccess : function() {
            /**/
        },
        onFail : function(err) {}
    });

}
// 后退
Vue.prototype.$back= function() {

    dd.biz.navigation.back();

}
// 关闭
Vue.prototype.$close= function() {

    dd.biz.navigation.close();

}
// 复制功能
Vue.prototype.$copy = function(txt,succ,fail){

    dd.biz.clipboardData.setData({
        text: txt || '',
        onSuccess: ()=> {
            if(succ)succ();
        },
        onFail: ()=> {
            if(succ)fail();
        }
    });

}
// 分享功能
Vue.prototype.$share = function(options){

    dd.biz.util.share({
        style: options.style || 0, //分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
        url: options.url || location.href,
        title: options.title || '叮当科技',
        content: options.content || '叮当科技-让工作更愉悦',
        image: options.image || '',
        onSuccess : function() {
            //onSuccess将在分享完成之后回调
            /**/
        },
        onFail : function(err) {}
    });
}

// 获取url参数值
Vue.prototype.$getUrlParam = function(param){
    var arrurl = [null, null];
    var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象

    var r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null) {
        arrurl[0] = decodeURIComponent(r[2]); // 返回参数值
        arrurl[1] = r.input;
    }
    return arrurl[0];
}

// 获取cookie
Vue.prototype.$getCookie = function(name) {
    var arr = [];
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

    if (arr = document.cookie.match(reg)) {
        return (arr[2]);
    } else {
        return null;
    }
}

// 验证是否邮箱格式
Vue.prototype.$isEmail = function(str) {
    var reg = /^([a-zA-Z0-9_\.\-])+\@([a-zA-Z0-9\-])+((\.[a-zA-Z]{2,8}){1,2})$/;
    return reg.test(str);
}
// 验证是否手机号
Vue.prototype.$isMobile = function(str) {
    var reg = /^1[3-8]{1}[0-9]{9}$/;
    return reg.test(str);
}
/**
 * 创建头像
 * @param    String    name 名字
 * @param    Number    imgw 图像大小 [如果觉得模糊请传入3倍]
 * @param    String    font 字体
 * @return   String    img的src
 */
Vue.prototype.$avatar = function(name, imgW, font) {
    let getShowName = (name)=>{
        let showName = name || '';
        let arr = [];
        let _isEnglish = name.match(/^([a-zA-Z]|\s|,|\.)+$/) !== null ? true : false;

        if (_isEnglish) {
        // 英文名字
        //将“,.”转为空格 & 将连续空格转换为单个空格
        showName = showName.replace(/,|\./g, ' ').replace(/\s+/g, ' ');
        arr = showName.split(' ');
        if (arr.length === 1) {
            return showName.slice(0, 2);
        }
        return arr[0].slice(0, 1) + arr[1].slice(0, 1);
        }
        // 中文名字 - 取后两位
        return showName.replace(/,|\.|\s+/g, '').slice(-2);
    }

    function getUserAvatar(name, imgW, font) {
        const showName = getShowName(name);
        var imgW = imgW || 90,
            font = font || '30px 微软雅黑',
            canvas = document.createElement('canvas'),
            cxt = canvas.getContext('2d');

        canvas.width = canvas.height = imgW;
        cxt.rect(0, 0, imgW, imgW);
        cxt.fillStyle = '#3296FA';
        cxt.fill();
        cxt.font = font;
        cxt.textBaseline = 'middle';
        cxt.textAlign = 'center';
        cxt.fillStyle = '#fff';
        cxt.fillText(showName, imgW / 2, imgW / 2);
        return canvas.toDataURL();
    }
    return getUserAvatar(name, imgW, font);
}

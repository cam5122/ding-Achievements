// 欢迎页面

<style>
  .welcome {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #fff;
    padding: 30px;
  }
  .welcome-title{
    font-size: 20px;
  }
  .welcome-subtit{
    margin-top: 30px;
    font-size: 18px;
  }
  .welcome-subtit img{
    width: 20px;
    margin-right: 5px;
    vertical-align: middle;
  }
  .welcome-subtit span{
    display: inline-block;
    vertical-align: middle;
  }
  .welcome-sublist{
    margin-top: 15px;
  }
  .welcome-help{
    margin-top: 30px;
    font-size: 13px;
    color: #666;
  }
  .welcome-foot{
    margin-top: 60px;
  }
</style>

<template>
  <div class="welcome">
    <div class="welcome-title">欢迎使用智能绩效</div>  
    <div class="welcome-subtit">
      <img src="../../assets/wel.png" alt="">
      <span>管理员</span>
    </div>
    <div class="welcome-sublist">1.可以使用绩效桌面版，进行绩效基础设置，绩效指标库设置。</div>
    <div class="welcome-sublist">2.可以前往审批后台配置绩效目标、考评的审批人节点设置。</div><div class="welcome-subtit">
      <img src="../../assets/wel1.png" alt="">
      <span>员工</span>
    </div>
    <div class="welcome-sublist">1.可以使用绩效桌面版，进行绩效基础设置，绩效指标库设置。</div>
    <div class="welcome-help">如需帮助，可点击右上角的帮助按钮联系客服支持</div>
    <div class="welcome-foot">
      <x-button type="primary" @click.native="goPage">开启智能绩效</x-button>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux'
export default {
  name: 'welcome',
  components: {
    XButton
  },
  data() {
    return {}
  },
  methods: {
    goPage() {
      this.$router.replace('/my');
    }
  }
}
</script>
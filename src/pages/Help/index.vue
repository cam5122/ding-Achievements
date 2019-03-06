
<style lang="less" scoped>
.help-page {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-left: 15px;
  padding-right: 20px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
  
  .help-title {
    margin-top: 20px;
    display: flex;
    h1 {
      line-height: 28px;
      margin-left: 10px;
      font-size: 20px;
    }
    .title-icon {
      width: 28px;
      height: 28px;
    }
  }

  .help-list{
    margin-top: 20px;
    li {
      position: relative;
      margin-top: 10px;
      padding-left: 18px;
      .order{
        position: absolute;
        left: 0;
        top: 2px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        color: #fff;
        background-color: #3F9AF4;
        box-shadow: 0px 0px 8px #3F9AF4;
        text-align: center;
      }
      .text{
        margin-top: 12px;
        font-size: 16px;
        line-height: 25px;
        padding-left: 10px;
        img{
          width: 100%;
        }
      }
      .qrcode {
        margin: 20px auto;
        padding: 6px;
        width: 172px;
        height: 172px;
        text-align: center;
        background-color: #EFEFF0;
        border-radius: 2px;
        img {
          max-width: 160px;
          max-height: 160px;
        }
      }
    }
  }  
}
</style>

<template>
  <div class="help-page">
    <div class="help-title">
      <img class="title-icon" src="../../assets/title-icon.png" >
      <h1>使用帮助</h1>
    </div>
    <ul class="help-list">
      <li>
        <div class="order">1</div>
        <div class="text">可前往钉钉桌面版，查看部门团队绩效情况、配置基础设置</div>
        <div class="text"><img src="../../assets/help1.png"></div>
      </li>
      <li>
        <div class="order">2</div>
        <div class="text">新建绩效目标制定流程</div>
        <div class="text"> 路径：钉钉OA后台（oa.dingtalk.com）-工作台-审批应用-创建新审批-自定义模板-人事套件-绩效目标制定套件 </div>
        <div class="text">
          a）将绩效目标制定套件拖入表单；<br>
          b）填写审批名称（如绩效目标制定、填写绩效计划）；<br>
          c）选择将审批流程的分组；<br>
          d）保存/保存并启用；<br>
          e）前往设置流程审批人，并可设置审批人是否可以修改员工的指标内容<br>
        </div>
        <div class="text"><img src="../../assets/help2.1.png"></div>
        <div class="text"><img src="../../assets/help2.2.png"></div>
      </li>
      <li>
        <div class="order">3</div>
        <div class="text">新建绩效考评流程</div>
        <div class="text">路径：钉钉OA后台（oa.dingtalk.com）-工作台-审批应用-创建新审批-自定义模板-人事套件-绩效考评套件</div>
        <div class="text">
          a）将绩效考评套件拖入表单；<br>
          b）填写审批名称（如绩效目标制定、填写绩效计划）；<br>
          c）选择将审批流程的分组；<br>
          d）保存/保存并启用；<br>
          e）前往设置流程审批人，并可设置审批人为几级评分人，以及员工是否可见评分人的评分内容<br>
        </div>
        <div class="text"><img src="../../assets/help3.1.png"></div>
        <div class="text"><img src="../../assets/help3.2.png"></div>
      </li>
      <li>
        <div class="order">4</div>
        <div class="text">如需客服帮助或有功能需求，请长按识别下方二维码，加入绩效共创群</div>
        <div class="qrcode"><img  src="../../assets/qrcode.png"></div>
      </li>
    </ul>
  </div>
</template>
<script>
import { postBury } from '@/utils'
export default {
  data() {
    return {}
  },
  created() {
    postBury(202004);
  },
}
</script>


<style lang="less" scoped>
@import "../../less/mixins";
.detail {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #f6f6f6;
  overflow: hidden;
  .detail-wrap {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding-bottom: 10px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .detail-wrap.setbottom {
    bottom: 64px;
  }
  .detail-head {
    position: relative;
    background-color: #fff;
    padding: 0 15px;
    // border-bottom: 1px solid #E0E0E0;
    .detail-head-status {
      position: absolute;
      top: 20px;
      right: 12px;
      width: 76px;
      height: 76px;
      overflow: hidden;
      text-align: center;
      img {
        width: 76px;
      }
    }
    .detail-user {
      display: flex;
      height: 85px;
      align-items: center;
      &.line-bottom {
        .border-1px(rgba(25, 31, 37, 0.12));
      }
      .detail-user-info {
        font-size: 14px;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        // .detail-user-name {
        // }
        .detail-user-dept {
          color: #999;
          font-size: 13px;
        }
      }
    }
  }
  .detail-doc {
    padding: 10px 15px 12px;
    background-color: #fff;
    h2 {
      padding-bottom: 10px;
      font-size: 18px;
    }
  }
  .detail-item {
    display: flex;
    margin-top: 10px;
    // align-items: center;
  }
  .detail-item-title {
    min-width: 70px;
    width: 70px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 5px;
    // white-space: nowrap;
  }
  // .detail-doc .detail-item-title{
  //   width: 100px;
  //   min-width: 100px;
  // }
  .detail-opencheck {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    height: 64px;
    padding-top: 10px;
    background-color: #fff;
    text-align: center;
    border-top: 1px solid #f2f2f2;
  }
  .detail-opencheck .comm-button {
    width: 88%;
    padding: 11px;
    font-size: 16px;
  }
  .record {
    position: relative;
    .padding-left-10 {
      padding-left: 10px;
    }
    .title {
      padding-left: 17px;
      height: 42px;
      line-height: 52px;
      font-size: 13px;
      color: rgba(25,31,37,0.40);
      font-weight: normal;
    }
    .record-wrapper {
      padding-top: 17px;
      background: #ffffff;
    }
    .record-subwrapper {
        padding: 0 3px 0 17px;
        position: relative;
        &:last-child {
            .record-content {
                .record-item {
                    border-left: none;
                    padding: 0 0 15px 20px;
                }
            }
        }
        .record-content {
            display: flex;
            // align-items: center;
            .avatar {
                position: relative;
                width: 28px;
                height: 28px;
                z-index: 10;
            }
            .record-item {
                flex: 1;
                border-left: 1px dashed rgba(25, 31, 37, 0.2);
                padding: 0 0 35px 20px;
                position: relative;
                left: -14px;
                top: 5px;
                .first-line {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .left {
                        display: flex;
                        align-items: center;
                        .name {
                            font-size: 13px;
                            color: rgba(25,31,37,0.76);
                            line-height: 17px;
                            max-width: 70px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .behavior {
                            font-size: 13px;
                            color: #15BC83;
                            line-height: 17px;
                            @media only screen and (max-width:320px) {
                                max-width: 80px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                    }
                    .right {
                        font-size: 11px;
                        color: rgba(25,31,37,0.56);
                        text-align: right;
                        line-height: 17px;
                    }
                }
                .desc {
                    padding-top: 6px;
                    font-size: 15px;
                    line-height: 17px;
                    color: #191F25;
                }
            }
        }
        .line {
            display: inline-block;
            width: 2px;
            height: 74px;
            position: absolute;
            top: -30px;
            left: 29px;
            background: url("../../assets/line-arrow.png") repeat-y center;
            background-size: 2px 74px;
            vertical-align: middle;
            padding-top: 10px;
        }
    }
    .more {
      background: #ffffff;
      font-size: 13px;
      color: #3296FA;
      padding: 0 11px 17px 11px;
      .fold {
        padding: 6px;
      }
    }
}
}
.process {
  .title {
    padding-left: 17px;
    height: 42px;
    line-height: 52px;
    font-size: 13px;
    color: rgba(25,31,37,0.40);
    font-weight: normal;
  }
  .process-flex {
    display: flex;
    align-items: center;
    height: 75px;
    padding:0 17px;
    overflow-x: scroll;
    -webkit-overflow-scrolling:touch;
    background: #ffffff;
    .process-text {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      // height: 43.5px;
      width: 250px;
      font-size: 15px;
      color: rgba(25,31,37,0.76);
      padding: 6px;
      box-shadow: 0 2px 3px 0 rgba(0,0,0,0.12);
      border-radius: 2px;
      background: #f0f0f0;
      &:first-child {
        &::after {
          display: none;
        }
        .text {
          padding-left: 5px;
        }
      }
      &::before {
        position: absolute;
        content: "";
        height: 0;
        width: 0;
        right: -33px;
        border: 17px solid #f0f0f0;
        border-color: transparent transparent transparent #f0f0f0 ;
        z-index: 10;
      }
      &::after {
        position: absolute;
        content: "";
        height: 0;
        width: 0;
        left: -1px;
        border: 17px solid #ffffff;
        border-color: transparent transparent transparent #ffffff;
      }
      & + .process-text {
        margin-left: 5px;
      }
      &.active {
        color: #3296FA;
        background: #EAF4FE;
        &::before {
          position: absolute;
          content: "";
          height: 0;
          width: 0;
          right: -33px;
          border: 17px solid #EAF4FE;
          border-color: transparent transparent transparent #EAF4FE;
          z-index: 10;
        }
      }
      .text {
        max-width: 180px;
        padding-left: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .completed {
        position: relative;
        padding-left: 5px;
        height: 13px;
        width: 11.5px;   
      }
    }
  }
}
.confirm-submit {
  padding: 10px 12px;
  background: #ffffff;
  margin-top: 8px;
  .textarea-full {
    height: 140px;
    width: 100%;
    resize: none;
    border: none;
    border-radius: 4px;
    outline: none;
    line-height: 25px;
    // padding: 5px 15px;
    color: #323334;
    font-size: 15px;
    appearance: none;
  }
}
</style>

<template>
  <div class="detail" @scroll="preventScroll($event)">
    <div v-if="ajaxFinish">
      <div class="detail-wrap" :class="{'setbottom': (perforDatas.processInfo.currentStatus === 3 && !corpAuth && isMyUserId) || (isMyUserId && (makeAuth === 1 || makeAuth === -1)) || needBtn.length > 0}">
        <div class="detail-head">
          <!-- <div class="detail-head-status">
            <img v-if="perforDatas.processInfo.currentStatus === 1" src="../../assets/status1.png" alt="">
            <img v-if="perforDatas.processInfo.currentStatus === 2" src="../../assets/status2.png" alt="">
            <img v-if="perforDatas.processInfo.currentStatus === 3" src="../../assets/status3.png" alt="">
            <img v-if="perforDatas.processInfo.currentStatus === 4" src="../../assets/status4.png" alt="">
            <img v-if="perforDatas.processInfo.currentStatus === 5 || perforDatas.processInfo.isImport" src="../../assets/status5.png" alt="">
          </div> -->
          <div class="detail-user" :class="{'line-bottom': perforDatas.totalOrder.length > 0}">
            <avatar :name="perforDatas.userInfo.name" :avatar="perforDatas.userInfo.avatar" width="36"/>
            <div class="detail-user-info">
              <div class="detail-user-name">{{perforDatas.userInfo.name}}</div>
              <div class="detail-user-dept">{{perforDatas.userInfo.deptName}}</div>
            </div>
          </div>
        </div>
        <div v-if="perforDatas.targetItems && perforDatas.targetItems.length>0">
          <div v-if="!perforDatas.processInfo.isImport">
            <div class="detail-doc" v-if="perforDatas.totalOrder.length > 0">
              <div v-for="(item,index) in perforDatas.totalOrder" :item="item" :key="item+index">
                <div class="detail-item" v-if="item !== 'other'">
                  <div class="detail-item-title">{{perforDatas.totalItem[item].name}}：</div>
                  <div>{{perforDatas.totalItem[item].value || '-'}}</div>
                </div>
              </div>
              <div class="detail-item" v-if="perforDatas.processInfo.finalScore">
                <div class="detail-item-title">考核结果：</div>
                <div>{{perforDatas.processInfo.finalScore}}</div>
              </div>
              <div class="detail-item" v-if="perforDatas.processInfo.grade">
                <div class="detail-item-title">绩效等级：</div>
                <div>{{perforDatas.processInfo.grade}}</div>
              </div>
            </div>
            <div class="process">
              <h2 class="title">绩效流程</h2>
              <div class="process-flex" ref="processMain">
                <div class="process-text" :class="{'active': item.type ===1}"  v-for="(item, index) in perforDatas.advances" :key="item.name+index" ref="processItem">
                  <div class="text">{{index+1}} {{item.name}}{{item.userName ? '：' : '' }}{{item.userName}}</div>
                  <!-- <img src="@/assets/right-grey.png" v-if="item.type ===0" class="completed"> -->
                  <img src="@/assets/right-blue.png" v-if="item.type === 0" class="completed">
                </div>
              </div>
            </div>
            <coll-panel v-for="(item,index) in perforDatas.targetItems" :item="item" :key="'item'+index">
              <div class="detail-item" v-for="t in perforDatas.targetTitle" :key="t.key" v-if="item[t.key] && t.key!=='name'">
                <div class="detail-item-title" v-if="item.type===3 && t.key==='itemLimit'">加分上限：</div>
                <div class="detail-item-title" v-else-if="item.type===4 && t.key==='itemLimit'">扣分上限：</div>
                <div class="detail-item-title" v-else>{{t.value}}：</div>
                <div v-if="t.key === 'remark'" v-html="item[t.key]?item[t.key].replace(/\n/g,'<br>'):'-'"></div>
                <div v-else-if="t.key === 'itemBarrier' || t.key === 'itemChallenge' || t.key === 'itemTarget' || t.key === 'itemResult'">{{item[t.key] || ''}}{{item.unit}}</div>
                <div v-else>{{item[t.key] || ''}}</div>
              </div>
            </coll-panel>
          </div>
          <div v-if="perforDatas.processInfo.isImport">
            <div class="detail-doc">
              <h2>{{perforDatas.processInfo.title || '绩效详情'}}</h2>
              <div v-for="(item,index) in perforDatas.targetItems" :item="item" :key="'item'+index">
                <div class="detail-item" v-for="t in perforDatas.targetTitle" :key="t.key">
                  <div class="detail-item-title">{{t.value}}：</div>
                  <div>{{item[t.key] || '-'}}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 记录 -->
          <div class="record" v-if="records.allRecords.length > 0">
            <h2 class="title">记录</h2>
            <div class="record-wrapper">
              <div class="record-subwrapper" v-for="(item, index) in records.currentRecords" :key="index">
                <!-- <div class="line"></div> -->
                <div class="record-content">
                  <div class="avatar">
                    <avatar :avatar="item.avatar" :name="item.name" :width="28"></avatar>
                  </div>
                  <div class="record-item padding-left-10">
                    <div class="first-line">
                      <div class="left">
                        <div class="name">{{item.name}}</div>
                        <div class="behavior padding-left-10">{{item.type}}</div>
                      </div>
                      <div class="right">{{item.date | formateDate}}</div>
                    </div>
                    <div class="desc" v-if="item.remark" v-html="item.remark.replace(/\n/g,'<br>')"></div>
                  </div>
                </div>
              </div>
              </div>
              <div class="more">
                <span v-if="records.allRecords.length > 3" class="fold" @click="showAll">{{isFold[records.foldStatus]}}</span>
              </div>
          </div>        
        </div>
        <no-data msg="暂未制定绩效目标" v-if="!perforDatas.targetItems || perforDatas.targetItems.length===0"></no-data>
      </div>


      <div class="detail-opencheck" v-if="isMyUserId && (makeAuth === 1 || makeAuth === -1)">
        <button class="comm-button" @click="getProcessCode(1)">制定绩效目标</button>
      </div>
      <div class="detail-opencheck" v-if="perforDatas.processInfo.currentStatus === 3 && !corpAuth && isMyUserId">
        <button class="comm-button" @click="getProcessCode(2)">发起绩效考评</button>
      </div>
      <footer-btn :btnInfo="needBtn" @submitData="submitData"></footer-btn>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";
import CollPanel from "./CollPanel";
import NoData from "@/components/NoData";
import FooterBtn from "@/components/FooterBtn";

export default {
  data() {
    return {
      isShowComm: false,
      isMyUserId: true,
      ajaxFinish: false,
      processId: "",
      userId: "",
      perforDatas: {
        processInfo: {},
        userInfo: {},
        targetItems: [],
        targetTitle: [],
        totalItem: {}
      },
      makeAuth: 0, // 控制是否显示发起绩效制定
      processWidth: [],
      hasReject: false,
      isFold: {
        true: "全部记录",
        false: "收起"
      },
      
      records: {
        allRecords: [], 
        shortRecords: [], //缩略记录（只显示三条）
        currentRecords: [],
        foldStatus: true
      },
    };
  },
  computed: {
    corpAuth() {
      return this.$store.state.userAuthData.corpAuth;
    },
    myUserId() {
      return this.$store.state.userAuthData.userId;
    },
    userAuthData() {
      return this.$store.state.userAuthData;
    },
    // 需要显示的按钮
    needBtn () {
      let btnInfo = [];
      if (this.userAuthData.corpAuth && this.perforDatas.communication) {
        btnInfo.push({ name: "沟通", id: "comm"});
      }
      if (this.hasReject) {
        btnInfo.push({ name: "驳回", id: "reject", color: "danger"});
      }
      if (this.userAuthData.corpAuth && this.perforDatas.needConfirm) {
        btnInfo.push({ name: "确认目标", id: "confirm"});
      }
      if (this.userAuthData.corpAuth && this.perforDatas.checkBtn === 3 && this.isMyUserId) {
        btnInfo.push({ name: "评分", id: "score"});
      }
      return btnInfo;
    }
  },
  filters: {
    formateDate(time){
      let nowyear = new Date().getFullYear(),
        year = new Date(time).getFullYear(),
        date;
      if (nowyear === year) {
        date = new Date(time).Format('MM.dd hh:mm');
      } else {
        date = new Date(time).Format('yyyy.MM.dd hh:mm');
      }
      return date;
    }
  },
  components: { Avatar, CollPanel, NoData, FooterBtn },
  beforeMount() {
    this.processId = this.$route.query.processId || "";
    if (this.$route.query.userId) {
      this.userId = this.$route.query.userId;
      if (this.userId != this.myUserId) {
        this.isMyUserId = false;
      }
    }
    this.getData().then( () => {
      this.ajaxFinish = true;
      this.$setTitle(this.perforDatas.processInfo.title);
      this.$nextTick(() => {
        this._calculateWidth();
        this._locateScroll();
      });
    }).catch( err => {
      console.log("error", err);
    });
    this.getMakeAuth();
    this.getRecord();
  },
  methods: {
    preventScroll(e) {
      e.preventDefault();
    },
    // 发起审批
    openURL(processCode) {
      let url =
        "https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?dd_share=false&showmenu=true&back=native&swfrom=&corpid=" +
        window.corpId +
        "&processCode=" +
        processCode +
        "#/custom";
      this.$openLink(url);
    },
    // 获取审批code
    getProcessCode(type) {
      let url = window.apiBasePath + "/app/perf/process/codeList?type=" + type;
      this.$Ajax({ url }).then(res => {
        if (!res) return;
        if (res.data && res.data.length === 0) {
          // let tit = type === 1 ? "暂无绩效目标模板" : "暂无绩效考评模板";
          let tit =
            "请联系审批管理员前往钉钉审批后台，新建" +
            (type === 1 ? "绩效目标制定" : "绩效考评流程") +
            "，点击右上角“帮助”查看教程";
          this.$Alert(tit);
          return;
        }
        if (res.data.length === 1) {
          this.openURL(res.data[0].processCode);
          return;
        }
        let options = res.data.map(item => {
          return {
            key: item.name,
            value: item.processCode
          };
        });
        this.$chosen(options, options[0].key, data => {
          this.openURL(data.value);
        });
        }).catch( (err) => {
          console.log(err, "codeList");
        });
    },
    // 获取绩效明细
    getData() {
      let url = window.apiBasePath + "/app/perf/user/check/info";
      let param = {
        lookType: 1,
        userId: this.userId,
        searchProcessId: this.processId
      };
      return this.$Ajax({ url, param }).then(res => {
        if (!res) return;
        res.data.processInfo = res.data.processInfo || {};
        res.data.targetItems = res.data.targetItems || [];
        res.data.userInfo = res.data.userInfo || {};
        // let len = res.data.totalOrder.length;
        // res.data.totalOrder[len] = 'other';
        this.perforDatas = res.data;
      }).catch( (err) => {
        console.log(err, "/check/info");
      });
    },
    // 是否有驳回
    getReject() {
      let url = window.apiBasePath + "/app/perf/step/hasReject",
        param = {
          processId: this.processId
        };
      this.$Ajax({
        url,
        param,
        hideLoad: true
      }).then(res => {
        if (!res) return;
        this.hasReject = res.data;
      }).catch( (err) => {
        console.log(err, "hasReject");
      });
    },
    goEvaluate(param) {
      let processId = this.perforDatas.processInfo.processId,
        userId = this.perforDatas.userInfo.userId,
        needShow = param;
      this.$router.push({
        path: "/evaluate",
        query: {
          processId,
          userId,
          needShow
        }
      });
    },
    // 是否可以发起制定
    getMakeAuth() {
      let url =
        window.apiBasePath +
        "/app/perf/configuration/group/lookover/member";
      this.$Ajax({
        url,
        hideLoad: true
      })
        .then(res => {
          if (!res) return;
          this.makeAuth = res.data || 1;
        })
        .catch(err => {
          console.log("makeAuth", err);
        });
    },
    // 流程定位
    _locateScroll () {
      let block = this.$refs.processMain;
      for (var i = 0; i < this.perforDatas.advances.length; i++) {
        let item = this.perforDatas.advances[i];
        if (item.type === 1) {
          block.scrollLeft = this.processWidth[i];
          break;
        }
      }
      // console.log("processWidth", this.processWidth[2])
    },
    // 计算流程每项宽度
    _calculateWidth() {
      let processItem = this.$refs.processItem;
      let width = 0;
      this.processWidth.push(width);
      for (let i = 0; i < processItem.length; i++) {
        let item = processItem[i];
        width += item.clientWidth;
        this.processWidth.push(width);
      }
      // console.log("this.processWidth", this.processWidth);
    },
    // 提交
    submitData (id) {
      switch (id) {
        case "confirm":
          this.targetConfirm();
          break;
        case "score":
          this.goEvaluate("score");
          break;
        case "comm":
          this.goEvaluate("comm");
          break;
      }
    },
    // 目标确认
    targetConfirm () {
      let url = `${window.apiBasePath}/app/perf/step/confirm/target`,
        param = {
            checkRsId: this.processId
        };
      this.$Ajax({
        url,
        param
      }).then(res => {
        if (!res) return;
        this.getData().then(() => {
            this.$Toast('目标已确认', true);
        })     
      }).catch( (err) => {
        console.log(err, "confirm/target");
      });
    },
    // 记录
    getRecord () {
        let url = `${window.apiBasePath}/app/perf/group/showOperationRecords?checkRsId=${this.processId}`;
        this.$Ajax({
            type: 'post',
            url
        }).then( res => {
          if (!res) return;
            this.records.allRecords = res.data;
            this.records.currentRecords = this.records.shortRecords = res.data.slice(0, 3);
        }).catch( (err) => {
          console.log(err, "howOperationRecords");
        });
    },
    // 记录展开 - 收起
    showAll () {
        if (this.records.foldStatus) {
            this.records.currentRecords = this.records.allRecords;
        } else {
            this.records.currentRecords = this.records.shortRecords; 
        }
        this.records.foldStatus = !this.records.foldStatus;
    },
  }
};
</script>


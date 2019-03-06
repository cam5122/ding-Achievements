<template>
  <div class="my-wrapper">
    <div class="my" :class="{'full': userAuth.length===1 && userAuth.includes(1)}" ref="itemlist" @scroll="scrollMore()" v-if="mountFinish">
      <div>
        <ul class="topbar" v-if="!corpAuth && (makeAuth===1||makeAuth===-1)">
          <li @click="getProcessCode(1)">
            <img class="make-btn" src="../../assets/make-icon.png">
            <h3>制定绩效目标</h3>
          </li>
          <li @click="getProcessCode(2)">
            <img class="check-btn" src="../../assets/check-icon.png">
            <h3>发起绩效考评</h3>
          </li>
        </ul>
        <div v-else >
          <div v-if="!corpAuth"  class="open-check" @click="getProcessCode(2)" >
            <img class="icon1" src="../../assets/check-icon.png">
            <span>发起绩效考评</span>
            <img class="icon2" src="../../assets/more.png" alt="">
          </div>
        </div>
        <div v-if="corpAuth && isCommonPerson">
          <div class="img-wrapper">
            <img height="80" width="100%" class="header-bg" src="@/assets/header-bg.png">
          </div>
          <!--  待办事项入口 -->
          <todo-entry></todo-entry>
        </div>
        <div v-if="corpAuth && (makeAuth===1||makeAuth===-1)"  class="open-check" @click="getProcessCode(1)" >
          <img class="icon1" src="../../assets/make-icon.png">
          <span>制定绩效目标</span>
          <img v-if="!isCommonPerson" class="icon2" src="../../assets/more.png" alt="">
        </div>
        <ul class="list" v-if="myData.datas.length>0">
          <li class="item" v-for="item in myData.datas" :key="item.id||item.makeProcessId||item.checkProcessId">
            <my-item :item="item" :userName="myData.userName" :userAvatar="myData.avatar" />
          </li>
        </ul>
        <div v-else>
          <no-data msg="暂无绩效数据，试试制定绩效目标吧"></no-data>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyItem from "./item";
import noData from '@/components/NoData';
import todoEntry from '@/pages/WorkStation/TodoEntry';
export default {
  name: "my",
  data() {
    return {
      mountFinish: false,
      scrolling: false,
      makeAuth: 0,
      myData: {
        datas: [],
        userName: "",
        deptName: "",
        avatar: "",
        pageNo: 1,
        pageSize: 15,
        totalPages: 0,
        totalCount: 0
      }
    };
  },
  components: {
    MyItem,
    noData,
    todoEntry
  },
  created() {
    this.$showLoading();
  },
  computed: {
    corpAuth() {
      return this.$store.state.userAuthData.corpAuth;
    },
    userAuth () {
      return this.$store.state.userAuthData.userAuth;
    },
    isCommonPerson () {
      return this.$store.state.isCommonPerson
    }

  },
  mounted() {
    let hideFn = () => {
      this.mountFinish = true;
      setTimeout(() => {
        this.$hideLoading();
      }, 200);
    };
    Promise.all([this.getMakeAuth(), this.getData()])
      .then(res => {
        hideFn();
      })
      .catch(err => {
        hideFn();
      });
  },
  methods: {
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
            "请联系审批应用管理员前往钉钉oa后台（oa.dingtalk.com）-工作台-审批应用-新建" +
            (type === 1 ? '"绩效目标制定"流程模板' : "绩效考评流程") +
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
        console.log(err, "process/codeList");
      });
    },
    // 该人所在考评组是否领导下发指标，控制显示隐藏绩效目标制定按钮
    getMakeAuth() {
      let url =
        window.apiBasePath + "/app/perf/configuration/group/lookover/member";
      return this.$Ajax({ url, hideLoad: true }).then(res => {
        if (!res) return;
        this.makeAuth = res.data || 1;
      }).catch( (err) => {
        console.log(err, "lookover/member");
      });
    },
    // 滚动加载下一页
    scrollMore() {
      let dom = this.$refs.itemlist;
      if (dom.offsetHeight + dom.scrollTop === dom.scrollHeight) {
        if (this.myData.pageNo < this.myData.totalPages && !this.scrolling) {
          this.scrolling = true; // 滚动加载中
          this.$showLoading("加载下一页");
          this.myData.pageNo++;
          this.getData()
            .then(() => {
              this.$hideLoading();
            })
            .catch(err => {
              this.$hideLoading();
            });
        }
      }
    },
    // 获取个人绩效列表
    getData() {
      let url =
        window.apiBasePath +
        "/app/perf/user/check/my/list?pageNo=" +
        this.myData.pageNo +
        "&pageSize=10";
      return this.$Ajax({ url, hideLoad: true }).then(res => {
        if (!res || !res.data) return;
        if (res.data.pageNo > 1) {
          res.data.datas = this.myData.datas.concat(res.data.datas);
        }
        this.myData = res.data;
        this.scrolling = false; // 滚动加载完成
      }).catch( (err) => {
        console.log(err, "/my/list");
      });
    },
  }
};
</script>

<style lang="less" scoped>
.my {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 50px;
  overflow: auto;
  background-color: #f8f8f8;
  -webkit-overflow-scrolling: touch;
  &.full{
    bottom: 0;
  }
  .topbar {
    display: flex;
    padding: 50px 0;
    background-color: #fff;
    border-bottom: 1px solid #ededed;
    li {
      flex-grow: 2;
      text-align: center;

      h3 {
        font-weight: normal;
        margin: 5px 0 0 0;
        font-size: 1.1em;
      }
    }
  }
  .check-btn {
    width: 35px;
    height: 35px;
  }
  .make-btn {
    width: 35px;
    height: 35px;
  }
  .open-check {
    position: relative;
    margin-top: 16px;
    padding: 8px 0;
    background-color: #fff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #ededed;
    img.icon1 {
      margin-left: 28px;
      margin-right: 18px;
      width: 30px;
      vertical-align: middle;
    }
    span {
      margin-top: 2px;
      display: inline-block;
      vertical-align: middle;
    }
    img.icon2 {
      position: absolute;
      width: 20px;
      top: 13px;
      right: 10px;
    }
  }
  .list {
    background-color: #fff;
    margin-top: 15px;
    border-top: 1px solid #ededed;
    .item {
      // border-bottom: 1px solid #ededed;
      box-shadow: 0 7px 11px rgba(25, 31, 37, 0.04);
      padding-bottom: 7px;
      &:last-child {
        padding-bottom: 0;
      }
    }
  }

  .empty-data {
    background-image: url("../../assets/empty-box-4.png");
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 130px;
    min-height: 250px;
    text-align: center;
  }
  .empty-tips {
    padding-top: 190px;
    display: block;
    color: #cdcdcd; //#bfbfbf
    font-size: 15px;
  }
  .img-wrapper {
    font-size: 0;
    position: relative;
    z-index: -1;
  }
  // &.slide-left-leave-active,
  // &.slide-left-enter-active,
  // &.slide-right-leave-active,
  // &.slide-right-enter-active  {
  //     position: absolute;
  //     width: 100%;
  // }
}
</style>

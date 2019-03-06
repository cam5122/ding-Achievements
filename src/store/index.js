import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    //创建页面初始用户信息
    userAuthData: { // 用户权限等基本信息
      userAuth: [],
      groupAuth: false,
      initFlag: false
    },
    isCommonPerson: false, // 是否普通员工
    todoCount: {}, // 待办数
    filterTags: {
      type: 1, // 指标类型  1是量化 2是行为
      tagIds: [], //标签
    },
    factorDetail: null, //指标详情
    showSetTit: true, // setting是否显示标题栏
    allTeamData: {}, //团队绩效数据
    isTodoNull: false, // 待办列表是否为空
  },
  mutations: {
    setState (state, payload) {
      for (let key in payload) {
        state[key] = payload[key]
      }
    },
    clearFactorDetail (state) {
      state.factorDetail = null;
    },
    changeTagIds (state, tags) {
      state.filterTags.tagIds = tags;
    },
    changeTagType (state, type) {
      state.filterTags.type = type;
    },
    clearTag (state) {
      state.filterTags = {
        type: 1, // 指标类型  1是量化 2是行为
        tagIds: [], //标签
      };
    },
    saveAllTeamData (state, data) {
      state.allTeamData = data;
    },
  }
})

export default store

import Vue from 'vue'
import Router from 'vue-router'
import My from '@/pages/My'
import Detail from '@/pages/Detail'
import Help from '@/pages/Help'
import Welcome from '@/pages/Welcome'
import WorkStation from '@/pages/WorkStation/WorkStation'
import Settings from '@/pages/Settings/Settings'
import BasicSettings from '@/pages/Settings/BasicSettings'
import FactorSettings from '@/pages/Settings/FactorSettings/FactorSettings'
import ReviewSettings from '@/pages/Settings/ReviewSettings'
import PermissionSettings from '@/pages/Settings/PermissionSettings'
import LaunchAssessment from '@/pages/Settings/LaunchAssess'
import FilterTags from '@/pages/Settings/FactorSettings/FilterTags'
import FactorDetail from '@/pages/Settings/FactorSettings/FactorDetail'
import AddFactor from '@/pages/Settings/FactorSettings/AddFactor'
import TodoList from '@/pages/TodoList/TodoList'
import Evaluate from '@/pages/TodoList/Evaluate'
import TeamDetail from '@/pages/Team/TeamDetail';
import PayActivity from '@/pages/Pay/PayActivity';
import PayDetail from '@/pages/Pay/PayDetail';
import InputResult from '@/pages/TodoList/InputResult';
import Report from '@/pages/Report/Report';

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/workStation'},
    {
      path: '/my',
      name: 'My',
      component: My,
      meta: { title: '我的绩效' },
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail,
      meta: { title: '绩效详情' }
    },
    {
      path: '/help',
      name: 'Help',
      component: Help,
      meta: { title: '帮助' }
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
      meta: { title: '智能绩效' }
    },
    {
      path: '/workStation',
      name: 'WorkStation',
      component: WorkStation,
      meta: { title: '智能绩效' }
    },
    {
      path: '/report',
      name: 'Report',
      component: Report,
      meta: { title: '智能绩效' }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      redirect: '/settings/basicSettings',
      meta: { title: '智能绩效' },
      children: [
        {
          path: '/settings/basicSettings',
          name: 'BasicSettings',
          component: BasicSettings,
          meta: { title: '基础设置' },
        },
        {
          path: '/settings/factorSettings',
          name: 'FactorSettings',
          component: FactorSettings,
          meta: { title: '指标库' },
        },
        {
          path: '/settings/filterTags',
          name: 'FilterTags',
          component: FilterTags,
          meta: { title: '指标库' },
        },
        {
          path: '/settings/factorDetail',
          name: 'FactorDetail',
          component: FactorDetail,
          meta: { title: '指标详情' }
        },
        {
          path: '/settings/addFactor',
          name: 'AddFactor',
          component: AddFactor,
          meta: { title: '新增指标' }
        },
        {
          path: '/settings/reviewSettings',
          name: 'ReviewSettings',
          component: ReviewSettings,
          meta: { title: '考评组' },
        },
        {
          path: '/settings/launchAssessment',
          name: 'LaunchAssessment',
          component: LaunchAssessment,
          meta: { title: '发起考核' },
        },
        {
          path: '/settings/permissionSettings',
          name: 'PermissionSettings',
          component: PermissionSettings,
          meta: { title: '权限设置' },
        },
      ]

    },
    {
      path: '/teamDetail',
      name: 'TeamDetail',
      component: TeamDetail,
      meta: { title: '考核管理详情' }
    },
    {
      path: '/todoList',
      name: 'TodoList',
      component: TodoList,
      meta: { title: '待办事项' },
    },
    {
      path: '/evaluate',
      name: 'Evaluate',
      component: Evaluate,
      meta: { title: '考核评分' },
    },
    {
      path: '/inputResult',
      name: 'InputResult',
      component: InputResult,
      meta: { title: '结果值数据录入' },
    },
    {
      path: '/payActivity',
      name: 'PayActivity',
      component: PayActivity,
      meta: { title: '智能绩效' },
    },
    {
      path: '/payDetail',
      name: 'PayDetail',
      component: PayDetail,
      meta: { title: '智能绩效' },
    }
    
  ],
  linkActiveClass: 'active'
})

import Vue from 'vue'
import Router from 'vue-router'
// 以下为需要注册路由的组件
const initial = () => import('@/components/public/initial')
const person = () => import('@/components/person/person')
const work = () => import(/* webpackChunkName: "group-work" */ '@/components/work/work')
const daysWea = () => import(/* webpackChunkName: "group-work" */ '@/components/work/daysWea')

Vue.use(Router)
const routes = [
  {
    path: '',
    redirect: {name: 'initial'}
  },
  {
    name: 'initial',
    path: '/initial',
    components: {
      default: initial,
      mainView: initial
    }
  },
  {
    path: '/person',
    name: 'person',
    components: {
      default: person,
      mainView: person
    }
  },
  {
    name: 'work',
    path: ':city/work',
    components: {
      default: work,
      mainView: work
    },
    children: [
      {
        name: 'daysWea',
        path: 'daysWea',
        component: daysWea
      }
    ]
  }
]

const router = new Router({routes})

export default router

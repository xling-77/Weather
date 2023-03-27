// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// 引入vue-router
import router from './router'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/icon.css' // 修复图标不显示问题
// 引入echarts
import * as echarts from 'echarts'
// 引入拖拽指令函数
import dragfn from './directives/drag'

Vue.config.productionTip = false
// 引入element-ui
Vue.use(ElementUI)
// 引入echarts
Vue.prototype.$echarts = echarts

// 拖拽指令：基于父元素范围内拖拽一组元素，位置相对于视口。
Vue.directive('useDrag', {
  // 设置拖拽属性、初始位置
  bind (el, binding) {
    el.draggable = true
    el.dataset.ini = el.innerHTML
  },
  // 操作
  inserted (el) {
    // 获取其父元素
    let elParent = el.parentElement
    window.navigator.userAgent.includes('Mobile') ? dragfn.baseTouch(el, elParent) : dragfn.baseDrag(el, elParent)
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

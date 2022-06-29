import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as directives from '@/directives'
import components from '@/components'

import '@/icons' // icon
import '@/permission' // permission control

import * as filters from '@/filters' // 引入工具类
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// ES6中可以遍历数组用 object.keys() 并输出位数组
// 数组不能遍历 用forEach
// 设置方法，可不用手动引入，直接遍历数组进行引入
// 注册自定义指令
console.log(directives)
Object.keys(directives).forEach(key => {
  // key就是指令名称
  Vue.directive(key, directives[key])
})

Vue.use(components) // 注册自己的插件
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

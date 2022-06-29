// 权限拦截正在路由跳转 导航守卫
import router from '@/router' // 路由实例引入
import store from '@/store' // 引入vuex store实例
import nprogress from 'nprogress' // 引入进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404']
// 不需要导出，只要执行即可
// 前置守卫
// (to, from, next)  到哪儿去 ，从哪儿来 ，next是必须执行的钩子函
// next() 表示放过
router.beforeEach(async(to, from, next) => {
// 有token的情况下
  if (store.getters.token) {
    //   要去登录页面，跳出主页
    if (to.path === '/login') {
      next('/')
    } else {
    // 放行的时候需要用户资料
      if (!store.getters.userId) {
      // 如果没有id这个值 才会调用 vuex的获取资料的action
        await store.dispatch('user/getUserInfo')
      // 为什么要写await 因为我们想获取完资料再去放行
      }
      next()
    }
  } else {
    // 没有token值的情况
    if (whiteList.indexOf(to.path) > -1) {
    // 要去的地址在白名单上
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done()// 手动关闭
})
// 后置守卫
router.afterEach(function() {
  nprogress.done()// 关闭进度条
})

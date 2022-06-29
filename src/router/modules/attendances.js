import Layout from '@/layout'
// 员工的路由规则，是一个对象
export default {
  // 路由规则
  path: '/attendances',
  // 路由命名
  name: 'attendances',
  component: Layout,
  children: [{
    path: '',
    // 这里当二级路由的path什么都不写的时候
    // 表示该路由为当前二级路由的默认路由
    component: () => import('@/views/attendances'),
    // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
    meta: { title: '考勤', icon: 'skill' }
    // meta属性的里面的属性 随意定义 但是这里为什么要用title呢，
    //  因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
  }]
}

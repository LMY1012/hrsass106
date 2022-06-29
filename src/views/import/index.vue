<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async  success({ header, results }) {
      // header和results中的数据都是中文
      // 要与新增员工属性是一致的
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }

      // 方法1
      // 定义一个新数组
      // const arr = []
      // // 遍历获取的results数组
      // results.forEach(item => {
      //   // 定义一个对象接收循环数组的内容
      //   const userInfo = {}
      //   // 循环数组内容
      //   Object.keys(item).forEach(key => {
      //     // 将内容赋值给对象
      //     userInfo[userRelations[key]] = item[key]
      //   })
      //   // 加入数组
      //   arr.push(userInfo)
      // })

      // 方法二
      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          // key是中文的key  userRelations[key]是英文的
          // 判断是否是日期
          if (userRelations[key] === 'timeOfEntry1' || userRelations[key] === 'correctionTime1') {
            //  说明此时到了要转化日期 只要日期类型才需要转化
            // java后端接口 要求 如果日期类型 必须传date类型
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })

      await importEmployee(newArr) // 调用导入接口，接收一个数组
      this.$message.success('导入成功')
      this.$router.back()// 返回到上一页面
    },
    // 时间格式化
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }

  }}
</script>

<style>

</style>

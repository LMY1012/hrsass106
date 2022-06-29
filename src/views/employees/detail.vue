<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <!-- 绑定信息，增加校验规则 -->
            <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password">
                <el-input v-model="userInfo.password" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="个人详情">
            <!-- <user-info /> -->
            <!-- component中的is必须是动态变量 -->
            <component :is="userComponent" />
          </el-tab-pane>

          <el-tab-pane label="岗位信息">
            <component :is="jobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 保存员工的基本信息
// import { saveUserDetailById } from '@/api/employees'
// // 获取某个用户的基本信息
// import { getUserDetailById } from '@/api/user'
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import userInfo from './components/user-info.vue'
import jobInfo from './components/job-info.vue'
export default {
  components: { userInfo, jobInfo },
  data() {
    return {
      // 将动态路由参数id赋值给了userId这个属性
      userComponent: userInfo,
      jobComponent: jobInfo,
      // 这样可以后面直接通过 this.userId进行获取数据
      userId: this.$route.params.id,
      // 存放基本信息
      userInfo: {
        username: '',
        password: ''
      },
      //   校验规则
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 更新信息
    async saveUser() {
      try {
        // 校验
        await this.$refs.userForm.validate()
        await saveUserDetailById(this.userInfo) // 将新密码的值替换原密码的值
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>

<style>

</style>

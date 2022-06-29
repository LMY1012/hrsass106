<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 内容 -->
      <el-card>
        <el-tabs>
          <!-- 控制栏 -->
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <!-- 增加角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <!-- 表格头部 -->
              <el-table-column type="index" align="center" label="序号" width="120" />
              <el-table-column prop="name" align="center" label="角色名称" width="240" />
              <el-table-column prop="description" align="center" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 表格按钮 -->
                <!-- 作用域插槽 可以获取到点击的id值 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :total="page.total"
                :current-page="page.page"
                :page-size="page.pagesize"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 提示信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 公司详情 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.mailbox" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form></el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑弹层 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, updateRole, getRoleDetail, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 承接数组
      list: [],
      // 页码数
      page: {
        // 当前页码
        page: 1,
        // 每页的个数
        pagesize: 10,
        // 记录总数
        total: 0
      },
      // 承接公司信息
      formData: {
        // 公司信息
      },
      showDialog: false,
      // 接受表单数据
      roleForm: {},
      rules: {
        name: [{ required: true,
          message: '角色名称不能为空',
          trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },
  // 进行结构，获取companyId
  computed: {
    ...mapGetters(['companyId']),
    showTitle() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    // 获取员工列表
    async getRoleList() {
      // 获取数据
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    // 点击更换页码
    changePage(NewPage) {
      // newPage是当前点击的页码
      // 将当前页码赋值给当前的最新页码
      this.page.page = NewPage
      this.getRoleList()
    },
    // 获取公司信息
    async getCompanyInfo() {
      // 把获取的信息，用formData承接
      this.formData = await getCompanyInfo(this.getCompanyInfo)
    },
    // 删除员工信息
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑员工信息
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 点击成功
    async btnOK() {
      await this.$refs.roleForm.validate()
      // 只有校验通过的情况下 才会执行await的下方内容
      // roleForm这个对象有id就是编辑 没有id就是新增
      if (this.roleForm.id) {
        await updateRole(this.roleForm)
      } else {
        // 新增业务
        await addRole(this.roleForm)
      }
      // 重新拉取数据
      this.getRoleList()
      this.$message.success('操作成功')
      // 触发关闭事件
      this.showDialog = false
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验规则
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>

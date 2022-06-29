
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">一共有{{ page.total }}条数据</span>
        <template slot="after">
          <el-button size="small" type="success" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />

          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry" align="center">
            <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!--sync修饰符，是子组件去改变父组件数据的一个语法糖  -->
    <add-employee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getEmployeeList, delEmployee } from '@/api/employees'
// 引入新增员工
import AddEmployee from './components/add-employee'
// 格式化时间
import { formatDate } from '@/filters'
// 格式化聘用形式
import EmployeeEnum from '@/api/constant/employees'
export default {
  name: 'Dashboard',
  components: {
    AddEmployee
  },
  data() {
    return {
      loading: false,
      // 接受员工数据
      list: [],
      page: {
        // 当前页码
        page: 1,
        // 每页数据的数量
        size: 10,
        // 页面总数
        total: 0
      },
      // 控制弹出层
      showDialog: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      // 获取当前页码数
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 页面数，行数，聘用形式，
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        // 确认消息
        await this.$confirm('您确定删除该员工吗')
        // 删除信息
        await delEmployee(id)
        // 重新获取
        this.getEmployeeList()
        // 提示信息
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出数据
    exportData() {
      // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有的员工列表数据
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // rows是所有的员工列表数据
        // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]
        // 复杂表头
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        // 合并行
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        // excel导出的默认对象
        excel.export_json_to_excel({
          filename: '人力资源表',
          header: Object.keys(headers),
          data: this.formatJSON(headers, rows),
          multiHeader, // 复杂表头
          merges// 合并行
        })
      })
    },
    // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]
    // 数据的顺序是按照headers中key的顺序来的
    // 格式化json数据
    formatJSON(headers, rows) {
      // rows 是一行一行的  =>  [{},{}] => [[],[]]
      return rows.map(item => {
        // item {username: '张三', mobile: 123}  现在是对象 => []
        // ["姓名","手机号"] => [ '张三', '123']
        // 解剖开一层后，里面藏的是{}对象
        return Object.keys(headers).map(key => {
          // 格式化时间
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 格式化聘用形式
            // 这里会有变量重复问题
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            // 寻找聘用形式对应的文本内容
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    }
  }}
</script>

<style>

</style>

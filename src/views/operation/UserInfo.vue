<template>
  <div class="user-info">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>用戶基本信息</span>
        </div>
      </template>

      <!-- 搜尋條件 -->
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="團隊">
          <el-select v-model="searchForm.team" placeholder="請選擇團隊" clearable style="width: 200px;">
            <el-option label="團隊A" value="team_a" />
            <el-option label="團隊B" value="team_b" />
            <el-option label="團隊C" value="team_c" />
            <el-option label="團隊D" value="team_d" />
          </el-select>
        </el-form-item>
        <el-form-item label="用戶類型">
          <el-select v-model="searchForm.userType" placeholder="請選擇用戶類型" clearable style="width: 200px;">
            <el-option label="普通用戶" value="normal" />
            <el-option label="做市用戶" value="market_maker" />
            <el-option label="公司用戶" value="company" />
            <el-option label="扶持帶單用戶" value="support" />
            <el-option label="可疑用戶" value="suspicious" />
          </el-select>
        </el-form-item>
        <el-form-item label="UID">
          <el-input v-model="searchForm.uid" placeholder="請輸入UID" clearable />
        </el-form-item>
        <el-form-item label="KYC等級">
          <el-select v-model="searchForm.kycLevel" placeholder="請選擇KYC等級" clearable style="width: 150px;">
            <el-option label="初級" value="basic" />
            <el-option label="高級" value="advanced" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜尋</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 統計卡片 -->
      <div class="stats-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalUsers || 0 }}</div>
                <div class="stat-label">總用戶數</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.activeUsers || 0 }}</div>
                <div class="stat-label">活躍用戶</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.verifiedUsers || 0 }}</div>
                <div class="stat-label">已驗證用戶</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.todayLoginUsers || 0 }}</div>
                <div class="stat-label">今日登入用戶</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 數據表格 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="team" label="團隊" width="100" />
        <el-table-column prop="user_tag" label="用戶標籤" width="120" />
        <el-table-column prop="uid" label="UID" width="120" />
        <el-table-column prop="user_type" label="用戶類型" width="140">
          <template #default="scope">
            <el-tag :type="getUserTypeType(scope.row.user_type)">
              {{ getUserTypeText(scope.row.user_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="register_time" label="註冊時間" width="180" />
        <el-table-column prop="last_login_time" label="最後登入時間" width="180" />
        <el-table-column prop="kyc_level" label="KYC等級" width="100">
          <template #default="scope">
            <el-tag :type="getKycLevelType(scope.row.kyc_level)">
              {{ getKycLevelText(scope.row.kyc_level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="withdraw_banned" label="是否禁止提幣" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.withdraw_banned ? 'danger' : 'success'">
              {{ scope.row.withdraw_banned ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="spot_banned" label="是否禁止現貨交易" width="140">
          <template #default="scope">
            <el-tag :type="scope.row.spot_banned ? 'danger' : 'success'">
              {{ scope.row.spot_banned ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contract_banned" label="是否禁止合約交易" width="140">
          <template #default="scope">
            <el-tag :type="scope.row.contract_banned ? 'danger' : 'success'">
              {{ scope.row.contract_banned ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stats_date" label="統計日期" width="120" />
      </el-table>

      <!-- 分頁 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// import { operationReportAPI } from '@/api/operationReport' // 暫時註釋，使用模擬數據

export default {
  name: 'UserInfo',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const stats = ref({})

    const searchForm = reactive({
      team: '',
      userType: '',
      uid: '',
      kycLevel: ''
    })

    const pagination = reactive({
      currentPage: 1,
      pageSize: 20,
      total: 0
    })

    // 獲取數據
    const fetchData = async () => {
      loading.value = true
      try {
        // const params = {
        //   ...searchForm,
        //   page: pagination.currentPage,
        //   pageSize: pagination.pageSize
        // }

        // 模擬數據 - 實際開發時請移除這段代碼
        const mockData = [
          {
            team: '團隊A',
            user_tag: 'VIP用戶',
            uid: 'U001',
            user_type: 'normal',
            register_time: '2024-01-15 10:30:00',
            last_login_time: '2024-01-20 14:25:00',
            kyc_level: 'advanced',
            withdraw_banned: false,
            spot_banned: false,
            contract_banned: false,
            stats_date: '2024-01-20'
          },
          {
            team: '團隊B',
            user_tag: '做市商',
            uid: 'U002',
            user_type: 'market_maker',
            register_time: '2024-01-10 09:15:00',
            last_login_time: '2024-01-20 16:45:00',
            kyc_level: 'advanced',
            withdraw_banned: false,
            spot_banned: false,
            contract_banned: false,
            stats_date: '2024-01-20'
          },
          {
            team: '團隊A',
            user_tag: '公司賬戶',
            uid: 'U003',
            user_type: 'company',
            register_time: '2024-01-05 11:20:00',
            last_login_time: '2024-01-19 13:10:00',
            kyc_level: 'advanced',
            withdraw_banned: false,
            spot_banned: false,
            contract_banned: false,
            stats_date: '2024-01-20'
          },
          {
            team: '團隊C',
            user_tag: '扶持用戶',
            uid: 'U004',
            user_type: 'support',
            register_time: '2024-01-12 15:45:00',
            last_login_time: '2024-01-20 10:30:00',
            kyc_level: 'basic',
            withdraw_banned: false,
            spot_banned: false,
            contract_banned: false,
            stats_date: '2024-01-20'
          },
          {
            team: '團隊D',
            user_tag: '可疑賬戶',
            uid: 'U005',
            user_type: 'suspicious',
            register_time: '2024-01-08 16:20:00',
            last_login_time: '2024-01-18 12:15:00',
            kyc_level: 'basic',
            withdraw_banned: true,
            spot_banned: true,
            contract_banned: true,
            stats_date: '2024-01-20'
          }
        ]

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        tableData.value = mockData
        pagination.total = mockData.length

        // 更新統計數據
        stats.value = {
          totalUsers: mockData.length,
          activeUsers: mockData.filter(item => !item.withdraw_banned).length,
          verifiedUsers: mockData.filter(item => item.kyc_level === 'advanced').length,
          todayLoginUsers: mockData.filter(item => item.last_login_time.includes('2024-01-20')).length
        }

        // 實際 API 調用 - 取消註釋以下代碼並移除模擬數據
        // const [usersRes, statsRes] = await Promise.all([
        //   operationReportAPI.getUserInfoList(params),
        //   operationReportAPI.getUserStats()
        // ])
        // tableData.value = usersRes.data.data || []
        // pagination.total = usersRes.data.total || 0
        // stats.value = statsRes.data || {}
      } catch (error) {
        console.error('獲取數據失敗:', error)
        ElMessage.error('獲取數據失敗')
      } finally {
        loading.value = false
      }
    }

    // 搜尋
    const handleSearch = () => {
      pagination.currentPage = 1
      fetchData()
    }

    // 重置
    const handleReset = () => {
      Object.assign(searchForm, {
        team: '',
        userType: '',
        uid: '',
        kycLevel: ''
      })
      pagination.currentPage = 1
      fetchData()
    }

    // 分頁處理
    const handleSizeChange = (val) => {
      pagination.pageSize = val
      fetchData()
    }

    const handleCurrentChange = (val) => {
      pagination.currentPage = val
      fetchData()
    }

    // 用戶類型處理
    const getUserTypeType = (userType) => {
      const typeMap = {
        'normal': 'info',
        'market_maker': 'success',
        'company': 'warning',
        'support': 'primary',
        'suspicious': 'danger'
      }
      return typeMap[userType] || 'info'
    }

    const getUserTypeText = (userType) => {
      const typeMap = {
        'normal': '普通用戶',
        'market_maker': '做市用戶',
        'company': '公司用戶',
        'support': '扶持帶單用戶',
        'suspicious': '可疑用戶'
      }
      return typeMap[userType] || userType
    }

    // KYC等級處理
    const getKycLevelType = (level) => {
      return level === 'advanced' ? 'success' : 'warning'
    }

    const getKycLevelText = (level) => {
      return level === 'advanced' ? '高級' : '初級'
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      tableData,
      stats,
      searchForm,
      pagination,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      getUserTypeType,
      getUserTypeText,
      getKycLevelType,
      getKycLevelText
    }
  }
}
</script>

<style scoped>
.user-info {
  height: 100%;
}

.page-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 10px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 
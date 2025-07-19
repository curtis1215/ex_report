<template>
  <div class="broker-data">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>經紀人數據</span>
        </div>
      </template>

      <!-- 搜尋條件 -->
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="經紀人ID">
          <el-input v-model="searchForm.brokerId" placeholder="請輸入經紀人ID" clearable />
        </el-form-item>
        <el-form-item label="狀態">
          <el-select v-model="searchForm.status" placeholder="請選擇狀態" clearable>
            <el-option label="活躍" value="active" />
            <el-option label="非活躍" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜尋</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 數據表格 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="pid" label="PID" width="120" />
        <el-table-column prop="enterprise_manager_id" label="企業經理ID" width="140" />
        <el-table-column prop="enterprise_supervisor_id" label="企業主管ID" width="140" />
        <el-table-column prop="enterprise_agent_id" label="企業主管下級高級代理ID" width="200" />
        <el-table-column prop="rebate_fees" label="返傭手續費" width="140">
          <template #default="scope">
            <el-tooltip :content="`${scope.row.rebate_fees >= 0 ? '+' : ''}${scope.row.rebate_fees.toLocaleString()}`" placement="top">
              <span :class="scope.row.rebate_fees >= 0 ? 'positive' : 'negative'">
                {{ scope.row.rebate_fees >= 0 ? '+' : '' }}{{ formatAmount(scope.row.rebate_fees) }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="reward_payment" label="獎勵發放" width="140">
          <template #default="scope">
            <el-tooltip :content="`${scope.row.reward_payment >= 0 ? '+' : ''}${scope.row.reward_payment.toLocaleString()}`" placement="top">
              <span :class="scope.row.reward_payment >= 0 ? 'positive' : 'negative'">
                {{ scope.row.reward_payment >= 0 ? '+' : '' }}{{ formatAmount(scope.row.reward_payment) }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="platform_expense" label="平台支出" width="140">
          <template #default="scope">
            <el-tooltip :content="scope.row.platform_expense.toLocaleString()" placement="top">
              <span class="negative">{{ formatAmount(scope.row.platform_expense) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="platform_income" label="平台收入" width="140">
          <template #default="scope">
            <el-tooltip :content="scope.row.platform_income.toLocaleString()" placement="top">
              <span class="positive">{{ formatAmount(scope.row.platform_income) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
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
  name: 'BrokerData',
  setup() {
    const loading = ref(false)
    const tableData = ref([])

    const searchForm = reactive({
      brokerId: '',
      status: ''
    })

    const pagination = reactive({
      currentPage: 1,
      pageSize: 20,
      total: 0
    })

    // 格式化金額
    const formatAmount = (amount) => {
      if (amount >= 1000000) {
        return (amount / 1000000).toFixed(2) + 'M'
      } else if (amount >= 1000) {
        return (amount / 1000).toFixed(2) + 'K'
      }
      return amount.toLocaleString()
    }

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
            pid: 'PID001',
            enterprise_manager_id: 'EM001',
            enterprise_supervisor_id: 'ES001',
            enterprise_agent_id: 'EA001',
            rebate_fees: 125000,
            reward_payment: 89000,
            platform_expense: 456000,
            platform_income: 2340000
          },
          {
            pid: 'PID002',
            enterprise_manager_id: 'EM002',
            enterprise_supervisor_id: 'ES002',
            enterprise_agent_id: 'EA002',
            rebate_fees: 98000,
            reward_payment: 67000,
            platform_expense: 345000,
            platform_income: 1890000
          },
          {
            pid: 'PID003',
            enterprise_manager_id: 'EM003',
            enterprise_supervisor_id: 'ES003',
            enterprise_agent_id: 'EA003',
            rebate_fees: 156000,
            reward_payment: 112000,
            platform_expense: 567000,
            platform_income: 2980000
          },
          {
            pid: 'PID004',
            enterprise_manager_id: 'EM004',
            enterprise_supervisor_id: 'ES004',
            enterprise_agent_id: 'EA004',
            rebate_fees: 89000,
            reward_payment: 45000,
            platform_expense: 234000,
            platform_income: 1450000
          },
          {
            pid: 'PID005',
            enterprise_manager_id: 'EM005',
            enterprise_supervisor_id: 'ES005',
            enterprise_agent_id: 'EA005',
            rebate_fees: 178000,
            reward_payment: 134000,
            platform_expense: 678000,
            platform_income: 3450000
          }
        ]

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        tableData.value = mockData
        pagination.total = mockData.length

        // 實際 API 調用 - 取消註釋以下代碼並移除模擬數據
        // const response = await operationReportAPI.getBrokerList(params)
        // tableData.value = response.data.data || []
        // pagination.total = response.data.total || 0
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
        brokerId: '',
        status: ''
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

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      tableData,
      searchForm,
      pagination,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      formatAmount
    }
  }
}
</script>

<style scoped>
.broker-data {
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

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.positive {
  color: #67c23a;
  font-weight: bold;
}

.negative {
  color: #f56c6c;
  font-weight: bold;
}
</style> 
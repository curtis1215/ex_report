<template>
  <div class="contract-pair-details">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>合約交易對明細</span>
        </div>
      </template>

      <!-- 搜尋條件 -->
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="團隊">
          <el-select v-model="searchForm.team" placeholder="請選擇團隊" clearable style="width: 200px;">
            <el-option label="團隊A" value="team_a" />
            <el-option label="團隊B" value="team_b" />
            <el-option label="團隊C" value="team_c" />
          </el-select>
        </el-form-item>
        <el-form-item label="合約名">
          <el-input v-model="searchForm.contractName" placeholder="請輸入合約名" clearable />
        </el-form-item>
        <el-form-item label="開始日期">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            placeholder="選擇開始日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="結束日期">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            placeholder="選擇結束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜尋</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 統計卡片 -->
      <div class="stats-cards">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalUsers || 0 }}</div>
                <div class="stat-label">昨日交易用戶數</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalTrades || 0 }}</div>
                <div class="stat-label">昨日交易總筆數</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ formatAmount(stats.totalAmount) || 0 }}</div>
                <div class="stat-label">昨日累計交易額</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ formatAmount(stats.totalFees) || 0 }}</div>
                <div class="stat-label">昨日總手續費</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number" :class="stats.totalProfit >= 0 ? 'positive' : 'negative'">
                  {{ stats.totalProfit >= 0 ? '+' : '' }}{{ formatAmount(stats.totalProfit) || 0 }}
                </div>
                <div class="stat-label">昨日淨盈虧</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.contractCount || 0 }}</div>
                <div class="stat-label">合約數量</div>
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
        <el-table-column prop="contract_name" label="合約名" width="120" />
        <el-table-column prop="user_count" label="昨日交易用戶數" width="140" />
        <el-table-column prop="total_trades" label="昨日交易總筆數" width="140" />
        <el-table-column prop="real_money_amount" label="昨日真金交易額" width="140" />
        <el-table-column prop="demo_money_amount" label="昨日體驗金交易額" width="140" />
        <el-table-column prop="total_amount" label="昨日累計交易額" width="140" />
        <el-table-column prop="real_money_fees" label="昨日真金交易手續費" width="160" />
        <el-table-column prop="demo_money_fees" label="昨日體驗金手續費" width="160" />
        <el-table-column prop="total_fees" label="昨日總手續費" width="140" />
        <el-table-column prop="real_money_profit" label="昨日真金淨盈虧" width="140">
          <template #default="scope">
            <span :class="scope.row.real_money_profit >= 0 ? 'positive' : 'negative'">
              {{ scope.row.real_money_profit >= 0 ? '+' : '' }}{{ scope.row.real_money_profit }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="demo_money_profit" label="昨日體驗金淨盈虧" width="150">
          <template #default="scope">
            <span :class="scope.row.demo_money_profit >= 0 ? 'positive' : 'negative'">
              {{ scope.row.demo_money_profit >= 0 ? '+' : '' }}{{ scope.row.demo_money_profit }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="total_profit" label="昨日淨盈虧" width="120">
          <template #default="scope">
            <span :class="scope.row.total_profit >= 0 ? 'positive' : 'negative'">
              {{ scope.row.total_profit >= 0 ? '+' : '' }}{{ scope.row.total_profit }}
            </span>
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
// import { User, Document, Money, TrendCharts } from '@element-plus/icons-vue'
// import { marketReportAPI } from '@/api/marketReport' // 暫時註釋，使用模擬數據

export default {
  name: 'ContractPairDetails',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const stats = reactive({
      totalUsers: 0,
      totalTrades: 0,
      totalAmount: 0,
      totalFees: 0,
      totalProfit: 0,
      contractCount: 0
    })

    const searchForm = reactive({
      team: '',
      contractName: '',
      startDate: '',
      endDate: ''
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
            contract_name: 'BTCUSDT',
            user_count: 45,
            total_trades: 156,
            real_money_amount: 1250000,
            demo_money_amount: 320000,
            total_amount: 1570000,
            real_money_fees: 1250,
            demo_money_fees: 320,
            total_fees: 1570,
            real_money_profit: 25000,
            demo_money_profit: -5000,
            total_profit: 20000
          },
          {
            team: '團隊B',
            contract_name: 'ETHUSDT',
            user_count: 38,
            total_trades: 128,
            real_money_amount: 890000,
            demo_money_amount: 210000,
            total_amount: 1100000,
            real_money_fees: 890,
            demo_money_fees: 210,
            total_fees: 1100,
            real_money_profit: 18000,
            demo_money_profit: 3000,
            total_profit: 21000
          },
          {
            team: '團隊A',
            contract_name: 'BNBUSDT',
            user_count: 52,
            total_trades: 189,
            real_money_amount: 1560000,
            demo_money_amount: 420000,
            total_amount: 1980000,
            real_money_fees: 1560,
            demo_money_fees: 420,
            total_fees: 1980,
            real_money_profit: -8000,
            demo_money_profit: 4000,
            total_profit: -4000
          },
          {
            team: '團隊C',
            contract_name: 'ADAUSDT',
            user_count: 28,
            total_trades: 95,
            real_money_amount: 680000,
            demo_money_amount: 180000,
            total_amount: 860000,
            real_money_fees: 680,
            demo_money_fees: 180,
            total_fees: 860,
            real_money_profit: 12000,
            demo_money_profit: -2000,
            total_profit: 10000
          }
        ]

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        tableData.value = mockData
        pagination.total = mockData.length

        // 計算統計數據
        calculateStats(mockData)

        // 實際 API 調用 - 取消註釋以下代碼並移除模擬數據
        // const response = await marketReportAPI.getContractPairDetails(params)
        // tableData.value = response.data.data || []
        // pagination.total = response.data.total || 0
        // calculateStats(response.data.data || [])
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
        contractName: '',
        startDate: '',
        endDate: ''
      })
      pagination.currentPage = 1
      fetchData()
    }

    // 計算統計數據
    const calculateStats = (data) => {
      stats.totalUsers = data.reduce((sum, item) => sum + item.user_count, 0)
      stats.totalTrades = data.reduce((sum, item) => sum + item.total_trades, 0)
      stats.totalAmount = data.reduce((sum, item) => sum + item.total_amount, 0)
      stats.totalFees = data.reduce((sum, item) => sum + item.total_fees, 0)
      stats.totalProfit = data.reduce((sum, item) => sum + item.total_profit, 0)
      stats.contractCount = data.length
    }

    // 格式化金額
    const formatAmount = (amount) => {
      if (amount >= 1000000) {
        return (amount / 1000000).toFixed(2) + 'M'
      } else if (amount >= 1000) {
        return (amount / 1000).toFixed(2) + 'K'
      }
      return amount.toLocaleString()
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
      stats,
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
.contract-pair-details {
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

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-content {
  text-align: center;
  padding: 20px 0;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
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
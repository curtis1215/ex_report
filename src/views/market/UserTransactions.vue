<template>
  <div class="user-transactions">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>用戶交易明細</span>
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
        <el-form-item label="UID">
          <el-input v-model="searchForm.uid" placeholder="請輸入UID" clearable />
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
                <div class="stat-number">{{ stats.totalTrades || 0 }}</div>
                <div class="stat-label">昨日交易總筆數</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.realMoneyTrades || 0 }}</div>
                <div class="stat-label">昨日真金交易</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.demoMoneyTrades || 0 }}</div>
                <div class="stat-label">昨日體驗金交易</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalAmount || 0 }}</div>
                <div class="stat-label">昨日累計交易額</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalFees || 0 }}</div>
                <div class="stat-label">昨日總手續費</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalProfit || 0 }}</div>
                <div class="stat-label">昨日淨盈虧</div>
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
        <el-table-column prop="uid" label="UID" width="120" />
        <el-table-column prop="contract_name" label="合約名" width="120" />
        <el-table-column prop="total_trades" label="昨日交易總筆數" width="140" />
        <el-table-column prop="real_money_trades" label="昨日真金交易" width="130" />
        <el-table-column prop="demo_money_trades" label="昨日體驗金交易" width="140" />
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
// import { marketReportAPI } from '@/api/marketReport' // 暫時註釋，使用模擬數據

export default {
  name: 'UserTransactions',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const stats = ref({})

    const searchForm = reactive({
      team: '',
      uid: '',
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
            uid: 'U001',
            contract_name: 'BTCUSDT',
            total_trades: 25,
            real_money_trades: 15,
            demo_money_trades: 10,
            total_amount: 125000,
            real_money_fees: 125,
            demo_money_fees: 50,
            total_fees: 175,
            real_money_profit: 2500,
            demo_money_profit: -500,
            total_profit: 2000
          },
          {
            team: '團隊B',
            uid: 'U002',
            contract_name: 'ETHUSDT',
            total_trades: 18,
            real_money_trades: 12,
            demo_money_trades: 6,
            total_amount: 89000,
            real_money_fees: 89,
            demo_money_fees: 30,
            total_fees: 119,
            real_money_profit: 1800,
            demo_money_profit: 300,
            total_profit: 2100
          },
          {
            team: '團隊A',
            uid: 'U003',
            contract_name: 'BNBUSDT',
            total_trades: 32,
            real_money_trades: 20,
            demo_money_trades: 12,
            total_amount: 156000,
            real_money_fees: 156,
            demo_money_fees: 60,
            total_fees: 216,
            real_money_profit: -800,
            demo_money_profit: 400,
            total_profit: -400
          }
        ]

        const mockStats = {
          totalTrades: 75,
          realMoneyTrades: 47,
          demoMoneyTrades: 28,
          totalAmount: 370000,
          totalFees: 510,
          totalProfit: 3700
        }

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        tableData.value = mockData
        pagination.total = mockData.length
        stats.value = mockStats

        // 實際 API 調用 - 取消註釋以下代碼並移除模擬數據
        // const [transactionsRes, statsRes] = await Promise.all([
        //   marketReportAPI.getUserTransactions(params),
        //   marketReportAPI.getUserTransactionStats(searchForm)
        // ])
        // tableData.value = transactionsRes.data.data || []
        // pagination.total = transactionsRes.data.total || 0
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
        uid: '',
        contractName: '',
        startDate: '',
        endDate: ''
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
      stats,
      searchForm,
      pagination,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.user-transactions {
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

.positive {
  color: #67c23a;
  font-weight: bold;
}

.negative {
  color: #f56c6c;
  font-weight: bold;
}
</style> 
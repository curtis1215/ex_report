<template>
  <div class="trading-overview">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>交易統計總覽</span>
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

      <!-- 實時統計卡片 -->
      <div class="stats-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ realTimeData.todayTrades || 0 }}</div>
                <div class="stat-label">今日交易筆數</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ realTimeData.todayUsers || 0 }}</div>
                <div class="stat-label">今日活躍用戶</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ realTimeData.todayVolume || 0 }}</div>
                <div class="stat-label">今日交易量</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ realTimeData.todayValue || 0 }}</div>
                <div class="stat-label">今日交易額</div>
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
        style="width: 100%; margin-top: 20px;"
      >
        <el-table-column prop="team" label="團隊" width="120" />
        <el-table-column prop="user_count" label="昨日交易用戶數" width="140" />
        <el-table-column prop="total_trades" label="昨日交易總筆數" width="140" />
        <el-table-column prop="real_money_amount" label="昨日真金交易額" width="140" />
        <el-table-column prop="demo_money_amount" label="昨日體驗金交易額" width="140" />
        <el-table-column prop="total_amount" label="昨日累計交易額" width="140" />
        <el-table-column prop="real_money_fees" label="昨日真金交易手續費" width="160" />
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
  name: 'TradingOverview',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const realTimeData = ref({})

    const searchForm = reactive({
      team: '',
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
            user_count: 156,
            total_trades: 892,
            real_money_amount: 4560000,
            demo_money_amount: 1200000,
            total_amount: 5760000,
            real_money_fees: 4560,
            real_money_profit: 125000,
            demo_money_profit: -15000,
            total_profit: 110000
          },
          {
            team: '團隊B',
            user_count: 134,
            total_trades: 756,
            real_money_amount: 3890000,
            demo_money_amount: 980000,
            total_amount: 4870000,
            real_money_fees: 3890,
            real_money_profit: 98000,
            demo_money_profit: 8000,
            total_profit: 106000
          },
          {
            team: '團隊C',
            user_count: 98,
            total_trades: 523,
            real_money_amount: 2670000,
            demo_money_amount: 720000,
            total_amount: 3390000,
            real_money_fees: 2670,
            real_money_profit: -25000,
            demo_money_profit: 12000,
            total_profit: -13000
          },
          {
            team: '團隊D',
            user_count: 87,
            total_trades: 445,
            real_money_amount: 2340000,
            demo_money_amount: 650000,
            total_amount: 2990000,
            real_money_fees: 2340,
            real_money_profit: 67000,
            demo_money_profit: -8000,
            total_profit: 59000
          }
        ]

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        tableData.value = mockData
        pagination.total = mockData.length

        // 更新實時數據
        realTimeData.value = {
          todayTrades: mockData.reduce((sum, item) => sum + item.total_trades, 0),
          todayUsers: mockData.reduce((sum, item) => sum + item.user_count, 0),
          todayVolume: mockData.reduce((sum, item) => sum + item.total_amount, 0),
          todayValue: mockData.reduce((sum, item) => sum + item.total_amount, 0)
        }

        // 實際 API 調用 - 取消註釋以下代碼並移除模擬數據
        // const [overviewRes, realTimeRes] = await Promise.all([
        //   marketReportAPI.getTradingOverview(params),
        //   marketReportAPI.getRealTimeTradingData()
        // ])
        // tableData.value = overviewRes.data.data || []
        // pagination.total = overviewRes.data.total || 0
        // realTimeData.value = realTimeRes.data || {}
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
      realTimeData,
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
.trading-overview {
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
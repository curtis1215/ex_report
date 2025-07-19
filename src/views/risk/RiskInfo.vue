<template>
  <div class="risk-info">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>風控信息</span>
        </div>
      </template>

      <!-- 搜尋條件 -->
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="用戶UID">
          <el-input v-model="searchForm.userUid" placeholder="請輸入用戶UID" clearable />
        </el-form-item>
        <el-form-item label="郵箱">
          <el-input v-model="searchForm.email" placeholder="請輸入郵箱" clearable />
        </el-form-item>
        <el-form-item label="數據日期">
          <el-date-picker
            v-model="searchForm.dataDate"
            type="date"
            placeholder="請選擇數據日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            clearable
          />
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
        max-height="600"
      >
        <el-table-column prop="user_uid" label="用戶UID" width="120" fixed="left" />
        <el-table-column prop="email" label="郵箱" width="180" fixed="left" />
        
        <!-- 企業主管信息 -->
        <el-table-column prop="enterprise_supervisor_info" label="企業主管信息" width="150">
          <template #default="scope">
            {{ scope.row.enterprise_supervisor_name }}({{ scope.row.enterprise_supervisor_uid }})
          </template>
        </el-table-column>
        
        <!-- 市場經理信息 -->
        <el-table-column prop="market_manager_info" label="市場經理信息" width="150">
          <template #default="scope">
            {{ scope.row.market_manager_name }}({{ scope.row.market_manager_uid }})
          </template>
        </el-table-column>
        
        <!-- 高級代理人信息 -->
        <el-table-column prop="senior_agent_info" label="高級代理人信息" width="150">
          <template #default="scope">
            {{ scope.row.senior_agent_name }}({{ scope.row.senior_agent_uid }})
          </template>
        </el-table-column>
        
        <!-- 普通代理人信息 -->
        <el-table-column prop="normal_agent_info" label="普通代理人信息" width="150">
          <template #default="scope">
            {{ scope.row.normal_agent_name }}({{ scope.row.normal_agent_uid }})
          </template>
        </el-table-column>
        
        <!-- 交易次數 -->
        <el-table-column prop="total_open_count" label="總開倉次數" width="120" />
        <el-table-column prop="total_close_count" label="總平倉次數" width="120" />
        
        <!-- 交易額 -->
        <el-table-column prop="real_money_trading_amount" label="真金交易額" width="140">
          <template #default="scope">
            <el-tooltip :content="scope.row.real_money_trading_amount.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.real_money_trading_amount) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="experience_money_trading_amount" label="體驗金交易額" width="140">
          <template #default="scope">
            <el-tooltip :content="scope.row.experience_money_trading_amount.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.experience_money_trading_amount) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="total_trading_amount" label="累計交易額" width="140">
          <template #default="scope">
            <el-tooltip :content="scope.row.total_trading_amount.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.total_trading_amount) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <!-- 昨日盈虧 -->
        <el-table-column prop="yesterday_real_money_pnl" label="昨日真金淨盈虧" width="160">
          <template #default="scope">
            <el-tooltip :content="`${scope.row.yesterday_real_money_pnl >= 0 ? '+' : ''}${scope.row.yesterday_real_money_pnl.toLocaleString()}`" placement="top">
              <span :class="scope.row.yesterday_real_money_pnl >= 0 ? 'positive' : 'negative'">
                {{ scope.row.yesterday_real_money_pnl >= 0 ? '+' : '' }}{{ formatAmount(scope.row.yesterday_real_money_pnl) }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="yesterday_experience_money_pnl" label="昨日體驗金淨盈虧" width="160">
          <template #default="scope">
            <el-tooltip :content="`${scope.row.yesterday_experience_money_pnl >= 0 ? '+' : ''}${scope.row.yesterday_experience_money_pnl.toLocaleString()}`" placement="top">
              <span :class="scope.row.yesterday_experience_money_pnl >= 0 ? 'positive' : 'negative'">
                {{ scope.row.yesterday_experience_money_pnl >= 0 ? '+' : '' }}{{ formatAmount(scope.row.yesterday_experience_money_pnl) }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="yesterday_total_pnl" label="昨日淨盈虧" width="140">
          <template #default="scope">
            <el-tooltip :content="`${scope.row.yesterday_total_pnl >= 0 ? '+' : ''}${scope.row.yesterday_total_pnl.toLocaleString()}`" placement="top">
              <span :class="scope.row.yesterday_total_pnl >= 0 ? 'positive' : 'negative'">
                {{ scope.row.yesterday_total_pnl >= 0 ? '+' : '' }}{{ formatAmount(scope.row.yesterday_total_pnl) }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <!-- 手續費 -->
        <el-table-column prop="real_money_fee" label="真金交易手續費" width="160">
          <template #default="scope">
            <el-tooltip :content="scope.row.real_money_fee.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.real_money_fee) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="experience_money_fee" label="體驗金手續費" width="160">
          <template #default="scope">
            <el-tooltip :content="scope.row.experience_money_fee.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.experience_money_fee) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="total_fee" label="總手續費" width="140">
          <template #default="scope">
            <el-tooltip :content="scope.row.total_fee.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.total_fee) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <!-- 歷史累加 -->
        <el-table-column prop="historical_position_fee" label="歷史累加寸頭/手續費" width="180">
          <template #default="scope">
            <el-tooltip :content="scope.row.historical_position_fee.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.historical_position_fee) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <!-- 資金費用 -->
        <el-table-column prop="real_money_funding_fee" label="真金資金費用" width="160">
          <template #default="scope">
            <el-tooltip :content="scope.row.real_money_funding_fee.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.real_money_funding_fee) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="experience_money_funding_fee" label="體驗金資金費用" width="160">
          <template #default="scope">
            <el-tooltip :content="scope.row.experience_money_funding_fee.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.experience_money_funding_fee) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="total_funding_fee" label="總資金費用" width="140">
          <template #default="scope">
            <el-tooltip :content="scope.row.total_funding_fee.toLocaleString()" placement="top">
              <span>{{ formatAmount(scope.row.total_funding_fee) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <!-- 返傭和勝率 -->
        <el-table-column prop="rebate_amount" label="返傭金額" width="140">
          <template #default="scope">
            <el-tooltip :content="scope.row.rebate_amount.toLocaleString()" placement="top">
              <span class="positive">{{ formatAmount(scope.row.rebate_amount) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="daily_win_rate" label="當日勝率" width="120">
          <template #default="scope">
            <span>{{ (scope.row.daily_win_rate * 100).toFixed(2) }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="total_win_rate" label="總勝率" width="120">
          <template #default="scope">
            <span>{{ (scope.row.total_win_rate * 100).toFixed(2) }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="data_date" label="數據日期" width="120" fixed="right" />
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
// import { riskManagementAPI } from '@/api/riskManagement' // 暫時註釋，使用模擬數據

export default {
  name: 'RiskInfo',
  setup() {
    const loading = ref(false)
    const tableData = ref([])

    const searchForm = reactive({
      userUid: '',
      email: '',
      dataDate: ''
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
        // 模擬數據 - 實際開發時請移除這段代碼
        const mockData = [
          {
            user_uid: 'UID001',
            email: 'user001@example.com',
            enterprise_supervisor_name: '張主管',
            enterprise_supervisor_uid: 'ES001',
            market_manager_name: '李經理',
            market_manager_uid: 'MM001',
            senior_agent_name: '王高級代理',
            senior_agent_uid: 'SA001',
            normal_agent_name: '趙普通代理',
            normal_agent_uid: 'NA001',
            total_open_count: 156,
            total_close_count: 142,
            real_money_trading_amount: 2340000,
            experience_money_trading_amount: 890000,
            total_trading_amount: 3230000,
            yesterday_real_money_pnl: 125000,
            yesterday_experience_money_pnl: 45000,
            yesterday_total_pnl: 170000,
            real_money_fee: 23400,
            experience_money_fee: 8900,
            total_fee: 32300,
            historical_position_fee: 156000,
            real_money_funding_fee: 12300,
            experience_money_funding_fee: 4500,
            total_funding_fee: 16800,
            rebate_amount: 89000,
            daily_win_rate: 0.68,
            total_win_rate: 0.72,
            data_date: '2024-01-15'
          },
          {
            user_uid: 'UID002',
            email: 'user002@example.com',
            enterprise_supervisor_name: '陳主管',
            enterprise_supervisor_uid: 'ES002',
            market_manager_name: '劉經理',
            market_manager_uid: 'MM002',
            senior_agent_name: '孫高級代理',
            senior_agent_uid: 'SA002',
            normal_agent_name: '周普通代理',
            normal_agent_uid: 'NA002',
            total_open_count: 89,
            total_close_count: 87,
            real_money_trading_amount: 1560000,
            experience_money_trading_amount: 567000,
            total_trading_amount: 2127000,
            yesterday_real_money_pnl: -45000,
            yesterday_experience_money_pnl: 12000,
            yesterday_total_pnl: -33000,
            real_money_fee: 15600,
            experience_money_fee: 5670,
            total_fee: 21270,
            historical_position_fee: 89000,
            real_money_funding_fee: 8200,
            experience_money_funding_fee: 2800,
            total_funding_fee: 11000,
            rebate_amount: 67000,
            daily_win_rate: 0.45,
            total_win_rate: 0.58,
            data_date: '2024-01-15'
          },
          {
            user_uid: 'UID003',
            email: 'user003@example.com',
            enterprise_supervisor_name: '吳主管',
            enterprise_supervisor_uid: 'ES003',
            market_manager_name: '鄭經理',
            market_manager_uid: 'MM003',
            senior_agent_name: '馮高級代理',
            senior_agent_uid: 'SA003',
            normal_agent_name: '蔣普通代理',
            normal_agent_uid: 'NA003',
            total_open_count: 234,
            total_close_count: 228,
            real_money_trading_amount: 3450000,
            experience_money_trading_amount: 1230000,
            total_trading_amount: 4680000,
            yesterday_real_money_pnl: 234000,
            yesterday_experience_money_pnl: 89000,
            yesterday_total_pnl: 323000,
            real_money_fee: 34500,
            experience_money_fee: 12300,
            total_fee: 46800,
            historical_position_fee: 234000,
            real_money_funding_fee: 18200,
            experience_money_funding_fee: 6500,
            total_funding_fee: 24700,
            rebate_amount: 156000,
            daily_win_rate: 0.78,
            total_win_rate: 0.75,
            data_date: '2024-01-15'
          },
          {
            user_uid: 'UID004',
            email: 'user004@example.com',
            enterprise_supervisor_name: '何主管',
            enterprise_supervisor_uid: 'ES004',
            market_manager_name: '呂經理',
            market_manager_uid: 'MM004',
            senior_agent_name: '施高級代理',
            senior_agent_uid: 'SA004',
            normal_agent_name: '孔普通代理',
            normal_agent_uid: 'NA004',
            total_open_count: 67,
            total_close_count: 65,
            real_money_trading_amount: 890000,
            experience_money_trading_amount: 345000,
            total_trading_amount: 1235000,
            yesterday_real_money_pnl: -12000,
            yesterday_experience_money_pnl: -8000,
            yesterday_total_pnl: -20000,
            real_money_fee: 8900,
            experience_money_fee: 3450,
            total_fee: 12350,
            historical_position_fee: 67000,
            real_money_funding_fee: 4700,
            experience_money_funding_fee: 1800,
            total_funding_fee: 6500,
            rebate_amount: 45000,
            daily_win_rate: 0.32,
            total_win_rate: 0.48,
            data_date: '2024-01-15'
          },
          {
            user_uid: 'UID005',
            email: 'user005@example.com',
            enterprise_supervisor_name: '黃主管',
            enterprise_supervisor_uid: 'ES005',
            market_manager_name: '馬經理',
            market_manager_uid: 'MM005',
            senior_agent_name: '朱高級代理',
            senior_agent_uid: 'SA005',
            normal_agent_name: '胡普通代理',
            normal_agent_uid: 'NA005',
            total_open_count: 189,
            total_close_count: 185,
            real_money_trading_amount: 2780000,
            experience_money_trading_amount: 987000,
            total_trading_amount: 3767000,
            yesterday_real_money_pnl: 89000,
            yesterday_experience_money_pnl: 34000,
            yesterday_total_pnl: 123000,
            real_money_fee: 27800,
            experience_money_fee: 9870,
            total_fee: 37670,
            historical_position_fee: 189000,
            real_money_funding_fee: 14600,
            experience_money_funding_fee: 5200,
            total_funding_fee: 19800,
            rebate_amount: 112000,
            daily_win_rate: 0.65,
            total_win_rate: 0.69,
            data_date: '2024-01-15'
          }
        ]

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        tableData.value = mockData
        pagination.total = mockData.length

        // 實際 API 調用 - 取消註釋以下代碼並移除模擬數據
        // const params = {
        //   ...searchForm,
        //   page: pagination.currentPage,
        //   pageSize: pagination.pageSize
        // }
        // const response = await riskManagementAPI.getRiskInfoList(params)
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
        userUid: '',
        email: '',
        dataDate: ''
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
.risk-info {
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
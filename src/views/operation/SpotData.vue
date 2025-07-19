<template>
  <div class="spot-data">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>現貨數據</span>
        </div>
      </template>

      <!-- 搜尋條件 -->
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="查詢日期">
          <el-date-picker
            v-model="searchForm.queryDate"
            type="date"
            placeholder="選擇查詢日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查詢</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 統計卡片 -->
      <div class="stats-cards" v-loading="loading">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-tooltip :content="`精確金額: ${formatExactAmount(spotData.depositAmount)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(spotData.depositAmount) || 0 }}</div>
                  <div class="stat-label">入金金額</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="4">
            <el-tooltip :content="`精確金額: ${formatExactAmount(spotData.withdrawAmount)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(spotData.withdrawAmount) || 0 }}</div>
                  <div class="stat-label">出金金額</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="4">
            <el-tooltip :content="`精確金額: ${formatExactAmount(spotData.totalAssets)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(spotData.totalAssets) || 0 }}</div>
                  <div class="stat-label">總資產</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="4">
            <el-tooltip :content="`精確金額: ${formatExactAmount(spotData.yesterdayTradingAmount)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(spotData.yesterdayTradingAmount) || 0 }}</div>
                  <div class="stat-label">昨日現貨交易額</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="4">
            <el-tooltip :content="`精確金額: ${formatExactAmount(spotData.yesterdayFees)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(spotData.yesterdayFees) || 0 }}</div>
                  <div class="stat-label">昨日現貨手續費</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="4">
            <el-tooltip :content="`精確數量: ${spotData.activeUsers?.toLocaleString() || 0}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ spotData.activeUsers || 0 }}</div>
                  <div class="stat-label">活躍用戶數</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// import { operationReportAPI } from '@/api/operationReport' // 暫時註釋，使用模擬數據

export default {
  name: 'SpotData',
  setup() {
    const loading = ref(false)
    const spotData = ref({
      depositAmount: 0,
      withdrawAmount: 0,
      totalAssets: 0,
      yesterdayTradingAmount: 0,
      yesterdayFees: 0,
      activeUsers: 0
    })

    const searchForm = reactive({
      queryDate: ''
    })

    // 格式化金額（簡化顯示）
    const formatAmount = (amount) => {
      if (amount >= 1000000) {
        return (amount / 1000000).toFixed(2) + 'M'
      } else if (amount >= 1000) {
        return (amount / 1000).toFixed(2) + 'K'
      }
      return amount.toLocaleString()
    }

    // 格式化精確金額（完整顯示）
    const formatExactAmount = (amount) => {
      if (!amount && amount !== 0) return '0'
      return amount.toLocaleString('zh-TW', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    // 獲取數據
    const fetchData = async () => {
      loading.value = true
      try {
        // const params = {
        //   ...searchForm
        // }

        // 模擬數據 - 實際開發時請移除這段代碼
        const mockData = {
          depositAmount: 12500000,
          withdrawAmount: 8900000,
          totalAssets: 45600000,
          yesterdayTradingAmount: 23400000,
          yesterdayFees: 125000,
          activeUsers: 2345
        }

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        spotData.value = mockData

        // 實際 API 調用 - 取消註釋以下代碼並移除模擬數據
        // const response = await operationReportAPI.getSpotTradingData(params)
        // spotData.value = response.data || {}
      } catch (error) {
        console.error('獲取數據失敗:', error)
        ElMessage.error('獲取數據失敗')
      } finally {
        loading.value = false
      }
    }

    // 搜尋
    const handleSearch = () => {
      fetchData()
    }

    // 重置
    const handleReset = () => {
      Object.assign(searchForm, {
        queryDate: ''
      })
      fetchData()
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      spotData,
      searchForm,
      handleSearch,
      handleReset,
      formatAmount,
      formatExactAmount
    }
  }
}
</script>

<style scoped>
.spot-data {
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
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
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

.positive {
  color: #67c23a;
  font-weight: bold;
}

.negative {
  color: #f56c6c;
  font-weight: bold;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 
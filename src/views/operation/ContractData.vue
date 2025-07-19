<template>
  <div class="contract-data">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>合約數據</span>
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
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.yesterdayRealMoneyAmount)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(contractData.yesterdayRealMoneyAmount) || 0 }}</div>
                  <div class="stat-label">昨日合約真金交易額</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.yesterdayDemoMoneyAmount)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(contractData.yesterdayDemoMoneyAmount) || 0 }}</div>
                  <div class="stat-label">昨日合約體驗金交易額</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.yesterdayTotalAmount)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(contractData.yesterdayTotalAmount) || 0 }}</div>
                  <div class="stat-label">昨日合約總交易額</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.realMoneyFees)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(contractData.realMoneyFees) || 0 }}</div>
                  <div class="stat-label">合約真金手續費</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.demoMoneyFees)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(contractData.demoMoneyFees) || 0 }}</div>
                  <div class="stat-label">合約體驗金手續費</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.totalFees)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(contractData.totalFees) || 0 }}</div>
                  <div class="stat-label">合約總手續費</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確數量: ${contractData.tradeCount?.toLocaleString() || 0}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ contractData.tradeCount || 0 }}</div>
                  <div class="stat-label">交易筆數</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確數量: ${contractData.totalPositions?.toLocaleString() || 0}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ contractData.totalPositions || 0 }}</div>
                  <div class="stat-label">合約總倉位數</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.demoMoneyAmount)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(contractData.demoMoneyAmount) || 0 }}</div>
                  <div class="stat-label">體驗金金額</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.realMoneyFundingFee)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(contractData.realMoneyFundingFee) || 0 }}</div>
                  <div class="stat-label">真金資金費用</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.fundingFee)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ formatAmount(contractData.fundingFee) || 0 }}</div>
                  <div class="stat-label">資金費用</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.yesterdayRealMoneyProfit)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number" :class="contractData.yesterdayRealMoneyProfit >= 0 ? 'positive' : 'negative'">
                    {{ contractData.yesterdayRealMoneyProfit >= 0 ? '+' : '' }}{{ formatAmount(contractData.yesterdayRealMoneyProfit) || 0 }}
                  </div>
                  <div class="stat-label">昨日真金淨盈虧</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.yesterdayDemoMoneyProfit)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number" :class="contractData.yesterdayDemoMoneyProfit >= 0 ? 'positive' : 'negative'">
                    {{ contractData.yesterdayDemoMoneyProfit >= 0 ? '+' : '' }}{{ formatAmount(contractData.yesterdayDemoMoneyProfit) || 0 }}
                  </div>
                  <div class="stat-label">昨日體驗金淨盈虧</div>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-tooltip :content="`精確金額: ${formatExactAmount(contractData.yesterdayTotalProfit)}`" placement="top">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number" :class="contractData.yesterdayTotalProfit >= 0 ? 'positive' : 'negative'">
                    {{ contractData.yesterdayTotalProfit >= 0 ? '+' : '' }}{{ formatAmount(contractData.yesterdayTotalProfit) || 0 }}
                  </div>
                  <div class="stat-label">昨日淨盈虧</div>
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
  name: 'ContractData',
  setup() {
    const loading = ref(false)
    const contractData = ref({
      yesterdayRealMoneyAmount: 0,
      yesterdayDemoMoneyAmount: 0,
      yesterdayTotalAmount: 0,
      realMoneyFees: 0,
      demoMoneyFees: 0,
      totalFees: 0,
      tradeCount: 0,
      totalPositions: 0,
      demoMoneyAmount: 0,
      realMoneyFundingFee: 0,
      fundingFee: 0,
      yesterdayRealMoneyProfit: 0,
      yesterdayDemoMoneyProfit: 0,
      yesterdayTotalProfit: 0
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
          yesterdayRealMoneyAmount: 45600000,
          yesterdayDemoMoneyAmount: 12300000,
          yesterdayTotalAmount: 57900000,
          realMoneyFees: 456000,
          demoMoneyFees: 123000,
          totalFees: 579000,
          tradeCount: 15678,
          totalPositions: 8923,
          demoMoneyAmount: 8900000,
          realMoneyFundingFee: 234000,
          fundingFee: 345000,
          yesterdayRealMoneyProfit: 1250000,
          yesterdayDemoMoneyProfit: -250000,
          yesterdayTotalProfit: 1000000
        }

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500))

        contractData.value = mockData

        // 實際 API 調用 - 取消註釋以下代碼並移除模擬數據
        // const response = await operationReportAPI.getContractTradingData(params)
        // contractData.value = response.data || {}
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
      contractData,
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
.contract-data {
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
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
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
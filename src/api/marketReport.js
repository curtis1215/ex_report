import axios from 'axios'
import { apiConfig } from '@/config/database'

// 創建 axios 實例
const api = axios.create(apiConfig)

// 用戶交易明細相關查詢
export const userTransactionQueries = {
  // 獲取用戶交易明細列表
  getUserTransactions: (params) => {
    const { team, uid, contractName, startDate, endDate, page = 1, pageSize = 20 } = params
    return `
      SELECT 
        u.team,
        u.uid,
        c.contract_name,
        COUNT(t.id) as total_trades,
        COUNT(CASE WHEN t.money_type = 'real' THEN 1 END) as real_money_trades,
        COUNT(CASE WHEN t.money_type = 'demo' THEN 1 END) as demo_money_trades,
        SUM(t.total_amount) as total_amount,
        SUM(CASE WHEN t.money_type = 'real' THEN t.fee ELSE 0 END) as real_money_fees,
        SUM(CASE WHEN t.money_type = 'demo' THEN t.fee ELSE 0 END) as demo_money_fees,
        SUM(t.fee) as total_fees,
        SUM(CASE WHEN t.money_type = 'real' THEN t.profit ELSE 0 END) as real_money_profit,
        SUM(CASE WHEN t.money_type = 'demo' THEN t.profit ELSE 0 END) as demo_money_profit,
        SUM(t.profit) as total_profit
      FROM users u
      LEFT JOIN transactions t ON u.uid = t.user_id 
        AND DATE(t.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      LEFT JOIN contracts c ON t.contract_id = c.id
      WHERE 1=1
        ${team ? 'AND u.team = ?' : ''}
        ${uid ? 'AND u.uid = ?' : ''}
        ${contractName ? 'AND c.contract_name LIKE ?' : ''}
        ${startDate ? 'AND t.created_at >= ?' : ''}
        ${endDate ? 'AND t.created_at <= ?' : ''}
      GROUP BY u.team, u.uid, c.contract_name
      ORDER BY total_trades DESC
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `
  },

  // 獲取用戶交易統計
  getUserTransactionStats: (params) => {
    const { team, uid, contractName, startDate, endDate } = params
    return `
      SELECT 
        COUNT(t.id) as total_trades,
        COUNT(CASE WHEN t.money_type = 'real' THEN 1 END) as real_money_trades,
        COUNT(CASE WHEN t.money_type = 'demo' THEN 1 END) as demo_money_trades,
        SUM(t.total_amount) as total_amount,
        SUM(t.fee) as total_fees,
        SUM(t.profit) as total_profit
      FROM users u
      LEFT JOIN transactions t ON u.uid = t.user_id 
        AND DATE(t.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      LEFT JOIN contracts c ON t.contract_id = c.id
      WHERE 1=1
        ${team ? 'AND u.team = ?' : ''}
        ${uid ? 'AND u.uid = ?' : ''}
        ${contractName ? 'AND c.contract_name LIKE ?' : ''}
        ${startDate ? 'AND t.created_at >= ?' : ''}
        ${endDate ? 'AND t.created_at <= ?' : ''}
    `
  }
}

// 合約交易對明細相關查詢
export const contractPairQueries = {
  // 獲取合約交易對明細
  getContractPairDetails: (params) => {
    const { team, contractName, startDate, endDate, page = 1, pageSize = 20 } = params
    return `
      SELECT 
        u.team,
        c.contract_name,
        COUNT(DISTINCT t.user_id) as user_count,
        COUNT(t.id) as total_trades,
        SUM(CASE WHEN t.money_type = 'real' THEN t.total_amount ELSE 0 END) as real_money_amount,
        SUM(CASE WHEN t.money_type = 'demo' THEN t.total_amount ELSE 0 END) as demo_money_amount,
        SUM(t.total_amount) as total_amount,
        SUM(CASE WHEN t.money_type = 'real' THEN t.fee ELSE 0 END) as real_money_fees,
        SUM(CASE WHEN t.money_type = 'demo' THEN t.fee ELSE 0 END) as demo_money_fees,
        SUM(t.fee) as total_fees,
        SUM(CASE WHEN t.money_type = 'real' THEN t.profit ELSE 0 END) as real_money_profit,
        SUM(CASE WHEN t.money_type = 'demo' THEN t.profit ELSE 0 END) as demo_money_profit,
        SUM(t.profit) as total_profit
      FROM users u
      LEFT JOIN transactions t ON u.uid = t.user_id 
        AND DATE(t.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      LEFT JOIN contracts c ON t.contract_id = c.id
      WHERE 1=1
        ${team ? 'AND u.team = ?' : ''}
        ${contractName ? 'AND c.contract_name LIKE ?' : ''}
        ${startDate ? 'AND t.created_at >= ?' : ''}
        ${endDate ? 'AND t.created_at <= ?' : ''}
      GROUP BY u.team, c.contract_name
      ORDER BY total_trades DESC
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `
  },

  // 獲取合約交易對統計
  getContractPairStats: (params) => {
    const { team, contractName, startDate, endDate } = params
    return `
      SELECT 
        COUNT(DISTINCT t.user_id) as total_users,
        COUNT(t.id) as total_trades,
        SUM(CASE WHEN t.money_type = 'real' THEN t.total_amount ELSE 0 END) as real_money_amount,
        SUM(CASE WHEN t.money_type = 'demo' THEN t.total_amount ELSE 0 END) as demo_money_amount,
        SUM(t.total_amount) as total_amount,
        SUM(t.fee) as total_fees,
        SUM(t.profit) as total_profit
      FROM users u
      LEFT JOIN transactions t ON u.uid = t.user_id 
        AND DATE(t.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      LEFT JOIN contracts c ON t.contract_id = c.id
      WHERE 1=1
        ${team ? 'AND u.team = ?' : ''}
        ${contractName ? 'AND c.contract_name LIKE ?' : ''}
        ${startDate ? 'AND t.created_at >= ?' : ''}
        ${endDate ? 'AND t.created_at <= ?' : ''}
    `
  }
}

// 交易統計總覽相關查詢
export const tradingOverviewQueries = {
  // 獲取交易統計總覽
  getTradingOverview: (params) => {
    const { startDate, endDate } = params
    return `
      SELECT 
        DATE(created_at) as trade_date,
        COUNT(*) as total_trades,
        COUNT(DISTINCT user_id) as active_users,
        SUM(quantity) as total_volume,
        SUM(total_amount) as total_value,
        SUM(fee) as total_fees
      FROM transactions
      WHERE 1=1
        ${startDate ? 'AND created_at >= ?' : ''}
        ${endDate ? 'AND created_at <= ?' : ''}
      GROUP BY DATE(created_at)
      ORDER BY trade_date DESC
    `
  },

  // 獲取實時交易數據
  getRealTimeTradingData: () => {
    return `
      SELECT 
        COUNT(*) as today_trades,
        COUNT(DISTINCT user_id) as today_users,
        SUM(quantity) as today_volume,
        SUM(total_amount) as today_value
      FROM transactions
      WHERE DATE(created_at) = CURDATE()
    `
  }
}

// API 函數
export const marketReportAPI = {
  // 用戶交易明細
  getUserTransactions: (params) => {
    return api.post('/market/user-transactions', params)
  },

  getUserTransactionStats: (params) => {
    return api.post('/market/user-transaction-stats', params)
  },

  // 合約交易對明細
  getContractPairDetails: (params) => {
    return api.post('/market/contract-pair-details', params)
  },

  getContractPairStats: (params) => {
    return api.post('/market/contract-pair-stats', params)
  },

  // 交易統計總覽
  getTradingOverview: (params) => {
    return api.post('/market/trading-overview', params)
  },

  getRealTimeTradingData: () => {
    return api.get('/market/real-time-trading-data')
  }
} 
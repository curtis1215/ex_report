import axios from 'axios'
import { apiConfig } from '@/config/database'

// 創建 axios 實例
const api = axios.create(apiConfig)

// 用戶基本信息相關查詢
export const userInfoQueries = {
  // 獲取用戶基本信息列表
  getUserInfoList: (params) => {
    const { username, email, status, page = 1, pageSize = 20 } = params
    const offset = (page - 1) * pageSize
    return `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.phone,
        u.status,
        u.kyc_level,
        u.created_at,
        u.last_login_at,
        COUNT(t.id) as total_trades,
        SUM(t.total_amount) as total_volume
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id
      WHERE 1=1
        ${username ? 'AND u.username LIKE ?' : ''}
        ${email ? 'AND u.email LIKE ?' : ''}
        ${status ? 'AND u.status = ?' : ''}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `
  },

  // 獲取用戶統計信息
  getUserStats: () => {
    return `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_users,
        COUNT(CASE WHEN kyc_level >= 2 THEN 1 END) as verified_users,
        COUNT(CASE WHEN DATE(last_login_at) = CURDATE() THEN 1 END) as today_login_users
      FROM users
    `
  }
}

// 現貨數據相關查詢
export const spotDataQueries = {
  // 獲取現貨交易數據
  getSpotTradingData: (params) => {
    const { symbol, startDate, endDate, page = 1, pageSize = 20 } = params
    const offset = (page - 1) * pageSize
    return `
      SELECT 
        s.id,
        s.symbol,
        s.base_asset,
        s.quote_asset,
        s.price,
        s.volume_24h,
        s.change_24h,
        s.high_24h,
        s.low_24h,
        s.updated_at,
        COUNT(t.id) as trade_count,
        SUM(t.quantity) as total_volume
      FROM spot_pairs s
      LEFT JOIN transactions t ON s.symbol = t.symbol AND t.type = 'spot'
        ${startDate ? 'AND t.created_at >= ?' : ''}
        ${endDate ? 'AND t.created_at <= ?' : ''}
      WHERE 1=1
        ${symbol ? 'AND s.symbol = ?' : ''}
      GROUP BY s.id
      ORDER BY s.volume_24h DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `
  },

  // 獲取現貨市場概覽
  getSpotMarketOverview: (params) => {
    const { startDate, endDate } = params
    return `
      SELECT 
        DATE(created_at) as trade_date,
        COUNT(*) as total_trades,
        SUM(quantity) as total_volume,
        SUM(total_amount) as total_value,
        AVG(price) as avg_price
      FROM transactions
      WHERE type = 'spot'
        ${startDate ? 'AND created_at >= ?' : ''}
        ${endDate ? 'AND created_at <= ?' : ''}
      GROUP BY DATE(created_at)
      ORDER BY trade_date DESC
    `
  }
}

// 合約數據相關查詢
export const contractDataQueries = {
  // 獲取合約交易數據
  getContractTradingData: (params) => {
    const { symbol, startDate, endDate, page = 1, pageSize = 20 } = params
    const offset = (page - 1) * pageSize
    return `
      SELECT 
        c.id,
        c.symbol,
        c.contract_type,
        c.expiry_date,
        c.strike_price,
        c.current_price,
        c.open_interest,
        c.volume_24h,
        c.funding_rate,
        c.updated_at,
        COUNT(t.id) as trade_count,
        SUM(t.quantity) as total_volume
      FROM contracts c
      LEFT JOIN transactions t ON c.symbol = t.symbol AND t.type = 'contract'
        ${startDate ? 'AND t.created_at >= ?' : ''}
        ${endDate ? 'AND t.created_at <= ?' : ''}
      WHERE 1=1
        ${symbol ? 'AND c.symbol = ?' : ''}
      GROUP BY c.id
      ORDER BY c.volume_24h DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `
  },

  // 獲取合約市場概覽
  getContractMarketOverview: (params) => {
    const { startDate, endDate } = params
    return `
      SELECT 
        DATE(created_at) as trade_date,
        COUNT(*) as total_trades,
        SUM(quantity) as total_volume,
        SUM(total_amount) as total_value,
        SUM(CASE WHEN side = 'long' THEN 1 ELSE 0 END) as long_positions,
        SUM(CASE WHEN side = 'short' THEN 1 ELSE 0 END) as short_positions
      FROM transactions
      WHERE type = 'contract'
        ${startDate ? 'AND created_at >= ?' : ''}
        ${endDate ? 'AND created_at <= ?' : ''}
      GROUP BY DATE(created_at)
      ORDER BY trade_date DESC
    `
  }
}

// 經紀人數據相關查詢
export const brokerDataQueries = {
  // 獲取經紀人列表
  getBrokerList: (params) => {
    const { brokerId, status, page = 1, pageSize = 20 } = params
    const offset = (page - 1) * pageSize
    return `
      SELECT 
        b.id,
        b.broker_code,
        b.broker_name,
        b.status,
        b.commission_rate,
        b.created_at,
        COUNT(u.id) as total_clients,
        COUNT(CASE WHEN u.status = 'active' THEN 1 END) as active_clients,
        SUM(t.total_amount) as total_volume,
        SUM(t.fee) as total_commission
      FROM brokers b
      LEFT JOIN users u ON b.id = u.broker_id
      LEFT JOIN transactions t ON u.id = t.user_id
      WHERE 1=1
        ${brokerId ? 'AND b.id = ?' : ''}
        ${status ? 'AND b.status = ?' : ''}
      GROUP BY b.id
      ORDER BY total_volume DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `
  },

  // 獲取經紀人統計
  getBrokerStats: (params) => {
    const { startDate, endDate } = params
    return `
      SELECT 
        b.broker_name,
        COUNT(DISTINCT u.id) as total_clients,
        COUNT(t.id) as total_trades,
        SUM(t.total_amount) as total_volume,
        SUM(t.fee) as total_commission,
        AVG(t.fee) as avg_commission
      FROM brokers b
      LEFT JOIN users u ON b.id = u.broker_id
      LEFT JOIN transactions t ON u.id = t.user_id
        ${startDate ? 'AND t.created_at >= ?' : ''}
        ${endDate ? 'AND t.created_at <= ?' : ''}
      GROUP BY b.id
      ORDER BY total_commission DESC
    `
  }
}

// API 函數
export const operationReportAPI = {
  // 用戶基本信息
  getUserInfoList: (params) => {
    return api.post('/operation/user-info-list', params)
  },

  getUserStats: () => {
    return api.get('/operation/user-stats')
  },

  // 現貨數據
  getSpotTradingData: (params) => {
    return api.post('/operation/spot-trading-data', params)
  },

  getSpotMarketOverview: (params) => {
    return api.post('/operation/spot-market-overview', params)
  },

  // 合約數據
  getContractTradingData: (params) => {
    return api.post('/operation/contract-trading-data', params)
  },

  getContractMarketOverview: (params) => {
    return api.post('/operation/contract-market-overview', params)
  },

  // 經紀人數據
  getBrokerList: (params) => {
    return api.post('/operation/broker-list', params)
  },

  getBrokerStats: (params) => {
    return api.post('/operation/broker-stats', params)
  }
} 
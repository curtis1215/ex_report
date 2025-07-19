import axios from 'axios'
import { apiConfig } from '@/config/database'

// 創建 axios 實例
const api = axios.create(apiConfig)

// 風控信息相關查詢
export const riskInfoQueries = {
  // 獲取風控信息列表
  getRiskInfoList: (params) => {
    const { riskType, severity, status, page = 1, pageSize = 20 } = params
    const offset = (page - 1) * pageSize
    return `
      SELECT 
        r.id,
        r.risk_type,
        r.severity,
        r.status,
        r.description,
        r.affected_users,
        r.affected_amount,
        r.created_at,
        r.resolved_at,
        u.username as created_by,
        COUNT(ra.id) as action_count
      FROM risk_info r
      LEFT JOIN users u ON r.created_by = u.id
      LEFT JOIN risk_actions ra ON r.id = ra.risk_id
      WHERE 1=1
        ${riskType ? 'AND r.risk_type = ?' : ''}
        ${severity ? 'AND r.severity = ?' : ''}
        ${status ? 'AND r.status = ?' : ''}
      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `
  },

  // 獲取風控統計信息
  getRiskStats: (params) => {
    const { startDate, endDate } = params
    return `
      SELECT 
        risk_type,
        severity,
        COUNT(*) as total_risks,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_risks,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_risks,
        SUM(affected_users) as total_affected_users,
        SUM(affected_amount) as total_affected_amount
      FROM risk_info
      WHERE 1=1
        ${startDate ? 'AND created_at >= ?' : ''}
        ${endDate ? 'AND created_at <= ?' : ''}
      GROUP BY risk_type, severity
      ORDER BY total_risks DESC
    `
  },

  // 獲取實時風控監控數據
  getRealTimeRiskData: () => {
    return `
      SELECT 
        COUNT(*) as total_active_risks,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_risk_count,
        COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_risk_count,
        COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_risk_count,
        SUM(affected_users) as total_affected_users,
        SUM(affected_amount) as total_affected_amount
      FROM risk_info
      WHERE status = 'open'
    `
  },

  // 獲取用戶風控信息
  getUserRiskInfo: (params) => {
    const { userId, page = 1, pageSize = 20 } = params
    const offset = (page - 1) * pageSize
    return `
      SELECT 
        ur.id,
        ur.user_id,
        u.username,
        ur.risk_type,
        ur.severity,
        ur.status,
        ur.description,
        ur.amount_involved,
        ur.created_at,
        ur.resolved_at,
        COUNT(ura.id) as action_count
      FROM user_risk ur
      LEFT JOIN users u ON ur.user_id = u.id
      LEFT JOIN user_risk_actions ura ON ur.id = ura.user_risk_id
      WHERE 1=1
        ${userId ? 'AND ur.user_id = ?' : ''}
      GROUP BY ur.id
      ORDER BY ur.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `
  },

  // 獲取交易風控信息
  getTransactionRiskInfo: (params) => {
    const { startDate, endDate, riskType, page = 1, pageSize = 20 } = params
    const offset = (page - 1) * pageSize
    return `
      SELECT 
        tr.id,
        tr.transaction_id,
        t.symbol,
        t.side,
        t.quantity,
        t.price,
        t.total_amount,
        tr.risk_type,
        tr.severity,
        tr.status,
        tr.description,
        tr.created_at,
        u.username as user_name
      FROM transaction_risk tr
      LEFT JOIN transactions t ON tr.transaction_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
        ${startDate ? 'AND tr.created_at >= ?' : ''}
        ${endDate ? 'AND tr.created_at <= ?' : ''}
        ${riskType ? 'AND tr.risk_type = ?' : ''}
      ORDER BY tr.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `
  },

  // 獲取風控規則配置
  getRiskRules: () => {
    return `
      SELECT 
        id,
        rule_name,
        rule_type,
        conditions,
        actions,
        status,
        priority,
        created_at,
        updated_at
      FROM risk_rules
      WHERE status = 'active'
      ORDER BY priority DESC
    `
  },

  // 獲取風控指標
  getRiskMetrics: (params) => {
    const { startDate, endDate } = params
    return `
      SELECT 
        DATE(created_at) as metric_date,
        COUNT(*) as total_risks,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_risks,
        COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_risks,
        COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_risks,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_risks,
        AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_resolution_time
      FROM risk_info
      WHERE 1=1
        ${startDate ? 'AND created_at >= ?' : ''}
        ${endDate ? 'AND created_at <= ?' : ''}
      GROUP BY DATE(created_at)
      ORDER BY metric_date DESC
    `
  }
}

// API 函數
export const riskManagementAPI = {
  // 風控信息
  getRiskInfoList: (params) => {
    return api.post('/risk/risk-info-list', params)
  },

  getRiskStats: (params) => {
    return api.post('/risk/risk-stats', params)
  },

  getRealTimeRiskData: () => {
    return api.get('/risk/real-time-risk-data')
  },

  // 用戶風控信息
  getUserRiskInfo: (params) => {
    return api.post('/risk/user-risk-info', params)
  },

  // 交易風控信息
  getTransactionRiskInfo: (params) => {
    return api.post('/risk/transaction-risk-info', params)
  },

  // 風控規則
  getRiskRules: () => {
    return api.get('/risk/risk-rules')
  },

  // 風控指標
  getRiskMetrics: (params) => {
    return api.post('/risk/risk-metrics', params)
  },

  // 更新風控狀態
  updateRiskStatus: (params) => {
    return api.put('/risk/update-risk-status', params)
  },

  // 添加風控動作
  addRiskAction: (params) => {
    return api.post('/risk/add-risk-action', params)
  }
} 
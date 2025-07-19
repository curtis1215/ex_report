// 資料庫配置檔案
export const dbConfig = {
  // 開發環境配置
  development: {
    host: 'localhost',
    port: 3306,
    database: 'ex_report_dev',
    username: 'root',
    password: 'password',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  // 測試環境配置
  test: {
    host: 'localhost',
    port: 3306,
    database: 'ex_report_test',
    username: 'root',
    password: 'password',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  // 生產環境配置
  production: {
    host: import.meta.env.VITE_DB_HOST || 'localhost',
    port: import.meta.env.VITE_DB_PORT || 3306,
    database: import.meta.env.VITE_DB_NAME || 'ex_report_prod',
    username: import.meta.env.VITE_DB_USER || 'root',
    password: import.meta.env.VITE_DB_PASSWORD || 'password',
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
}

// 根據環境變數獲取當前配置
export const getCurrentConfig = () => {
  const env = import.meta.env.MODE || 'development'
  return dbConfig[env]
}

// API 基礎 URL 配置
export const apiConfig = {
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
} 
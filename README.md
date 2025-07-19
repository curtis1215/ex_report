# 交易所報表系統

這是一個基於 Vue 3 + Element Plus 的交易所報表管理系統，提供完整的市場報表、運營報表和風控管理功能。

## 功能特色

### 市場報表
- **用戶交易明細**: 查看用戶的交易記錄和統計信息
- **合約交易對明細**: 管理合約交易對的詳細信息
- **交易統計總覽**: 提供交易數據的圖表化展示

### 運營報表
- **用戶基本信息**: 管理用戶資料和狀態
- **現貨數據**: 監控現貨交易市場數據
- **合約數據**: 管理合約交易相關數據
- **經紀人數據**: 查看經紀人業績和客戶信息

### 風控管理
- **風控信息**: 監控和管理風險事件

## 技術棧

- **前端框架**: Vue 3
- **UI 組件庫**: Element Plus
- **路由管理**: Vue Router 4
- **狀態管理**: Pinia
- **HTTP 客戶端**: Axios
- **圖表庫**: ECharts
- **構建工具**: Vite

## 專案結構

```
ex_report/
├── src/
│   ├── api/                    # API 接口和 SQL 查詢
│   │   ├── marketReport.js     # 市場報表相關 API
│   │   ├── operationReport.js  # 運營報表相關 API
│   │   └── riskManagement.js   # 風控管理相關 API
│   ├── config/
│   │   └── database.js         # 資料庫配置
│   ├── layout/
│   │   └── Layout.vue          # 主佈局組件
│   ├── router/
│   │   └── index.js            # 路由配置
│   ├── views/
│   │   ├── market/             # 市場報表頁面
│   │   ├── operation/          # 運營報表頁面
│   │   └── risk/               # 風控管理頁面
│   ├── App.vue                 # 根組件
│   └── main.js                 # 應用入口
├── index.html                  # HTML 模板
├── package.json                # 依賴配置
├── vite.config.js              # Vite 配置
└── README.md                   # 專案說明
```

## 安裝和運行

### 安裝依賴
```bash
npm install
```

### 開發環境運行
```bash
npm run dev
```

### 生產環境構建
```bash
npm run build
```

### 預覽生產版本
```bash
npm run preview
```

## 配置說明

### 資料庫配置
在 `src/config/database.js` 中配置不同環境的資料庫連接參數：

```javascript
export const dbConfig = {
  development: {
    host: 'localhost',
    port: 3306,
    database: 'ex_report_dev',
    username: 'root',
    password: 'password',
    dialect: 'mysql'
  },
  // ... 其他環境配置
}
```

### API 配置
在 `src/config/database.js` 中配置 API 基礎 URL：

```javascript
export const apiConfig = {
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}
```

## 開發指南

### 添加新頁面
1. 在 `src/views/` 下創建新的頁面組件
2. 在 `src/router/index.js` 中添加路由配置
3. 在 `src/layout/Layout.vue` 中添加選單項

### 添加新 API
1. 在 `src/api/` 下創建新的 API 檔案
2. 定義 SQL 查詢和 API 函數
3. 在頁面組件中引入並使用

### 樣式規範
- 使用 Element Plus 的設計規範
- 響應式設計，支援不同螢幕尺寸
- 統一的色彩和字體規範

## 部署

### 環境變數
創建 `.env` 檔案配置環境變數：

```env
VITE_APP_API_BASE_URL=http://your-api-domain.com/api
NODE_ENV=production
```

### 構建部署
```bash
npm run build
```

將 `dist` 目錄下的檔案部署到 Web 伺服器。

## 貢獻指南

1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 發起 Pull Request

## 授權

MIT License
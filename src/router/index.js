import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/market/user-transactions',
    children: [
      // 市場報表
      {
        path: '/market',
        name: 'MarketReport',
        component: () => import('@/views/market/MarketReport.vue'),
        meta: { title: '市場報表' },
        children: [
          {
            path: 'user-transactions',
            name: 'UserTransactions',
            component: () => import('@/views/market/UserTransactions.vue'),
            meta: { title: '用戶交易明細' }
          },
          {
            path: 'contract-pair-details',
            name: 'ContractPairDetails',
            component: () => import('@/views/market/ContractPairDetails.vue'),
            meta: { title: '合約交易對明細' }
          },
          {
            path: 'trading-overview',
            name: 'TradingOverview',
            component: () => import('@/views/market/TradingOverview.vue'),
            meta: { title: '交易統計總覽' }
          }
        ]
      },
      // 運營報表
      {
        path: '/operation',
        name: 'OperationReport',
        component: () => import('@/views/operation/OperationReport.vue'),
        meta: { title: '運營報表' },
        children: [
          {
            path: 'user-info',
            name: 'UserInfo',
            component: () => import('@/views/operation/UserInfo.vue'),
            meta: { title: '用戶基本信息' }
          },
          {
            path: 'spot-data',
            name: 'SpotData',
            component: () => import('@/views/operation/SpotData.vue'),
            meta: { title: '現貨數據' }
          },
          {
            path: 'contract-data',
            name: 'ContractData',
            component: () => import('@/views/operation/ContractData.vue'),
            meta: { title: '合約數據' }
          },
          {
            path: 'broker-data',
            name: 'BrokerData',
            component: () => import('@/views/operation/BrokerData.vue'),
            meta: { title: '經紀人數據' }
          }
        ]
      },
      // 風控管理
      {
        path: '/risk',
        name: 'RiskManagement',
        component: () => import('@/views/risk/RiskManagement.vue'),
        meta: { title: '風控管理' },
        children: [
          {
            path: 'risk-info',
            name: 'RiskInfo',
            component: () => import('@/views/risk/RiskInfo.vue'),
            meta: { title: '風控信息' }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
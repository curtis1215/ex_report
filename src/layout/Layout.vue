<template>
  <el-container class="layout-container">
    <!-- 左側選單 -->
    <el-aside width="250px" class="sidebar">
      <div class="logo">
        <h2>交易所報表系統</h2>
      </div>
      
      <el-menu
        :default-active="$route.path"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <!-- 市場報表 -->
        <el-sub-menu index="/market">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>市場報表</span>
          </template>
          <el-menu-item index="/market/user-transactions">
            <el-icon><Document /></el-icon>
            <span>用戶交易明細</span>
          </el-menu-item>
          <el-menu-item index="/market/contract-pair-details">
            <el-icon><Coin /></el-icon>
            <span>合約交易對明細</span>
          </el-menu-item>
          <el-menu-item index="/market/trading-overview">
            <el-icon><DataBoard /></el-icon>
            <span>交易統計總覽</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 運營報表 -->
        <el-sub-menu index="/operation">
          <template #title>
            <el-icon><Operation /></el-icon>
            <span>運營報表</span>
          </template>
          <el-menu-item index="/operation/user-info">
            <el-icon><User /></el-icon>
            <span>用戶基本信息</span>
          </el-menu-item>
          <el-menu-item index="/operation/spot-data">
            <el-icon><TrendCharts /></el-icon>
            <span>現貨數據</span>
          </el-menu-item>
          <el-menu-item index="/operation/contract-data">
            <el-icon><Coin /></el-icon>
            <span>合約數據</span>
          </el-menu-item>
          <el-menu-item index="/operation/broker-data">
            <el-icon><Avatar /></el-icon>
            <span>經紀人數據</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 風控管理 -->
        <el-sub-menu index="/risk">
          <template #title>
            <el-icon><Warning /></el-icon>
            <span>風控管理</span>
          </template>
          <el-menu-item index="/risk/risk-info">
            <el-icon><InfoFilled /></el-icon>
            <span>風控信息</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 主要內容區域 -->
    <el-container>
      <!-- 頂部導航 -->
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar size="small" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span>管理員</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>個人設置</el-dropdown-item>
                <el-dropdown-item>退出登入</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 內容區域 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Layout',
  setup() {
    const route = useRoute()

    const breadcrumbs = computed(() => {
      const matched = route.matched.filter(item => item.meta && item.meta.title)
      return matched.map(item => ({
        title: item.meta.title,
        path: item.path
      }))
    })

    return {
      breadcrumbs
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  color: #bfcbd9;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2f3a;
  color: #fff;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-info span {
  margin-left: 8px;
  color: #606266;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style> 
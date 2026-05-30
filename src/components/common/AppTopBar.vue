<template>
  <header class="app-topbar" :class="`app-topbar--${variant}`">
    <div class="topbar-inner">
      <button class="brand" type="button" @click="goHome">
        <span class="brand-mark">{{ variant === 'admin' ? 'A' : 'S' }}</span>
        <span class="brand-text">
          <strong>{{ variant === 'admin' ? 'Shiqi Blog Admin' : 'Shiqi Blog' }}</strong>
          <small v-if="variant === 'admin'">网站管理</small>
        </span>
      </button>

      <nav v-if="variant === 'front'" class="front-nav" aria-label="前台导航">
        <button type="button" @click="goHome">首页</button>
        <button type="button" @click="goAdminArticles">文章</button>
        <button type="button" @click="goAdminCategories">分类</button>
        <button type="button" @click="goAdmin">后台管理</button>
        <ThemeToggle />
      </nav>

      <div v-else class="admin-actions">
        <span class="admin-user">Shiqi</span>
        <button type="button" @click="goHome">返回前台</button>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

defineProps({
  variant: {
    type: String,
    default: 'front',
    validator: value => ['front', 'admin'].includes(value)
  }
})

const router = useRouter()

function goHome() {
  router.push('/')
}

function goAdmin() {
  router.push('/admin')
}

function goAdminArticles() {
  router.push('/admin/articles')
}

function goAdminCategories() {
  router.push('/admin/categories')
}
</script>

<style scoped>
.app-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #071b33;
  color: #e5f0ff;
  box-shadow: 0 8px 24px rgba(7, 27, 51, 0.18);
}

[data-theme="dark"] .app-topbar {
  background: #06162b;
}

.topbar-inner {
  width: min(100% - 40px, 1200px);
  min-height: 60px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.app-topbar--admin .topbar-inner {
  width: 100%;
  min-height: 64px;
  padding: 0 28px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  background: linear-gradient(135deg, #60a5fa, #818cf8);
  color: #ffffff;
  font-weight: 900;
}

.brand-text {
  display: grid;
  min-width: 0;
  text-align: left;
}

.brand-text strong {
  color: #f8fbff;
  font-size: 17px;
  line-height: 1.15;
  white-space: nowrap;
}

.brand-text small {
  margin-top: 2px;
  color: rgba(229, 240, 255, 0.72);
  font-size: 12px;
}

.front-nav,
.admin-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

.front-nav > button:not(.theme-toggle),
.admin-actions > button {
  min-height: 36px;
  padding: 7px 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: #e5f0ff;
  font-size: 14px;
}

.front-nav > button:not(.theme-toggle):hover,
.admin-actions > button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.admin-user {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(229, 240, 255, 0.86);
  font-size: 13px;
}

.app-topbar :deep(.theme-toggle) {
  min-height: 36px;
  border-color: rgba(229, 240, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: #e5f0ff;
  box-shadow: none;
}

.app-topbar :deep(.theme-toggle:hover) {
  border-color: rgba(96, 165, 250, 0.8);
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

@media (max-width: 760px) {
  .topbar-inner,
  .app-topbar--admin .topbar-inner {
    width: min(100% - 28px, 1200px);
    height: auto;
    min-height: 60px;
    padding: 10px 0;
    align-items: flex-start;
    flex-direction: column;
  }

  .front-nav,
  .admin-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .front-nav > button:not(.theme-toggle),
  .front-nav :deep(.theme-toggle),
  .admin-actions > button,
  .admin-actions :deep(.theme-toggle) {
    flex: 1 1 calc(50% - 8px);
  }
}
</style>

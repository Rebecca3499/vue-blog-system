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
        <button type="button" @click="goAdminAdvanced">高级特性</button>
        <button type="button" @click="goAdmin">后台管理</button>
        <button v-if="!authStore.isLogin" type="button" @click="goLogin">登录</button>
        <button v-else type="button" class="logout-button" @click.stop.prevent="openLogoutConfirm">退出登录</button>
        <ThemeToggle />
      </nav>

      <div v-else class="admin-actions">
        <span class="admin-user">{{ authStore.userInfo?.nickname || 'Admin' }}</span>
        <button type="button" @click="goHome">返回前台</button>
        <button type="button" class="logout-button" @click.stop.prevent="openLogoutConfirm">退出登录</button>
        <ThemeToggle />
      </div>
    </div>
  </header>

  <div v-if="showLogoutConfirm" class="confirm-mask" @click.self="closeLogoutConfirm">
    <section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title">
      <h2 id="logout-title">确认退出登录？</h2>
      <p>退出后需要重新登录才能进入后台管理。</p>
      <div class="confirm-actions">
        <button class="cancel-button" type="button" @click="closeLogoutConfirm">取消</button>
        <button class="confirm-button" type="button" @click="confirmLogout">确认退出</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import { useAuthStore } from '../../stores/auth'
import { useToast } from '../toast/useToast'

defineProps({
  variant: {
    type: String,
    default: 'front',
    validator: value => ['front', 'admin'].includes(value)
  }
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showToast } = useToast()
const showLogoutConfirm = ref(false)

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

function goAdminAdvanced() {
  router.push('/admin/advanced')
}

function goLogin() {
  router.push({
    path: '/login',
    query: route.path.startsWith('/admin')
      ? { redirect: route.fullPath }
      : {}
  })
}

function openLogoutConfirm() {
  showLogoutConfirm.value = true
}

function closeLogoutConfirm() {
  showLogoutConfirm.value = false
}

function confirmLogout() {
  showLogoutConfirm.value = false
  authStore.logout()
  showToast('已退出登录', 'success')
  router.push('/login')
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

.front-nav > .logout-button,
.admin-actions > .logout-button {
  border-color: rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.front-nav > .logout-button:hover,
.admin-actions > .logout-button:hover {
  border-color: rgba(248, 113, 113, 0.75);
  background: rgba(248, 113, 113, 0.16);
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

.confirm-mask {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(7, 27, 51, 0.54);
  backdrop-filter: blur(4px);
}

.confirm-dialog {
  width: min(100%, 420px);
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-hover);
}

.confirm-dialog h2 {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 22px;
}

.confirm-dialog p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.cancel-button,
.confirm-button {
  min-height: 40px;
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  font-weight: 700;
}

.cancel-button {
  border: 1px solid var(--border-color);
  background: var(--bg-card-soft);
  color: var(--text-secondary);
}

.cancel-button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.confirm-button {
  border: 1px solid var(--danger);
  background: var(--danger);
  color: #ffffff;
}

.confirm-button:hover {
  filter: brightness(0.95);
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

  .confirm-actions {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .confirm-button {
    width: 100%;
  }
}
</style>

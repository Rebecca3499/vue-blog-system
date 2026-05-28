<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <h1>博客后台</h1>
        <p>Blog Admin</p>
      </div>

      <nav class="menu">
        <RouterLink
            to="/admin"
            class="menu-item"
            exact-active-class="active"
        >
            数据概览
        </RouterLink>

        <RouterLink
            to="/admin/articles"
            class="menu-item"
            exact-active-class="active"
        >
            文章管理
        </RouterLink>

        <RouterLink
            to="/admin/articles/new"
            class="menu-item"
            exact-active-class="active"
        >
            新增文章
        </RouterLink>

        <RouterLink
             to="/admin/categories"
            class="menu-item"
            exact-active-class="active"
        >
        分类管理
        </RouterLink>
    </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <div>
          <h2>{{ pageTitle }}</h2>
          <p>{{ pageDescription }}</p>
        </div>

        <div class="actions">
          <button class="home-button" @click="goHome">
            返回首页
          </button>

          <button class="logout-button" @click="handleLogout">
            退出登录
          </button>
        </div>
      </header>

      <section class="content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../components/toast/useToast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const pageTitle = computed(() => {
  if (route.path === '/admin') {
    return '数据概览'
  }

  if (route.path === '/admin/articles') {
    return '文章管理'
  }

  if (route.path === '/admin/articles/new') {
    return '新增文章'
  }

  if (route.path.startsWith('/admin/articles/edit')) {
    return '编辑文章'
  }

  if (route.path === '/admin/categories') {
    return '分类管理'
    }

  return '后台管理'
})

const pageDescription = computed(() => {
  if (route.path === '/admin') {
    return '查看博客文章、分类和浏览量统计。'
  }

  if (route.path === '/admin/articles') {
    return '管理博客文章，支持新增、编辑和删除。'
  }

  if (route.path === '/admin/articles/new') {
    return '填写文章信息并发布到博客前台。'
  }

  if (route.path.startsWith('/admin/articles/edit')) {
    return '修改文章内容并同步更新前台展示。'
  }

  if (route.path === '/admin/categories') {
    return '查看博客分类统计和分类下的文章。'
}

  return '博客后台管理系统'
})

function goHome() {
  router.push('/')
}

function handleLogout() {
  const result = window.confirm('确定要退出登录吗？')

  if (result) {
    authStore.logout()
    showToast('已退出登录', 'info')
    router.push('/login')
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: #f3f4f6;
  font-family: Arial, sans-serif;
}

.sidebar {
  background: #111827;
  color: white;
  padding: 24px 18px;
}

.brand {
  margin-bottom: 32px;
}

.brand h1 {
  margin: 0 0 6px;
  font-size: 22px;
}

.brand p {
  margin: 0;
  color: #9ca3af;
  font-size: 14px;
}

.menu {
  display: grid;
  gap: 10px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 10px;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #1f2937;
  color: white;
}

.menu-item.active {
  background: #2563eb;
  color: white;
}

.main {
  min-width: 0;
}

.topbar {
  height: 82px;
  padding: 0 28px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar h2 {
  margin: 0 0 6px;
  color: #111827;
}

.topbar p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 10px;
}

.home-button,
.logout-button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.home-button {
  background: #e5e7eb;
  color: #374151;
}

.home-button:hover {
  background: #d1d5db;
}

.logout-button {
  background: #fee2e2;
  color: #dc2626;
}

.logout-button:hover {
  background: #fecaca;
}

.content {
  padding: 28px;
}

@media (max-width: 900px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    padding: 18px;
  }

  .brand {
    margin-bottom: 18px;
  }

  .brand h1 {
    font-size: 20px;
  }

  .menu {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .menu-item {
    padding: 9px 12px;
    font-size: 14px;
  }

  .topbar {
    height: auto;
    padding: 18px;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .home-button,
  .logout-button {
    width: 100%;
  }

  .content {
    padding: 18px;
  }
}

@media (max-width: 520px) {
  .actions {
    grid-template-columns: 1fr;
  }

  .menu {
    flex-direction: column;
  }

  .menu-item {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
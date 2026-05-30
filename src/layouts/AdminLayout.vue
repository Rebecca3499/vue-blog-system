<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="side-brand">
        <h1>Shiqi Blog</h1>
        <p>Admin Console</p>
      </div>

      <nav class="menu" aria-label="后台菜单">
        <RouterLink to="/admin" class="menu-item" exact-active-class="active">
          数据概览
        </RouterLink>

        <RouterLink to="/admin/articles" class="menu-item" exact-active-class="active">
          文章管理
        </RouterLink>

        <RouterLink to="/admin/articles/new" class="menu-item" exact-active-class="active">
          发布文章
        </RouterLink>

        <RouterLink to="/admin/categories" class="menu-item" exact-active-class="active">
          分类管理
        </RouterLink>

        <RouterLink to="/admin/advanced" class="menu-item" exact-active-class="active">
          高级特性
        </RouterLink>
      </nav>
    </aside>

    <main class="main">
      <AppTopBar variant="admin" />

      <section class="content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import AppTopBar from '../components/common/AppTopBar.vue'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  background: var(--bg-page);
  font-family: Arial, system-ui, sans-serif;
}

.sidebar {
  min-width: 0;
  padding: 24px 18px;
  border-right: 1px solid var(--border-color);
  background: var(--bg-card-soft);
  color: var(--text-primary);
}

.side-brand {
  margin-bottom: 28px;
}

.side-brand h1 {
  margin: 0 0 6px;
  color: var(--text-primary);
  font-size: 18px;
  line-height: 1.25;
  letter-spacing: 0;
  white-space: nowrap;
}

.side-brand p {
  margin: 0;
  color: var(--text-muted);
  font-size: 12px;
}

.menu {
  display: grid;
  gap: 10px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: var(--primary-soft);
  color: var(--primary);
}

.menu-item.active {
  background: var(--primary);
  color: #ffffff;
}

.main {
  min-width: 0;
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

  .side-brand {
    margin-bottom: 16px;
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

  .content {
    padding: 18px;
  }
}

@media (max-width: 520px) {
  .menu {
    flex-direction: column;
  }

  .menu-item {
    width: 100%;
  }
}
</style>

<template>
  <div class="category-manage-page">
    <div class="toolbar">
      <div>
        <strong>分类总数：{{ categoryStats.length }}</strong>
        <span class="tip">分类根据文章数据自动生成</span>
      </div>

      <button class="primary-button" @click="goCreateArticle">
        新增文章
      </button>
    </div>

    <div class="category-grid">
      <div
        v-for="category in categoryStats"
        :key="category.name"
        class="category-card"
      >
        <div class="category-header">
          <div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.count }} 篇文章</p>
          </div>

          <span class="badge">{{ category.percent }}%</span>
        </div>

        <div class="progress">
          <div
            class="progress-bar"
            :style="{ width: category.percent + '%' }"
          ></div>
        </div>

        <div class="article-list">
          <div
            v-for="article in category.articles"
            :key="article.id"
            class="article-item"
          >
            <span>{{ article.title }}</span>
            <button @click="goArticleEdit(article.id)">编辑</button>
          </div>
        </div>

        <div class="actions">
          <button
            class="view-button"
            @click="goFrontCategory(category.name)"
          >
            前台查看
          </button>

          <button
            class="delete-button"
            @click="handleDeleteCategory(category)"
          >
            删除分类
          </button>
        </div>
      </div>
    </div>

    <p v-if="categoryStats.length === 0" class="empty">
      暂无分类
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '../../stores/article'
import { useToast } from '../../components/toast/useToast'

const router = useRouter()
const articleStore = useArticleStore()
const { showToast } = useToast()

const categoryStats = computed(() => {
  const map = {}

  articleStore.articles.forEach(article => {
    if (!map[article.category]) {
      map[article.category] = []
    }

    map[article.category].push(article)
  })

  return Object.keys(map).map(name => {
    const articles = map[name]
    const count = articles.length
    const percent =
      articleStore.articles.length === 0
        ? 0
        : Math.round((count / articleStore.articles.length) * 100)

    return {
      name,
      count,
      percent,
      articles
    }
  })
})

function goCreateArticle() {
  router.push('/admin/articles/new')
}

function goArticleEdit(id) {
  router.push(`/admin/articles/edit/${id}`)
}

function goFrontCategory(categoryName) {
  router.push(`/?category=${encodeURIComponent(categoryName)}`)
}

function handleDeleteCategory(category) {
  if (category.count > 0) {
    showToast('该分类下还有文章，不能直接删除', 'warning')
    return
  }

  showToast('当前版本中分类由文章自动生成，无需单独删除', 'info')
}
</script>

<style scoped>
.category-manage-page {
  display: grid;
  gap: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar strong {
  color: var(--text-primary);
}

.tip {
  margin-left: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

.primary-button {
  padding: 10px 16px;
  border: 1px solid var(--primary);
  border-radius: var(--radius-sm);
  background: var(--primary);
  color: #ffffff;
  cursor: pointer;
}

.primary-button:hover {
  border-color: var(--primary-hover);
  background: var(--primary-hover);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.category-card {
  padding: 22px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 14px;
}

.category-header h3 {
  margin: 0 0 6px;
  color: var(--text-primary);
}

.category-header p {
  margin: 0;
  color: var(--text-secondary);
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 14px;
}

:global([data-theme="dark"]) .badge {
  background: #0b1f3a;
  color: #ffffff;
}

.progress {
  height: 8px;
  border-radius: 999px;
  background: var(--bg-card-soft);
  overflow: hidden;
  margin-bottom: 18px;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: var(--primary);
}

.article-list {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
}

.article-item span {
  color: var(--text-primary);
}

.article-item button {
  border: none;
  background: transparent;
  color: var(--primary);
  cursor: pointer;
}

.article-item button:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 10px;
}

.view-button,
.delete-button {
  flex: 1;
  padding: 9px 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.view-button {
  background: var(--primary-soft);
  color: var(--primary);
}

.view-button:hover {
  border-color: var(--primary);
  background: var(--primary);
  color: #ffffff;
}

.delete-button {
  background: color-mix(in srgb, var(--danger) 12%, transparent);
  color: var(--danger);
}

.delete-button:hover {
  border-color: var(--danger);
  background: var(--danger);
  color: #ffffff;
}

.empty {
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .primary-button {
    width: 100%;
  }

  .category-card {
    padding: 18px;
  }

  .category-header {
    flex-direction: column;
  }

  .article-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .actions {
    flex-direction: column;
  }
}
</style>

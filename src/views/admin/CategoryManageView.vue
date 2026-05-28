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
  color: #111827;
}

.tip {
  margin-left: 12px;
  color: #6b7280;
  font-size: 14px;
}

.primary-button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

.primary-button:hover {
  background: #1d4ed8;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.category-card {
  padding: 22px;
  border-radius: 16px;
  background: white;
  border: 1px solid #e5e7eb;
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
  color: #111827;
}

.category-header p {
  margin: 0;
  color: #6b7280;
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 14px;
}

.progress {
  height: 8px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
  margin-bottom: 18px;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: #2563eb;
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
  border-radius: 10px;
  background: #f9fafb;
}

.article-item span {
  color: #374151;
}

.article-item button {
  border: none;
  background: transparent;
  color: #2563eb;
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
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.view-button {
  background: #dbeafe;
  color: #1d4ed8;
}

.view-button:hover {
  background: #bfdbfe;
}

.delete-button {
  background: #fee2e2;
  color: #dc2626;
}

.delete-button:hover {
  background: #fecaca;
}

.empty {
  text-align: center;
  color: #9ca3af;
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
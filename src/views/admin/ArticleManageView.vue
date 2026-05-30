<template>
  <div class="article-manage-page">
    <div class="toolbar">
      <button class="primary-button" @click="goCreate">新增文章</button>
      <span class="count">共 {{ articleStore.articles.length }} 篇文章</span>
    </div>

    <div class="table-wrapper">
      <div class="table">
        <div class="table-header">
          <div>标题</div>
          <div>分类</div>
          <div>发布时间</div>
          <div>浏览量</div>
          <div>操作</div>
        </div>

        <div
          v-for="article in articleStore.articles"
          :key="article.id"
          class="table-row"
        >
          <div class="title">{{ article.title }}</div>
          <div>{{ article.category }}</div>
          <div>{{ article.createdAt }}</div>
          <div>{{ article.views }}</div>
          <div class="actions">
            <button class="edit-button" @click="goEdit(article.id)">
              编辑
            </button>
            <button class="delete-button" @click="handleDelete(article.id)">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="articleStore.articles.length === 0" class="empty">
      暂无文章
    </p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useArticleStore } from '../../stores/article'
import { useToast } from '../../components/toast/useToast'

const router = useRouter()
const articleStore = useArticleStore()
const { showToast } = useToast()

function goCreate() {
  router.push('/admin/articles/new')
}

function goEdit(id) {
  router.push(`/admin/articles/edit/${id}`)
}

function handleDelete(id) {
  const result = window.confirm('确定要删除这篇文章吗？')

  if (result) {
    articleStore.deleteArticle(id)
    showToast('文章删除成功', 'success')
  }
}
</script>

<style scoped>
.article-manage-page {
  display: grid;
  gap: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.primary-button,
.edit-button,
.delete-button {
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.primary-button {
  padding: 10px 16px;
  background: var(--primary);
  color: #ffffff;
}

.primary-button:hover {
  background: var(--primary-hover);
}

.count {
  color: var(--text-secondary);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table {
  min-width: 900px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr;
  align-items: center;
}

.table-header {
  padding: 14px 16px;
  background: var(--bg-card-soft);
  color: var(--text-primary);
  font-weight: bold;
}

.table-row {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.title {
  color: var(--text-primary);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-button {
  padding: 8px 12px;
  background: var(--primary-soft);
  color: var(--primary);
}

.edit-button:hover {
  border-color: var(--primary);
  background: var(--primary);
  color: #ffffff;
}

.delete-button {
  padding: 8px 12px;
  background: color-mix(in srgb, var(--danger) 12%, transparent);
  color: var(--danger);
}

.delete-button:hover {
  border-color: var(--danger);
  background: var(--danger);
  color: #ffffff;
}

.empty {
  margin-top: 24px;
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .primary-button {
    width: 100%;
  }

  .table {
    min-width: 780px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 2fr 1fr 1fr 1fr 1.4fr;
  }

  .actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .edit-button,
  .delete-button {
    width: 70px;
  }
}
</style>

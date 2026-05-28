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
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.primary-button {
  padding: 10px 16px;
  background: #2563eb;
  color: white;
}

.primary-button:hover {
  background: #1d4ed8;
}

.count {
  color: #6b7280;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table {
  min-width: 900px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  background: white;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr;
  align-items: center;
}

.table-header {
  padding: 14px 16px;
  background: #f3f4f6;
  color: #374151;
  font-weight: bold;
}

.table-row {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  color: #4b5563;
}

.title {
  color: #111827;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-button {
  padding: 8px 12px;
  background: #dbeafe;
  color: #1d4ed8;
}

.edit-button:hover {
  background: #bfdbfe;
}

.delete-button {
  padding: 8px 12px;
  background: #fee2e2;
  color: #dc2626;
}

.delete-button:hover {
  background: #fecaca;
}

.empty {
  margin-top: 24px;
  text-align: center;
  color: #9ca3af;
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
<template>
  <div class="page">
    <button class="back-button" @click="goBack">← 返回首页</button>

    <div v-if="article" class="article-detail">
      <span class="category">{{ article.category }}</span>

      <h1>{{ article.title }}</h1>

      <div class="info">
        <span>作者：{{ article.author }}</span>
        <span>发布时间：{{ article.createdAt }}</span>
        <span>浏览量：{{ article.views }}</span>
      </div>

      <p class="summary">{{ article.summary }}</p>

      <div class="content">
        <MdPreview
          :model-value="article.content"
          preview-theme="github"
          code-theme="github"
        />
      </div>
    </div>

    <div v-else class="not-found">
      <h1>文章不存在</h1>
      <p>没有找到对应的文章内容。</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { useArticleStore } from '../../stores/article'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const article = computed(() => {
  return articleStore.getArticleById(route.params.id)
})

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
  font-family: Arial, sans-serif;
}

.back-button {
  margin-bottom: 24px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #e5e7eb;
  color: #374151;
  cursor: pointer;
}

.back-button:hover {
  background: #d1d5db;
}

.article-detail {
  padding: 28px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.category {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 14px;
}

.article-detail h1 {
  margin: 18px 0 12px;
  color: #111827;
}

.info {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
  color: #6b7280;
  font-size: 14px;
}

.summary {
  color: #6b7280;
  margin-bottom: 24px;
}

.content {
  line-height: 1.8;
  color: #374151;
}

.not-found {
  text-align: center;
  color: #6b7280;
}

@media (max-width: 700px) {
  .page {
    margin: 20px auto;
    padding: 18px;
  }

  .article-detail {
    padding: 20px;
  }

  .article-detail h1 {
    font-size: 26px;
  }

  .info {
    flex-direction: column;
    gap: 8px;
  }

  .back-button {
    width: 100%;
  }
}
</style>
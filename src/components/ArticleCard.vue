<template>
  <div class="article-card" @click="goDetail">
    <div class="meta">
      <span>{{ article.category }}</span>
      <span>{{ article.createdAt }}</span>
      <span>浏览 {{ article.views }}</span>
    </div>

    <h2>{{ article.title }}</h2>
    <p>{{ article.summary }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function goDetail() {
  router.push(`/article/${props.article.id}`)
}
</script>

<style scoped>
.article-card {
  padding: 20px;
  border-radius: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.meta span {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 13px;
}

.article-card h2 {
  margin: 0 0 10px;
  color: #111827;
}

.article-card p {
  margin: 0;
  color: #4b5563;
}

@media (max-width: 560px) {
  .article-card {
    padding: 16px;
  }

  .article-card h2 {
    font-size: 20px;
  }

  .meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
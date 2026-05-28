<template>
  <div>
    <div class="article-list">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>

    <p v-if="articles.length === 0" class="empty">
      没有找到相关文章
    </p>
  </div>
</template>

<script setup>
import ArticleCard from './ArticleCard.vue'

defineProps({
  articles: {
    type: Array,
    required: true
  }
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

await sleep(1000)
</script>

<style scoped>
.article-list {
  display: grid;
  gap: 16px;
}

.empty {
  margin-top: 24px;
  text-align: center;
  color: #9ca3af;
}
</style>
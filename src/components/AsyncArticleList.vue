<template>
  <div>
    <div class="article-list">
      <ArticleCard
        v-for="(article, index) in articles"
        :key="article.id"
        :article="article"
        :index="index"
      />
    </div>

    <EmptyState
      v-if="articles.length === 0"
      title="暂无文章"
      description="没有找到符合条件的文章，请尝试更换关键词或分类。"
    />
  </div>
</template>

<script setup>
import ArticleCard from './ArticleCard.vue'
import EmptyState from './common/EmptyState.vue'

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
  gap: 20px;
}
</style>

<template>
  <div class="page">
    <div class="top-bar">
      <div>
        <h1>我的迷你博客</h1>
        <p class="subtitle">这是我的第一个 Vue 前端练习页面</p>
      </div>

      <button class="admin-button" @click="goAdmin">
        进入后台
      </button>
    </div>

    <SearchBox v-model="keyword" />

    <CategoryFilter
      v-model="selectedCategory"
      :categories="categories"
    />

    <Suspense>
      <template #default>
        <AsyncArticleList :articles="filteredArticles" />
      </template>

      <template #fallback>
        <ArticleSkeleton />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SearchBox from '../../components/SearchBox.vue'
import CategoryFilter from '../../components/CategoryFilter.vue'
import AsyncArticleList from '../../components/AsyncArticleList.vue'
import ArticleSkeleton from '../../components/skeleton/ArticleSkeleton.vue'
import { useArticleStore } from '../../stores/article'

const router = useRouter()
const route = useRoute()
const articleStore = useArticleStore()

const keyword = ref('')
const selectedCategory = ref(route.query.category || '全部')

const categories = computed(() => {
  return [
    '全部',
    ...new Set(articleStore.articles.map(article => article.category))
  ]
})

const filteredArticles = computed(() => {
  return articleStore.articles.filter(article => {
    const matchKeyword = article.title.includes(keyword.value)
    const matchCategory =
      selectedCategory.value === '全部' ||
      article.category === selectedCategory.value

    return matchKeyword && matchCategory
  })
})

function goAdmin() {
  router.push('/admin')
}
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
  font-family: Arial, sans-serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

h1 {
  margin-bottom: 8px;
  color: #1f2937;
}

.subtitle {
  margin-bottom: 24px;
  color: #6b7280;
}

.admin-button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #111827;
  color: white;
  cursor: pointer;
}

.admin-button:hover {
  background: #374151;
}

@media (max-width: 700px) {
  .page {
    margin: 20px auto;
    padding: 18px;
  }

  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-button {
    width: 100%;
  }

  h1 {
    font-size: 26px;
  }

  .subtitle {
    margin-bottom: 18px;
  }
}
</style>
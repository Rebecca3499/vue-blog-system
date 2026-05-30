<template>
  <aside class="blog-sidebar" aria-label="博客侧边栏">
    <section class="sidebar-card profile-card">
      <div class="avatar" aria-hidden="true">S</div>
      <h3>Shiqi</h3>
      <p>前端学习者，正在通过 Vue 3 实践组件化、路由、状态管理与工程化开发。</p>
    </section>

    <section class="sidebar-card">
      <div class="card-heading">
        <h3>站点统计</h3>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <strong>{{ articleCount }}</strong>
          <span>文章数</span>
        </div>
        <div class="stat-item">
          <strong>{{ categoryCount }}</strong>
          <span>分类数</span>
        </div>
        <div class="stat-item">
          <strong>{{ techStacks.length }}</strong>
          <span>技术点</span>
        </div>
        <div class="stat-item">
          <strong>{{ runningDays }}</strong>
          <span>运行天数</span>
        </div>
      </div>
    </section>

    <section class="sidebar-card">
      <div class="card-heading">
        <h3>技术栈</h3>
      </div>
      <div class="tag-list">
        <span v-for="item in techStacks" :key="item">{{ item }}</span>
      </div>
    </section>

    <section class="sidebar-card">
      <div class="card-heading">
        <h3>热门文章</h3>
      </div>
      <div class="hot-list">
        <RouterLink
          v-for="article in hotArticles"
          :key="article.id"
          class="hot-item"
          :to="`/article/${article.id}`"
        >
          <strong>{{ article.title }}</strong>
          <span>{{ article.category }} · {{ article.createdAt }}</span>
        </RouterLink>
      </div>
    </section>

    <section class="sidebar-card quote-card">
      <div class="card-heading">
        <h3>每日一句</h3>
        <button type="button" @click="refreshQuote">换一句</button>
      </div>
      <p>{{ currentQuote }}</p>
    </section>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  articles: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const techStacks = [
  'Vue 3',
  'Vite',
  'Pinia',
  'Vue Router',
  'Axios',
  'md-editor-v3',
  'Teleport',
  'Suspense',
  'localStorage',
  'Responsive'
]

const quotes = [
  '保持热爱，也保持练习。',
  '把每一次项目实践都变成真正掌握的经验。',
  '学前端不是只看懂代码，而是能把功能完整做出来。'
]

const quoteIndex = ref(0)

const articleCount = computed(() => props.articles.length)

const categoryCount = computed(() => {
  return props.categories.filter(category => category !== '全部').length
})

const runningDays = computed(() => {
  const startTime = new Date('2026-05-01T00:00:00').getTime()
  const dayTime = 24 * 60 * 60 * 1000

  return Math.max(1, Math.ceil((Date.now() - startTime) / dayTime))
})

const hotArticles = computed(() => {
  return [...props.articles]
    .sort((prev, next) => (next.views || 0) - (prev.views || 0))
    .slice(0, 5)
})

const currentQuote = computed(() => quotes[quoteIndex.value])

function refreshQuote() {
  quoteIndex.value = (quoteIndex.value + 1) % quotes.length
}
</script>

<style scoped>
.blog-sidebar {
  display: grid;
  gap: 18px;
  align-content: start;
}

.sidebar-card {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.profile-card {
  text-align: center;
}

.avatar {
  width: 70px;
  height: 70px;
  margin: 0 auto 14px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    linear-gradient(135deg, var(--primary), var(--accent));
  color: #ffffff;
  font-size: 32px;
  font-weight: 800;
}

.sidebar-card h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 17px;
}

.profile-card p,
.quote-card p {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.card-heading button {
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card-soft);
  color: var(--text-secondary);
  font-size: 12px;
}

.card-heading button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.stat-item {
  padding: 12px;
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
  text-align: center;
}

.stat-item strong {
  display: block;
  color: var(--primary);
  font-size: 22px;
  line-height: 1.1;
}

.stat-item span {
  color: var(--text-secondary);
  font-size: 12px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-list span {
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 12px;
}

:global([data-theme="dark"]) .tag-list span {
  background: #0b1f3a;
  color: #ffffff;
}

:global([data-theme="dark"]) .stat-item {
  background: #111827;
}

.hot-list {
  display: grid;
  gap: 12px;
}

.hot-item {
  display: block;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.hot-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.hot-item strong {
  display: block;
  margin-bottom: 5px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.45;
}

.hot-item span {
  color: var(--text-muted);
  font-size: 12px;
}

.hot-item:hover strong {
  color: var(--primary);
}
</style>

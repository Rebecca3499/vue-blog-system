<template>
  <div class="async-panel">
    <div class="summary-grid">
      <div class="summary-card">
        <span>异步文章统计</span>
        <strong>{{ articles.length }}</strong>
        <p>当前文章总数</p>
      </div>

      <div class="summary-card">
        <span>推荐文章</span>
        <strong>{{ recommendedArticles.length }}</strong>
        <p>按浏览量排序展示</p>
      </div>

      <div class="summary-card">
        <span>技术栈完成度</span>
        <strong>{{ finishRate }}%</strong>
        <p>{{ finishedCount }} / {{ techItems.length }} 项</p>
      </div>
    </div>

    <div class="async-content-grid">
      <section class="result-card">
        <h3>推荐文章</h3>
        <div v-if="recommendedArticles.length" class="recommend-list">
          <RouterLink
            v-for="article in recommendedArticles"
            :key="article.id"
            :to="`/article/${article.id}`"
          >
            <strong>{{ article.title }}</strong>
            <span>{{ article.category }} · 浏览 {{ Number(article.views) || 0 }}</span>
          </RouterLink>
        </div>
        <p v-else class="empty-text">暂无可推荐文章</p>
      </section>

      <section class="result-card">
        <h3>项目亮点</h3>
        <div class="tag-list">
          <span v-for="item in highlights" :key="item">{{ item }}</span>
        </div>
      </section>

      <section class="result-card result-card--wide">
        <h3>技术栈完成度</h3>
        <div class="progress-list">
          <div v-for="item in techItems" :key="item.name" class="progress-item">
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ item.done ? '已完成' : '可继续完善' }}</span>
            </div>
            <div class="progress-track">
              <div class="progress-bar" :style="{ width: item.done ? '100%' : '45%' }"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  articles: {
    type: Array,
    default: () => []
  }
})

await new Promise(resolve => {
  setTimeout(resolve, 900)
})

const techItems = [
  { name: 'Vue 3', done: true },
  { name: 'Vite', done: true },
  { name: 'Vue Router', done: true },
  { name: 'Pinia', done: true },
  { name: 'Axios', done: true },
  { name: 'Markdown Editor', done: true },
  { name: 'Teleport', done: true },
  { name: 'Suspense', done: true },
  { name: 'CSS Variables', done: true },
  { name: 'localStorage', done: true },
  { name: 'Responsive Design', done: true },
  { name: 'FileReader', done: true }
]

const highlights = [
  '前后台一体',
  '浅色 / 深色主题',
  '本地封面图',
  '文章目录索引',
  '全局 Toast',
  '骨架屏加载'
]

const recommendedArticles = computed(() => {
  return [...props.articles]
    .sort((prev, next) => (Number(next.views) || 0) - (Number(prev.views) || 0))
    .slice(0, 4)
})

const finishedCount = computed(() => {
  return techItems.filter(item => item.done).length
})

const finishRate = computed(() => {
  return Math.round((finishedCount.value / techItems.length) * 100)
})
</script>

<style scoped>
.async-panel {
  display: grid;
  gap: 18px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.summary-card,
.result-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
}

.summary-card {
  padding: 16px;
}

.summary-card span,
.summary-card p,
.recommend-list span,
.progress-item span,
.empty-text {
  color: var(--text-secondary);
}

.summary-card strong {
  display: block;
  margin: 8px 0 4px;
  color: var(--text-primary);
  font-size: 28px;
}

.summary-card p {
  margin: 0;
  font-size: 13px;
}

.async-content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.result-card {
  padding: 18px;
}

.result-card--wide {
  grid-column: 1 / -1;
}

.result-card h3 {
  margin: 0 0 14px;
  color: var(--text-primary);
  font-size: 18px;
}

.recommend-list {
  display: grid;
  gap: 10px;
}

.recommend-list a {
  display: grid;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
}

.recommend-list a:hover {
  border-color: var(--primary);
}

.recommend-list strong {
  color: var(--text-primary);
}

.recommend-list span {
  font-size: 13px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-list span {
  padding: 7px 11px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 13px;
}

.progress-list {
  display: grid;
  gap: 12px;
}

.progress-item {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}

.progress-item strong {
  display: block;
  color: var(--text-primary);
}

.progress-item span {
  font-size: 13px;
}

.progress-track {
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--bg-card);
}

.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: var(--primary);
}

:global([data-theme="dark"]) .tag-list span {
  background: #0b1f3a;
  color: #ffffff;
}

@media (max-width: 900px) {
  .summary-grid,
  .async-content-grid {
    grid-template-columns: 1fr;
  }

  .progress-item {
    grid-template-columns: 1fr;
  }
}
</style>

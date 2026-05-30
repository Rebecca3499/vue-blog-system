<template>
  <div class="dashboard-page">
    <div class="stats-grid">
      <div class="stat-card">
        <p>文章总数</p>
        <strong>{{ articleCount }}</strong>
      </div>

      <div class="stat-card">
        <p>分类数量</p>
        <strong>{{ categoryCount }}</strong>
      </div>

      <div class="stat-card">
        <p>总浏览量</p>
        <strong>{{ totalViews }}</strong>
      </div>

      <div class="stat-card">
        <p>最近更新</p>
        <strong>{{ latestArticleDate }}</strong>
      </div>
    </div>

    <div class="content-grid">
      <section class="panel">
        <div class="panel-header">
          <h2>最近文章</h2>
          <button class="link-button" @click="goArticleManage">查看全部</button>
        </div>

        <div class="article-list">
          <div
            v-for="article in recentArticles"
            :key="article.id"
            class="article-item"
          >
            <div>
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
            </div>

            <div class="article-meta">
              <span>{{ article.category }}</span>
              <span>{{ article.createdAt }}</span>
              <span>浏览 {{ article.views }}</span>
            </div>
          </div>
        </div>

        <p v-if="recentArticles.length === 0" class="empty">
          暂无文章
        </p>
      </section>

      <section class="panel">
        <h2>分类统计</h2>

        <div class="category-list">
          <div
            v-for="item in categoryStats"
            :key="item.name"
            class="category-item"
          >
            <div class="category-info">
              <span class="category-name">{{ item.name }}</span>
              <span class="category-count">{{ item.count }} 篇</span>
            </div>

            <div class="progress">
              <div
                class="progress-bar"
                :style="{ width: item.percent + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <p v-if="categoryStats.length === 0" class="empty">
          暂无分类
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '../../stores/article'
import { fetchDashboardStats } from '../../api/dashboard'
import { useToast } from '../../components/toast/useToast'

const router = useRouter()
const articleStore = useArticleStore()

const articleCount = computed(() => {
  return articleStore.articles.length
})

const categoryStats = computed(() => {
  const map = {}

  articleStore.articles.forEach(article => {
    if (!map[article.category]) {
      map[article.category] = 0
    }

    map[article.category]++
  })

  return Object.keys(map).map(name => {
    const count = map[name]
    const percent =
      articleCount.value === 0
        ? 0
        : Math.round((count / articleCount.value) * 100)

    return {
      name,
      count,
      percent
    }
  })
})

const categoryCount = computed(() => {
  return categoryStats.value.length
})

const totalViews = computed(() => {
  return articleStore.articles.reduce((sum, article) => {
    return sum + article.views
  }, 0)
})

const latestArticleDate = computed(() => {
  if (articleStore.articles.length === 0) {
    return '-'
  }

  return articleStore.articles[0].createdAt
})

const recentArticles = computed(() => {
  return articleStore.articles.slice(0, 5)
})

const { showToast } = useToast()

onMounted(async () => {
  const result = await fetchDashboardStats({
    articleCount: articleCount.value,
    categoryCount: categoryCount.value,
    totalViews: totalViews.value
  })

  if (result.code === 200) {
    console.log('模拟接口返回：', result.data)
    showToast('后台统计数据加载完成', 'success')
  }
})

function goArticleManage() {
  router.push('/admin/articles')
}

</script>

<style scoped>
.dashboard-page {
  display: grid;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  padding: 22px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
}

.stat-card p {
  margin: 0 0 10px;
  color: var(--text-secondary);
}

.stat-card strong {
  font-size: 28px;
  color: var(--text-primary);
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.panel {
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
}

.panel h2 {
  margin: 0 0 18px;
  color: var(--text-primary);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link-button {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--primary-soft);
  color: var(--primary);
  cursor: pointer;
}

.link-button:hover {
  border-color: var(--primary);
  background: var(--primary);
  color: #ffffff;
}

.article-list {
  display: grid;
  gap: 14px;
}

.article-item {
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
  border: 1px solid var(--border-color);
}

.article-item h3 {
  margin: 0 0 8px;
  color: var(--text-primary);
}

.article-item p {
  margin: 0 0 12px;
  color: var(--text-secondary);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.article-meta span {
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 13px;
}

:global([data-theme="dark"]) .article-meta span {
  background: #0b1f3a;
  color: #ffffff;
}

.category-list {
  display: grid;
  gap: 18px;
}

.category-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.category-name {
  color: var(--text-primary);
  font-weight: 600;
}

.category-count {
  color: var(--text-secondary);
  font-size: 14px;
}

.progress {
  height: 8px;
  border-radius: 999px;
  background: var(--bg-card-soft);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: var(--primary);
}

.empty {
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 18px;
  }

  .stat-card strong {
    font-size: 24px;
  }

  .panel {
    padding: 18px;
  }

  .panel-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

<template>
  <div class="blog-home">
    <AppTopBar variant="front" />

    <main>
      <section class="hero page-shell">
        <div class="hero-copy">
          <span class="eyebrow">Vue 3 Practice Blog</span>
          <h1>Shiqi Blog</h1>
          <p class="hero-subtitle">
            一个记录前端学习、Vue 项目实践与技术成长的个人博客系统
          </p>
          <p class="hero-description">
            基于 Vue 3 + Vite + Pinia + Vue Router 构建，包含博客前台、后台管理、主题切换、Toast 通知、Suspense 异步加载与响应式适配。
          </p>

          <div class="hero-actions">
            <button class="primary-action" type="button" @click="scrollToSection('articles')">
              查看文章
            </button>
            <button class="secondary-action" type="button" @click="goAdmin">
              进入后台
            </button>
          </div>
        </div>

        <div id="features" class="hero-panel" aria-label="项目特性">
          <div class="panel-row">
            <span>Vue 3</span>
            <strong>Composition API</strong>
          </div>
          <div class="panel-row">
            <span>Pinia</span>
            <strong>State Store</strong>
          </div>
          <div class="panel-row">
            <span>Router</span>
            <strong>Front + Admin</strong>
          </div>
          <div class="panel-row">
            <span>Theme</span>
            <strong>Light / Dark</strong>
          </div>
        </div>

        <button
          class="scroll-indicator"
          type="button"
          aria-label="滚动到文章区域"
          @click="scrollToSection('articles')"
        >
          ↓
        </button>
      </section>

      <section class="welcome page-shell">
        欢迎访问 Shiqi Blog，这里记录我的前端学习过程和项目实践成果。
      </section>

      <section class="content-layout page-shell">
        <div id="articles" class="main-column">
          <div class="section-heading">
            <div>
              <span class="section-kicker">Latest Posts</span>
              <h2>最新文章</h2>
              <p>记录 Vue 学习、前端实践和项目开发过程中的关键内容。</p>
            </div>
            <span class="article-count">{{ filteredArticles.length }} / {{ articleStore.articles.length }}</span>
          </div>

          <div class="filter-card">
            <SearchBox v-model="keyword" />

            <div id="categories" class="filter-heading">
              <span>文章分类</span>
              <small>选择分类后会立即筛选文章</small>
            </div>

            <CategoryFilter
              v-model="selectedCategory"
              :categories="categories"
            />
          </div>

          <Suspense>
            <template #default>
              <AsyncArticleList :articles="filteredArticles" />
            </template>

            <template #fallback>
              <ArticleSkeleton />
            </template>
          </Suspense>
        </div>

        <BlogSidebar
          class="side-column"
          :articles="articleStore.articles"
          :categories="categories"
        />
      </section>
    </main>

    <BackToTop />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppTopBar from '../../components/common/AppTopBar.vue'
import SearchBox from '../../components/SearchBox.vue'
import CategoryFilter from '../../components/CategoryFilter.vue'
import AsyncArticleList from '../../components/AsyncArticleList.vue'
import ArticleSkeleton from '../../components/skeleton/ArticleSkeleton.vue'
import BackToTop from '../../components/common/BackToTop.vue'
import BlogSidebar from '../../components/blog/BlogSidebar.vue'
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
  const normalizedKeyword = keyword.value.trim().toLowerCase()

  return articleStore.articles.filter(article => {
    const title = String(article.title || '').toLowerCase()
    const matchKeyword = !normalizedKeyword || title.includes(normalizedKeyword)
    const matchCategory =
      selectedCategory.value === '全部' ||
      article.category === selectedCategory.value

    return matchKeyword && matchCategory
  })
})

function goAdmin() {
  router.push('/admin')
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}
</script>

<style scoped>
.blog-home {
  min-height: 100vh;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--primary-soft) 46%, transparent), transparent 420px),
    var(--bg-page);
  color: var(--text-primary);
}

.page-shell {
  width: min(100% - 40px, 1200px);
  margin: 0 auto;
}

.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 42px;
  align-items: center;
  min-height: 500px;
  padding: 64px 0 82px;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 36px 0 64px;
  z-index: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.hero-copy,
.hero-panel,
.scroll-indicator {
  position: relative;
  z-index: 1;
}

.hero-copy {
  padding-left: 40px;
}

.eyebrow,
.section-kicker {
  display: inline-flex;
  margin-bottom: 14px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(44px, 7vw, 74px);
  font-weight: 900;
  line-height: 1;
}

.hero-subtitle {
  max-width: 760px;
  margin: 18px 0 0;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.45;
}

.hero-description {
  max-width: 760px;
  margin: 16px 0 0;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.primary-action,
.secondary-action {
  min-height: 44px;
  padding: 11px 18px;
  border-radius: 999px;
  font-weight: 700;
}

.primary-action {
  border: 1px solid var(--primary);
  background: var(--primary);
  color: #ffffff;
}

.primary-action:hover {
  border-color: var(--primary-hover);
  background: var(--primary-hover);
}

.secondary-action {
  border: 1px solid var(--border-color);
  background: var(--bg-card-soft);
  color: var(--text-primary);
}

.secondary-action:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.hero-panel {
  display: grid;
  gap: 12px;
  margin-right: 40px;
  padding: 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card-soft);
}

.panel-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
}

.panel-row span {
  color: var(--text-secondary);
}

.panel-row strong {
  color: var(--text-primary);
}

.scroll-indicator {
  position: absolute;
  left: 50%;
  bottom: 24px;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  background: var(--bg-card);
  color: var(--primary);
  box-shadow: var(--shadow-card);
  transform: translateX(-50%);
}

.welcome {
  margin-top: -24px;
  padding: 16px 22px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  color: var(--text-secondary);
  box-shadow: var(--shadow-card);
  text-align: center;
  line-height: 1.7;
}

.content-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 28px;
  padding: 42px 0 64px;
  align-items: start;
}

.main-column,
.side-column {
  min-width: 0;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 30px;
  line-height: 1.2;
}

.section-heading p {
  margin: 8px 0 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.article-count {
  flex: 0 0 auto;
  padding: 7px 12px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 13px;
}

.filter-card {
  margin-bottom: 22px;
  padding: 20px 20px 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.filter-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.filter-heading span {
  color: var(--text-primary);
  font-weight: 700;
}

.filter-heading small {
  color: var(--text-muted);
}

@media (max-width: 980px) {
  .hero,
  .content-layout {
    grid-template-columns: 1fr;
  }

  .hero {
    gap: 24px;
    min-height: auto;
  }

  .hero-copy {
    padding: 0 28px;
  }

  .hero-panel {
    margin: 0 28px;
  }
}

@media (max-width: 760px) {
  .page-shell {
    width: min(100% - 28px, 1200px);
  }

  .hero h1 {
    font-size: 44px;
  }

  .hero-subtitle {
    font-size: 20px;
  }

  .section-heading,
  .filter-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .hero-copy,
  .hero-panel {
    padding-left: 18px;
    padding-right: 18px;
  }

  .hero-panel {
    margin: 0 14px;
  }

  .hero-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }

  .panel-row {
    flex-direction: column;
    gap: 4px;
  }

  .filter-card {
    padding: 16px 16px 0;
  }
}
</style>

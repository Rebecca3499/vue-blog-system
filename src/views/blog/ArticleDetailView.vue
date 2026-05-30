<template>
  <div class="article-page">
    <AppTopBar variant="front" />

    <main class="article-shell">
      <template v-if="article">
        <div class="article-layout">
          <ArticleToc
            class="toc-column"
            :items="tocItems"
            :meta="tocMeta"
          />

          <article class="article-card">
            <button class="back-link" type="button" @click="goArticles">
              ← 返回文章列表
            </button>

            <header class="article-head">
              <span class="category">{{ article.category }}</span>
              <h1>{{ article.title }}</h1>
              <p v-if="article.summary || article.description" class="summary">
                {{ article.summary || article.description }}
              </p>

              <div class="meta-list">
                <span>作者 Shiqi</span>
                <span>发布于 {{ publishDate }}</span>
                <span>分类 {{ article.category }}</span>
                <span>阅读 {{ displayViews }}</span>
                <span>点赞 {{ likeCount }}</span>
                <span>评论 {{ commentCount }}</span>
              </div>
            </header>

            <section class="cover" :class="{ 'has-image': coverUrl }" :style="coverStyle">
              <img
                v-if="coverUrl"
                :src="coverUrl"
                :alt="article.title"
                @error="handleCoverError"
              />
              <div v-else class="cover-placeholder">
                <span>{{ coverText }}</span>
                <strong>Shiqi Blog</strong>
              </div>
            </section>

            <section ref="markdownRef" class="markdown-body">
              <MdPreview
                :model-value="article.content"
                :theme="isDark ? 'dark' : 'light'"
                preview-theme="github"
                code-theme="github"
              />
            </section>

            <footer class="article-actions">
              <button class="ghost-button" type="button" @click="goHome">
                返回首页
              </button>
              <button class="primary-button" type="button" @click="goArticles">
                继续浏览文章
              </button>
            </footer>
          </article>
        </div>
      </template>

      <section v-else class="not-found">
        <EmptyState
          title="文章不存在"
          description="没有找到对应的文章，可能已经被删除或地址有误。"
        />
        <button class="primary-button" type="button" @click="goHome">
          返回首页
        </button>
      </section>
    </main>

    <BackToTop />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import AppTopBar from '../../components/common/AppTopBar.vue'
import ArticleToc from '../../components/article/ArticleToc.vue'
import BackToTop from '../../components/common/BackToTop.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import { useTheme } from '../../composables/useTheme'
import { useArticleStore } from '../../stores/article'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const { isDark } = useTheme()

const markdownRef = ref(null)
const coverBroken = ref(false)
const tocItems = ref([])
const headingObserver = ref(null)
let syncTimer = null

const article = computed(() => {
  return articleStore.getArticleById(route.params.id)
})

const publishDate = computed(() => {
  return article.value?.createdAt || article.value?.updatedAt || article.value?.date || '未设置'
})

const displayViews = computed(() => {
  return Number(article.value?.views) || 0
})

const likeCount = computed(() => {
  return Number(article.value?.likes) || 0
})

const commentCount = computed(() => {
  return Number(article.value?.comments) || 0
})

const coverUrl = computed(() => {
  if (!article.value || coverBroken.value) {
    return ''
  }

  return article.value.cover || article.value.image || article.value.thumbnail || ''
})

const coverText = computed(() => {
  return String(article.value?.category || article.value?.title || 'S').slice(0, 2)
})

const coverStyle = computed(() => {
  const id = article.value?.id || 0
  const gradients = [
    'linear-gradient(135deg, var(--primary), var(--accent))',
    'linear-gradient(135deg, var(--info), var(--primary))',
    'linear-gradient(135deg, var(--success), var(--info))',
    'linear-gradient(135deg, var(--warning), var(--danger))'
  ]

  return {
    background: gradients[id % gradients.length]
  }
})

const tocMeta = computed(() => {
  const content = article.value?.content || ''
  const words = content.replace(/\s+/g, '').length

  return {
    category: article.value?.category || '-',
    date: publishDate.value,
    words,
    minutes: Math.max(1, Math.ceil(words / 500))
  }
})

watch(
  () => [route.params.id, article.value?.content, isDark.value],
  async () => {
    coverBroken.value = false
    tocItems.value = []
    disconnectHeadingObserver()
    await nextTick()
    syncTocWithRenderedHeadings()
    observeMarkdownHeadings()
  },
  {
    immediate: true,
    flush: 'post'
  }
)

onBeforeUnmount(() => {
  disconnectHeadingObserver()
  clearSyncTimer()
})

watch(
  () => route.params.id,
  id => {
    if (articleStore.getArticleById(id)) {
      articleStore.incrementViews(id)
    }
  },
  {
    immediate: true
  }
)

function createHeadingId(text, index) {
  const slug = encodeURIComponent(text)
    .replace(/%/g, '')
    .replace(/[^\w-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

  return `heading-${slug || 'section'}-${index + 1}`
}

function syncTocWithRenderedHeadings(retryCount = 0) {
  const preview = markdownRef.value?.querySelector('.md-editor-preview')
  const headings = Array.from(preview?.querySelectorAll('h2, h3') || [])

  if (!headings.length) {
    if (article.value?.content && retryCount < 6) {
      window.setTimeout(() => {
        syncTocWithRenderedHeadings(retryCount + 1)
      }, 80)
    }

    return
  }

  const usedIds = new Set()

  const nextItems = headings.map((heading, index) => {
    const text = heading.textContent?.trim() || `标题 ${index + 1}`
    let id = createHeadingId(text, index)

    while (usedIds.has(id)) {
      id = `${id}-${usedIds.size + 1}`
    }

    usedIds.add(id)

    if (heading.id !== id) {
      heading.id = id
    }

    if (heading.dataset.tocId !== id) {
      heading.dataset.tocId = id
    }

    return {
      id,
      level: Number(heading.tagName.replace('H', '')),
      text
    }
  })

  if (JSON.stringify(tocItems.value) !== JSON.stringify(nextItems)) {
    tocItems.value = nextItems
  }
}

function observeMarkdownHeadings(retryCount = 0) {
  const preview = markdownRef.value?.querySelector('.md-editor-preview')

  if (!preview) {
    if (article.value?.content && retryCount < 6) {
      window.setTimeout(() => {
        observeMarkdownHeadings(retryCount + 1)
      }, 80)
    }

    return
  }

  headingObserver.value = new MutationObserver(() => {
    scheduleTocSync()
  })

  headingObserver.value.observe(preview, {
    attributes: true,
    childList: true,
    subtree: true
  })
}

function scheduleTocSync() {
  clearSyncTimer()

  syncTimer = window.setTimeout(() => {
    syncTocWithRenderedHeadings()
  }, 60)
}

function clearSyncTimer() {
  if (syncTimer) {
    window.clearTimeout(syncTimer)
    syncTimer = null
  }
}

function disconnectHeadingObserver() {
  headingObserver.value?.disconnect()
  headingObserver.value = null
}

function handleCoverError() {
  coverBroken.value = true
}

function goHome() {
  router.push('/')
}

function goArticles() {
  router.push({
    path: '/',
    hash: '#articles'
  })
}
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--bg-page);
  color: var(--text-primary);
}

.article-shell {
  width: min(100% - 48px, 1200px);
  margin: 0 auto;
  padding: 28px 0 64px;
}

.article-layout {
  min-height: calc(100vh - 92px);
}

.article-card,
.not-found {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.article-card {
  width: calc(100% - 332px);
  min-width: 0;
  margin-left: 0;
  overflow: hidden;
}

.toc-column {
  position: fixed !important;
  top: 84px !important;
  right: max(24px, calc((100vw - 1200px) / 2)) !important;
  width: 300px;
  max-height: calc(100vh - 108px);
  overflow-y: auto;
}

.back-link {
  margin: 22px 26px 0;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card-soft);
  color: var(--text-secondary);
  font-size: 14px;
}

.back-link:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.article-head {
  padding: 24px 26px 22px;
}

.category {
  display: inline-flex;
  margin-bottom: 14px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 13px;
  font-weight: 800;
}

:global([data-theme="dark"]) .category,
:global([data-theme="dark"]) .meta-list span {
  background: #0b1f3a;
  color: #ffffff;
}

.article-head h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.18;
}

.summary {
  margin: 14px 0 0;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.8;
}

.meta-list {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 18px;
}

.meta-list span {
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card-soft);
  color: var(--text-muted);
  font-size: 13px;
}

.cover {
  position: relative;
  height: 250px;
  margin: 0 26px 24px;
  overflow: hidden;
  border-radius: var(--radius-md);
  color: #ffffff;
}

.cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(7, 27, 51, 0.04), rgba(7, 27, 51, 0.32));
}

.cover.has-image::after {
  display: none;
}

.cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  position: relative;
  z-index: 1;
  height: 100%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
}

.cover-placeholder span {
  font-size: 54px;
  font-weight: 900;
}

.cover-placeholder strong {
  font-size: 18px;
}

.markdown-body {
  min-width: 0;
  padding: 0 26px 28px;
}

.markdown-body :deep(.md-editor) {
  background: transparent;
  color: var(--text-primary);
}

.markdown-body :deep(.md-editor-preview-wrapper) {
  padding: 0;
  background: transparent;
}

.markdown-body :deep(.md-editor-preview) {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.85;
  word-break: break-word;
}

.markdown-body :deep(.md-editor-preview h1),
.markdown-body :deep(.md-editor-preview h2),
.markdown-body :deep(.md-editor-preview h3),
.markdown-body :deep(.md-editor-preview h4) {
  color: var(--text-primary);
  font-weight: 800;
  line-height: 1.35;
  scroll-margin-top: 88px;
}

.markdown-body :deep(.md-editor-preview h1) {
  margin: 0 0 24px;
  font-size: 32px;
}

.markdown-body :deep(.md-editor-preview h2) {
  margin: 34px 0 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
  font-size: 25px;
}

.markdown-body :deep(.md-editor-preview h3) {
  margin: 28px 0 12px;
  font-size: 20px;
}

.markdown-body :deep(.md-editor-preview h4) {
  margin: 22px 0 10px;
  font-size: 18px;
}

.markdown-body :deep(.md-editor-preview p) {
  margin: 0 0 18px;
  color: var(--text-secondary);
}

.markdown-body :deep(.md-editor-preview ul),
.markdown-body :deep(.md-editor-preview ol) {
  margin: 0 0 20px;
  padding-left: 26px;
  color: var(--text-secondary);
}

.markdown-body :deep(.md-editor-preview li) {
  margin: 7px 0;
}

.markdown-body :deep(.md-editor-preview blockquote) {
  margin: 24px 0;
  padding: 15px 18px;
  border-left: 4px solid var(--primary);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
  color: var(--text-secondary);
}

.markdown-body :deep(.md-editor-preview blockquote p) {
  margin: 0;
}

.markdown-body :deep(.md-editor-preview a) {
  color: var(--primary);
  font-weight: 700;
}

.markdown-body :deep(.md-editor-preview a:hover) {
  color: var(--primary-hover);
  text-decoration: underline;
}

.markdown-body :deep(.md-editor-preview code:not(pre code)) {
  padding: 2px 7px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card-soft);
  color: var(--primary);
  font-size: 0.92em;
}

.markdown-body :deep(.md-editor-preview pre) {
  max-width: 100%;
  margin: 24px 0;
  padding: 18px;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: #f8fafc !important;
  color: #1f2937 !important;
}

.markdown-body :deep(.md-editor-preview pre code) {
  padding: 0;
  border: 0;
  background: transparent !important;
  color: inherit !important;
  white-space: pre;
}

:global([data-theme="dark"]) .markdown-body :deep(.md-editor-preview pre) {
  border: 1px solid #334155;
  background: #020617 !important;
  color: #cbd5e1 !important;
}

:global([data-theme="dark"]) .markdown-body :deep(.md-editor-preview pre code) {
  background: transparent !important;
  color: #cbd5e1 !important;
  line-height: 1.75;
  text-shadow: none;
}

:global([data-theme="dark"]) .markdown-body :deep(.md-editor-preview pre span) {
  color: inherit;
}

.markdown-body :deep(.md-editor-preview table) {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 24px 0;
  overflow-x: auto;
  border-collapse: collapse;
}

.markdown-body :deep(.md-editor-preview th),
.markdown-body :deep(.md-editor-preview td) {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
}

.markdown-body :deep(.md-editor-preview th) {
  background: var(--bg-card-soft);
  color: var(--text-primary);
}

.markdown-body :deep(.md-editor-preview td) {
  color: var(--text-secondary);
}

.markdown-body :deep(.md-editor-preview img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

.article-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px 26px 26px;
  border-top: 1px solid var(--border-color);
}

.ghost-button,
.primary-button {
  min-height: 40px;
  padding: 9px 14px;
  border-radius: var(--radius-sm);
  font-weight: 700;
}

.ghost-button {
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-secondary);
}

.ghost-button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.primary-button {
  border: 1px solid var(--primary);
  background: var(--primary);
  color: #ffffff;
}

.primary-button:hover {
  border-color: var(--primary-hover);
  background: var(--primary-hover);
}

.not-found {
  max-width: 720px;
  margin: 48px auto;
  padding: 28px;
  text-align: center;
}

.not-found .primary-button {
  margin-top: 18px;
}

@media (max-width: 1080px) {
  .article-shell {
    width: min(100% - 32px, 900px);
    margin: 0 auto;
  }

  .article-layout {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .toc-column {
    position: static !important;
    order: 1;
    width: 100%;
    max-height: none;
    overflow: visible;
  }

  .article-card {
    order: 2;
    width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 700px) {
  .article-shell {
    width: min(100% - 28px, 900px);
    padding-top: 18px;
  }

  .back-link,
  .cover {
    margin-left: 18px;
    margin-right: 18px;
  }

  .article-head,
  .markdown-body {
    padding-left: 18px;
    padding-right: 18px;
  }

  .article-head h1 {
    font-size: 30px;
  }

  .cover {
    height: 210px;
  }

  .article-actions {
    padding: 18px;
  }

  .ghost-button,
  .primary-button {
    width: 100%;
  }
}
</style>

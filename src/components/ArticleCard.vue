<template>
  <article class="article-card">
    <button
      class="cover"
      :class="{ 'has-image': coverUrl }"
      type="button"
      :style="coverStyle"
      :aria-label="`阅读文章：${article.title}`"
      @click="goDetail"
    >
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="article.title"
        @error="handleCoverError"
      />
      <span v-else class="cover-placeholder">
        {{ coverText }}
      </span>
    </button>

    <div class="article-body">
      <div class="meta">
        <span class="category">{{ article.category }}</span>
        <span>{{ article.createdAt }}</span>
      </div>

      <h2>
        <button type="button" @click="goDetail">
          {{ article.title }}
        </button>
      </h2>

      <p>{{ article.summary }}</p>

      <div class="footer">
        <div class="metrics" aria-label="文章数据">
          <span>阅读 {{ displayViews }}</span>
          <span>评论 {{ commentCount }}</span>
          <span>点赞 {{ likeCount }}</span>
        </div>

        <button class="read-more" type="button" @click="goDetail">
          阅读全文
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const router = useRouter()
const coverBroken = ref(false)

const coverUrl = computed(() => {
  if (coverBroken.value) {
    return ''
  }

  return props.article.cover || props.article.image || props.article.thumbnail || ''
})

const displayViews = computed(() => {
  return Number(props.article.views) || 0
})

const commentCount = computed(() => {
  return Number(props.article.comments) || 0
})

const likeCount = computed(() => {
  return Number(props.article.likes) || 0
})

const coverText = computed(() => {
  return String(props.article.category || props.article.title || 'S').slice(0, 2)
})

const coverStyle = computed(() => {
  const gradients = [
    'linear-gradient(135deg, var(--primary) 0%, var(--accent) 55%, var(--info) 100%)',
    'linear-gradient(135deg, var(--info) 0%, var(--primary) 58%, var(--accent) 100%)',
    'linear-gradient(135deg, var(--success) 0%, var(--info) 50%, var(--primary) 100%)',
    'linear-gradient(135deg, var(--warning) 0%, var(--danger) 45%, var(--accent) 100%)'
  ]

  return {
    background: gradients[props.index % gradients.length]
  }
})

function goDetail() {
  router.push(`/article/${props.article.id}`)
}

function handleCoverError() {
  coverBroken.value = true
}
</script>

<style scoped>
.article-card {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary);
  box-shadow: var(--shadow-hover);
}

.cover {
  position: relative;
  min-height: 188px;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  color: #ffffff;
}

.cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 24% 24%, rgba(255, 255, 255, 0.38), transparent 20%),
    linear-gradient(135deg, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.22));
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
  display: grid;
  min-height: 188px;
  place-items: center;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 0;
}

.article-body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 22px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.meta span {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--bg-card-soft);
  color: var(--text-muted);
  font-size: 13px;
}

.meta .category {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
}

:global([data-theme="dark"]) .meta span,
:global([data-theme="dark"]) .meta .category,
:global([data-theme="dark"]) .metrics span {
  background: #0b1f3a;
  color: #ffffff;
}

.article-card h2 {
  margin: 0 0 10px;
  font-size: 22px;
  line-height: 1.35;
}

.article-card h2 button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  text-align: left;
}

.article-card h2 button:hover {
  color: var(--primary);
}

.article-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: auto;
  padding-top: 20px;
}

.metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--text-muted);
  font-size: 13px;
}

.read-more {
  flex: 0 0 auto;
  padding: 8px 13px;
  border: 1px solid var(--primary);
  border-radius: 999px;
  background: var(--primary);
  color: #ffffff;
  font-size: 14px;
}

.read-more:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

@media (max-width: 760px) {
  .article-card {
    grid-template-columns: 1fr;
  }

  .cover,
  .cover-placeholder {
    min-height: 170px;
  }
}

@media (max-width: 560px) {
  .article-card {
    border-radius: var(--radius-md);
  }

  .article-body {
    padding: 18px;
  }

  .article-card h2 {
    font-size: 20px;
  }

  .meta {
    align-items: flex-start;
  }

  .footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .read-more {
    width: 100%;
  }
}
</style>

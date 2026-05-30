<template>
  <aside class="toc-card">
    <div class="toc-title">文章目录</div>

    <nav v-if="items.length" class="toc-list" aria-label="文章目录">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="toc-item"
        :class="`toc-item--${item.level}`"
        @click="scrollToHeading(item.id)"
      >
        {{ item.text }}
      </button>
    </nav>

    <p v-else class="toc-empty">暂无目录</p>

    <div v-if="meta" class="toc-meta">
      <div>
        <span>分类</span>
        <strong>{{ meta.category }}</strong>
      </div>
      <div>
        <span>发布</span>
        <strong>{{ meta.date }}</strong>
      </div>
      <div>
        <span>字数</span>
        <strong>{{ meta.words }}</strong>
      </div>
      <div>
        <span>阅读</span>
        <strong>{{ meta.minutes }} 分钟</strong>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  },
  meta: {
    type: Object,
    default: null
  }
})

function scrollToHeading(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}
</script>

<style scoped>
.toc-card {
  position: sticky;
  top: 84px;
  padding: 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.toc-title {
  margin-bottom: 12px;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 800;
}

.toc-list {
  display: grid;
  gap: 4px;
}

.toc-item {
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
}

.toc-item:hover {
  background: var(--primary-soft);
  color: var(--primary);
}

.toc-item--3 {
  padding-left: 24px;
  font-size: 13px;
}

.toc-empty {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
}

.toc-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.toc-meta div {
  padding: 10px;
  border-radius: var(--radius-sm);
  background: var(--bg-card-soft);
}

:global([data-theme="dark"]) .toc-item:hover,
:global([data-theme="dark"]) .toc-meta div {
  background: #0b1f3a;
}

:global([data-theme="dark"]) .toc-item:hover {
  color: #ffffff;
}

.toc-meta span {
  display: block;
  color: var(--text-muted);
  font-size: 12px;
}

.toc-meta strong {
  display: block;
  margin-top: 3px;
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.35;
}

@media (max-width: 980px) {
  .toc-card {
    position: static;
  }
}
</style>

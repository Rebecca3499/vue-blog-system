<template>
  <div class="empty-state">
    <div class="empty-state__mark" aria-hidden="true">&#8981;</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '暂无文章'
  },
  description: {
    type: String,
    default: '没有找到符合条件的文章，请尝试更换关键词或分类。'
  }
})
</script>

<style scoped>
.empty-state {
  padding: 42px 24px;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at top left, var(--primary-soft), transparent 38%),
    var(--bg-card);
  color: var(--text-secondary);
  text-align: center;
}

.empty-state__mark {
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--bg-card-soft);
  color: var(--primary);
  font-size: 30px;
  font-weight: 700;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 20px;
}

.empty-state p {
  max-width: 420px;
  margin: 0 auto;
  line-height: 1.7;
}
</style>

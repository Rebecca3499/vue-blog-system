<template>
  <div class="skeleton-list">
    <div v-for="item in 4" :key="item" class="skeleton-card">
      <div class="skeleton-meta"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-list {
  display: grid;
  gap: 16px;
}

.skeleton-card {
  padding: 20px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
}

.skeleton-meta,
.skeleton-title,
.skeleton-line {
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--bg-card-soft),
    color-mix(in srgb, var(--primary-soft) 58%, var(--bg-card)),
    var(--bg-card-soft)
  );
  background-size: 200% 100%;
  animation: loading 1.4s infinite;
}

.skeleton-meta {
  width: 220px;
  height: 22px;
  margin-bottom: 18px;
}

.skeleton-title {
  width: 45%;
  height: 26px;
  margin-bottom: 16px;
}

.skeleton-line {
  width: 100%;
  height: 16px;
  margin-bottom: 10px;
}

.skeleton-line.short {
  width: 65%;
}

@keyframes loading {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}
</style>

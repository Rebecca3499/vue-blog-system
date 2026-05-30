<template>
  <div class="search-box">
    <span class="search-icon" aria-hidden="true">⌕</span>
    <input
      :value="modelValue"
      class="search"
      placeholder="请输入文章标题关键词"
      @input="handleInput"
    />
    <button
      v-if="modelValue"
      class="clear-button"
      type="button"
      aria-label="清除搜索关键词"
      @click="clearSearch"
    >
      ×
    </button>
    <span v-else class="search-hint">Search</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event) {
  emit('update:modelValue', event.target.value)
}

function clearSearch() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.search-box {
  position: relative;
  width: 100%;
  margin-bottom: 24px;
}

.search {
  width: 100%;
  padding: 14px 82px 14px 44px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
  outline: none;
  box-shadow: var(--shadow-card);
}

.search:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-soft);
}

.search-icon,
.search-hint,
.clear-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.search-icon {
  left: 16px;
  color: var(--text-muted);
  font-size: 22px;
}

.search-hint {
  right: 16px;
  color: var(--text-muted);
  font-size: 13px;
}

.clear-button {
  right: 10px;
  width: 30px;
  height: 30px;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  background: var(--bg-card-soft);
  color: var(--text-secondary);
  font-size: 20px;
  line-height: 1;
}

.clear-button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

@media (max-width: 560px) {
  .search {
    padding-right: 52px;
    font-size: 14px;
  }

  .search-hint {
    display: none;
  }
}
</style>

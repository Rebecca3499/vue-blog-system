<template>
  <div class="category-filter" aria-label="文章分类">
    <button
      v-for="category in categories"
      :key="category"
      class="category-button"
      :class="{ active: modelValue === category }"
      type="button"
      @click="selectCategory(category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

function selectCategory(category) {
  emit('update:modelValue', category)
}
</script>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.category-button {
  padding: 9px 15px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-button:hover {
  transform: translateY(-1px);
  border-color: var(--primary);
  color: var(--primary);
}

.category-button.active {
  border-color: var(--primary);
  background: var(--primary);
  color: #ffffff;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--primary) 26%, transparent);
}

:global([data-theme="dark"]) .category-button {
  background: #111827;
  color: #e5f0ff;
}

:global([data-theme="dark"]) .category-button:hover,
:global([data-theme="dark"]) .category-button.active {
  border-color: #60a5fa;
  background: #0b1f3a;
  color: #ffffff;
}

@media (max-width: 560px) {
  .category-filter {
    flex-wrap: nowrap;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .category-button {
    flex: 0 0 auto;
    min-width: 72px;
    padding: 8px 10px;
    font-size: 14px;
  }
}
</style>

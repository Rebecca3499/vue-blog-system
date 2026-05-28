<template>
  <div class="category-filter">
    <button
      v-for="category in categories"
      :key="category"
      class="category-button"
      :class="{ active: modelValue === category }"
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
  padding: 8px 14px;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-button:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.category-button.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

@media (max-width: 560px) {
  .category-filter {
    gap: 8px;
  }

  .category-button {
    flex: 1;
    min-width: 72px;
    padding: 8px 10px;
    font-size: 14px;
  }
}
</style>
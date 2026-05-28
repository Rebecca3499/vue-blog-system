<template>
  <input
    :value="modelValue"
    class="search"
    placeholder="请输入文章标题关键词"
    @input="handleInput"
  />
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
</script>

<style scoped>
.search {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  margin-bottom: 24px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
}

.search:focus {
  border-color: #2563eb;
}

@media (max-width: 560px) {
  .search {
    font-size: 14px;
  }
}
</style>
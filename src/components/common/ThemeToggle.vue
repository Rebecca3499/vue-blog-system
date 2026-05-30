<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleTheme"
  >
    <template v-if="isDark">
      <span class="theme-toggle__icon" aria-hidden="true">&#x2600;&#xfe0f;</span>
      <span>&#x6d45;&#x8272;</span>
    </template>
    <template v-else>
      <span class="theme-toggle__icon" aria-hidden="true">&#x1f319;</span>
      <span>&#x6df1;&#x8272;</span>
    </template>
  </button>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 9px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-card);
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
}

.theme-toggle:hover {
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: var(--shadow-hover);
  transform: translateY(-1px);
}

.theme-toggle:focus-visible {
  outline: 3px solid var(--primary-soft);
  outline-offset: 2px;
}

.theme-toggle__icon {
  width: 18px;
  text-align: center;
}
</style>

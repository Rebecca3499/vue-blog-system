<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <div
        v-for="item in messages"
        :key="item.id"
        class="toast"
        :class="item.type"
      >
        <span class="icon">{{ iconMap[item.type] || 'i' }}</span>
        <span class="message">{{ item.message }}</span>
        <button
          class="close"
          type="button"
          aria-label="关闭通知"
          @click="removeToast(item.id)"
        >
          x
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from './useToast'

const { messages, removeToast } = useToast()

const iconMap = {
  success: 'OK',
  error: 'ERR',
  warning: '!',
  info: 'i'
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  min-width: 260px;
  max-width: 360px;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-left: 5px solid var(--info);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.25s ease;
}

.toast.success {
  border-left-color: var(--success);
}

.toast.error {
  border-left-color: var(--danger);
}

.toast.warning {
  border-left-color: var(--warning);
}

.toast.info {
  border-left-color: var(--info);
}

.icon {
  min-width: 34px;
  padding: 4px 6px;
  border-radius: 999px;
  background: var(--bg-card-soft);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 800;
  text-align: center;
}

.message {
  flex: 1;
  font-size: 14px;
}

.close {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
}

.close:hover {
  border-color: var(--border-color);
  background: var(--bg-card-soft);
  color: var(--text-primary);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(40px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 560px) {
  .toast-container {
    top: 16px;
    right: 16px;
    left: 16px;
  }

  .toast {
    min-width: 0;
    max-width: none;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>

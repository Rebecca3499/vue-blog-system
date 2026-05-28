<template>
  <Teleport to="body">
    <div class="toast-container">
      <div
        v-for="item in messages"
        :key="item.id"
        class="toast"
        :class="item.type"
      >
        <span class="icon">{{ iconMap[item.type] }}</span>
        <span class="message">{{ item.message }}</span>
        <button class="close" @click="removeToast(item.id)">×</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from './useToast'

const { messages, removeToast } = useToast()

const iconMap = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
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
  border-radius: 12px;
  background: white;
  color: #111827;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  border-left: 5px solid #2563eb;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.25s ease;
}

.toast.success {
  border-left-color: #22c55e;
}

.toast.error {
  border-left-color: #ef4444;
}

.toast.warning {
  border-left-color: #f59e0b;
}

.toast.info {
  border-left-color: #3b82f6;
}

.icon {
  font-size: 18px;
}

.message {
  flex: 1;
  font-size: 14px;
}

.close {
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
}

.close:hover {
  color: #111827;
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
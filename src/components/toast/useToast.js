import { reactive, ref } from 'vue'

const STORAGE_KEY = 'blog_toast_modes'
const toastTypes = ['success', 'error', 'warning', 'info']
const defaultModes = {
  success: 'auto',
  error: 'auto',
  warning: 'auto',
  info: 'auto'
}

const messages = ref([])
const toastModes = reactive(loadToastModes())

function loadToastModes() {
  try {
    const savedModes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

    return {
      ...defaultModes,
      ...Object.fromEntries(
        Object.entries(savedModes).filter(([type, mode]) => {
          return toastTypes.includes(type) && ['auto', 'manual'].includes(mode)
        })
      )
    }
  } catch (error) {
    return { ...defaultModes }
  }
}

function saveToastModes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toastModes))
}

export function useToast() {
  function showToast(message, type = 'success', options = {}) {
    const id = Date.now() + Math.random()
    const mode = toastModes[type] || 'auto'
    const duration = options.duration === undefined
      ? mode === 'manual'
        ? 0
        : 3000
      : Number(options.duration)

    messages.value.push({
      id,
      message,
      type
    })

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  function removeToast(id) {
    messages.value = messages.value.filter(item => item.id !== id)
  }

  function setToastMode(type, mode) {
    if (!toastTypes.includes(type) || !['auto', 'manual'].includes(mode)) {
      return
    }

    toastModes[type] = mode
    saveToastModes()
  }

  return {
    messages,
    toastModes,
    showToast,
    removeToast,
    setToastMode
  }
}

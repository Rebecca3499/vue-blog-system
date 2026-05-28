import { ref } from 'vue'

const messages = ref([])

export function useToast() {
  function showToast(message, type = 'success') {
    const id = Date.now() + Math.random()

    messages.value.push({
      id,
      message,
      type
    })

    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  function removeToast(id) {
    messages.value = messages.value.filter(item => item.id !== id)
  }

  return {
    messages,
    showToast,
    removeToast
  }
}
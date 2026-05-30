<template>
  <button
    v-show="visible"
    class="back-to-top"
    type="button"
    aria-label="Back to top"
    @click="scrollToTop"
  >
    &uarr;
  </button>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)

function updateVisible() {
  visible.value = window.scrollY > 360
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  updateVisible()
  window.addEventListener('scroll', updateVisible, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateVisible)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 26px;
  bottom: 28px;
  z-index: 40;
  width: 46px;
  height: 46px;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  background: var(--primary);
  color: #ffffff;
  box-shadow: var(--shadow-hover);
  font-size: 22px;
  line-height: 1;
}

.back-to-top:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

.back-to-top:focus-visible {
  outline: 3px solid var(--primary-soft);
  outline-offset: 3px;
}

@media (max-width: 700px) {
  .back-to-top {
    right: 18px;
    bottom: 18px;
    width: 42px;
    height: 42px;
  }
}
</style>

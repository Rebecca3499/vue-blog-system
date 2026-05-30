<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import ToastContainer from './components/toast/ToastContainer.vue'
import { useTheme } from './composables/useTheme'

useTheme()
</script>

import { computed, ref } from 'vue'

const STORAGE_KEY = 'shiqi-blog-theme'
const allowedThemes = ['light', 'dark']

function normalizeTheme(value) {
  return allowedThemes.includes(value) ? value : 'light'
}

function getStoredTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    return null
  }
}

function saveTheme(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch (error) {
    // localStorage can be unavailable in restricted browser contexts.
  }
}

function applyTheme(value) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('data-theme', value)
}

const theme = ref(normalizeTheme(getStoredTheme()))
applyTheme(theme.value)

const isDark = computed(() => theme.value === 'dark')

function setTheme(value) {
  const nextTheme = normalizeTheme(value)

  theme.value = nextTheme
  applyTheme(nextTheme)
  saveTheme(nextTheme)
}

function toggleTheme() {
  setTheme(isDark.value ? 'light' : 'dark')
}

export function useTheme() {
  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}

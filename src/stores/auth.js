import { defineStore } from 'pinia'
import { ref } from 'vue'

const TOKEN_KEY = 'blog_token'
const USER_KEY = 'blog_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const userInfo = ref(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  )

  const isLogin = ref(Boolean(token.value))

  function login(username, password) {
    if (username === 'admin' && password === '123456') {
      const mockToken = 'mock-token-' + Date.now()

      token.value = mockToken
      userInfo.value = {
        username: 'admin',
        nickname: '博客管理员'
      }
      isLogin.value = true

      localStorage.setItem(TOKEN_KEY, mockToken)
      localStorage.setItem(USER_KEY, JSON.stringify(userInfo.value))

      return true
    }

    return false
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    isLogin.value = false

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    token,
    userInfo,
    isLogin,
    login,
    logout
  }
})
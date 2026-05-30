<template>
  <div class="login-page">
    <div class="login-card">
      <h1>博客后台登录</h1>
      <p>请输入管理员账号进入后台管理系统</p>

      <form @submit.prevent="handleLogin">
        <div class="form-item">
          <label>用户名</label>
          <input
            v-model="form.username"
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-item">
          <label>密码</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
          />
        </div>

        <button type="submit" class="login-button">
          登录
        </button>
      </form>

      <div class="tip">
        测试账号：admin / 123456
      </div>

      <button class="home-button" @click="goHome">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from '../../components/toast/useToast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showToast } = useToast()

const form = reactive({
  username: '',
  password: ''
})

function handleLogin() {
  if (!form.username.trim()) {
    showToast('请输入用户名', 'warning')
    return
  }

  if (!form.password.trim()) {
    showToast('请输入密码', 'warning')
    return
  }

  const success = authStore.login(form.username, form.password)

  if (success) {
    showToast('登录成功', 'success')

    const redirect = route.query.redirect || '/admin'
    router.push(redirect)
  } else {
    showToast('用户名或密码错误', 'error')
  }
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-page);
  font-family: Arial, sans-serif;
}

.login-card {
  width: 380px;
  padding: 32px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.login-card h1 {
  margin: 0 0 8px;
  color: var(--text-primary);
}

.login-card p {
  margin: 0 0 24px;
  color: var(--text-secondary);
}

.form-item {
  margin-bottom: 18px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-weight: 600;
}

.form-item input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
}

.form-item input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-soft);
}

.login-button {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--primary);
  border-radius: var(--radius-md);
  background: var(--primary);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}

.login-button:hover {
  border-color: var(--primary-hover);
  background: var(--primary-hover);
}

.tip {
  margin-top: 16px;
  padding: 10px;
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
  color: var(--text-secondary);
  font-size: 14px;
  text-align: center;
}

.home-button {
  width: 100%;
  margin-top: 12px;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
  color: var(--text-primary);
  cursor: pointer;
}

.home-button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

@media (max-width: 520px) {
  .login-page {
    padding: 18px;
    box-sizing: border-box;
  }

  .login-card {
    width: 100%;
    padding: 24px;
  }
}
</style>

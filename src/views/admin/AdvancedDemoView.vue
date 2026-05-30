<template>
  <div class="advanced-demo-page">
    <section class="page-heading">
      <span class="kicker">Vue Advanced</span>
      <h1>高级特性演示</h1>
      <p>展示本项目中 Teleport、Suspense、异步组件和骨架屏的使用方式。</p>
    </section>

    <section class="demo-card">
      <div class="demo-head">
        <div>
          <span class="demo-label">题目14 · Teleport</span>
          <h2>Teleport 全局 Toast 通知</h2>
        </div>
        <p>
          Toast 组件通过 Teleport 挂载到 body，用于在登录、保存、删除、主题切换等操作中显示全局反馈。
        </p>
      </div>

      <div class="toast-setting-card">
        <div class="setting-head">
          <strong>Toast 通知设置</strong>
          <span>为不同类型提示选择关闭方式</span>
        </div>

        <div
          v-for="item in toastOptions"
          :key="item.type"
          class="setting-row"
        >
          <div class="setting-name">
            <span class="toast-dot" :class="`toast-dot--${item.type}`"></span>
            <strong>{{ item.label }}</strong>
          </div>

          <div class="mode-switch" aria-label="Toast 关闭方式">
            <button
              type="button"
              :class="{ active: toastModes[item.type] === 'auto' }"
              @click="setToastMode(item.type, 'auto')"
            >
              自动消失
            </button>
            <button
              type="button"
              :class="{ active: toastModes[item.type] === 'manual' }"
              @click="setToastMode(item.type, 'manual')"
            >
              手动关闭
            </button>
          </div>
        </div>
      </div>

      <div class="button-grid">
        <button class="primary-button" type="button" @click="triggerToast('success')">
          成功 Toast
        </button>
        <button class="danger-button" type="button" @click="triggerToast('error')">
          错误 Toast
        </button>
        <button class="warning-button" type="button" @click="triggerToast('warning')">
          警告 Toast
        </button>
        <button class="info-button" type="button" @click="triggerToast('info')">
          信息 Toast
        </button>
        <button class="secondary-button" type="button" @click="triggerToastQueue">
          连续触发多条 Toast
        </button>
      </div>

      <div class="code-note">
        <strong>实现位置</strong>
        <span>src/components/toast/ToastContainer.vue 使用 &lt;Teleport to="body"&gt;，useToast.js 负责全局消息队列。</span>
      </div>
    </section>

    <section class="demo-card">
      <div class="demo-head">
        <div>
          <span class="demo-label">题目14 · Suspense</span>
          <h2>Suspense 异步组件加载</h2>
        </div>
        <p>
          通过 Suspense 包裹异步组件，在数据加载过程中展示骨架屏 fallback，加载完成后展示异步内容。
        </p>
      </div>

      <div class="demo-actions">
        <button class="primary-button" type="button" @click="reloadAsyncPanel">
          重新加载
        </button>
        <span>点击后会重新挂载异步组件，方便观察骨架屏 fallback。</span>
      </div>

      <Suspense :key="reloadKey">
        <AsyncFeaturePanel :articles="articleStore.articles" />

        <template #fallback>
          <div class="advanced-skeleton" aria-label="异步内容加载中">
            <div class="skeleton-grid">
              <div v-for="item in 3" :key="item" class="skeleton-box">
                <span></span>
                <strong></strong>
                <p></p>
              </div>
            </div>
            <div class="skeleton-wide">
              <span></span>
              <p></p>
              <p class="short"></p>
              <p></p>
            </div>
          </div>
        </template>
      </Suspense>
    </section>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { useArticleStore } from '../../stores/article'
import { useToast } from '../../components/toast/useToast'

const articleStore = useArticleStore()
const { toastModes, showToast, setToastMode } = useToast()
const reloadKey = ref(0)

const toastOptions = [
  {
    type: 'success',
    label: '成功提示',
    description: '用于保存、发布、登录成功等正向反馈。',
    message: '操作成功：文章已保存'
  },
  {
    type: 'error',
    label: '错误提示',
    description: '用于登录失败、读取失败等错误反馈。',
    message: '操作失败：请稍后重试'
  },
  {
    type: 'warning',
    label: '警告提示',
    description: '用于表单未填写、图片过大等提醒。',
    message: '请先完善必填信息'
  },
  {
    type: 'info',
    label: '信息提示',
    description: '用于主题切换、状态说明等普通信息。',
    message: '主题设置已同步到 localStorage'
  }
]

const AsyncFeaturePanel = defineAsyncComponent(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(import('../../components/admin/AsyncFeaturePanel.vue'))
    }, 300)
  })
})

function triggerToast(type) {
  const option = toastOptions.find(item => item.type === type)

  if (!option) {
    return
  }

  showToast(option.message, type)
}

function triggerToastQueue() {
  triggerToast('success')
  triggerToast('info')
  triggerToast('warning')
}

function reloadAsyncPanel() {
  reloadKey.value += 1
}
</script>

<style scoped>
.advanced-demo-page {
  display: grid;
  gap: 20px;
  max-width: 1180px;
}

.page-heading {
  display: grid;
  gap: 8px;
}

.kicker,
.demo-label {
  color: var(--primary);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.page-heading h1,
.demo-head h2 {
  margin: 0;
  color: var(--text-primary);
}

.page-heading h1 {
  font-size: 30px;
  line-height: 1.2;
}

.page-heading p,
.demo-head p,
.demo-actions span,
.code-note span {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.demo-card {
  display: grid;
  gap: 18px;
  padding: 22px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.demo-head {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(260px, 1fr);
  gap: 18px;
  align-items: start;
}

.demo-head h2 {
  margin-top: 6px;
  font-size: 22px;
}

.toast-setting-card {
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
}

.setting-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 4px;
}

.setting-head strong {
  color: var(--text-primary);
  font-size: 15px;
}

.setting-head span {
  color: var(--text-secondary);
  font-size: 13px;
}

.setting-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 12px;
  align-items: center;
  padding: 11px 0;
  border-top: 1px solid var(--border-color);
}

.setting-name {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.toast-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--info);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--info) 16%, transparent);
}

.toast-dot--success {
  background: var(--success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--success) 16%, transparent);
}

.toast-dot--error {
  background: var(--danger);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--danger) 16%, transparent);
}

.toast-dot--warning {
  background: var(--warning);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--warning) 18%, transparent);
}

.setting-name strong {
  color: var(--text-primary);
  font-size: 15px;
}

.secondary-button,
.primary-button,
.danger-button,
.warning-button,
.info-button {
  min-height: 38px;
  padding: 8px 13px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: #ffffff;
  font-weight: 700;
}

.mode-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card);
}

.mode-switch button {
  min-height: 30px;
  padding: 5px 8px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
}

.mode-switch button:hover,
.mode-switch button.active {
  border-color: var(--primary);
  background: var(--primary);
  color: #ffffff;
}

.button-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary-button {
  border: 1px solid var(--primary);
  background: var(--primary);
  color: #ffffff;
}

.primary-button:hover {
  border-color: var(--primary-hover);
  background: var(--primary-hover);
}

.secondary-button {
  border: 1px solid var(--border-color);
  background: var(--bg-card-soft);
  color: var(--text-secondary);
}

.secondary-button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.danger-button {
  background: var(--danger);
}

.warning-button {
  background: var(--warning);
}

.info-button {
  background: var(--info);
}

.code-note {
  display: grid;
  gap: 4px;
  padding: 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
}

.code-note strong {
  color: var(--text-primary);
}

.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.advanced-skeleton {
  display: grid;
  gap: 16px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.skeleton-box,
.skeleton-wide {
  padding: 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
}

.skeleton-box span,
.skeleton-box strong,
.skeleton-box p,
.skeleton-wide span,
.skeleton-wide p {
  display: block;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--bg-card),
    color-mix(in srgb, var(--primary-soft) 62%, var(--bg-card-soft)),
    var(--bg-card)
  );
  background-size: 200% 100%;
  animation: skeletonLoading 1.3s infinite;
}

.skeleton-box span {
  width: 58%;
  height: 14px;
  margin-bottom: 18px;
}

.skeleton-box strong {
  width: 36%;
  height: 28px;
  margin-bottom: 10px;
}

.skeleton-box p,
.skeleton-wide p {
  width: 82%;
  height: 13px;
}

.skeleton-wide span {
  width: 180px;
  height: 18px;
  margin-bottom: 18px;
}

.skeleton-wide p {
  width: 100%;
  margin-bottom: 12px;
}

.skeleton-wide p.short {
  width: 68%;
}

@keyframes skeletonLoading {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

@media (max-width: 900px) {
  .demo-head,
  .skeleton-grid,
  .setting-row {
    grid-template-columns: 1fr;
  }

  .mode-switch {
    max-width: 320px;
  }
}

@media (max-width: 560px) {
  .demo-card {
    padding: 18px;
  }

  .setting-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .button-grid button,
  .demo-actions button,
  .mode-switch {
    width: 100%;
    max-width: none;
  }
}
</style>

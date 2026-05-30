<template>
  <div class="article-edit-page">
    <template v-if="!isEdit || article">
      <section class="page-heading">
        <div>
          <span class="kicker">Markdown Post</span>
          <h1>{{ isEdit ? '编辑文章' : '发布文章' }}</h1>
          <p>
            {{ isEdit ? '修改文章内容、分类和发布信息' : '编写并发布新的 Markdown 博客文章' }}
          </p>
        </div>
      </section>

      <form class="edit-form" @submit.prevent="handleSubmit">
        <section class="form-card">
          <div class="form-grid">
            <label class="form-item form-item--wide">
              <span>标题</span>
              <input v-model="form.title" placeholder="请输入文章标题" />
            </label>

            <label class="form-item">
              <span>分类</span>
              <input
                v-model="form.category"
                list="category-options"
                placeholder="例如：前端 / Vue / 课程"
              />
              <datalist id="category-options">
                <option
                  v-for="category in categoryOptions"
                  :key="category"
                  :value="category"
                />
              </datalist>
            </label>

            <label class="form-item form-item--wide">
              <span>摘要</span>
              <textarea
                v-model="form.summary"
                rows="3"
                placeholder="请输入文章摘要，便于前台文章卡片展示"
              ></textarea>
            </label>

            <div class="cover-field form-item form-item--wide">
              <div class="cover-field__title">
                <span>封面图</span>
                <p>支持填写图片地址，也可以选择 2MB 以内的本地图片。</p>
              </div>

              <div class="cover-input-row">
                <input
                  v-model="form.cover"
                  placeholder="支持 /covers/vue.jpg、https://... 或 base64 图片"
                />
                <button type="button" class="secondary-button" @click="triggerCoverPicker">
                  选择本地图片
                </button>
                <button
                  type="button"
                  class="ghost-button"
                  :disabled="!form.cover"
                  @click="removeCover"
                >
                  移除封面
                </button>
              </div>

              <input
                ref="coverInputRef"
                class="cover-file-input"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                @change="handleCoverFileChange"
              />

              <div class="cover-preview" :class="{ empty: !form.cover || coverPreviewBroken }">
                <img
                  v-if="form.cover && !coverPreviewBroken"
                  :src="form.cover"
                  alt="文章封面预览"
                  @error="coverPreviewBroken = true"
                />
                <div v-else class="cover-placeholder">
                  <strong>{{ form.cover ? '封面预览不可用' : '暂无封面' }}</strong>
                  <span>{{ form.cover ? '保存后前台仍会按地址尝试加载' : '未设置封面时，前台会显示渐变占位图' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="secondary-button" @click="goBack">
              取消
            </button>
            <button type="submit" class="primary-button">
              {{ isEdit ? '保存修改' : '发布文章' }}
            </button>
          </div>
        </section>

        <section class="editor-card">
          <div class="editor-card__head">
            <div>
              <h2>文章正文</h2>
              <p>默认使用普通文本输入；检测到 Markdown 语法后会自动切换到 Markdown 编辑。</p>
            </div>

            <div class="editor-mode-switch" aria-label="编辑模式">
              <button
                type="button"
                :class="{ active: editorMode === 'plain' }"
                @click="setEditorMode('plain')"
              >
                普通文本
              </button>
              <button
                type="button"
                :class="{ active: editorMode === 'markdown' }"
                @click="setEditorMode('markdown')"
              >
                Markdown
              </button>
            </div>
          </div>

          <p v-if="shouldSuggestMarkdown && editorMode === 'plain'" class="markdown-tip">
            检测到 Markdown 语法，建议切换到 Markdown 编辑模式。
          </p>

          <textarea
            v-if="editorMode === 'plain'"
            v-model="form.content"
            class="plain-editor"
            placeholder="请输入文章正文。支持普通文本，输入 Markdown 标题、列表、代码块等语法后会自动切换。"
          ></textarea>

          <MdEditor
            v-else
            v-model="form.content"
            language="zh-CN"
            preview-theme="github"
            code-theme="github"
            placeholder="请输入 Markdown 格式的文章正文"
            style="height: 560px"
          />
        </section>
      </form>
    </template>

    <section v-else class="not-found">
      <EmptyState
        title="文章不存在"
        description="没有找到需要编辑的文章，可能已经被删除或地址有误。"
      />
      <button class="secondary-button" type="button" @click="goBack">
        返回文章管理
      </button>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import EmptyState from '../../components/common/EmptyState.vue'
import { useArticleStore } from '../../stores/article'
import { useToast } from '../../components/toast/useToast'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const { showToast } = useToast()

const isEdit = computed(() => Boolean(route.params.id))

const article = computed(() => {
  if (!isEdit.value) {
    return null
  }

  return articleStore.getArticleById(route.params.id)
})

const categoryOptions = computed(() => {
  return [...new Set(articleStore.articles.map(item => item.category).filter(Boolean))]
})

const form = reactive({
  title: '',
  summary: '',
  category: '',
  cover: '',
  content: ''
})

const editorMode = ref('plain')
const manualEditorMode = ref(false)
const coverInputRef = ref(null)
const coverPreviewBroken = ref(false)
const maxCoverSize = 2 * 1024 * 1024
const allowedCoverTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

const shouldSuggestMarkdown = computed(() => {
  return detectMarkdown(form.content)
})

watch(
  article,
  value => {
    if (!isEdit.value) {
      resetForm()
      return
    }

    if (value) {
      form.title = value.title || ''
      form.summary = value.summary || ''
      form.category = value.category || ''
      form.cover = value.cover || value.image || value.thumbnail || ''
      form.content = value.content || ''
      editorMode.value = detectMarkdown(form.content) ? 'markdown' : 'plain'
      manualEditorMode.value = false
    }
  },
  {
    immediate: true
  }
)

watch(
  () => form.content,
  value => {
    if (!manualEditorMode.value && detectMarkdown(value)) {
      editorMode.value = 'markdown'
    }
  }
)

watch(
  () => form.cover,
  () => {
    coverPreviewBroken.value = false
  }
)

function resetForm() {
  form.title = ''
  form.summary = ''
  form.category = ''
  form.cover = ''
  form.content = ''
  editorMode.value = 'plain'
  manualEditorMode.value = false
}

function detectMarkdown(content) {
  return /(^|\n)#{1,6}\s/.test(content) ||
    /(^|\n)\s*[-*+]\s/.test(content) ||
    /(^|\n)\d+\.\s/.test(content) ||
    /```/.test(content) ||
    /\*\*.+\*\*/.test(content) ||
    /(^|\n)>\s/.test(content) ||
    /\[.+\]\(.+\)/.test(content)
}

function setEditorMode(mode) {
  editorMode.value = mode
  manualEditorMode.value = true
}

function triggerCoverPicker() {
  coverInputRef.value?.click()
}

function handleCoverFileChange(event) {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  if (!allowedCoverTypes.includes(file.type)) {
    showToast('图片类型不正确，请选择 PNG、JPG、WebP 或 GIF 图片', 'warning')
    resetCoverInput()
    return
  }

  if (file.size > maxCoverSize) {
    showToast('图片过大，请选择 2MB 以内的图片', 'warning')
    resetCoverInput()
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    if (typeof reader.result === 'string') {
      form.cover = reader.result
      coverPreviewBroken.value = false
      showToast('封面图已添加', 'success')
    } else {
      showToast('图片读取失败，请重新选择', 'error')
    }

    resetCoverInput()
  }

  reader.onerror = () => {
    showToast('图片读取失败，请重新选择', 'error')
    resetCoverInput()
  }

  reader.readAsDataURL(file)
}

function removeCover() {
  form.cover = ''
  coverPreviewBroken.value = false
  resetCoverInput()
}

function resetCoverInput() {
  if (coverInputRef.value) {
    coverInputRef.value.value = ''
  }
}

function handleSubmit() {
  const payload = {
    title: form.title.trim(),
    summary: form.summary.trim(),
    category: form.category.trim(),
    status: 'published',
    cover: form.cover.trim(),
    content: form.content.trim()
  }

  if (!payload.title) {
    showToast('请输入文章标题', 'warning')
    return
  }

  if (!payload.category) {
    showToast('请输入文章分类', 'warning')
    return
  }

  if (!payload.content) {
    showToast('请输入文章正文', 'warning')
    return
  }

  if (isEdit.value) {
    articleStore.updateArticle(route.params.id, payload)
    showToast('文章保存成功', 'success')
  } else {
    articleStore.addArticle(payload)
    showToast('文章发布成功', 'success')
  }

  router.push('/admin/articles')
}

function goBack() {
  router.push('/admin/articles')
}
</script>

<style scoped>
.article-edit-page {
  display: grid;
  gap: 20px;
  max-width: 1180px;
}

.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.page-heading h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: 30px;
  line-height: 1.2;
}

.page-heading p {
  margin: 8px 0 0;
  color: var(--text-secondary);
}

.edit-form {
  display: grid;
  gap: 20px;
}

.form-card,
.editor-card,
.not-found {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.form-card {
  padding: 22px;
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(180px, 0.7fr) minmax(150px, 0.5fr);
  gap: 16px;
}

.form-item {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.form-item--wide {
  grid-column: 1 / -1;
}

.form-item span {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}

.form-item input,
.form-item textarea,
.form-item select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
  color: var(--text-primary);
  font: inherit;
  outline: none;
}

.form-item input::placeholder,
.form-item textarea::placeholder {
  color: var(--text-muted);
}

.form-item textarea {
  resize: vertical;
}

.form-item input:focus,
.form-item textarea:focus,
.form-item select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-soft);
}

:global([data-theme="dark"]) .form-item input,
:global([data-theme="dark"]) .form-item textarea,
:global([data-theme="dark"]) .form-item select {
  background: #111827;
  color: #f8fafc;
}

:global([data-theme="dark"]) .form-item input::placeholder,
:global([data-theme="dark"]) .form-item textarea::placeholder {
  color: #94a3b8;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.primary-button,
.secondary-button,
.ghost-button {
  min-height: 40px;
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  font-weight: 700;
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

.ghost-button {
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
}

.ghost-button:hover:not(:disabled) {
  border-color: var(--border-color);
  background: var(--bg-card-soft);
  color: var(--primary);
}

.ghost-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.cover-field {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft);
}

.cover-field__title {
  display: grid;
  gap: 4px;
}

.cover-field__title p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.cover-input-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
}

.cover-file-input {
  display: none;
}

.cover-preview {
  position: relative;
  min-height: 168px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card);
}

.cover-preview img {
  display: block;
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.cover-preview.empty {
  display: grid;
  min-height: 168px;
  place-items: center;
  background:
    radial-gradient(circle at 20% 20%, var(--primary-soft), transparent 34%),
    linear-gradient(135deg, var(--bg-card), var(--bg-card-soft));
}

.cover-placeholder {
  display: grid;
  gap: 6px;
  padding: 22px;
  color: var(--text-secondary);
  text-align: center;
}

.cover-placeholder strong {
  color: var(--text-primary);
  font-size: 16px;
}

.cover-placeholder span {
  font-size: 13px;
}

:global([data-theme="dark"]) .cover-field,
:global([data-theme="dark"]) .cover-preview {
  background: #111827;
}

:global([data-theme="dark"]) .ghost-button:hover:not(:disabled) {
  background: #0b1f3a;
  color: #ffffff;
}

.editor-card {
  overflow: hidden;
}

.editor-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
}

.editor-card__head h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 20px;
}

.editor-card__head p {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.editor-mode-switch {
  display: inline-flex;
  flex: 0 0 auto;
  gap: 6px;
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card-soft);
}

.editor-mode-switch button {
  min-height: 32px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
}

.editor-mode-switch button:hover,
.editor-mode-switch button.active {
  border-color: var(--primary);
  background: var(--primary);
  color: #ffffff;
}

.markdown-tip {
  margin: 14px 20px 0;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--warning) 44%, var(--border-color));
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--warning) 12%, var(--bg-card));
  color: var(--text-secondary);
  font-size: 14px;
}

.plain-editor {
  display: block;
  width: 100%;
  height: 560px;
  min-height: 560px;
  margin: 0;
  padding: 20px;
  border: 0;
  border-radius: 0;
  background: var(--bg-card-soft);
  color: var(--text-primary);
  box-sizing: border-box;
  font: 15px/1.8 Arial, system-ui, sans-serif;
  resize: vertical;
  outline: none;
}

.plain-editor::placeholder {
  color: var(--text-muted);
}

.plain-editor:focus {
  box-shadow: inset 0 0 0 2px var(--primary);
}

.editor-card :deep(.md-editor) {
  border: 0;
}

:global([data-theme="dark"]) .editor-mode-switch,
:global([data-theme="dark"]) .plain-editor {
  background: #111827;
}

:global([data-theme="dark"]) .plain-editor {
  color: #f8fafc;
}

:global([data-theme="dark"]) .plain-editor::placeholder {
  color: #94a3b8;
}

:global([data-theme="dark"]) .editor-card :deep(.md-editor),
:global([data-theme="dark"]) .editor-card :deep(.md-editor-toolbar),
:global([data-theme="dark"]) .editor-card :deep(.md-editor-input-wrapper),
:global([data-theme="dark"]) .editor-card :deep(.md-editor-preview-wrapper) {
  background: #111827;
  color: #f8fafc;
}

:global([data-theme="dark"]) .editor-card :deep(.md-editor-toolbar) {
  border-color: var(--border-color);
}

:global([data-theme="dark"]) .editor-card :deep(.cm-content),
:global([data-theme="dark"]) .editor-card :deep(.cm-line),
:global([data-theme="dark"]) .editor-card :deep(textarea) {
  color: #f8fafc;
}

:global([data-theme="dark"]) .editor-card :deep(.cm-placeholder) {
  color: #94a3b8;
}

.not-found {
  max-width: 720px;
  padding: 28px;
  text-align: center;
}

.not-found .secondary-button {
  margin-top: 18px;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-item--wide {
    grid-column: auto;
  }

  .cover-input-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .article-edit-page {
    max-width: 100%;
  }

  .form-card {
    padding: 18px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .editor-card__head {
    align-items: flex-start;
    flex-direction: column;
  }

  .editor-mode-switch {
    width: 100%;
  }

  .editor-mode-switch button {
    flex: 1;
  }

  .primary-button,
  .secondary-button,
  .ghost-button {
    width: 100%;
  }
}
</style>

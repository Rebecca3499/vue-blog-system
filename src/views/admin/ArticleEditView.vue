<template>
  <div class="article-edit-page">
    <form v-if="!isEdit || article" class="form" @submit.prevent="handleSubmit">
      <div class="form-item">
        <label>文章标题</label>
        <input
          v-model="form.title"
          placeholder="请输入文章标题"
        />
      </div>

      <div class="form-item">
        <label>文章摘要</label>
        <textarea
          v-model="form.summary"
          rows="3"
          placeholder="请输入文章摘要"
        ></textarea>
      </div>

      <div class="form-item">
        <label>文章分类</label>
        <input
          v-model="form.category"
          placeholder="例如：前端 / 编程 / 课程"
        />
      </div>

      <div class="form-item">
  <div class="editor-header">
    <label>文章正文</label>

    <div class="editor-switch">
      <button
        type="button"
        :class="{ active: editorMode === 'plain' }"
        @click="editorMode = 'plain'"
      >
        普通编辑
      </button>

      <button
        type="button"
        :class="{ active: editorMode === 'markdown' }"
        @click="editorMode = 'markdown'"
      >
        Markdown 编辑
      </button>
    </div>
  </div>

  <p v-if="shouldSuggestMarkdown && editorMode === 'plain'" class="markdown-tip">
    检测到 Markdown 语法，建议切换到 Markdown 编辑模式。
  </p>

  <textarea
    v-if="editorMode === 'plain'"
    v-model="form.content"
    rows="10"
    placeholder="请输入文章正文内容。支持普通文本，也可以切换到 Markdown 编辑模式。"
  ></textarea>

  <MdEditor
    v-else
    v-model="form.content"
    language="zh-CN"
    preview-theme="github"
    code-theme="github"
    placeholder="请输入 Markdown 格式的文章正文"
    style="height: 420px"
  />
</div>

      <div class="actions">
        <button type="button" class="cancel-button" @click="goBack">
          取消
        </button>
        <button type="submit" class="save-button">
          {{ isEdit ? '保存修改' : '保存文章' }}
        </button>
      </div>
    </form>

    <div v-else class="not-found">
      <h2>文章不存在</h2>
      <p>没有找到需要编辑的文章。</p>
      <button class="cancel-button" @click="goBack">返回文章管理</button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useArticleStore } from '../../stores/article'
import { useToast } from '../../components/toast/useToast'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const { showToast } = useToast()

const isEdit = computed(() => {
  return Boolean(route.params.id)
})

const article = computed(() => {
  if (!isEdit.value) {
    return null
  }

  return articleStore.getArticleById(route.params.id)
})

const form = reactive({
  title: '',
  summary: '',
  category: '',
  content: ''
})

const editorMode = ref('plain')

const shouldSuggestMarkdown = computed(() => {
  const content = form.content

  return /(^|\n)#{1,6}\s/.test(content) ||
    /(^|\n)-\s/.test(content) ||
    /(^|\n)\d+\.\s/.test(content) ||
    /```/.test(content) ||
    /\*\*.+\*\*/.test(content) ||
    /(^|\n)>\s/.test(content) ||
    /\[.+\]\(.+\)/.test(content)
})

watchEffect(() => {
  if (article.value) {
    form.title = article.value.title
    form.summary = article.value.summary
    form.category = article.value.category
    form.content = article.value.content

    if (
      /(^|\n)#{1,6}\s/.test(article.value.content) ||
      /(^|\n)-\s/.test(article.value.content) ||
      /(^|\n)\d+\.\s/.test(article.value.content) ||
      /```/.test(article.value.content) ||
      /\*\*.+\*\*/.test(article.value.content) ||
      /(^|\n)>\s/.test(article.value.content) ||
      /\[.+\]\(.+\)/.test(article.value.content)
    ) {
      editorMode.value = 'markdown'
    }
  }
})

function handleSubmit() {
  if (!form.title.trim()) {
    showToast('请输入文章标题', 'warning')
    return
  }

  if (!form.summary.trim()) {
    showToast('请输入文章摘要', 'warning')
    return
  }

  if (!form.category.trim()) {
    showToast('请输入文章分类', 'warning')
    return
  }

  if (!form.content.trim()) {
    showToast('请输入文章正文', 'warning')
    return
  }

  if (isEdit.value) {
    articleStore.updateArticle(route.params.id, {
      title: form.title,
      summary: form.summary,
      category: form.category,
      content: form.content
    })

    showToast('文章修改成功', 'success')
  } else {
    articleStore.addArticle({
      title: form.title,
      summary: form.summary,
      category: form.category,
      content: form.content
    })

    showToast('文章保存成功', 'success')
  }

  router.push('/admin/articles')
}

function goBack() {
  router.push('/admin/articles')
}
</script>

<style scoped>
.article-edit-page {
  max-width: 1000px;
}

.form {
  padding: 28px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 600;
}

.form-item input,
.form-item textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 15px;
  font-family: Arial, sans-serif;
  outline: none;
  background: white;
}

.form-item input:focus,
.form-item textarea:focus {
  border-color: #2563eb;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button,
.save-button {
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-button {
  padding: 10px 16px;
  background: #e5e7eb;
  color: #374151;
}

.cancel-button:hover {
  background: #d1d5db;
}

.save-button {
  padding: 10px 16px;
  background: #2563eb;
  color: white;
}

.save-button:hover {
  background: #1d4ed8;
}

.not-found {
  padding: 40px;
  border-radius: 16px;
  background: white;
  text-align: center;
  color: #6b7280;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.editor-header label {
  margin-bottom: 0;
}

.editor-switch {
  display: flex;
  gap: 8px;
}

.editor-switch button {
  padding: 7px 12px;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: white;
  color: #374151;
  cursor: pointer;
}

.editor-switch button:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.editor-switch button.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.markdown-tip {
  margin: 0 0 10px;
  padding: 9px 12px;
  border-radius: 10px;
  background: #fffbeb;
  color: #92400e;
  font-size: 14px;
}

@media (max-width: 700px) {
  .article-edit-page {
    max-width: 100%;
  }

  .form {
    padding: 18px;
  }

  .editor-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .editor-switch {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .editor-switch button {
    width: 100%;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .save-button {
    width: 100%;
  }
}
</style>
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articles as mockArticles } from '../mock/articles'

const STORAGE_KEY = 'blog_articles'

function loadArticles() {
  const savedArticles = localStorage.getItem(STORAGE_KEY)

  if (savedArticles) {
    try {
      return JSON.parse(savedArticles)
    } catch (error) {
      console.error('文章数据解析失败：', error)
      return [...mockArticles]
    }
  }

  return [...mockArticles]
}

export const useArticleStore = defineStore('article', () => {
  const articles = ref(loadArticles())

  function saveArticles() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles.value))
  }

  function getArticleById(id) {
    return articles.value.find(item => item.id === Number(id))
  }

  function addArticle(article) {
    articles.value.unshift({
      ...article,
      id: Date.now(),
      author: article.author || 'admin',
      createdAt: new Date().toISOString().slice(0, 10),
      views: 0
    })

    saveArticles()
  }

  function updateArticle(id, article) {
    const index = articles.value.findIndex(item => item.id === Number(id))

    if (index !== -1) {
      articles.value[index] = {
        ...articles.value[index],
        ...article
      }

      saveArticles()
    }
  }

  function deleteArticle(id) {
    articles.value = articles.value.filter(item => item.id !== Number(id))

    saveArticles()
  }

  function resetArticles() {
    articles.value = [...mockArticles]
    saveArticles()
  }

  return {
    articles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    resetArticles
  }
})
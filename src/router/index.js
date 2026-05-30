import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/blog/HomeView.vue'
import ArticleDetailView from '../views/blog/ArticleDetailView.vue'
import ArticleManageView from '../views/admin/ArticleManageView.vue'
import ArticleEditView from '../views/admin/ArticleEditView.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import CategoryManageView from '../views/admin/CategoryManageView.vue'
import AdvancedDemoView from '../views/admin/AdvancedDemoView.vue'

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/article/:id',
    component: ArticleDetailView
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        component: DashboardView
      },
      {
        path: 'articles',
        component: ArticleManageView
      },
      {
        path: 'articles/new',
        component: ArticleEditView
      },
      {
        path: 'articles/edit/:id',
        component: ArticleEditView
      },
      {
        path: 'categories',
        component: CategoryManageView
      },
      {
        path: 'advanced',
        component: AdvancedDemoView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('blog_token')

  if (to.meta.requiresAuth && !token) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
})

export default router

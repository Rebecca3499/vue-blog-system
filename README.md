# Shiqi Blog

Shiqi Blog 是一个基于 Vue 3 + Vite 的个人技术博客前台与后台管理系统，用于记录前端学习、Vue 项目实践与课程作业成果。项目包含博客首页、文章详情、后台登录、文章发布编辑、分类管理、主题切换、Toast 通知、Suspense 异步加载和本地封面图选择等功能。

## 对应课程题目

- 题目14：Teleport 与 Suspense
- 题目15：博客前台 + 后台系统

## 技术栈

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- md-editor-v3
- localStorage
- Teleport
- Suspense
- CSS Variables
- FileReader
- 响应式布局

## 前台功能

- 首页 Banner 与个人技术博客风格布局
- 文章列表与文章卡片
- 文章详情页
- 分类筛选
- 关键词搜索
- 右侧文章目录索引
- 文章封面图与渐变占位封面
- 返回顶部按钮
- 浅色 / 深色模式切换
- 移动端响应式适配

## 后台功能

- 登录认证
- Vue Router 路由守卫
- Dashboard 数据概览
- 文章发布
- 文章编辑
- 文章删除
- 分类管理
- Markdown 编辑器
- 普通文本 / Markdown 输入模式切换
- 本地封面图选择，使用 FileReader 转为 base64 Data URL
- Toast 操作反馈
- 高级特性演示页

## 题目14实现说明

### Teleport Toast

项目中的 Toast 通知位于 `src/components/toast/ToastContainer.vue`，通过 `<Teleport to="body">` 挂载到页面 `body`，避免被局部组件层级、布局和 overflow 限制影响。

`src/components/toast/useToast.js` 提供全局消息队列，支持：

- 成功、错误、警告、信息四类提示
- 自动消失
- 手动关闭
- 多条 Toast 同时显示

Toast 被用于登录、保存文章、删除文章、图片选择校验、Dashboard 加载和高级特性演示等场景。

### Suspense + 异步组件

首页文章列表和后台高级特性演示页都使用了 Suspense 思路。

后台演示页位于：

- `src/views/admin/AdvancedDemoView.vue`
- `src/components/admin/AsyncFeaturePanel.vue`

页面通过 `defineAsyncComponent` 加载异步组件，并用 `<Suspense>` 包裹异步内容。在组件加载过程中，fallback 区域展示骨架屏；加载完成后展示异步文章统计、推荐文章、技术栈完成度和项目亮点。

### 骨架屏 fallback

骨架屏使用项目已有 CSS Variables 适配浅色 / 深色模式，避免只显示简单 loading 文本。首页文章区域也复用了 `src/components/skeleton/ArticleSkeleton.vue`。

## 题目15实现说明

### 前台博客系统

前台包含首页、文章列表、搜索、分类筛选、文章详情、文章目录、封面图、返回顶部和主题切换。文章详情路由为 `/article/:id`，文章不存在时会显示友好空状态。

### 后台管理系统

后台包含登录页、Dashboard、文章管理、发布文章、编辑文章、分类管理和高级特性演示页。后台布局使用左侧菜单 + 顶部深蓝导航栏，功能入口集中在侧边栏。

### Pinia 状态管理

文章数据由 `src/stores/article.js` 管理，支持获取文章、新增文章、更新文章、删除文章和浏览量递增。新增文章默认浏览、点赞、评论数为 0。

### Vue Router 路由

项目使用 Vue Router 管理前台和后台路由。后台路由带有 `requiresAuth` 元信息，未登录访问后台会跳转到 `/login`。

### Axios 请求封装和拦截器模拟

项目保留 `src/api/` 中的接口封装，用于模拟后台 Dashboard 数据加载等异步请求流程。

### Markdown 编辑器

文章发布 / 编辑页使用 md-editor-v3，支持 Markdown 编辑与预览。普通文本输入模式会在检测到 Markdown 语法后自动切换，也可以手动选择输入模式。

### localStorage 持久化

文章数据、登录状态和主题偏好通过 localStorage 保存。刷新页面后，文章、登录状态和浅色 / 深色主题选择仍能保留。

## 项目运行方式

```bash
npm install
npm run dev
npm run build
```

## 默认账号

```text
账号：Admin
密码：123456
```

## 项目亮点

- 个人技术博客风格
- 前后台一体
- 浅色 / 深色模式
- 本地封面图选择
- 文章目录索引
- 高级 Vue 特性演示
- 响应式布局
- Toast 全局反馈
- Suspense 骨架屏加载

## 技术难点总结

- 主题系统设计：使用 CSS Variables 管理浅色 / 深色模式，统一前台和后台视觉。
- Toast 全局通知：通过 Teleport 将通知挂载到 body，解决层级和布局限制问题。
- Suspense 骨架屏：异步组件加载时展示 fallback 骨架屏，提升加载体验。
- Markdown 编辑与预览：兼容普通文本输入和 Markdown 编辑模式。
- 本地图片 base64 处理：使用 FileReader 读取本地封面图，并限制文件类型和大小。
- 响应式两栏布局：文章详情页在桌面端显示正文 + 目录，移动端自动改为单列。
- 前后台路由和权限控制：通过 Vue Router 和 localStorage 实现后台访问守卫。

## 后续可优化方向

- 接入真实后端
- 图片上传到服务器
- 评论系统
- 用户权限系统
- 单元测试
- 在线部署

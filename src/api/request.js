import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('blog_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log('请求发送：', config.url)

    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    console.log('响应成功：', response.config.url)

    return response.data
  },
  error => {
    console.error('响应错误：', error)

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('blog_token')
      localStorage.removeItem('blog_user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default request
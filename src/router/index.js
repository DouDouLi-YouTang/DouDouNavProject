import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/homeson',
    name: 'homeson',
    // 重定向
    redirect: 'homeson/website',
    component: () => import(/* webpackChunkName: "homeson" */ '../views/homeson.vue'),
    children: [
      {
        path: 'website',
        name: 'website',
        component: () => import(/* webpackChunkName: website"*/ '../views/WebsiteView.vue'),
      },
      {
        path: 'updatalog',
        name: 'updatalog',
        component: () => import(/* webpackChunkName: test"*/ '../views/updatalog.vue'),
      },
      {
        path: 'test',
        name: 'test',
        component: () => import(/* webpackChunkName: test"*/ '../views/test.vue'),
      },
    ]
  }
]

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ScanHistory from '../views/ScanHistory.vue'

import store from "../store"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/scan',
    name: 'ScanHistory',
    component: ScanHistory,
    meta: {
      requireAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next) => {
  const login = to.matched.some(item => item.name === "Login")
  const protectedRoute = to.matched.some(item => item.meta.requireAuth)
  const admin = to.matched.some(item => item.meta.requireAdmin)
  if(protectedRoute && !store.state.token) {
    next({name: 'Login'})
  }
  else if(login && store.state.token) {
    next({name: 'Home'})
  }
  else if(admin && store.state.rol !== "administrador") {
    next({name: 'Home'})
  } else {
    next()
  }

})

export default router

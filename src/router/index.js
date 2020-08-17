import Vue from 'vue'
import VueRouter from 'vue-router'
import Spinner from '@/components/Spinner';
import Register from '@/components/Register';
import Login from '@/components/Login';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Spinner',
    component: Spinner,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

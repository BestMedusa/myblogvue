import Vue from 'vue'
import Router from 'vue-router'
import LoginTest from '../components/LoginTest'
import Home from '../components/Home'
import Login from '../components/Login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
      path: '/Home',
      name:'Home',
      component: Home
    }
  ]
})

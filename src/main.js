// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'es6-promise/auto'
import promise from 'es6-promise'
//引用当前项目的全局css样式控制文件
import './css/global.css'
import Utils from './utils/index.js'
import './utils/filter.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueResource from 'vue-resource'
import store from './vuex/store.js'
import global_ from './components/Constant'
//引用文件
Vue.prototype.CONSTANT = global_; //挂载到Vue实例上面


Vue.use(VueResource);
Vue.http.options.emulateJSON = true;
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
};

Vue.prototype.$utils = Utils;
Vue.use(ElementUI);

Vue.config.productionTip = false;
window.bus = new Vue();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if(localStorage.getItem('token')){ //判断本地是否存在access_token
      next();
    }else {
      if(to.path === '/'){
        next();
      }else {
        next({
          path:'/'
        })
      }
    }
  }
  else {
    next();
  }
  /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
  if(to.fullPath == "/"){
    if(localStorage.getItem('token')){
      next({
        path:from.fullPath
      });
    }else {
      next();
    }
  }
});

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
import global_ from './components/Constant'//引用文件
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
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     //这里判断用户是否登录，验证本地存储是否有token
//     if (!localStorage.currentUser) { // 判断当前的token是否存在
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath }
//       })
//     } else {
//       next()
//     }
//   } else {
//     next() // 确保一定要调用 next()
//   }
// });
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

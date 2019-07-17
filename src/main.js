// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'es6-promise/auto'
import promise from 'es6-promise'
import global_ from './components/Constant'//引用文件
//引用当前项目的全局css样式控制文件
import './css/global.css'
Vue.prototype.CONSTANT = global_; //挂载到Vue实例上面
import Api from './api/index.js'
import Utils from './utils/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueResource from 'vue-resource'
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
};

Vue.prototype.$utils = Utils;
Vue.prototype.$api = Api;
Vue.use(ElementUI);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

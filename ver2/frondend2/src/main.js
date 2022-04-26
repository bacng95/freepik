import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import './assets/app.scss'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import './libs/axios'

import router from './router'
import store from './store/index'

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
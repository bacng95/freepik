import Vue from 'vue'
import axios from 'axios'
import store from '../store/index'
import Config from '../../config'

const axiosIns = axios.create({
	baseURL: Config.apiUrl,
	headers: {
		// 'x-pathname': window.location.pathname,
	}
})

axiosIns.interceptors.request.use(
	response => {
		store.commit('PAGE_LOADING', true)
		return response
	},
	error => Promise.reject(error),
)

axiosIns.interceptors.response.use(
	response => {
		store.commit('PAGE_LOADING', false)
		return response
	},
	error => {
		store.commit('PAGE_LOADING', false)
		return Promise.reject(error)
	},
)

Vue.prototype.$http = axiosIns

export default axiosIns
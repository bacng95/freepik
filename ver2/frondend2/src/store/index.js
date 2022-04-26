import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loading: false,
    },
    mutations: {
        PAGE_LOADING(state, payload) {
            state.loading = payload
        }
    }
})
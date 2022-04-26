import Vue from 'vue'
import Router from 'vue-router'
import Config from '../config'
Vue.use(Router)


const router = new Router({
    mode: 'history',
    base: Config.baseURL,
    scrollBehavior () {
      return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '/',
            redirect: '/freepik',
            component: () => import('./layouts/Main.vue'),
        },
        {
            path: '/freepik',
            name: 'freepik-home',
            component: () => import('./views/Home.vue'),
        },
        {
            path: '/freepik/item/:slug',
            name: 'freepik-item-detail',
            component: () => import('./views/Item.vue'),
        },
        // {
        //     path: '*',
        //     redirect: '/pages/error-404'
        // }
    ]
})

router.afterEach(() => {
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
      appLoading.style.display = 'none'
    }
})

router.beforeEach((to, from, next) => {
    return next()
})

export default router
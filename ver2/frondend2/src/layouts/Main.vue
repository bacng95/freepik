<template>
    <div class="container-main">
        <Header/>
        <main id="main">
            <router-view @changeRouteTitle="changeRouteTitle" />
        </main>
        <Footer/>
    </div>
</template>


<script>

import {
    // BContainer
} from 'bootstrap-vue'

import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default {
    data() {
        return {}
    },
    components: {
        // BContainer,
        Header,
        Footer
    },
    methods: {
        changeRouteTitle (title) {
            this.routeTitle = title
        }
    },
}

</script>


<style scoped>
#main {
    min-height: 1000px;
}
</style>
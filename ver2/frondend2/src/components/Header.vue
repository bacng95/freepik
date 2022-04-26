<template>
    <header>
        <Logo/>
        <HeaderNav/>
    </header>
</template>

<script>

import {
    // BContainer
} from 'bootstrap-vue'

import Logo from './Logo.vue'
import HeaderNav from './HeaderNav.vue'

export default {
    data() {
        return {}
    },
    components: {
        // BContainer,
        Logo,
        HeaderNav
    }
}

</script>

<style scoped>

header {
    background-color: #1d262d;
    padding-left: 15px;
    padding-right: 15px;
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

</style>

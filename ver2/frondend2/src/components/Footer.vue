<template>
    <footer>
        <b-container class="py-3">
            <div class="d-flex justify-content-between align-items-center">
                <Logo/>
                <a class="text-white" href="mailto:bac.nguyen.71271@gmail.com">bac.nguyen.71271@gmail.com</a>
            </div>
        </b-container>
    </footer>
</template>

<script>

import {
    BContainer
} from 'bootstrap-vue'

import Logo from './Logo.vue'

export default {
    data() {
        return {}
    },
    components: {
        BContainer,
        Logo,
    }
}

</script>

<style scoped>

footer {
    background-color: #1d262d;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

</style>

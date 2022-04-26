<template>
    <div id="logo">
        <span>
            <router-link to="/">KOLA</router-link>
        </span>
    </div>
</template>

<script>

export default {
    data () {
        return {}
    }
}
</script>


<style scoped>
#logo a {
    color: #fff;
    margin-right: 50px;
    text-decoration: none;
}

#logo span {
    font-weight: 600;
    font-size: 2rem;
}

</style>
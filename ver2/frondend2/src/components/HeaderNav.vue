<template>
    <nav>
        <ul>
            <li>
                <router-link to="/freepik">Freepik</router-link>
            </li>
            <li>
                <router-link to="/flaticon">Flaticon</router-link>
            </li>
            <li>
                <router-link to="/slidesgo">Slidesgo</router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {

}
</script>

<style>

nav {
    color: #fff;
}

nav ul {
    list-style: none;
    margin: 0;
    display: flex;
}

nav ul li:first-child a {
    border-left: 1px solid #39454a;
}

nav ul a {
    padding: 18px;
    display: block;
    color: #ed9919;
    font-weight: 500;
    border-right: 1px solid #39454a;
    letter-spacing: 2px;
    text-decoration: none;
}

nav ul a:hover {
    background-color: #17191a;
    color: #ed9919;
}

nav .router-link-active {
    background-color: #17191a;
}

</style>

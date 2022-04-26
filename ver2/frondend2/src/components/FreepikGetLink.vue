<template>
    <div class="" id="home-section-1">
        <b-container>
            <div class="layout-input-get-link text-center">
                <h2 class="mb-4">Vẫn là freepik nhưng ... nó lạ lắm !</h2>
                <div class="input-link text-start">
                    <p class="text-muted mb-1">Sao chép địa chỉ vào ô dưới để tải zề</p>
                    <b-input-group class="rounded-0">
                        <b-form-input v-model="linkGet" class="rounded-0" placeholder="https://www.freepik.com..." type="text"></b-form-input>
                        <b-input-group-append>
                            <b-button @click="linkGet = ''" variant="outline-secondary">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </b-button>
                        </b-input-group-append>
                        <b-input-group-append>
                            <b-button @click="GetLink" class="rounded-0" variant="primary">let's go</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
                <div class="get-list">
                    <ul>
                        <li v-for="(item, index) in itemsGet" :key="index">
                            <a :href="item.url">
                                <div class="get-item__image">
                                    <img :src="item.thumbnail" alt="">
                                </div>
                                <div class="get-item__title">
                                    <p>{{ item.title }}</p>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </b-container>
    </div>
</template>

<script>

import {
    BInputGroup,
    BInputGroupAppend
} from 'bootstrap-vue'

export default {
    data() {
        return {
            linkGet: '',
            itemsGet: [],
        }
    },
    components: {
        BInputGroup,
        BInputGroupAppend,
    },
    methods: {

        GetLink () {
            
            if (!this.linkGet) return;

            this.$http.get('/download', {
                params: {
                    link: this.linkGet
                }
            }).then(res => {
                if (res.data.code) {
                    this.itemsGet.unshift(res.data.data)
                }
            })
        },
    }
}
</script>

<style scoped>
#home-section-1 {
    background-color: aliceblue;
    min-height: 300px;
    display: flex;
    align-items: center;
}


#home-section-1 .input-link button {
    margin-left: -1px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    height: 100%;
}

#home-section-1 .input-link .input-group {
    height: 54px;
}

#home-section-1 .layout-input-get-link {
    padding-top: 60px;
    padding-bottom: 60px;
}


.get-list {
    margin-top: 20px;
    max-height: 250px;
    overflow-y: auto;
    overflow-x: hidden;
}

.get-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.get-list li {
    margin-bottom: 10px;
}

.get-list li a {
    display: flex;
    text-decoration: none;
    font-weight: 500;
    width: max-content;
}

.get-list .get-item__title {
    margin-left: 15px;
}

.get-list .get-item__image img {
    border-radius: 3px;
    overflow: hidden;
}

.get-list .get-item__image img {
    width: 100px;
}

</style>

<template>
<div id="item-page">
    <FreepikGetLink />
    <b-container>
        <div class="main-content detail">
            <header>
                <div class="detail__preview">
                    <div class="container-fluid">
                        <div class="social">
                            <b-button variant="secondary" class="">Đến trang gốc</b-button>
                        </div>
                        <div class="detail__gallery detail__gallery--vector alignc">
                            <div class="row">
                                <div>
                                    <div class="detail__gallery--content">
                                        <img class="thumb w-100" data-pin-no-hover="true" src="https://img.freepik.com/free-vector/ramadan-sale-web-header-banner-design-with-crescent-moon-islamic-pattern_107575-456.jpg" alt="Ramadan sale web header and banner design with crescent moon and islamic pattern Premium Vector">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <aside>
                <div>
                    <div class="detail__download detail__group">
                        <div class="container-fluid">
                            <b-button variant="warning" class="w-100 text-white button-download">
                                <svg viewBox="0 0 24 24" width="18" height="18" style="margin-right: 5px" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Download
                            </b-button>
                        </div>
                    </div>
                    <div class="detail__author detail__group">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-12">
                                    <a class="d-flex text-decoration-none border p-2" href="https://www.freepik.com/user13096636">
                                        <span class="avatar avatar--sm avatar--circle col--center">
                                            <img class="loaded" src="https://lh6.googleusercontent.com/-NAvXeM5-Rqg/AAAAAAAAAAI/AAAAAAAAAAc/sYtY05wHzTA/s96-c/photo.jpg" data-src="https://lh6.googleusercontent.com/-NAvXeM5-Rqg/AAAAAAAAAAI/AAAAAAAAAAc/sYtY05wHzTA/s96-c/photo.jpg" alt="" onerror="this.src = randomAvatar('user13096636')">
                                        </span>
                                        <div class="ms-2">
                                            <div class="author font-base">
                                                <span class="author__name medium">user13096636</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </b-container>
</div>
</template>

<script>

import {
    BContainer,
    BButton
} from 'bootstrap-vue'

import FreepikGetLink from '../components/FreepikGetLink.vue'

export default {
    components: {
        BContainer,
        FreepikGetLink,
        BButton
    },
}
</script>

<style scoped>

.main-content {
    min-height: 800px;
}

.detail {
    overflow: hidden;
    background-color: #fff;
    display: grid;
    grid-template-areas:
        'header aside'
        'footer footer';
    grid-template-columns: 1fr 360px;
}

.detail>header {
    grid-area: header;
    background-color: #f8fafb;
}

.detail__preview {
    position: relative;
    height: 100%;
    padding-top: 10px;
}

.detail__preview .social {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: 0 0 10px;
}

.detail__gallery {
    flex: 1;
    padding-bottom: 10px;
}

.detail__download-confirmation {
    -ms-display: flex;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-align-items: center;
    align-items: center;
    -ms-justify-content: center;
    justify-content: center;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 10px;
    transition: 150ms linear;
    background-color: rgba(8,25,43,0.8);
    pointer-events: none !important;
}

.detail__gallery--content {
    display: inline;
    position: relative;
    margin: 0 auto;
    overflow: hidden;
}

.detail__gallery .thumb {
    display: inline-block;
    width: 100%;
    height: auto;
    max-width: calc(100vh - 184px);
    object-fit: contain;
}


.detail aside {
    border-bottom: 1px solid #cfd9e0;
    border-color: #e3e9ed;
}

.detail>aside {
    grid-area: aside;
}

.detail .detail__aside--left {
    padding-top: 10px;
    padding-bottom: 10px;
}

.detail__group {
    position: relative;
    margin-bottom: 10px;
    padding-bottom: 10px;
}

.detail__download {
    padding-top: 10px;
}

.pd-bottom-lv2 {
    padding-bottom: 10px;
}


.premium-user #main .detail .download-premium {
    display: flex !important;
}

.button-download {
    background: #fca120;
    color: #fff;
    height: 44px;
}


.detail aside>div>*:last-child {
    margin: 0;
}


.avatar.avatar--sm {
    width: 44px;
    height: 44px;
    border-radius: 50px;
    overflow: hidden;
}

.avatar img {
    -webkit-align-self: center;
    -moz-align-self: center;
    align-self: center;
    -ms-flex-item-align: center;
    display: block;
    width: 100%;
}

</style>

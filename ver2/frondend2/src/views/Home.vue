<template>
    <div>
        <FreepikGetLink/>
        <div class="mb-4" id="home-section-2">
            <b-container>
                <div id="home-accordion">
                    <header>
                        <ul>
                            <li @click="tabSelect(index)" :class="{ 'selected': tabSelected == index}" v-for="(item, index) in listData" :key="index">{{ item.title }}</li>
                        </ul>
                    </header>
                    <div class="content">
                        <div class="list-view">
                            <div class="list-container">
                                <div class="list-content">
                                    <section>
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="show-case-list">
                                                    <figure class="showcase__item" v-for="item in displayList" :key="item.id">
                                                        <div class="showcase__content">
                                                            <router-link :to="{ name: 'freepik-item-detail', params: { slug: item.item_id }}" class="showcase__link">
                                                                <img class="landscape" :src="item.thumbnail" alt="" srcset="">
                                                                <figcaption>
                                                                    <p class="title">{{ item.title }}</p>
                                                                    <span class="avatar">
                                                                        <img class="avatar-img" :src="item.author_avatar" alt="freepik" loading="lazy">
                                                                    </span>
                                                                    <span class="name">{{ item.author_link.split('/')[3] }}</span>
                                                                </figcaption>
                                                            </router-link>
                                                            <span v-if="item.premium" class="premium">
                                                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14px" height="14px" viewBox="0 0 14 14" version="1.1"><defs/> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="superado-limite-de-descargas-usuario" transform="translate(-727.000000, -593.000000)"> <g id="Group-5" transform="translate(348.000000, 514.000000)"> <g id="corona" transform="translate(379.000000, 79.000000)"> <rect id="Rectangle-29" fill="#FA8C00" x="1.52564103" y="10.7692308" width="11.2179487" height="2.6025641"/> <polygon id="Path-3" fill="#FF8C00" points="1.37656906 8.70512821 7.01594359 0.0610440458 12.7573624 8.70512821"/> <polygon id="Path-4" fill="#EDA500" points="12.674398 10.103844 13.9868803 2.47032414 2.82248508 9.80217111"/> <polygon id="Path-5" fill="#FEC400" points="1.33463643 10.057817 0.0754954515 2.43268193 10.5032807 10.057817"/> </g> </g> </g> </g> </svg>
                                                            </span>
                                                        </div>
                                                    </figure>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="text-center w-100 mt-4">
                                                    <b-button class="" variant="primary">View more</b-button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </b-container>
        </div>
    </div>
</template>

<script>

import {
    BContainer,
} from 'bootstrap-vue'

import FreepikGetLink from '../components/FreepikGetLink.vue'

export default {
    components: {
        BContainer,
        FreepikGetLink
    },
    data() {
        return {
            displayList: [],
            listData: [
                {
                    page: 1,
                    type: 'new',
                    title: 'For you',
                    data: [],
                    load: false
                },
                {
                    page: 1,
                    type: 'vector',
                    title: 'Vectors',
                    data: [],
                    load: false
                },
                {
                    page: 1,
                    type: 'photo',
                    title: 'Photos',
                    data: [],
                    load: false
                },
                {
                    page: 1,
                    type: 'psd',
                    title: 'PSD',
                    data: [],
                    load: false
                },
            ],
            tabSelected: 0
        }
    },
    mounted() {
        window.addEventListener('resize', this.resizeItemImage)
        this.tabSelect(0)
    },
    destroyed() {
        window.removeEventListener('resize', this.resizeItemImage)
    },
    methods: {
        resizeItemImage () {
            let interval = setInterval(()=> {
                let items = document.querySelectorAll('#home-accordion .showcase__item .showcase__content .showcase__link img.landscape')
                for (let index = 0; index < items.length; index++) {
                    if (!items[index].complete || items[index].naturalWidth === 0) {
                        return;
                    }
                }

                this.calcShowcaseItem()
                clearInterval(interval)
                
            }, 50)
        },
        tabSelect(index) {
            if (!this.listData[index].load) {
                this.fetchData(this.listData[index].page, this.listData[index].type)
                .then((res) => {
                    this.listData[index].load = true
                    this.listData[index].data = res.data.data

                    this.displayList = this.listData[index].data
                })
            } else {
                this.displayList = this.listData[index].data
            }

            this.$nextTick(()=> {
                this.resizeItemImage()
            })
            this.tabSelected = index
        },
        fetchData(page, type) {
            return this.$http.get('/home/items', {
                params: {
                    type,
                    page
                }
            })
        },
        calcShowcaseItem () {
            let items = document.querySelectorAll('#home-accordion .showcase__item')
            const width = document.querySelector('#home-accordion').clientWidth

            // const min_height = 160;
            const max_height = 260;

            let itemOfRow = []
            let sizeOfImage = []

            if (items.length == 0) { return; }

            let indexOfItem = 0;

            do {
                // add element moi vao de xu ly
                const itemShift = items[indexOfItem]
                itemOfRow.push(itemShift)
                const imageElement = itemShift.querySelector('.showcase__link img.landscape')
                sizeOfImage.push({
                    width: imageElement.naturalWidth,
                    height: imageElement.naturalHeight,
                })


                let targetWidth = 0;
                for (let index = 0; index < sizeOfImage.length; index++) {
                    const element = itemOfRow[index];
                    const imageElement = element.querySelector('.showcase__link img.landscape')

                    sizeOfImage[index].height = max_height
                    const imageRatio = imageElement.naturalWidth / imageElement.naturalHeight
                    sizeOfImage[index].width = sizeOfImage[index].height * imageRatio
                    targetWidth += sizeOfImage[index].width
                }

                if (targetWidth >= width) {
                    const widthOffset = targetWidth - width
                    for (let index = 0; index < itemOfRow.length; index++) {

                        const element = itemOfRow[index];
                        const size = JSON.parse(JSON.stringify(sizeOfImage[index]));
                        const widthRatio = widthOffset / targetWidth
                        const imageWidthRatio = sizeOfImage[index].width * widthRatio
                        sizeOfImage[index].width = sizeOfImage[index].width - imageWidthRatio
                        const imageRatio = size.height / size.width
                        sizeOfImage[index].height = imageRatio * sizeOfImage[index].width

                        element.style.width = (sizeOfImage[index].width - 10) + 'px'
                        element.style.height = (sizeOfImage[index].height - 5) + 'px'
                        element.style.display = 'block';

                    }
                    itemOfRow = []
                    sizeOfImage = []
                }

                indexOfItem++;

            } while (indexOfItem < items.length);
        }
    }
}
</script>


<style scoped>

#home-section-2 {
    min-height: 700px;
}

#home-section-2 #home-accordion header {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

#home-section-2 #home-accordion .show-case-list {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    position: relative;
}

#home-section-2 #home-accordion .showcase__item {
    position: relative;
    box-sizing: border-box;
    margin: 0 5px 10px 5px;
    padding: 0;
    display: none;
}

#home-section-2 #home-accordion .showcase__content {
    position: relative;
    display: block;
    border-radius: 3px;
    box-sizing: border-box;
    height: 100%;
    padding-bottom: 0 !important;
}

#home-section-2 #home-accordion .showcase__link {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 3px;
    z-index: 1;
}

.showcase__content figcaption {
    -ms-display: flex;
    display: flex;
    -ms-align-items: center;
    align-items: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    opacity: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    padding: 10px;
    color: #fff;
}

.showcase__content .title {
    overflow: hidden;
    display: block;
    width: 100%;
    margin: 0;
    text-overflow: ellipsis;
    text-align: left;
    white-space: nowrap;
}

.showcase__content figcaption>* {
    position: relative;
    z-index: 2;
}

.showcase__item:hover figcaption, .showcase__fake:hover figcaption {
    opacity: 1;
}

.showcase__content .avatar {
    overflow: hidden;
    width: 24px;
    height: 24px;
    margin: 0 5px 0 0;
    border-radius: 50%;
}

.showcase__content figcaption>* {
    position: relative;
    z-index: 2;
}

.showcase__content .name {
    max-width: 200px;
    margin-right: auto;
    font-size: 13px;
}

.showcase__content img {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    display: block;
    width: 100%;
    height: auto;
    transform: translate(-50%, -50%);
}

.showcase__content figcaption::after {
    background: -webkit-linear-gradient(rgba(8,25,43,0), rgba(8,25,43,0.85)) top;
    background: linear-gradient(rgba(8,25,43,0), rgba(8,25,43,0.85)) top;
    height: 124px;
    bottom: 0;
    position: absolute;
    left: 0;
    width: 100%;
    content: '';
}

#home-section-2 #home-accordion img {
    width: 100%;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    display: block;
    transform: translate(-50%, -50%);
}

#home-section-2 #home-accordion header ul {
    list-style: none;
    display: flex;
    margin: 0;
    margin-top: 10px;
    padding: 0;
}


#home-section-2 #home-accordion header ul li {
    cursor: pointer;
    padding: 15px;
    font-weight: 500;
    color: #666;
}

#home-section-2 #home-accordion header ul li.selected {
    color: #000;
    border-bottom: 2px solid #000;
}

span.premium {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    padding: 3px 5px;
    border-radius: 3px;
    background-color: rgba(8,25,43,0.65);
    cursor: pointer;
    font-size: 0.8rem;
    color: #ffa600;
    font-weight: 600;
}

</style>
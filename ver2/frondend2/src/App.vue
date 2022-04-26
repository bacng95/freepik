<template>
    <div id="app" :class="vueAppClasses">
        <div class="loading-screen" :class="{show : appLoading}">
            <svg class="spinner">
            <circle cx="20" cy="20" r="18"></circle>
            </svg>
        </div>
		<component :is="layout">
			<router-view />
		</component>
    </div>
</template>


<script>

const MainLayout = () => import('./layouts/Main.vue')

export default {
	data() {
        return {
            vueAppClasses: [],
        };
    },
	components: {
		MainLayout
	},
	computed: {
		appLoading() {
            return this.$store.state.loading;
        },
		layout() {
			return 'main-layout'
		}
    },
}
</script>

<style>

* {
	font-family: 'Plus Jakarta Sans', sans-serif;
	/* word-spacing: 2px; */
}

a {
	color: inherit;
	text-decoration: none;
}


input:focus, button:focus {
	outline: none;
	box-shadow: none !important;
}

.loading-screen {
  display: none;
  width: 100%;
  height: 100vh;
  background-color: #0000004d;
  position: fixed;
  z-index: 99999999;
}

.loading-screen.show {
  display: block !important;
}

svg.spinner {
  width: 40px;
  height: 40px;
  x: 0px;
  y: 0px;
  viewbox: 0 0 40 40;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
svg.spinner circle {
  fill: transparent;
  stroke: #d0d0d0;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 125.6;
  -webkit-transform-origin: 20px 20px 0;
  -moz-transform-origin: 20px 20px 0;
  -ms-transform-origin: 20px 20px 0;
  -o-transform-origin: 20px 20px 0;
  transform-origin: 20px 20px 0;
  -webkit-animation: spinner 2s linear infinite;
  -moz-animation: spinner 2s linear infinite;
  -ms-animation: spinner 2s linear infinite;
  -o-animation: spinner 2s linear infinite;
  animation: spinner 2s linear infinite;
}
@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    stroke-dashoffset: 26.4;
  }
  50% {
    -webkit-transform: rotate(720deg);
    stroke-dashoffset: 125.6;
  }
  100% {
    -webkit-transform: rotate(1080deg);
    stroke-dashoffset: 26.4;
  }
}
@-moz-keyframes spinner {
  0% {
    -moz-transform: rotate(0deg);
    stroke-dashoffset: 26.4;
  }
  50% {
    -moz-transform: rotate(720deg);
    stroke-dashoffset: 125.6;
  }
  100% {
    -moz-transform: rotate(1080deg);
    stroke-dashoffset: 26.4;
  }
}
@-ms-keyframes spinner {
  0% {
    -ms-transform: rotate(0deg);
    stroke-dashoffset: 26.4;
  }
  50% {
    -ms-transform: rotate(720deg);
    stroke-dashoffset: 125.6;
  }
  100% {
    -ms-transform: rotate(1080deg);
    stroke-dashoffset: 26.4;
  }
}
@-o-keyframes spinner {
  0% {
    -o-transform: rotate(0deg);
    stroke-dashoffset: 26.4;
  }
  50% {
    -o-transform: rotate(720deg);
    stroke-dashoffset: 125.6;
  }
  100% {
    -o-transform: rotate(1080deg);
    stroke-dashoffset: 26.4;
  }
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: 26.4;
  }
  50% {
    transform: rotate(720deg);
    stroke-dashoffset: 125.6;
  }
  100% {
    transform: rotate(1080deg);
    stroke-dashoffset: 26.4;
  }
}


</style>
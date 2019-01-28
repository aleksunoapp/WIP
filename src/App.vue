<template>
  <div id="dmpi">
    <service />
    <reason />
    <drawer />
    <error-overlay />
    <help-overlay />

    <app-header />
    <transition name="fade" mode="out-in">
      <router-view ref="route" tabindex="-1"/>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import Drawer from '@/components/Drawer.vue'
import Service from '@/components/Service.vue'
import Reason from '@/components/Reason.vue'
import HelpOverlay from '@/components/HelpOverlay.vue'
import ErrorOverlay from '@/components/ErrorOverlay.vue'
import {mapMutations} from 'vuex'

export const App = Vue.extend({
  components: {
    AppHeader,
    Drawer,
    Service,
    Reason,
    HelpOverlay,
    ErrorOverlay
  },
  mounted () {
    this.setFocusable({name: 'route', node: this.$refs.route.$el})
  },
  errorCaptured (err, vm, info = '') {
    this.setError(err, info)
  },
  methods: {
    ...mapMutations([
      'setFocusable'
    ]),
    setError (e, i) {
      // eslint-disable-next-line
      console.log({ e }, { i })
    }
  }
})

export default App
</script>

<style lang="scss">
@font-face {
  font-family: 'Futura Book';
  src: url('./assets/fonts/futura_book_regular-webfont.woff2') format('woff2'),
        url('./assets/fonts/futura_book_regular-webfont.woff') format('woff');
}
@font-face {
  font-family: 'Futura Heavy';
  src: url('./assets/fonts/futura_heavy_regular-webfont.woff2') format('woff2'),
        url('./assets/fonts/futura_heavy_regular-webfont.woff') format('woff');
}

* {
  box-sizing: border-box;
  outline: none;
  overflow-wrap: break-word;

  font-family: 'Futura Book';
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
}
*:focus {
  outline: 1px solid #3d56f5;
}
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  font-size: 10px;
}
#dmpi {
  height: 100%;
  overflow: hidden;
  position: relative;

  font-size: 1.5rem;

  --green: #2eaf4d;
  --green-pastel: #71C986;
  --blue: #3d56f5;
  --blue-light: #d1d7fa;
  --black: #474b66;
  --white: #ffffff;
  --red: #d0021b;
  --yellow: #f8e71c;
  --grey-input-border: #c3c3c3;
  --grey-text: #989898;
  --grey-pagination: #d6d6da;
  --grey-light-background: #f7f7fa;
  --grey-medium-background: #DBDBDB;
  --grey-dark-background: #4a4a4a;
  --grey-transparent: rgba(0,0,0,0.75);
  --shadow: 0px 3px 8px 0px rgba(42,55,71,0.15);
  --shadow-light: 0 0 20px 0 rgba(24,31,77,0.05);
  --text: #181F4D;
  --header-height: 6rem;
  --unit: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all .1s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(-1000px);
}

.button {
  width: 100%;
  margin: 1rem 0;
  padding: 0;
  text-transform: uppercase;
  text-align: center;
  border: none;
}
.button:disabled {
  opacity: 0.75;
}
.button.cta {
  font-family: 'Futura Heavy';
  height: 5rem;
  line-height: 2rem;
  font-size: 1.8rem;
  font-weight: 400;
  box-shadow: var(--shadow);
  background-color: var(--blue);
  color: var(--white);
  border-radius: 3px;
}
.button.cta.green {
  background-color: var(--green);
}
.button.skip {
  height: 2.5rem;
  background-color: rgba(0, 0, 0, 0);
  color: var(--black);
}

.label ~ .input[type="text"] {
  width: 100%;
  margin: 1rem 0;
  text-transform: uppercase;
  text-align: left;
}

.input[type="text"] {
  width: 100%;
  height: 50px;
  padding: 0 1rem;
  border: 1px solid var(--grey-input-border);
  border-radius: 3px;
  font-size: 1.8rem;
}

.bold {
  font-weight: bold;
}
</style>

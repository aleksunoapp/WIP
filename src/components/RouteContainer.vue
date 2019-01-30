<template>
  <div
    class="container"
    id="route"
    ref="route"
    tabindex="-1"
  >
    <help-overlay />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import HelpOverlay from '@/components/HelpOverlay.vue'

export default {
  name: 'RouteContainer',
  components: {
    HelpOverlay
  },
}
</script>


<style lang="scss" scoped>
.container {
  position: relative;
  height: calc(100% - var(--header-height));
  overflow: auto;
  outline: none;
}
</style>


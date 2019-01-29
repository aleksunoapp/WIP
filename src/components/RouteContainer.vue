<template>
  <div
    class="container"
    id="route"
    ref="route"
    tabindex="-1"
  >
    <service />
    <reason />
    <help-overlay />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import Reason from '@/components/Reason.vue'
import Service from '@/components/Service.vue'
import HelpOverlay from '@/components/HelpOverlay.vue'

export default {
  name: 'RouteContainer',
  components: {
    Service,
    Reason,
    HelpOverlay
  },
}
</script>


<style lang="scss" scoped>
.container {
  height: calc(100% - var(--header-height));
  overflow: auto;
  outline: none;
}
</style>


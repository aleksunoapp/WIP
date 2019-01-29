<template>
  <div
    class="container"
    id="focusable-route-container"
    ref="route"
    tabindex="-1"
  >
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: 'RouteContainer',
}
</script>


<style lang="scss" scoped>
.container {
  height: calc(100% - var(--header-height));
  overflow: auto;
}
</style>


<template>
  <div
    id="route"
    ref="route"
    class="container"
    tabindex="-1"
  >
    <help-overlay />
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
import HelpOverlay from '@/components/HelpOverlay.vue'

export default {
  name: 'RouteContainer',
  components: {
    HelpOverlay
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: calc(100% - var(--header-height));
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  outline: none;
}
</style>

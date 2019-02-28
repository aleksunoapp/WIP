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
      <keep-alive include="Summary">
        <router-view />
      </keep-alive>
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
.container.overflow-y-hidden {
  overflow-y: hidden;
}
</style>

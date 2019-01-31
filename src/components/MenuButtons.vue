<template>
  <div class="container">
    <button
      @click="toggleDrawer"
      class="menu__button"
      :class="{'open' : drawer}"
    >
      <div class="top"></div>
      <div class="middle"></div>
      <div class="bottom"></div>
    </button>
    <button
      @click="back()"
      class="back"
      value="back"
    >
      <img
        src="@/assets/images/chevron-right.svg"
        alt="chevron left"
        class="chevron"
      />
    </button>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapState([
      'drawer',
      'help',
      'reason',
      'modal'
    ])
  },
  methods: {
    toggleDrawer () {
      if (this.drawer) {
        this.closeDrawer()
        this.logEvent('Opened side menu')
      } else {
        this.openDrawer('Closed side menu')
      }
    },
    back () {
      if (
        this.$route.name === 'services' ||
        this.$route.name === 'additional-services' ||
        this.$route.name === 'wait-services' ||
        this.$route.name === 'summary'
      ) {
        if (this.help) {
          if (this.$route.name === 'summary') {
            this.router.go(-1)
          }
            this.closeHelp()
        } else if (this.reason) {
          this.selectService()
          this.closeReason()
        } else if (this.modal) {
          this.closeService()
        } else {
          this.$router.go(-1)
        }
      } else {
        this.$router.go(-1)
      }
    },
    ...mapMutations([
      'openDrawer',
      'closeDrawer',
      'logEvent',
      'closeService',
      'closeHelp',
      'selectService',
      'closeReason'
    ])
  }
})
</script>

<style scoped lang="scss">
.container {
  display: flex;
  .back {
    width: 4rem;
    height: 4rem;
    margin: 0 0 0 1px;
    border: none;
    padding: 1rem;
    background-color: var(--white);
    .chevron {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transform: rotate(180deg);
    }
  }
  .menu__button {
    position: relative;
    z-index: 4;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 4rem;
    height: 4rem;
    min-height: 4rem;
    min-width: 4rem;
    max-height: 4rem;
    max-width: 4rem;
    padding: 1rem;
    margin: 0;
    background-color: var(--white);
    border: none;
  }
  .top, .middle, .bottom {
    width: 3rem;
    height: 2px;
    min-width: 2rem;
    min-height: 2px;
    max-width: 2rem;
    max-height: 2px;
    border-radius: 500px;
    background-color: var(--blue);
    transition: background-color .2s ease-out;
  }
  &.open {
    .middle {
      background-color: transparent;
      transition: background-color .2s ease-in;
    }
    .top {
      max-width: 2.2rem;
      transform: rotate(45deg);
      transform-origin: -1px 4px;
      transition: transform .2s ease-in;
    }
    .bottom {
      max-width: 2.2rem;
      transform: rotate(-45deg);
      transform-origin: 0 -2px;
      transition: transform .2s ease-in;
    }
  }
}
</style>

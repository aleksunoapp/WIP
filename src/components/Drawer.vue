<template>
  <aside
    class="drawer__container"
    :class="{'open' : drawer}"
  >
    <transition name="fade">
      <div
        v-if="drawer"
        class="overlay"
        @click="closeDrawer"
      />
    </transition>
    <transition name="slide-fade">
      <div
        v-if="drawer"
        class="drawer"
      >
        <h1 class="header">
          {{ $t("information") }}
        </h1>
        <button
          ref="tutorial"
          class="item"
          @click="viewTutorial()"
        >
          <img
            src="@/assets/images/question-mark.svg"
            alt="question mark"
            class="icon"
          >
          <div class="text">
            {{ $t("how_it_works") }}
          </div>
        </button>
        <a
          class="item"
          :href="`tel:${dealer.phone}`"
          @click="logEvent('Clicked phone link');"
        >
          <img
            src="@/assets/images/phone.svg"
            alt="phone"
            class="icon"
          >
          <div class="text">
            {{ $t("call_service_advisor") }}
          </div>
        </a>
        <a
          class="item"
          :href="`sms:${dealer.smsPhone}`"
          @click="logEvent('Clicked text link');"
        >
          <img
            src="@/assets/images/message-bubble.svg"
            alt="message"
            class="icon"
          >
          <div class="text">
            {{ $t("text_service_advisor") }}
          </div>
        </a>
        <button
          class="item"
          @click="viewInspectionReport()"
        >
          <img
            src="@/assets/images/clipboard.svg"
            alt="clipboard"
            class="icon"
          >
          <div class="text">
            {{ $t("view_inspection_report") }}
          </div>
        </button>
      </div>
    </transition>
  </aside>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState([
      'drawer',
      'dealer',
      'inspectionReportUrl'
    ])
  },
  watch: {
    drawer (open) {
      if (open) {
        this.$nextTick(function () {
          this.$refs.tutorial.focus()
        })
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeDrawer',
      'logEvent'
    ]),
    viewInspectionReport () {
      window.open(this.inspectionReportUrl)
      this.logEvent('Clicked inspection link')
    },
    viewTutorial () {
      this.$router.push({ name: 'tutorial' })
      this.closeDrawer()
    }
  }
})
</script>

<style scoped lang="scss">
.drawer__container {
  position: absolute;
  z-index: 3;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  pointer-events: none;
}
.overlay {
  position: absolute;
  background-color: var(--grey-transparent);
  width: 100%;
  height: 100%;
  pointer-events: initial;
}
.drawer {
  position: absolute;
  display: inline-block;
  height: 100%;
  padding: 1rem 3rem 1rem 1rem;
  background-color: var(--white);
  pointer-events: initial;
}
.header {
  width: 100%;
  margin: 1rem 0;
  padding: 0 0 0 3rem;
  font-size: 1.5rem;
  font-weight: normal;
  text-align: center;
  text-transform: uppercase;
}
.item {
  display: flex;
  align-items: center;
  padding: 1em;
  border: none;
  background-color: var(--white);
  font-size: 1.5rem;
  color: var(--text);
  text-decoration: none;
}
.icon, .text {
  display: inline-block;
}
.icon {
  margin-right: 2rem;
  max-width: 2rem;
  max-height: 3rem;
}
</style>

<template>
  <aside
    class="reason__container"
    :class="{'open' : error}"
  >
    <transition name="fade">
      <div
        v-if="error"
        class="overlay"
        @click="clearError"
      >
        <transition name="fade">
          <div
            v-if="error"
            class="modal"
            @click.stop
          >
            <div class="header">
              <p class="text">
                {{ $t("error") }}
              </p>
              <button
                ref="error"
                class="close"
                @click="clearError"
                @keydown.enter="clearError"
              >
                <div class="top" />
                <div class="bottom" />
              </button>
            </div>
            <div class="body">
              <p class="text">
                {{ error }}
              </p>
              <template v-if="$route.name === 'login'">
                <button
                  class="button cta"
                  type="button"
                  value="try again"
                  @click="tryAgain()"
                >
                  {{ $t("try_again") }}
                </button>
                <a
                  v-if="dealer.phone"
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
                    {{ $t("call_us_at") }} {{ dealer.phone }}
                  </div>
                </a>
              </template>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </aside>
</template>

<script>
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'
import { focus } from '@/mixins.js'

export default Vue.extend({
  mixins: [focus],
  computed: {
    ...mapState([
      'error',
      'dealer'
    ])
  },
  watch: {
    error (open) {
      if (open) {
        this.$nextTick(function () {
          this.$refs.error.focus()
        })
      }
    }
  },
  methods: {
    tryAgain () {
      this.clearError()
      this.logEvent('Closed error popup')
      this.focus('input#login')
    },
    close () {
      this.clearError()
      this.logEvent('Closed error popup')
    },
    ...mapMutations([
      'clearError',
      'logEvent'
    ])
  }
})
</script>

<style scoped lang="scss">
.reason__container {
  position: absolute;
  bottom: 0;
  z-index: 6;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  pointer-events: none;
}
.overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  pointer-events: initial;
  background-color: var(--grey-transparent);
  .modal {
    max-width: 768px;
    margin: 0 2rem;
    background-color: var(--white);
    pointer-events: initial;
    .header {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 6rem;
      border-bottom: 1px solid var(--grey-medium-background);
      .close {
        position: absolute;
        top: 2rem;
        right: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 2rem;
        height: 2rem;
        min-height: 2rem;
        min-width: 2rem;
        max-height: 2rem;
        max-width: 2rem;
        padding: 0;
        margin: 0;
        background-color: var(--white);
        border: none;
        .top, .bottom {
          width: 3rem;
          height: 2px;
          min-width: 2rem;
          min-height: 2px;
          max-width: 2.2rem;
          max-height: 2px;
          border-radius: 500px;
          background-color: var(--blue);
        }
        .top {
          transform: rotate(45deg);
          transform-origin: -1px 4px;
        }
        .bottom {
          transform: rotate(-45deg);
          transform-origin: 0 -2px;
        }
      }
      .text {
        margin: 0 6rem 0 2rem;
        text-transform: uppercase;
      }
    }
    .body {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      .text {}
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1em;
        border: none;
        background-color: var(--white);
        font-size: 1.5rem;
        color: var(--text);
        text-decoration: none;
        .icon, .text {
          display: inline-block;
        }
        .icon {
          margin-right: 2rem;
          max-width: 2rem;
          max-height: 3rem;
        }
      }
    }
  }
}
</style>

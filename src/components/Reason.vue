<template>
  <aside
    id="reason"
    class="container"
    :class="{'open' : reason}"
    tabindex="-1"
  >
    <transition name="fade">
      <div
        v-if="reason"
        class="overlay"
      >
        <transition name="fade">
          <div
            v-if="reason"
            class="body"
            @click.stop
          >
            <div class="header">
              <p class="text">
                {{ $t("please_select_a_reason") }}
              </p>
            </div>
            <div class="reasons">
              <label
                v-for="reason in reasons"
                :key="reason.id"
                :ref="`label${reason.id}`"
                :for="`reason${reason.id}`"
                class="reason"
                tabindex="0"
                @click.stop="close()"
                @blur="loopFocus(reason.id)"
                @keydown.enter="click(reason)"
              >
                <input
                  :id="`reason${reason.id}`"
                  :ref="`input${reason.id}`"
                  v-model="selected"
                  :value="reason.id"
                  type="radio"
                  @click.stop
                >
                <div class="empty">
                  <div class="selected" />
                </div>
                {{ reason.name }}
              </label>
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
      'reason',
      'service',
      'reasons',
      'focusable',
      'modal'
    ]),
    selected: {
      get () { return this.service.declinedReasonId },
      set (reasonId) {
        this.setReason(reasonId)
        this.logEvent(`Selected reason ${reasonId}`)
      }
    }
  },
  watch: {
    reason (open) {
      if (open) {
        this.focus('#reason')
      } else {
        if (this.modal) {
          this.focus('#service')
        } else {
          this.focus(`#card${this.service.id}`)
        }
      }
    }
  },
  methods: {
    close () {
      if (
        (
          this.$route.name === 'additional-services' ||
          this.$route.name === 'wait-services'
        ) && this.modal
      ) {
        this.$emit('next')
        setTimeout(() => {
          this.closeReason()
        }, 300)
      } else {
        setTimeout(() => {
          this.closeReason()
          this.closeService()
        }, 300)
      }
    },
    click (reason) {
      this.$refs[`input${reason.id}`][0].click()
    },
    loopFocus (reasonId) {
      if (this.reasons[this.reasons.length - 1].id === reasonId) {
        this.$refs[`label${this.reasons[0].id}`][0].focus()
      }
    },
    ...mapMutations([
      'closeReason',
      'closeService',
      'setReason',
      'logEvent'
    ])
  }
})
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  bottom: 0;
  z-index: 2;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  pointer-events: none;
  .overlay {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    pointer-events: initial;
    background-color: var(--grey-transparent);
    .body {
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
        .text {
          margin: 0 2rem;
          text-transform: uppercase;
        }
      }
    .reasons {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      .reason {
        display: flex;
        align-items: center;
        padding: 1rem;
        input {
          display: none;
        }
        .empty {
          width: 2.5rem;
          height: 2.5rem;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin-right: 2rem;
          padding: 0.2rem;
          background-color: var(--grey-medium-background);
          border-radius: 50%;
          .selected {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: var(--green);
            transform: scale(0);
            transition: transform 0.2s ease-out;
          }
        }
        input:checked ~ .empty {
          .selected {
            transform: scale(1);
            transition: transform 0.2s ease-in;
          }
        }
      }
    }
    }
  }
}
</style>

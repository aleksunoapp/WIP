<template>
  <aside
  class="container"
  :class="{'open' : reason}"
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
            <p class="text">{{$t("please_select_a_reason")}}</p>
          </div>
          <div class="reasons">
            <label
              v-for="reason in reasons"
              :key="reason.id"
              :for="`reason${reason.id}`"
              class="reason"
              @click="close()"
            >
              <input
                v-model="selected"
                :value="reason.id"
                type="radio"
                :id="`reason${reason.id}`"
              >
              <div class="empty">
                <div class="selected"></div>
              </div>
              {{reason.name}}
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

export default Vue.extend({
  computed: {
    ...mapState([
      'reason',
      'service',
      'reasons'
    ]),
    selected: {
      get () { return this.service.declinedReasonId },
      set (reasonId) {
        this.setReason(reasonId)
        this.logEvent(`Selected reason ${reasonId}`)
      }
    }
  },
  methods: {
    close () {
      setTimeout(() => { this.closeReason() }, 300)
    },
    ...mapMutations([
      'closeReason',
      'setReason',
      'logEvent'
    ])
  }
})
</script>

<style scoped lang="scss">
.container {
  position: absolute;
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
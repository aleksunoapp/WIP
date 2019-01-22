<template>
  <aside
  class="reason__container"
  :class="{'open' : error}"
  >
  <transition name="fade">
    <div
    v-if="error"
    @click="clearError"
    class="overlay"
    >
      <transition name="fade">
        <div 
          v-if="error"
          class="body"
          @click.stop
        >
          <div class="header">
            <p class="text">{{$t("error")}}</p>
            <button
              @click="clearError"
              class="close"
            >
              <div class="top"></div>
              <div class="bottom"></div>
            </button>
          </div>
          <div class="reasons">
            {{error}}
          </div>
        </div>
      </transition>
    </div>
  </transition>
  </aside>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapMutations, mapState } from 'vuex';
import Pagination from '@/components/Pagination'

export default Vue.extend({
  components: {
    Pagination
  },
  computed: {
    ...mapState([
      'error'
    ])
  },
  methods: {
    close () {
      this.clearError()
      this.logEvent('Closed error popup')
    },
    ...mapMutations([
      'clearError',
      'logEvent',
    ])
  }
})
</script>


<style scoped lang="scss">
.reason__container {
  position: absolute;
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
        margin: 0 6rem 0 2rem;
        text-transform: uppercase;
      }
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
</style>

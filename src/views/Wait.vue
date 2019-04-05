<template>
  <div class="background">
    <main class="contents">
      <img
        src="@/assets/images/approve-green.svg"
        alt="pencil making a check mark"
        class="image"
      >
      <div class="card">
        <div class="border" />
        <div class="wrapper">
          <p class="text">
            {{ deferredServices.length === 1 ? $t('wait_there_is') : $t('wait_there_are') }}
          </p>
          <p class="text large">
            <span class="green">
              {{ deferredServices.length }}
            </span> {{ $tc("recommendations", deferredServices.length) }}
          </p>
          <p class="text">
            {{ $t('pending_approval') }}
          </p>
        </div>
      </div>
      <button
        class="button cta green"
        @click="viewDeferred()"
      >
        {{ $tc("view_recommendations", deferredServices.length) }}
      </button>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapGetters(['deferredServices'])
  },
  created () {
    this.logEvent('Started viewing wait page')
  },
  beforeDestroy () {
    this.logEvent('Finished viewing wait page')
  },
  methods: {
    viewDeferred () {
      this.viewService(this.deferredServices[0])
      this.$router.push({ name: 'wait-services' })
    },
    ...mapMutations([
      'logEvent'
    ]),
    ...mapActions([
      'viewService'
    ])
  }
})
</script>

<style scoped lang="scss">
.background {
  width: 100%;
  min-height: 100%;
  background-color: var(--grey-light-background);
  display: flex;
  flex-direction: column;
  align-items: center;
  .contents {
    width: 100%;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2rem 0rem;
    @media (min-width: 768px) {
      margin: 5rem 1rem;
    }
    .image {
      height: 10rem;
      margin: 2rem 0;
      object-fit: contain;
      @media (min-width: 768px) {
        margin: 5rem 1rem;
      }
    }
    .card {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 0 4rem 0;
      border-radius: 3px;
      box-shadow: var(--shadow);
      .border {
        width: 100%;
        height: 0.5rem;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        background-color: var(--green);
      }
      .wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        background-color: var(--white);
        .text {
          margin: 0.5rem 0;
          &.large {
            font-family: 'Futura Heavy';
            font-weight: 700;
            font-size: 2rem;
          }
          .green {
            color: var(--green);
          }
        }
      }
    }
  }
}
</style>

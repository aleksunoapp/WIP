<template>
  <div class="background">
    <main class="contents">
      <img
        src="@/assets/images/review.svg"
        alt="magnifying glass over a bullet list"
        class="image"
      >
      <div class="card">
        <div class="border" />
        <div class="wrapper">
          <p class="text">
            {{ customer.firstName }}, {{ $t('you_have').toLowerCase() }}
          </p>
          <p class="text large">
            <span class="blue">
              {{ actionableAdditionalServices.length }}
            </span> {{ $tc('additional_recommendation', actionableAdditionalServices.length) }}
          </p>
          <p class="text">
            {{ $tc('that_need_your_attention', actionableAdditionalServices.length) }}
          </p>
        </div>
      </div>
      <button
        class="button cta"
        @click="viewAdditional()"
      >
        {{ $tc("view_recommendations", actionableAdditionalServices.length) }}
      </button>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapGetters([
      'additionalServices',
      'actionableAdditionalServices'
    ]),
    ...mapState(['customer'])
  },
  created () {
    this.logEvent('Started viewing additional page')
  },
  beforeDestroy () {
    this.logEvent('Finished viewing additional page')
  },
  methods: {
    viewAdditional () {
      this.viewService(this.additionalServices[0])
      this.$router.push({ name: 'additional-services' })
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
        background-color: var(--blue);
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
          text-align: center;
          &.large {
            font-family: 'Futura Heavy';
            font-weight: 700;
            font-size: 2rem;
          }
          .blue {
            color: var(--blue);
          }
        }
      }
    }
  }
}
</style>

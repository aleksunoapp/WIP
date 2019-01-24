<template>
  <div
    class="container"
  >
    <div class="background">
      <main class="contents">
        <img src="@/assets/images/review.svg" alt="magnifying glass over a bullet list" class="image">
        <div class="card">
            <div class="border" />
            <div class="wrapper">
              <p class="text">{{$t('hey')}}, {{customer.firstName}}, {{$t('you_have').toLowerCase()}}</p>
              <p class="text large"><span class="blue">{{highlightedServices.length}}</span> {{ $tc('additional_recommendation', highlightedServices.length) }}</p>
              <p class="text">{{$tc('that_need_your_attention', highlightedServices.length)}}</p>
            </div>
        </div>
        <button
          @click="$router.push({name: 'additional-services'})"
          class="button cta"
        >
          {{$tc("view_recommendations", highlightedServices.length)}}
        </button>
      </main>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default Vue.extend({
  created () {
    this.logEvent('Started viewing additional page')
  },
  beforeDestroy () {
    this.logEvent('Finished viewing additional page')
  },
  computed: {
    ...mapGetters(['highlightedServices']),
    ...mapState(['customer'])
  },
  methods: {
    ...mapMutations([
      'logEvent'
    ])
  }
})
</script>

<style scoped lang="scss">
.container {
  height: calc(100% - var(--header-height));
  overflow: auto;
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
}

</style>

<template>
  <div class="background">
    <main class="contents">
      <image-container
        class="logo"
        :src="dealer.logoUrl"
        :alt="`${dealer.name} logo`"
      />

      <h2
        class="subheader"
      >
        {{dealer.name}}
      </h2>
      <p
        class="description"
      >
        {{$t("thank_you")}}
      </p>

      <figure class="card">
        <img
          class="avatar"
          :src="advisor.advisorImageUrl"
        >
        <figcaption>
          <span>
            {{$t("your_service_consultant")}}
          </span>
          <span
            class="consultant__name"
          >
            {{advisor.advisorName}}
          </span>
        </figcaption>
      </figure>

      <template
        v-if="tooLate"
      >
        <p class="description">{{$t("your_service_advisor_will_confirm")}}</p>
      </template>
      <template
        v-else
      >
        <p class="description">{{$t("ready")}}</p>
        <div class="card wide">
          <div class="clock__background">
            <img class="clock" src="@/assets/images/clock.svg" aria-hidden="true">
          </div>
          <p
            class="pickup__time"
          >
            {{getPickupTime()}}
          </p>
        </div>
      </template>

      <button
        class="button cta"
      >
        {{dealer.name}}
      </button>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapState, mapMutations } from 'vuex'
import ImageContainer from '@/components/ImageContainer.vue'

export default Vue.extend({
  components: {
    ImageContainer
  },
  data: () => ({
    open: false
  }),
  computed: {
    ...mapState([
      'dealer',
      'advisor'
    ]),
    ...mapGetters([
      'readyBy',
      'respondBy'
    ]),
    tooLate () {
      return (this.respondBy - Date.now()) > 0
    }
  },
  created () {
    this.logEvent('Started viewing thanks page')
  },
  methods: {
    getPickupTime () {
      const now = new Date()
      const today = this.readyBy.getFullYear() === now.getFullYear() && this.readyBy.getMonth() === now.getMonth() && this.readyBy.getDate() === now.getDate()

      if (today) {
        return `${this.$t('today')} ${this.$t('at')} ${this.$d(this.readyBy, 'time')}`
      } else {
        return `${this.$d(this.readyBy, 'dateAndTime')}`
      }
    },
    ...mapMutations([
      'logEvent'
    ])
  }
})
</script>

<style scoped lang="scss">
.background {
  min-height: 100%;
  background-color: var(--grey-light-background);
  .contents {
    width: 100%;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    margin: auto;
  }
  .name {
    margin: 0 1rem;
  }
  .logo {
    max-width: 50%;
    height: 20vh;
    object-fit: contain;
    margin: 2rem 0rem;
    @media (min-width: 768px) {
      margin: 5rem 1rem;
    }
  }
  .description {
    text-align: center;
  }
  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background-color: var(--white);
    border-radius: 3px;
    box-shadow: var(--shadow);
    &.wide {
      width: 100%;
    }
    .avatar {
      max-width: 70px;
      max-height: 70px;
      margin-right: 1rem;
      border-radius: 50%;
    }
  }
  .consultant__name {
    display: block;
    font-weight: 700;
  }
  .clock__background {
    margin-right: 2rem;
    padding: 1rem;
    border-radius: 50%;
    background-color: var(--grey-light-background);
    .clock {
      max-width: 2rem;
      max-height: 2rem;
    }
    .time {
      font-weight: 700;
    }
  }
}

</style>

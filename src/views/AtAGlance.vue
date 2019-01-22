<template>
  <div
    class="container"
  >
    <div class="background">
      <main class="contents">
        <p>{{$t("you_have")}}</p>
        <h1>{{count.concern + count.fail + count.warning}} {{$t("recommendations")}}</h1>
        <p>{{$t("that_need_your_attention")}}</p>

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
          v-if="timer.total > 0"
        >
          <p>{{$t("select_your_services_in")}}</p>
          <p
            class="time"
            v-if="timer.total"
          >
            <span
              class="unit"
            v-if="timer.days">
              <span class="number">{{timer.days}}</span>d
            </span>
            <span
              class="unit"
            >
              <span class="number">{{timer.hours}}</span>h
            </span>
            <span
              class="unit"
            >
              <span class="number">{{timer.minutes}}</span>m
            </span>
            <span
              class="unit"
            >
              <span class="number">{{timer.seconds}}</span>s
            </span>
          </p>
          <p>{{$t("to_have_your_vehicle_ready_by")}}</p>

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
          @click="$router.push({name: 'inspection'})"
        >
          {{$t("view_recommendations")}}
        </button>
      </main>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default Vue.extend({
  data: () => ({
    open: false,
    timer: {
      'total': 0,
      'days': 0,
      'hours': 0,
      'minutes': 0,
      'seconds': 0
    }
  }),
  computed: {
    ...mapState([
      'drawer',
      'advisor'
    ]),
    ...mapGetters([
      'readyBy',
      'respondBy',
      'count'
    ])
  },
  created () {
    this.timer = this.getTimeRemaining()
    this.startTimer()
    this.logEvent('Started viewing at a glance page')
  },
  beforeDestroy () {
    this.logEvent('Finished viewing at a glance page')
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
    getTimeRemaining () {
      let total = this.respondBy - Date.now()
      let days = Math.floor(total / (1000 * 60 * 60 * 24))
      let hours = Math.floor((total / (1000 * 60 * 60)) % 24)
      let minutes = Math.floor((total / 1000 / 60) % 60)
      let seconds = Math.floor((total / 1000) % 60)
      return {
        total,
        days,
        hours,
        minutes,
        seconds
      }
    },
    startTimer () {
      let timeInterval = setInterval(() => {
        // end contition
        if (this.timer.total <= 0) {
          clearInterval(timeInterval)
          this.timer.days = 0
          this.timer.hours = 0
          this.timer.minutes = 0
          this.timer.seconds = 0
        }
        this.timer = this.getTimeRemaining()
      }, 1000)
    },
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
      .dealer__name {
        margin: 0 1rem;
      }
      .card {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        background-color: var(--white);
        border-radius: 3px;
        box-shadow: var(--shadow);
      }
      .card.wide {
        width: 100%;
      }
      .avatar {
        max-width: 70px;
        max-height: 70px;
        margin-right: 1rem;
        border-radius: 50%;
      }
      .consultant__name {
        display: block;
        font-weight: 700;
      }

      .time {
        font-weight: 700;
        .number {
          color: var(--blue);
        }
      }

      .clock__background {
        margin-right: 2rem;
        padding: 1rem;
        border-radius: 50%;
        background-color: var(--grey-light-background);
      }
      .clock {
        max-width: 2rem;
        max-height: 2rem;
      }
      .pickup__time {
        font-weight: 700;
      }
    }
  }
}

</style>

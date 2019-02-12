<template>
  <div class="background">
    <main class="contents">
      <h1 class="text">
        <span class="regular">
          {{ $t("you_have") }}
        </span><br>
        <span class="large">
          {{ totalCount }} {{ $tc("recommendations", totalCount) }}
        </span><br>
        <span class="regular">
          {{ $tc("that_need_your_attention", totalCount) }}
        </span>
      </h1>

      <figure class="card">
        <img
          class="avatar"
          :src="advisor.advisorImageUrl"
        >
        <figcaption>
          <span>
            {{ $t("your_service_consultant") }}
          </span>
          <span
            class="consultant__name"
          >
            {{ advisor.advisorName }}
          </span>
        </figcaption>
      </figure>

      <template
        v-if="timer.total > 0"
      >
        <p class="text">
          {{ $t("select_your_services_in") }}
        </p>
        <p
          v-if="timer.total"
          class="text time"
        >
          <span
            v-if="timer.days"
            class="unit"
          >
            <span class="number">
              {{ timer.days }}
            </span>d
          </span>
          <span
            class="unit"
          >
            <span class="number">
              {{ timer.hours }}
            </span>h
          </span>
          <span
            class="unit"
          >
            <span class="number">
              {{ timer.minutes }}
            </span>m
          </span>
          <span
            class="unit"
          >
            <span class="number">
              {{ timer.seconds }}
            </span>s
          </span>
        </p>
        <p class="text">
          {{ $t("to_have_your_vehicle_ready_by") }}
        </p>

        <div class="card">
          <div class="clock__background">
            <img
              class="clock"
              src="@/assets/images/clock.svg"
              aria-hidden="true"
            >
          </div>
          <p
            class="text pickup__time"
          >
            {{ getPickupTime() }}
          </p>
        </div>
      </template>
      <button
        class="button cta"
        @click="$router.push({name: 'services'})"
      >
        {{ $tc("view_recommendations", totalCount) }}
      </button>
    </main>
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
    ]),
    totalCount () {
      return this.count.concern + this.count.fail + this.count.warning
    }
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
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    @media (min-height: 768px) {
      justify-content: flex-start;
    }
    .text {
      margin: 1rem;
      text-align: center;
      .regular {
        font-size: 0.5em;
      }
    }
    .card {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      background-color: var(--white);
      border-radius: 3px;
      box-shadow: var(--shadow);
      @media (min-width: 768px) {
        width: auto;
      }
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
    .button {
      margin: 2rem 0 0 0;
    }
  }
}
</style>

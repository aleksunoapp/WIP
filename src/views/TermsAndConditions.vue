<template>
  <div class="container">
    <div class="contents">
      <h1 class="header">
        {{$t("terms_and_conditions")}}
      </h1>
      <p>
        {{$t("paragraph1")}}
      </p>
      <p>
        {{$t("paragraph2")}}
      </p>
      <div
        class="button cta green"
        @click="accept()"
      >
        {{$t("accept")}}
      </div>
      <div
        class="button skip"
        @click="decline()"
      >
        {{$t("decline")}}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapMutations} from 'vuex'

export default Vue.extend({
  created () {
    this.logEvent('Started viewing terms and conditions page')
  },
  beforeDestroy () {
    this.logEvent('Finished viewing terms and conditions page')
  },
  methods: {
    ...mapMutations([
      'acceptTermsAndConditions',
      'declineTermsAndConditions',
    ]),
    accept () {
      this.acceptTermsAndConditions()
      this.$router.push({name: 'summary'})
      this.logEvent('Accepted terms and conditions')
    },
    decline () {
      this.declineTermsAndConditions()
      this.$router.push({name: 'summary'})
      this.logEvent('Declined terms and conditions')
    }
  }
})
</script>


<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  .contents {
    max-width: 768px;
    .header {
      text-align: center;
    }
    .button {
      width: 100%;
      margin: 1rem 0;
      padding: 0;
      text-transform: uppercase;
      text-align: center;
      border: none;
    }
    .button.cta {
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Futura Heavy';
      height: 50px;
      line-height: 2rem;
      font-size: 1.8rem;
      font-weight: 400;
      box-shadow: var(--shadow);
      background-color: var(--blue);
      color: var(--white);
      border-radius: 3px;
    }
    .button.cta.green {
      background-color: var(--green);
    }
    .button.skip {
      color: var(--black);
    }
  }
}
</style>

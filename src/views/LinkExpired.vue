<template>
  <main class="container">
    <div class="contents">
      <img
        src="@/assets/images/clock.svg"
        alt="a clock"
        class="clock"
      >
      <p class="text">
        {{ $t("sorry") }}
      </p>
      <div class="links">
        <a
          class="link"
          :href="`tel:${dealer.phone}`"
        >
          <img
            src="@/assets/images/phone.svg"
            alt="phone"
            class="icon"
          >
          <div class="text">
            {{ $t("call_service_advisor") }}
          </div>
        </a>
        <a
          class="link"
          :href="`sms:${dealer.smsPhone}`"
        >
          <img
            src="@/assets/images/message-bubble.svg"
            alt="message"
            class="icon"
          >
          <div class="text">
            {{ $t("text_service_advisor") }}
          </div>
        </a>
      </div>
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState([
      'dealer'
    ])
  }
})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--grey-light-background);
  .contents {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .clock {
      width: 5em;
      height: 5em;
      object-fit: contain;
      margin: 5em 2em 2em 2em;
    }
    .text {
      text-align: center;
    }
    .links {
      width: 100%;
      display: flex;
      margin-top: 2rem;
      .link {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        color: var(--black);
        text-decoration: none;
        .icon {
          width: 4em;
          height: 4em;
          margin-bottom: 1rem;
          object-fit: contain;
        }
      }
    }
  }
}
</style>

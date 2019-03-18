<template>
  <div class="container">
    <div class="background">
      <div
        v-if="loading.getMetadata"
        class="loader"
      >
        <div class="gauge-loader" />
      </div>
      <main
        v-else
        class="contents"
      >
        <image-container
          class="logo"
          :src="topImageUrl"
        />
        <h1 class="header">
          <span class="half">
            {{ $t("header_first_half") }}
          </span>
          <span class="half">
            {{ $t("header_second_half") }}
          </span>
        </h1>
        <fieldset
          class="fieldset"
          :disabled="loading.logIn"
        >
          <form
            class="form"
            @submit.prevent="enter()"
          >
            <label
              class="label"
              :class="{'error' : error}"
              for="login"
            >
              {{ customer.isBusiness ? $t("please_enter_your_company_name") : $t("please_enter_your_last_name") }}
            </label>
            <input
              id="login"
              v-model="code"
              class="input"
              type="text"
              :name="inputName"
              autofocus
              :autocomplete="inputAutocomplete"
            >
            <button
              class="button cta"
              type="submit"
            >
              {{ $t("enter") }}
            </button>
          </form>
        </fieldset>
      </main>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import ImageContainer from '@/components/ImageContainer.vue'

export default Vue.extend({
  components: {
    ImageContainer
  },
  data: () => ({
    open: false,
    error: false
  }),
  computed: {
    inputName () {
      return this.customer.isBusiness ? null : 'lname'
    },
    inputAutocomplete () {
      return this.customer.isBusiness ? null : 'family-name'
    },
    ...mapState([
      'drawer',
      'customer',
      'dealer',
      'loading',
      'topImageUrl'
    ]),
    code: {
      get () {
        return this.$store.state.code
      },
      set (code) {
        this.setCode(code)
      }
    }
  },
  created () {
    this.setSlug(this.$route.params.slug)
    if (this.$route.query.secret) {
      this.code = this.$route.query.secret
    }
    this.getMetadata()
    this.logEvent('Started viewing login page')
  },
  beforeDestroy () {
    this.logEvent('Finished viewing login page')
  },
  methods: {
    enter () {
      this.logEvent('Clicked login button')
      if (this.loading.logIn) return

      if (!this.code) {
        this.error = true
      } else {
        this.error = false
        this.logIn()
      }
    },
    ...mapMutations([
      'setSlug',
      'setCode',
      'logEvent'
    ]),
    ...mapActions({
      getMetadata: 'getMetadata',
      logIn: 'logIn'
    })
  }
})
</script>

<style scoped lang="scss">
@-moz-keyframes gauge-loader {
  0% {
    -moz-transform: rotate(-50deg);
    transform: rotate(-50deg);
  }
  10% {
    -moz-transform: rotate(20deg);
    transform: rotate(20deg);
  }
  20% {
    -moz-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  24% {
    -moz-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  40% {
    -moz-transform: rotate(-20deg);
    transform: rotate(-20deg);
  }
  54% {
    -moz-transform: rotate(70deg);
    transform: rotate(70deg);
  }
  56% {
    -moz-transform: rotate(78deg);
    transform: rotate(78deg);
  }
  58% {
    -moz-transform: rotate(73deg);
    transform: rotate(73deg);
  }
  60% {
    -moz-transform: rotate(75deg);
    transform: rotate(75deg);
  }
  62% {
    -moz-transform: rotate(70deg);
    transform: rotate(70deg);
  }
  70% {
    -moz-transform: rotate(-20deg);
    transform: rotate(-20deg);
  }
  80% {
    -moz-transform: rotate(20deg);
    transform: rotate(20deg);
  }
  83% {
    -moz-transform: rotate(25deg);
    transform: rotate(25deg);
  }
  86% {
    -moz-transform: rotate(20deg);
    transform: rotate(20deg);
  }
  89% {
    -moz-transform: rotate(25deg);
    transform: rotate(25deg);
  }
  100% {
    -moz-transform: rotate(-50deg);
    transform: rotate(-50deg);
  }
}
@-webkit-keyframes gauge-loader {
  0% {
    -webkit-transform: rotate(-50deg);
    transform: rotate(-50deg);
  }
  10% {
    -webkit-transform: rotate(20deg);
    transform: rotate(20deg);
  }
  20% {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  24% {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  40% {
    -webkit-transform: rotate(-20deg);
    transform: rotate(-20deg);
  }
  54% {
    -webkit-transform: rotate(70deg);
    transform: rotate(70deg);
  }
  56% {
    -webkit-transform: rotate(78deg);
    transform: rotate(78deg);
  }
  58% {
    -webkit-transform: rotate(73deg);
    transform: rotate(73deg);
  }
  60% {
    -webkit-transform: rotate(75deg);
    transform: rotate(75deg);
  }
  62% {
    -webkit-transform: rotate(70deg);
    transform: rotate(70deg);
  }
  70% {
    -webkit-transform: rotate(-20deg);
    transform: rotate(-20deg);
  }
  80% {
    -webkit-transform: rotate(20deg);
    transform: rotate(20deg);
  }
  83% {
    -webkit-transform: rotate(25deg);
    transform: rotate(25deg);
  }
  86% {
    -webkit-transform: rotate(20deg);
    transform: rotate(20deg);
  }
  89% {
    -webkit-transform: rotate(25deg);
    transform: rotate(25deg);
  }
  100% {
    -webkit-transform: rotate(-50deg);
    transform: rotate(-50deg);
  }
}
@keyframes gauge-loader {
  0% {
    -moz-transform: rotate(-50deg);
    -ms-transform: rotate(-50deg);
    -webkit-transform: rotate(-50deg);
    transform: rotate(-50deg);
  }
  10% {
    -moz-transform: rotate(20deg);
    -ms-transform: rotate(20deg);
    -webkit-transform: rotate(20deg);
    transform: rotate(20deg);
  }
  20% {
    -moz-transform: rotate(60deg);
    -ms-transform: rotate(60deg);
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  24% {
    -moz-transform: rotate(60deg);
    -ms-transform: rotate(60deg);
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  40% {
    -moz-transform: rotate(-20deg);
    -ms-transform: rotate(-20deg);
    -webkit-transform: rotate(-20deg);
    transform: rotate(-20deg);
  }
  54% {
    -moz-transform: rotate(70deg);
    -ms-transform: rotate(70deg);
    -webkit-transform: rotate(70deg);
    transform: rotate(70deg);
  }
  56% {
    -moz-transform: rotate(78deg);
    -ms-transform: rotate(78deg);
    -webkit-transform: rotate(78deg);
    transform: rotate(78deg);
  }
  58% {
    -moz-transform: rotate(73deg);
    -ms-transform: rotate(73deg);
    -webkit-transform: rotate(73deg);
    transform: rotate(73deg);
  }
  60% {
    -moz-transform: rotate(75deg);
    -ms-transform: rotate(75deg);
    -webkit-transform: rotate(75deg);
    transform: rotate(75deg);
  }
  62% {
    -moz-transform: rotate(70deg);
    -ms-transform: rotate(70deg);
    -webkit-transform: rotate(70deg);
    transform: rotate(70deg);
  }
  70% {
    -moz-transform: rotate(-20deg);
    -ms-transform: rotate(-20deg);
    -webkit-transform: rotate(-20deg);
    transform: rotate(-20deg);
  }
  80% {
    -moz-transform: rotate(20deg);
    -ms-transform: rotate(20deg);
    -webkit-transform: rotate(20deg);
    transform: rotate(20deg);
  }
  83% {
    -moz-transform: rotate(25deg);
    -ms-transform: rotate(25deg);
    -webkit-transform: rotate(25deg);
    transform: rotate(25deg);
  }
  86% {
    -moz-transform: rotate(20deg);
    -ms-transform: rotate(20deg);
    -webkit-transform: rotate(20deg);
    transform: rotate(20deg);
  }
  89% {
    -moz-transform: rotate(25deg);
    -ms-transform: rotate(25deg);
    -webkit-transform: rotate(25deg);
    transform: rotate(25deg);
  }
  100% {
    -moz-transform: rotate(-50deg);
    -ms-transform: rotate(-50deg);
    -webkit-transform: rotate(-50deg);
    transform: rotate(-50deg);
  }
}
.form {
  text-align: center;
}
.container {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .background {
    width: 100%;
    min-height: 100%;
    background-color: var(--grey-light-background);
    display: flex;
    flex-direction: column;
    align-items: center;
    .loader {
      width: 100%;
      min-height: 40rem;
      display: flex;
      justify-content: center;
      align-items: center;
      /* :not(:required) hides this rule from IE9 and below */
      .gauge-loader:not(:required) {
        background: var(--blue);
        -moz-border-radius-topleft: 32px;
        -webkit-border-top-left-radius: 32px;
        border-top-left-radius: 32px;
        -moz-border-radius-topright: 32px;
        -webkit-border-top-right-radius: 32px;
        border-top-right-radius: 32px;
        display: inline-block;
        width: 64px;
        height: 32px;
        overflow: hidden;
        position: relative;
        text-indent: -9999px;
      }
      .gauge-loader:not(:required)::before {
        -moz-animation: gauge-loader 4000ms infinite ease;
        -webkit-animation: gauge-loader 4000ms infinite ease;
        animation: gauge-loader 4000ms infinite ease;
        background: white;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        content: '';
        position: absolute;
        left: 30px;
        top: 5.33333px;
        width: 4px;
        height: 26.66667px;
        -moz-transform-origin: 50% 100%;
        -ms-transform-origin: 50% 100%;
        -webkit-transform-origin: 50% 100%;
        transform-origin: 50% 100%;
      }
      .gauge-loader:not(:required)::after {
        content: '';
        background: white;
        -moz-border-radius: 8px;
        -webkit-border-radius: 8px;
        border-radius: 8px;
        position: absolute;
        left: 25.6px;
        top: 25.6px;
        width: 12.8px;
        height: 12.8px;
      }
    }
    .contents {
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      .logo {
        width: 350px;
        height: 25rem;
        min-height: 100px;
        margin: 4rem 0 0 0;
        object-fit: contain;

      }
      .header {
        font-family: 'Futura Heavy';
        font-weight: 700;
        letter-spacing: 1px;
        font-size: 2rem;
        text-align: center;
        .half {
          display: block;
        }
        @media (min-width: 768px) {
          font-size: 2.5rem;
        }
      }
      .fieldset {
        margin: none;
        padding: none;
        border: none;
        .form {
          .label {
            transition: all .2s ease-out;
            text-transform: uppercase;
          }
          .label.error {
            color: var(--red);
            transition: all .2s ease-in;
          }
          .input {
            text-transform: none;
          }
        }
      }
    }
  }
}
</style>

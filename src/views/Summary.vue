<template>
  <div class="background">
    <main class="contents">
      <div
        id="summary"
        class="card"
      >
        <div
          v-if="count.approved"
          class="row"
        >
          <div class="previous">
            <p class="item">
              {{ $t("previously_approved_services") }}
              <span class="taxes">
                {{ $t("taxes_and_fees_included") }}
              </span>
            </p>
            <button
              class="toggle"
              @click="previousExpanded = !previousExpanded"
            >
              <img
                class="chevron"
                :class="{'open' : previousExpanded}"
                src="@/assets/images/chevron-down.svg"
                aria-hidden="true"
              >
            </button>
          </div>
          <p class="price">
            {{ serviceTotal }}
          </p>
        </div>
        <transition-height>
          <div
            v-if="previousExpanded"
            class="list"
          >
            <div
              v-for="service in categoryServices('4')"
              :key="service.id"
              class="row"
            >
              <p class="item">
                {{ service.name }}
              </p>
              <p class="price">
                {{ getServiceDisplayPrice(service) }}
              </p>
            </div>
          </div>
        </transition-height>
        <div
          v-if="categoryServices('4').length"
          class="divider"
        />
        <div class="row bold">
          <p class="item">
            {{ $t("estimate") }}
          </p>
          <p class="price">
            {{ displayTotal }}
          </p>
        </div>
        <div class="row">
          <p class="item">
            {{ $t("additional_taxes_and_fees") }}
          </p>
          <p class="price">
            {{ tax }}
          </p>
        </div>
        <div class="divider" />
        <div class="row total">
          <p class="item">
            {{ $t("total_on_delivery") }}
          </p>
          <p class="price">
            {{ total }}
          </p>
        </div>
      </div>
      <div
        v-if="services.length"
        class="divider"
      />
      <div
        v-if="services.length"
        class="signature"
      >
        <div class="row">
          <p class="prompt">
            {{ $t("please_sign_below") }}
          </p>
          <div class="controls">
            <button
              class="clear"
              @click="clear()"
            >
              {{ $t("clear") }}
            </button>
            <button
              class="sign"
              :disabled="panned"
              @click="sign()"
              @keydown.enter="sign()"
            >
              {{ $t("click_to_sign") }}
            </button>
          </div>
        </div>
        <div class="wrapper">
          <canvas
            ref="canvas"
            class="panel"
          />
          <p
            v-show="printed"
            ref="printed"
            class="printed"
          >
            {{ `${customer.firstName} ${customer.lastName}` }}
          </p>
          <img
            src="@/assets/images/signature.svg"
            alt="sample signature"
            class="sample"
          >
        </div>
        <input
          id="acknowledgement"
          v-model="accepted"
          type="checkbox"
          @click.stop
        >
        <label
          for="acknowledgement"
          class="checkbox"
          @click.stop
        >
          <div class="box">
            <img
              src="@/assets/images/check.svg"
              alt="check"
              class="check"
            >
          </div>
          <p class="text">
            {{ $t("i_acknowledge") }} <router-link
              :to="{name: 'terms-and-conditions'}"
              class="link"
            >
              {{ $t("terms_and_conditions") }}.
            </router-link>
          </p>
        </label>
      </div>
      <div class="error">
        <transition-height>
          <p
            v-if="error"
            class="text"
          >
            {{ $t("please_sign_in_and_accept") }}
          </p>
        </transition-height>
      </div>
      <button
        class="button cta green"
        :disabled="loading.sendServices"
        @click="approve()"
      >
        {{ count.actionable ? $t("approve") : $t("next") }}
      </button>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import Pad from 'signature_pad'
import TransitionHeight from '@/components/TransitionHeight.vue'
import Hammer from 'hammerjs'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { getTotal, formatCurrency, getServiceDisplayPrice } from '@/mixins.js'

export default Vue.extend({
  components: {
    TransitionHeight
  },
  mixins: [getTotal, formatCurrency, getServiceDisplayPrice],
  data: () => ({
    pad: null,
    panned: false,
    printed: false,
    error: false,
    previousExpanded: false
  }),
  computed: {
    accepted: {
      get () {
        return this.$store.state.acceptedTermsAndConditions
      },
      set (accepted) {
        if (accepted) {
          this.acceptTermsAndConditions()
          this.logEvent('Accepted terms and conditions')
        } else {
          this.declineTermsAndConditions()
          this.logEvent('Declined terms and conditions')
        }
      }
    },
    ...mapState([
      'customer',
      'loading',
      'services'
    ]),
    ...mapGetters([
      'count',
      'categoryServices',
      'additionalServices',
      'getServices'
    ]),
    serviceTotal () {
      return this.formatCurrency(this.$store.getters.total.service)
    },
    displayTotal () {
      let total = ''
      if (this.$route.name === 'summary') {
        total = this.formatCurrency(this.$store.getters.total.inspection)
      }
      if (this.$route.name === 'additional-summary') {
        let subsum = 0
        subsum += this.getTotal(this.getServices({ wasSelected: false, isHighlighted: false, categories: ['1', '2', '5'] }))
        subsum += this.getTotal(this.additionalServices)
        total = this.formatCurrency(subsum)
      }
      return total
    },
    tax () {
      return this.formatCurrency(this.$store.state.tax)
    },
    total () {
      let total = ''
      if (this.$route.name === 'summary') {
        total = this.formatCurrency(this.$store.getters.total.service + this.$store.getters.total.inspection + this.$store.state.tax)
      }
      if (this.$route.name === 'additional-summary') {
        let subsum = 0
        subsum += this.getTotal(this.getServices({ wasSelected: false, isHighlighted: false, categories: ['1', '2', '5'] }))
        subsum += this.getTotal(this.additionalServices)

        total = this.formatCurrency(this.$store.getters.total.service + subsum + this.$store.state.tax)
      }
      return total
    }
  },
  mounted () {
    if (this.count.actionable) {
      this.buildPad()
    }
    this.logEvent('Started viewing summary page')
  },
  beforeDestroy () {
    this.logEvent('Finished viewing summary page')
  },
  methods: {
    ...mapMutations([
      'setSignature',
      'declineTermsAndConditions',
      'acceptTermsAndConditions',
      'logEvent'
    ]),
    ...mapActions({
      sendServices: 'sendServices'
    }),
    clear () {
      if (!this.pad.isEmpty() || this.panned) {
        const context = this.$refs.canvas.getContext('2d')
        const canvas = this.$refs.canvas
        this.panned = false
        this.$refs.printed.style.color = 'transparent'
        this.printed = false
        this.pad.off()
        context.clearRect(0, 0, canvas.width, canvas.height)
        this.buildPad()
      }
    },
    buildPad () {
      this.pad = new Pad(this.$refs.canvas, { backgroundColor: '#f7f7fa' })
      this.setCanvasBackground()
      const hammer = new Hammer(this.$refs.canvas)
      hammer.on('pan', this.signed)
    },
    setCanvasBackground () {
      const canvas = this.$refs.canvas
      const context = canvas.getContext('2d')
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      if (window.innerWidth < 992) {
        context.fillStyle = getComputedStyle(canvas).getPropertyValue('--grey-light-background')
      } else {
        context.fillStyle = getComputedStyle(canvas).getPropertyValue('--white')
      }
      context.fillRect(0, 0, canvas.width, canvas.height)
    },
    sign () {
      this.printed = true
      this.$nextTick(function () {
        const marginX = (this.$refs.canvas.offsetWidth - this.$refs.printed.offsetWidth) / 2
        const marginY = (this.$refs.canvas.offsetHeight - this.$refs.printed.offsetHeight) / 2
        this.$refs.printed.style.left = `${marginX}px`
        this.$refs.printed.style.top = `${marginY}px`
        this.$refs.printed.style.color = '#000000'
      })
      this.panned = true
      this.logEvent('Clicked to sign')
    },
    signed ({ distance }) {
      if (distance) {
        this.panned = true
      }
    },
    approve () {
      if (!this.count.actionable) {
        this.$router.push({ name: 'thanks' })
      } else {
        if (!this.accepted) {
          this.error = true
          return
        }
        if (this.pad.isEmpty() && !this.panned) {
          this.error = true
          return
        }
        this.error = false
        this.setSignature(this.pad.toDataURL())

        this.sendServices()

        this.logEvent('Clicked approve button')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.background {
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--white);
  @media (min-width: 992px) {
    background-color: var(--grey-light-background);
  }
  .contents {
    max-width: 992px;
    @media (min-width: 992px) {
      padding: 1rem;
    }
    .card {
      padding: 1rem;
      background-color: var(--white);
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &.total {
          color: var(--blue);
        }
        .previous {
          display: flex;
          align-items: center;
          .taxes {
            display: block;
            text-transform: uppercase;
            font-size: 0.7em;
          }
          .toggle {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 0 0 1rem;
            border: none;
            padding: 1.5rem 1rem;
            background-color: var(--white);
            .chevron {
              transition: transform .2s ease-in-out;
              max-width: 2rem;
              &.open {
                transform: rotate(180deg);
                transition: transform .2s ease-in-out;
              }
            }
          }
        }
        .price {
          min-width: 100px;
          text-align: right;
        }
      }
      .list {
        background-color: var(--grey-light-background);
        padding: 1rem;
      }
      .divider {
        width: 100%;
        height: 2px;
        margin: 1rem 0;
        background-color: var(--grey-light-background)
      }
      .total .price {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: .5rem;
        border-radius: 500px;
        color: var(--blue);
        font-weight: 700;
        letter-spacing: 0.0625rem;
        font-family: 'Futura Heavy';
        background-color: var(--grey-light-background);
      }
    }

    .signature {
      padding: 0 1rem;
      @media (min-width: 992px) {
        padding: 0;
      }
      .row {
        display: flex;
        justify-content: space-between;
        @media (min-width: 992px) {
          background-color: var(--grey-light-background);
        }
        .prompt {
          font-size: 1.2rem;
          text-transform: uppercase;
        }
        .controls {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          .sign, .clear {
            margin: 1px;
            border: none;
            padding: 1rem;
            background-color: var(--white);
            text-transform: uppercase;
            font-weight: 700;
            transition: opacity 0.3;
            @media (min-width: 992px) {
              background-color: var(--grey-light-background);
            }
          }
          .sign:disabled {
            opacity: 0.75;
            transition: opacity 0.3;
            font-weight: 400;
          }
        }
      }
      .wrapper {
        position: relative;
        .panel {
          width: 100%;
          height: 200px;
        }
        .printed {
          max-width: 100%;
          position: absolute;
          margin: 0;
          padding: 1rem;
          color: transparent;
          font-size: 2em;
          font-family: serif;
          font-style: italic;
        }
        .sample {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          pointer-events: none;
        }
      }
    }
    input {
      display: none;
    }
    .checkbox {
      display: inline-flex;
      align-items: center;
      padding: 1rem 0;
      transition: all .2s ease-in;
      .box {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 2.5rem;
        height: 2.5rem;
        margin-right: 1rem;
        border-radius: 3px;
        background-color: var(--grey-medium-background);
        .check {
          max-height: 100%;
          max-width: 100%;
          padding: 0.3rem;
          opacity: 0;
        }
      }
      .text {
        flex-shrink: 2;
        margin: 0;
        .link {
          display: inline;
          text-decoration: none;
          white-space: nowrap;
          color: var(--blue);
        }
      }
    }
    input:checked ~ .checkbox {
      .box {
        background-color: var(--green);
        .check {
          opacity: 1;
        }
      }
    }
    .error {
      .text {
        margin: 0;
        padding: 1rem;
        text-align: center;
        color: var(--red);
      }
    }
  }
}
</style>

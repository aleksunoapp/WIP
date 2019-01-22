<template>
  <div class="container">
    <div class="background">
      <main class="contents">
        <div class="card" id="summary">
          <div class="row">
            <p class="item">
              {{$t("previous")}}
            </p>
            <p class="price">
              {{serviceTotal}}
            </p>
          </div>
          <div class="row bold">
            <p class="item">
              {{$t("estimate")}}
            </p>
            <p class="price">
              {{inspectionTotal}}
            </p>
          </div>
          <div class="row">
            <p class="item">
              {{$t("additional_taxes_and_fees")}}
            </p>
            <p class="price">
              {{tax}}
            </p>
          </div>
          <div class="divider"></div>
          <div class="row total">
            <p class="item">
              {{$t("total_on_delivery")}}
            </p>
            <p class="price">
              {{total}}
            </p>
          </div>
        </div>
        <div class="divider"></div>
        <div class="signature">
          <div class="row">
            <p class="prompt">
              {{$t("please_sign_below")}}
            </p>
            <button
              class="sign"
              @click="sign()"
              @keyup.enter="sign()"
            >
              {{$t("click_to_sign")}}
            </button>
          </div>
          <div class="wrapper">
            <canvas
              class="panel"
              ref="canvas"
            >
            </canvas>
            <img src="@/assets/images/signature.svg" alt="sample signature" class="sample">
          </div>
          <input
            type="checkbox"
            id="acknowledgement"
            v-model="accepted"
            @click.stop
          >
          <label
            for="acknowledgement"
            class="checkbox"
            @click.stop
          >
            <div class="box">
              <img src="@/assets/images/check.svg" alt="check" class="check">
            </div>
            <p class="text">{{$t("i_acknowledge")}} <router-link :to="{name: 'terms-and-conditions'}" class="link">{{$t("terms_and_conditions")}}.</router-link></p>
          </label>
          <div class="error">
            <transition-height>
              <p
                v-if="error"
                class="text"
              >
                {{$t("please_sign_in_and_accept")}}
              </p>
            </transition-height>
          </div>
          <button
            class="button cta green"
            @click="approve()"
          >
            {{$t("approve")}}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Pad from 'signature_pad'
import TransitionHeight from '@/components/TransitionHeight.vue'
import Hammer from 'hammerjs'
import { mapState, mapMutations, mapActions } from 'vuex'
import { formatCurrency } from '@/mixins.js'

export default Vue.extend({
  components: {
    TransitionHeight
  },
  data: () => ({
    pad: null,
    panned: false,
    error: false
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
      'customer'
    ]),
    serviceTotal () {
      return this.formatCurrency(this.$store.getters.total.service)
    },
    inspectionTotal () {
      return this.formatCurrency(this.$store.getters.total.inspection)
    },
    tax () {
      return this.formatCurrency(this.$store.state.tax)
    },
    total () {
      return this.formatCurrency(this.$store.getters.total.service + this.$store.getters.total.inspection + this.$store.state.tax)
    }
  },
  mixins: [formatCurrency],
  mounted () {
    this.pad = new Pad(this.$refs.canvas, { backgroundColor: '#f7f7fa' })
    this.setCanvasResolutionAndBackground()
    window.addEventListener('resize', this.setCanvasResolutionAndBackground)
    this.logEvent('Started viewing summary page')
    const hammer = new Hammer(this.$refs.canvas)
    hammer.on('pan', this.signed)
  },
  beforeDestroy () {
    this.logEvent('Finished viewing summary page')
    window.removeEventListener('resize', this.setCanvasResolutionAndBackground)
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
    setCanvasResolutionAndBackground () {
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
      const text = `${this.customer.firstName} ${this.customer.lastName}`
      let offsetX = 20
      let offsetY = 20
      const canvas = this.$refs.canvas
      const maxWidth = canvas.offsetWidth - 40
      const maxHeight = canvas.offsetHeight - 40
      const context = canvas.getContext('2d')
      context.font = '2rem Arial'
      context.fillStyle = '#000000'
      const textWidth = context.measureText(text).width
      let textHeight = getComputedStyle(canvas).fontSize
      textHeight = textHeight.substr(0, textHeight.length - 2) * 2
      offsetX = ((maxWidth - textWidth) / 2) > 20 ? ((maxWidth - textWidth) / 2) : offsetX
      offsetY = ((maxHeight - textHeight) / 2) > 20 ? ((maxHeight - textHeight) / 2) : offsetY
      context.fillText(text, offsetX, offsetY, maxWidth)
      this.panned = true
      this.logEvent('Clicked to sign')
    },
    signed ({ distance }) {
      if (distance) {
        this.panned = true
      }
    },
    approve () {
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
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: calc(100% - var(--header-height));
  overflow: auto;
  .background {
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
          &.total {
            color: var(--blue);
          }
          .price {
            min-width: 100px;
            text-align: right;
          }
        }
        .divider {
          width: 100%;
          height: 2px;
          margin: 1rem 0;
          background-color: var(--grey-light-background)
        }
      }
      .divider {
        width: 100%;
        height: 2px;
        margin: 1rem 0;
        background-color: var(--grey-light-background)
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
          .sign {
            border: none;
            padding: 1rem;
            background-color: var(--white);
            text-transform: uppercase;
            font-weight: 700;
            @media (min-width: 992px) {
              background-color: var(--grey-light-background);
            }
          }
        }
        .wrapper {
          position: relative;
          .panel {
            width: 100%;
            height: 200px;
          }
          .sample {
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            pointer-events: none;
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
            text-align: center;
            color: var(--red);
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="background">
    <main class="contents">
      <div
        id="summary"
        class="card"
      >
        <!-- SERVICES APPROVED AT DEALERSHIP -->
        <div
          v-if="approvedAtDealership.count"
          class="row"
        >
          <div class="previous">
            <p class="item">
              {{ $t("services_approved_at_dealership") }}
              <span
                v-if="$route.name === 'additional-summary'"
                class="bold"
              >
                ({{ approvedAtDealership.count }})
              </span>
              <span class="taxes">
                {{ $t("taxes_and_fees_included") }}
              </span>
            </p>
            <button
              class="toggle"
              @click="toggleApprovedAtDealership()"
            >
              <img
                class="chevron"
                :class="{'open' : approvedAtDealershipExpanded}"
                src="@/assets/images/chevron-down.svg"
                aria-hidden="true"
              >
            </button>
          </div>
          <p class="price">
            {{ approvedAtDealership.total }}
          </p>
        </div>
        <transition-height>
          <div
            v-if="approvedAtDealershipExpanded"
            class="list"
          >
            <div
              v-for="service in servicesApprovedAtDealership"
              :key="service.id"
              class="row"
            >
              <p class="item">
                {{ service.name }}
              </p>
              <p
                v-if="getServiceDisplayPrice(service)"
                class="price"
              >
                {{ getServiceDisplayPrice(service) }}
              </p>
            </div>
          </div>
        </transition-height>
        <div
          v-if="servicesApprovedAtDealership.length"
          class="divider"
        />

        <template v-if="$route.name === 'summary'">
          <div class="row bold">
            <p class="item">
              {{ $t("estimate") }}
            </p>
            <p class="price">
              {{ formatCurrency(this.$store.getters.total.inspection) }}
            </p>
          </div>
          <div
            class="row"
          >
            <p class="item">
              {{ $t("additional_taxes_and_fees") }}
            </p>
            <p class="price">
              {{ formatCurrency(this.$store.state.tax.newlyApproved) }}
            </p>
          </div>
        </template>
        <template v-if="$route.name === 'additional-summary'">
          <!-- PREVIOUSLY APPROVED SERVICES -->
          <div
            v-if="previouslyApproved.count"
            class="row"
          >
            <div class="previous">
              <p class="item">
                {{ $t("previously_approved_services") }}
                <span
                  class="bold"
                >
                  ({{ previouslyApproved.count }})
                </span>
              </p>
              <button
                class="toggle"
                @click="togglePreviouslyApproved()"
              >
                <img
                  class="chevron"
                  :class="{'open' : previouslyApprovedExpanded}"
                  src="@/assets/images/chevron-down.svg"
                  aria-hidden="true"
                >
              </button>
            </div>
            <p class="price">
              {{ previouslyApproved.preTax }}
            </p>
          </div>
          <transition-height>
            <div
              v-if="previouslyApprovedExpanded"
              class="list"
            >
              <div
                v-for="service in previouslyApproved.services"
                :key="service.id"
                class="row"
              >
                <p class="item">
                  {{ service.name }}
                </p>
                <p
                  v-if="getServiceDisplayPrice(service)"
                  class="price"
                >
                  {{ getServiceDisplayPrice(service) }}
                </p>
              </div>
            </div>
          </transition-height>
          <div class="divider" />
          <div
            class="row indented"
          >
            <p class="item">
              {{ $t("additional_taxes_and_fees") }}
            </p>
            <p class="price">
              <template v-if="loading.getTax">
                <dot-dot-dot-spinner />
              </template>
              <template v-else>
                {{ previouslyApproved.tax }}
              </template>
            </p>
          </div>
          <div class="row bold indented pretax">
            <p class="item">
              {{ $t("total") }}
            </p>
            <p class="price">
              <template v-if="loading.getTax">
                <dot-dot-dot-spinner />
              </template>
              <template v-else>
                {{ previouslyApproved.total }}
              </template>
            </p>
          </div>
          <div
            v-if="previouslyApprovedServices.length"
            class="divider"
          />

          <!-- NEWLY APPROVED SERVICES -->
          <div
            class="row"
          >
            <p class="item">
              {{ $t("new_services") }}
              <span
                class="bold"
              >
                ({{ newlyApproved.count }})
              </span>
            </p>
            <p class="price">
              {{ newlyApproved.preTax }}
            </p>
          </div>
          <div class="divider" />
          <div
            class="row indented"
          >
            <p class="item">
              {{ $t("additional_taxes_and_fees") }}
            </p>
            <p class="price">
              <template v-if="loading.getTax">
                <dot-dot-dot-spinner />
              </template>
              <template v-else>
                {{ newlyApproved.tax }}
              </template>
            </p>
          </div>
          <div class="row bold indented pretax">
            <p class="item">
              {{ $t("total") }}
            </p>
            <p class="price">
              <template v-if="loading.getTax">
                <dot-dot-dot-spinner />
              </template>
              <template v-else>
                {{ newlyApproved.total }}
              </template>
            </p>
          </div>
        </template>

        <div class="divider" />

        <div class="row total bold">
          <p class="item">
            {{ $route.name === 'summary' ? $t("total_cost") : $t("total_updated_cost") }}
          </p>
          <p class="price">
            <template v-if="loading.getTax">
              <dot-dot-dot-spinner />
            </template>
            <template v-else>
              {{ total }}
            </template>
          </p>
        </div>
      </div>

      <!-- SIGNATURE -->
      <div
        v-if="count.actionable"
        class="divider"
      />
      <div
        v-if="count.actionable"
        class="signature"
      >
        <div class="legend">
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
              @click.stop
            >
              {{ $t("terms_and_conditions") }}.
            </router-link>
          </p>
        </label>
      </div>

      <!-- ERROR -->
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

      <!-- BUTTON -->
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
import DotDotDotSpinner from '@/components/DotDotDotSpinner.vue'
import Hammer from 'hammerjs'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { getTotal, formatCurrency, getServiceDisplayPrice } from '@/mixins.js'

export default Vue.extend({
  name: 'Summary',
  components: {
    DotDotDotSpinner,
    TransitionHeight
  },
  mixins: [getTotal, formatCurrency, getServiceDisplayPrice],
  data: () => ({
    pad: null,
    panned: false,
    printed: false,
    error: false,
    approvedAtDealershipExpanded: false,
    previouslyApprovedExpanded: false
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
      'deferredServices',
      'previouslyApprovedServices',
      'servicesApprovedAtDealership'
    ]),
    approvedAtDealership () {
      let services = this.servicesApprovedAtDealership
      let total = this.getTotal(services)

      return {
        services,
        count: services.length,
        total: this.formatCurrency(total)
      }
    },
    newlyApproved () {
      let services = [
        ...this.additionalServices,
        ...this.deferredServices
      ]
        .filter(service => {
          const selected = service.isSelected
          const actionable = this.getServiceDisplayPrice(service) !== false
          return selected && actionable
        })
      let pretax = this.getTotal(services)
      let tax = this.$store.state.tax.newlyApproved

      return {
        services,
        count: services.length,
        tax: this.formatCurrency(tax),
        preTax: this.formatCurrency(pretax),
        total: this.formatCurrency(pretax + tax)
      }
    },
    previouslyApproved () {
      let services = this.$store.getters.previouslyApprovedServices
      let pretax = this.getTotal(services)
      let tax = this.$store.state.tax.previouslyApproved

      return {
        services,
        count: services.length,
        tax: this.formatCurrency(tax),
        preTax: this.formatCurrency(pretax),
        total: this.formatCurrency(pretax + tax)
      }
    },
    total () {
      let total = 0
      let formatted = ''
      if (this.$route.name === 'summary') {
        total = this.$store.getters.total.service +
          this.$store.getters.total.inspection +
          this.$store.state.tax.newlyApproved
        formatted = this.formatCurrency(total)
      }
      if (this.$route.name === 'additional-summary') {
        total = this.$store.getters.total.service +
          this.$store.getters.total.inspection +
          this.$store.state.tax.newlyApproved +
          this.$store.state.tax.previouslyApproved
        formatted = this.formatCurrency(total)
      }
      return formatted
    }
  },
  mounted () {
    if (this.count.actionable) {
      this.buildPad()
    }
    window.addEventListener('resize', this.setCanvasBackground)
    this.logEvent('Started viewing summary page')
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setCanvasBackground)
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
    toggleApprovedAtDealership () {
      this.approvedAtDealershipExpanded = !this.approvedAtDealershipExpanded
    },
    togglePreviouslyApproved () {
      this.previouslyApprovedExpanded = !this.previouslyApprovedExpanded
    },
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
      this.pad.off()
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
    width: 600px;
    max-width: 100%;
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
        &.indented {
          padding-left: 3rem;
          .item {
            margin: 0.5rem 0;
          }
        }
        &.pretax {
          .price {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin: 0;
            color: var(--blue);
            font-weight: 700;
            letter-spacing: 0.0625rem;
            font-family: 'Futura Heavy';
          }
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
          padding-left: 1rem;
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
      .legend {
        display: flex;
        flex-wrap: wrap;
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

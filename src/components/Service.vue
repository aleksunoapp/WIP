<template>
  <aside
    id="service"
    ref="service"
    class="container"
    :class="{'open' : modal}"
    tabindex="0"
  >
    <transition name="fade">
      <div
        v-if="modal"
        class="overlay"
        @click.stop="closeService"
      >
        <transition name="fade">
          <div
            v-if="modal"
            class="modal"
            @click.stop
          >
            <div class="top">
              <div
                class="category"
                :class="categoryColor"
              >
                <p class="name">
                  {{ categoryName }}
                </p>
                <p class="price">
                  <span>
                    {{ $t("total") }}:
                  </span>
                  <span class="total">
                    {{ displayTotal }}
                  </span>
                </p>
              </div>
              <div
                ref="body"
                class="body"
              >
                <div class="service">
                  <p class="name">
                    {{ service.name }}
                  </p>
                  <div class="wrapper">
                    <div
                      v-show="service.isSelected"
                      class="box"
                    >
                      <img
                        src="@/assets/images/green-check.svg"
                        alt="green checkmark - service is selected"
                        class="check"
                      >
                    </div>
                    <p
                      v-if="getServiceDisplayPrice(service)"
                      class="price"
                    >
                      {{ getServiceDisplayPrice(service) }}
                    </p>
                  </div>
                  <div
                    v-if="service.isHighlighted"
                    class="badge"
                  >
                    {{ $t("updated") }}
                  </div>
                </div>
                <img
                  v-if="service.imageUrl"
                  :src="service.imageUrl"
                  class="image"
                >
                <div class="details">
                  <p
                    v-if="warranty"
                    class="warranty"
                  >
                    {{ warranty }}
                  </p>
                  <p
                    v-if="comments.customer.header"
                    class="title"
                  >
                    {{ comments.customer.header }}:
                  </p>
                  <p
                    v-if="comments.customer.text"
                    class="comment"
                  >
                    {{ comments.customer.text }}
                  </p>
                  <div
                    v-if="comments.divider"
                    class="divider"
                  />
                  <p
                    v-if="comments.advisor.header"
                    class="title"
                  >
                    {{ comments.advisor.header }}:
                  </p>
                  <p
                    v-if="comments.advisor.text"
                    class="comment"
                  >
                    {{ comments.advisor.text }}
                  </p>
                </div>
              </div>
            </div>
            <div class="footer">
              <div
                v-if="service.category < '8'"
                class="buttons"
              >
                <button
                  class="button cta green"
                  @click="approve()"
                >
                  {{ $t("approve") }}
                </button>
                <button
                  class="button skip"
                  @click="reject()"
                  @keydown.tab="$refs.service.focus()"
                >
                  {{ $t("not_today") }}
                </button>
              </div>
              <nav class="navigation">
                <button
                  class="back"
                  @click="back()"
                >
                  {{ $t("back") }}
                </button>
                <button
                  class="next"
                  @click="next()"
                >
                  {{ $t("next") }}
                </button>
              </nav>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </aside>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { getServiceDisplayPrice, getTotal, focus, formatCurrency } from '@/mixins.js'

export default Vue.extend({
  name: 'ServicePopup',
  mixins: [getServiceDisplayPrice, getTotal, focus, formatCurrency],
  computed: {
    ...mapState([
      'modal',
      'service',
      'customerCommentsLabel'
    ]),
    ...mapGetters([
      'serviceById',
      'categoriesShownOnRoute',
      'categoryServicesShownOnRoute',
      'count',
      'isPass',
      'getServices',
      'additionalServices',
      'total'
    ]),
    services () {
      let services = []
      for (const category of this.categoriesShownOnRoute) {
        if (!this.isPass(category.id)) {
          services = services.concat(this.categoryServicesShownOnRoute(category.id))
        }
      }
      return services.filter(service => service.category !== '3')
    },
    categoryColor () {
      if (this.service.category === '1') return 'red'
      if (this.service.category === '2') return 'yellow'
      if (this.service.category === '3') return 'green'
      if (this.service.category === '6') return 'grey'
      if (this.service.category === '7') return 'grey'
      if (this.service.category === '8') return 'grey'
      if (this.service.category === '9') return 'grey'
      return ''
    },
    categoryName () {
      return this.$store.getters.categoryName(this.service.category)
    },
    displayTotal () {
      let total = ''
      if (this.$route.name === 'additional-services') {
        total = this.formatCurrency(this.getTotal(this.additionalServices))
      } else if (this.$route.name === 'wait-services') {
        total = this.formatCurrency(
          this.getTotal(
            this.getServices({
              isHighlighted: false,
              categories: ['1', '2', '5']
            })
          ) + this.getTotal(this.additionalServices))
      } else if (this.$route.name === 'services') {
        total = this.formatCurrency(this.total.inspection)
      }
      return total
    },
    warranty () {
      let text = ''
      if (this.service.price === 0 && this.service.laborMatrixPayment) {
        if (this.service.laborMatrixPayment !== 'NA' && this.service.laborMatrixPayment !== 'None') {
          text = this.$t(`${this.service.laborMatrixPayment}`)
        }
      }
      return text
    },
    comments () {
      let customer = {
        header: '',
        text: ''
      }
      let advisor = {
        header: '',
        text: ''
      }

      if (this.service.category > '5') {
        if (this.service.parentServiceId) {
          customer.text = this.serviceById(this.service.parentServiceId).comment
        } else {
          customer.text = this.service.comment
        }
        if (customer.text) {
          customer.header = this.customerCommentsLabel
        }

        if (this.service.serviceAdvisorComments) {
          advisor.text = this.service.serviceAdvisorComments
        }
        if (advisor.text) {
          advisor.header = this.$t('advisor_comments')
        }
      } else {
        advisor.text = this.service.serviceAdvisorComments
      }

      let divider = customer.text && advisor.text

      return {
        customer,
        advisor,
        divider
      }
    }
  },
  watch: {
    modal (open) {
      if (open) {
        this.focus('#service')
      } else {
        this.focus(`#card${this.service.id}`)
      }
    },
    service () {
      if (this.$refs.body) {
        this.$refs.body.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  },
  destroyed () {
    this.closeService()
  },
  methods: {
    ...mapMutations([
      'closeService',
      'openReason',
      'selectService',
      'unselectService',
      'logEvent'
    ]),
    ...mapActions([
      'viewService',
      'getTax'
    ]),
    approve () {
      this.selectService()
      this.logEvent(`Selected service ${this.service.id}`)
      if (this.$route.name === 'additional-services' || this.$route.name === 'wait-services') {
        this.next()
      } else {
        this.closeService()
      }
    },
    reject () {
      this.unselectService()
      this.logEvent(`Unselected service ${this.service.id}`)
      this.openReason()
    },
    next () {
      const index = this.services.findIndex(service => service.id === this.service.id)
      if (index === undefined) return
      if (index < this.services.length - 1) {
        this.viewService(this.services[index + 1])
      } else {
        if (this.$route.name === 'services') {
          if (this.count.actionable) {
            this.getTax()
            this.$router.push({ name: 'summary' })
          } else {
            this.$router.push({ name: 'thanks' })
          }
        }
        if (this.$route.name === 'additional-services') {
          if (this.count.actionable) {
            if (this.getServices({ isHighlighted: false, categories: ['1', '2', '5'] }).length) {
              this.$router.push({ name: 'wait' })
            } else {
              this.getTax()
              this.$router.push({ name: 'additional-summary' })
            }
          } else {
            this.$router.push({ name: 'thanks' })
          }
        }
        if (this.$route.name === 'wait-services') {
          if (this.count.actionable) {
            this.getTax()
            this.$router.push({ name: 'additional-summary' })
          } else {
            this.$router.push({ name: 'thanks' })
          }
        }
        this.closeService()
        this.logEvent(`Finished viewing service ${this.service.id}`)
      }
    },
    back () {
      const index = this.services.findIndex(service => service.id === this.service.id)
      if (index > 0) {
        this.viewService(this.services[index - 1])
      } else {
        this.closeService()
      }
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  bottom: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  pointer-events: none;
}
.overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  pointer-events: initial;
  background-color: var(--grey-transparent);
  .modal {
    height: 100%;
    width: 100%;
    max-width: 768px;
    margin: 0;
    display: flex;
    flex-direction: column;
    @media (min-width: 992px) {
      max-height: calc(100% - 4rem);
      margin: 0 2rem;
    }
    background-color: var(--white);
    pointer-events: initial;
    .top {
      height: 100%;
      min-height: 0px;
      display: flex;
      flex-direction: column;
      flex: 1;
      .category {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        color: var(--white);
        &.red {
          background-color: var(--red);
        }
        &.yellow {
          background-color: var(--yellow);
        }
        &.green {
          background-color: var(--green-pastel);
        }
        &.grey {
          background-color: var(--grey-dark-background);
        }
        .name {
          flex: 100 100 50%;
          display: flex;
          margin: 0;
          padding: 1rem;
          align-items: center;
          border-right: 2px solid var(--white);
        }
        .price {
          flex: 100 100 30%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin: 0;
          padding: 1rem;
        }
      }
      .body {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .service {
          position: relative;
          flex-shrink: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          .name {
            margin: 0;
            padding: 1rem;
          }
          .wrapper {
            display: flex;
            align-items: center;
            .box {
              display: inline-flex;
              justify-content: center;
              align-items: center;
              width: 2.5rem;
              height: 2.5rem;
              margin: 0 1rem;
              border-radius: 3px;
              .check {
                max-height: 100%;
                max-width: 100%;
                padding: 0.3rem;
              }
            }
            .price {
              display: inline-block;
              margin: 0;
              padding: 1rem;
              border-radius: 500px;
              color: var(--blue);
              font-weight: 700;
              letter-spacing: 0.0625rem;
              font-family: 'Futura Heavy';
              background-color: var(--grey-light-background);
              text-align: center;
            }
          }
        }
        .badge {
          position: absolute;
          bottom: -4rem;
          left: 2rem;
          padding: 0.5rem 1rem;
          background-color: var(--green-pastel);
          border-radius: 500px;
          font-family: 'Futura Heavy';
          color: var(--white);
          text-transform: uppercase;
        }
        .image {
          width: 100%;
          max-height: 50%;
          padding: 1rem 0;
          object-fit: contain;
          background-color: var(--grey-light-background);
        }
        .details {
          padding: 2rem;
          .warranty {
            color: var(--blue);
          }
          .comment, .warranty {
            margin: 1rem 0 2rem 0;
            flex-shrink: 0;
          }
          .title {
            margin-bottom: 0;
            font-family: 'Futura Heavy';
            font-weight: 700;
          }
          .divider {
            width: 100%;
            height: 1px;
            background-color: var(--grey-light-background);
          }
        }
      }
    }
    .footer {
      .navigation {
        display: flex;
        justify-content: space-between;
        padding: 0 2rem;
        border-top: 1px solid var(--grey-light-background);
        @media (min-height: 768px) {
          margin-top: 1rem;
          padding: 1rem 2rem;
          border-bottom: 1px solid var(--grey-light-background);
        }
        .back, .next {
          padding: 1rem;
          border: none;
          background-color: var(--white);
          font-size: 1.5rem;
          text-transform: uppercase;
        }
        .back {
          color: var(--grey-dark-background);
        }
        .next {
          font-family: 'Futura Heavy';
          font-weight: 700;
        }
      }
      .buttons {
        margin: 0 2rem;
        .button {
          margin: 0;
          @media (min-height: 768px) {
            margin: 1rem 0;
          }
          &.skip {
            margin: .5rem 0 0 0;
          }
        }
      }
    }
  }
}
</style>

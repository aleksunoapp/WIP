<template>
  <div class="background">
    <service ref="service" />
    <reason @next="next" />
    <desktop-navigation
      :categories="categoriesShownOnRoute"
      :display-total="displayTotal"
      :count-total="countTotal"
      @scroll="scrollToCategory"
    />
    <div class="right">
      <p class="total">
        <span class="text">
          {{ $t("total_estimate") }}
          <span class="bold">
            ({{ countTotal }})
          </span>
        </span>
        <span class="price">
          {{ displayTotal }}
        </span>
      </p>
      <div
        id="list-scroll-container"
        ref="view"
        class="view"
      >
        <summary v-show="approve" />
        <div
          v-show="!approve"
          class="wrapper"
        >
          <section
            v-for="category in categoriesShownOnRoute"
            :ref="`category${category.id}`"
            :key="category.id"
            class="category"
            :class="{
              'open': category.defaultExpended
            }"
          >
            <div
              class="header"
              :class="{
                'green' : category.serviceCategoryType === 'PASS',
                'yellow' : category.serviceCategoryType === 'ATTN',
                'red' : category.serviceCategoryType === 'SAFETY',
                'grey' : category.serviceCategoryType === 'CC',
              }"
              @click="toggleCategory(category)"
            >
              <div class="left">
                <span
                  class="count"
                  :class="{
                    'green' : category.id === '2',
                    'yellow' : category.id === '3',
                    'red' : category.id === '4',
                    'grey' : category.id === '5',
                  }"
                >
                  {{ categoryServicesShownOnRoute(category.id).length }}
                </span>
                <div class="name">
                  {{ category.name }}
                </div>
              </div>
              <button
                v-if="categoryServicesShownOnRoute(category.id).length"
                class="toggle"
                aria-label="toggle category"
                @click.stop="toggleCategory(category)"
                @keydown.enter.prevent="toggleCategory(category)"
              >
                <img
                  class="chevron"
                  src="@/assets/images/chevron-down.svg"
                  aria-hidden="true"
                >
              </button>
            </div>
            <transition-height>
              <div v-if="category.defaultExpended">
                <service-card
                  v-for="(service) in categoryServicesShownOnRoute(category.id)"
                  :key="service.id"
                  :category="category"
                  :service="service"
                />
              </div>
            </transition-height>
          </section>
        </div>
        <button
          class="confirm"
          @click="confirm()"
        >
          {{ $t('confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { getTotal, formatCurrency } from '@/mixins.js'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ServiceCard from '@/components/ServiceCard.vue'
import TransitionHeight from '@/components/TransitionHeight.vue'
import Service from '@/components/Service.vue'
import Reason from '@/components/Reason.vue'
import DesktopNavigation from '@/components/DesktopNavigation.vue'

export default Vue.extend({
  name: 'ServicesList',
  components: {
    Service,
    Reason,
    ServiceCard,
    TransitionHeight,
    DesktopNavigation
  },
  mixins: [getTotal, formatCurrency],
  data: () => ({
    service: null,
    loading: false,
    approve: false,
    error: ''
  }),
  computed: {
    displayTotal () {
      let total = ''
      if (this.$route.name === 'additional-services') {
        total = this.formatCurrency(this.getTotal(this.additionalServices))
      } else if (this.$route.name === 'wait-services') {
        total = this.formatCurrency(this.getTotal(this.getServices({ isHighlighted: false, categories: ['1', '2', '5'] })) + this.getTotal(this.additionalServices))
      } else if (this.$route.name === 'services') {
        total = this.formatCurrency(this.total.inspection)
      }
      return total
    },
    countTotal () {
      let total = ''
      if (this.$route.name === 'additional-services') {
        total = this.additionalServices.length
      } else if (this.$route.name === 'wait-services') {
        total = this.getServices({ isHighlighted: false, categories: ['1', '2', '5'] }).length
      } else if (this.$route.name === 'services') {
        total = this.count.concern + this.count.fail + this.count.warning
      }
      return total
    },
    ...mapGetters([
      'additionalServices',
      'categoryServicesShownOnRoute',
      'categoriesShownOnRoute',
      'count',
      'getServices',
      'total'
    ])
  },
  mounted () {
    this.logEvent('Started viewing inspection page')
  },
  beforeDestroy () {
    this.logEvent('Finished viewing inspection page')
  },
  methods: {
    toggleCategory (category, event) {
      this.setCategoryExpanded({ id: category.id, expanded: !category.defaultExpended })
      this.logEvent(`${category.defaultExpended ? 'Collapsed' : 'Expanded'} category ${category.id}`)
    },
    scrollToCategory (category) {
      this.setActiveCategory(category)
      let rem = getComputedStyle(this.$refs.view).fontSize
      rem = rem.substr(0, rem.length - 2)
      this.$refs.view.scrollTo({
        left: 0,
        top: this.$refs[`category${category.id}`][0].offsetTop - rem,
        behavior: 'smooth'
      })
      this.logEvent(`Selected category ${category.id}`)
    },
    closeServiceView () {
      this.service = null
    },
    confirm () {
      this.logEvent('Clicked confirm button')
      if (this.$route.name === 'services') {
        if (this.count.actionable) {
          this.getTax()
        }
        this.$router.push({ name: 'summary' })
      } else if (this.$route.name === 'wait-services') {
        this.$router.push({ name: 'additional-summary' })
      } else if (this.getServices({
        isHighlighted: false,
        categories: ['1', '2', '5']
      }).filter(service => service.category > '7').length) {
        this.$router.push({ name: 'wait' })
      } else {
        this.getTax()
        this.$router.push({ name: 'additional-summary' })
      }
    },
    next () {
      this.$refs.service.next()
    },
    ...mapMutations([
      'setService',
      'openReason',
      'setActiveCategory',
      'logEvent',
      'setCategoryExpanded'
    ]),
    ...mapActions({
      viewService: 'viewService',
      getTax: 'getTax'
    })
  }
})
</script>

<style scoped lang="scss">
.background {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--grey-light-background);
  .right {
    width: 100%;
    display: flex;
    flex-direction: column;
    .total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0;
      padding: 1rem 1rem 1rem 2rem;
      background-color: var(--white);
        @media (min-width: 992px) {
          display: none;
        }
      .text {
        display: inline;
      }
    }
    .price {
      color: var(--blue);
      font-weight: 700;
      letter-spacing: 0.0625rem;
      font-family: 'Futura Heavy';
      background-color: var(--grey-light-background);
      padding: 0.5rem 1rem;
      border-radius: 500px;
    }
    .view {
      width: 100%;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background-color: var(--grey-light-background);
      .wrapper {
        padding: 1rem 0;
        @media (min-width: 992px) {
          padding: 1rem;
        }
        .category {
          margin-bottom: 2rem;
          box-shadow: var(--shadow);
          border-radius: 5px;
          background-color: var(--white);
          @media (min-width: 992px) {
            .category {
              padding: 1rem 0;
            }
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
            transition: border-bottom-left-radius .2s ease-out;
            box-shadow: 0 3px 7px 0 rgba(42,55,71,0.15);
            color: var(--blue);
            font-family: 'Futura Heavy';
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            .left {
              display: flex;
              align-items: center;
              .name {
                padding: 0.5rem;
              }
              .count {
                width: 4rem;
                height: 4rem;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0.5rem 1.5rem;
                padding: 1rem;
                border-radius: 35%;
                font-family: 'Futura Heavy';
                color: var(--white);
                box-shadow: var(--shadow);
              }
            }
            .toggle {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 1rem;
              border: none;
              padding: 0.5rem 0;
              background-color: var(--white);
              .chevron {
                transition: transform .2s ease-in-out;
                max-width: 2rem;
              }
            }
          }
          .header.grey {
            border-left: 6px solid var(--grey-dark-background);
            .count {
              background-color: var(--grey-dark-background);
            }
          }
          .header.green {
            border-left: 6px solid var(--green);
            .count {
              background-color: var(--green);
            }
          }
          .header.yellow {
            border-left: 6px solid var(--yellow);
            .count {
              background-color: var(--yellow);
            }
          }
          .header.red {
            border-left: 6px solid var(--red);
            .count {
              background-color: var(--red);
            }
          }
        }
        .category.open {
          .header {
            border-bottom-left-radius: unset;
            transition: border-bottom-left-radius .2s ease-in;
            .toggle {
              .chevron {
                transform: rotate(180deg);
                transition: transform .2s ease-in-out;
              }
            }
          }
        }
      }
      .confirm {
        width: 100%;
        min-height: 5rem;
        padding: 1.5rem;
        color: var(--white);
        background-color: var(--blue);
        font-size: 1.5rem;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    }
  }
}

</style>

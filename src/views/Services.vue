<template>
  <div
    class="container"
  >
    <div class="background">
      <div class="navigation">
        <p class="total">
          <span>
            {{$t("total_estimate")}}
            <span class="bold">({{countTotal}})</span>
          </span>
          <span class="price">{{displayTotal}}</span>
        </p>
        <nav class="categories">
          <div
            v-for="category in categoriesShownOnRoute"
            :key="category.id"
            class="category__container"
            :class="{'active' : activeCategory && category.id === activeCategory.id}"
          >
            <div class="border"></div>
            <button
              class="category"
              @click="scrollToCategory(category)"
            >
              <div class="left">
                <span
                  class="count"
                  :class="{
                    'green' : category.serviceCategoryType === 'PASS',
                    'yellow' : category.serviceCategoryType === 'ATTN',
                    'red' : category.serviceCategoryType === 'SAFETY',
                    'grey' : category.serviceCategoryType === 'CC',
                  }"
                >
                  {{categoryServicesShownOnRoute(category.id).length}}
                </span>
                <span class="name">{{category.name}}</span>
              </div>
              <div class="right">
                <span class="badge" v-if="categoryContainsHiglightedServices(category.id)">{{$t("new")}}</span>
                <img
                  class="chevron"
                  src="@/assets/images/chevron-right.svg"
                  aria-hidden="true"
                >
              </div>
            </button>
          </div>
        </nav>
      </div>
      <div class="view" ref="view">
        <summary v-show="approve"/>
        <div class="wrapper" v-show="!approve">
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
              @keyup.enter="toggleCategory(category)"
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
                  {{categoryServicesShownOnRoute(category.id).length}}
                </span>
                <div class="name">{{category.name}}</div>
              </div>
              <button
                class="toggle"
              >
                <img class="chevron" src="@/assets/images/chevron-down.svg" aria-hidden="true">
              </button>
            </div>
            <div class="cards">
              <service-card
                v-for="(service) in categoryServicesShownOnRoute(category.id)"
                :category="category"
                :service="service"
                :key="service.id"
              />
            </div>
          </section>
        </div>
        <button
          class="confirm"
          @click="confirm()"
        >
          {{$t('confirm')}}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import ServiceCard from '@/components/ServiceCard.vue'
import { formatCurrency } from '@/mixins.js'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default Vue.extend({
  name: 'ServicesList',
  components: {
    ServiceCard
  },
  data: () => ({
    service: null,
    loading: false,
    approve: false,
    error: ''
  }),
  computed: {
    ...mapGetters([
      'categoryServicesShownOnRoute',
      'categoryContainsHiglightedServices',
      'categoriesShownOnRoute',
      'waitServices',
      'total',
      'count',
      'highlightedServices'
    ]),
    ...mapState([
      'activeCategory'
    ]),
    displayTotal () {
      if (this.$route.name === 'additional-services') {
        return this.formatCurrency(this.total.additional)
      } else if (this.$route.name === 'services') {
        return this.formatCurrency(this.total.inspection)
      }
    },
    countTotal () {
      if (this.highlightedServices.length) {
        return this.highlightedServices.length
      } else {
        return this.count.concern + this.count.fail + this.count.warning
      }
    }
  },
  created () {
    this.logEvent('Started viewing inspection page')
  },
  beforeDestroy () {
    this.logEvent('Finished viewing inspection page')
  },
  mixins: [formatCurrency],
  methods: {
    toggleCategory (category) {
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
        if (this.count.fail || this.count.warning || this.count.concern) {
          this.getTax()
          this.$router.push({ name: 'summary' })
          return
        } else {
          this.$router.push({ name: 'thanks' })
          return
        }
      }

      if (this.$route.name === 'wait-services') {
        this.$router.push({ name: 'additional-summary' })
        return
      }

      if (this.waitServices.length) {
        this.$router.push({name: 'wait'})
        return
      } else {
        this.getTax()
        this.$router.push({name: 'additional-summary'})
        return
      }
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
.container {
  height: calc(100% - 6rem);
  min-height: calc(100% - 6rem);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .background {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: var(--grey-light-background);
  }
  .navigation, .view {
    width: 100%;
  }
  .navigation {display: none}
  @media (min-width: 992px) {
    .navigation {
      display: block;
    }
  }

  .navigation {
    background-color: var(--white);
    min-height: 100%;
    overflow: auto;
    .total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: 1.6rem;
      font-size: 1.6rem;
    }
    .price {
      margin-right: 2rem;
      color: var(--blue);
      font-weight: 700;
      letter-spacing: 0.0625rem;
      font-family: 'Futura Heavy';
      background-color: var(--grey-light-background);
      padding: 0.5rem 1rem;
      border-radius: 500px;
    }
    .categories {
      display: flex;
      flex-direction: column;
    }
    .categories:first-child {
      margin-top: 0;
    }
    .category__container {
      width: 100%;
      height: 7rem;
      display: flex;
      align-items: center;
      margin: 0.5rem 0;
    }
    .category {
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      margin-right: 1px;
      border-top: 1px solid var(--white);
      border-right: none;
      border-bottom: 1px solid var(--white);
      border-left: none;
      padding: 1rem 1rem 1rem 0;
      background-color: var(--white);
      box-shadow: var(--shadow-light);
      font-family: 'Futura Heavy';
      font-size: 1.5rem;
      font-weight: 700;
    }
    .border {
      display: inline-block;
      width: 0.6rem;
      height: 100%;
      background-color: var(--white);
    }
    .active .category {
      border-top: 1px solid var(--blue-light);
      border-bottom: 1px solid var(--blue-light);
      color: var(--blue);
    }
    .active .border {
      background-color: var(--blue);
    }
    .category > .left {
      display: flex;
      align-items: center;
    }
    .category > .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .count {
      width: 4rem;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.5rem 0.5rem 0.5rem 1.5rem;
      padding: 1rem;
      border-radius: 35%;
      font-family: 'Futura Heavy';
      color: var(--white);
      box-shadow: var(--shadow);
      &.grey {
        background-color: var(--grey-dark-background);
      }
      &.red {
        background-color: var(--red);
      }
      &.yellow {
        background-color: var(--yellow);
      }
      &.green {
        background-color: var(--green);
      }
    }
    .name {
      margin-left: 1rem;
      text-transform: uppercase;
    }
    .badge {
      margin: 0.5rem 2rem 0.5rem 0.5rem;
      padding: 0.5rem 1rem;
      background-color: var(--green-pastel);
      border-radius: 500px;
      font-family: 'Futura Heavy';
      color: var(--white);
      text-transform: uppercase;
    }
    .chevron {
      height: 1.5rem;
      max-height: 100%;
      margin-right: 1rem;
    }
  }

  .view {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
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
        @media (min-width: 992px) {
          .header {
            display: none;
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
        @media (max-width: 991px) {
          .cards {
            max-height: 0;
            overflow: hidden;
            transition: max-height .2s ease-out;
          }
        }
        .cards {}
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
        .cards {
          max-height: 10000vh;
          overflow: hidden;
          transition: max-height .2s ease-in;
        }
      }
    }
    .confirm {
      width: 100%;
      min-height: 5rem;
      margin-top: 1rem;
      padding: 1.5rem;
      color: var(--white);
      background-color: var(--blue);
      font-size: 1.5rem;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }
}
</style>

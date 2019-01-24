<template>
  <aside
  class="modal__container"
  :class="{'open' : modal}"
>
  <transition name="fade">
    <div
    v-if="modal"
    @click="closeService"
    class="overlay"
  >
      <transition name="fade">
        <div
          v-if="modal"
          class="modal"
          @click.stop
        >
          <div
            class="header"
          >
            <p>
              {{headerText}}
            </p>
            <button
              @click="closeService"
              class="close"
            >
              <div class="top"></div>
              <div class="bottom"></div>
            </button>
          </div>
          <div
            class="category"
            :class="categoryColor"
          >
            <div class="name">{{categoryName}}</div>
            <div class="price">
              <p>
                <span>
                  {{$t("total")}}:
                </span>
                <span class="total">{{total}}</span>
              </p>
            </div>
          </div>
          <div class="service">
            <div class="name">{{name}}</div>
            <div class="price">{{price}}</div>
          </div>
          <div class="images">
            <div class="badge">{{$t("new")}}</div>
            <img :src="service.imageUrl" alt="" class="image">
          </div>
          <p v-if="comment" class="description">{{comment}}</p>
          <p class="description">{{advisorComment}}</p>
          <nav class="navigation">
            <button
              @click="back()"
              class="back"
            >
              {{$t("back")}}
            </button>
            <button
              @click="next()"
              class="next"
            >
              {{$t("next")}}
            </button>
          </nav>
          <div class="buttons">
            <button
              class="button cta green"
              @click="approve()"
            >
              {{$t("approve")}}
            </button>
            <button
              @click="reject()"
              class="button skip"
            >
              {{$t("not_today")}}
            </button>
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
import { formatCurrency } from '@/mixins.js'

export default Vue.extend({
  data: () => ({
    open: false
  }),

  computed: {
    ...mapState([
      'customerConcernsLabel',
      'modal',
      'service'
    ]),
    ...mapGetters([
      'serviceById',
      'categoriesShownOnRoute',
      'categoryServices',
      'count'
    ]),
    services () {
      let services = []
      for (const category of this.categoriesShownOnRoute) {
        services = services.concat(this.categoryServices(category.id))
      }
      return services
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
    total () {
      return this.formatCurrency(this.$store.getters.total.inspection + this.$store.state.tax)
    },
    headerText () {
      if (this.service.category > '5') {
        return this.customerConcernsLabel
      } else {
        return this.$t('recommendation')
      }
    },
    name () {
      if (!this.service.parentServiceId) {
        return this.service.name
      } else {
        return this.serviceById(this.service.parentServiceId).name
      }
    },
    price () {
      if (this.service.price === 0 && this.service.price.laborMatrixPayment) {
        if (this.service.laborMatrixPayment !== 'NA' && this.service.laborMatrixPayment !== 'None') {
          return this.$t(`${this.service.laborMatrixPayment}`)
        } else {
          return this.formatCurrency(this.service.price)
        }
      } else {
        return this.formatCurrency(this.service.price)
      }
    },
    comment () {
      if (this.service.category > '5') {
        if (this.service.parentServiceId) {
          return this.serviceById(this.service.parentServiceId).comment
        } else {
          return this.service.comment
        }
      } else {
        return this.service.serviceAdvisorComments
      }
    },
    advisorComment () {
      if (this.service.category > '5') {
        return this.service.serviceAdvisorComments
      }
      return ''
    }
  },
  mixins: [formatCurrency],
  methods: {
    ...mapMutations([
      'closeService',
      'openReason',
      'selectService',
      'unselectService',
      'logEvent'
    ]),
    ...mapActions([
      'viewService'
    ]),
    approve () {
      this.selectService()
      this.logEvent(`Selected service ${this.service.id}`)
      this.next()
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
        if (this.count.fail || this.count.warining || this.count.concern) {
          this.$router.push({ name: 'summary' })
        } else {
          this.$router.push({ name: 'thanks' })
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
.modal__container {
  position: absolute;
  z-index: 1;
  height: calc(100% - var(--header-height));
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
    overflow: auto;
    margin: 0;
    @media (min-width: 992px) {
      max-height: calc(100% - 4rem);
      margin: 0 2rem;
    }
    background-color: var(--white);
    pointer-events: initial;
    .header {
      position: relative;
      display: none;
      justify-content: center;
      align-items: center;
      min-height: 6rem;
      border-bottom: 1px solid var(--grey-medium-background);
      @media (min-width: 992px) {
        display: flex;
      }
      .close {
        position: absolute;
        top: 2rem;
        right: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 2rem;
        height: 2rem;
        min-height: 2rem;
        min-width: 2rem;
        max-height: 2rem;
        max-width: 2rem;
        padding: 0;
        margin: 0;
        background-color: inherit;
        border: none;
        .top, .bottom {
          width: 3rem;
          height: 2px;
          min-width: 2rem;
          min-height: 2px;
          max-width: 2.2rem;
          max-height: 2px;
          border-radius: 500px;
          background-color: var(--blue);
        }
        .top {
          transform: rotate(45deg);
          transform-origin: -1px 4px;
        }
        .bottom {
          transform: rotate(-45deg);
          transform-origin: 0 -2px;
        }
      }
    }
    .category {
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
      color: var(--white);
      @media (min-width: 992px) {
        display: none;
      }
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
        align-items: center;
        border-right: 2px solid var(--white);
        padding: 1rem 0;
      }
      .price {
        flex: 100 100 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem 0;
      }
    }
    .service {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
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
    }
    .images {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      max-height: 50vh;
      padding: 1rem 0;
      background-color: var(--grey-light-background);
      .badge {
        position: absolute;
        top: 1rem;
        left: 2rem;
        margin: 0.5rem 2rem 0.5rem 0.5rem;
        padding: 0.5rem 1rem;
        background-color: var(--green-pastel);
        border-radius: 500px;
        font-family: 'Futura Heavy';
        color: var(--white);
        text-transform: uppercase;
      }
      .image {
        max-height: calc(50vh - 2rem);
        max-width: 100%;
      }
      .pagination {
        position: absolute;
        bottom: 2rem;
      }
    }
    .description {
      margin: 2rem;
    }
    .navigation {
      display: flex;
      justify-content: space-between;
      padding: 1rem 2rem;
      .back, .next {
        padding: 1rem;
        border: none;
        background-color: var(--white);
        font-size: 1.5rem;
        text-transform: uppercase;
      }
      .back {
        color: var(--blue);
      }
      .next {
        font-family: 'Futura Heavy';
        font-weight: 700;
      }
    }
    .buttons {
      margin: 0 2rem 2rem 2rem;
    }
  }
}
</style>
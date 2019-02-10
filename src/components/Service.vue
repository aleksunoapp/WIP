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
                class="header"
              >
                <p>
                  {{ $t('recommendation') }}
                </p>
                <button
                  class="close"
                  @click.stop="closeService"
                  @keydown.enter.prevent="closeService"
                >
                  <div class="top" />
                  <div class="bottom" />
                </button>
              </div>
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
                    {{ total }}
                  </span>
                </p>
              </div>
              <div ref="body"
class="body">
                <div class="service">
                  <p class="name">
                    {{ name }}
                  </p>
                  <p class="price">
                    {{ price }}
                  </p>
                </div>
                <div class="images">
                  <image-container
                    :src="service.imageUrl"
                    class="image"
                  />
                  <div
                    v-if="service.isHighlighted"
                    class="badge"
                  >
                    {{ $t("updated") }}
                  </div>
                </div>
                <p
                  v-if="comment"
                  class="description"
                >
                  {{ comment }}
                </p>
                <p class="description">
                  {{ advisorComment }}
                </p>
              </div>
            </div>
            <div class="footer">
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
              <div class="buttons">
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
import { focus, formatCurrency } from '@/mixins.js'
import ImageContainer from '@/components/ImageContainer.vue'

export default Vue.extend({
  components: {
    ImageContainer
  },
  mixins: [focus, formatCurrency],
  computed: {
    ...mapState([
      'modal',
      'service'
    ]),
    ...mapGetters([
      'serviceById',
      'categoriesShownOnRoute',
      'categoryServicesShownOnRoute',
      'count',
      'isPass',
      'previouslyUnapprovedServices'
    ]),
    services () {
      let services = []
      for (const category of this.categoriesShownOnRoute) {
        if (!this.isPass(category.id)) {
          services = services.concat(this.categoryServicesShownOnRoute(category.id))
        }
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
      let formatted = ''
      if (this.$route.name === 'services') {
        formatted = this.formatCurrency(this.$store.getters.total.inspection)
      }
      if (this.$route.name === 'additional-services') {
        formatted = this.formatCurrency(this.$store.getters.total.additional)
      }
      return formatted
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
      this.closeService()
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
            if (this.previouslyUnapprovedServices.length) {
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
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0px;
      .header {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 6rem;
        border-bottom: 1px solid var(--grey-medium-background);
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
        display: flex;
        flex-direction: column;
        overflow: scroll;
        .service {
          flex-shrink: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          .name {
            margin: 0;
            padding: 1rem;
          }
          .price {
            margin: 0;
            padding: 1rem;
            border-radius: 500px;
            color: var(--blue);
            font-weight: 700;
            letter-spacing: 0.0625rem;
            font-family: 'Futura Heavy';
            background-color: var(--grey-light-background);
          }
        }
        .images {
          position: relative;
          height: 200px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem 0;
          background-color: var(--grey-light-background);
          @media (min-height: 768px) {
            height: 300px;
          }
          .badge {
            position: absolute;
            top: 1rem;
            left: 2rem;
            padding: 0.5rem 1rem;
            background-color: var(--green-pastel);
            border-radius: 500px;
            font-family: 'Futura Heavy';
            color: var(--white);
            text-transform: uppercase;
          }
          .image {
            max-width: 100%;
          }
          .pagination {
            position: absolute;
            bottom: 2rem;
          }
        }
        .description {
          flex-shrink: 0;
          margin: 2rem;
        }
      }
    }
    .footer {
      box-shadow: 0px -4px 3px rgba(24,31,77,0.05);
      .navigation {
        display: flex;
        justify-content: space-between;
        padding: 0 2rem;
        @media (min-height: 768px) {
          padding: 1rem 2rem;
        }
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
        margin: 0 2rem;
        @media (min-height: 768px) {
          margin: 0 2rem 2rem 2rem;
        }
        .button {
          margin: 0;
          @media (min-height: 768px) {
            margin: 1rem 0;
          }
          &.skip {
            margin: 1rem 0;
          }
        }
      }
    }
  }
}
</style>

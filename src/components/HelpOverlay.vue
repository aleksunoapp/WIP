<template>
  <aside
    class="help"
    :class="{'open' : help}"
  >
    <transition name="fade">
      <div
        v-if="help"
        ref="overlay"
        class="overlay"
        @click="exitHelp"
      >
        <template
          v-if="page === 1"
        >
          <div
            class="category"
            :style="`top: ${category.style.top}px; left: ${category.style.left}px;`"
            @click.stop
          >
            <div class="desktop">
              <div
                class="category__container"
                :style="`width: ${category.style.width}px; height: ${category.style.height}px;`"
              >
                <div class="border" />
                <button
                  class="category"
                >
                  <div class="left">
                    <span
                      class="count"
                      :class="{
                        'red' : categoriesShownOnRoute[0].id === '1',
                        'yellow' : categoriesShownOnRoute[0].id === '2',
                        'green' : categoriesShownOnRoute[0].id === '3',
                        'grey' : categoriesShownOnRoute[0].id === '5',
                      }"
                    >
                      {{ categoryServicesShownOnRoute(categoriesShownOnRoute[0].id).length }}
                    </span>
                    <span class="name">
                      {{ categoriesShownOnRoute[0].name }}
                    </span>
                  </div>
                  <div class="right">
                    <span
                      v-if="categoryContainsHiglightedServices(categoriesShownOnRoute[0].id)"
                      class="badge"
                    >
                      {{ $t("updated") }}
                    </span>
                    <img
                      class="chevron"
                      src="@/assets/images/chevron-right.svg"
                      aria-hidden="true"
                    >
                  </div>
                </button>
              </div>
              <div class="bubble">
                <img
                  src="@/assets/images/triangle.svg"
                  class="triangle"
                >
                <p class="header">
                  {{ $t("review_recommendations") }}
                </p>
                <p class="description">
                  {{ $t("tap_each_category") }}
                </p>
              </div>
            </div>
            <div class="mobile">
              <div
                class="header"
                :class="{
                  'green' : categoriesShownOnRoute[0].id === '2',
                  'yellow' : categoriesShownOnRoute[0].id === '3',
                  'red' : categoriesShownOnRoute[0].id === '4',
                  'grey' : categoriesShownOnRoute[0].id === '5',
                }"
                :style="`width: ${category.style.width}px;`"
                @click="categoriesShownOnRoute[0].defaultExpended = !categoriesShownOnRoute[0].defaultExpended"
              >
                <div class="left">
                  <span
                    class="count"
                    :class="{
                      'green' : categoriesShownOnRoute[0].id === '2',
                      'yellow' : categoriesShownOnRoute[0].id === '3',
                      'red' : categoriesShownOnRoute[0].id === '4',
                      'grey' : categoriesShownOnRoute[0].id === '5',
                    }"
                  >
                    {{ categoryServicesShownOnRoute(categoriesShownOnRoute[0].id).length }}
                  </span>
                  <div class="name">
                    {{ categoriesShownOnRoute[0].name }}
                  </div>
                </div>
                <button
                  class="toggle"
                >
                  <img
                    class="chevron"
                    src="@/assets/images/chevron-down.svg"
                    aria-hidden="true"
                  >
                </button>
              </div>
              <div class="bubble">
                <img
                  src="@/assets/images/triangle.svg"
                  class="triangle"
                >
                <p class="header">
                  {{ $t("review_recommendations") }}
                </p>
                <p class="description">
                  {{ $t("tap_each_category") }}
                </p>
              </div>
            </div>
          </div>
        </template>
        <template
          v-if="page === 2"
        >
          <div
            class="approve"
            :style="`top: ${approve.style.top}px; left: ${approve.style.left}px;`"
            @click.stop
          >
            <input
              id="help-checkbox"
              v-model="approve.checked"
              type="checkbox"
              class="approve"
              @click.stop
            >
            <label
              for="help-checkbox"
              class="checkbox"
              @click.stop
            >
              {{ $t("approve") }}
              <div class="box">
                <img
                  src="@/assets/images/check.svg"
                  alt="check"
                  class="check"
                >
              </div>
            </label>
            <div class="bubble">
              <img
                src="@/assets/images/triangle.svg"
                class="triangle"
              >
              <p class="header">
                {{ $t("approve_recommendations") }}
              </p>
              <p class="description">
                {{ $t("tap_the_checkbox") }}
              </p>
            </div>
          </div>
        </template>
        <template
          v-if="page === 3"
        >
          <div
            class="details"
            :style="`top: ${details.style.top}px; left: ${details.style.left}px; width: ${details.style.width}px;`"
            @click.stop
          >
            <div class="images">
              <image-container
                :src="service.imageUrl"
                class="image"
              />
              <div class="badge">
                {{ $t("updated") }}
              </div>
            </div>
            <div class="bubble">
              <img
                src="@/assets/images/triangle.svg"
                class="triangle"
              >
              <p class="header">
                {{ $t("view_more_details") }}
              </p>
              <p class="description">
                {{ $t("tap_on_the_images") }}
              </p>
            </div>
          </div>
        </template>
        <template
          v-if="page === 4"
        >
          <div
            class="summary"
            :style="`top: ${summary.style.top}px; left: ${summary.style.left}px; width: ${summary.style.width}px;`"
            @click.stop
          >
            <div class="card">
              <div class="row">
                <p class="item">
                  {{ $t("previously_approved_services") }}
                  <span class="taxes">
                    {{ $t("taxes_and_fees_included") }}
                  </span>
                </p>
                <p class="price">
                  {{ serviceTotal }}
                </p>
              </div>
              <div class="divider" />
              <div class="row bold">
                <p class="item">
                  {{ $t("estimate") }}
                </p>
                <p class="price">
                  {{ inspectionTotal }}
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
            <div class="bubble">
              <img
                src="@/assets/images/triangle.svg"
                class="triangle"
              >
              <p class="header">
                {{ $t("approve_estimate") }}
              </p>
              <p class="description">
                {{ $t("continue_to_checkout") }}
              </p>
            </div>
          </div>
        </template>
        <template
          v-if="page === 5"
        >
          <div
            class="more"
            @click.stop
          >
            <div class="bubble">
              <img
                src="@/assets/images/triangle.svg"
                class="triangle"
              >
              <p class="header">
                {{ $t("more_help") }}
              </p>
              <p class="description">
                {{ $t("to_get_more_help") }}
              </p>
            </div>
          </div>
        </template>

        <div
          v-if="page === 1"
          class="spacer"
          :style="`min-height: ${approve.style.bottom + 300}px;`"
        />
        <div
          v-if="page === 2"
          class="spacer"
          :style="`min-height: ${category.style.bottom + 200}px;`"
        />
        <div
          v-if="page === 3"
          class="spacer"
          :style="`min-height: ${details.style.bottom + 200}px;`"
        />
        <div
          v-if="page === 4"
          class="spacer"
          :style="`min-height: ${summary.style.bottom + 300}px;`"
        />
        <div
          v-if="page === 5"
          class="spacer"
          :style="`min-height: 300px;`"
        />
        <div v-else />
        <div class="bottom">
          <pagination
            class="pagination"
            :total="5"
            :current="page"
          />
          <button
            ref="button"
            class="button cta"
            @click.stop="next()"
          >
            {{ buttonText }}
          </button>
          <button
            class="button skip"
            @click.stop="exitHelp()"
          >
            {{ $t("dismiss") }}
          </button>
        </div>
      </div>
    </transition>
  </aside>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import ImageContainer from '@/components/ImageContainer.vue'
import Pagination from '@/components/Pagination.vue'
import { formatCurrency } from '@/mixins.js'

export default Vue.extend({
  components: {
    ImageContainer,
    Pagination
  },
  mixins: [formatCurrency],
  data: () => ({
    start: {
      route: '',
      scrollTop: 0
    },
    page: 1,
    approve: {
      show: false,
      checked: false,
      style: {
        top: 0,
        bottom: 0,
        left: 0
      }
    },
    category: {
      show: false,
      style: {
        top: 0,
        bottom: 0,
        left: 0,
        width: 0,
        height: 0
      }
    },
    details: {
      show: false,
      style: {
        top: 0,
        bottom: 0,
        left: 0,
        width: 0,
        height: 0
      }
    },
    summary: {
      show: false,
      style: {
        top: 0,
        bottom: 0,
        left: 0,
        width: 0,
        height: 0
      }
    }
  }),
  computed: {
    ...mapState([
      'help',
      'service',
      'reason'
    ]),
    ...mapGetters([
      'categoriesShownOnRoute',
      'categoryServicesShownOnRoute',
      'categoryContainsHiglightedServices'
    ]),
    buttonText () {
      return this.page < 5 ? this.$t('next') : this.$t('got_it')
    },
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
    },
    routeName () {
      return this.$route.name
    }
  },
  watch: {
    help (open) {
      if (open) {
        this.closeDrawer()
        this.closeService()
        if (this.reason) {
          this.selectService()
          this.closeReason()
        }
        window.addEventListener('resize', this.exitHelp)
        const scrollContainer = document.querySelector('.view')
        if (scrollContainer) { this.start.scrollTop = scrollContainer.scrollTop }
        this.start.route = this.$route.name
        this.setPage(1)
        this.$nextTick(function () {
          this.$refs.button.focus()
        })
      } else {
        this.exitHelp()
      }
    },
    routeName (name) {
      if (this.help) {
        if (!['additional-services', 'wait-services', 'services', 'summary'].includes(name)) {
          this.closeHelp()
        }
      }
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.exitHelp)
  },
  methods: {
    next () {
      if (this.page < 5) {
        this.logEvent(`Finished viewing help page ${this.page}`)
        this.setPage(this.page + 1)
        this.logEvent(`Started viewing help page ${this.page}`)
      } else this.exitHelp()
    },
    ...mapMutations([
      'closeHelp',
      'closeService',
      'closeDrawer',
      'logEvent',
      'selectService',
      'closeReason'
    ]),
    ...mapActions(['viewService']),
    exitHelp () {
      if (this.help) {
        this.logEvent(`Finished viewing help page ${this.page}`)
        this.closeService()
        this.$router.replace({ name: this.start.route })
        this.closeHelp()
        document.querySelector('#route.container').classList.remove('overflow-y-hidden')
        window.removeEventListener('resize', this.exitHelp)
        setTimeout(() => {
          const scrollContainer = document.querySelector('.view')
          if (scrollContainer) { scrollContainer.scrollTo(0, this.start.scrollTop) }
        }, 600)
      }
    },
    setPage (page) {
      if (page === undefined) {
        page = this.page
      }

      if (this.$refs.overlay) {
        this.$refs.overlay.scrollTo(0, 0)
      }

      if (this.page === 1 && (page !== 1 || page !== 2)) {
        this.$router.replace({ name: 'services' })
      }
      if (this.page === 2 && (page !== 1 || page !== 2)) {
        this.$router.replace({ name: 'services' })
      }
      if (this.page === 4 && page !== 4) {
        this.$router.replace({ name: 'summary' })
      }
      if (this.page === 5 && page !== 5) {
        this.$router.replace({ name: 'summary' })
      }

      const listScrollContainer = document.querySelector('#list-scroll-container')

      if (page === 1) {
        if (listScrollContainer) {
          const category = listScrollContainer.querySelector('.category')
          if (category) {
            category.classList.add('open')
          }
          listScrollContainer.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
          })
        }

        this.$router.replace({ name: 'services' })

        if (window.innerWidth > 992) {
          const category = document.querySelector('.category__container')

          if (!category) {
            this.category.show = false
          } else {
            this.category.style.top = category.offsetTop
            this.category.style.bottom = category.offsetTop + category.offsetHeight
            this.category.style.left = category.offsetLeft
            this.category.style.width = category.offsetWidth
            this.category.style.height = category.offsetHeight
            this.category.show = true
          }
        } else {
          const scrollContainer = document.querySelector('.view')
          if (scrollContainer) { scrollContainer.scrollTo(0, 0) }
          const category = document.querySelector('.category .header')

          if (!category) {
            this.category.show = false
          } else {
            this.category.style.top = category.offsetTop
            this.category.style.bottom = category.offsetTop + category.offsetHeight
            this.category.style.left = category.offsetLeft
            this.category.style.width = category.offsetWidth
            this.category.style.height = category.offsetHeight
            this.category.show = true
          }
        }
        this.page = page
      }

      if (page === 2) {
        const input = document.querySelector('input[type="checkbox"]')
        const label = document.querySelector('.checkbox')

        if (!input || !label) {
          this.approve.show = false
        } else {
          if (listScrollContainer) {
            listScrollContainer.scrollTo({
              left: 0,
              top: label.offsetTop + 30,
              behavior: 'smooth'
            })
          }

          this.approve.checked = input.checked
          let top = 20
          this.approve.style.top = top
          this.approve.style.left = label.offsetLeft + listScrollContainer.offsetLeft
          this.approve.show = true
        }
        this.page = page
      }

      if (page === 3) {
        let service
        // find first service with image
        for (const category of this.categoriesShownOnRoute) {
          if (category.id < '5') {
            if (typeof category.serviceCategoryType === 'string') {
              if (category.serviceCategoryType.toLowerCase() !== 'pass') {
                service = this.categoryServicesShownOnRoute(category.id)[0]
              }
            }
          }
        }
        if (!service) {
          service = this.categoryServicesShownOnRoute(this.categoriesShownOnRoute[0].id)[0]
        }
        this.viewService(service)

        setTimeout(() => {
          const details = document.querySelector('.images')
          if (!details) {
            this.details.show = false
          } else {
            this.details.style.top = details.offsetTop
            this.details.style.left = details.offsetLeft
            this.details.style.bottom = details.offsetTop + details.offsetHeight
            this.details.style.width = details.offsetWidth
            this.details.show = true
          }
          this.page = page
        }, 600)
      }

      if (page === 4) {
        this.$router.replace({ name: 'summary' })

        document.querySelector('#route.container').classList.add('overflow-y-hidden')
        setTimeout(() => {
          const summary = document.querySelector('#summary')
          if (!summary) {
            this.summary.show = false
          } else {
            this.summary.style.top = summary.offsetTop
            this.summary.style.bottom = summary.offsetTop + summary.offsetHeight
            this.summary.style.left = summary.offsetLeft
            this.summary.style.width = summary.offsetWidth
            this.summary.show = true
            this.page = page
          }
        }, 600)
      }

      if (page === 5) {
        this.page = page
      }
    }
  }
})
</script>

<style scoped lang="scss">
.help {
  position: absolute;
  bottom: 0;
  z-index: 5;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  pointer-events: none;
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  pointer-events: initial;
  background-color: var(--grey-transparent);
  .category {
    position: absolute;
    .desktop {
      display: none;
    }
    .mobile {
      @media (min-width: 992px) {
        display: none;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        transition: border-bottom-left-radius .2s ease-out;
        background-color: var(--white);
        box-shadow: 0 3px 7px 0 rgba(42,55,71,0.15);
        color: var(--blue);
        font-family: 'Futura Heavy';
        font-weight: 700;
        letter-spacing: 1px;
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
          .name {
            text-transform: uppercase;
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
            transform: rotate(180deg);
            max-width: 2rem;
          }
        }
        &.grey {
          border-left: 6px solid var(--grey-dark-background);
          .count {
            background-color: var(--grey-dark-background);
          }
        }
        &.green {
          border-left: 6px solid var(--green);
          .count {
            background-color: var(--green);
          }
        }
        &.yellow {
          border-left: 6px solid var(--yellow);
          .count {
            background-color: var(--yellow);
          }
        }
        &.red {
          border-left: 6px solid var(--red);
          .count {
            background-color: var(--red);
          }
        }
      }
      .bubble {
        position: absolute;
        left: 0;
        min-width: calc(var(--unit) * 30);
        margin: calc(var(--unit) * 4) var(--unit) var(--unit) var(--unit);
        padding: var(--unit);
        border-radius: 5px;
        background-color: var(--white);
        text-align: center;
        .triangle {
          position: absolute;
          top: -1rem;
          left: 6rem;
          width: 4rem;
          height: 1.5rem;
          object-fit: contain;
        }
        .header {
          box-shadow: none;
          text-align: center;
          color: var(--black);
          font-family: 'Futura Heavy';
          font-weight: 700;
        }
      }
    }
    @media (min-width: 992px) {
      .desktop {
        display: block;
        width: 100%;
        background-color: var(--white);
        .category__container {
          display: flex;
          align-items: center;
          .category {
            position: relative;
            width: 100%;
            height: 100%;
            display: inline-flex;
            justify-content: space-between;
            align-items: center;
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
          }
          .count.grey {
            background-color: var(--grey-dark-background);
          }
          .count.red {
            background-color: var(--red);
          }
          .count.yellow {
            background-color: var(--yellow);
          }
          .count.green {
            background-color: var(--green);
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
        .bubble {
          position: absolute;
          left: 0;
          min-width: calc(var(--unit) * 30);
          margin: calc(var(--unit) * 4) var(--unit) var(--unit) var(--unit);
          padding: var(--unit);
          border-radius: 5px;
          background-color: var(--white);
          text-align: center;
          .triangle {
            position: absolute;
            top: -1rem;
            left: 3rem;
            width: 4rem;
            height: 1.5rem;
            object-fit: contain;
          }
          .header {
            font-family: 'Futura Heavy';
            font-weight: 700;
          }
        }
      }
    }
  }
  .approve {
    position: absolute;
    padding: var(--unit);
    background-color: var(--white);
    input {
      display: none;
    }
    .checkbox {
      display: flex;
      align-items: center;
      transition: all .2s ease-in;
      text-transform: uppercase;
      color: var(--grey-text);
      .box {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 2.5rem;
        height: 2.5rem;
        margin-left: 1rem;
        border-radius: 3px;
        background-color: var(--grey-medium-background);
        .check {
          max-height: 100%;
          max-width: 100%;
          padding: 0.3rem;
          opacity: 0;
        }
      }
    }
    input:checked ~ .checkbox {
      color: var(--green);
      .box {
        background-color: var(--green);
        .check {
          opacity: 1;
        }
      }
    }
    .bubble {
      position: absolute;
      right: 0;
      min-width: calc(var(--unit) * 30);
      margin: calc(var(--unit) * 4) var(--unit) var(--unit) var(--unit);
      padding: var(--unit);
      border-radius: 5px;
      background-color: var(--white);
      text-align: center;
      .triangle {
        position: absolute;
        top: -1rem;
        right: 3rem;
        width: 4rem;
        height: 1.5rem;
        object-fit: contain;
      }
      .header {
        font-family: 'Futura Heavy';
        font-weight: 700;
      }
    }
  }
  .details {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    .images {
      position: relative;
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60px;
      max-height: 50vh;
      padding: 1rem 0;
      background-color: var(--grey-light-background);
      @media (min-height: 768px) {
        height: 300px;
      }
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
        max-width: 100%;
      }
    }
    .bubble {
      position: relative;
      left: 0;
      min-width: calc(var(--unit) * 30);
      margin: calc(var(--unit) * 4) var(--unit) var(--unit) var(--unit);
      padding: var(--unit);
      border-radius: 5px;
      background-color: var(--white);
      text-align: center;
      .triangle {
        position: absolute;
        top: -1rem;
        left: 6rem;
        width: 4rem;
        height: 1.5rem;
        object-fit: contain;
      }
      .header {
        box-shadow: none;
        text-align: center;
        color: var(--black);
        font-family: 'Futura Heavy';
        font-weight: 700;
      }
    }
  }
  .summary {
    position: absolute;
    .card {
      padding: 1rem;
      background-color: var(--white);
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .taxes {
          display: block;
          text-transform: uppercase;
          font-size: 0.7em;
        }
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
    .bubble {
      position: relative;
      left: 0;
      min-width: calc(var(--unit) * 30);
      margin: calc(var(--unit) * 4) var(--unit) var(--unit) var(--unit);
      padding: var(--unit);
      border-radius: 5px;
      background-color: var(--white);
      text-align: center;
      .triangle {
        position: absolute;
        top: -1rem;
        left: 6rem;
        width: 4rem;
        height: 1.5rem;
        object-fit: contain;
      }
      .header {
        box-shadow: none;
        text-align: center;
        color: var(--black);
        font-family: 'Futura Heavy';
        font-weight: 700;
      }
    }
  }
  .more {
    position: absolute;
    top: 1rem;
    left: 1rem;
    .bubble {
      position: relative;
      top: 1rem;
      left: 0;
      min-width: calc(var(--unit) * 30);
      padding: var(--unit);
      border-radius: 5px;
      background-color: var(--white);
      text-align: center;
      .triangle {
        position: absolute;
        top: -1rem;
        left: 0;
        width: 4rem;
        height: 1.5rem;
        object-fit: contain;
      }
      .header {
        box-shadow: none;
        text-align: center;
        color: var(--black);
        font-family: 'Futura Heavy';
        font-weight: 700;
      }
    }
  }
  .spacer {
    width: 100%;
  }
  .bottom {
    width: 100%;
    flex-shrink: 0;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .pagination {
      margin-bottom: 1rem;
    }
    .skip {
      color: var(--white);
    }
  }
}
</style>

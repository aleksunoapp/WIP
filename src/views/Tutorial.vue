<template>
  <div class="background">
    <main class="contents">
      <transition
        name="fade"
        mode="out-in"
      >
        <span
          v-if="page === 1"
          class="transition__container"
        >
          <img
            class="image"
            src="@/assets/images/review.svg"
            aria-hidden="true"
          >
          <h2
            class="subheader"
          >
            {{ $t("review") }}
          </h2>
          <p
            class="description"
          >
            {{ $t(`description${page}`) }}
          </p>
        </span>
        <span
          v-if="page === 2"
          class="transition__container"
        >
          <img
            class="image"
            src="@/assets/images/approve.svg"
            aria-hidden="true"
          >
          <h2
            class="subheader"
          >
            {{ $t("approve") }}
          </h2>
          <p
            class="description"
          >
            {{ $t(`description${page}`) }}
          </p>
        </span>
        <span
          v-if="page === 3"
          class="transition__container"
        >
          <img
            class="image"
            src="@/assets/images/pickup.svg"
            aria-hidden="true"
          >
          <h2
            class="subheader"
          >
            {{ $t("pickup") }}
          </h2>
          <p
            class="description"
          >
            {{ $t(`description${page}`) }}
          </p>
        </span>
      </transition>
      <pagination
        class="pagination"
        :total="3"
        :current="page"
        @page="showPage"
      />
      <button
        class="button cta"
        @click="next()"
      >
        {{ $t("next") }}
      </button>
      <transition
        name="fade"
        mode="out-in"
      >
        <button
          v-if="page !== 3"
          class="button skip"
          @click="$router.go(-1)"
        >
          {{ $t("skip") }}
        </button>
      </transition>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import Pagination from '@/components/Pagination.vue'

export default Vue.extend({
  components: {
    Pagination
  },
  data: () => ({
    page: 1
  }),
  created () {
    this.logEvent(`Started viewing tutorial page ${this.page}`)
  },
  beforeDestroy () {
    this.logEvent(`Finished viewing tutorial page ${this.page}`)
  },
  methods: {
    next () {
      if (this.page < 3) {
        this.logEvent(`Finished viewing tutorial page ${this.page}`)
        this.page++
        this.logEvent(`Started viewing tutorial page ${this.page}`)
      } else {
        this.$router.go(-1)
      }
    },
    showPage (i) {
      this.page = i
    },
    ...mapMutations([
      'logEvent'
    ])
  }
})
</script>

<style scoped lang="scss">
.background {
  width: 100%;
  min-height: 100%;
  background-color: var(--grey-light-background);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.contents {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .image {
    height: 10rem;
    margin: 2rem 0;
    object-fit: contain;
    @media (min-width: 768px) {
      margin: 5rem 1rem;
    }
  }
  .sub-header {
    font-weight: bold;
    font-size: 1.5rem;
  }
  .pagination {
    margin-bottom: 1rem;
  }
  .description {
    min-height: 4rem;;
    margin: 2rem 1rem;
    text-align: center;
  }
  .transition__container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>

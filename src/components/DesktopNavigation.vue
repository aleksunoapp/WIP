<template>
  <div class="navigation">
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
    <nav class="categories">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category__container"
        :class="{'active' : activeCategory && category.id === activeCategory.id}"
      >
        <div class="border" />
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
              {{ categoryServicesShownOnRoute(category.id).length }}
            </span>
            <span class="name">
              {{ category.name }}
            </span>
          </div>
          <div class="right">
            <span
              v-if="$route.name === 'additional-services' && categoryContainsHiglightedServices(category.id)"
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
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'DesktopNavigation',
  props: {
    categories: {
      type: Array,
      default: () => [],
      required: true
    },
    displayTotal: {
      type: String,
      default: () => '',
      required: true
    },
    countTotal: {
      type: Number,
      default: () => 0,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'categoryServicesShownOnRoute',
      'categoryContainsHiglightedServices'
    ]),
    ...mapState([
      'activeCategory'
    ])
  },
  methods: {
    scrollToCategory (category) {
      this.$emit('scroll', category)
    }
  }
}
</script>

<style lang="scss" scoped>
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
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 1.6rem;
    .text {
      display: inline;
    }
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
  font-size: 1em;
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
    text-align: left;
    text-transform: uppercase;
  }
}
.category > .right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
</style>

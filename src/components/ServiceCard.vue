<template>
  <div
    class="card"
  >
    <div
      class="contents"
      @click="openService(service)"
      @keyup.enter="logger($event, service)"
      tabindex="0"
      role="button"
      ref="card"
    >
      <div class="left">
        <img :src="service.imageUrl" class="image">
        <!-- <p class="count">{{service.imageUrl.length}}</p> -->
      </div>
      <div class="right">
        <div class="top">
          <p class="name">
            <span
              v-if="service.isHighlighted"
              class="badge"
            >
              {{$t("new")}}
            </span>
            {{service.name}}
          </p>
          <div
            v-if="service.category > '5'"
            class="description"
          >
            <img :src="service.iconUrl" :aria-label="alt(service)" class="dot">
            <p class="text">
              {{recommendationLabel(service)}}
            </p>
          </div>
        </div>
        <div
          v-if="getServiceDisplayPrice(service) !== false"
          class="bottom"
        >
          <div class="price">{{getServiceDisplayPrice(service)}}</div>
            <input
              type="checkbox"
              :id="service.id"
              class="approve"
              v-model="service.isSelected"
              @change="checkboxToggled($event, service)"
              ref="input"
              @click.stop
            >
            <label
              tabindex="0"
              :for="service.id"
              class="checkbox"
              @click.stop
              @keyup.enter="$refs.input.click()"
            >
              {{$t("approve")}}
              <div class="box">
                <img src="@/assets/images/check.svg" alt="check" class="check">
              </div>
            </label>
        </div>
      </div>
    </div>
    <div class="divider"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations} from 'vuex'
import { formatCurrency, getServiceDisplayPrice } from '@/mixins.js'

export default {
  name: 'ServiceCard',
  props: {
    category: {
      type: Object,
      required: true,
      default: () => {}
    },
    service: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  mixins: [
    formatCurrency,
    getServiceDisplayPrice
  ],
  methods: {
    logger(a, b) {
      console.log({a, b})
    },
    ...mapActions([
      'viewService'
    ]),
    ...mapMutations([
      'setService',
      'openReason',
      'logEvent',
      'setFocusable'
    ]),
    openService (service) {
      if (!(typeof service.serviceCategoryType === 'string' && service.serviceCategoryType.toLowerCase() === 'pass')) {
        this.viewService(service)
        this.setFocusable({name: 'card', node: this.$refs.card})
      }
    },
    alt (service) {
      const statuses = {
        '6': 'red status light',
        '7': 'yellow status light',
        '8': 'grey status light',
        '9': 'grey status light'
      }
      return statuses[service.category] || 'status indicator'
    },
    recommendationLabel (service) {
      return service.category < '8' ? this.$t('problem_identified') : this.$t('no_issue_found')
    },
    checkboxToggled (event, service) {
      event.stopPropagation()
      if (!service.isSelected) {
        this.setService(service)
        this.openReason()
        this.logEvent(`Unselected service ${this.service.id}`)
      } else {
        this.logEvent(`Selected service ${this.service.id}`)
      }
    }
  },
}
</script>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  .contents {
    display: flex;
    border: none;
    background-color: var(--white);
    padding: 0;
    .left {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 10rem;
      height: 10rem;
      .image {
        width: 10rem;
        height: 10rem;
        object-fit: cover;
        border-radius: 3px;
      }
      .count {
        position: absolute;
        margin: 0;
        padding: 0.2rem 0.5rem;
        background-color: var(--grey-dark-background);
        border-radius: 500px;
        font-family: 'Futura Heavy';
        color: var(--white);
      }
    }
    .right {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 1rem;
      .top {
        display: flex;
        flex-direction: column;
        .name, .description {
          margin: 0;
        }
        .name {
          margin-bottom: 0.5rem;
          .badge {
            float: right;
            margin: 0 0 1rem 2rem;
            padding: 0.5rem 1rem;
            background-color: var(--green-pastel);
            border-radius: 500px;
            font-family: 'Futura Heavy';
            text-transform: uppercase;
            color: var(--white);
          }
        }
        .description {
          display: flex;
          align-items: center;
          .dot {
            max-width: 1rem;
            max-height: 1rem;
            object-fit: contain;
          }
          .text {
            margin: 0 0 0 1rem;
          }
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        .price {
          color: var(--blue);
          font-weight: 700;
          letter-spacing: 0.0625rem;
          font-family: 'Futura Heavy';
          background-color: var(--grey-light-background);
          padding: 0.5rem 1rem;
          border-radius: 500px;
        }
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
      }
    }
  }
  .divider {
    width: 100%;
    height: 2px;
    margin: 1rem 0;
    background-color: var(--grey-light-background)
  }
}
.card:first-child {
  padding-top: 1rem;
}
.card:last-child {
  padding-bottom: 1rem;
  .divider {
    display: none;
  }
}
</style>

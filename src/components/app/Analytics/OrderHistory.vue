<template>
  <div>
    <div class="row">
      <div class="col-xs-12">
        <div
          v-show="alert"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click="clearError('alert')"
          />
          <span>{{ alert }}</span>
        </div>
      </div>
    </div>

    <div
      ref="searchRow"
      class="row"
    >
      <div class="col-xs-12">
        <div class="controls">
          <el-date-picker
            v-model="fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="true"
            placeholder="From"
            class="date-from"
          />
          <el-date-picker
            v-model="toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="true"
            placeholder="To"
            class="date-to"
          />
          <el-select
            v-model="locationId"
            filterable
            clearable
            placeholder="Select store"
            class="store"
          >
            <el-option
              v-for="store in stores"
              :key="store.id"
              :label="store.display_name"
              :value="store.id"
            />
          </el-select>
          <el-input
            v-model="externalId"
            placeholder="Order ID"
            class="order-id"
          />
          <el-button
            type="primary"
            :loading="loading"
            class="search"
            @click="validateData()"
          >
            Search
          </el-button>
        </div>
      </div>
    </div>

    <div
      v-show="!loading && orders.length"
      class="row"
    >
      <div
        class="
          col-xs-12
          margin-top-20
          margin-bottom-20
        "
      >
        <el-dropdown
          trigger="click"
          size="mini"
          @command="changeSortBy"
        >
          <el-button size="mini">
            Sort by
            <span>
              <i
                v-if="sortBy === 'ASC'"
                class="fa fa-sort-alpha-asc"
              />
              <i
                v-if="sortBy === 'DESC'"
                class="fa fa-sort-alpha-desc"
              />
            </span>
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="ASC">
              <i class="fa fa-sort-alpha-asc" />
            </el-dropdown-item>
            <el-dropdown-item command="DESC">
              <i class="fa fa-sort-alpha-desc" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <page-results
          class="pull-right"
          :total-results="total"
          :active-page="page"
          @pageResults="changePerPage"
        />
      </div>

      <div class="col-xs-12">
        <table class="table table-striped table-advance">
          <thead>
            <tr>
              <th>
                ID
              </th>
              <th>
                Date
              </th>
              <th>
                Status
              </th>
              <th>
                Amount
              </th>

              <th v-if="location">
                Store
              </th>
              <th v-if="orderItems">
                Items
              </th>
              <th v-if="orderItemModifier">
                Modifiers
              </th>
              <th v-if="orderModifierOption">
                Options
              </th>
              <th v-if="user">
                Customer
              </th>
              <th />
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
            >
              <td class="align-middle">
                {{ order.external_id }}
              </td>
              <td class="align-middle">
                {{ order.created_at.substring(0, 10) }}
              </td>
              <td class="align-middle">
                <span
                  class="label label-sm"
                  :class="{
                    'label-info' : order.status === 'pending',
                    'label-warning' : order.status === 'submitted',
                    'label-success' : order.status === 'completed',
                    'label-danger' : order.status === 'overdue',
                    'label-danger' : order.status === 'cancelled' || order.status === 'refunded'
                  }"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="align-middle">
                {{ order.total }}
              </td>

              <td
                v-if="location"
                class="align-middle"
              >
                {{ order.location_name }}
              </td>
              <td
                v-if="orderItems"
                class="align-middle"
              >
                <ul class="list-unstyled">
                  <li
                    v-for="item in order.order_items"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </li>
                </ul>
              </td>
              <td
                v-if="orderItemModifier"
                class="align-middle"
              >
                <ul class="list-unstyled">
                  <li
                    v-for="modifier in order.order_modifiers"
                    :key="modifier.id"
                  >
                    {{ modifier.name }}
                  </li>
                </ul>
              </td>
              <td
                v-if="orderModifierOption"
                class="align-middle"
              >
                <ul class="list-unstyled">
                  <li
                    v-for="option in order.order_options"
                    :key="option.id"
                  >
                    {{ option.name }}
                  </li>
                </ul>
              </td>
              <td
                v-if="user"
                class="align-middle line-height-2"
              >
                {{ order.user.first_name }} {{ order.user.last_name }}<br>
                {{ order.user.email }}<br>
                {{ formatPhone(order.user.phone) }}
              </td>
              <td>
                <button
                  class="btn btn-sm grey-salsa btn-outline"
                  :disabled="orderBeingViewed.id === order.id && orderBeingViewed.loading"
                  @click="showViewOrderModal(order)"
                >
                  <span
                    v-if="!(
                      orderBeingViewed.id === order.id &&
                      orderBeingViewed.loading
                    )"
                  >
                    View
                  </span>
                  <i
                    v-show="orderBeingViewed.id === order.id && orderBeingViewed.loading"
                    class="fa fa-spinner fa-pulse fa-fw"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-show="lastPage > 1"
        class="col-xs-12"
      >
        <pagination
          :passed-page="page"
          :num-pages="lastPage"
          @activePageChange="changePage"
        />
      </div>
    </div>

    <div
      v-show="loading"
      class="row"
    >
      <div class="col-xs-12 relative-block">
        <loading-screen
          :show="loading"
          class="margin-top-20"
        />
      </div>
    </div>

    <div
      v-show="!loading && !orders.length"
      class="row"
    >
      <div class="col-xs-12">
        <no-results
          :custom="noResults"
          :show="noResults"
          :text="noResults"
        />
      </div>
    </div>

    <view-order
      v-if="viewOrderModalDisplayed"
      :order="orderBeingViewed"
      @closeViewOrderModal="closeViewOrderModal"
    />
  </div>
</template>

<script>
import AnalyticsFunctions from '@/controllers/Analytics'
import NoResults from '@/components/modules/NoResults'
import PageResults from '@/components/modules/PageResults'
import Pagination from '@/components/modules/Pagination'
import LoadingScreen from '@/components/modules/LoadingScreen'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import UsersFunctions from '@/controllers/Users'
import ViewOrder from '@/components/app/UserManager/ViewOrder'

export default {
  name: 'OrderHistory',
  components: {
    NoResults,
    PageResults,
    LoadingScreen,
    Pagination,
    ViewOrder
  },
  data: function () {
    return {
      // search filters
      locationId: '',
      fromDate: '',
      toDate: '',
      externalId: '',
      // results contents
      orderItems: 0,
      orderItemModifier: 0,
      orderModifierOption: 0,
      user: 1,
      location: 1,
      // UI
      loading: false,
      alert: '',
      noResults: 'Search for something',
      validations: {
        locationId: '',
        fromDate: '',
        toDate: '',
        externalId: ''
      },
      // API data
      payload: {},
      orders: [],
      // pagination
      total: 0,
      lastPage: 1,
      page: 1,
      perPage: 25,
      sortBy: 'DESC',
      viewOrderModalDisplayed: false,
      orderBeingViewed: {}
    }
  },
  computed: {
    stores: function () {
      let combined = [...this.$root.storeLocations, this.$root.activeLocation]
      return combined.sort((a, b) => a.display_name > b.display_name)
    }
  },
  mounted () {
    let today = new Date()
    let yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    let yearFrom = yesterday.getFullYear()
    let monthFrom = yesterday.getMonth() + 1
    if (monthFrom < 10) {
      monthFrom = '0' + monthFrom
    }
    let dayFrom = yesterday.getDate()
    if (dayFrom < 10) {
      dayFrom = '0' + dayFrom
    }

    this.fromDate = `${yearFrom}-${monthFrom}-${dayFrom}`

    let yearTo = today.getFullYear()
    let monthTo = today.getMonth() + 1
    if (monthTo < 10) {
      monthTo = '0' + monthTo
    }
    let dayTo = today.getDate()
    if (dayTo < 10) {
      dayTo = '0' + dayTo
    }

    this.toDate = `${yearTo}-${monthTo}-${dayTo}`

    this.searchOrders()
  },
  methods: {
    /**
     * To format a phone number
     * @function
     * @param {string} phone - The phone number to format
     * @returns {string} The formatted phone string
     */
    formatPhone (phone) {
      try {
        let digits = phone.replace(/\D/g, '')
        return (
          digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
        )
      } catch (err) {
        return 'n/a'
      }
    },
    /**
     * To change the current page
     * @function
     * @param {number} page - The new page number
     * @returns {undefined}
     */
    changePage (page) {
      if (this.page !== page) {
        this.page = page
        this.searchOrders()
      }
    },
    /**
     * To change the number of results displayed on a page
     * @function
     * @param {number} perPage - The new number of results per page
     * @returns {undefined}
     */
    changePerPage (perPage) {
      if (this.perPage !== perPage) {
        this.page = 1
        this.perPage = perPage
        this.searchOrders()
      }
    },
    /**
     * To resort the results
     * @function
     * @param {string} order - ASC or DESC
     * @returns {undefined}
     */
    changeSortBy (order) {
      if (this.sortBy !== order) {
        this.sortBy = order
        this.searchOrders()
      }
    },
    /**
     * To clear an error
     * @function
     * @param {string} name - The name of the error variable
     * @returns {undefined}
     */
    clearError (name) {
      this[name] = ''
    },
    /**
     * To validate data before making a call
     * @function
     * @returns {undefined}
     */
    validateData () {
      if (
        !this.fromDate &&
        !this.toDate &&
        !this.locationId &&
        !this.externalId
      ) return
      this.page = 1
      this.searchOrders()
    },
    /**
     * To make a search orders call
     * @function
     * @returns {object} A network promise call
     */
    searchOrders () {
      this.loading = true
      this.$scrollTo(this.$refs.searchRow, 0, { offset: -100 })
      const _this = this
      this.payload = {
        location_id: this.locationId,
        from_date: this.fromDate,
        to_date: this.toDate,
        external_id: this.externalId,

        order_items: this.orderItems,
        order_item_modifier: this.orderItemModifier,
        order_modifier_option: this.orderModifierOption,
        user: this.user,
        location: this.location,

        page: this.page,
        order: this.sortBy,
        per_page: this.perPage
      }

      return AnalyticsFunctions.searchOrders(this.payload)
        .then(response => {
          if (response.code !== 200) {
            throw Error('Something went wrong')
          } else if (response.payload.total === 0) {
            _this.noResults = 'There are no matching orders'
            _this.orders = response.payload.data
            _this.total = response.payload.total
            _this.lastPage = response.payload.last_page
          } else {
            _this.orders = response.payload.data
            _this.total = response.payload.total
            _this.lastPage = response.payload.last_page
          }
        })
        .catch(reason => {
          if (reason.message === 'The selected order id is invalid.') {
            _this.orders = []
            _this.total = 0
            return
          }
          ajaxErrorHandler({
            reason,
            errorText: 'Something went wrong',
            errorName: 'alert',
            vue: _this
          })
        })
        .finally(() => {
          _this.loading = false
        })
    },
    /**
     * To display a modal with the details of an order.
     * @function
     * @param {object} order - The order object whose details should be displayed.
     * @returns {undefined}
     */
    showViewOrderModal (order) {
      this.orderBeingViewed = {
        ...order,
        loading: true
      }
      this.getOrderDetails()
    },
    /**
     * To get the details of a user.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getOrderDetails () {
      var usersVue = this

      UsersFunctions.getOrderDetails(
        usersVue.$root.appId,
        usersVue.$root.appSecret,
        usersVue.$root.userToken,
        usersVue.orderBeingViewed.id
      )
        .then(response => {
          usersVue.orderBeingViewed.order_items =
            response.payload.order_items || []
          usersVue.viewOrderModalDisplayed = true
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch order info',
            errorName: 'errorMessage',
            vue: usersVue
          })
        })
        .finally(() => {
          usersVue.orderBeingViewed.loading = false
        })
    },
    /**
     * To close the modal with the details of an order.
     * @function
     * @returns {undefined}
     */
    closeViewOrderModal () {
      this.orderBeingViewed = {}
      this.viewOrderModalDisplayed = false
    }
  }
}
</script>

<style scoped lang="scss">
.controls {
  max-width: 100%;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: auto;
  justify-content: center;
  @media (min-width: 500px) {
    grid-template-columns: 220px 220px;
    .search {
      grid-column: 2;
    }
  }
  @media (min-width: 1400px) {
    grid-template-columns: 220px 220px 220px 220px 220px;
    .search {
      grid-column: 5;
    }
  }
}
</style>

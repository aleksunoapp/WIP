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
        <el-date-picker 
          v-model="fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="true"
          placeholder="From"
          class="mb-5px"
        />
        <el-date-picker 
          v-model="toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="true"
          placeholder="To"
          class="mb-5px"
        />
        <el-input 
          v-model="externalId"
          class="input-width mb-5px"
          placeholder="Order ID"
        />
        <el-input
          v-model="lastFourDigits"
          class="input-width mb-5px"
          placeholder="Last four digits"
        />
        <el-button
          type="primary"
          :loading="loading"
          @click="validateSearchTerms()"
        >
          Search
        </el-button>
      </div>
    </div>

    <div
      v-show="!loading && transactions.length"
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
                <i class="fa fa-calendar" />&nbsp;Order ID
              </th>
              <th>
                Status
              </th>
              <th>
                <i class="fa fa-usd" />&nbsp;Amount
              </th>
              <th>
                App
              </th>
              <th>
                Transaction no
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="transaction in transactions"
              :key="transaction.id"
            >
              <td class="align-middle">
                {{ transaction.external_id }}
              </td>
              <td class="align-middle">
                {{ transaction.order_id }}
              </td>
              <td class="align-middle">
                <span
                  class="label label-sm"
                  :class="{ 
                    'label-success' : transaction.status === 'success',
                    'label-info' : transaction.status !== 'success',
                    'label-danger' : transaction.status === 'fail'
                  }"
                >
                  {{ transaction.status }}
                </span>
              </td>
              <td class="align-middle">
                {{ formatUSD(transaction.total) }}<br>
                <span class="text-muted">
                  {{ transaction.type }}
                </span>
              </td>
              <td class="align-middle">
                {{ transaction.app_version }}<br>
                <span class="text-muted">
                  {{ getPlatformName(transaction.platform) }}
                </span>
              </td>
              <td class="align-middle">
                {{ transaction.tr_number }}
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
      v-show="!loading && !transactions.length"
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
  </div>
</template>

<script>
import TransactionsFunctions from '@/controllers/Transactions'
import NoResults from '@/components/modules/NoResults'
import PageResults from '@/components/modules/PageResults'
import Pagination from '@/components/modules/Pagination'
import LoadingScreen from '@/components/modules/LoadingScreen'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import { formatUSD } from '@/controllers/utils'

export default {
	components: {
		NoResults,
		PageResults,
		LoadingScreen,
		Pagination
	},
	data: function () {
		return {
			// search filters
			fromDate: '',
			toDate: '',
			externalId: '',
			lastFourDigits: '',
			// UI
			loading: false,
			alert: '',
			noResults: '',
			platforms: {
				android: 'Android',
				ios: 'iOS',
				web: 'web'
			},
			// API data
			payload: {},
			transactions: [],
			// pagination
			total: 0,
			lastPage: 1,
			page: 1,
			perPage: 25,
			sortBy: 'DESC'
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

		this.searchTransactions()
	},
	methods: {
		/**
		 * To format a number as currency
		 * @function
		 * @param {string} val - The number to format
		 * @returns {string} The formatted currency amount
		 */
		formatUSD: formatUSD,
		/**
		 * To format a platform name
		 * @function
		 * @param {string} name - The name to format
		 * @returns {string} The formatted platform name
		 */
		getPlatformName (name) {
			try {
				return this.platforms[name.toLowerCase()] || name
			} catch (e) {
				return ''
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
				this.searchTransactions()
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
				this.searchTransactions()
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
				this.searchTransactions()
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
		validateSearchTerms () {
			if (
				!this.fromDate &&
				!this.toDate &&
				!this.externalId &&
				!this.lastFourDigits
			) { return }
			this.page = 1
			this.searchTransactions()
		},
		/**
		 * To make a search transactions call
		 * @function
		 * @returns {object} A network promise call
		 */
		searchTransactions () {
			this.loading = true
			this.$scrollTo(this.$refs.searchRow, 500, {force: false})
			const _this = this

			this.payload = {
				from_date: this.fromDate,
				to_date: this.toDate,
				// external_id: this.externalId ? this.externalId : undefined,
				last_four_digits: this.lastFourDigits,
				per_page: this.perPage
				// page: this.page,
				// order: this.sortBy,
			}

			return TransactionsFunctions.searchTransactions(this.payload)
				.then(response => {
					if (response.code !== 200) {
						throw Error('Something went wrong')
					} else if (response.payload.total === 0) {
						_this.noResults = 'There are no matching transactions'
						_this.transactions = response.payload.data
						_this.total = response.payload.total
						_this.lastPage = response.payload.last_page
					} else {
						_this.transactions = response.payload.data
						_this.total = response.payload.total
						_this.lastPage = response.payload.last_page
					}
				})
				.catch(reason => {
					if (reason.message === 'The selected ID is invalid.') {
						_this.transactions = []
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
		}
	}
}
</script>

<style scoped>
.input-width {
  width: 150px;
}
</style>

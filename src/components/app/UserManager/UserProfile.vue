<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      User Profile
    </h1>
    <!-- END PAGE TITLE-->
    <div class="profile">
      <div class="content">
        <div class="row">
          <div class="col-md-3">
            <ul class="list-unstyled profile-nav">
              <li>
                <div class="portlet light profile-sidebar-portlet ">
                  <!-- SIDEBAR USERPIC -->
                  <div class="profile-userpic">
                    <img
                      src="http://www.clker.com/cliparts/B/R/Y/m/P/e/blank-profile-hi.png"
                      style="width:150px;height:150px;"
                      class="img-responsive"
                      alt=""
                    >
                  </div>
                  <!-- END SIDEBAR USERPIC -->
                  <!-- SIDEBAR USER TITLE -->
                  <div
                    style="text-align:center"
                    class="profile-usertitle"
                  >
                    <div class="profile-usertitle-name">
                      <h2>{{ $route.params.name }}</h2>
                    </div>
                  </div>
                  <!-- END SIDEBAR USER TITLE -->
                  <!-- SIDEBAR BUTTONS -->
                  <div
                    v-if="can('user_manager users message')"
                    class="profile-userbuttons"
                  >
                    <button
                      type="button"
                      class="btn btn-circle red btn-sm"
                      @click="showMessageModal()"
                    >
                      Message
                    </button>
                    <button
                      v-if="can('user_manager users update')"
                      type="button"
                      class="btn btn-circle btn-outline red btn-sm"
                      :disabled="user.id === undefined"
                      @click="editUser()"
                    >
                      Edit
                    </button>
                  </div>
                  <!-- END SIDEBAR BUTTONS -->
                  <!-- SIDEBAR MENU -->
                  <div class="profile-usermenu">
                    <ul class="nav">
                      <li :class="{ 'active': tab === 0 }">
                        <a
                          a
                          aria-expanded="true"
                          @click="changeTab(0)"
                        >
                          <i
                            class="fa fa-list-ol"
                            aria-hidden="true"
                          /> Orders
                        </a>
                      </li>
                      <li :class="{ 'active': this.tab === 1 }">
                        <a
                          a
                          aria-expanded="true"
                          @click="changeTab(1)"
                        >
                          <i
                            class="fa fa-picture-o"
                            aria-hidden="true"
                          /> Gallery
                        </a>
                      </li>
                      <li
                        v-if="can('user_manager transactions read')"
                        :class="{ 'active': this.tab === 2 }"
                      >
                        <a
                          a
                          aria-expanded="true"
                          @click="changeTab(2)"
                        >
                          <i
                            class="fa fa-list-alt"
                            aria-hidden="true"
                          /> Transactions
                        </a>
                      </li>
                    </ul>
                  </div>
                  <!-- END MENU -->
                </div>
              </li>
              <li>
                <div class="portlet light ">
                  <!-- STAT -->
                  <div class="row list-separated profile-stat">
                    <div>
                      <div class="uppercase profile-stat-title">
                        {{ formatInteger(user.total_orders, '&infin;') }}
                      </div>
                      <div class="uppercase profile-stat-text">
                        Total Orders
                      </div>
                    </div>
                    <div class="margin-top-20">
                      <div class="uppercase profile-stat-title">
                        {{ formatUSD(user.total_spent, '&infin;') }}
                      </div>
                      <div class="uppercase profile-stat-text">
                        Total Spent
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li v-if="can('user_manager users add_points create')">
                <div class="portlet light">
                  <div
                    v-show="addErrorMessage"
                    ref="addErrorMessage"
                    class="alert alert-danger"
                  >
                    <button
                      class="close"
                      @click.prevent="clearError('addErrorMessage')"
                    />
                    <span>{{ addErrorMessage }}</span>
                  </div>
                  <div class="add-points__container">
                    <div class="add-points__input form-group form-md-line-input form-md-floating-label">
                      <input
                        id="form_control_name"
                        v-model="points"
                        type="text"
                        class="form-control input-sm"
                        :class="{'edited': points.length}"
                        name="add_points"
                      >
                      <label for="form_control_name">
                        Add Points
                      </label>
                    </div>
                    <div class="add-points__button">
                      <button
                        type="button"
                        class="btn blue pull-right"
                        :disabled="adding"
                        @click="addPoints()"
                      >
                        <i
                          v-show="adding"
                          class="fa fa-spinner fa-pulse fa-fw"
                        />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div
                  v-show="userAttributes.length"
                  class="portlet light"
                >
                  <div class="uppercase profile-stat-text margin-bottom-20">
                    Attributes
                  </div>
                  <span
                    v-for="attribute in userAttributes"
                    :key="attribute.id"
                    class="badge badge-info margin-bottom-10 margin-right-10"
                  >
                    {{ attribute.name }}
                  </span>
                </div>
              </li>
              <li>
                <div
                  v-if="userItems.length"
                  class="portlet light"
                >
                  <!-- STAT -->
                  <div class="uppercase profile-stat-text margin-bottom-10">
                    Items
                  </div>
                  <div class="container__flex--column">
                    <div
                      v-for="item in userItems"
                      :key="item.id"
                      class="container__flex--row"
                    >
                      <div class="container__item--image margin-right-10">
                        <img
                          :src="item.image_url"
                          style="width: 40px; height: 40px;"
                        >
                      </div>
                      <p class="font-blue-madison margin-left-10">
                        {{ item.name }}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div
            v-show="errorMessage"
            ref="errorMessage"
            class="col-md-9"
          >
            <div class="alert alert-danger">
              <button
                class="close"
                @click.prevent="clearError('errorMessage')"
              />
              <span>{{ errorMessage }}</span>
            </div>
          </div>
          <div class="col-md-9">
            <div class="tabbable-custom-profile">
              <div class="tab-content">
                <!--tab-pane-->
                <div
                  v-show="tab === 0"
                  class="tab-pane active"
                >
                  <div
                    v-show="loadingOrders"
                  >
                    <div class="col-xs-12 relative-block">
                      <loading-screen
                        :show="loadingOrders"
                        class="margin-top-20"
                      />
                    </div>
                  </div>
                  <div
                    v-show="!loadingOrders"
                    class="portlet-body"
                  >
                    <div
                      v-if="orders.length"
                      class="clearfix margin-bottom-10"
                    >
                      <el-dropdown
                        trigger="click"
                        size="mini"
                        :show-timeout="50"
                        :hide-timeout="50"
                        @command="updateSortByOrder"
                      >
                        <el-button size="mini">
                          Sort by
                          <span>
                            <i
                              v-if="sortBy.order === 'ASC'"
                              class="fa fa-sort-alpha-asc"
                            />
                            <i
                              v-if="sortBy.order === 'DESC'"
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
                      <a
                        ref="csv"
                        :download="`${user.first_name} ${user.last_name} Orders.csv`"
                        class="margin-left-5"
                        @click="downloadCsv()"
                      >
                        Save as CSV
                        <i
                          class="fa fa-download"
                          aria-hidden="true"
                        />
                      </a>
                      <page-results
                        class="pull-right"
                        :total-results="orders.length"
                        :active-page="activePage"
                        @pageResults="pageResultsUpdate"
                      />
                    </div>
                    <table class="table table-striped table-advance table-hover">
                      <thead>
                        <tr>
                          <th>
                            <span class="white-space-no-wrap">
                              <i class="fa fa-building" /> Store
                            </span>
                          </th>
                          <th class="hidden-xs">
                            <span class="white-space-no-wrap">
                              <i class="fa fa-usd" /> Amount
                            </span>
                          </th>
                          <th>
                            <span class="white-space-no-wrap">
                              <i class="fa fa-calendar" /> Order Date
                            </span>
                          </th>
                          <th>
                            <span class="white-space-no-wrap">
                              <i class="fa fa-hourglass-start" /> Status
                            </span>
                          </th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="order in currentActivePageOrders"
                          :key="order.id"
                        >
                          <td class="align-middle">
                            <span v-if="order.location_name !=='NULL'">
                              {{ order.location_name }}
                            </span>
                          </td>
                          <td class="align-middle">
                            ${{ order.total }}
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
                            <a
                              class="btn btn-sm grey-salsa btn-outline"
                              @click="showViewOrderModal(order)"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      v-if="orders.length && numPages > 1"
                      class="clearfix"
                    >
                      <pagination
                        :passed-page="activePage"
                        :num-pages="numPages"
                        @activePageChange="activePageUpdate"
                      />
                    </div>
                    <p
                      v-if="!orders.length"
                      class="text-center"
                    >
                      This user hasn't made any orders yet
                    </p>
                  </div>
                </div>
                <!--tab-pane-->
                <div
                  v-show="tab === 1"
                  class="tab-pane active"
                >
                  <div
                    v-if="socialFeed.length"
                    class="row"
                  >
                    <div
                      v-for="feed in socialFeed"
                      :key="feed.id"
                      class="col-md-3 col-sm-3 col-xs-4"
                    >
                      <div
                        :id="'social-feed-' + feed.id"
                        class="blog-post-sm blog-container blog-shadow"
                      >
                        <div class="blog-top-wrap">
                          <div class="pull-left">
                            <span v-if="feed.short_description.length">
                              {{ feed.short_description }}
                            </span>
                            <span v-else>
                              NO TITLE
                            </span>
                          </div>
                        </div>
                        <div
                          class="blog-img-thumb small-blog-img-thumb"
                          :class="{'blog-img-thumb-bordered': !feed.url.length}"
                        >
                          <img
                            v-if="feed.url.length"
                            class="small-image"
                            :src="feed.url"
                          >
                          <img
                            v-else
                            class="small-image"
                            src="../../../assets/img/app/image-placeholder.png"
                          >
                        </div>
                        <div class="blog-post-content">
                          <p class="blog-post-desc">
                            {{ feed.description }}
                          </p>
                          <div
                            v-if="feed.facebook || feed.twitter || feed.instagram"
                            class="blog-post-foot"
                          >
                            <div class="socicons">
                              <a
                                v-if="feed.facebook"
                                class="socicon-btn socicon-btn-circle socicon-facebook"
                              />
                              <a
                                v-if="feed.twitter"
                                class="socicon-btn socicon-btn-circle socicon-twitter"
                              />
                              <a
                                v-if="feed.instagram"
                                class="socicon-btn socicon-btn-circle socicon-instagram"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--tab-pane-->
              </div>
              <div
                v-show="tab === 2"
                class="tab-pane active"
              >
                <div
                  v-show="transactions.loading"
                >
                  <div class="col-xs-12 relative-block">
                    <loading-screen
                      :show="transactions.loading"
                      class="margin-top-20"
                    />
                  </div>
                </div>
                <div
                  v-show="!transactions.loading"
                  class="portlet-body"
                >
                  <div
                    v-if="currentActivePageTransactions.length"
                    class="clearfix margin-bottom-10"
                  >
                    <el-select 
                      v-model="transactions.sortBy"
                      size="mini"
                      @change="sortTransactions"
                    >
                      <el-option
                        key="newest"
                        label="New to old ↓"
                        value="newest"
                      />
                      <el-option
                        key="oldest"
                        label="Old to new ↑"
                        value="oldest"
                      />
                    </el-select>
                    <a 
                      ref="transactionsCSV"
                      :download="`${user.first_name} ${user.last_name} Transactions.csv`"
                      class="margin-left-5"
                      @click="downloadTransactionsCSV()"
                    >
                      Save as CSV
                      <i
                        class="fa fa-download"
                        aria-hidden="true"
                      />
                    </a>
                    <page-results 
                      class="pull-right"
                      :total-results="transactions.data.length"
                      :active-page="transactions.activePage"
                      @pageResults="transactionsPageResultsUpdate"
                    />
                  </div>
                  <table class="table table-striped table-advance">
                    <thead>
                      <tr>
                        <th>
                          ID
                        </th>
                        <th>
                          <span class="white-space-no-wrap">
                            Order ID
                          </span>
                        </th>
                        <th>
                          Status
                        </th>
                        <th>
                          <span class="white-space-no-wrap">
                            <i class="fa fa-usd" /> Amount
                          </span>
                        </th>
                        <th>
                          App
                        </th>
                        <th>
                          Transaction no
                        </th>
                        <th>
                          <span class="white-space-no-wrap">
                            <i class="fa fa-clock-o" /> Time
                          </span>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="transaction in currentActivePageTransactions"
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
                        <td class="align-middle">
                          {{ transaction.updated_at }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    v-if="currentActivePageTransactions.length && transactionsNumPages > 1"
                  >
                    <pagination 
                      :passed-page="transactions.activePage"
                      :num-pages="transactionsNumPages"
                      @activePageChange="transactionsActivePageUpdate"
                    />
                  </div>
                  <p
                    v-if="!transactions.data.length"
                    class="text-center"
                  >
                    There are no transactions for this user
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <view-order
      v-if="viewOrderModalDisplayed"
      :order="orderBeingViewed"
      @closeViewOrderModal="closeViewOrderModal"
    />
    <message
      v-if="messageModalDisplayed"
      :user-id="user.id"
      @closeMessageModal="closeMessageModal"
    />
  </div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import Tabset from '../../modules/Tabset'
import ViewOrder from './ViewOrder'
import Message from './Message'
import Tab from '../../modules/Tab'
import '../../../assets/css/profile.min.css'
import UsersFunctions from '../../../controllers/Users'
import UserAttributesFunctions from '../../../controllers/UserAttributes'
import TransactionsFunctions from '@/controllers/Transactions'
import ButtonGroup from '../../modules/ButtonGroup'
import Checkbox from '../../modules/Checkbox'
import LoadingScreen from '../../modules/LoadingScreen'
import Dropdown from '../../modules/Dropdown'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import $ from 'jquery'
import { mapGetters, mapMutations } from 'vuex'
import json2csv from 'json2csv'
import { formatUSD, formatInteger } from '@/controllers/utils'

export default {
	components: {
		Breadcrumb,
		Tabset,
		Tab,
		ViewOrder,
		ButtonGroup,
		Checkbox,
		Message,
		Pagination,
		PageResults,
		Dropdown,
		LoadingScreen
	},
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Users', link: '/app/user_manager/users' },
				{ name: 'User Profile', link: false }
			],
			tab: 0,
			user: {
				total_orders: '',
				total_spent: ''
			},
			loading: false,
			loadingOrders: false,
			orders: [],
			orderBeingViewed: {},
			viewOrderModalDisplayed: false,
			socialFeed: [],
			messageModalDisplayed: false,
			activePage: 1,
			resultsPerPage: 25,
			sortBy: {
				order: 'DESC'
			},
			userAttributes: [],
			userItems: [],
			errorMessage: '',
			points: '',
			adding: false,
			addErrorMessage: '',
			parser: null,
			transactions: {
				loading: false,
				data: [],
				activePage: 1,
				resultsPerPage: 25,
				sortBy: 'newest',
				parser: null
			},
			platforms: {
				android: 'Android',
				ios: 'iOS',
				web: 'web'
			}
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.orders.length / this.resultsPerPage)
		},
		currentActivePageOrders () {
			return this.userSort(this.orders).slice(
				this.resultsPerPage * (this.activePage - 1),
				this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage
			)
		},
		currentActivePageTransactions () {
			return this.transactions.data.slice(
				this.transactions.resultsPerPage * (this.transactions.activePage - 1),
				this.transactions.resultsPerPage * (this.transactions.activePage - 1) + this.transactions.resultsPerPage
			)
		},
		transactionsNumPages () {
			return Math.ceil(this.transactions.data.length / this.transactions.resultsPerPage)
		},
		...mapGetters(['can'])
	},
	mounted () {
		this.getUserDetails()
		this.getAttributesOfUser()
		this.getItemsOfuser()
		this.getUserOrders()
		this.getUserSocialFeed()
		this.getUserTransactions()

		this.parser = new json2csv.Parser({
			fields: [
				{
					label: 'Order ID',
					value: 'external_id',
					default: ''
				},
				{
					label: 'Store',
					value: 'location_name',
					default: ''
				},
				{
					label: 'Total',
					value: 'total',
					default: ''
				},
				{
					label: 'Rewards Claimed ($)',
					value: 'reward_amount',
					default: ''
				},
				{
					label: 'Points Earned',
					value: 'points_earned',
					default: ''
				},
				{
					label: 'Order Date',
					value: 'created_at',
					default: ''
				},
				{
					label: 'Platform',
					value: 'platform',
					default: ''
				},
				{
					label: 'Status',
					value: 'status',
					default: ''
				}
			]
		})
	},
	methods: {
		...mapMutations({
			setUser: 'users/SET_USER'
		}),
		/**
		 * Copy user to store and redirect to edit route
		 * @function
		 * @returns {undefined}
		 */
		editUser () {
			this.setUser(this.user)
			this.$router.push({name: 'EditUser'})
		},
		sortTransactions () {
			this.transactions.data.sort((a, b) => {
				if (a.created_at > b.created_at) {
					return this.transactions.sortBy === 'newest' ? -1 : 1
				} else if (a.created_at < b.created_at) {
					return this.transactions.sortBy === 'newest' ? -1 : 1
				} else {
					if (a.id > b.id) {
						return -1
					} else if (a.id < b.id) {
						return 1
					} else {
						return 0
					}
				}
			})
		},
		/**
		 * To format a number as currency
		 * @function
		 * @param {string} val - The number to format
		 * @param {string} fallback - Preferred fallback return value
		 * @returns {string} The formatted currency amount
		 */
		formatUSD: formatUSD,
		/**
		 * To format a number as currency
		 * @function
		 * @param {string} val - The number to format
		 * @param {string} fallback - Preferred fallback return value
		 * @returns {string} The formatted currency amount
		 */
		formatInteger: formatInteger,
		/**
		 * To download orders in a CSV file
		 * @function
		 * @returns {undefined}
		 */
		downloadCsv () {
			this.$refs.csv.href = `data:text/csv,${this.parser.parse(this.orders)}`
		},
		/**
		 * To download transactions in a CSV file
		 * @function
		 * @returns {undefined}
		 */
		downloadTransactionsCSV () {
			if (this.transactions.parser === null) {
				this.transactions.parser = new json2csv.Parser({
					fields: [
						{
							label: 'Id',
							value: 'id',
							default: ''
						},
						{
							label: 'Order Id',
							value: 'order_id',
							default: ''
						},
						{
							label: 'Tr Number',
							value: 'tr_number',
							default: ''
						},
						{
							label: 'External Id',
							value: 'external_id',
							default: ''
						},
						{
							label: 'Total',
							value: 'total',
							default: ''
						},
						{
							label: 'Type',
							value: 'type',
							default: ''
						},
						{
							label: 'Billing Id',
							value: 'billing_id',
							default: ''
						},
						{
							label: 'Status',
							value: 'status',
							default: ''
						},
						{
							label: 'Platform',
							value: 'platform',
							default: ''
						},
						{
							label: 'Ip Address',
							value: 'ip_address',
							default: ''
						},
						{
							label: 'App Version',
							value: 'app_version',
							default: ''
						},
						{
							label: 'Created At',
							value: 'created_at',
							default: ''
						},
						{
							label: 'Updated At',
							value: 'updated_at',
							default: ''
						},
						{
							label: 'Request Merchid',
							value: 'request_merchid',
							default: ''
						},
						{
							label: 'Request Amount',
							value: 'request_amount',
							default: ''
						},
						{
							label: 'Request Orderid',
							value: 'request_orderid',
							default: ''
						},
						{
							label: 'Request Capture',
							value: 'request_capture',
							default: ''
						},
						{
							label: 'Request Account',
							value: 'request_account',
							default: ''
						},
						{
							label: 'Request Expiry',
							value: 'request_expiry',
							default: ''
						},
						{
							label: 'Request Profile',
							value: 'request_profile',
							default: ''
						},
						{
							label: 'Request Acctid',
							value: 'request_acctid',
							default: ''
						},
						{
							label: 'Response Respproc',
							value: 'response_respproc',
							default: ''
						},
						{
							label: 'Response Amount',
							value: 'response_amount',
							default: ''
						},
						{
							label: 'Response Resptext',
							value: 'response_resptext',
							default: ''
						},
						{
							label: 'Response Cardproc',
							value: 'response_cardproc',
							default: ''
						},
						{
							label: 'Response Acctid',
							value: 'response_acctid',
							default: ''
						},
						{
							label: 'Response Retref',
							value: 'response_retref',
							default: ''
						},
						{
							label: 'Response Respstat',
							value: 'response_respstat',
							default: ''
						},
						{
							label: 'Response Respcode',
							value: 'response_respcode',
							default: ''
						},
						{
							label: 'Response Account',
							value: 'response_account',
							default: ''
						},
						{
							label: 'Response Merchid',
							value: 'response_merchid',
							default: ''
						},
						{
							label: 'Response Token',
							value: 'response_token',
							default: ''
						}
					]
				})
			}
			this.$refs.transactionsCSV.href = `data:text/csv,${this.transactions.parser.parse(this.transactions.data)}`
		},
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
		 * To clear an error
		 * @function
		 * @param {string} errorName - The name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (errorName) {
			this[errorName] = ''
		},
		/**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateSortByOrder (value) {
			this.sortBy.order = value
		},
		/**
		 * To sort the orders list.
		 * @function
		 * @param {array} orders - The array of orders.
		 * @returns {array} - The sorted array of orders
		 */
		userSort (orders) {
			let input = orders
			function asc (a, b) {
				if (new Date(a.created_at) < new Date(b.created_at)) {
					return -1
				} else if (new Date(a.created_at) > new Date(b.created_at)) {
					return 1
				} else {
					if (a.id > b.id) {
						return -1
					} else if (a.id < b.id) {
						return 1
					} else {
						return 0
					}
				}
			}

			function desc (a, b) {
				if (new Date(a.created_at) > new Date(b.created_at)) {
					return -1
				} else if (new Date(a.created_at) < new Date(b.created_at)) {
					return 1
				} else {
					if (a.id > b.id) {
						return -1
					} else if (a.id < b.id) {
						return 1
					} else {
						return 0
					}
				}
			}

			if (this.sortBy.order === 'ASC') {
				return input.sort(asc)
			} else {
				return input.sort(desc)
			}
		},
		/**
		 * To catch updates from the PageResults component when the number of page results is updated.
		 * @function
		 * @param {integer} val - The number of page results to be returned.
		 * @returns {undefined}
		 */
		pageResultsUpdate (val) {
			if (parseInt(this.resultsPerPage) !== parseInt(val)) {
				this.resultsPerPage = val
				this.activePage = 1
			}
		},
		/**
		 * To catch updates from the PageResults component when the number of page results is updated.
		 * @function
		 * @param {integer} val - The number of page results to be returned.
		 * @returns {undefined}
		 */
		transactionsPageResultsUpdate (val) {
			if (parseInt(this.transactions.resultsPerPage) !== parseInt(val)) {
				this.transactions.resultsPerPage = val
				this.transactions.activePage = 1
			}
		},
		/**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
		activePageUpdate (val) {
			if (parseInt(this.activePage) !== parseInt(val)) {
				this.activePage = val
			}
		},
		/**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
		transactionsActivePageUpdate (val) {
			if (parseInt(this.transactions.activePage) !== parseInt(val)) {
				this.transactions.activePage = val
			}
		},
		/**
		 * To display a modal with the details of an order.
		 * @function
		 * @param {object} order - The order object whose details should be displayed.
		 * @returns {undefined}
		 */
		showViewOrderModal (order) {
			this.orderBeingViewed = order
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
		},
		/**
		 * To close the modal with the details of an order.
		 * @function
		 * @returns {undefined}
		 */
		closeViewOrderModal () {
			this.orderBeingViewed = {}
			this.viewOrderModalDisplayed = false
		},
		/**
		 * To display a message modal.
		 * @function
		 * @returns {undefined}
		 */
		showMessageModal () {
			this.messageModalDisplayed = true
		},
		/**
		 * To close the message modal.
		 * @function
		 * @returns {undefined}
		 */
		closeMessageModal () {
			this.messageModalDisplayed = false
		},
		/**
		 * To set the passed in tab as the active tab.
		 * @function
		 * @param {integer} val - The value of the tab.
		 * @returns {undefined}
		 */
		changeTab (val) {
			this.tab = val
		},
		/**
		 * To get the details of a user.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserDetails () {
			this.displayUserData = true
			var usersVue = this

			UsersFunctions.getUserDetails(
				usersVue.$root.appId,
				usersVue.$root.appSecret,
				usersVue.$root.userToken,
				usersVue.$route.params.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						usersVue.user = response.payload
						usersVue.displayUserData = false
					} else {
						usersVue.displayUserData = false
					}
				})
				.catch(reason => {
					usersVue.displayUserData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch user info',
						errorName: 'errorMessage',
						vue: usersVue
					})
				})
		},
		/**
		 * To get a list of user's attributes.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAttributesOfUser () {
			var usersVue = this

			UserAttributesFunctions.getAttributesOfUser(
				usersVue.$root.appId,
				usersVue.$root.appSecret,
				usersVue.$root.userToken,
				usersVue.$route.params.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						usersVue.userAttributes = response.payload.userattributes
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch user attributes',
						errorName: 'errorMessage',
						vue: usersVue
					})
				})
		},
		/**
		 * To get a list of user's attributes.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemsOfuser () {
			var usersVue = this

			UserAttributesFunctions.getItemsOfuser(
				usersVue.$root.appId,
				usersVue.$root.appSecret,
				usersVue.$root.userToken,
				usersVue.$route.params.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						usersVue.userItems = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch user items',
						errorName: 'errorMessage',
						vue: usersVue
					})
				})
		},
		/**
		 * To get a list of user's orders.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserOrders () {
			this.displayUserData = true
			this.loadingOrders = true
			var usersVue = this

			UsersFunctions.getUserOrders(
				usersVue.$root.appId,
				usersVue.$root.appSecret,
				usersVue.$root.userToken,
				usersVue.$route.params.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						usersVue.orders = response.payload
						usersVue.displayUserData = false
					} else {
						usersVue.displayUserData = false
					}
				})
				.catch(reason => {
					usersVue.displayUserData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch user orders',
						errorName: 'errorMessage',
						vue: usersVue
					})
				})
				.finally(() => {
					usersVue.loadingOrders = false
				})
		},
		/**
		 * To get a list of user's orders.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserTransactions () {
			this.transactions.loading = true
			var usersVue = this

			TransactionsFunctions.getTransactionsForUser(
				usersVue.$route.params.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						usersVue.transactions.data = response.payload.map(transaction => {
							let request = {}
							let response = {}
							try {
								request = JSON.parse(transaction.request)
							} catch (e) {
								if (this.env === 'development') console.log(e)
							}
							try {
								response = JSON.parse(transaction.response)
							} catch (e) {
								if (this.env === 'development') console.log(e)
							}

							let flattened = {...transaction}
							for (let key of Object.keys(request)) {
								flattened[`request_${key}`] = request[key]
							}
							for (let key of Object.keys(response)) {
								flattened[`response_${key}`] = response[key]
							}
							delete flattened.request
							delete flattened.response

							return flattened
						})
						usersVue.displayUserData = false
					} else {
						usersVue.displayUserData = false
					}
				})
				.catch(reason => {
					console.log({reason})
					usersVue.displayUserData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch user orders',
						errorName: 'errorMessage',
						vue: usersVue
					})
				})
				.finally(() => {
					usersVue.transactions.loading = false
				})
		},
		/**
		 * To get a list of user's social media posts.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserSocialFeed () {
			this.displayUserData = true
			var usersVue = this

			UsersFunctions.getUserSocialFeed(
				usersVue.$root.appId,
				usersVue.$root.appSecret,
				usersVue.$root.userToken,
				usersVue.$route.params.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						usersVue.socialFeed = response.payload
						usersVue.displayUserData = false
					} else {
						usersVue.displayUserData = false
					}
				})
				.catch(reason => {
					usersVue.displayUserData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the social feed',
						errorName: 'errorMessage',
						vue: usersVue
					})
				})
		},
		/**
		 * To validate data before submitting to the backend
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		validatePoints () {
			var usersVue = this
			return new Promise(function (resolve, reject) {
				if (!usersVue.points.length) {
					reject('Enter points')
				} else if (!$.isNumeric(usersVue.points)) {
					reject('Points must be a number')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To get a list of user's social media posts.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		addPoints () {
			var usersVue = this
			return this.validatePoints()
				.then(response => {
					this.adding = true

					let payload = {
						user_ids: [this.user.id],
						points: this.points
					}
					UsersFunctions.addPoints(payload)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								usersVue.showAddSuccess(response.payload)
								usersVue.resetPoints()
							} else {
								throw Error('Something went wrong')
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add points',
								errorName: 'addErrorMessage',
								vue: usersVue
							})
						})
						.finally(() => {
							usersVue.adding = false
						})
				})
				.catch(reason => {
					usersVue.addErrorMessage = reason
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAddSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Points have been added'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The changes have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To reset the point adding box.
		 * @function
		 * @returns {undefined}
		 */
		resetPoints () {
			this.clearError('addErrorMessage')
			this.points = ''
		}
	}
}
</script>
<style scoped>
.list-separated {
  margin-top: 10px;
  margin-bottom: 10px;
}
.profile-stat {
  padding-bottom: 0;
  border-bottom: 0;
}
.label-success {
  background-color: #36c6d3;
}
.btn.green:not(.btn-outline) {
  color: #fff;
  background-color: #32c5d2;
  border-color: #32c5d2;
}
.btn.red:not(.btn-outline) {
  color: #fff;
  background-color: #e7505a;
  border-color: #e7505a;
}
.profile ul.profile-nav li a {
  background: transparent;
  border-left: none;
  padding: 10px 15px;
}
.profile-usermenu ul li.active a {
  color: #5b9bd1;
  background-color: #f6f9fb;
  border-left: 2px solid #5b9bd1;
  margin-left: -2px;
}
.portlet {
  box-shadow: 0 2px 3px 2px rgba(0, 0, 0, 0.4);
}

.social-feed-status {
  display: inline-block;
  position: absolute;
  right: 22px;
  bottom: 32px;
}
.socicon-btn {
  border: 1px solid #d5d5d5;
}
.blog-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.blog-post-content {
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 10px;
  height: 125px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.small-blog-img-thumb {
  height: 125px;
  overflow: hidden;
  display: flex;
  justify-content: center;
}
img.small-image {
  max-width: 100%;
  min-width: 100%;
}
.blog-content-1 .blog-post-sm > .blog-img-thumb-bordered {
  border-bottom: 1px solid #e7ecf1;
}
.blog-post-title a {
  text-decoration: none;
}
.blog-top-wrap {
  position: relative;
  z-index: 3;
  height: 50px;
  opacity: 0.7;
  width: 100%;
  color: #fff;
  font-size: 15px;
  padding: 15px 10px;
  font-weight: 600;
  background-color: #286090;
}
.btn.custom-button:not(.md-skip):not(.bs-select-all):not(.bs-deselect-all) {
  position: absolute;
  bottom: 0;
  height: 30%;
  border-radius: 0;
}
.custom-button.full-width {
  left: 0;
  width: 100%;
}
.socicons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.align-middle {
  vertical-align: middle;
}
.container__flex--column {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.container__flex--row {
  width: 100%;
  display: flex;
  align-items: center;
  /*padding-left: 15px;*/
}
.container__item--image {
  width: 40px;
  height: 40px;
  max-width: 40px;
  max-height: 40px;
}
.item--image {
  max-height: 100%;
  max-width: 100%;
}
.add-points__container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.add-points__input {
  width: 50%;
}
.add-points__button {
  width: 30%;
  margin-bottom: 15px;
}
</style>

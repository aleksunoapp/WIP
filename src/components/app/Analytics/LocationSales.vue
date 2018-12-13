<template>
	<div>
		<div v-if="!$root.activeLocation.id">
			<div class="row">
				<div class="col-md-12">
					<div class="alert alert-info center margin-top-20"
					     v-if="!$root.activeLocation.id">
						<h4>No Store Selected</h4>
						<p>Please select a store from the stores panel on the right to view its data</p>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<div class="row">
				<div class="col-xs-4">
					<div class="portlet box blue-hoki">
						<div class="portlet-title bg-blue-chambray">
							<div class="caption"
							     style="font-size:14px">
								<span class="fa-stack fa-sm">
									<i class="fa fa-circle fa-stack-2x"
									   aria-hidden="true"
									   style="color:rgb(26,188,156);line-height: inherit"></i>
									<i class="fa fa-usd fa-stack-1x"
									   aria-hidden="true"
									   style="color:rgb(255,255,255);line-height:inherit"></i>
								</span>
								Revenue Today
							</div>
						</div>
						<div class="portlet-body">
							<div style="font-size: 20px;color:rgb(26,188,156);text-align: center;">
								<span v-if="formatUSD(locationRevenueSummary.today_revenue) !== 'n/a'">{{ formatUSD(locationRevenueSummary.today_revenue) }} in </span>{{ formatNumber(locationOrdersSummary.daily_order) }} orders</div>
						</div>
					</div>
				</div>
				<div class="col-xs-4">
					<div class="portlet box blue-hoki">
						<div class="portlet-title bg-blue-chambray">
							<div class="caption"
							     style="font-size:14px">
								<span class="fa-stack fa-sm">
									<i class="fa fa-circle fa-stack-2x"
									   aria-hidden="true"
									   style="color:#3498db;line-height: inherit"></i>
									<i class="fa fa-usd fa-stack-1x"
									   aria-hidden="true"
									   style="color:rgb(255,255,255);line-height:inherit"></i>
								</span>
								Revenue This Week
							</div>
						</div>
						<div class="portlet-body">
							<div style="font-size: 20px;color:#3498db;text-align: center;">
								<span v-if="formatUSD(locationRevenueSummary.week_revenue) !== 'n/a'">{{ formatUSD(locationRevenueSummary.week_revenue) }} in </span>{{ formatNumber(locationOrdersSummary.weekly_order) }} orders</div>
						</div>
					</div>
				</div>
				<div class="col-xs-4">
					<div class="portlet box blue-hoki">
						<div class="portlet-title bg-blue-chambray">
							<div class="caption"
							     style="font-size:14px">
								<span class="fa-stack fa-sm">
									<i class="fa fa-circle fa-stack-2x"
									   aria-hidden="true"
									   style="color:#e67e22;line-height: inherit"></i>
									<i class="fa fa-usd fa-stack-1x"
									   aria-hidden="true"
									   style="color:rgb(255,255,255);line-height:inherit"></i>
								</span>
								Revenue This Month
							</div>
						</div>
						<div class="portlet-body">
							<div style="font-size: 20px;color:#e67e22;text-align: center;">
								<span v-if="formatUSD(locationRevenueSummary.month_revenue) !== 'n/a'">{{ formatUSD(locationRevenueSummary.month_revenue) }} in </span>{{ formatNumber(locationOrdersSummary.monthly_order) }} orders</div>
						</div>
					</div>
				</div>
				<div class="col-xs-6">
					<div class="portlet box blue-hoki">
						<div class="portlet-title bg-blue-chambray">
							<div class="caption"
							     style="font-size:14px">
								<span class="fa-stack fa-sm">
									<i class="fa fa-circle fa-stack-2x"
									   aria-hidden="true"
									   style="color:#9b59b6;line-height: inherit"></i>
									<i class="fa fa-usd fa-stack-1x"
									   aria-hidden="true"
									   style="color:rgb(255,255,255);line-height:inherit"></i>
								</span>
								Revenue This Year
							</div>
						</div>
						<div class="portlet-body">
							<div style="font-size: 20px;color:#9b59b6;text-align: center;">
								<span v-if="formatUSD(locationRevenueSummary.year_revenue) !== 'n/a'">{{ formatUSD(locationRevenueSummary.year_revenue) }} in </span>{{ formatNumber(locationOrdersSummary.yearly_order) }} orders</div>
						</div>
					</div>
				</div>
				<div class="col-xs-6">
					<div class="portlet box blue-hoki">
						<div class="portlet-title bg-blue-chambray">
							<div class="caption"
							     style="font-size:14px">
								<span class="fa-stack fa-sm">
									<i class="fa fa-circle fa-stack-2x"
									   aria-hidden="true"
									   style="color:#F2B230;line-height: inherit"></i>
									<i class="fa fa-usd fa-stack-1x"
									   aria-hidden="true"
									   style="color:rgb(255,255,255);line-height:inherit"></i>
								</span>
								Total Revenue To Date
							</div>
						</div>
						<div class="portlet-body">
							<div style="font-size: 20px;color:#F2B230;text-align: center;">
								<span v-if="formatUSD(locationRevenueSummary.total_revenue) !== 'n/a'">{{ formatUSD(locationRevenueSummary.total_revenue) }} in </span>{{ formatNumber(locationOrdersSummary.total_order) }} orders</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue-hoki">
						<div class="portlet-title bg-blue-chambray">
							<div class="caption"
							     style="font-size:14px">
								<span class="fa-stack fa-sm">
									<i class="fa fa-circle fa-stack-2x"
									   aria-hidden="true"
									   style="color:#409EFF;line-height: inherit"></i>
									<i class="fa fa-line-chart fa-stack-1x"
									   aria-hidden="true"
									   style="color:rgb(255,255,255);line-height:inherit"></i>
								</span>
								Revenue Tracker
							</div>
						</div>
						<div class="portlet-body">
							<div class="row">
								<div class="col-md-10 col-md-offset-1 margin-top-10 center">
									<el-radio-group v-model="searchPeriod"
									                @change="weekSelected()">
										<el-radio-button label="week">week</el-radio-button>
										<el-radio-button label="custom">custom</el-radio-button>
									</el-radio-group>
									<el-date-picker v-show="searchPeriod === 'custom'"
									                v-model="from_date"
									                @change="dateFromSelected()"
									                :editable="false"
									                type="date"
									                format="yyyy-MM-dd"
									                value-format="yyyy-MM-dd"
									                :clearable="false"
									                placeholder="From"></el-date-picker>
									<el-date-picker v-show="searchPeriod === 'custom'"
									                v-model="to_date"
									                @change="dateToSelected()"
									                type="date"
									                format="yyyy-MM-dd"
									                value-format="yyyy-MM-dd"
									                :clearable="false"
									                placeholder="To"></el-date-picker>
								</div>
								<div class="col-md-12"
								     id="chart_div"
								     style="height:350px"></div>
								<div 
									v-if="totals.show"
									class="col-md-12 text-center revenue-tracker-totals"
								>
									<p>
										Total: {{totals.revenue}} in {{totals.orders}} orders.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue-hoki">
						<div class="portlet-title bg-blue-chambray">
							<div class="caption"
							     style="font-size:14px">
								<span class="fa-stack fa-sm">
									<i class="fa fa-circle fa-stack-2x"
									   aria-hidden="true"
									   style="color:rgb(26,188,156);line-height: inherit"></i>
									<i class="fa fa-trophy fa-stack-1x"
									   aria-hidden="true"
									   style="color:rgb(255,255,255);line-height:inherit"></i>
								</span>
								Top 10 Selling Items
							</div>
							<div class="tools clickable"
							     @click="downloadCSV(locationItemSummary)">
								<i class="fa fa-download"
								   aria-hidden="true"></i>
							</div>
						</div>
						<div class="portlet-body">
							<el-table :data="locationItemSummary">
								<el-table-column prop="name"
								                 label="Name"
								                 sortable>
								</el-table-column>
								<el-table-column prop="actual_price"
								                 label="Price"
								                 width="150"
								                 :formatter="formatItemPrice"
								                 sortable>
								</el-table-column>
								<el-table-column prop="total_sale"
								                 label="Total sales"
								                 :formatter="tableFormatNumber"
								                 width="150"
								                 sortable>
								</el-table-column>
								<el-table-column prop="item_sku"
								                 label="SKU"
								                 width="150"
								                 sortable>
								</el-table-column>
								<el-table-column label="Category">
									<template slot-scope="scope">
										<div class="tbl-category-column-wrapper">
											<div class="tbl-category-caption-wrapper">
												<img class="tbl-category-image"
												     :src="scope.row.category_image"/>
												<p class="tbl-category-name">{{scope.row.category}}</p>
											</div>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue-hoki">
						<div class="portlet-title bg-blue-chambray">
							<div class="caption"
							     style="font-size:14px">
								<span class="fa-stack fa-sm">
									<i class="fa fa-circle fa-stack-2x"
									   aria-hidden="true"
									   style="color:#95a5a6;line-height: inherit"></i>
									<i class="fa fa-list-ol fa-stack-1x"
									   aria-hidden="true"
									   style="color:rgb(255,255,255);line-height:inherit"></i>
								</span>
								Most Recent Orders
							</div>
						</div>
						<div class="portlet-body">
							<el-table :data="mostRecentOrders">
								<el-table-column type="expand">
									<template slot-scope="props">
										<div class="row-expansion">
											<p class="row-expansion-data">Total spent: {{ formatUSD(props.row.user.total_spent) }}</p>
											<p class="row-expansion-data">No. of orders: {{ props.row.user.total_orders }}</p>
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="user.email"
								                 label="User"
								                 sortable>
								</el-table-column>
								<el-table-column prop="total"
								                 label="Amount"
								                 :formatter="tableFormatUSD"
								                 sortable>
								</el-table-column>
								<el-table-column prop="location_name"
								                 label="Store"
								                 sortable>
								</el-table-column>
								<el-table-column prop="status"
								                 label="Status"
								                 :filters="[{ text: 'pending', value: 'pending' }, { text: 'completed', value: 'completed' }, { text: 'overdue', value: 'overdue' }, { text: 'cancelled', value: 'cancelled' }, { text: 'refunded', value: 'refunded' }]"
								                 :filter-method="filterTag"
								                 filter-placement="bottom-end"
								                 sortable>
									<template slot-scope="scope">
										<p :class="{'status-submitted': scope.row.status === 'submitted', 'status-pending': scope.row.status === 'pending', 'status-completed': scope.row.status === 'completed', 'status-overdue': scope.row.status === 'overdue', 'status-cancelled': scope.row.status === 'cancelled', 'status-refunded': scope.row.status === 'refunded'}">{{scope.row.status}}</p>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AnalyticsFunctions from '../../../controllers/Analytics'
import AppFunctions from '../../../controllers/App'
import { GoogleCharts } from 'google-charts'

export default {
	data () {
		return {
			loadingLocationRevenueSummary: false,
			locationRevenueSummary: {
				total_revenue: 0,
				today_revenue: 0,
				week_revenue: 0,
				month_revenue: 0,
				year_revenue: 0
			},
			grsErrorMessage: '',
			loadingMostRecentOrders: false,
			mostRecentOrders: [],
			gosErrorMessage: '',
			loadingTop10GlobalOrders: false,
			locationOrdersSummary: {
				total_order: 0,
				daily_order: 0,
				weekly_order: 0,
				monthly_order: 0
			},
			loadingLocationItemSummary: false,
			locationItemSummary: [],
			lisErrorMessage: '',
			t10giErrorMessage: '',
			globalRevenueByDay: null,
			lrbdErrorMessage: '',
			stores: [],
			selectedLocations: [
				{
					label: this.$root.activeLocation.display_name,
					value: this.$root.activeLocation.id
				}
			],
			chartTitle: '',
			searchPeriod: 'week',
			from_date: '',
			to_date: ''
		}
	},
	computed: {
		totals () {
			let show = false
			let revenue = 0
			let orders = 0
			if (this.globalRevenueByDay !== null) {
				show = true
				const values = [...this.globalRevenueByDay]
				values.shift()
				values.forEach(day => {
					revenue = revenue + day[1]
					orders = orders + day[2]
				})
			}
			return {
				show,
				revenue: this.formatUSD(revenue),
				orders: this.formatNumber(orders)
			}
		}
	},
	watch: {
		'$root.activeLocation' (newLocation) {
			this.locationChanged(newLocation)
		}
	},
	created () {
		this.locationChanged(this.$root.activeLocation)
	},
	methods: {
		/**
		 * To save data as a CSV
		 * @function
		 * @param {array} dataSource - An array of objects containing summary data
		 * @returns {undefined}
		 */
		downloadCSV (dataSource) {
			var data = [...dataSource]

			let strip = function (text) {
				return text.toString().replace(',', ' ')
			}

			// Each CSV column is separated by ";" and new line "\n" for next row
			var csvContent = 'Name,Price,Total sales,SKU,Category\n'
			data.forEach(function (row, index) {
				let dataString = `${strip(row.name)},${strip(row.actual_price)},${strip(
					row.total_sale
				)},${strip(row.item_sku)},${strip(row.category)}`
				csvContent += index < data.length ? dataString + '\n' : dataString
			})

			/* eslint-disable no-undef */
			// The download function takes a CSV string, the filename and mimeType as parameters
			var download = function (content, fileName, mimeType) {
				var a = document.createElement('a')
				mimeType = mimeType || 'application/octet-stream'

				if (navigator.msSaveBlob) {
					// IE10
					navigator.msSaveBlob(
						new Blob([content], {
							type: mimeType
						}),
						fileName
					)
				} else if (URL && 'download' in a) {
					// html5 A[download]
					a.href = URL.createObjectURL(
						new Blob([content], {
							type: mimeType
						})
					)
					a.setAttribute('download', fileName)
					document.body.appendChild(a)
					a.click()
					document.body.removeChild(a)
				} else {
					location.href =
						'data:application/octet-stream,' + encodeURIComponent(content) // only this mime type is supported
				}
			}

			download(csvContent, 'Top10Items.csv', 'text/csv;encoding:utf-8')
			/* eslint-enable no-undef */
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		weekSelected () {
			if (this.searchPeriod === 'week') {
				this.getLocationRevenueByDay()
			}
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		dateFromSelected () {
			if (this.to_date.length) {
				this.getLocationRevenueByDay()
			}
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		dateToSelected () {
			if (this.from_date.length) {
				this.getLocationRevenueByDay()
			}
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @param {array} selectedLocations - The selected locations
		 * @returns {undefined}
		 */
		updateLocations (selectedLocations) {
			if (selectedLocations.length) {
				this.setChartTitle()
				this.getLocationRevenueByDay()
			}
		},
		/**
		 * To set the title for the chart
		 * @function
		 * @returns {undefined}
		 */
		setChartTitle () {
			if (this.selectedLocations.length === 0) {
				return
			} else if (this.selectedLocations.length === 1) {
				this.chartTitle = this.selectedLocations[0].label
			} else {
				this.chartTitle = `${this.selectedLocations[0].label} and ${this
					.selectedLocations.length - 1} ${
					this.selectedLocations.length - 1 === 1
						? 'other store'
						: 'other stores'
				}`
			}
		},
		/**
		 * To respond to a change of location.
		 * @function
		 * @param {object} newLocation - The new active location object
		 * @returns {undefined}
		 */
		locationChanged (newLocation) {
			if (newLocation.id) {
				this.selectedLocations = [
					{
						label: newLocation.display_name,
						value: newLocation.id
					}
				]
				this.getLocationRevenueSummary()
				this.getMostRecentOrders()
				this.getLocationOrdersSummary()
				this.getLocationItemSummary()
				this.getStores()
				window.scrollTo(0, 0)
			}
		},
		/**
		 * To filter table rows through a tag
		 * @function
		 * @param {string} value - The value of the filter
		 * @param {string} row - The row being considered
		 * @returns {bool} A boolean representing if the row passed or failed the filter test
		 */
		filterTag (value, row) {
			return row.status === value
		},
		/**
		 * To format a number
		 * @function
		 * @param {string} val - The number to format
		 * @returns {string} The formatted currency amount
		 */
		formatNumber (val) {
			if (val !== null && val !== undefined) {
				return val.toLocaleString('en-US', { style: 'decimal' })
			} else {
				return 'n/a'
			}
		},
		/**
		 * To format a number as currency
		 * @function
		 * @param {string} val - The number to format
		 * @returns {string} The formatted currency amount
		 */
		formatUSD (val) {
			if (val !== null && val !== undefined) {
				let local = Number(val)
				local = local.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD'
				})
				return local
			} else {
				return 'n/a'
			}
		},
		/**
		 * el-table compliant cell data formatting function
		 * @function
		 * @param {object} row - The row to format
		 * @param {object} column - The column to format
		 * @returns {string} The formatted currency amount
		 */
		tableFormatNumber (row, column) {
			return this.formatNumber(row.total_sale)
		},
		/**
		 * el-table compliant cell data formatting function
		 * @function
		 * @param {object} row - The row to format
		 * @param {object} column - The column to format
		 * @returns {string} The formatted currency amount
		 */
		tableFormatUSD (row, column) {
			return this.formatUSD(row.total)
		},
		/**
		 * el-table compliant cell data formatting function
		 * @function
		 * @param {object} row - The row to format
		 * @param {object} column - The column to format
		 * @returns {string} The formatted currency amount
		 */
		formatItemPrice (row, column) {
			return this.formatUSD(row.actual_price)
		},
		/**
		 * To get global revenue summary data
		 * @function
		 * @returns {undefined}
		 */
		getLocationRevenueSummary () {
			this.loadingLocationRevenueSummary = true
			var analyticsVue = this
			return AnalyticsFunctions.locationRevenueSummary(
				analyticsVue.$root.appId,
				analyticsVue.$root.appSecret,
				analyticsVue.$root.userToken,
				analyticsVue.$root.activeLocation.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						analyticsVue.locationRevenueSummary.total_revenue =
							response.payload[0].total_revenue
						analyticsVue.locationRevenueSummary.today_revenue =
							response.payload[0].today_revenue
						analyticsVue.locationRevenueSummary.week_revenue =
							response.payload[0].week_revenue
						analyticsVue.locationRevenueSummary.month_revenue =
							response.payload[0].month_revenue
						analyticsVue.locationRevenueSummary.year_revenue =
							response.payload[0].year_revenue
						analyticsVue.loadingLocationRevenueSummary = false
					} else {
						analyticsVue.loadingLocationRevenueSummary = false
					}
				})
				.catch(reason => {
					if (
						reason.responseJSON.code === 401 &&
						reason.responseJSON.status === 'unauthorized'
					) {
						analyticsVue.$router.push('/login/expired')
						return
					}
					analyticsVue.loadingLocationRevenueSummary = false
					if (reason.responseJSON) {
						analyticsVue.grsErrorMessage = reason.responseJSON.message
					}
				})
		},
		/**
		 * To get global orders summary data
		 * @function
		 * @returns {undefined}
		 */
		getMostRecentOrders () {
			this.loadingMostRecentOrders = true
			var analyticsVue = this
			return AnalyticsFunctions.locationMostRecentOrders(
				analyticsVue.$root.appId,
				analyticsVue.$root.appSecret,
				analyticsVue.$root.userToken,
				analyticsVue.$root.activeLocation.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						analyticsVue.mostRecentOrders = response.payload
						analyticsVue.loadingMostRecentOrders = false
					} else {
						analyticsVue.loadingMostRecentOrders = false
					}
				})
				.catch(reason => {
					if (
						reason.responseJSON.code === 401 &&
						reason.responseJSON.status === 'unauthorized'
					) {
						analyticsVue.$router.push('/login/expired')
						return
					}
					analyticsVue.loadingMostRecentOrders = false
					if (reason.responseJSON) {
						analyticsVue.gosErrorMessage = reason.responseJSON.message
					}
				})
		},
		/**
		 * To get global revenue summary data
		 * @function
		 * @returns {undefined}
		 */
		getLocationOrdersSummary () {
			this.loadingTop10GlobalOrders = true
			var analyticsVue = this
			return AnalyticsFunctions.locationOrdersSummary(
				analyticsVue.$root.appId,
				analyticsVue.$root.appSecret,
				analyticsVue.$root.userToken,
				analyticsVue.$root.activeLocation.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						analyticsVue.locationOrdersSummary.total_order =
							response.payload.total_order
						analyticsVue.locationOrdersSummary.daily_order =
							response.payload.daily_order
						analyticsVue.locationOrdersSummary.weekly_order =
							response.payload.weekly_order
						analyticsVue.locationOrdersSummary.monthly_order =
							response.payload.monthly_order
						analyticsVue.locationOrdersSummary.yearly_order =
							response.payload.yearly_order
						analyticsVue.loadingTop10GlobalOrders = false
					} else {
						analyticsVue.loadingTop10GlobalOrders = false
					}
				})
				.catch(reason => {
					if (
						reason.responseJSON.code === 401 &&
						reason.responseJSON.status === 'unauthorized'
					) {
						analyticsVue.$router.push('/login/expired')
						return
					}
					analyticsVue.loadingTop10GlobalOrders = false
					if (reason.responseJSON) {
						analyticsVue.t10giErrorMessage = reason.responseJSON.message
					}
				})
		},
		/**
		 * To get global revenue summary data
		 * @function
		 * @returns {undefined}
		 */
		getLocationRevenueByDay () {
			this.loadingGlobalRevenueByDay = true
			this.setChartTitle()

			var analyticsVue = this
			let requestParams = {
				location_id: this.selectedLocations.map(x => x.value),
				search_type: this.searchPeriod
			}
			if (this.searchPeriod === 'custom') {
				requestParams.from_date = this.from_date
				requestParams.to_date = this.to_date
			}

			return AnalyticsFunctions.globalRevenueByDay(
				analyticsVue.$root.appId,
				analyticsVue.$root.appSecret,
				analyticsVue.$root.userToken,
				requestParams
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						let payload = [['Day', 'Revenue', 'Orders']]
						response.payload.forEach(day => {
							payload.push([day.date, Number(day.sales_per_day), day.total])
						})
						if (payload.length === 1) {
							payload.push([
								`No orders at ${
									analyticsVue.selectedLocations.length > 1 ? 'this' : 'these'
								} location${
									analyticsVue.selectedLocations.length > 1 ? 's' : ''
								} during this period`,
								0,
								0
							])
						}
						analyticsVue.globalRevenueByDay = payload

						analyticsVue.drawChart()
						analyticsVue.loadingGlobalRevenueByDay = false
					} else {
						analyticsVue.loadingGlobalRevenueByDay = false
					}
				})
				.catch(reason => {
					if (
						reason.responseJSON.code === 401 &&
						reason.responseJSON.status === 'unauthorized'
					) {
						analyticsVue.$router.push('/login/expired')
						return
					}
					analyticsVue.loadingGlobalRevenueByDay = false
					if (reason.responseJSON) {
						analyticsVue.lrbdErrorMessage = reason.responseJSON.message
					}
				})
		},
		/**
		 * To get item sales data.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getLocationItemSummary () {
			this.loadingLocationItemSummary = true
			var analyticsVue = this
			return AnalyticsFunctions.getLocationItemSummary(
				analyticsVue.$root.appId,
				analyticsVue.$root.appSecret,
				analyticsVue.$root.userToken,
				analyticsVue.$root.activeLocation.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						analyticsVue.locationItemSummary = response.payload
						analyticsVue.loadingLocationItemSummary = false
					} else {
						analyticsVue.loadingLocationItemSummary = false
					}
				})
				.catch(reason => {
					if (
						reason.responseJSON.code === 401 &&
						reason.responseJSON.status === 'unauthorized'
					) {
						analyticsVue.$router.push('/login/expired')
						return
					}
					analyticsVue.loadingLocationItemSummary = false
					if (reason.responseJSON) {
						analyticsVue.lisErrorMessage = reason.responseJSON.message
					}
				})
		},
		/**
		 * To get a list of store for the current application/business.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStores () {
			var analyticsVue = this

			AppFunctions.getStoreLocations(
				analyticsVue.$root.appId,
				analyticsVue.$root.appSecret,
				analyticsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						analyticsVue.stores = response.payload.map(store => {
							return { value: store.id, label: store.display_name }
						})
						if (analyticsVue.stores.length) {
							analyticsVue.updateLocations(analyticsVue.selectedLocations)
						}
						analyticsVue.displaySpinner = false
					}
				})
				.catch(reason => {
					if (
						reason.responseJSON.code === 401 &&
						reason.responseJSON.status === 'unauthorized'
					) {
						analyticsVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
					}
					analyticsVue.displaySpinner = false
					throw reason
				})
		},
		/**
		 * To render the chart
		 * @function
		 * @returns {undefined}
		 */
		drawChart () {
			let analyticsVue = this

			// load library and call back the actual draw function
			GoogleCharts.load(function () {
				var data = GoogleCharts.api.visualization.arrayToDataTable(
					analyticsVue.globalRevenueByDay
				)

				function formatUSDlabel (column, dataTable, row) {
					try {
						return (
							'$' +
							dataTable.getFormattedValue(row, column).toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})
						)
					} catch (e) {
						console.log(e)
						return ''
					}
				}

				var view = new GoogleCharts.api.visualization.DataView(data)
				view.setColumns([
					0,
					1,
					{
						calc: formatUSDlabel.bind(undefined, 1),
						sourceColumn: 1,
						type: 'string',
						role: 'annotation'
					},
					2,
					{
						calc: 'stringify',
						sourceColumn: 2,
						type: 'string',
						role: 'annotation'
					}
				])

				var options = {
					title: analyticsVue.chartTitle,
					titleTextStyle: {
						fontSize: 20,
						color: '#5a5e66'
					},
					hAxis: {
						titleTextStyle: {
							color: '#333'
						},
						color: '#000'
					},
					vAxis: {
						minValue: 0
					},
					pointSize: 8,
					animation: {
						startup: true,
						easing: 'inAndOut',
						duration: 200
					},
					curveType: 'function',
					legend: { position: 'bottom' },
					series: {
						0: { color: '#3498db' },
						1: { color: '#e67e22' }
					}
				}
				var chart = new GoogleCharts.api.visualization.BarChart(
					document.getElementById('chart_div')
				)
				chart.draw(view, options)
			})
		}
	}
}
</script>

<style scoped>
.row-expansion {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.row-expansion-data {
  margin: 0 80px 0 0;
  display: inline-block;
}

.tbl-category-column-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100px;
}
.tbl-category-caption-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
}
.tbl-category-name {
  margin: 0;
}
.tbl-category-image {
  margin: 0;
  max-width: 100%;
  max-height: 80%;
}
.status-submitted {
  display: inline-block;
  margin: 0;
  padding: 3px;
  background-color: rgb(218, 218, 218);
  color: rgb(70, 74, 78);
  border: 1px rgb(173, 173, 173) solid;
  border-radius: 4px;
}
.status-pending {
  display: inline-block;
  margin: 0;
  padding: 3px;
  background-color: rgb(209, 236, 241);
  color: rgb(70, 74, 78);
  border: 1px rgb(190, 229, 235) solid;
  border-radius: 4px;
}
.status-completed {
  display: inline-block;
  margin: 0;
  padding: 3px;
  background-color: rgb(212, 237, 218);
  color: rgb(21, 87, 36);
  border: 1px rgb(195, 230, 203) solid;
  border-radius: 4px;
}
.status-overdue {
  display: inline-block;
  margin: 0;
  padding: 3px;
  background-color: rgb(255, 243, 205);
  color: rgb(133, 100, 4);
  border: 1px rgb(255, 238, 186) solid;
  border-radius: 4px;
}
.status-cancelled {
  display: inline-block;
  margin: 0;
  padding: 3px;
  background-color: rgb(248, 215, 218);
  color: rgb(114, 28, 36);
  border: 1px rgb(245, 198, 203) solid;
  border-radius: 4px;
}
.status-refunded {
  display: inline-block;
  margin: 0;
  padding: 3px;
  background-color: rgb(214, 216, 217);
  color: rgb(27, 30, 33);
  border: 1px rgb(198, 200, 202) solid;
  border-radius: 4px;
}
.revenue-tracker-totals {
	font-family: 'Arial', sans-serif;
	font-size: 13px;
	color: rgb(34, 34, 34);
}
</style>

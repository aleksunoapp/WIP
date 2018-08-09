<template>
	<div>
		<div class="row">
			<div class="col-xs-3">  	      		
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption" style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x" aria-hidden="true" style="color:rgb(26,188,156);line-height: inherit"></i>
								<i class="fa fa-usd fa-stack-1x" aria-hidden="true" style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Today
						</div>
					</div>
					<div class="portlet-body">
						<div 
							style="font-size: 20px;color:rgb(26,188,156);text-align: center;"> 
							<span v-if="formatUSD(globalRevenueSummary.today_revenue) !== 'n/a'">
								{{ formatUSD(globalRevenueSummary.today_revenue) }} in 
							</span>
								{{ formatNumber(top10globalItems.daily_order) }} order<span v-show="top10globalItems.daily_order !== 1">s</span>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-3">  	      		
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption" style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x" aria-hidden="true" style="color:#3498db;line-height: inherit"></i>
								<i class="fa fa-usd fa-stack-1x" aria-hidden="true" style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Week
						</div>
					</div>
					<div class="portlet-body">
						<div 
							style="font-size: 20px;color:#3498db;text-align: center;"> 
							<span v-if="formatUSD(globalRevenueSummary.week_revenue) !== 'n/a'">
								{{ formatUSD(globalRevenueSummary.week_revenue) }} in 
							</span>
								{{ formatNumber(top10globalItems.weekly_order) }} order<span v-show="top10globalItems.weekly_order !== 1">s</span>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-3">  	      		
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption" style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x" aria-hidden="true" style="color:#e67e22;line-height: inherit"></i>
								<i class="fa fa-usd fa-stack-1x" aria-hidden="true" style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Month
						</div>
					</div>
					<div class="portlet-body">
						<div 
							style="font-size: 20px;color:#e67e22;text-align: center;"> 
							<span v-if="formatUSD(globalRevenueSummary.month_revenue) !== 'n/a'">
								{{ formatUSD(globalRevenueSummary.month_revenue) }} in 
							</span>
								{{ formatNumber(top10globalItems.monthly_order) }} order<span v-show="top10globalItems.monthly_order !== 1">s</span>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-3">  	      		
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption" style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x" aria-hidden="true" style="color:#9b59b6;line-height: inherit"></i>
								<i class="fa fa-usd fa-stack-1x" aria-hidden="true" style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Year
						</div>
					</div>
					<div class="portlet-body">
						<div 
							style="font-size: 20px;color:#9b59b6;text-align: center;"> 
							<span v-if="formatUSD(globalRevenueSummary.year_revenue) !== 'n/a'">
								{{ formatUSD(globalRevenueSummary.year_revenue) }} in 
							</span>
								{{ formatNumber(top10globalItems.yearly_order) }} order<span v-show="top10globalItems.yearly_order !== 1">s</span>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-12">
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption" style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x" aria-hidden="true" style="color:#F2B230;line-height: inherit"></i>
								<i class="fa fa-usd fa-stack-1x" aria-hidden="true" style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Total
						</div>
					</div>
					<div class="portlet-body">
						<div 
							style="font-size: 20px;color:#F2B230;text-align: center;"> 
							<span v-if="formatUSD(globalRevenueSummary.total_revenue) !== 'n/a'">
								{{ formatUSD(globalRevenueSummary.total_revenue) }} in 
							</span>
								{{ formatNumber(top10globalItems.total_order) }} order<span v-show="top10globalItems.total_order !== 1">s</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">  	      		
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption" style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x" aria-hidden="true" style="color:#409EFF;line-height: inherit"></i>
								<i class="fa fa-line-chart fa-stack-1x" aria-hidden="true" style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Revenue Tracker
						</div>
					</div>
					<div class="portlet-body">
						<div class="row">
							<div class="col-md-10 col-md-offset-1">
								<el-select 
									class="pull-right full-width"
									v-model="selectedLocations" 
									filterable 
									multiple 
									@change="updateLocations" 
									placeholder="Select store">
									<el-option
										v-for="store in stores"
										:key="store.value"
										:label="store.label"
										:value="store">
										</el-option>
								</el-select>
							</div>
							<div class="col-md-10 col-md-offset-1 margin-top-10 center">
								<el-radio-group v-model="searchPeriod"  @change="weekSelected()">
									<el-radio-button label="week">week</el-radio-button>
									<el-radio-button label="custom">custom</el-radio-button>
								</el-radio-group>
								<el-date-picker 
									v-show="searchPeriod === 'custom'"
									v-model="from_date" 
									@change="dateFromSelected()"
									:editable="false"
									type="date" 
									format="yyyy-MM-dd" 
									value-format="yyyy-MM-dd" 
									:clearable="false" 
									placeholder="From"></el-date-picker>
								<el-date-picker 
									v-show="searchPeriod === 'custom'"
									v-model="to_date" 
									@change="dateToSelected()"
									type="date" 
									format="yyyy-MM-dd" 
									value-format="yyyy-MM-dd" 
									:clearable="false" 
									placeholder="To"></el-date-picker>
							</div>
							<div class="col-md-12" id="chart_div" style="height:350px"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">  	      		
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption" style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x" aria-hidden="true" style="color:#95a5a6;line-height: inherit"></i>
								<i class="fa fa-list-ol fa-stack-1x" aria-hidden="true" style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Most Recent Orders
						</div>
					</div>
					<div class="portlet-body">
						<el-table
							:data="mostRecentOrders">
							<el-table-column type="expand">
								<template slot-scope="props">
									<div class="row-expansion">
										<p class="row-expansion-data">Total spent: {{ formatUSD(props.row.user.total_spent) }}</p>
										<p class="row-expansion-data">No. of orders: {{ props.row.user.total_orders }}</p>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								prop="user.email"
								label="User"
								sortable>
							</el-table-column>
							<el-table-column
								prop="total"
								label="Amount"
								:formatter="tableFormatUSD"
								sortable>
							</el-table-column>
							<el-table-column
								prop="location_name"
								label="Store"
								sortable>
							</el-table-column>
							<el-table-column
								prop="status"
								label="Status"
								:filters="[{ text: 'pending', value: 'pending' }, { text: 'completed', value: 'completed' }, { text: 'overdue', value: 'overdue' }, { text: 'cancelled', value: 'cancelled' }, { text: 'refunded', value: 'refunded' }]"
								:filter-method="filterTag"
								filter-placement="bottom-end"
								sortable>
								<template slot-scope="scope">
									<p :class="{'status-pending': scope.row.status === 'pending', 'status-completed': scope.row.status === 'completed', 'status-overdue': scope.row.status === 'overdue', 'status-cancelled': scope.row.status === 'cancelled', 'status-refunded': scope.row.status === 'refunded'}">{{scope.row.status}}</p>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AnalyticsFunctions from '../../../controllers/Analytics'
import AppFunctions from '../../../controllers/App'
import {GoogleCharts} from 'google-charts'

export default {
	data () {
		return {
			loadingGlobalRevenueSummary: false,
			globalRevenueSummary: {
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
			top10globalItems: {
				total_order: 0,
				daily_order: 0,
				weekly_order: 0,
				monthly_order: 0
			},
			t10giErrorMessage: '',
			globalRevenueByDay: [
				['Day', 'Revenue', 'Orders'],
				[0, 0, 0]
			],
			grbdErrorMessage: '',
			stores: [],
			selectedLocations: [],
			chartTitle: '',
			searchPeriod: 'week',
			from_date: '',
			to_date: ''
		}
	},
	created () {
		window.addEventListener('resize', x => { this.drawChart() })

		this.getGlobalRevenueSummary()
		this.getMostRecentOrders()
		this.getTop10globalItems()
		this.getStores()
	},
	methods: {
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		weekSelected () {
			if (this.searchPeriod === 'week') {
				this.getGlobalRevenueByDay()
			}
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		dateFromSelected () {
			if (this.to_date.length) {
				this.getGlobalRevenueByDay()
			}
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		dateToSelected () {
			if (this.from_date.length) {
				this.getGlobalRevenueByDay()
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
				this.getGlobalRevenueByDay()
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
				this.chartTitle = `${this.selectedLocations[0].label} and ${this.selectedLocations.length - 1} ${this.selectedLocations.length - 1 === 1 ? 'other store' : 'other stores'}`
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
				return val.toLocaleString('en-US', {style: 'decimal'})
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
				local = local.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
				if (local.indexOf('.') !== -1) {
					return local.slice(0, -3)
				} else {
					return local
				}
			} else {
				return 'n/a'
			}
		},
		/**
		 * GoogleCharts compliant bar chart label formatter
		 * @function
		 * @param {object} dataTable - The data table used in the chart
		 * @param {integer} rowIndex - The current row
		 * @returns {string} The formatted currency amount
		 */
		formatUSDlabel (dataTable, rowIndex) {
			return '$' + dataTable.hc[rowIndex][1].Cf.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
		},
		/**
		 * el-table compliant cell data formatting function
		 * @function
		 * @param {object} row - The row to format
		 * @param {object} column - The column to format
		 * @returns {string} The formatted currency amount
		 */
		tableFormatNumber (row, column) {
			return this.formatNumber(row.value)
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
		 * To get global revenue summary data
		 * @function
		 * @returns {undefined}
		 */
		getGlobalRevenueSummary () {
			this.loadingGlobalRevenueSummary = true
			var analyticsVue = this
			return AnalyticsFunctions.globalRevenueSummary(analyticsVue.$root.appId, analyticsVue.$root.appSecret, analyticsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					analyticsVue.globalRevenueSummary.total_revenue = response.payload.total_revenue
					analyticsVue.globalRevenueSummary.today_revenue = response.payload.today_revenue
					analyticsVue.globalRevenueSummary.week_revenue = response.payload.week_revenue
					analyticsVue.globalRevenueSummary.month_revenue = response.payload.month_revenue
					analyticsVue.globalRevenueSummary.year_revenue = response.payload.year_revenue
					analyticsVue.loadingGlobalRevenueSummary = false
				} else {
					analyticsVue.loadingGlobalRevenueSummary = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					analyticsVue.$router.push('/login/expired')
					return
				}
				analyticsVue.loadingGlobalRevenueSummary = false
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
			return AnalyticsFunctions.globalMostRecentOrders(analyticsVue.$root.appId, analyticsVue.$root.appSecret, analyticsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					analyticsVue.mostRecentOrders = response.payload
					analyticsVue.loadingMostRecentOrders = false
				} else {
					analyticsVue.loadingMostRecentOrders = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
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
		getTop10globalItems () {
			this.loadingTop10GlobalOrders = true
			var analyticsVue = this
			return AnalyticsFunctions.globalTop10Items(analyticsVue.$root.appId, analyticsVue.$root.appSecret, analyticsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					analyticsVue.top10globalItems.total_order = response.payload.total_order
					analyticsVue.top10globalItems.daily_order = response.payload.daily_order
					analyticsVue.top10globalItems.weekly_order = response.payload.weekly_order
					analyticsVue.top10globalItems.monthly_order = response.payload.monthly_order
					analyticsVue.top10globalItems.yearly_order = response.payload.yearly_order
					analyticsVue.loadingTop10GlobalOrders = false
				} else {
					analyticsVue.loadingTop10GlobalOrders = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
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
		getGlobalRevenueByDay () {
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

			return AnalyticsFunctions.globalRevenueByDay(analyticsVue.$root.appId, analyticsVue.$root.appSecret, analyticsVue.$root.userToken, requestParams).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					let payload = [['Day', 'Revenue', 'Orders']]
					response.payload.forEach((day) => {
						payload.push([day.date, Number(day.sales_per_day), day.total])
					})
					if (payload.length === 1) {
						payload.push([`No orders at ${analyticsVue.selectedLocations.length > 1 ? 'this' : 'these'} location${analyticsVue.selectedLocations.length > 1 ? 's' : ''} during this period`, 0, 0])
					}
					analyticsVue.globalRevenueByDay = payload

					analyticsVue.drawChart()
					analyticsVue.loadingGlobalRevenueByDay = false
				} else {
					analyticsVue.loadingGlobalRevenueByDay = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					analyticsVue.$router.push('/login/expired')
					return
				}
				analyticsVue.loadingGlobalRevenueByDay = false
				if (reason.responseJSON) {
					analyticsVue.grbdErrorMessage = reason.responseJSON.message
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

			AppFunctions.getStoreLocations(analyticsVue.$root.appId, analyticsVue.$root.appSecret, analyticsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					analyticsVue.stores = response.payload.map(store => {
						return { value: store.id, label: store.display_name }
					})
					if (analyticsVue.stores.length) {
						analyticsVue.selectedLocations.push(analyticsVue.stores[0])
						analyticsVue.updateLocations(analyticsVue.selectedLocations)
					}
					analyticsVue.displaySpinner = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					analyticsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
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
				var data = GoogleCharts.api.visualization.arrayToDataTable(analyticsVue.globalRevenueByDay)

				var view = new GoogleCharts.api.visualization.DataView(data)
				view.setColumns([0, 1, {
					calc: analyticsVue.formatUSDlabel,
					sourceColumn: 1,
					type: 'string',
					role: 'annotation'
				}, 2, {
					calc: 'stringify',
					sourceColumn: 2,
					type: 'string',
					role: 'annotation'
				}])

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
				var chart = new GoogleCharts.api.visualization.BarChart(document.getElementById('chart_div'))
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
.full-width {
	width: 100%;
}
</style>

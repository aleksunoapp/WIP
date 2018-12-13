<template>
	<div>
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
								<i class="fa fa-user fa-stack-1x"
								   aria-hidden="true"
								   style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							New User Registrations by Month
						</div>
					</div>
					<div class="portlet-body">
						<div class="row">
							<div class="col-md-12 center">
								<el-date-picker v-model="from_date"
								                @change="dateFromSelected()"
								                :editable="false"
								                type="date"
								                format="yyyy-MM-dd"
								                value-format="yyyy-MM-dd"
								                :clearable="false"
								                placeholder="From"></el-date-picker>
								<el-date-picker v-model="to_date"
								                @change="dateToSelected()"
								                type="date"
								                format="yyyy-MM-dd"
								                value-format="yyyy-MM-dd"
								                :clearable="false"
								                placeholder="To"></el-date-picker>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div id="chart_div"
								     style="height:350px"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption"
						     style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x"
								   aria-hidden="true"
								   style="color:#e67e22;line-height: inherit"></i>
								<i class="fa fa-user fa-stack-1x"
								   aria-hidden="true"
								   style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Users by Platform
						</div>
					</div>
					<div class="portlet-body">
						<div class="row">
							<div class="col-md-12">
								<div id="chart_div_usersByPlatform"
								     style="height:350px"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-6">
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption"
						     style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x"
								   aria-hidden="true"
								   style="color:#9b59b6;line-height: inherit"></i>
								<i class="fa fa-user fa-stack-1x"
								   aria-hidden="true"
								   style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Active Users
						</div>
					</div>
					<div class="portlet-body">
						<div class="row">
							<div class="col-md-12">
								<div id="chart_div_activeUsers"
								     style="height:350px"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption"
						     style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x"
								   aria-hidden="true"
								   style="color:#e67e22;line-height: inherit"></i>
								<i class="fa fa-user fa-stack-1x"
								   aria-hidden="true"
								   style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Users by Order Count
						</div>
					</div>
					<div class="portlet-body">
						<div class="row">
							<div class="col-md-12 center">
								<el-date-picker v-model="order_count_from_date"
								                @change="orderCountDateFromSelected()"
								                :editable="false"
								                type="date"
								                format="yyyy-MM-dd"
								                value-format="yyyy-MM-dd"
								                :clearable="false"
								                placeholder="From"></el-date-picker>
								<el-date-picker v-model="order_count_to_date"
								                @change="orderCountDateToSelected()"
								                type="date"
								                format="yyyy-MM-dd"
								                value-format="yyyy-MM-dd"
								                :clearable="false"
								                placeholder="To"></el-date-picker>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div id="chart_div_usersByOrderCount"
								     style="height:350px"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AnalyticsFunctions from '../../../controllers/Analytics'
import { GoogleCharts } from 'google-charts'

export default {
	data () {
		return {
			loadingUserBasics: false,
			usersByPlatform: [['Platform', 'Users']],
			activeUsers: [['Category', 'Users']],
			ubErrorMessage: '',
			loadingUsersByMonth: false,
			usersByMonth: [['Month', 'Users']],
			ubmErrorMessage: '',
			from_date: '',
			to_date: '',
			loadingUsersByOrderCount: false,
			usersByOrderCount: [['Orders', 'Users']],
			ubocErrorMessage: '',
			order_count_from_date: '',
			order_count_to_date: ''
		}
	},
	created () {
		let today = new Date()
		this.from_date = `${today.getFullYear()}-01-01`
		this.to_date = `${today.getFullYear()}-12-31`
		this.order_count_from_date = `${today.getFullYear()}-01-01`
		this.order_count_to_date = `${today.getFullYear()}-12-31`

		this.getUserBasics()
		this.getUsersByMonth()
		this.getUsersByOrderCount()
	},
	methods: {
		/**
		 * To format a number
		 * @function
		 * @param {integer} number - The number to format
		 * @returns {string} The formatted number
		 */
		formatNumber (number) {
			try {
				return number.toLocaleString('en-US', { style: 'decimal' })
			} catch (err) {
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
		 * To convert a month number to name
		 * @function
		 * @param {integer} number - The month name
		 * @returns {string} The month name
		 */
		convertToMonthName (number) {
			switch (number) {
			case 1:
				return 'Jan'
			case 2:
				return 'Feb'
			case 3:
				return 'Mar'
			case 4:
				return 'Apr'
			case 5:
				return 'May'
			case 6:
				return 'Jun'
			case 7:
				return 'Jul'
			case 8:
				return 'Aug'
			case 9:
				return 'Sep'
			case 10:
				return 'Oct'
			case 11:
				return 'Nov'
			case 12:
				return 'Dec'
			default:
				return ''
			}
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		dateFromSelected () {
			if (this.to_date.length) {
				this.getUsersByMonth()
			}
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		dateToSelected () {
			if (this.from_date.length) {
				this.getUsersByMonth()
			}
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		orderCountDateFromSelected () {
			if (this.order_count_to_date.length) {
				this.getUsersByOrderCount()
			}
		},
		/**
		 * To determine if a data update is necessary
		 * @function
		 * @returns {undefined}
		 */
		orderCountDateToSelected () {
			if (this.order_count_from_date.length) {
				this.getUsersByOrderCount()
			}
		},
		/**
		 * To get basic user data
		 * @function
		 * @returns {undefined}
		 */
		getUserBasics () {
			this.loadingUsersByPlatform = true
			this.loadingActiveUsers = true
			var analyticsVue = this
			return AnalyticsFunctions.getUserBasics(
				analyticsVue.$root.appId,
				analyticsVue.$root.appSecret,
				analyticsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						analyticsVue.usersByPlatform.push(
							[`iOS (${response.payload.total_ios_user.toLocaleString('en-US', {style: 'decimal'})})`, response.payload.total_ios_user],
							[`Android (${response.payload.total_android_user.toLocaleString('en-US', {style: 'decimal'})})`, response.payload.total_android_user],
							[`Web (${response.payload.total_web_user.toLocaleString('en-US', {style: 'decimal'})})`, response.payload.total_web_user],
							[
								`Total: ${analyticsVue.formatNumber(
									response.payload.total_user
								)}`,
								0
							]
						)
						analyticsVue.loadingUsersByPlatform = false
						analyticsVue.drawUsersByPlatform()

						analyticsVue.activeUsers.push(
							['Daily', response.payload.daily_user],
							['Weekly', response.payload.weekly_user],
							['Monthly', response.payload.monthly_user]
						)
						analyticsVue.loadingActiveUsers = false
						analyticsVue.drawActiveUsers()
					} else {
						analyticsVue.loadingUserBasics = false
						analyticsVue.loadingActiveUsers = false
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
					analyticsVue.loadingUserBasics = false
					if (reason.responseJSON) {
						analyticsVue.ubErrorMessage = reason.responseJSON.message
					}
				})
		},
		/**
		 * To get users monthly summary
		 * @function
		 * @returns {undefined}
		 */
		getUsersByMonth () {
			this.loadingUsersByMonth = true
			var analyticsVue = this
			let payload = {
				from_date: analyticsVue.from_date,
				to_date: analyticsVue.to_date
			}

			return AnalyticsFunctions.getUsersByMonth(
				analyticsVue.$root.appId,
				analyticsVue.$root.appSecret,
				analyticsVue.$root.userToken,
				payload
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						analyticsVue.usersByMonth = [['Month', 'Users']]
						response.payload
							.sort((a, b) => {
								a.month - b.month
							})
							.forEach(month => {
								let entry = [
									analyticsVue.convertToMonthName(month.month),
									month.no_of_user
								]
								analyticsVue.usersByMonth.push(entry)
							})
						analyticsVue.loadingUsersByMonth = false
						analyticsVue.drawMonthlySummary()
					} else {
						analyticsVue.loadingUsersByMonth = false
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
					analyticsVue.loadingUsersByMonth = false
					if (reason.responseJSON) {
						analyticsVue.ubmErrorMessage = reason.responseJSON.message
					}
				})
		},
		/**
		 * To get users monthly summary
		 * @function
		 * @returns {undefined}
		 */
		getUsersByOrderCount () {
			this.loadingUsersByOrderCount = true
			var analyticsVue = this
			let payload = {
				from_date: analyticsVue.order_count_from_date,
				to_date: analyticsVue.order_count_to_date
			}

			return AnalyticsFunctions.getUsersByOrderCount(
				analyticsVue.$root.appId,
				analyticsVue.$root.appSecret,
				analyticsVue.$root.userToken,
				payload
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						analyticsVue.usersByOrderCount = [['Orders', 'Users']]
						analyticsVue.usersByOrderCount.push(
							['1 order', response.payload.oneOrder],
							['2 orders', response.payload.twoOrder],
							['3 orders', response.payload.threeOrder],
							['over 3 orders', response.payload.moreThanThreeOrder],
							[
								`Total: ${analyticsVue.formatNumber(
									parseInt(response.payload.oneOrder) +
										parseInt(response.payload.twoOrder) +
										parseInt(response.payload.threeOrder) +
										parseInt(response.payload.moreThanThreeOrder)
								)}`,
								0
							]
						)
						analyticsVue.loadingUsersByOrderCount = false
						analyticsVue.drawUsersByOrderCount()
					} else {
						analyticsVue.loadingUsersByOrderCount = false
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
					analyticsVue.loadingUsersByOrderCount = false
					if (reason.responseJSON) {
						analyticsVue.ubocErrorMessage = reason.responseJSON.message
					}
				})
		},
		/**
		 * To render the monthly summary chart
		 * @function
		 * @returns {undefined}
		 */
		drawMonthlySummary () {
			let analyticsVue = this

			// load library and call back the actual draw function
			GoogleCharts.load(function () {
				var data = GoogleCharts.api.visualization.arrayToDataTable(
					analyticsVue.usersByMonth
				)

				function formatChartNumber (column, dataTable, row) {
					try {
						return (
							dataTable.getFormattedValue(row, column).toLocaleString('en-US', {
								style: 'decimal'
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
						calc: formatChartNumber.bind(undefined, 1),
						sourceColumn: 1,
						type: 'string',
						role: 'annotation'
					}
				])

				var options = {
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
					legend: { position: 'bottom' }
				}
				var chart = new GoogleCharts.api.visualization.BarChart(
					document.getElementById('chart_div')
				)
				chart.draw(view, options)
			})
		},
		/**
		 * To render the users by platform chart
		 * @function
		 * @returns {undefined}
		 */
		drawUsersByPlatform () {
			let analyticsVue = this

			// load library and call back the actual draw function
			GoogleCharts.load(function () {
				var data = GoogleCharts.api.visualization.arrayToDataTable(
					analyticsVue.usersByPlatform
				)

				function formatChartNumber (column, dataTable, row) {
					try {
						return (
							dataTable.getFormattedValue(row, column).toLocaleString('en-US', {
								style: 'decimal'
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
						calc: formatChartNumber.bind(undefined, 1),
						sourceColumn: 1,
						type: 'string',
						role: 'annotation'
					}
				])

				var options = {
					pieSliceText: 'value',
					sliceVisibilityThreshold: 0,
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
					legend: { position: 'bottom' },
					colors: ['#3366cc', '#dc3912', '#ff9900', '#ffffff']
				}
				var chart = new GoogleCharts.api.visualization.PieChart(
					document.getElementById('chart_div_usersByPlatform')
				)
				chart.draw(view, options)
			})
		},
		/**
		 * To render the users by platform chart
		 * @function
		 * @returns {undefined}
		 */
		drawUsersByOrderCount () {
			let analyticsVue = this

			// load library and call back the actual draw function
			GoogleCharts.load(function () {
				var data = GoogleCharts.api.visualization.arrayToDataTable(
					analyticsVue.usersByOrderCount
				)

				function formatChartNumber (column, dataTable, row) {
					try {
						return (
							dataTable.getFormattedValue(row, column).toLocaleString('en-US', {
								style: 'decimal'
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
						calc: formatChartNumber.bind(undefined, 1),
						sourceColumn: 1,
						type: 'string',
						role: 'annotation'
					}
				])

				var options = {
					pieSliceText: 'value',
					sliceVisibilityThreshold: 0,
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
					legend: { position: 'bottom' },
					colors: ['#3366cc', '#dc3912', '#ff9900', '#4CB944', '#ffffff']
				}
				var chart = new GoogleCharts.api.visualization.PieChart(
					document.getElementById('chart_div_usersByOrderCount')
				)
				chart.draw(view, options)
			})
		},
		/**
		 * To render the active users chart
		 * @function
		 * @returns {undefined}
		 */
		drawActiveUsers () {
			let analyticsVue = this

			// load library and call back the actual draw function
			GoogleCharts.load(function () {
				var data = GoogleCharts.api.visualization.arrayToDataTable(
					analyticsVue.activeUsers
				)

				function formatChartNumber (column, dataTable, row) {
					try {
						return (
							dataTable.getFormattedValue(row, column).toLocaleString('en-US', {
								style: 'decimal'
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
						calc: formatChartNumber.bind(undefined, 1),
						sourceColumn: 1,
						type: 'string',
						role: 'annotation'
					}
				])

				var options = {
					pieSliceText: 'value',
					sliceVisibilityThreshold: 0,
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
					legend: { position: 'bottom' }
				}
				var chart = new GoogleCharts.api.visualization.BarChart(
					document.getElementById('chart_div_activeUsers')
				)
				chart.draw(view, options)
			})
		}
	}
}
</script>

<style scoped>
.tbl-category-column-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
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
</style>

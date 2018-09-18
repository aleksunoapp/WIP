<template>
	<div>
		<h1 class="page-title">Delivery Hours</h1>

		<div class="note note-info">
			<p>Manage delivery hours</p>
		</div>

		<div class="row">
			<div class="col-md-12"
			     v-show="activeLocationId === undefined">
				<div class="alert center alert-info">
					<h4>No Store Selected</h4>
					<p>Please select a store from the stores panel on the right to view delivery hours for it.</p>
				</div>
			</div>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki"
		     v-if="activeLocationId !== undefined && !loading && deliveryHours.length < 7">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create Delivery Hours
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body relative-block"
			     :class="{'display-hide': createNewCollapse}">
				<form role="form"
				      @submit.prevent="createDeliveryHours()">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="createErrorMessage.length"
							     ref="createErrorMessage">
								<button class="close"
								        @click.prevent="clearError('createErrorMessage')"></button>
								<span>{{ createErrorMessage }}</span>
							</div>
						</div>
					</div>
					<table class="table">
						<thead>
							<th></th>
							<th>Open</th>
							<th>From</th>
							<th>To</th>
						</thead>
						<tbody>
							<tr v-for="day in availableDays"
							    :key="day.day">
								<td class="align-middle">
									{{dayNames[day.day]}}
								</td>
								<td class="align-middle">
									<el-switch v-model="day.open"
									           active-color="#0c6"
									           inactive-color="#ff4949"
									           :active-value="1"
									           :inactive-value="0"
									           active-text="Yes"
									           inactive-text="No">
									</el-switch>
								</td>
								<td class="align-middle">
									<el-time-select v-model="day.open_time"
									                :picker-options="{ start: '00:00', end: '23:59', step: '00:01' }"
									                :clearable="false"
									                placeholder="From"
									                class="narrow-picker">
									</el-time-select>
									<button data-toggle="tooltip"
									        title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click.stop.prevent="applyOpeningTimeToAll(day.open_time, newDeliveryHours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td class="align-middle">
									<el-time-select v-model="day.close_time"
									                :picker-options="{ start: '00:00', end: '23:59', step: '00:01' }"
									                :clearable="false"
									                placeholder="From"
									                class="narrow-picker">
									</el-time-select>
									<button data-toggle="tooltip"
									        title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click.stop.prevent="applyClosingTimeToAll(day.close_time, newDeliveryHours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
					<div class="row">
						<div class="col-xs-12">
							<button type="submit"
							        class="btn blue pull-right">
								Create
								<i v-show="creating"
								class="fa fa-spinner fa-pulse fa-fw"></i>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE -->

		<div class="portlet light portlet-fit bordered margin-top-20"
		     v-show="activeLocationId !== undefined">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Delivery Hours</span>
					<div class="caption-desc font-grey-cascade">Create, edit or delete delivery hours for the active store.</div>
				</div>
			</div>
			<div class="portlet-body relative-block">
				<div class="row">
					<div class="col-md-12">
						<div class="alert alert-danger"
						     v-show="errorMessage"
						     ref="errorMessage">
							<button class="close"
							        @click="clearError('errorMessage')"></button>
							<span>{{ errorMessage }}</span>
						</div>
					</div>
				</div>

				<loading-screen :show="loading" />

				<no-results :show="!loading && !deliveryHours.length" />

				<form role="form"
				      @submit.prevent="updateDeliveryHours()">
					<table class="table"
					       v-if="!loading && deliveryHours.length">
						<thead>
							<th></th>
							<th>Open</th>
							<th>From</th>
							<th>To</th>
							<th></th>
						</thead>
						<tbody>
							<tr v-for="day in deliveryHours"
							    :key="day.day">
								<td class="align-middle">
									{{dayNames[day.day]}}
								</td>
								<td class="align-middle">
									<el-switch v-model="day.open"
									           active-color="#0c6"
									           inactive-color="#ff4949"
									           :active-value="1"
									           :inactive-value="0"
									           active-text="Yes"
									           inactive-text="No">
									</el-switch>
								</td>
								<td class="align-middle">
									<el-time-select v-model="day.open_time"
									                :picker-options="{ start: '00:00', end: '23:59', step: '00:01' }"
									                :clearable="false"
									                placeholder="From"
									                class="narrow-picker">
									</el-time-select>
									<button data-toggle="tooltip"
									        title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click.stop.prevent="applyOpeningTimeToAll(day.open_time, deliveryHours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td class="align-middle">
									<el-time-select v-model="day.close_time"
									                :picker-options="{ start: '00:00', end: '23:59', step: '00:01' }"
									                :clearable="false"
									                placeholder="From"
									                class="narrow-picker">
									</el-time-select>
									<button data-toggle="tooltip"
									        title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click.stop.prevent="applyClosingTimeToAll(day.close_time, deliveryHours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<button 
										@click.stop.prevent="updateDeliveryHours(day)"
										type="submit"
											class="btn blue pull-right">
										Save
										<i v-show="day.updating"
										class="fa fa-spinner fa-pulse fa-fw"></i>
									</button>
								</td>
								<td>
									<button 
										@click.stop.prevent="deleteDeliveryHours(day)"
										type="submit"
											class="btn blue pull-right">
										Delete
										<i v-show="day.deleting"
										class="fa fa-spinner fa-pulse fa-fw"></i>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</form>

			</div>
		</div>
	</div>
</template>
<script>
import DeliveryHoursFunctions from '@/controllers/DeliveryHours'
import LoadingScreen from '@/components/modules/LoadingScreen'
import NoResults from '@/components/modules/NoResults'
import { mapGetters } from 'vuex'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
	components: {
		LoadingScreen,
		NoResults
	},
	data () {
		return {
			dayNames: [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday'
			],

			loading: false,
			errorMessage: '',

			createNewCollapse: true,
			newDeliveryHours: [
				{
					day: 1,
					open: 1,
					open_time: '00:00',
					close_time: '00:00'
				},
				{
					day: 2,
					open: 1,
					open_time: '00:00',
					close_time: '00:00'
				},
				{
					day: 3,
					open: 1,
					open_time: '00:00',
					close_time: '00:00'
				},
				{
					day: 4,
					open: 1,
					open_time: '00:00',
					close_time: '00:00'
				},
				{
					day: 5,
					open: 1,
					open_time: '00:00',
					close_time: '00:00'
				},
				{
					day: 6,
					open: 1,
					open_time: '00:00',
					close_time: '00:00'
				},
				{
					day: 0,
					open: 1,
					open_time: '00:00',
					close_time: '00:00'
				}
			],
			creating: false,
			createErrorMessage: '',

			deliveryHours: [],

			showDeleteModal: false,
			deleteErrorMessage: ''
		}
	},
	computed: {
		activeLocationId: function () {
			return this.$root.activeLocation.id
		},
		availableDays: function () {
			return this.newDeliveryHours.filter(newDay => this.deliveryHours.find(existingDay => existingDay.day === newDay.day) === undefined)
		},
		...mapGetters(['can', 'canAny'])
	},
	watch: {
		activeLocationId: function (newId) {
			if (newId !== undefined) {
				this.getDeliveryHours()
			}
		}
	},
	mounted () {
		if (this.activeLocationId !== undefined) {
			this.getDeliveryHours()
		}
	},
	methods: {
		/**
		 * To toggle the create panel
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePanel () {
			this.createNewCollapse = !this.createNewCollapse
		},
		/**
		 * To copy the time to other days.
		 * @function
		 * @param {string} time - The time to copy
		 * @param {array} days - The array of days to update
		 * @returns {undefined}
		 */
		applyOpeningTimeToAll (time, days) {
			days.forEach(day => {
				day.open_time = time
			})
		},
		/**
		 * To copy the time to other days.
		 * @function
		 * @param {string} time - The time to copy
		 * @param {array} days - The array of days to update
		 * @returns {undefined}
		 */
		applyClosingTimeToAll (time, days) {
			days.forEach(day => {
				day.close_time = time
			})
		},
		/**
		 * To fetch delivery hours
		 * @function
		 * @returns {undefined}
		 */
		getDeliveryHours () {
			this.loading = true
			const _this = this

			DeliveryHoursFunctions.getDeliveryHoursForStore(
				this.activeLocationId
			)
				.then(response => {
					if (response.payload.length) {
						let days = _this.reorderDays(response.payload)
						days = _this.reorderDays(response.payload)
						days = _this.reformatDays(days)
						_this.deliveryHours = days
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch delivery hours',
						errorName: 'errorMessage',
						vue: _this
					})
				})
				.finally(() => {
					_this.loading = false
				})
		},
		/**
		 * To order weekdays from Monday to Sunday
		 * @function
		 * @param {array} days - Array of days to reorder
		 * @returns {undefined}
		 */
		reorderDays (days) {
			days.sort((a, b) => a.day > b.day)
			const sundayIndex = days.findIndex(day => day.day === 0)
			if (sundayIndex !== -1) {
				const sunday = days[sundayIndex]
				days.splice(sundayIndex, 1)
				days.push(sunday)
			}
			return days
		},
		/**
		 * To trim time strings and add loading booleans
		 * @function
		 * @param {array} days - Array of days to reformat
		 * @returns {undefined}
		 */
		reformatDays (days) {
			return days.map(day => {
				return {
					...day,
					open_time: day.open_time.slice(0, 5),
					close_time: day.close_time.slice(0, 5),
					updating: false,
					deleting: false
				}
			})
		},
		/**
		 * To validate hours before submitting to API
		 * @function
		 * @returns {undefined}
		 */
		validateNew () {
			const _this = this
			return new Promise(function (resolve, reject) {
				if (_this.newDeliveryHours.some(day => !day.open_time.length)) {
					reject('From cannot be blank')
				} else if (_this.availableDays.some(day => !day.close_time.length)) {
					reject('To cannot be blank')
				} else if (_this.availableDays.some(day => day.open_time >= day.close_time)) {
					reject('Time To must be after time From')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create delivery hours
		 * @function
		 * @returns {undefined}
		 */
		createDeliveryHours () {
			const _this = this
			this.clearError('createErrorMessage')
			this.validateNew()
				.then(response => {
					_this.creating = true
					DeliveryHoursFunctions.createDeliveryHours({
						location_id: this.activeLocationId,
						deliveryhour: this.newDeliveryHours
					})
						.then(response => {
							let days = _this.reorderDays(response.payload)
							days = _this.reformatDays(days)
							_this.deliveryHours = days
							this.showCreateSuccess(response.payload)
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText:
									'We could not add the delivery hours',
								errorName: 'createErrorMessage',
								vue: _this
							})
						})
						.finally(() => {
							_this.creating = false
						})
				})
				.catch(reason => {
					this.createErrorMessage = reason
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showCreateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Delivery Hours have been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Delivery Hours have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To validate hours before submitting to API
		 * @function
		 * @param {object} day - The day to validate
		 * @returns {undefined}
		 */
		validateEdited (day) {
			return new Promise(function (resolve, reject) {
				if (!day.open_time.length) {
					reject('From cannot be blank')
				} else if (!day.close_time.length) {
					reject('To cannot be blank')
				} else if (day.open_time >= day.close_time) {
					reject('Time To must be after time From')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update delivery hours
		 * @function
		 * @param {object} day - Day to update
		 * @returns {undefined}
		 */
		updateDeliveryHours (day) {
			const _this = this
			this.validateEdited(day)
				.then(response => {
					day.updating = true
					DeliveryHoursFunctions.updateDeliveryHours({
						location_id: this.activeLocationId,
						id: day.id,
						day: day.day,
						open_time: day.open_time,
						close_time: day.close_time,
						open: day.open
					})
						.then(response => {
							let days = _this.reorderDays(response.payload)
							days = _this.reformatDays(days)
							_this.deliveryHours = days
							this.showUpdateSuccess(response.payload)
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText:
									'We could not update the delivery hours',
								errorName: 'errorMessage',
								vue: _this
							})
						})
						.finally(() => {
							_this.updating = false
						})
				})
				.catch(reason => {
					this.errorMessage = reason
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showUpdateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Delivery Hours have been updated'
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
		 * To clear the current error.
		 * @function
		 * @param {object} errorMessageName - The error message to be cleared.
		 * @returns {undefined}
		 */
		clearError (errorMessageName) {
			this[errorMessageName] = ''
		},
		/**
		 * To delete delivery hours
		 * @function
		 * @param {object} day - Day to delete
		 * @returns {undefined}
		 */
		deleteDeliveryHours (day) {
			const _this = this
			day.deleting = true
			DeliveryHoursFunctions.deleteDeliveryHours({
				location_id: this.activeLocationId,
				id: day.id
			}).then(response => {
				let index = this.deliveryHours.findIndex(candidate => candidate.id === day.id)
				this.deliveryHours.splice(index, 1)
				this.showDeleteSuccess(response.payload)
			}).catch(reason => {
				day.deleting = false
				ajaxErrorHandler({
					reason,
					errorText: 'We could not delete the delivery hours',
					errorName: 'errorMessage',
					vue: _this
				})
			})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showDeleteSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Delivery Hours have been deleted'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The removal has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		}
	}
}
</script>
<style scoped>
.el-date-editor.el-input.narrow-picker {
	width: 150px;
}
.align-middle {
	vertical-align: middle;
}
</style>

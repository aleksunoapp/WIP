<template>
	<modal :show="showModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       :width="800"
	       ref="modal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">
				<span v-show="view === 'new'">Add</span>
				<span v-show="view === 'existing'">Edit</span> Menu Hours</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="row">
				<div class="col-xs-12">
					<div class="alert alert-danger"
					     v-show="errorMessage.length"
					     ref="errorMessage">
						<button class="close"
						        @click="clearError('errorMessage')"></button>
						<span>{{ errorMessage }}</span>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<div class="alert alert-info"
					     v-show="saveMessage.length"
					     ref="saveMessage">
						<button class="close"
						        @click="clearError('saveMessage')"></button>
						<span>{{ saveMessage }}</span>
					</div>
				</div>
			</div>
			<div class="row"
			     v-show="view === 'new'">
				<div class="col-xs-12">
					<table class="table cells-vertically-centred">
						<thead>
							<th>Day</th>
							<th>From</th>
							<th>To</th>
						</thead>
						<tbody>
							<tr>
								<td>Monday</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[1].open_time"
									                placeholder="Start"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyOpenTimeToAll(newHours.hours[1].open_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[1].close_time"
									                placeholder="End"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyCloseTimeToAll(newHours.hours[1].close_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
							</tr>
							<tr>
								<td>Tuesday</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[2].open_time"
									                placeholder="Start"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyOpenTimeToAll(newHours.hours[2].open_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[2].close_time"
									                placeholder="End"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyCloseTimeToAll(newHours.hours[2].close_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
							</tr>
							<tr>
								<td>Wednesday</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[3].open_time"
									                placeholder="Start"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyOpenTimeToAll(newHours.hours[3].open_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[3].close_time"
									                placeholder="End"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyCloseTimeToAll(newHours.hours[3].close_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
							</tr>
							<tr>
								<td>Thursday</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[4].open_time"
									                placeholder="Start"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyOpenTimeToAll(newHours.hours[4].open_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[4].close_time"
									                placeholder="End"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyCloseTimeToAll(newHours.hours[4].close_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
							</tr>
							<tr>
								<td>Friday</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[5].open_time"
									                placeholder="Start"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyOpenTimeToAll(newHours.hours[5].open_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[5].close_time"
									                placeholder="End"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyCloseTimeToAll(newHours.hours[5].close_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
							</tr>
							<tr>
								<td>Saturday</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[6].open_time"
									                placeholder="Start"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyOpenTimeToAll(newHours.hours[6].open_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[6].close_time"
									                placeholder="End"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyCloseTimeToAll(newHours.hours[6].close_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
							</tr>
							<tr>
								<td>Sunday</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[0].open_time"
									                placeholder="Start"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyOpenTimeToAll(newHours.hours[0].open_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours create']"
									                v-model="newHours.hours[0].close_time"
									                placeholder="End"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyCloseTimeToAll(newHours.hours[0].close_time, newHours.hours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="row"
			     v-show="view === 'existing'">
				<div class="col-xs-12"
				     v-show="!existingHours.length">
					<no-results :show="!existingHours.length"
					            :type="'hours'"></no-results>
				</div>
			</div>
			<div class="row"
			     v-show="view === 'existing'">
				<div class="col-xs-12"
				     v-show="existingHours.length">
					<table class="table cells-vertically-centred">
						<thead>
							<th>Day</th>
							<th>From</th>
							<th>To</th>
							<th></th>
						</thead>
						<tbody>
							<tr v-for="day in existingHours"
							    :key="day.id">
								<td>{{dayNames[day.day]}}</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours update']"
									                v-model="day.open_time"
									                class="narrow-picker"
									                placeholder="Start"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyOpenTimeToAll(day.open_time, existingHours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<el-time-select :disabled="!$root.permissions['menu_manager menus menu_hours update']"
									                v-model="day.close_time"
									                class="narrow-picker"
									                placeholder="End"
									                :picker-options="{
											start: '00:00',
											step: '00:01',
											end: '23:59'
										}">
									</el-time-select>
									<button title="Copy to all"
									        class="btn btn-icon-only btn-outline blue"
									        @click="applyCloseTimeToAll(day.close_time, existingHours)">
										<i class="fa fa-clone"
										   aria-hidden="true"></i>
									</button>
								</td>
								<td>
									<button :disabled="!$root.permissions['menu_manager menus menu_hours update']"
									        @click.stop.prevent="updateMenuHours(day)"
									        type="button"
									        class="btn btn-primary">
										Save
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button @click="useStoreHours()"
			        type="button"
			        class="btn"
			        :class="{
					'btn-primary' : view === 'existing',
					'blue btn-outline' : view === 'new'
				}"
			        :disabled="copying">
				Use store hours
				<i v-show="copying"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
			<button :disabled="!$root.permissions['menu_manager menus menu_hours create'] || creating"
			        v-show="view === 'new'"
			        @click="createMenuHours()"
			        type="button"
			        class="btn btn-primary">
				Save
				<i v-show="creating"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import NoResults from '../../../modules/NoResults'
import MenusFunctions from '../../../../controllers/Menus'
import ajaxErrorHandler from '../../../../controllers/ErrorController'

export default {
	data () {
		return {
			showModal: false,
			errorMessage: '',
			saveMessage: '',
			view: 'new',
			creating: false,
			newHours: {
				menu_id: null,
				start_from: '',
				stop_on: '',
				hours: [
					{
						day: 0,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 2,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 3,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 4,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 5,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 6,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					}
				]
			},
			copying: false,
			existingHours: [],
			dayNames: [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday'
			]
		}
	},
	props: {
		menu: {
			type: Object,
			required: true,
			default: () => {}
		}
	},
	created () {
		this.newHours.menu_id = this.menu.id
		this.getMenuHours()
	},
	methods: {
		/**
		 * To copy time to all other days
		 * @function
		 * @param {string} time - The time to copy
		 * @param {object} hoursObject - The array of days to copy to
		 * @returns {undefined}
		 */
		applyCloseTimeToAll (time, hoursObject) {
			hoursObject.forEach(day => {
				day.close_time = time
			})
		},
		/**
		 * To copy time to all other days
		 * @function
		 * @param {string} time - The time to copy
		 * @param {object} hoursObject - The array of days to copy to
		 * @returns {undefined}
		 */
		applyOpenTimeToAll (time, hoursObject) {
			hoursObject.forEach(day => {
				day.open_time = time
			})
		},
		/**
		 * To copy hours from store hours
		 * @function
		 * @returns {undefined}
		 */
		useStoreHours () {
			this.copying = true
			const _this = this
			MenusFunctions.copyStoreHoursToMenuHours(this.menu.id)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.closeModal()
						_this.showCreateSuccess(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not save the update',
						errorName: 'errorMessage',
						vue: _this,
						containerRef: 'modal'
					})
				})
				.finally(() => {
					_this.copying = false
				})
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {string} errorName - Name of the error to clear
		 * @returns {undefined}
		 */
		clearError (errorName) {
			this[errorName] = ''
		},
		/**
		 * To get the details of the menu to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getMenuHours () {
			let _this = this
			MenusFunctions.getMenuHours(
				_this.menu.id,
				_this.$root.appId,
				_this.$root.appSecret,
				_this.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						if (response.payload.length !== undefined) {
							this.view = 'existing'

							const sundayIndex = response.payload.findIndex(
								day => day.day === 0
							)
							let weekStartingMonday = response.payload
							weekStartingMonday.push(response.payload[sundayIndex])
							weekStartingMonday.splice(sundayIndex, 1)
							_this.existingHours = weekStartingMonday.map(day => {
								return {
									...day,
									open_time: day.open_time.substr(0, 5),
									close_time: day.close_time.substr(0, 5)
								}
							})
						}
						this.showModal = true
					}
				})
				.catch(reason => {
					this.showModal = true
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch hours for this menu',
						errorName: 'errorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To check if the data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewHours () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (
					_this.newHours.hours.find(
						day => !day.open_time || !day.close_time
					) !== undefined
				) {
					reject('Please fill in all hours')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new set of menu hours.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createMenuHours () {
			let _this = this
			this.validateNewHours()
				.then(response => {
					_this.creating = true
					_this.clearError('errorMessage')
					MenusFunctions.createMenuHours(
						_this.newHours,
						_this.$root.appId,
						_this.$root.appSecret,
						_this.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.closeModal()
								_this.showCreateSuccess(response.payload)
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add these hours',
								errorName: 'errorMessage',
								vue: _this
							})
						})
						.finally(() => {
							_this.creating = false
						})
				})
				.catch(reason => {
					_this.errorMessage = reason
					_this.$scrollTo(_this.$refs.errorMessage, 1000, { offset: -50 })
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showCreateSuccess (payload = {message: ''}) {
			let partial = !!payload.message.startsWith('Menu hours saved except for')
			let title = 'Success'
			let text = partial ? payload.message : 'The Menu Hours have been saved'
			let type = partial ? 'info' : 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Menu Hours have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To check if the data is valid before submitting to the backend.
		 * @function
		 * @param {object} day - An object containing details of the day to update
		 * @returns {object} A promise that will validate the input form
		 */
		validateExistingHours (day) {
			return new Promise(function (resolve, reject) {
				if (!day.open_time) {
					reject('Time from cannot be empty')
				} else if (!day.close_time) {
					reject('Time to cannot be empty')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a set of existing menu hours.
		 * @function
		 * @param {object} day - An object containing details of the day to update
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateMenuHours (day) {
			let _this = this
			this.validateExistingHours(day)
				.then(response => {
					_this.clearError('saveMessage')
					_this.clearError('errorMessage')
					day.menu_id = _this.menu.id
					MenusFunctions.updateMenuHours(
						day,
						_this.$root.appId,
						_this.$root.appSecret,
						_this.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.saveMessage = 'Saved'
								_this.getMenuHours()
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not save these hours',
								errorName: 'errorMessage',
								vue: _this
							})
						})
				})
				.catch(reason => {
					_this.errorMessage = reason
					_this.$scrollTo(_this.$refs.errorMessage, 1000, { offset: -50 })
				})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeHoursModal')
		}
	},
	components: {
		Modal,
		NoResults
	}
}
</script>

<style>
.el-picker-panel.el-date-picker.el-popper,
.el-picker-panel.time-select.el-popper {
  z-index: 10501 !important;
}
</style>

<style scoped>
.margin-right-10 {
  margin-right: 10px;
}
table.cells-vertically-centred td {
  vertical-align: middle;
}
.narrow-picker {
  max-width: 150px;
}
</style>

<template>
	<modal :show="showModal" :width="1000" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center"><span v-show="view === 'new'">Add</span><span v-show="view === 'existing'">Edit</span> Category Hours</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="row">
				<div class="col-xs-12">
					<div class="alert alert-danger" v-show="errorMessage.length" ref="errorMessage">
						<button class="close" @click="clearError('errorMessage')"></button>
						<span>{{ errorMessage }}</span>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<div class="alert alert-info" v-show="saveMessage.length" ref="saveMessage">
						<button class="close" @click="clearError('saveMessage')"></button>
						<span>{{ saveMessage }}</span>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12 margin-bottom-20">
					<button class="btn" @click="toggleNewAndExistingView('new')" :class="{'blue-chambray' : view === 'new', 'blue btn-outline' : view === 'existing'}">Add hours</button>
					<button class="btn" @click="toggleNewAndExistingView('existing')" :class="{'blue-chambray' : view === 'existing', 'blue btn-outline' : view === 'new'}">Edit hours</button>
				</div>
			</div>
			<div class="row" v-show="view === 'new'">
				<div class="col-xs-12 margin-bottom-20 text-center">	
					<label for="date-from">Start on: </label>
					<el-date-picker 
						v-model="newHours.start_from" 
						:editable="false"
						id="date-from"
						type="date" 
						class="margin-right-10"
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd"></el-date-picker>
					<label for="date-to">End on: </label>
					<el-date-picker 
						v-model="newHours.stop_on" 
						:editable="false"
						id="date-to"
						type="date" 
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd"></el-date-picker>
				</div>
			</div>
			<div class="row" v-show="view === 'new'">
				<div class="col-xs-12">
					<table class="table cells-vertically-centred">
						<thead>
							<th>Day</th>
							<th>From</th>
							<th>To</th>
							<th>Available</th>
						</thead>
						<tbody>
							<tr>
								<td>Sunday</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[0].open_time" 
										placeholder="Start">
									</el-time-select>
								</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[0].close_time" 
										placeholder="End">
									</el-time-select>
								</td>
								<td>
									<el-switch
										v-model="newHours.category_hours[0].status"
										active-color="#0c6"
										inactive-color="#ff4949"
										:active-value="1"
										:inactive-value="0"
										active-text="Yes"
										inactive-text="No">
									</el-switch>
								</td>
							</tr>
							<tr>
								<td>Monday</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[1].open_time" 
										placeholder="Start">
									</el-time-select>
								</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[1].close_time" 
										placeholder="End">
									</el-time-select>
								</td>
								<td>
									<el-switch
										v-model="newHours.category_hours[1].status"
										active-color="#0c6"
										inactive-color="#ff4949"
										:active-value="1"
										:inactive-value="0"
										active-text="Yes"
										inactive-text="No">
									</el-switch>
								</td>
							</tr>
							<tr>
								<td>Tuesday</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[2].open_time" 
										placeholder="Start">
									</el-time-select>
								</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[2].close_time" 
										placeholder="End">
									</el-time-select>
								</td>
								<td>
									<el-switch
										v-model="newHours.category_hours[2].status"
										active-color="#0c6"
										inactive-color="#ff4949"
										:active-value="1"
										:inactive-value="0"
										active-text="Yes"
										inactive-text="No">
									</el-switch>
								</td>
							</tr>
							<tr>
								<td>Wednesday</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[3].open_time" 
										placeholder="Start">
									</el-time-select>
								</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[3].close_time" 
										placeholder="End">
									</el-time-select>
								</td>
								<td>
									<el-switch
										v-model="newHours.category_hours[3].status"
										active-color="#0c6"
										inactive-color="#ff4949"
										:active-value="1"
										:inactive-value="0"
										active-text="Yes"
										inactive-text="No">
									</el-switch>
								</td>
							</tr>
							<tr>
								<td>Thursday</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[4].open_time" 
										placeholder="Start">
									</el-time-select>
								</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[4].close_time" 
										placeholder="End">
									</el-time-select>
								</td>
								<td>
									<el-switch
										v-model="newHours.category_hours[4].status"
										active-color="#0c6"
										inactive-color="#ff4949"
										:active-value="1"
										:inactive-value="0"
										active-text="Yes"
										inactive-text="No">
									</el-switch>
								</td>
							</tr>
							<tr>
								<td>Friday</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[5].open_time" 
										placeholder="Start">
									</el-time-select>
								</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[5].close_time" 
										placeholder="End">
									</el-time-select>
								</td>
								<td>
									<el-switch
										v-model="newHours.category_hours[5].status"
										active-color="#0c6"
										inactive-color="#ff4949"
										:active-value="1"
										:inactive-value="0"
										active-text="Yes"
										inactive-text="No">
									</el-switch>
								</td>
							</tr>
							<tr>
								<td>Saturday</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[6].open_time" 
										placeholder="Start">
									</el-time-select>
								</td>
								<td>
									<el-time-select 
										v-model="newHours.category_hours[6].close_time" 
										placeholder="End">
									</el-time-select>
								</td>
								<td>
									<el-switch
										v-model="newHours.category_hours[6].status"
										active-color="#0c6"
										inactive-color="#ff4949"
										:active-value="1"
										:inactive-value="0"
										active-text="Yes"
										inactive-text="No">
									</el-switch>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="row" v-show="view === 'existing'">
				<div class="col-xs-12" v-show="!existingHours.length">
					<no-results :show="!existingHours.length" :type="'hours'"></no-results>
				</div>
			</div>
			<div class="row" v-show="view === 'existing'">
				<div class="col-xs-12" v-show="existingHours.length">
					<table class="table cells-vertically-centred">
						<thead>
							<th>From</th>
							<th>To</th>
							<th>Day</th>
							<th>From</th>
							<th>To</th>
							<th>Available</th>
							<th></th>
						</thead>
						<tbody>
							<tr v-for="day in existingHours">
								<td>
									<el-date-picker 
										v-model="day.start_from" 
										:editable="false"
										id="date-from"
										type="date" 
										class="narrow-picker"
										format="yyyy-MM-dd" 
										value-format="yyyy-MM-dd" 
										placeholder="From"></el-date-picker>
								</td>
								<td>
									<el-date-picker 
										v-model="day.stop_on" 
										:editable="false"
										id="date-to"
										type="date" 
										class="narrow-picker"
										format="yyyy-MM-dd" 
										value-format="yyyy-MM-dd" 
										placeholder="To"></el-date-picker>									
								</td>
								<td>{{dayNames[day.day]}}</td>
								<td>
									<el-time-select 
										v-model="day.open_time" 
										class="narrow-picker"
										placeholder="Start">
									</el-time-select>
								</td>
								<td>
									<el-time-select 
										v-model="day.close_time" 
										class="narrow-picker"
										placeholder="End">
									</el-time-select>
								</td>
								<td>
									<el-switch
										v-model="day.status"
										active-color="#0c6"
										inactive-color="#ff4949"
										:active-value="1"
										:inactive-value="0">
									</el-switch>
								</td>
								<td>
									<button @click.stop.prevent="updateCategoryHours(day)" type="button" class="btn btn-primary">Save</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button v-show="view === 'new'" @click="createCategoryHours()" type="button" class="btn btn-primary">Save</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import NoResults from '../../../modules/NoResults'
import CategoriesFunctions from '../../../../controllers/Categories'
import ajaxErrorHandler from '../../../../controllers/ErrorController'

export default {
	data () {
		return {
			showModal: false,
			errorMessage: '',
			saveMessage: '',
			view: 'new',
			newHours: {
				category_id: null,
				start_from: '',
				stop_on: '',
				category_hours: [
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
			existingHours: [],
			dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		}
	},
	props: {
		category: {
			type: Object,
			required: true,
			default: () => {}
		}
	},
	created () {
		this.newHours.category_id = this.category.id
		this.getCategoryHours()
	},
	mounted () {
		this.showModal = true
	},
	methods: {
		/**
		 * To switch between the new and existing hours views
		 * @function
		 * @param {string} view - The view to display
		 * @returns {undefined}
		 */
		toggleNewAndExistingView (view) {
			this.view = view
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
		 * To get the details of the category to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCategoryHours () {
			let _this = this
			CategoriesFunctions.getCategoryHours(_this.category.id, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					if (response.payload.length !== undefined) {
						_this.existingHours = response.payload
					}
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch hours for this category',
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
				if (!_this.newHours.start_from.length) {
					reject('Start date cannot be blank')
				} else if (!_this.newHours.stop_on.length) {
					reject('End date cannot be blank')
				} else if (_this.newHours.category_hours.find(day => !day.open_time || !day.close_time) !== undefined) {
					reject('Please fill in all hours')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new set of category hours.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createCategoryHours () {
			let _this = this
			this.validateNewHours()
			.then(response => {
				_this.clearError('errorMessage')
				CategoriesFunctions.createCategoryHours(_this.newHours, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.closeModal()
						_this.showCreateSuccess(response.message)
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not add these hours',
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
		 * To notify user that the operation succeeded.
		 * @function
		 * @param {string} message - Message returned by the server
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		showCreateSuccess (message) {
			let partial = !!message.startsWith('Category hours saved except for')
			this.$swal({
				title: 'Success',
				text: partial ? message : 'Hours successfully added',
				type: partial ? 'info' : 'success',
				confirmButtonText: 'OK'
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
				if (!day.start_from) {
					reject('Start date cannot be empty')
				} else if (!day.stop_on) {
					reject('End date cannot be empty')
				} else if (!day.open_time) {
					reject('Time from cannot be empty')
				} else if (!day.close_time) {
					reject('Time to cannot be empty')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a set of existing category hours.
		 * @function
		 * @param {object} day - An object containing details of the day to update
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateCategoryHours (day) {
			let _this = this
			this.validateExistingHours(day)
			.then(response => {
				_this.clearError('saveMessage')
				_this.clearError('errorMessage')
				day.category_id = _this.category.id
				CategoriesFunctions.updateCategoryHours(day, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.saveMessage = 'Saved'
						_this.existingHours = response.payload
					}
				}).catch(reason => {
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

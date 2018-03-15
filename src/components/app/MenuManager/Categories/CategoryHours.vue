<template>
	<modal :show="showModal" :width="900" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Category Hours</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="row">
				<div class="col-xs-12 margin-bottom-20">	
					<label for="date-from">Start on: </label>
					<el-date-picker 
						v-model="newHours.start_from" 
						:editable="false"
						id="date-from"
						type="date" 
						class="margin-right-10"
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd" 
						placeholder="From"></el-date-picker>
					<label for="date-to">End on: </label>
					<el-date-picker 
						v-model="newHours.stop_on" 
						:editable="false"
						id="date-to"
						type="date" 
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd" 
						placeholder="To"></el-date-picker>
				</div>
			</div>
			<div class="row">
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
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary">Save</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import CategoriesFunctions from '../../../../controllers/Categories'
import ajaxErrorHandler from '../../../../controllers/ErrorController'

export default {
	data () {
		return {
			showModal: false,
			errorMessage: '',
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
			existingHours: {}
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
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.newHours.start_from.length) {
					reject('Start date cannot be blank')
				} else if (!_this.newHours.end_on.length) {
					reject('End date cannot be blank')
				} else if (_this.newHours.category_hours.indexOf(day => !day.start_from || !day.end_on) !== -1) {
					reject('Please fill in all hours')
				}
				resolve('Hurray')
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
		 * To get the details of the category to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCategoryHours () {
			let _this = this
			CategoriesFunctions.getCategoryHours(_this.category.id, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					if (response.payload !== {}) {
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
		 * To update the category and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateCategory () {
			var editCategoryVue = this
			editCategoryVue.clearError()
			editCategoryVue.categoryToBeEdited.user_id = editCategoryVue.$root.createdBy
			editCategoryVue.categoryToBeEdited.update_locations = editCategoryVue.selectedLocations

			return editCategoryVue.validateCategoryData()
			.then(response => {
				CategoriesFunctions.updateMenuCategory(editCategoryVue.categoryToBeEdited, editCategoryVue.$root.appId, editCategoryVue.$root.appSecret, editCategoryVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editCategoryVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editCategoryVue.$router.push('/login/expired')
						return
					}
					editCategoryVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editCategoryVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
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
		Modal
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
</style>

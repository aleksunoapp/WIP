<template>
	<modal :show="showMenuHoursModal" :width="700" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Menu Hours</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
    		    <button class="close" data-close="alert" @click="clearError('errorMessage')"></button>
    		    <span>{{ errorMessage }}</span>
    		</div>
    		<div v-show="createMode">
				<div class="col-md-6">
					<label>Start Date:</label><br>
					<el-date-picker 
						v-model="newMenuHours.start_from" 
						type="date" 
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd" 
						:clearable="false" 
						placeholder="Pick a start date">
					</el-date-picker>
				</div>
				<div class="col-md-6">
					<label>End Date:</label><br>
					<el-date-picker 
						v-model="newMenuHours.stop_on" 
						type="date"
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd" 
						:clearable="false" 
						placeholder="Pick an end date">
					</el-date-picker>
				</div>
				<div class="col-md-6 margin-top-20">
					<label>Start Time:</label><br>
	            	<el-time-select v-model="newMenuHours.open_time" :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }" placeholder="Set start time"></el-time-select>
	            </div>
	            <div class="col-md-6 margin-top-20">
	            	<label>End Time:</label><br>
	            	<el-time-select v-model="newMenuHours.close_time" :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }" placeholder="Set end time"></el-time-select>
	            </div>
    		</div>
    		<div v-show="!createMode">
				<div class="col-md-6">
					<label>Start Date:</label><br>
					<el-date-picker 
						v-model="menuHoursToBeEdited.start_from" 
						type="date" 
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd" 
						:clearable="false" 
						placeholder="Pick a start date">
					</el-date-picker>
				</div>
				<div class="col-md-6">
					<label>End Date:</label><br>
					<el-date-picker 
						v-model="menuHoursToBeEdited.stop_on" 
						type="date" 
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd" 
						:clearable="false" 
						placeholder="Pick an end date">
					</el-date-picker>
				</div>
				<div class="col-md-6 margin-top-20">
					<label>Start Time:</label><br>
	            	<el-time-select v-model="menuHoursToBeEdited.open_time" :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }" placeholder="Pick start time"></el-time-select>
	            </div>
	            <div class="col-md-6 margin-top-20">
	            	<label>End Time:</label><br>
	            	<el-time-select v-model="menuHoursToBeEdited.close_time" :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }" placeholder="Pick end time"></el-time-select>
	            </div>
    		</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary margin-top-20" @click="saveMenuHours()">Save</button>
		</div>
	</modal>
</template>

<script>
// import $ from 'jquery'
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'

export default {
	data () {
		return {
			showMenuHoursModal: false,
			errorMessage: '',
			newMenuHours: {
				menu_id: this.passedMenuId,
				open_time: '',
				close_time: '',
				start_from: '',
				stop_on: ''
			},
			createMode: false,
			menuHoursToBeEdited: {}
		}
	},
	props: {
		passedMenuId: {
			type: Number,
			default: 0
		}
	},
	mounted () {
		this.showMenuHoursModal = true
		// check if hours have been set for the current menu
		this.getMenuHours()
	},
	methods: {
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeMenuHoursModal')
		},
		/**
		 * To get the hours for the current menu.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getMenuHours () {
			var menuHoursVue = this
			MenusFunctions.getMenuHours(menuHoursVue.passedMenuId, menuHoursVue.$root.appId, menuHoursVue.$root.appSecret, menuHoursVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok' && response.message === 'No hours to display') {
					menuHoursVue.createMode = true
				} else if (response.code === 200 && response.status === 'ok' && response.message === 'OK') {
					menuHoursVue.menuHoursToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					menuHoursVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		validateNewHoursData () {
			var menuHoursVue = this
			return new Promise(function (resolve, reject) {
				if (!menuHoursVue.newMenuHours.start_from.toString().length) {
					reject('Start date cannot be blank')
				} else if (!menuHoursVue.newMenuHours.stop_on.toString().length) {
					reject('End date cannot be blank')
				} else if (menuHoursVue.newMenuHours.start_from > menuHoursVue.newMenuHours.stop_on) {
					reject('Start Date cannot be after End Date')
				} else if (!menuHoursVue.newMenuHours.open_time.toString().length) {
					reject('Start time cannot be blank')
				} else if (!menuHoursVue.newMenuHours.close_time.toString().length) {
					reject('End time cannot be blank')
				}
				resolve('Hurray')
			})
		},
		validateUpdatedHoursData () {
			var menuHoursVue = this
			return new Promise(function (resolve, reject) {
				if (!menuHoursVue.menuHoursToBeEdited.start_from.toString().length) {
					reject('Start date cannot be blank')
				} else if (!menuHoursVue.menuHoursToBeEdited.stop_on.toString().length) {
					reject('End date cannot be blank')
				} else if (!menuHoursVue.menuHoursToBeEdited.open_time.toString().length) {
					reject('Start time cannot be blank')
				} else if (!menuHoursVue.menuHoursToBeEdited.close_time.toString().length) {
					reject('End time cannot be blank')
				}
				resolve('Hurray')
			})
		},
		determineMonth (monthName) {
			if (monthName === 'Jan') {
				return '01'
			} else if (monthName === 'Feb') {
				return '02'
			} else if (monthName === 'Mar') {
				return '03'
			} else if (monthName === 'Apr') {
				return '04'
			} else if (monthName === 'May') {
				return '05'
			} else if (monthName === 'Jun') {
				return '06'
			} else if (monthName === 'Jul') {
				return '07'
			} else if (monthName === 'Aug') {
				return '08'
			} else if (monthName === 'Sep') {
				return '09'
			} else if (monthName === 'Oct') {
				return '10'
			} else if (monthName === 'Nov') {
				return '11'
			} else if (monthName === 'Dec') {
				return '12'
			}
		},
		saveMenuHours () {
			var menuHoursVue = this
			if (menuHoursVue.createMode) {
				return menuHoursVue.validateNewHoursData()
				.then(response => {
					MenusFunctions.createMenuHours(menuHoursVue.newMenuHours, menuHoursVue.$root.appId, menuHoursVue.$root.appSecret, menuHoursVue.$root.userToken).then(response => {
						if (response.code === 200 && response.status === 'ok') {
							this.closeModal()
						} else {
							menuHoursVue.errorMessage = response.message
						}
					}).catch(reason => {
						if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
							menuHoursVue.$router.push('/login/expired')
							return
						}
						menuHoursVue.errorMessage = reason
						window.scrollTo(0, 0)
					})
				}).catch(reason => {
					// If validation fails then display the error message
					menuHoursVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
			} else if (!menuHoursVue.createMode) {
				return menuHoursVue.validateUpdatedHoursData()
				.then(response => {
					MenusFunctions.updateMenuHours(menuHoursVue.menuHoursToBeEdited, menuHoursVue.$root.appId, menuHoursVue.$root.appSecret, menuHoursVue.$root.userToken).then(response => {
						if (response.code === 200 && response.status === 'ok') {
							this.closeModal()
						} else {
							menuHoursVue.errorMessage = response.message
						}
					}).catch(reason => {
						if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
							menuHoursVue.$router.push('/login/expired')
							return
						}
						menuHoursVue.errorMessage = reason
						window.scrollTo(0, 0)
					})
				}).catch(reason => {
					// If validation fails then display the error message
					menuHoursVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
			}
		}
	},
	components: {
		Modal
	}
}
</script>
<style>
.el-picker-panel {
	z-index: 10501!important;
}
</style>

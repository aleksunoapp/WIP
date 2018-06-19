<template>
	<modal :show="showDuplicateMenuModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
            <h4 class="modal-title center">Duplicate Menu</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="row">
				<div class="col-xs-12">
					<div class="alert alert-danger" v-show="errorMessage.length" ref="errorMessage">
					    <button class="close" data-close="alert" @click="clearError()"></button>
					    <span>{{errorMessage}}</span>
					</div>					
				</div>
			</div>
			<div class="row">
				<div class="col-xs-6">
					<el-dropdown trigger="click" @command="selectGroup" size="mini" :show-timeout="50" :hide-timeout="50">
						<el-button size="mini">
							{{ selectedGroup.name || 'All stores' }}
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command="{}">All stores</el-dropdown-item>
							<el-dropdown-item v-for="group in groups" :command="group" :key="group.id">{{ group.name }}</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<div class="col-xs-6">
					<div class="form-group form-md-line-input form-md-floating-label form-md-line-input-trimmed">
						<div class="input-icon right">
							<input  
								type="text" 
								placeholder="Search Stores" 
								class="form-control input-sm" 
								:class="{'edited': searchTerm.length}" 
								v-model="searchTerm" 
								id="search_locations"
							>
							<i class="fa fa-times-circle-o clickable" @click.prevent="resetSearch()" aria-hidden="true"></i>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
        		<div class="col-xs-12">
					<table class="table">
						<thead>
							<tr>
								<th></th>
								<th> Store Name </th>
								<th> Street Address </th>
								<th> City, Province, Country </th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="store in searchResults" :key="store.id">
								<td>
									<div class="md-radio">
										<input 
											type="radio"
											:id="`${idPrefix}-${store.id}`"
											:name="store.display_name"
											class="md-radiobtn" 
											v-model="selectedLocation"
											:value="store.id"
										>
										<label :for="`${idPrefix}-${store.id}`">
											<span></span>
											<span class="check"></span>
											<span class="box"></span>
											{{ store.display_name }}
										</label>
									</div>
								</td>
								<td> {{ store.display_name }} </td>
								<td> {{ store.address_line_1 }} </td>
								<td> {{ store.city }}, {{ store.province }}, {{ store.country }} </td>
							</tr>
						</tbody>
					</table>
					<div class="form-group form-md-line-input form-md-floating-label">
						<label>Replace existing?</label><br>
						<el-switch
							v-model="replaceExisting"
							active-color="#0c6"
							inactive-color="#ff4949"
							:active-value="1"
							:inactive-value="0"
							active-text="Yes"
							inactive-text="No">
						</el-switch>
					</div>
        		</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<div class="pull-right">
						<button class="btn blue" @click="duplicateMenu()">Duplicate</button>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer">
		</div>
	</modal>
</template>

<script>
import App from '@/controllers/App'
import StoreGroupsFunctions from '@/controllers/StoreGroups'
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'
import ajaxErrorHandler from '../../../../controllers/ErrorController'

export default {
	data () {
		return {
			showDuplicateMenuModal: false,
			errorMessage: '',
			selectedLocation: null,
			locations: [],
			groups: [],
			selectedGroup: {},
			searchTerm: '',
			idPrefix: 'cpm',
			replaceExisting: 0
		}
	},
	computed: {
		searchResults () {
			if (this.searchTerm.length) {
				return this.locations.filter((location) => {
					let searchIn = location.display_name + location.address_line_1 + location.city + location.province + location.country
					return searchIn.toLowerCase().includes(this.searchTerm)
				})
			} else {
				return this.locations
			}
		}
	},
	props: {
		passedMenuId: {
			type: Number
		}
	},
	created () {
		this.idPrefix = this._uid
		this.getGroups()
		this.getPaginatedStoreLocations()
	},
	mounted () {
		this.showDuplicateMenuModal = true
	},
	methods: {
		/**
		 * To clear the search term
		 * @function
		 * @returns {undefined}
		 */
		resetSearch () {
			this.searchTerm = ''
		},
		/**
		 * To get a list of location for the current application/business.
		 * @function
		 * @param {object} group - The object containing details of the selected store group
		 * @returns {undefined}
		 */
		selectGroup (group) {
			this.selectedGroup = group
			if (group.name) {
				this.getGroupLocations()
			} else {
				this.getPaginatedStoreLocations()
			}
		},
		/**
		 * To get a list of location for the current application/business.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPaginatedStoreLocations () {
			var selectLocationsVue = this

			App.getPaginatedStoreLocations(selectLocationsVue.$root.appId, selectLocationsVue.$root.appSecret, selectLocationsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					selectLocationsVue.locations = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					selectLocationsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To get the details of the selected group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroupLocations () {
			var selectLocationsVue = this

			StoreGroupsFunctions.getGroupLocations(selectLocationsVue.selectedGroup.id, selectLocationsVue.$root.appId, selectLocationsVue.$root.appSecret, selectLocationsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					let all = true
					response.payload.locations.forEach(store => {
						if (!selectLocationsVue.previouslySelected.includes(store.id)) {
							all = false
						}
						selectLocationsVue.previouslySelected.forEach(previous => {
							if (store.id === previous) {
								store.selected = true
							} else if (store.selected !== true) {
								store.selected = false
							}
						})
					})
					selectLocationsVue.selectAllSelected = all
					selectLocationsVue.locations = response.payload.locations
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					selectLocationsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To get the details of the selected group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroups () {
			var selectLocationsVue = this

			StoreGroupsFunctions.getGroups(selectLocationsVue.$root.appId, selectLocationsVue.$root.appSecret, selectLocationsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					selectLocationsVue.groups = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					selectLocationsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To check if the menu data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateCategoryData () {
			var editMenuVue = this
			return new Promise(function (resolve, reject) {
				if (editMenuVue.selectedLocation === null) {
					reject('Select a location')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To update the menu and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		duplicateMenu () {
			var editMenuVue = this
			editMenuVue.clearError()
			let payload = {
				menu_id: this.passedMenuId,
				location_id: this.selectedLocation,
				replace_existing: this.replaceExisting
			}

			return editMenuVue.validateCategoryData()
			.then(response => {
				MenusFunctions.duplicateMenu(payload, editMenuVue.$root.appId, editMenuVue.$root.appSecret, editMenuVue.$root.userToken).then(response => {
					this.emitDuplicateSuccess()
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not duplicate the menu',
						errorName: 'errorMessage',
						vue: editMenuVue
					})
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editMenuVue.errorMessage = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDuplicateMenuModal')
		},
		/**
		 * To notify parent the duplication succeeded
		 * @function
		 * @returns {undefined}
		 */
		emitDuplicateSuccess () {
			this.$emit('duplicateSuccess', this.selectedLocation)
		}
	},
	components: {
		Modal
	}
}
</script>
<style scoped>
.select-locations-popup-container {
	min-height: 200px;
	max-height: calc(100vh - 60px);
    overflow-x: hidden;
    overflow-y: auto;
}
.dropdown-menu {
	max-height: 300px;
	overflow-y: auto;
}
.locations-container {
	min-height: 200px;
	max-height: calc(100vh - 400px);
    overflow-x: hidden;
    overflow-y: auto;
}
.form-md-line-input-trimmed {
	padding-top:0 !important;
	margin-bottom:0 !important;
}
</style>


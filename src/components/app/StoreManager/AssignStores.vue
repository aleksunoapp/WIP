<template>
	<modal :show="showAssignStoresModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Assign Stores To Group '{{ groupDetails.name }}'</h4>
		</div>
		<div slot="modal-body" class="modal-body relative-block">
			<loading-screen :show="displaySpinner" :color="'#2C3E50'" :display="'inline'"></loading-screen>
			<select-locations-popup v-if="!displaySpinner" @selectedLocations="selectStores" :previouslySelected="groupLocations" :withButton="false"></select-locations-popup>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn blue" @click="assignStoresToGroup()">Assign</button>
		</div>
	</modal>
</template>
<script>
import App from '../../../controllers/App'
import StoreGroupsFunctions from '../../../controllers/StoreGroups'
import Modal from '../../modules/Modal'
import LoadingScreen from '../../modules/LoadingScreen'
import SelectLocationsPopup from '../../modules/SelectLocationsPopup'

export default {
	data () {
		return {
			errorMessage: '',
			groupDetails: {},
			stores: [],
			groupLocations: [],
			showAssignStoresModal: false,
			selectAllSelected: false,
			displaySpinner: false
		}
	},
	props: {
		passedGroupId: {
			type: Number
		}
	},
	mounted () {
		this.showAssignStoresModal = true
		// get the details of the selected group
		this.getGroupDetails()
	},
	watch: {
		'passedGroupId' () {
			if (this.passedGroupId > 0) {
				this.groupDetails = {}
				this.stores = []
				this.groupLocations = []
				this.getGroupDetails()
			}
		}
	},
	methods: {
		selectStores (selectedStores) {
			this.groupLocations = selectedStores
		},
		/**
		 * To notify the parent to close the sideways page.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.getGroupDetails()
			this.$emit('closeAssignStoresModal')
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @param {boolean} value - The value of the checkbox
		 * @returns {undefined}
		 */
		syncSelectAll (value) {
			if (!value) {
				this.selectAllSelected = false
			}
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
		selectAll () {
			for (var i = 0; i < this.stores.length; i++) {
				this.stores[i].selected = this.selectAllSelected
			}
		},
		/**
		 * To get the details of the selected group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroupDetails () {
			this.displaySpinner = true
			var assignStoresVue = this

			StoreGroupsFunctions.getGroupDetails(assignStoresVue.passedGroupId, assignStoresVue.$root.appId, assignStoresVue.$root.appSecret, assignStoresVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					assignStoresVue.groupDetails = response.payload
				}
				assignStoresVue.getGroupLocations()
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					assignStoresVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				assignStoresVue.displaySpinner = false
				throw reason
			})
		},
		/**
		 * To get the list of locations that belong to the current group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroupLocations () {
			var assignStoresVue = this

			StoreGroupsFunctions.getGroupLocations(assignStoresVue.passedGroupId, assignStoresVue.$root.appId, assignStoresVue.$root.appSecret, assignStoresVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					assignStoresVue.groupLocations = response.payload.locations.map(location => location.id)
				}
				assignStoresVue.getStores()
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					assignStoresVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				assignStoresVue.displaySpinner = false
				throw reason
			})
		},
		/**
		 * To get a list of store for the current application/business.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStores () {
			var assignStoresVue = this

			App.getStoreLocations(assignStoresVue.$root.appId, assignStoresVue.$root.appSecret, assignStoresVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					let allStores = response.payload
					let groupStores = assignStoresVue.groupLocations
					for (var i = 0; i < groupStores.length; i++) {
						for (var j = 0; j < allStores.length; j++) {
							if (groupStores[i].id === allStores[j].id) {
								allStores[j].selected = true
							} else if (allStores[j].selected !== true) {
								allStores[j].selected = false
							}
						}
					}
					assignStoresVue.selectAllSelected = !(allStores.some(menu => menu.selected === false))
					assignStoresVue.stores = allStores
					assignStoresVue.displaySpinner = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					assignStoresVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				assignStoresVue.displaySpinner = false
				throw reason
			})
		},
		/**
		 * To assign the selected stores to the current group.
		 * @function
		 * @param {array} storesToBeAssigned - An array of store ids
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		assignStoresToGroup () {
			var assignStoresVue = this
			if (this.groupLocations.length === 0) {
				this.errorMessage = 'You have not selected any stores'
				this.$el.scrollTop = 0
				return
			}
			StoreGroupsFunctions.assignStoresToGroup(assignStoresVue.passedGroupId, assignStoresVue.groupLocations, assignStoresVue.$root.appId, assignStoresVue.$root.appSecret, assignStoresVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					assignStoresVue.closeModal()
					assignStoresVue.showAlert()
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					assignStoresVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To notify the parent to close the sideways page.
		 * @function
		 * @returns {undefined}
		 */
		closeSidewaysPage () {
			this.$emit('closeSidewaysPage')
		},
		/**
		 * To alert the user that the selected locations have been assigned to the current group.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Locations have been successfully assigned!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.closeSidewaysPage()
			}, dismiss => {
				// do nothing
			})
		}
	},
	components: {
		Modal,
		LoadingScreen,
		SelectLocationsPopup
	}
}
</script>
<style scoped>
.height-mod {
	max-height: 550px;
    overflow: auto;
}
</style>

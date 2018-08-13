<template>
	<modal :show="showCopyMenuModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
            <h4 class="modal-title center">Copy Menu</h4>
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
        		<div class="col-xs-12">
					<select-locations-popup
						@selectedLocations="updateLocations" 
						:withButton="false"
						:exclude="[$root.activeLocation.id]"
					></select-locations-popup>
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
						<button 
							class="btn blue" 
							@click="copyMenu()"
							:disabled="copying">
							Copy
							<i 
								v-show="copying"
								class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer">
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'
import ajaxErrorHandler from '../../../../controllers/ErrorController'
import SelectLocationsPopup from '@/components/modules/SelectLocationsPopup'

export default {
	data () {
		return {
			showCopyMenuModal: false,
			copying: false,
			errorMessage: '',
			selectedLocations: [],
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
	},
	mounted () {
		this.showCopyMenuModal = true
	},
	methods: {
		/**
		 * To update the selected locations
		 * @function
		 * @param {array} selected - An array of selected location ids
		 * @returns {object} A promise that will validate the input form
		 */
		updateLocations (selected) {
			this.selectedLocations = selected
		},
		/**
		 * To check if the menu data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateCategoryData () {
			var copyMenuVue = this
			return new Promise(function (resolve, reject) {
				if (!copyMenuVue.selectedLocations.length) {
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
		 * To copy the menu and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		copyMenu () {
			var editMenuVue = this
			editMenuVue.clearError()
			let payload = {
				menu_id: this.passedMenuId,
				locations: this.selectedLocations,
				replace_existing: this.replaceExisting
			}

			return editMenuVue.validateCategoryData()
			.then(response => {
				editMenuVue.copying = true
				MenusFunctions.copyMenu(payload, editMenuVue.$root.appId, editMenuVue.$root.appSecret, editMenuVue.$root.userToken).then(response => {
					this.emitCopySuccess()
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not copy the menu',
						errorName: 'errorMessage',
						vue: editMenuVue
					})
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editMenuVue.errorMessage = reason
				window.scrollTo(0, 0)
			}).finally(() => {
				editMenuVue.copying = false
			})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeCopyMenuModal')
		},
		/**
		 * To notify parent the copy succeeded
		 * @function
		 * @returns {undefined}
		 */
		emitCopySuccess () {
			this.$emit('copySuccess', this.selectedLocations)
		}
	},
	components: {
		Modal,
		SelectLocationsPopup
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


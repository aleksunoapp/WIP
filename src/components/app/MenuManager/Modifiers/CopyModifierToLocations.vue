<template>
	<modal :show="showComponent" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Copy Modifier To Stores</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="row" v-show="errorMessage.length" ref="errorMessage">
				<div class="col-md-12">
					<div class="alert alert-danger">
						<button class="close" @click="clearError('errorMessage')"></button>
						<span>{{errorMessage}}</span>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<select-locations-popup
						@selectedLocations="updateLocations" 
						:withButton="false">
					</select-locations-popup>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<div class="form-group form-md-line-input form-md-floating-label">
						<label>Create duplicate:</label><br>
						<el-switch
							v-model="create_duplicate"
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
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button 
				type="button" 
				class="btn btn-primary" 
				@click="copyModifierToLocations()"
				:disabled="saving">
				Save
				<i 
					v-show="saving"
					class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '@/components/modules/Modal'
import ModifiersFunctions from '@/controllers/Modifiers'
import SelectLocationsPopup from '@/components/modules/SelectLocationsPopup'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'copy-modifier-to-locations',
	data () {
		return {
			saving: false,
			errorMessage: '',
			showComponent: false,
			create_duplicate: 0,
			selectedLocations: [],
			modifierToCopyToLocations: {}
		}
	},
	props: {
		modifier: {
			type: Object,
			required: true
		}
	},
	mounted () {
		this.showComponent = true
	},
	methods: {
		/**
		 * To update the locations selected in the child component
		 * @function
		 * @param {array} locations - Arrray of store ids
		 * @returns {undefined}
		 */
		updateLocations (locations) {
			this.selectedLocations = locations
		},
		/**
		 * To clear an error
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To apply the selected modifier to all the checked off menu items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		copyModifierToLocations () {
			if (!this.selectedLocations.length) {
				this.errorMessage = 'Select at least one store'
				return
			}

			this.saving = true
			var copyModifierVue = this
			let payload = {
				modifier_id: this.modifier.id,
				create_duplicate: this.create_duplicate,
				locations: this.selectedLocations
			}
			ModifiersFunctions.copyModifierToMultipleLocations(payload, copyModifierVue.$root.appId, copyModifierVue.$root.appSecret, copyModifierVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					copyModifierVue.closeModal()
					copyModifierVue.emitSuccess()
				} else {
					throw Error(response.message)
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'Could not apply modifier to stores',
					errorName: 'errorMessage',
					vue: copyModifierVue
				})
			}).finally(() => {
				copyModifierVue.saving = false
			})
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeCopyModifierToLocations')
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		emitSuccess () {
			this.$emit('copyModifierToLocationsSuccess')
		}
	},
	components: {
		Modal,
		SelectLocationsPopup
	}
}
</script>

<template>
	<modal :show="showEditPortionModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center" v-if="!selectImageMode">Update Portion</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="col-xs-12">
				<div class="alert alert-danger" v-if="errorMessage.length">
				    <button class="close" data-close="alert" @click="clearError()"></button>
				    <span>{{errorMessage}}</span>
				</div>
        		<div v-if="!selectLocationMode" :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
					<resource-picker 
						@open="goToPageTwo()"
						@close="goToPageOne()"
						@selected="updateIcon" 
						:imageButton="true"
						:imageUrl="portionToBeEdited.icon_url"
						class="margin-top-15"
					>
					</resource-picker>
        		</div>
        		<div class="col-xs-12">        			
	    			<select-locations-popup 
	    				v-if="selectLocationMode" 
	    				@closeSelectLocationsPopup='updateSelectedLocations' 
	    				:previouslySelected="selectedLocations"
	    			>
					</select-locations-popup>
        		</div>
				<div class="col-md-12" v-show="!selectImageMode && !selectLocationMode">
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="portionToBeEdited.name">
					    <label for="form_control_1">Portion Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="portionToBeEdited.multiplier">
					    <label for="form_control_2">Portion Multipler</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="portionToBeEdited.order">
					    <label for="form_control_3">Portion Order</label>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button v-if="!selectImageMode" type="button" class="btn btn-primary" @click="updatePortion()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import Dropdown from '../../../modules/Dropdown'
import PortionsFunctions from '../../../../controllers/Portions'
import ResourcePicker from '../../../modules/ResourcePicker'

export default {
	data () {
		return {
			showEditPortionModal: false,
			portionToBeEdited: {
				icon_url: ''
			},
			errorMessage: '',
			selectImageMode: false
		}
	},
	props: {
		selectedPortionId: {
			type: Number
		}
	},
	mounted () {
		this.showEditPortionModal = true
		this.getPortionDetails()
	},
	methods: {
		/**
		 * To check if the portion data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateTagData () {
			var editPortionVue = this
			return new Promise(function (resolve, reject) {
				if (!editPortionVue.portionToBeEdited.name.length) {
					reject('Portion name cannot be blank')
				} else if (!editPortionVue.portionToBeEdited.icon_url.length) {
					reject('Portion icon URL cannot be blank')
				} else if (!$.isNumeric(editPortionVue.portionToBeEdited.order)) {
					reject('Portion order should be numerical')
				} else if (!$.isNumeric(editPortionVue.portionToBeEdited.multiplier)) {
					reject('Portion multiplier should be numerical')
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
		 * To get the details of a specific portion.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPortionDetails () {
			var editPortionVue = this
			PortionsFunctions.getPortionDetails(editPortionVue.selectedPortionId, editPortionVue.$root.appId, editPortionVue.$root.appSecret, editPortionVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editPortionVue.portionToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editPortionVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To update an existing portion.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updatePortion () {
			var editPortionVue = this
			editPortionVue.clearError()

			return editPortionVue.validateTagData()
			.then(response => {
				PortionsFunctions.updatePortion(editPortionVue.portionToBeEdited, editPortionVue.$root.appId, editPortionVue.$root.appSecret, editPortionVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editPortionVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editPortionVue.$router.push('/login/expired')
						return
					}
					editPortionVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editPortionVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To close the modal and emit the newly created tag object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updatePortion', this.portionToBeEdited)
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeEditPortionModal')
		},
		/**
		 * To change the page to the gallery view on the modal.
		 * @function
		 * @returns {undefined}
		 */
		goToPageTwo () {
			this.selectImageMode = true
		},
		/**
		 * To change the page to the main/form view on the modal.
		 * @function
		 * @returns {undefined}
		 */
		goToPageOne () {
			this.selectImageMode = false
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateIcon (val) {
			this.goToPageOne()
			this.portionToBeEdited.icon_url = val.image_url
		}
	},
	components: {
		Modal,
		Dropdown,
		ResourcePicker
	}
}
</script>

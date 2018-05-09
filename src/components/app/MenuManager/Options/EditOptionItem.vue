<template>
	<modal :show="showEditOptionItemModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center" v-if="!selectImageMode">Update Option Item</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="col-xs-12">
				<div class="alert alert-danger" v-if="errorMessage.length">
				    <button class="close" data-close="alert" @click="clearError()"></button>
				    <span>{{errorMessage}}</span>
				</div>
        		<div :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
					<resource-picker 
						@open="goToPageTwo()"
						@close="goToPageOne()"
						@selected="updateImage" 
						:imageButton="true"
						:imageUrl="optionItemToBeEdited.image_url"
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
				<div class="col-md-9" v-show="!selectImageMode && !selectLocationMode">
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="optionItemToBeEdited.name">
					    <label for="form_control_1">Option Item Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="optionItemToBeEdited.description">
					    <label for="form_control_2">Option Item Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="number" class="form-control input-sm edited" id="form_control_3" v-model="optionItemToBeEdited.order">
					    <label for="form_control_3">Option Item Order</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_4" v-model="optionItemToBeEdited.sku">
					    <label for="form_control_4">Option Item SKU</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_5" v-model="optionItemToBeEdited.price">
					    <label for="form_control_5">Option Item Price</label>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button v-if="!selectImageMode" type="button" class="btn btn-primary" @click="updateOptionItem()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import Dropdown from '../../../modules/Dropdown'
import OptionsFunctions from '../../../../controllers/Options'
import ResourcePicker from '../../../modules/ResourcePicker'

export default {
	data () {
		return {
			showEditOptionItemModal: false,
			optionItemToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false
		}
	},
	props: {
		selectedOptionItemId: {
			type: Number
		}
	},
	mounted () {
		this.showEditOptionItemModal = true
		this.getOptionItemDetails()
	},
	methods: {
		/**
		 * To check if the portion data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateOptionData () {
			var editOptionVue = this
			return new Promise(function (resolve, reject) {
				if (!editOptionVue.optionItemToBeEdited.name.length) {
					reject('Option Item name cannot be blank')
				} else if (!editOptionVue.optionItemToBeEdited.image_url.length) {
					reject('Option Item image URL cannot be blank')
				} else if (!$.isNumeric(editOptionVue.optionItemToBeEdited.order)) {
					reject('Option Item order should be numerical')
				} else if (!editOptionVue.optionItemToBeEdited.description.length) {
					reject('Option Item description should be numerical')
				} else if (!editOptionVue.optionItemToBeEdited.sku.length) {
					reject('Option Item SKU should be numerical')
				} else if (!editOptionVue.optionItemToBeEdited.price.length) {
					reject('Option Item price should be numerical')
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
		getOptionItemDetails () {
			var editOptionVue = this
			OptionsFunctions.getOptionItemDetails(editOptionVue.selectedOptionItemId, editOptionVue.$root.appId, editOptionVue.$root.appSecret, editOptionVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editOptionVue.optionItemToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editOptionVue.$router.push('/login/expired')
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
		updateOptionItem () {
			var editOptionVue = this
			editOptionVue.clearError()

			return editOptionVue.validateOptionData()
			.then(response => {
				OptionsFunctions.updateOptionItem(editOptionVue.optionItemToBeEdited, editOptionVue.$root.appId, editOptionVue.$root.appSecret, editOptionVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editOptionVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editOptionVue.$router.push('/login/expired')
						return
					}
					editOptionVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editOptionVue.errorMessage = reason
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
			this.$emit('updateOptionItem', this.optionItemToBeEdited)
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeEditOptionItemModal')
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
		updateImage (val) {
			this.goToPageOne()
			this.optionItemToBeEdited.image_url = val.image_url
		}
	},
	components: {
		Modal,
		Dropdown,
		ResourcePicker
	}
}
</script>

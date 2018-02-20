<template>
	<modal :show="showEditOptionModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center" v-if="!selectImageMode">Update Option</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="page-one" v-if="!selectImageMode" :class="{'active': !selectImageMode, 'disabled': selectImageMode}">
				<div class="alert alert-danger" v-if="errorMessage.length">
				    <button class="close" data-close="alert" @click="clearError()"></button>
				    <span>{{errorMessage}}</span>
				</div>
				<div class="col-md-3">
					<label>Option Image</label>
					<div class="image-container clickable" v-if="!optionToBeEdited.image_url">
						<img width="100" height="80" src="../../../../assets/img/app/image-placeholder.png" @click="goToPageTwo()">
					</div>
					<div class="image-container clickable" v-else>
						<img width="100" height="80" :src="optionToBeEdited.image_url" @click="goToPageTwo()">
					</div>
				</div>
				<div class="col-md-9">
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="optionToBeEdited.name">
					    <label for="form_control_1">Option Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="optionToBeEdited.description">
					    <label for="form_control_2">Option Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="optionToBeEdited.order">
					    <label for="form_control_3">Option Order</label>
					</div>
				</div>
			</div>
			<div class="page-two" v-if="selectImageMode" :class="{'active': selectImageMode, 'disabled': !selectImageMode}">
				<gallery-popup @selectedImage="updateImage"></gallery-popup>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button v-if="!selectImageMode" type="button" class="btn btn-primary" @click="updateOption()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import Dropdown from '../../../modules/Dropdown'
import OptionsFunctions from '../../../../controllers/Options'
import GalleryPopup from '../../../modules/GalleryPopup'

export default {
	data () {
		return {
			showEditOptionModal: false,
			optionToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false
		}
	},
	props: {
		selectedOptionId: {
			type: Number
		}
	},
	mounted () {
		this.showEditOptionModal = true
		this.getOptionDetails()
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
				if (!editOptionVue.optionToBeEdited.name.length) {
					reject('Option name cannot be blank')
				} else if (!editOptionVue.optionToBeEdited.image_url.length) {
					reject('Option icon URL cannot be blank')
				} else if (!$.isNumeric(editOptionVue.optionToBeEdited.order)) {
					reject('Option order should be numerical')
				} else if (!editOptionVue.optionToBeEdited.description.length) {
					reject('Option description should be numerical')
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
		getOptionDetails () {
			var editOptionVue = this
			OptionsFunctions.getOptionDetails(editOptionVue.selectedOptionId, editOptionVue.$root.appId, editOptionVue.$root.appSecret, editOptionVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editOptionVue.optionToBeEdited = response.payload
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
		updateOption () {
			var editOptionVue = this
			editOptionVue.clearError()

			return editOptionVue.validateOptionData()
			.then(response => {
				OptionsFunctions.updateOption(editOptionVue.optionToBeEdited, editOptionVue.$root.appId, editOptionVue.$root.appSecret, editOptionVue.$root.userToken).then(response => {
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
			this.$emit('updateOption', this.optionToBeEdited)
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeEditOptionModal')
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
			this.optionToBeEdited.image_url = val.image_url
		}
	},
	components: {
		Modal,
		Dropdown,
		GalleryPopup
	}
}
</script>

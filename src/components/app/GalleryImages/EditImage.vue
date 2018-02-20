<template>
	<modal :show="showEditImageModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit Image</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="imageToBeEdited.name">
			    <label for="form_control_1">Image Name</label>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="imageToBeEdited.image_url">
			    <label for="form_control_2">Image URL</label>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="updateImage()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../modules/Modal'
import GalleryFunctions from '../../../controllers/Gallery'

export default {
	data () {
		return {
			showEditImageModal: false,
			imageToBeEdited: {},
			errorMessage: ''
		}
	},
	props: {
		passedImageId: {
			type: Number
		},
		passedFolderId: {
			type: Number
		}
	},
	created () {
		// get folder details
		this.getImageDetails()
	},
	mounted () {
		this.showEditImageModal = true
	},
	methods: {
		/**
		 * To check if the folder data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateImageData () {
			var editImageVue = this
			return new Promise(function (resolve, reject) {
				if (!editImageVue.imageToBeEdited.name.length) {
					reject('Folder name cannot be blank')
				} else if (!editImageVue.imageToBeEdited.image_url.length) {
					reject('Folder image URL cannot be blank')
				} else if (!$.isNumeric(editImageVue.imageToBeEdited.status)) {
					reject('Folder status cannot be blank')
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
		 * To get the details of the folder to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getImageDetails () {
			var editImageVue = this
			GalleryFunctions.getImageDetails(editImageVue.passedImageId, editImageVue.$root.appId, editImageVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editImageVue.imageToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editImageVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To update the folder and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateImage () {
			var editImageVue = this
			editImageVue.clearError()
			editImageVue.imageToBeEdited.gallery_id = editImageVue.passedFolderId
			editImageVue.imageToBeEdited.user_id = editImageVue.$root.createdBy

			return editImageVue.validateImageData()
			.then(response => {
				GalleryFunctions.updateImage(editImageVue.imageToBeEdited, editImageVue.$root.appId, editImageVue.$root.appSecret, editImageVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editImageVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editImageVue.$router.push('/login/expired')
						return
					}
					editImageVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editImageVue.errorMessage = reason
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
			this.$emit('closeEditImageModal')
		},
		/**
		 * To close the modal and emit the updated folder object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateImage', this.imageToBeEdited)
		}
	},
	components: {
		Modal
	}
}
</script>

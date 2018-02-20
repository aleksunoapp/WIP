<template>
	<modal :show="showEditFolderModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit Gallery Folder</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="folderToBeEdited.name">
			    <label for="form_control_1">Folder Name</label>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="folderToBeEdited.description">
			    <label for="form_control_2">Folder Description</label>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="folderToBeEdited.cover_image">
			    <label for="form_control_3">Folder Image</label>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="updateFolder()">Save</button>
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
			showEditFolderModal: false,
			folderToBeEdited: {},
			errorMessage: ''
		}
	},
	props: {
		passedFolderId: {
			type: Number
		}
	},
	created () {
		// get folder details
		this.getGalleryFolderDetails()
	},
	mounted () {
		this.showEditFolderModal = true
	},
	methods: {
		/**
		 * To check if the folder data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateFolderData () {
			var editFolderVue = this
			return new Promise(function (resolve, reject) {
				if (!editFolderVue.folderToBeEdited.name.length) {
					reject('Folder name cannot be blank')
				} else if (!editFolderVue.folderToBeEdited.description.length) {
					reject('Folder description cannot be blank')
				} else if (!editFolderVue.folderToBeEdited.cover_image.length) {
					reject('Folder image URL cannot be blank')
				} else if (!$.isNumeric(editFolderVue.folderToBeEdited.status)) {
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
		getGalleryFolderDetails () {
			var editFolderVue = this
			GalleryFunctions.getGalleryFolderDetails(editFolderVue.passedFolderId, editFolderVue.$root.appId, editFolderVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editFolderVue.folderToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editFolderVue.$router.push('/login/expired')
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
		updateFolder () {
			var editFolderVue = this
			editFolderVue.clearError()
			editFolderVue.folderToBeEdited.gallery_id = editFolderVue.folderToBeEdited.id
			editFolderVue.folderToBeEdited.user_id = editFolderVue.$root.createdBy

			return editFolderVue.validateFolderData()
			.then(response => {
				GalleryFunctions.updateFolder(editFolderVue.folderToBeEdited, editFolderVue.$root.appId, editFolderVue.$root.appSecret).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editFolderVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editFolderVue.$router.push('/login/expired')
						return
					}
					editFolderVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editFolderVue.errorMessage = reason
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
			this.$emit('closeEditFolderModal')
		},
		/**
		 * To close the modal and emit the updated folder object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateFolder', this.folderToBeEdited)
		}
	},
	components: {
		Modal
	}
}
</script>

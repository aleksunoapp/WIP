<template>
	<modal :show="showEditGroupModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit Store Group</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="groupToBeEdited.name">
			    <label for="form_control_1">Group Name</label>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="groupToBeEdited.description">
			    <label for="form_control_2">Group Description</label>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="updateGroup()">Save</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import StoreGroupsFunctions from '../../../controllers/StoreGroups'

export default {
	data () {
		return {
			showEditGroupModal: false,
			groupToBeEdited: {},
			errorMessage: ''
		}
	},
	props: {
		passedGroupId: {
			type: Number
		}
	},
	created () {
		// get folder details
		this.getGroupDetails()
	},
	mounted () {
		this.showEditGroupModal = true
	},
	methods: {
		/**
		 * To check if the group data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateGroupData () {
			var editStoreGroupVue = this
			return new Promise(function (resolve, reject) {
				if (!editStoreGroupVue.groupToBeEdited.name.length) {
					reject('Group name cannot be blank')
				} else if (!editStoreGroupVue.groupToBeEdited.description.length) {
					reject('Group description cannot be blank')
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
		 * To get the details of the group to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroupDetails () {
			var editStoreGroupVue = this
			StoreGroupsFunctions.getGroupDetails(editStoreGroupVue.passedGroupId, editStoreGroupVue.$root.appId, editStoreGroupVue.$root.appSecret, editStoreGroupVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editStoreGroupVue.groupToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editStoreGroupVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To update the group and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateGroup () {
			var editStoreGroupVue = this
			editStoreGroupVue.clearError()
			editStoreGroupVue.groupToBeEdited.updated_by = editStoreGroupVue.$root.createdBy

			return editStoreGroupVue.validateGroupData()
			.then(response => {
				StoreGroupsFunctions.updateGroup(editStoreGroupVue.groupToBeEdited, editStoreGroupVue.$root.appId, editStoreGroupVue.$root.appSecret, editStoreGroupVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editStoreGroupVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editStoreGroupVue.$router.push('/login/expired')
						return
					}
					editStoreGroupVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editStoreGroupVue.errorMessage = reason
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
			this.$emit('closeEditGroupModal')
		},
		/**
		 * To close the modal and emit the updated folder object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateGroup', this.groupToBeEdited)
		}
	},
	components: {
		Modal
	}
}
</script>

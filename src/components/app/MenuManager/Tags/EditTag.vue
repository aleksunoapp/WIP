<template>
	<modal :show="showEditTagModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="modal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center"
			    v-if="!selectImageMode">Update Tag</h4>
			<h4 class="modal-title center"
			    v-if="selectImageMode"
			    key="selectImageMode">Select Image</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="col-xs-12">
				<div class="alert alert-danger"
				     v-show="errorMessage"
				     ref="errorMessage">
					<button class="close"
					        @click="clearError()"></button>
					<span>{{errorMessage}}</span>
				</div>
				<div :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
					<resource-picker @open="goToPageTwo()"
					                 @close="goToPageOne()"
					                 @selected="updateImage"
					                 :imageButton="true"
					                 :imageUrl="tagToBeEdited.image_url"
					                 class="margin-top-15">
					</resource-picker>
				</div>
				<div class="col-md-12"
				     v-show="!selectImageMode">
					<el-dropdown trigger="click"
					             @command="updateTagToBeEdited"
					             size="small"
					             :show-timeout="50"
					             :hide-timeout="50"
					             class='margin-bottom-20'>
						<el-button size="small">
							{{ tagTypeLabel }}
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="contains">contains</el-dropdown-item>
							<el-dropdown-item command="may_contain">may contain</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
						<input :disabled="!$root.permissions['menu_manager tags update']"
						       type="text"
						       class="form-control input-sm edited"
						       id="form_control_1"
						       v-model="tagToBeEdited.name">
						<label for="form_control_1">Tag Name</label>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button v-if="!selectImageMode && !$root.permissions['menu_manager tags update']"
			        type="button"
			        class="btn btn-primary"
			        @click="closeModal()">
				Close
			</button>
			<button v-if="!selectImageMode && $root.permissions['menu_manager tags update']"
			        type="button"
			        class="btn btn-primary"
			        @click="updateTag()">
				Save
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import Dropdown from '../../../modules/Dropdown'
import TagsFunctions from '../../../../controllers/Tags'
import ResourcePicker from '../../../modules/ResourcePicker'
import SelectLocationsPopup from '../../../modules/SelectLocationsPopup'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showEditTagModal: false,
			tagToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false
		}
	},
	computed: {
		tagTypeLabel () {
			if (!this.tagToBeEdited.type) {
				return 'Select Tag type'
			} else if (this.tagToBeEdited.type === 'contains') {
				return 'contains'
			} else if (this.tagToBeEdited.type === 'may_contain') {
				return 'may contain'
			}
		}
	},
	mounted () {
		this.showEditTagModal = true
		this.getTagDetails()
	},
	methods: {
		/**
		 * To update the type property of tagToBeEdited.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateTagToBeEdited (value) {
			if (this.$root.permissions['menu_manager tags update']) {
				this.tagToBeEdited.type = value
			}
		},
		/**
		 * To check if the tag data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateTagData () {
			var editTagVue = this
			return new Promise(function (resolve, reject) {
				if (!editTagVue.tagToBeEdited.name.length) {
					reject('Tag name cannot be blank')
				} else if (!editTagVue.tagToBeEdited.type.length) {
					reject('Tag type cannot be blank')
				} else if (!editTagVue.tagToBeEdited.image_url.length) {
					reject('Tag image URL cannot be blank')
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
		 * To get the details of a specific tag.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getTagDetails () {
			var editTagVue = this
			TagsFunctions.getTagDetails(
				editTagVue.$route.params.tag_id,
				editTagVue.$root.appId,
				editTagVue.$root.appSecret,
				editTagVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editTagVue.tagToBeEdited = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch tag info',
						errorName: 'errorMessage',
						vue: editTagVue,
						containerRef: 'modal'
					})
				})
		},
		/**
		 * To create a new tag.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateTag () {
			var editTagVue = this
			editTagVue.clearError()

			editTagVue.tagToBeEdited.user_id = editTagVue.$root.createdBy
			return editTagVue
				.validateTagData()
				.then(response => {
					TagsFunctions.updateTag(
						editTagVue.tagToBeEdited,
						editTagVue.$root.appId,
						editTagVue.$root.appSecret,
						editTagVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								this.closeModalAndUpdate()
								this.showEditSuccess(response.payload)
							} else {
								editTagVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the tag',
								errorName: 'errorMessage',
								vue: editTagVue,
								containerRef: 'modal'
							})
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					editTagVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showEditSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Tag has been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The changes have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To close the modal and emit the newly created tag object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateTag')
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeEditTagModal')
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
			if (this.$root.permissions['menu_manager tags update']) {
				this.tagToBeEdited.image_url = val.image_url
			}
			this.goToPageOne()
		}
	},
	components: {
		Modal,
		Dropdown,
		ResourcePicker,
		SelectLocationsPopup
	}
}
</script>
<style>
.el-dropdown-menu.el-popper.el-dropdown-menu--small {
  z-index: 10501 !important;
}
</style>

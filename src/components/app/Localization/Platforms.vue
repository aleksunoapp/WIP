<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Platforms</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage platforms.</p>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki"
		     v-if="$root.permissions['localization platforms create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Platform
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body relative-block"
			     :class="{'display-hide': createNewCollapse}">
				<form role="form"
				      @submit.prevent="createPlatform()">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="createErrorMessage.length"
							     ref="createErrorMessage">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError('createErrorMessage')"></button>
								<span>{{ createErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newPlatform.name.length}"
								       id="form_control_1"
								       v-model="newPlatform.name">
								<label for="form_control_1">Name</label>
							</div>
							<button type="submit"
							        class="btn blue pull-right"
							        :disabled="creating">
								Create
								<i v-show="creating"
								   class="fa fa-spinner fa-pulse fa-fw">
								</i>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE -->

		<!-- BEGIN LIST -->
		<div class="portlet light portlet-fit bordered margin-top-20"
				id="platforms-container">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Platforms</span>
					<div class="caption-desc font-grey-cascade">Create, edit or delete platforms.</div>
				</div>
			</div>
			<div class="col-md-12">
				<div class="alert alert-danger"
						v-show="listErrorMessage.length"
						ref="listErrorMessage">
					<button class="close"
							data-close="alert"
							@click="clearError('listErrorMessage')"></button>
					<span>{{ listErrorMessage }}</span>
				</div>
			</div>
			<div class="portlet-body relative-block">
				<loading-screen :show="loadingPlatforms"
								:color="'#2C3E50'"
								:display="'inline'"></loading-screen>
				<div class="mt-element-list margin-top-15"
						v-if="platforms.length && !loadingPlatforms">
					<div class="mt-list-container list-news ext-1 no-border">
						<ul>
							<li class="mt-list-item actions-at-left margin-top-15 three-vertical-actions"
								v-for="platform in platforms"
								:id="'platform-' + platform.id"
								:key="platform.id">
								<div class="list-item-actions">
									<el-tooltip v-if="$root.permissions['localization platforms update']"
												content="Edit"
												effect="light"
												placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
											@click="editPlatform(platform, $event)">
											<i class="fa fa-lg fa-pencil"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['localization platforms read'] && !$root.permissions['localization platforms update']"
												content="View"
												effect="light"
												placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
											@click="editPlatform(platform, $event)">
											<i class="fa fa-lg fa-eye"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['localization platforms delete']"
												content="Delete"
												effect="light"
												placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
											@click="confirmDelete(platform, $event)">
											<i class="fa fa-lg fa-trash"></i>
										</a>
									</el-tooltip>
								</div>
								<div class="col-md-12 bold uppercase font-red">
									<span>{{ platform.name }}</span>
								</div>
								<div class="col-md-6">
									<strong></strong>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="margin-top-20">
					<no-results :show="!platforms.length && !loadingPlatforms"
								:type="'platforms'"></no-results>
				</div>
			</div>
		</div>
		<!-- END LIST -->

		<!-- START EDIT -->
		<modal :show="showEditModal"
		       effect="fade"
		       @closeOnEscape="closeEditModal"
			   ref="editModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeEditModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Platform</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<form role="form">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="editErrorMessage.length"
							     ref="editErrorMessage">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError('editErrorMessage')"></button>
								<span>{{ editErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-12">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input :disabled="!$root.permissions['localization platforms update']"
								       type="text"
								       class="form-control input-sm"
								       :class="{'edited': platformToEdit.name.length}"
								       id="form_control_1"
								       v-model="platformToEdit.name">
								<label for="form_control_1">Name</label>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<button v-if="!$root.permissions['localization platforms update']"
				        @click="closeEditModal()"
				        type="button"
				        class="btn blue">
					Close
				</button>
				<button v-else
				        @click="updatePlatform()"
				        type="submit"
				        class="btn blue"
				        :disabled="updating">
					Save
					<i v-show="updating"
					   class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- END EDIT -->

		<!-- START DELETE -->
		<modal :show="showDeleteModal"
		       effect="fade"
		       @closeOnEscape="closeDeleteModal"
			   ref="deleteModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Confirm Delete</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<div class="row">
					<div class="col-md-12">
						<div class="alert alert-danger"
								v-show="deleteErrorMessage.length"
								ref="deleteErrorMessage">
							<button class="close"
									@click.prevent="clearError('deleteErrorMessage')"></button>
							<span>{{ deleteErrorMessage }}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<p>Are you sure you want to delete {{platformToDelete.name}}?</p>
					</div>
				</div>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<button type="button"
				        class="btn blue"
				        @click="deletePlatform()"
				        :disabled="deleting">
					Delete
					<i v-show="deleting"
					   class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- START DELETE -->
	</div>
</template>

<script>
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import PlatformsFunctions from '@/controllers/Platforms'
import Modal from '@/components/modules/Modal'
import NoResults from '@/components/modules/NoResults'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Platforms', link: false }],

			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newPlatform: {
				name: ''
			},

			loadingPlatforms: false,
			listErrorMessage: '',
			platforms: [],

			showEditModal: false,
			updating: false,
			editErrorMessage: '',
			platformToEdit: {
				name: ''
			},

			showDeleteModal: false,
			deleting: false,
			deleteErrorMessage: '',
			platformToDelete: {
				name: ''
			}
		}
	},
	computed: {
		activeLocationId: function () {
			return this.$root.activeLocation.id
		}
	},
	watch: {
		activeLocationId: function (newId) {
			if (newId !== undefined) {
				this.getPlatforms()
			}
		}
	},
	mounted () {
		this.getPlatforms()
	},
	methods: {
		/**
		 * To toggle the create tier panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePanel () {
			this.createNewCollapse = !this.createNewCollapse
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {object} errorMessageName - The error message to be cleared.
		 * @returns {undefined}
		 */
		clearError (errorMessageName) {
			this[errorMessageName] = ''
		},
		/**
		 * To check if the platform data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewPlatformData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.newPlatform.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new platform.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createPlatform () {
			var _this = this
			_this.clearError('createErrorMessage')

			return _this
				.validateNewPlatformData()
				.then(response => {
					_this.creating = true
					PlatformsFunctions.createPlatform(_this.newPlatform)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.showCreateSuccess(response.payload)
								_this.clearNewPlatform()
								_this.getPlatforms()
							} else {
								_this.createErrorMessage = response.message
								_this.$scrollTo(_this.$refs.createErrorMessage, 1000, {
									offset: -50
								})
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create the platform',
								errorName: 'createErrorMessage',
								vue: _this
							})
						})
						.finally(() => {
							_this.creating = false
						})
				})
				.catch(reason => {
					_this.createErrorMessage = reason
					_this.$scrollTo(_this.$refs.createErrorMessage, 1000, { offset: -50 })
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showCreateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Platform has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Platform has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To clear the new platform form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewPlatform () {
			this.newPlatform = {
				name: ''
			}
		},
		/**
		 * To get a list of all platforms.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPlatforms () {
			this.clearError('listErrorMessage')
			this.loadingPlatforms = true
			this.platforms = []
			var _this = this
			return PlatformsFunctions.listPlatforms()
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.loadingPlatforms = false
						_this.platforms = response.payload
					} else {
						_this.loadingPlatforms = false
					}
				})
				.catch(reason => {
					_this.loadingPlatforms = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of platforms',
						errorName: 'listErrorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To show the modal to edit an platform details.
		 * @function
		 * @param {object} platform - The selected platform.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editPlatform (platform, event) {
			event.stopPropagation()
			this.platformToEdit = { ...platform }
			this.showEditModal = true
		},
		/**
		 * To check if the platform data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedPlatformData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.platformToEdit.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a platform.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updatePlatform () {
			var _this = this
			_this.clearError('editErrorMessage')
			let payload = { ...this.platformToEdit }

			return _this
				.validateEditedPlatformData()
				.then(response => {
					_this.updating = true
					PlatformsFunctions.updatePlatform(
						payload,
						_this.$root.appId,
						_this.$root.appSecret,
						_this.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.getPlatforms()
								_this.closeEditModal()
								_this.resetEdit()
								_this.showEditSuccess(response.payload)
							} else {
								_this.editErrorMessage = response.message
								_this.$scrollTo(_this.$refs.editErrorMessage, 1000, {
									offset: -50
								})
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the platform',
								errorName: 'editErrorMessage',
								vue: _this,
								containerRef: 'editModal'
							})
						})
						.finally(() => {
							_this.updating = false
						})
				})
				.catch(reason => {
					console.log(reason)
					_this.editErrorMessage = reason
					_this.$scrollTo(_this.$refs.editErrorMessage, 1000, { offset: -50 })
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
			let text = 'The Platform has been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Platform has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To close the modal for editing a promotion.
		 * @function
		 * @returns {undefined}
		 */
		closeEditModal () {
			this.showEditModal = false
		},
		/**
		 * To reset the edit form
		 * @function
		 * @returns {undefined}
		 */
		resetEdit () {
			this.platformToEdit = {
				name: ''
			}
		},
		/**
		 * To display the modal for deleting an platform.
		 * @function
		 * @param {object} platform - The selected platform
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		confirmDelete (platform, event) {
			event.stopPropagation()
			this.platformToDelete = { ...platform }
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deletePlatform () {
			this.deleting = true
			var _this = this
			return PlatformsFunctions.deletePlatform(_this.platformToDelete)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.getPlatforms()
						_this.closeDeleteModal()
						_this.showDeleteSuccess(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not delete ${this.platformToDelete.name}`,
						errorName: 'deleteErrorMessage',
						vue: _this,
						containerRef: 'deleteModal'
					})
				})
				.finally(() => {
					_this.deleting = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showDeleteSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Platform has been deleted'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The removal has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To close the delete modal.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.showDeleteModal = false
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		Modal,
		NoResults
	}
}
</script>

<style scoped>
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover {
  background-color: white;
}
.three-vertical-actions {
  min-height: 124px;
}
</style>

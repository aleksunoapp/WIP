<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Delivery Providers</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage delivery providers.</p>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki"
		     v-if="$root.permissions['stores delivery_provider create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Delivery Provider
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body relative-block"
			     :class="{'display-hide': createNewCollapse}">
				<div class="col-md-12"
				     v-show="activeLocationId === undefined">
					<div class="alert center alert-info">
						<h4>No Store Selected</h4>
						<p>Please select a store from the stores panel on the right to create a delivery provider for it.</p>
					</div>
				</div>
				<form role="form"
				      @submit.prevent="createDeliveryProvider()"
				      v-show="activeLocationId !== undefined">
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
								       :class="{'edited': newDeliveryProvider.name.length}"
								       id="form_control_1"
								       v-model="newDeliveryProvider.name">
								<label for="form_control_1">Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newDeliveryProvider.sort_order.length}"
								       id="form_control_3"
								       v-model="newDeliveryProvider.sort_order">
								<label for="form_control_3">Sort Order</label>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
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
					id="deliveryProviders-container">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Delivery Providers</span>
					<div class="caption-desc font-grey-cascade">Create, edit or delete delivery providers.</div>
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
				<loading-screen :show="loadingDeliveryProviders"
												:color="'#2C3E50'"
												:display="'inline'"></loading-screen>
				<div v-if="activeLocationId === undefined && !loadingDeliveryProviders">
					<div class="alert center alert-info">
						<h4>No Store Selected</h4>
						<p>Please select a store from the stores panel on the right to view delivery providers for it.</p>
					</div>
				</div>
				<div class="mt-element-list margin-top-15"
							v-if="deliveryProviders.length && !loadingDeliveryProviders">
					<div class="mt-list-container list-news ext-1 no-border">
						<ul>
							<li class="mt-list-item actions-at-left margin-top-15 two-vertical-actions"
									v-for="deliveryProvider in deliveryProviders"
									:id="'deliveryProvider-' + deliveryProvider.id"
									:key="deliveryProvider.id">
								<div class="list-item-actions">
									<el-tooltip v-if="$root.permissions['stores delivery_provider update']"
															content="Edit"
															effect="light"
															placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
												@click="editDeliveryProvider(deliveryProvider, $event)">
											<i class="fa fa-lg fa-pencil"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['stores delivery_provider read'] && !$root.permissions['stores delivery_provider update']"
															content="View"
															effect="light"
															placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
												@click="editDeliveryProvider(deliveryProvider, $event)">
											<i class="fa fa-lg fa-eye"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['stores delivery_provider delete']"
															content="Delete"
															effect="light"
															placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
												@click="confirmDelete(deliveryProvider, $event)">
											<i class="fa fa-lg fa-trash"></i>
										</a>
									</el-tooltip>
								</div>
								<div class="list-datetime bold uppercase font-red">
									<span>{{ deliveryProvider.provider_name }}</span>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="margin-top-20">
					<no-results :show="!(activeLocationId === undefined) && !deliveryProviders.length && !loadingDeliveryProviders"
											:type="'delivery providers'"></no-results>
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
				<h4 class="modal-title center">Edit Delivery Provider</h4>
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
							<fieldset :disabled="!$root.permissions['stores delivery_provider update']">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
												class="form-control input-sm"
												:class="{'edited': deliveryProviderToEdit.provider_name.length}"
												id="form_control_1"
												v-model="deliveryProviderToEdit.provider_name">
									<label for="form_control_1">Name</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
												class="form-control input-sm"
												:class="{'edited': deliveryProviderToEdit.sort_order.length}"
												id="form_control_3"
												v-model="deliveryProviderToEdit.sort_order">
									<label for="form_control_3">Sort Order</label>
								</div>
							</fieldset>
						</div>
					</div>
				</form>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<button v-if="!$root.permissions['stores delivery_provider update']"
				        @click="closeEditModal()"
				        type="button"
				        class="btn blue">
					Close
				</button>
				<button v-else
				        @click="updateDeliveryProvider()"
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
				<p>Are you sure you want to delete {{deliveryProviderToDelete.provider_name}}?</p>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<button type="button"
				        class="btn blue"
				        @click="deleteDeliveryProvider()"
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
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import DeliveryProvidersFunctions from '../../../controllers/DeliveryProviders'
import Modal from '../../modules/Modal'
import NoResults from '../../modules/NoResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Delivery Providers', link: false }],

			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newDeliveryProvider: {
				name: '',
				sort_order: ''
			},

			loadingDeliveryProviders: false,
			listErrorMessage: '',
			deliveryProviders: [],

			showEditModal: false,
			editErrorMessage: '',
			updating: false,
			deliveryProviderToEdit: {
				provider_name: '',
				sort_order: ''
			},

			showDeleteModal: false,
			deleting: false,
			deleteErrorMessage: '',
			deliveryProviderToDelete: {
				provider_name: ''
			}
		}
	},
	computed: {
		activeLocationId: function () {
			return this.$root.activeLocation.id
		}
	},
	watch: {
		activeLocationId: {
			handler: function (newId) {
				if (newId !== undefined) {
					this.clearError('listErrorMessage')
					this.getDeliveryProviders()
				} else {
					this.deliveryProviders = []
				}
			},
			immediate: true
		}
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
		 * To check if the input is a positive number
		 * @function
		 * @param {string} input - User's input
		 * @returns {boolean} True is positive integer or float, false is not
		 */
		isNonNegativeNumber (input) {
			try {
				const inputString = String(input)
				if (inputString.length > inputString.replace(/[^\d.]/g, '').length) {
					return false
				}
				const value = Number(input)
				if (value < 0) {
					return false
				}
				return true
			} catch (e) {
				if (this.environment !== 'production') {
					console.log({e})
				}
				return false
			}
		},
		/**
		 * To check if the delivery provider data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewDeliveryProviderData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.newDeliveryProvider.name.length) {
					reject('Name cannot be blank')
				} else if (!_this.isNonNegativeNumber(_this.newDeliveryProvider.sort_order)) {
					reject('Sort order must be zero or more')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new delivery provider.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createDeliveryProvider () {
			var _this = this
			_this.clearError('createErrorMessage')
			this.newDeliveryProvider.location_id = this.activeLocationId

			return _this
				.validateNewDeliveryProviderData()
				.then(response => {
					this.creating = true

					DeliveryProvidersFunctions.createDeliveryProvider(this.newDeliveryProvider)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.showCreateSuccess(response.payload)
								_this.clearNewDeliveryProvider()
								_this.getDeliveryProviders()
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
								errorText: 'We could not create the delivery provider',
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
			let text = 'The Delivery Provider has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Delivery Provider has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To clear the new delivery provider form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewDeliveryProvider () {
			this.newDeliveryProvider = {
				name: '',
				sort_order: ''
			}
		},
		/**
		 * To get a list of all delivery providers.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getDeliveryProviders () {
			this.loadingDeliveryProviders = true
			this.deliveryProviders = []
			var _this = this
			return DeliveryProvidersFunctions.listDeliveryProviderForStore(this.activeLocationId)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						response.payload.sort((a, b) => {
							if (a.sort_order < b.sort_order) {
								return -1
							} else if (a.sort_order > b.sort_order) {
								return 1
							} else {
								return 0
							}
						})
						_this.deliveryProviders = response.payload.map(provider => {
							return {
								...provider,
								sort_order: provider.sort_order.toString()
							}
						})
						_this.loadingDeliveryProviders = false
					} else {
						_this.loadingDeliveryProviders = false
					}
				})
				.catch(reason => {
					_this.loadingDeliveryProviders = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of delivery providers',
						errorName: 'listErrorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To show the modal to edit an delivery provider details.
		 * @function
		 * @param {object} deliveryProvider - The selected delivery provider.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editDeliveryProvider (deliveryProvider, event) {
			event.stopPropagation()
			this.deliveryProviderToEdit = {...deliveryProvider}
			this.showEditModal = true
		},
		/**
		 * To check if the delivery provider data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedDeliveryProviderData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.deliveryProviderToEdit.provider_name.length) {
					reject('Name cannot be blank')
				} else if (!_this.isNonNegativeNumber(_this.deliveryProviderToEdit.sort_order)) {
					reject('Sort order must be zero or more')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a delivery provider.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updateDeliveryProvider () {
			var _this = this
			_this.clearError('editErrorMessage')
			let payload = {...this.deliveryProviderToEdit}
			payload.name = payload.provider_name
			delete payload.provider_name
			payload.location_id = this.activeLocationId

			return _this
				.validateEditedDeliveryProviderData()
				.then(response => {
					this.updating = true

					DeliveryProvidersFunctions.updateDeliveryProvider(payload)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.getDeliveryProviders()
								_this.closeEditModal()
								_this.showEditSuccess(response.payload)
								_this.resetEdit()
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
								errorText: 'We could not update the delivery provider',
								errorName: 'editErrorMessage',
								vue: _this
							})
						})
						.finally(() => {
							_this.updating = false
						})
				})
				.catch(reason => {
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
			let text = 'The Delivery Provider has been saved'
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
			this.deliveryProviderToEdit = {
				provider_name: '',
				sort_order: ''
			}
		},
		/**
		 * To display the modal for deleting an delivery provider.
		 * @function
		 * @param {object} deliveryProvider - The selected deliveryProvider
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		confirmDelete (deliveryProvider, event) {
			event.stopPropagation()
			this.deliveryProviderToDelete = { ...deliveryProvider }
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteDeliveryProvider () {
			this.deleting = true
			var _this = this
			return DeliveryProvidersFunctions.deleteDeliveryProvider(_this.deliveryProviderToDelete.id)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.getDeliveryProviders()
						_this.closeDeleteModal()
						_this.showDeleteSuccess(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not delete ${this.deliveryProviderToDelete.name}`,
						errorName: 'deleteErrorMessage',
						vue: _this
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
			let text = 'The Delivery Provider has been deleted'
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
.display-block {
  display: block;
}
.two-vertical-actions {
  min-height: 90px;
}
</style>

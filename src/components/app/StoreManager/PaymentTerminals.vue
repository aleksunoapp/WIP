<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Payment Terminals</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage payment terminals.</p>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki"
				 v-if="$root.permissions['stores payment_terminals create']">
			<div class="portlet-title bg-blue-chambray"
					 @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Payment Terminal
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
						<p>Please select a store from the stores panel on the right to create a payment terminal for it.</p>
					</div>
				</div>
				<form role="form"
							@submit.prevent="createPaymentTerminal()"
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
											 :class="{'edited': newPaymentTerminal.terminal_name.length}"
											 id="form_control_1"
											 v-model="newPaymentTerminal.terminal_name">
								<label for="form_control_1">Terminal name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
											 class="form-control input-sm"
											 :class="{'edited': newPaymentTerminal.terminal_id.length}"
											 id="form_control_1"
											 v-model="newPaymentTerminal.terminal_id">
								<label for="form_control_1">Terminal ID</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
											 class="form-control input-sm"
											 :class="{'edited': newPaymentTerminal.store_id.length}"
											 id="form_control_1"
											 v-model="newPaymentTerminal.store_id">
								<label for="form_control_1">Store ID</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
											 class="form-control input-sm"
											 :class="{'edited': newPaymentTerminal.processor.length}"
											 id="form_control_1"
											 v-model="newPaymentTerminal.processor">
								<label for="form_control_1">Processor</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
											 class="form-control input-sm"
											 :class="{'edited': newPaymentTerminal.api_token.length}"
											 id="form_control_1"
											 v-model="newPaymentTerminal.api_token">
								<label for="form_control_1">API Token</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
											 class="form-control input-sm"
											 :class="{'edited': newPaymentTerminal.additional_info.length}"
											 id="form_control_1"
											 v-model="newPaymentTerminal.additional_info">
								<label for="form_control_1">Additional info</label>
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
					id="paymentTerminals-container">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Payment Terminals</span>
					<div class="caption-desc font-grey-cascade">Create, edit or delete payment terminals.</div>
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
				<loading-screen :show="loadingPaymentTerminals"
												:color="'#2C3E50'"
												:display="'inline'"></loading-screen>
				<div v-if="activeLocationId === undefined && !loadingPaymentTerminals">
					<div class="alert center alert-info">
						<h4>No Store Selected</h4>
						<p>Please select a store from the stores panel on the right to view payment terminals for it.</p>
					</div>
				</div>
				<div class="mt-element-list margin-top-15"
							v-if="paymentTerminals.length && !loadingPaymentTerminals">
					<div class="mt-list-container list-news ext-1 no-border">
						<ul>
							<li class="mt-list-item actions-at-left margin-top-15 two-vertical-actions"
									v-for="paymentTerminal in paymentTerminals"
									:id="'paymentTerminal-' + paymentTerminal.id"
									:key="paymentTerminal.id">
								<div class="list-item-actions">
									<el-tooltip v-if="$root.permissions['stores payment_terminals update']"
															content="Edit"
															effect="light"
															placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
												@click="editPaymentTerminal(paymentTerminal, $event)">
											<i class="fa fa-lg fa-pencil"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['stores payment_terminals read'] && !$root.permissions['stores payment_terminals update']"
															content="View"
															effect="light"
															placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
												@click="editPaymentTerminal(paymentTerminal, $event)">
											<i class="fa fa-lg fa-eye"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['stores payment_terminals delete']"
															content="Delete"
															effect="light"
															placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
												@click="confirmDelete(paymentTerminal, $event)">
											<i class="fa fa-lg fa-trash"></i>
										</a>
									</el-tooltip>
								</div>
								<div class="list-datetime bold uppercase font-red">
									<span>{{ paymentTerminal.terminal_name }}</span>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="margin-top-20">
					<no-results :show="!(activeLocationId === undefined) && !paymentTerminals.length && !loadingPaymentTerminals"
											:type="'payment terminals'"></no-results>
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
				<h4 class="modal-title center">Edit Payment Terminal</h4>
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
							<fieldset :disabled="!$root.permissions['stores payment_terminals update']">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
												class="form-control input-sm"
												:class="{'edited': paymentTerminalToEdit.terminal_name.length}"
												id="form_control_1"
												v-model="paymentTerminalToEdit.terminal_name">
									<label for="form_control_1">Terminal name</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
												class="form-control input-sm"
												:class="{'edited': paymentTerminalToEdit.terminal_id.length}"
												id="form_control_1"
												v-model="paymentTerminalToEdit.terminal_id">
									<label for="form_control_1">Terminal ID</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
												class="form-control input-sm"
												:class="{'edited': paymentTerminalToEdit.store_id.length}"
												id="form_control_1"
												v-model="paymentTerminalToEdit.store_id">
									<label for="form_control_1">Store ID</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
												class="form-control input-sm"
												:class="{'edited': paymentTerminalToEdit.processor.length}"
												id="form_control_1"
												v-model="paymentTerminalToEdit.processor">
									<label for="form_control_1">Processor</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
												class="form-control input-sm"
												:class="{'edited': paymentTerminalToEdit.api_token.length}"
												id="form_control_1"
												v-model="paymentTerminalToEdit.api_token">
									<label for="form_control_1">API Token</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
												class="form-control input-sm"
												:class="{'edited': paymentTerminalToEdit.additional_info.length}"
												id="form_control_1"
												v-model="paymentTerminalToEdit.additional_info">
									<label for="form_control_1">Additional info</label>
								</div>
							</fieldset>
						</div>
					</div>
				</form>
			</div>
			<div slot="modal-footer"
					 class="modal-footer clear">
				<button v-if="!$root.permissions['stores payment_terminals update']"
								@click="closeEditModal()"
								type="button"
								class="btn blue">
					Close
				</button>
				<button v-else
								@click="updatePaymentTerminal()"
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
				<p>Are you sure you want to delete {{paymentTerminalToDelete.terminal_name}}?</p>
			</div>
			<div slot="modal-footer"
					 class="modal-footer clear">
				<button type="button"
								class="btn blue"
								@click="deletePaymentTerminal()"
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
import PaymentTerminalsFunctions from '../../../controllers/PaymentTerminals'
import Modal from '../../modules/Modal'
import NoResults from '../../modules/NoResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Payment Terminals', link: false }],

			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newPaymentTerminal: {
				store_id: '',
				api_token: '',
				terminal_id: '',
				additional_info: '',
				processor: '',
				terminal_name: ''
			},

			loadingPaymentTerminals: false,
			listErrorMessage: '',
			paymentTerminals: [],

			showEditModal: false,
			editErrorMessage: '',
			updating: false,
			paymentTerminalToEdit: {
				store_id: '',
				api_token: '',
				terminal_id: '',
				additional_info: '',
				processor: '',
				terminal_name: ''
			},

			showDeleteModal: false,
			deleting: false,
			deleteErrorMessage: '',
			paymentTerminalToDelete: {
				store_id: '',
				api_token: '',
				terminal_id: '',
				additional_info: '',
				processor: '',
				terminal_name: ''
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
					this.getPaymentTerminals()
				} else {
					this.paymentTerminals = []
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
		 * To check if the payment terminal data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewPaymentTerminalData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.newPaymentTerminal.terminal_name) {
					reject('Terminal Name cannot be blank')
				} else if (!_this.newPaymentTerminal.terminal_id) {
					reject('Terminal ID cannot be blank')
				} else if (!_this.newPaymentTerminal.store_id.length) {
					reject('Store ID cannot be blank')
				} else if (!_this.newPaymentTerminal.processor) {
					reject('Processor cannot be blank')
				} else if (!_this.newPaymentTerminal.api_token) {
					reject('API Token cannot be blank')
				} else if (!_this.newPaymentTerminal.additional_info) {
					reject('Additional Info cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new payment terminal.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createPaymentTerminal () {
			var _this = this
			_this.clearError('createErrorMessage')

			return _this
				.validateNewPaymentTerminalData()
				.then(response => {
					this.creating = true

					PaymentTerminalsFunctions.createPaymentTerminal(this.newPaymentTerminal, this.activeLocationId)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.showCreateSuccess(response.payload)
								_this.clearNewPaymentTerminal()
								_this.getPaymentTerminals()
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
								errorText: 'We could not create the payment terminal',
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
			let text = 'The Payment Terminal has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Payment Terminal has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To clear the new payment terminal form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewPaymentTerminal () {
			this.newPaymentTerminal = {
				store_id: '',
				api_token: '',
				terminal_id: '',
				additional_info: '',
				processor: '',
				terminal_name: ''
			}
		},
		/**
		 * To get a list of all payment terminals.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPaymentTerminals () {
			this.loadingPaymentTerminals = true
			this.paymentTerminals = []
			var _this = this
			return PaymentTerminalsFunctions.listPaymentTerminalForStore(this.activeLocationId)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.paymentTerminals = response.payload
						_this.loadingPaymentTerminals = false
					} else {
						_this.loadingPaymentTerminals = false
					}
				})
				.catch(reason => {
					_this.loadingPaymentTerminals = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of payment terminals',
						errorName: 'listErrorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To show the modal to edit an payment terminal details.
		 * @function
		 * @param {object} paymentTerminal - The selected payment terminal.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editPaymentTerminal (paymentTerminal, event) {
			event.stopPropagation()
			this.paymentTerminalToEdit = {...paymentTerminal}
			this.showEditModal = true
		},
		/**
		 * To check if the payment terminal data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedPaymentTerminalData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.paymentTerminalToEdit.terminal_name) {
					reject('Terminal Name cannot be blank')
				} else if (!_this.paymentTerminalToEdit.terminal_id) {
					reject('Terminal ID cannot be blank')
				} else if (!_this.paymentTerminalToEdit.store_id.length) {
					reject('Store ID cannot be blank')
				} else if (!_this.paymentTerminalToEdit.processor) {
					reject('Processor cannot be blank')
				} else if (!_this.paymentTerminalToEdit.api_token) {
					reject('API Token cannot be blank')
				} else if (!_this.paymentTerminalToEdit.additional_info) {
					reject('Additional Info cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a payment terminal.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updatePaymentTerminal () {
			var _this = this
			_this.clearError('editErrorMessage')
			let payload = {...this.paymentTerminalToEdit}
			payload.location_id = this.activeLocationId

			return _this
				.validateEditedPaymentTerminalData()
				.then(response => {
					this.updating = true

					PaymentTerminalsFunctions.updatePaymentTerminal(payload)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.getPaymentTerminals()
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
								errorText: 'We could not update the payment terminal',
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
			let text = 'The Payment Terminal has been saved'
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
			this.paymentTerminalToEdit = {
				store_id: '',
				api_token: '',
				terminal_id: '',
				additional_info: '',
				processor: '',
				terminal_name: ''
			}
		},
		/**
		 * To display the modal for deleting an payment terminal.
		 * @function
		 * @param {object} paymentTerminal - The selected paymentTerminal
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		confirmDelete (paymentTerminal, event) {
			event.stopPropagation()
			this.paymentTerminalToDelete = { ...paymentTerminal }
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deletePaymentTerminal () {
			this.deleting = true
			var _this = this
			return PaymentTerminalsFunctions.deletePaymentTerminal(_this.paymentTerminalToDelete.id)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.getPaymentTerminals()
						_this.closeDeleteModal()
						_this.showDeleteSuccess(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not delete ${this.paymentTerminalToDelete.name}`,
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
			let text = 'The Payment Terminal has been deleted'
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

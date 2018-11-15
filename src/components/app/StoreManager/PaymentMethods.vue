<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Payment Methods</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage payment methods.</p>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki"
				 v-if="$root.permissions['stores payment methods create'] && paymentMethods.id === undefined">
			<div class="portlet-title bg-blue-chambray"
					 @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create Payment Methods
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body relative-block"
					 :class="{'display-hide': createNewCollapse}">
				<div 
					v-if="activeLocationId === undefined"
					class="row"
				>
					<div class="col-md-12">
						<div class="alert alert-info center margin-top-20">
							<h4>No Store Selected</h4>
							<p>Please select a store from the stores panel on the right to view its data</p>
						</div>
					</div>
				</div>
				<form v-else
							role="form"
							@submit.prevent="createPaymentMethods()">
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
							<table class="table">
								<tbody>
									<tr>
										<td>
											Cash
										</td>
										<td>
											<el-switch
																v-model="newPaymentMethod.cash"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
									<tr>
										<td>
											Credit
										</td>
										<td>
											<el-switch
																v-model="newPaymentMethod.credit"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
									<tr>
										<td>
											Debit
										</td>
										<td>
											<el-switch
																v-model="newPaymentMethod.debit"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
									<tr>
										<td>
											Gift Cards
										</td>
										<td>
											<el-switch
																v-model="newPaymentMethod.gift_card"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
									<tr>
										<td>
											App Payments
										</td>
										<td>
											<el-switch
																v-model="newPaymentMethod.app_payment"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
								</tbody>
							</table>
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
				id="payment-methods-container">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Payment Methods</span>
					<div class="caption-desc font-grey-cascade">Create, edit or delete payment methods.</div>
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
				<loading-screen :show="loadingPaymentMethods"
								:color="'#2C3E50'"
								:display="'inline'"></loading-screen>
				<div 
					v-if="activeLocationId === undefined && !loadingPaymentMethods && paymentMethods.id === undefined"
					class="row"
				>
					<div class="col-md-12">
						<div class="alert alert-info center margin-top-20">
							<h4>No Store Selected</h4>
							<p>Please select a store from the stores panel on the right to view its data</p>
						</div>
					</div>
				</div>
				<div class="mt-element-list margin-top-15"
						v-if="activeLocationId !== undefined && paymentMethods.id !== undefined && !loadingPaymentMethods">
					<div class="row">
						<div class="col-xs-12">
							<table class="table">
								<tbody>
									<tr>
										<td>
											Cash
										</td>
										<td>
											<el-switch :disabled="!$root.permissions['stores payment methods update']"
																v-model="paymentMethods.cash"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
									<tr>
										<td>
											Credit
										</td>
										<td>
											<el-switch :disabled="!$root.permissions['stores payment methods update']"
																v-model="paymentMethods.credit"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
									<tr>
										<td>
											Debit
										</td>
										<td>
											<el-switch :disabled="!$root.permissions['stores payment methods update']"
																v-model="paymentMethods.debit"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
									<tr>
										<td>
											Gift Cards
										</td>
										<td>
											<el-switch :disabled="!$root.permissions['stores payment methods update']"
																v-model="paymentMethods.gift_card"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
									<tr>
										<td>
											App Payments
										</td>
										<td>
											<el-switch :disabled="!$root.permissions['stores payment methods update']"
																v-model="paymentMethods.app_payment"
																active-color="#0c6"
																inactive-color="#ff4949"
																:active-value="1"
																:inactive-value="0"
																active-text="Yes"
																inactive-text="No">
											</el-switch>
										</td>
									</tr>
								</tbody>
							</table>
							<button 
											v-if="$root.permissions['stores payment methods update']"
											@click="updatePaymentMethods()"
											type="submit"
											class="btn blue pull-right"
											:disabled="updating">
								Save
								<i v-show="updating"
									class="fa fa-spinner fa-pulse fa-fw">
								</i>
							</button>
							<button 
											v-if="$root.permissions['stores payment methods delete']"
											@click="confirmDelete()"
											type="submit"
											class="btn blue btn-outline pull-right margin-right-10"
											:disabled="updating">
								Delete
							</button>
						</div>
					</div>
				</div>
				<div class="margin-top-20">
					<no-results :show="activeLocationId !== undefined && paymentMethods.id === undefined && !loadingPaymentMethods"
								:type="'payment methods'"></no-results>
				</div>
			</div>
		</div>
		<!-- END LIST -->

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
											data-close="alert"
											@click.prevent="clearError('deleteErrorMessage')"></button>
							<span>{{ deleteErrorMessage }}</span>
						</div>
					</div>
				</div>
				<p>Are you sure you want to delete?</p>
			</div>
			<div slot="modal-footer"
					 class="modal-footer clear">
				<button type="button"
								class="btn blue"
								@click="deletePaymentMethods()"
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
import PaymentMethodsFunctions from '@/controllers/PaymentMethods'
import Modal from '@/components/modules/Modal'
import NoResults from '@/components/modules/NoResults'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Payment Methods', link: false }],

			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newPaymentMethod: {
				cash: 0,
				credit: 0,
				debit: 0,
				gift_card: 0,
				app_payment: 0
			},

			loadingPaymentMethods: false,
			listErrorMessage: '',
			paymentMethods: {},

			updating: false,

			showDeleteModal: false,
			deleting: false,
			deleteErrorMessage: ''
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
					this.getPaymentMethods()
				} else {
					this.paymentMethods = {}
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
		 * To check if the payment method data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewPaymentMethodData () {
			// var _this = this
			return new Promise(function (resolve, reject) {
				resolve('Hurray')
			})
		},
		/**
		 * To create a new payment method.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createPaymentMethods () {
			var _this = this
			_this.clearError('createErrorMessage')

			return _this
				.validateNewPaymentMethodData()
				.then(response => {
					_this.creating = true
					PaymentMethodsFunctions.createPaymentMethods({
						..._this.newPaymentMethod,
						location_id: _this.activeLocationId
					})
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								if (response.payload === null) {
									response.payload = {}
								}
								if (response.payload && response.payload.pending_approval !== true) {
									_this.getPaymentMethods()
								}
								_this.showCreateSuccess(response.payload)
								_this.clearNewPaymentMethod()
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
								errorText: 'We could not create the payment method',
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
			let text = 'The Payment Methods have been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Payment Methods have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To clear the new payment method form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewPaymentMethod () {
			this.newPaymentMethod = {
				cash: 0,
				credit: 0,
				debit: 0,
				gift_card: 0,
				app_payment: 0
			}
		},
		/**
		 * To get a list of all payment methods.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPaymentMethods () {
			this.clearError('listErrorMessage')
			if (this.activeLocationId === undefined) return
			this.loadingPaymentMethods = true
			this.paymentMethods = {}
			var _this = this
			return PaymentMethodsFunctions.listPaymentMethodsForStore(this.activeLocationId)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						if (response.payload === null) {
							response.payload = {}
						}
						if (response.payload.id !== undefined) {
							_this.paymentMethods = response.payload
						}
						_this.loadingPaymentMethods = false
					} else {
						_this.loadingPaymentMethods = false
					}
				})
				.catch(reason => {
					_this.loadingPaymentMethods = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of payment methods',
						errorName: 'listErrorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To check if the paymentMethod data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedPaymentMethodData () {
			// var _this = this
			return new Promise(function (resolve, reject) {
				resolve('Hurray')
			})
		},
		/**
		 * To update a paymentMethod.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updatePaymentMethods () {
			var _this = this
			_this.clearError('listErrorMessage')
			let payload = {...this.paymentMethods}

			return _this
				.validateEditedPaymentMethodData()
				.then(response => {
					_this.updating = true
					PaymentMethodsFunctions.updatePaymentMethods(
						payload,
						_this.$root.appId,
						_this.$root.appSecret,
						_this.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								if (response.payload && response.payload.pending_approval !== true) {
									_this.getPaymentMethods()
								}
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
								errorText: 'We could not update the payment method',
								errorName: 'listErrorMessage',
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
			let text = 'The Payment Methods have been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Payment Methods have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To display the modal for deleting an payment method.
		 * @function
		 * @returns {undefined}
		 */
		confirmDelete () {
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deletePaymentMethods () {
			this.clearError('deleteErrorMessage')
			this.deleting = true
			var _this = this
			return PaymentMethodsFunctions.deletePaymentMethods(_this.paymentMethods.id)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.getPaymentMethods()
						_this.closeDeleteModal()
						_this.showDeleteSuccess(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not delete the Payment Methods`,
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
			let text = 'The Payment Methods have been deleted'
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
			this.clearError('deleteErrorMessage')
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
.display-flex {
	display: flex;
}
.align-items-center {
	align-items: center;
}
.ma-0 {
	margin: 0;
}
.margin-right-20 {
	margin-right: 20px;
}
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover {
	background-color: white;
}
.three-vertical-actions {
	min-height: 124px;
}
</style>

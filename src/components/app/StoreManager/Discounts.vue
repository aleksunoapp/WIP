<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Discounts</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage discounts.</p>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki"
				 v-if="$root.permissions['stores discounts create']">
			<div class="portlet-title bg-blue-chambray"
					 @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Discount
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
						<p>Please select a store from the stores panel on the right to create discounts for it.</p>
					</div>
				</div>
				<form role="form"
							@submit.prevent="createDiscount()"
							v-show="activeLocationId !== undefined">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
									 v-show="createErrorMessage.length"
									 ref="createErrorMessage">
								<button class="close"
										@click.prevent="clearError('createErrorMessage')"></button>
								<span>{{ createErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input
									type="text"
									class="form-control input-sm"
									:class="{'edited': newDiscount.name.length}"
									id="form_control_new_name"
									v-model="newDiscount.name"
								>
								<label for="form_control_new_name">Name</label>
							</div>
							<div class="width-100 display-flex align-items-center">
								<label
									class="select-label"
								>
									Type:
								</label>
								<el-select 
									v-model="newDiscount.type"
									placeholder="% or $"
									size="small"
								>
									<el-option label="percent"
												value="percentage"></el-option>
									<el-option label="dollars"
												value="dollar"></el-option>
								</el-select>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input
									type="text"
									class="form-control input-sm"
									:class="{'edited': newDiscount.value.length}"
									id="form_control_new_value"
									v-model="newDiscount.value"
								>
								<label for="form_control_new_value">Value</label>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<button 
								type="submit"
								class="btn blue pull-right"
								:disabled="creating"
							>
								Create
								<i 
									v-show="creating"
									class="fa fa-spinner fa-pulse fa-fw"
								>
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
					id="discounts-container">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../public/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Discounts</span>
					<div class="caption-desc font-grey-cascade">Edit or delete store discounts.</div>
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
				<loading-screen :show="loadingDiscounts"
												:color="'#2C3E50'"
												:display="'inline'"></loading-screen>
				<div v-if="activeLocationId === undefined && !loadingDiscounts">
					<div class="alert center alert-info">
						<h4>No Store Selected</h4>
						<p>Please select a store from the stores panel on the right to view discounts for it.</p>
					</div>
				</div>
				<div class="mt-element-list margin-top-15"
							v-if="discounts.length && !loadingDiscounts">
					<div class="mt-list-container list-news ext-1 no-border">
						<ul>
							<li class="mt-list-item actions-at-left margin-top-15 two-vertical-actions"
									v-for="discount in discounts"
									:id="'discount-' + discount.id"
									:key="discount.id">
								<div class="list-item-actions">
									<el-tooltip v-if="$root.permissions['stores discounts update']"
															content="Edit"
															effect="light"
															placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
												@click="editDiscount(discount, $event)">
											<i class="fa fa-lg fa-pencil"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['stores discounts read'] && !$root.permissions['stores discounts update']"
															content="View"
															effect="light"
															placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
												@click="editDiscount(discount, $event)">
											<i class="fa fa-lg fa-eye"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['stores discounts delete']"
															content="Delete"
															effect="light"
															placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
												@click="confirmDelete(discount, $event)">
											<i class="fa fa-lg fa-trash"></i>
										</a>
									</el-tooltip>
								</div>
								<div class="list-datetime bold uppercase font-red">
									<span>{{ discount.name }}</span>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="margin-top-20">
					<no-results
						:show="!(activeLocationId === undefined) && !discounts.length && !loadingDiscounts"
						:type="'discounts'"
					>
					</no-results>
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
				<button 
					type="button"
					class="close"
					@click="closeEditModal()"
				>
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Discount</h4>
			</div>
			<div slot="modal-body"
					 class="modal-body">
				<form role="form">
					<div class="row">
						<div class="col-md-12">
							<div 
								class="alert alert-danger"
								v-show="editErrorMessage.length"
								ref="editErrorMessage"
							>
								<button
									class="close"
									@click.prevent="clearError('editErrorMessage')"
								>
								</button>
								<span>{{ editErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-12">
							<fieldset :disabled="!$root.permissions['stores discounts update']">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input
										type="text"
										class="form-control input-sm"
										:class="{'edited': discountToEdit.name.length}"
										id="form_control_edited_name"
										v-model="discountToEdit.name"
									>
									<label for="form_control_edited_name">Name</label>
								</div>
								<div class="width-100 display-flex align-items-center">
									<label
										class="select-label"
									>
										Type:
									</label>
									<el-select 
										v-model="discountToEdit.type"
										placeholder="% or $"
										size="small"
									>
										<el-option label="percent"
													value="percentage"></el-option>
										<el-option label="dollars"
													value="dollar"></el-option>
									</el-select>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input
										type="text"
										class="form-control input-sm"
										:class="{'edited': discountToEdit.value.length}"
										id="form_control_edited_value"
										v-model="discountToEdit.value"
									>
									<label for="form_control_edited_value">Value</label>
								</div>
							</fieldset>
						</div>
					</div>
				</form>
			</div>
			<div slot="modal-footer"
					 class="modal-footer clear">
				<button v-if="!$root.permissions['stores discounts update']"
								@click="closeEditModal()"
								type="button"
								class="btn blue">
					Close
				</button>
				<button v-else
								@click="updateDiscount()"
								type="submit"
								class="btn blue"
								:disabled="updating">
					Save
					<i 
						v-show="updating"
						class="fa fa-spinner fa-pulse fa-fw"
					>
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
											data-close="alert"
											@click.prevent="clearError('deleteErrorMessage')"></button>
							<span>{{ deleteErrorMessage }}</span>
						</div>
					</div>
				</div>
				<p>Are you sure you want to delete {{discountToDelete.name}}?</p>
			</div>
			<div slot="modal-footer"
					 class="modal-footer clear">
				<button type="button"
								class="btn blue"
								@click="deleteDiscount()"
								:disabled="deleting">
					Delete
					<i v-show="deleting"
						 class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- END DELETE -->
	</div>
</template>

<script>
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import Modal from '@/components/modules/Modal'
import NoResults from '@/components/modules/NoResults'
import DiscountsFunctions from '@/controllers/Discounts'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { isNonNegativeNumber } from '@/controllers/utils'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Discounts', link: false }],

			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newDiscount: {
				name: '',
				type: '',
				value: ''
			},

			loadingDiscounts: false,
			listErrorMessage: '',
			discounts: [],

			showEditModal: false,
			editErrorMessage: '',
			updating: false,
			discountToEdit: {
				name: '',
				type: '',
				value: ''
			},

			showDeleteModal: false,
			deleting: false,
			deleteErrorMessage: '',
			discountToDelete: {
				name: '',
				type: '',
				value: ''
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
					this.getDiscounts()
				} else {
					this.discounts = []
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
		 * To check if the discount data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewDiscountData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.newDiscount.name) {
					reject('Name cannot be blank')
				} else if (!_this.newDiscount.type) {
					reject('Select a type')
				} else if (!_this.newDiscount.value.length) {
					reject('Enter a vaule')
				} else if (!isNonNegativeNumber(_this.newDiscount.value)) {
					reject('Value must be zero or more')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new discount.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createDiscount () {
			var _this = this
			_this.clearError('createErrorMessage')

			return _this
				.validateNewDiscountData()
				.then(response => {
					this.creating = true

					DiscountsFunctions.createDiscount(this.newDiscount, this.activeLocationId)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.showCreateSuccess(response.payload)
								_this.clearNewDiscount()
								_this.getDiscounts()
							} else {
								_this.createErrorMessage = response.message
								_this.$scrollTo(
									_this.$refs.createErrorMessage,
									1000,
									{
										force: false
									}
								)
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create the discount',
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
					_this.$scrollTo(
						_this.$refs.createErrorMessage,
						1000
					)
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
			let text = 'The Discount has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Discount has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To clear the new discount form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewDiscount () {
			this.newDiscount = {
				name: '',
				type: '',
				value: ''
			}
		},
		/**
		 * To get a list of all discounts.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getDiscounts () {
			this.loadingDiscounts = true
			this.discounts = []
			var _this = this
			return DiscountsFunctions.listDiscountsForStore(this.activeLocationId)
				.then(response => {
					_this.discounts = response.payload.sort((a, b) => {
						if (a.name.toLowerCase() < b.name.toLowerCase()) {
							return -1
						} else if (a.name.toLowerCase() > b.name.toLowerCase()) {
							return 1
						} else {
							return 0
						}
					})
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of discounts',
						errorName: 'listErrorMessage',
						vue: _this
					})
				})
				.finally(() => {
					_this.loadingDiscounts = false
				})
		},
		/**
		 * To show the modal to edit an discount details.
		 * @function
		 * @param {object} discount - The selected discount.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editDiscount (discount, event) {
			event.stopPropagation()
			this.discountToEdit = {...discount}
			this.showEditModal = true
		},
		/**
		 * To check if the discount data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedDiscountData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.discountToEdit.name) {
					reject('Name cannot be blank')
				} else if (!_this.discountToEdit.type) {
					reject('Select a type')
				} else if (!_this.discountToEdit.value.length) {
					reject('Enter a vaule')
				} else if (!isNonNegativeNumber(_this.discountToEdit.value)) {
					reject('Value must be zero or more')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a discount.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updateDiscount () {
			var _this = this
			_this.clearError('editErrorMessage')
			let payload = {...this.discountToEdit}
			payload.location_id = this.activeLocationId

			return _this
				.validateEditedDiscountData()
				.then(response => {
					this.updating = true

					DiscountsFunctions.updateDiscount(payload)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.getDiscounts()
								_this.closeEditModal()
								_this.showEditSuccess(response.payload)
								_this.resetEdit()
							} else {
								_this.editErrorMessage = response.message
								_this.$scrollTo(
									_this.$refs.editErrorMessage,
									1000,
									{
										force: false,
										container: _this.$refs.editModal.$el
									}
								)
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the discount',
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
					_this.$scrollTo(
						_this.$refs.editErrorMessage,
						1000,
						{
							force: false
						}
					)
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
			let text = 'The Discount has been saved'
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
			this.discountToEdit = {
				name: '',
				type: '',
				value: ''
			}
		},
		/**
		 * To display the modal for deleting an discount.
		 * @function
		 * @param {object} discount - The selected discount
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		confirmDelete (discount, event) {
			event.stopPropagation()
			this.discountToDelete = { ...discount }
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteDiscount () {
			this.deleting = true
			var _this = this
			return DiscountsFunctions.deleteDiscount(_this.discountToDelete.id)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.getDiscounts()
						_this.closeDeleteModal()
						_this.showDeleteSuccess(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not delete ${this.discountToDelete.name}`,
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
			let text = 'The Discount has been deleted'
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
.select-label {
	color: #999;
	margin-right: 5px;
}
</style>

<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Combo Offers</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage combo offers.</p>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki"
		     v-if="$root.permissions['combo_offer create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Combo Offer
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body relative-block"
			     :class="{'display-hide': createNewCollapse}">
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
					<div class="col-xs-12 col-md-6">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
									class="form-control input-sm"
									:class="{'edited': newComboOffer.name.length}"
									id="form_control_name"
									v-model="newComboOffer.name">
							<label for="form_control_name">Name</label>
						</div>
						<el-select class="margin-top-10 margin-bottom-10"
									v-model="newComboOffer.discount_type"
									placeholder="Select discount type"
									size="small">
							<el-option label="flat"
										value="flat"></el-option>
							<el-option label="percentage"
										value="percentage"></el-option>
						</el-select>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
									class="form-control input-sm"
									:class="{'edited': newComboOffer.discount.length}"
									id="form_control_discount"
									v-model="newComboOffer.discount">
							<label for="form_control_discount">Discount value</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
									class="form-control input-sm"
									:class="{'edited': newComboOffer.number_of_items.length}"
									id="form_control_number_of_items"
									v-model="newComboOffer.number_of_items">
							<label for="form_control_number_of_items">Number of Items</label>
						</div>
						<div class="margin-top-20">
							From:
							<el-date-picker v-model="newComboOffer.start_from"
											type="date"
											format="yyyy-MM-dd"
											value-format="yyyy-MM-dd"
											:clearable="false"
											:pickerOptions="newStartOptions"
											placeholder="Select start date">
							</el-date-picker>
						</div>
						<div class="margin-top-20">
							To:
							<el-date-picker v-model="newComboOffer.end_on"
											type="date"
											format="yyyy-MM-dd"
											value-format="yyyy-MM-dd"
											:clearable="false"
											:pickerOptions="newEndOptions"
											placeholder="Select end date">
							</el-date-picker>
						</div>
						<button
								@click="createComboOffer()"
								class="btn blue pull-right"
								:disabled="creating"
						>
							Create
							<i v-show="creating"
								class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
				</div>
			</div>
		</div>
		<!-- END CREATE -->

		<!-- BEGIN LIST -->
		<div class="portlet light portlet-fit bordered margin-top-20"
				id="comboOffers-container">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../public/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Combo Offers</span>
					<div class="caption-desc font-grey-cascade">Create, edit or delete combo offers.</div>
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
				<loading-screen :show="loadingComboOffers"
								:color="'#2C3E50'"
								:display="'inline'"></loading-screen>
				<div class="mt-element-list margin-top-15"
						v-if="comboOffers.length && !loadingComboOffers">
					<div class="mt-list-container list-news ext-1 no-border">
						<ul>
							<li class="mt-list-item actions-at-left margin-top-15 three-vertical-actions"
								v-for="comboOffer in comboOffers"
								:id="'comboOffer-' + comboOffer.id"
								:key="comboOffer.id"
								@click="editItems(comboOffer)"
							>
								<div class="list-item-actions">
									<el-tooltip v-if="$root.permissions['combo_offer update']"
												content="Edit"
												effect="light"
												placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
											@click.stop="editComboOffer(comboOffer)">
											<i class="fa fa-lg fa-pencil"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['combo_offer read'] && !$root.permissions['combo_offer update']"
												content="View"
												effect="light"
												placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
											@click.stop="editComboOffer(comboOffer, $event)">
											<i class="fa fa-lg fa-eye"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['combo_offer delete']"
												content="Delete"
												effect="light"
												placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
											@click.stop="confirmDelete(comboOffer, $event)">
											<i class="fa fa-lg fa-trash"></i>
										</a>
									</el-tooltip>
								</div>
								<div class="col-md-12 bold uppercase font-red">
									<span>{{ comboOffer.name }}</span>
								</div>
								<div class="list-icon-container">
									<i class="fa fa-angle-right"></i>
								</div>
								<div class="col-md-6">
									<strong></strong>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<no-results class="margin-top-20"
							:show="!comboOffers.length && !loadingComboOffers"
							:type="'comboOffers'"></no-results>
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
				<h4 class="modal-title center">Edit Combo Offer</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<div class="row">
					<div class="col-md-12">
						<div class="alert alert-danger"
								v-show="editErrorMessage.length"
								ref="editErrorMessage">
							<button class="close"
									@click.prevent="clearError('editErrorMessage')"></button>
							<span>{{ editErrorMessage }}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
									class="form-control input-sm"
									:class="{'edited': comboOfferToEdit.name.length}"
									id="form_control_name"
									v-model="comboOfferToEdit.name">
							<label for="form_control_name">Name</label>
						</div>
						<el-select class="margin-top-10 margin-bottom-10"
									v-model="comboOfferToEdit.discount_type"
									placeholder="Select discount type"
									size="small">
							<el-option label="flat"
										value="flat"></el-option>
							<el-option label="percentage"
										value="percentage"></el-option>
						</el-select>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
									class="form-control input-sm"
									:class="{'edited': comboOfferToEdit.discount.length}"
									id="form_control_discount"
									v-model="comboOfferToEdit.discount">
							<label for="form_control_discount">Discount value</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
									class="form-control input-sm"
									:class="{'edited': comboOfferToEdit.number_of_items.length}"
									id="form_control_number_of_items"
									v-model="comboOfferToEdit.number_of_items">
							<label for="form_control_number_of_items">Number of Items</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
									class="form-control input-sm"
									:class="{'edited': comboOfferToEdit.start_from.length}"
									id="form_control_start_from"
									v-model="comboOfferToEdit.start_from">
							<label for="form_control_start_from">From</label>
						</div>
						<div class="margin-top-20">
							From:
							<el-date-picker v-model="comboOfferToEdit.start_from"
											type="date"
											format="yyyy-MM-dd"
											value-format="yyyy-MM-dd"
											:clearable="false"
											:pickerOptions="editedStartOptions"
											placeholder="Select start date">
							</el-date-picker>
						</div>
						<div class="margin-top-20">
							To:
							<el-date-picker v-model="comboOfferToEdit.end_on"
											type="date"
											format="yyyy-MM-dd"
											value-format="yyyy-MM-dd"
											:clearable="false"
											:pickerOptions="editedEndOptions"
											placeholder="Select end date">
							</el-date-picker>
						</div>
					</div>
				</div>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<button v-if="!$root.permissions['combo_offer update']"
				        @click="closeEditModal()"
				        type="button"
				        class="btn blue">
					Close
				</button>
				<button
					v-else
					class="btn blue pull-right"
					:disabled="updating"
					@click="updateComboOffer()"
				>
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
						<p>Are you sure you want to delete {{comboOfferToDelete.name}}?</p>
					</div>
				</div>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<button type="button"
				        class="btn blue"
				        @click="deleteComboOffer()"
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
import ComboOffersFunctions from '@/controllers/Combos'
import Modal from '@/components/modules/Modal'
import NoResults from '@/components/modules/NoResults'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { isNonNegativeNumber } from '@/controllers/utils'
import {mapActions} from 'vuex'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Combos', link: false }],

			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newComboOffer: {
				name: '',
				discount: '',
				discount_type: '',
				number_of_items: '',
				start_from: '',
				end_on: ''
			},
			newStartOptions: {
				disabledDate (time) {
					return time.getTime() < Date.now()
				}
			},
			newEndOptions: {
				disabledDate (time) {
					return time.getTime() < Date.now()
				}
			},

			loadingComboOffers: false,
			listErrorMessage: '',
			comboOffers: [
				{
					id: 5,
					name: 'Offer 1',
					discount: '10.00',
					discount_type: 'flat',
					start_from: '2018-01-09',
					end_on: '2018-11-25',
					number_of_items: 2,
					combo_item: [
						{
							combo_id: 5,
							combo_item_sku: [
								{
									id: 34,
									combo_item_id: 7,
									sku: 'a'
								}
							]
						}
					]
				}
			],

			showEditModal: false,
			updating: false,
			editErrorMessage: '',
			comboOfferToEdit: {
				name: '',
				discount: '',
				discount_type: '',
				number_of_items: '',
				start_from: '',
				end_on: ''
			},
			editedStartOptions: {
				disabledDate (time) {
					return time.getTime() < Date.now()
				}
			},
			editedEndOptions: {
				disabledDate (time) {
					return time.getTime() < Date.now()
				}
			},

			showDeleteModal: false,
			deleting: false,
			deleteErrorMessage: '',
			comboOfferToDelete: {
				name: ''
			}
		}
	},
	mounted () {
		this.getComboOffers()
	},
	methods: {
		logger (val) {
			console.log({val})
			return true
		},
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
		 * To check if the comboOffer data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewComboOfferData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.newComboOffer.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new comboOffer.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createComboOffer () {
			var _this = this
			_this.clearError('createErrorMessage')

			return _this
				.validateNewComboOfferData()
				.then(response => {
					_this.creating = true
					ComboOffersFunctions.createComboOffer(_this.newComboOffer)
						.then(response => {
							_this.getComboOffers()
							_this.showCreateSuccess(response.payload)
							_this.clearNewComboOffer()
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create the comboOffer',
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
			let text = 'The Combo Offer has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Combo Offer has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To clear the new combo offer form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewComboOffer () {
			this.newComboOffer = {
				name: '',
				discount: '',
				discount_type: '',
				number_of_items: '',
				start_from: '',
				end_on: ''
			}
		},
		/**
		 * To get a list of all combo offers.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getComboOffers () {
			this.clearError('listErrorMessage')
			this.loadingComboOffers = true
			this.comboOffers = []
			var _this = this
			return ComboOffersFunctions.listComboOffers()
				.then(response => {
					_this.loadingComboOffers = false
					_this.comboOffers = response.payload
					.map(offer => ({
						...offer,
						number_of_items: String(offer.number_of_items)
					}))
					.sort((a, b) => {
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
						errorText: 'We could not fetch the list of comboOffers',
						errorName: 'listErrorMessage',
						vue: _this
					})
				})
				.finally(() => {
					_this.loadingComboOffers = false
				})
		},
		/**
		 * To show the modal to edit an comboOffer details.
		 * @function
		 * @param {object} comboOffer - The selected comboOffer.
		 * @returns {undefined}
		 */
		editComboOffer (comboOffer) {
			this.comboOfferToEdit = { ...comboOffer }
			this.showEditModal = true
		},
		/**
		 * To check if the comboOffer data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedComboOfferData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.comboOfferToEdit.name.length) {
					reject('Name cannot be blank')
				} else if (!isNonNegativeNumber(_this.comboOfferToEdit.discount)) {
					reject('Discount value must be zero or more')
				} else if (!_this.comboOfferToEdit.discount_type.length) {
					reject('Name cannot be blank')
				} else if (!isNonNegativeNumber(_this.comboOfferToEdit.number_of_items)) {
					reject('Name cannot be blank')
				} else if (!_this.comboOfferToEdit.start_from.length) {
					reject('Start date cannot be blank')
				} else if (!_this.comboOfferToEdit.end_on.length) {
					reject('End date cannot be blank')
				} else if (_this.comboOfferToEdit.end_on < _this.comboOfferToEdit.start_from) {
					reject('Start date cannot be after end date')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a combo offer.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updateComboOffer () {
			var _this = this
			this.updating = true
			_this.clearError('editErrorMessage')
			let payload = { ...this.comboOfferToEdit }

			return _this
				.validateEditedComboOfferData()
				.then(response => {
					_this.updating = true
					ComboOffersFunctions.updateComboOffer(payload)
						.then(response => {
							_this.getComboOffers()
							_this.closeEditModal()
							_this.resetEdit()
							_this.showEditSuccess(response.payload)
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the combo offer',
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
					_this.editErrorMessage = reason
					_this.$scrollTo(
						_this.$refs.editErrorMessage,
						1000,
						{
							container: _this.$refs.editModal.$el
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
			let text = 'The Combo Offer has been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Combo Offer has been sent for approval'
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
			this.comboOfferToEdit = {
				name: '',
				discount: '',
				discount_type: '',
				number_of_items: '',
				start_from: '',
				end_on: ''
			}
		},
		/**
		 * To display the modal for deleting an comboOffer.
		 * @function
		 * @param {object} comboOffer - The selected comboOffer
		 * @returns {undefined}
		 */
		confirmDelete (comboOffer) {
			this.comboOfferToDelete = { ...comboOffer }
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteComboOffer () {
			this.deleting = true
			var _this = this
			return ComboOffersFunctions.deleteComboOffer(_this.comboOfferToDelete.id)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.getComboOffers()
						_this.closeDeleteModal()
						_this.showDeleteSuccess(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not delete ${this.comboOfferToDelete.name}`,
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
			let text = 'The Combo Offer has been deleted'
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
		},
		/**
		 * To save the combo offer before leaving route.
		 * @function
		 * @returns {undefined}
		 */
		...mapActions({
			setComboOffer: 'combos/setComboOffer'
		}),
		/**
		 * To navigate to the items page
		 * @function
		 * @param {object} comboOffer - The combo offer to save
		 * @returns {undefined}
		 */
		editItems (comboOffer) {
			this.setComboOffer(comboOffer)
			this.$router.push({name: 'ComboOfferItems', params: { offer_id: comboOffer.id }})
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
.mt-element-list .list-news.mt-list-container ul > .mt-list-item:hover {
	cursor: pointer;
}
.three-vertical-actions {
  min-height: 124px;
}
.margin-top-10 {
	margin-top: 10px;
}
.margin-bottom-10 {
	margin-bottom: 10px;
}
</style>

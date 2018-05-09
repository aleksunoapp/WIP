<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Item Types</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage item types.</p>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Item Type
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body relative-block" :class="{'display-hide': createNewCollapse}">
				<div class="col-md-12" v-show="activeLocationId === undefined">
					<div class="alert center alert-info">
						<h4>No Store Selected</h4>
						<p>Please select a store from the stores panel on the right to create an item type.</p>
					</div>
				</div>
				<form role="form" @submit.prevent="createItemType()" v-show="activeLocationId !== undefined">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger" v-show="createErrorMessage.length" ref="createErrorMessage">
								<button class="close" data-close="alert" @click.prevent="clearError('createErrorMessage')"></button>
								<span>{{ createErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newItemType.name.length}" id="form_control_1" v-model="newItemType.name">
								<label for="form_control_1">Name</label>
							</div>
							<button type="submit" class="btn blue pull-right">Create</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE -->

		<!-- BEGIN LIST -->
		<div>
			<div class="portlet light portlet-fit bordered margin-top-20" id="itemTypes-container">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image-main">
						<img src="../../../../static/client_logo.png">
					</div>
					<div class="caption">
						<span class="caption-subject font-green bold uppercase">Item Types</span>
						<div class="caption-desc font-grey-cascade">Create, edit or delete item types and assign them to tax classes.</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="alert alert-danger" v-show="listErrorMessage.length" ref="listErrorMessage">
						<button class="close" data-close="alert" @click="clearError('listErrorMessage')"></button>
						<span>{{ listErrorMessage }}</span>
					</div>
				</div>
				<div class="portlet-body relative-block">
					<loading-screen :show="loadingItemTypes && activeLocationId !== undefined" :color="'#2C3E50'" :display="'inline'"></loading-screen>
					<div class="mt-element-list margin-top-15" v-if="itemTypes.length && !loadingItemTypes">
						<div class="mt-list-container list-news ext-1 no-border">
							<ul>
								<li class="mt-list-item actions-at-left margin-top-15 three-vertical-actions" v-for="itemType in itemTypes" :id="'itemType-' + itemType.id" :key="itemType.id">
									<div class="list-item-actions">
										<el-tooltip content="Edit" effect="light" placement="right">
											<a class="btn btn-circle btn-icon-only btn-default" @click="editItemType(itemType, $event)">
												<i class="fa fa-lg fa-pencil"></i>
											</a>
										</el-tooltip>
										<el-tooltip content="Apply Tax Classes" effect="light" placement="right">
											<a class="btn btn-circle btn-icon-only btn-default" @click="openApplyModal(itemType, $event)">
												<i class="icon-layers"></i>
											</a>
										</el-tooltip>
										<el-tooltip content="Delete" effect="light" placement="right">
											<a class="btn btn-circle btn-icon-only btn-default" @click="confirmDelete(itemType, $event)">
												<i class="fa fa-lg fa-trash"></i>
											</a>
										</el-tooltip>
									</div>
									<div class="col-md-12 bold uppercase font-red">
										<span>{{ itemType.name }}</span>
									</div>
									<div class="col-md-6">
										<strong></strong>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div class="margin-top-20">
						<no-results :show="!itemTypes.length && !loadingItemTypes" :type="'item types'"></no-results>
					</div>
				</div>
			</div>
		</div>
		<!-- END LIST -->

		<!-- START EDIT -->
		<modal :show="showEditModal" effect="fade" @closeOnEscape="closeEditModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Item Type</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<form role="form">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger" v-show="editErrorMessage.length" ref="editErrorMessage">
								<button class="close" data-close="alert" @click.prevent="clearError('editErrorMessage')"></button>
								<span>{{ editErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-12">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': itemTypeToEdit.name.length}" id="form_control_1" v-model="itemTypeToEdit.name">
								<label for="form_control_1">Name</label>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<button @click="updateItemType()" type="submit" class="btn blue">Save</button>
			</div>
		</modal>
		<!-- END EDIT -->

		<!-- START APPLY -->
		<modal :show="showApplyModal" effect="fade" @closeOnEscape="closeApplyModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeApplyModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Apply Tax Classes</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="applyErrorMessage.length" ref="applyErrorMessage">
					<button class="close" @click.prevent="clearError('applyErrorMessage')"></button>
					<span>{{ applyErrorMessage }}</span>
				</div>
				<div class="alert alert-info center margin-top-20" v-show="!loadingTaxClasses && !taxClasses.length && !applyErrorMessage.length">
					<h4>No Tax Classes</h4>
					<p>No tax classes for this location yet. <router-link to="/app/tax_manager/tax_classes">Create the first one here.</router-link></p>
				</div>
		        <table class="table">
		        	<thead>
		        		<tr>
		        			<th class="table-column--checkboxes">
		        				<div class="md-checkbox has-success" @change="selectAll()">
		        					<input type="checkbox" id="locations-promocodes" class="md-check" :checked="selectAllSelected">
		        					<label for="locations-promocodes">
		        						<span class="inc"></span>
		        						<span class="check"></span>
		        						<span class="box"></span>
		        					</label>
		        				</div>
		        			</th>
		        			<th> Name </th>
		        		</tr>
		        	</thead>
		            <tbody>
		                <tr v-for="taxClass in taxClasses">
		                	<td>
		                		<div class="md-checkbox has-success">
	                                <input type="checkbox" :id="'checkbox_' + taxClass.id" class="md-check" v-model="taxClass.selected">
	                                <label :for="'checkbox_' + taxClass.id">
	                                    <span class="inc"></span>
	                                    <span class="check"></span>
	                                    <span class="box"></span>
	                                </label>
	                            </div>
		                	</td>
		                    <td> {{taxClass.name}} </td>
		                </tr>
		            </tbody>
		        </table>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<button @click="applyTaxClassesToItemType()" type="submit" class="btn blue">Apply</button>
			</div>
		</modal>
		<!-- END APPLY -->

		<!-- START DELETE -->
		<modal :show="showDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Confirm Delete</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<p>Are you sure you want to delete {{itemTypeToDelete.name}}?</p>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<button type="button" class="btn blue" @click="deleteItemType()">Delete</button>
			</div>
		</modal>
		<!-- START DELETE -->
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import ItemTypesFunctions from '../../../controllers/ItemTypes'
import TaxClassesFunctions from '../../../controllers/TaxClasses'
import Modal from '../../modules/Modal'
import NoResults from '../../modules/NoResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Item Types', link: false}
			],

			createNewCollapse: true,
			createErrorMessage: '',
			newItemType: {
				name: ''
			},

			loadingItemTypes: false,
			listErrorMessage: '',
			itemTypes: [],

			showEditModal: false,
			editErrorMessage: '',
			itemTypeToEdit: {
				name: ''
			},

			showDeleteModal: false,
			deleteErrorMessage: '',
			itemTypeToDelete: {
				name: ''
			},

			loadingTaxClasses: false,
			taxClasses: [],
			applyErrorMessage: '',
			itemTypeToAssignTo: {},
			showApplyModal: false
		}
	},
	computed: {
		activeLocationId: function () {
			return this.$root.activeLocation.id
		},
		selectAllSelected () {
			if (this.taxClasses.length) {
				return !this.taxClasses.filter(taxClass => !taxClass.selected).length > 0
			}
			return false
		}
	},
	watch: {
		activeLocationId: function (newId) {
			if (newId !== undefined) {
				this.getItemTypes()
			}
		}
	},
	mounted () {
		this.getItemTypes()
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
		 * To check if the item type data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewItemTypeData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.newItemType.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new item type.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createItemType () {
			var _this = this
			_this.clearError('createErrorMessage')
			this.newItemType.location_id = this.activeLocationId

			return _this.validateNewItemTypeData()
			.then(response => {
				ItemTypesFunctions.createItemType(_this.newItemType, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.showCreateSuccess()
						_this.getItemTypes()
					} else {
						_this.createErrorMessage = response.message
						_this.$scrollTo(_this.$refs.createErrorMessage, 1000, { offset: -50 })
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not create the item type',
						errorName: 'createErrorMessage',
						vue: _this
					})
				})
			}).catch(reason => {
				_this.createErrorMessage = reason
				_this.$scrollTo(_this.$refs.createErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To alert the user that the item type has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showCreateSuccess () {
			this.$swal({
				title: 'Success!',
				text: 'Item Type \'' + this.newItemType.name + '\' has been successfully added!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.clearNewItemType()
			})
		},
		/**
		 * To clear the new item type form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewItemType () {
			this.newItemType = {
				location_id: '',
				name: ''
			}
		},
		/**
		 * To get a list of all item types.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemTypes () {
			this.loadingItemTypes = true
			this.itemTypes = []
			var _this = this
			return ItemTypesFunctions.getItemTypes(_this.$root.appId, _this.$root.appSecret, _this.$root.userToken)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					_this.loadingItemTypes = false
					_this.itemTypes = response.payload
				} else {
					_this.loadingItemTypes = false
				}
			}).catch(reason => {
				_this.loadingItemTypes = false
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch the list of item types',
					errorName: 'listErrorMessage',
					vue: _this
				})
			})
		},
		/**
		 * To show the modal to edit an item type details.
		 * @function
		 * @param {object} itemType - The selected item type.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editItemType (itemType, event) {
			event.stopPropagation()
			this.itemTypeToEdit = {...itemType}
			this.showEditModal = true
		},
		/**
		 * To check if the item type data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedItemTypeData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.itemTypeToEdit.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a item type.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updateItemType () {
			var _this = this
			_this.clearError('editErrorMessage')
			let payload = {...this.itemTypeToEdit}
			payload.location_id = this.activeLocationId

			return _this.validateEditedItemTypeData()
			.then(response => {
				ItemTypesFunctions.updateItemType(payload, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.getItemTypes()
						_this.closeEditModal()
						_this.showEditSuccess()
						_this.resetEdit()
					} else {
						_this.editErrorMessage = response.message
						_this.$scrollTo(_this.$refs.editErrorMessage, 1000, { offset: -50 })
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the item type',
						errorName: 'editErrorMessage',
						vue: _this
					})
				})
			}).catch(reason => {
				_this.editErrorMessage = reason
				_this.$scrollTo(_this.$refs.editErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To display notification that item types were successfully saved.
		 * @function
		 * @returns {undefined}
		 */
		showEditSuccess () {
			this.$swal({
				title: 'Success!',
				text: `${this.itemTypeToEdit.name} updated`,
				type: 'success',
				confirmButtonText: 'OK'
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
			this.itemTypeToEdit = {
				location_id: '',
				name: ''
			}
		},
		/**
		 * To display the modal for deleting an item type.
		 * @function
		 * @param {object} itemType - The selected itemType
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		confirmDelete (itemType, event) {
			event.stopPropagation()
			this.itemTypeToDelete = {...itemType}
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteItemType () {
			var _this = this
			return ItemTypesFunctions.deleteItemType(_this.itemTypeToDelete.id, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					_this.getItemTypes()
					_this.closeDeleteModal()
					_this.showDeleteSuccess()
				}
			})
			.catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: `We could not delete ${this.itemTypeToDelete.name}`,
					errorName: 'deleteErrorMessage',
					vue: _this
				})
			})
		},
		/**
		 * To display notification that item types were successfully saved.
		 * @function
		 * @returns {undefined}
		 */
		showDeleteSuccess () {
			this.$swal({
				title: 'Success!',
				text: `${this.itemTypeToDelete.name} deleted`,
				type: 'success',
				confirmButtonText: 'OK'
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
		 * To show the modal to assign Tax Classes to an Item Type.
		 * @function
		 * @param {object} itemType - The selected item type.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		openApplyModal (itemType, event) {
			event.stopPropagation()
			this.itemTypeToAssignTo = {...itemType}
			let _this = this
			Promise.all([_this.getTaxClasses(), _this.getTaxClassesForItemType()]).then(response => {
				if (_this.itemTypeToAssignTo.taxclasses) {
					_this.taxClasses.forEach(taxClass => {
						let included = _this.itemTypeToAssignTo.taxclasses.filter(globalTaxClass =>
							globalTaxClass.id === taxClass.id)
						if (included.length) {
							taxClass.selected = true
						}
					})
				}
			}).catch(reason => {
				_this.applyErrorMessage = 'Something went wrong ...'
			})
			this.showApplyModal = true
		},
		/**
		 * To get a list of all tax classes.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getTaxClasses () {
			this.loadingTaxClasses = true
			this.taxClasses = []
			var _this = this
			return TaxClassesFunctions.getTaxClasses(_this.$root.appId, _this.$root.appSecret, _this.$root.userToken)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					_this.loadingTaxClasses = false
					_this.taxClasses = response.payload.map(taxClass => {
						taxClass.selected = false
						return taxClass
					})
					console.log(_this.taxClasses)
				} else {
					_this.loadingTaxClasses = false
				}
			}).catch(reason => {
				_this.loadingTaxClasses = false
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch the list of tax classes',
					errorName: 'applyErrorMessage',
					vue: _this
				})
			})
		},
		/**
		 * To get a list of all item types.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getTaxClassesForItemType () {
			var _this = this
			return ItemTypesFunctions.getTaxClassesForItemType(_this.itemTypeToAssignTo.id, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					_this.itemTypeToAssignTo = response.payload
				} else {
					_this.applyErrorMessage = response.message
					_this.$scrollTo(_this.$refs.applyErrorMessage, 1000, { offset: -50 })
				}
			}).catch(reason => {
				_this.loadingItemTypes = false
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch the list of item types',
					errorName: 'listErrorMessage',
					vue: _this
				})
			})
		},
		validateTaxClassesToApply () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.taxClasses.some(taxClass => taxClass.selected)) {
					reject('Select at least one')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To get a list of all item types.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyTaxClassesToItemType () {
			this.clearError('applyErrorMessage')
			var _this = this
			return this.validateTaxClassesToApply().then(response => {
				let payload = {
					tax_classes: this.taxClasses.filter(taxClass => taxClass.selected).map(taxClass => taxClass.id)
				}
				return ItemTypesFunctions.applyTaxClassesToItemType(_this.itemTypeToAssignTo.id, payload, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.closeApplyModal()
						_this.showApplySuccess()
					} else {
						_this.applyErrorMessage = response.message
						_this.$scrollTo(_this.$refs.applyErrorMessage, 1000, { offset: -50 })
					}
				}).catch(reason => {
					_this.loadingItemTypes = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not apply tax classes to this item type',
						errorName: 'applyErrorMessage',
						vue: _this
					})
				})
			}).catch(reason => {
				_this.applyErrorMessage = reason
				_this.$scrollTo(_this.$refs.applyErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To close the apply modal.
		 * @function
		 * @returns {undefined}
		 */
		closeApplyModal () {
			this.clearError('applyErrorMessage')
			this.showApplyModal = false
		},
		/**
		 * To select or deselect all items.
		 * @function
		 * @returns {undefined}
		 */
		selectAll () {
			let current = this.selectAllSelected
			this.taxClasses.forEach(taxClass => {
				taxClass.selected = !current
			})
		},
		/**
		 * To confirm tax classes have been successfully assigned.
		 * @function
		 * @returns {undefined}
		 */
		showApplySuccess () {
			this.$swal({
				title: 'Success',
				text: 'Tax classes have been assigned',
				type: 'success',
				confirmButtonText: 'OK'
			})
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
.mt-element-list .list-news.ext-1.mt-list-container ul>.mt-list-item:hover {
	background-color: white;
}
.three-vertical-actions {
	min-height: 124px;
}
</style>

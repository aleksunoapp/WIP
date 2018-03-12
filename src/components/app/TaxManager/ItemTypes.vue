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
			<div class="portlet-body" :class="{'display-hide': createNewCollapse}">
				<form role="form" @submit.prevent="createItemType()">
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
						<div class="caption-desc font-grey-cascade">Create, edit or delete item types and assign them to the active store.</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="alert alert-danger" v-show="listErrorMessage.length" ref="listErrorMessage">
						<button class="close" data-close="alert" @click="clearError('listErrorMessage')"></button>
						<span>{{ listErrorMessage }}</span>
					</div>
				</div>
				<div class="portlet-body relative-block">
					<div class="col-md-12" v-show="activeLocationId === undefined">
						<div class="alert center alert-info">
							<h4>No Store Selected</h4>
							<p>Please select a store from the stores panel on the right to view and manage its item types.</p>
						</div>
					</div>
					<loading-screen :show="loadingItemTypes && activeLocationId !== undefined" :color="'#2C3E50'" :display="'inline'"></loading-screen>
					<div class="mt-element-list margin-top-15" v-if="itemTypes.length && !loadingItemTypes">
						<div class="mt-list-container list-news ext-1 no-border">
							<ul>
								<li class="mt-list-item actions-at-left margin-top-15" v-for="itemType in itemTypes" :id="'itemType-' + itemType.id" :key="itemType.id">
									<div class="list-item-actions">
										<el-tooltip content="Edit" effect="light" placement="right">
											<a class="btn btn-circle btn-icon-only btn-default" @click="editItemType(itemType, $event)">
												<i class="fa fa-lg fa-pencil"></i>
											</a>
										</el-tooltip>
										<el-tooltip content="Delete" effect="light" placement="right">
											<a class="btn btn-circle btn-icon-only btn-default" @click="confirmDelete(itemType, $event)">
												<i class="fa fa-lg fa-trash"></i>
											</a>
										</el-tooltip>
									</div>
									<div class="list-datetime bold uppercase font-red height-mod">
										<span>{{ itemType.name }}</span>
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
</style>

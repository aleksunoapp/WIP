<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->

    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Item Types
    </h1>
    <!-- END PAGE TITLE -->
    <div class="note note-info">
      <p>Add and manage item types.</p>
    </div>

    <!-- BEGIN CREATE -->
    <div
      v-if="$root.permissions['tax item_types create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create a New Item Type
        </div>
        <div class="tools">
          <a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}" />
        </div>
      </div>
      <div
        class="portlet-body relative-block"
        :class="{'display-hide': createNewCollapse}"
      >
        <div
          v-show="activeLocationId === undefined"
          class="col-md-12"
        >
          <div class="alert center alert-info">
            <h4>No Store Selected</h4>
            <p>Please select a store from the stores panel on the right to create an item type.</p>
          </div>
        </div>
        <form
          v-show="activeLocationId !== undefined"
          role="form"
          @submit.prevent="createItemType()"
        >
          <div class="row">
            <div class="col-md-12">
              <div
                v-show="createErrorMessage.length"
                ref="createErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  data-close="alert"
                  @click.prevent="clearError('createErrorMessage')"
                />
                <span>{{ createErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  v-model="newItemType.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newItemType.name.length}"
                >
                <label for="form_control_1">
                  Name
                </label>
              </div>
              <button
                type="submit"
                class="btn blue pull-right"
                :disabled="creating"
              >
                Create
                <i
                  v-show="creating"
                  class="fa fa-spinner fa-pulse fa-fw"
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- END CREATE -->

    <!-- BEGIN LIST -->
    <div v-if="activeLocationId === undefined">
      <div class="alert center alert-info">
        <h4>No Store Selected</h4>
        <p>Please select a store from the stores panel on the right to view item types for it.</p>
      </div>
    </div>
    <div v-else>
      <div
        id="itemTypes-container"
        class="portlet light portlet-fit bordered margin-top-20"
      >
        <div class="portlet-title bg-blue-chambray">
          <div class="menu-image-main">
            <img src="../../../../public/client_logo.png">
          </div>
          <div class="caption">
            <span class="caption-subject font-default bold uppercase">
              Item Types
            </span>
            <div class="caption-desc font-grey-cascade">
              Create, edit or delete item types and assign them to tax classes.
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div
            v-show="listErrorMessage.length"
            ref="listErrorMessage"
            class="alert alert-danger"
          >
            <button
              class="close"
              data-close="alert"
              @click="clearError('listErrorMessage')"
            />
            <span>{{ listErrorMessage }}</span>
          </div>
        </div>
        <div class="portlet-body relative-block">
          <loading-screen
            :show="loadingItemTypes && activeLocationId !== undefined"
            :color="'#2C3E50'"
            :display="'inline'"
          />
          <div
            v-if="itemTypes.length && !loadingItemTypes"
            class="mt-element-list margin-top-15"
          >
            <div class="mt-list-container list-news ext-1 no-border">
              <ul>
                <li
                  v-for="itemType in itemTypes"
                  :id="'itemType-' + itemType.id"
                  :key="itemType.id"
                  class="mt-list-item actions-at-left margin-top-15 three-vertical-actions"
                >
                  <div class="list-item-actions">
                    <el-tooltip
                      v-if="$root.permissions['tax item_types update']"
                      content="Edit"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="editItemType(itemType, $event)"
                      >
                        <i class="fa fa-lg fa-pencil" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['tax item_types read'] && !$root.permissions['tax item_types update']"
                      content="View"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="editItemType(itemType, $event)"
                      >
                        <i class="fa fa-lg fa-eye" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['tax item_types update']"
                      content="Apply Tax Classes"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="openApplyModal(itemType, $event)"
                      >
                        <i class="icon-layers" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['tax item_types delete']"
                      content="Delete"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="confirmDelete(itemType, $event)"
                      >
                        <i class="fa fa-lg fa-trash" />
                      </a>
                    </el-tooltip>
                  </div>
                  <div class="col-md-12 bold uppercase font-red">
                    <span>{{ itemType.name }}</span>
                  </div>
                  <div class="col-md-6">
                    <strong />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="margin-top-20">
            <no-results
              :show="!itemTypes.length && !loadingItemTypes"
              :type="'item types'"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- END LIST -->

    <!-- START EDIT -->
    <modal
      :show="showEditModal"
      effect="fade"
      @closeOnEscape="closeEditModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeEditModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Edit Item Type
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <form role="form">
          <div class="row">
            <div class="col-md-12">
              <div
                v-show="editErrorMessage.length"
                ref="editErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  data-close="alert"
                  @click.prevent="clearError('editErrorMessage')"
                />
                <span>{{ editErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  v-model="itemTypeToEdit.name"
                  :disabled="!$root.permissions['tax item_types update']"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': itemTypeToEdit.name.length}"
                >
                <label for="form_control_1">
                  Name
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          v-if="!$root.permissions['tax item_types update']"
          type="button"
          class="btn blue"
          @click="closeEditModal()"
        >
          Close
        </button>
        <button
          v-else
          type="submit"
          class="btn blue"
          :disabled="updating"
          @click="updateItemType()"
        >
          Save
          <i
            v-show="updating"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
    <!-- END EDIT -->

    <!-- START APPLY -->
    <modal
      :show="showApplyModal"
      effect="fade"
      @closeOnEscape="closeApplyModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeApplyModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Apply Tax Classes
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div v-if="activeLocationId === undefined">
          <div class="alert center alert-info">
            <h4>No Store Selected</h4>
            <p>Please select a store from the stores panel.</p>
          </div>
        </div>
        <div v-else>
          <div
            v-show="applyErrorMessage.length"
            ref="applyErrorMessage"
            class="alert alert-danger"
          >
            <button
              class="close"
              @click.prevent="clearError('applyErrorMessage')"
            />
            <span>{{ applyErrorMessage }}</span>
          </div>
          <div
            v-show="!loadingTaxClasses && !taxClasses.length && !applyErrorMessage.length"
            class="alert alert-info center margin-top-20"
          >
            <h4>No Tax Classes</h4>
            <p>
              No tax classes for this location yet.
              <router-link to="/app/tax_manager/tax_classes">
                Create the first one here.
              </router-link>
            </p>
          </div>
          <table
            v-show="taxClasses.length"
            class="table"
          >
            <thead>
              <tr>
                <th class="table-column--checkboxes">
                  <div
                    class="md-checkbox has-success"
                    @change="selectAll()"
                  >
                    <input
                      id="locations-promocodes"
                      type="checkbox"
                      class="md-check"
                      :checked="selectAllSelected"
                    >
                    <label for="locations-promocodes">
                      <span class="inc" />
                      <span class="check" />
                      <span class="box" />
                    </label>
                  </div>
                </th>
                <th> Name </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(taxClass, index) in taxClasses"
                :key="index"
              >
                <td>
                  <div class="md-checkbox has-success">
                    <input
                      :id="'checkbox_' + taxClass.id"
                      v-model="taxClass.selected"
                      type="checkbox"
                      class="md-check"
                    >
                    <label :for="'checkbox_' + taxClass.id">
                      <span class="inc" />
                      <span class="check" />
                      <span class="box" />
                    </label>
                  </div>
                </td>
                <td> {{ taxClass.name }} </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          v-if="activeLocationId === undefined || !taxClasses.length"
          type="submit"
          class="btn btn-outline"
          @click="closeApplyModal()"
        >
          Close
        </button>
        <button
          v-else
          type="submit"
          class="btn blue"
          :disabled="applying"
          @click="applyTaxClassesToItemType()"
        >
          Apply
          <i
            v-show="applying"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
    <!-- END APPLY -->

    <!-- START DELETE -->
    <modal
      :show="showDeleteModal"
      effect="fade"
      @closeOnEscape="closeDeleteModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeDeleteModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Confirm Delete
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <p>Are you sure you want to delete {{ itemTypeToDelete.name }}?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="deleting"
          @click="deleteItemType()"
        >
          Delete
          <i
            v-show="deleting"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
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
	components: {
		Breadcrumb,
		LoadingScreen,
		Modal,
		NoResults
	},
	data () {
		return {
			breadcrumbArray: [{ name: 'Item Types', link: false }],

			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newItemType: {
				name: ''
			},

			loadingItemTypes: false,
			listErrorMessage: '',
			itemTypes: [],

			showEditModal: false,
			updating: false,
			editErrorMessage: '',
			itemTypeToEdit: {
				name: ''
			},

			showDeleteModal: false,
			deleting: false,
			deleteErrorMessage: '',
			itemTypeToDelete: {
				name: ''
			},

			loadingTaxClasses: false,
			taxClasses: [],
			applying: false,
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
				return (
					!this.taxClasses.filter(taxClass => !taxClass.selected).length > 0
				)
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

			return _this
				.validateNewItemTypeData()
				.then(response => {
					_this.creating = true
					ItemTypesFunctions.createItemType(
						_this.newItemType,
						_this.$root.appId,
						_this.$root.appSecret,
						_this.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.showCreateSuccess(response.payload)
								_this.clearNewItemType()
								_this.getItemTypes()
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
								errorText: 'We could not create the item type',
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
			let text = 'The Item Type has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Item Type has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
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
			this.clearError('listErrorMessage')
			this.loadingItemTypes = true
			this.itemTypes = []
			var _this = this
			let payload = { location_id: _this.activeLocationId }
			return ItemTypesFunctions.getItemTypes(
				payload,
				_this.$root.appId,
				_this.$root.appSecret,
				_this.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.loadingItemTypes = false
						_this.itemTypes = response.payload
					} else {
						_this.loadingItemTypes = false
					}
				})
				.catch(reason => {
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
			this.itemTypeToEdit = { ...itemType }
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
			let payload = { ...this.itemTypeToEdit }
			payload.location_id = this.activeLocationId

			return _this
				.validateEditedItemTypeData()
				.then(response => {
					_this.updating = true
					ItemTypesFunctions.updateItemType(
						payload,
						_this.$root.appId,
						_this.$root.appSecret,
						_this.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.getItemTypes()
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
								errorText: 'We could not update the item type',
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
			let text = 'The Item Type has been saved'
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
			this.itemTypeToDelete = { ...itemType }
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteItemType () {
			this.deleting = true
			var _this = this
			return ItemTypesFunctions.deleteItemType(
				_this.itemTypeToDelete.id,
				_this.$root.appId,
				_this.$root.appSecret,
				_this.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.getItemTypes()
						_this.closeDeleteModal()
						_this.showDeleteSuccess(response.payload)
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
			let text = 'The Item Type has been deleted'
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
		 * To show the modal to assign Tax Classes to an Item Type.
		 * @function
		 * @param {object} itemType - The selected item type.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		openApplyModal (itemType, event) {
			event.stopPropagation()
			this.itemTypeToAssignTo = { ...itemType }
			let _this = this
			Promise.all([_this.getTaxClasses(), _this.getTaxClassesForItemType()])
				.then(response => {
					if (_this.itemTypeToAssignTo.taxclasses) {
						_this.taxClasses.forEach(taxClass => {
							let included = _this.itemTypeToAssignTo.taxclasses.filter(
								globalTaxClass => globalTaxClass.id === taxClass.id
							)
							if (included.length) {
								taxClass.selected = true
							}
						})
					}
				})
				.catch(reason => {
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
			let payload = { location_id: _this.activeLocationId }
			return TaxClassesFunctions.getTaxClasses(
				payload,
				_this.$root.appId,
				_this.$root.appSecret,
				_this.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.loadingTaxClasses = false
						_this.taxClasses = response.payload.map(taxClass => {
							taxClass.selected = false
							return taxClass
						})
					} else {
						_this.loadingTaxClasses = false
					}
				})
				.catch(reason => {
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
			return ItemTypesFunctions.getTaxClassesForItemType(
				_this.itemTypeToAssignTo.id,
				_this.$root.appId,
				_this.$root.appSecret,
				_this.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.itemTypeToAssignTo = response.payload
					} else {
						_this.applyErrorMessage = response.message
						_this.$scrollTo(_this.$refs.applyErrorMessage, 1000, {
							offset: -50
						})
					}
				})
				.catch(reason => {
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
			return this.validateTaxClassesToApply()
				.then(response => {
					_this.applying = true
					let payload = {
						tax_classes: this.taxClasses
							.filter(taxClass => taxClass.selected)
							.map(taxClass => taxClass.id)
					}
					return ItemTypesFunctions.applyTaxClassesToItemType(
						_this.itemTypeToAssignTo.id,
						payload,
						_this.$root.appId,
						_this.$root.appSecret,
						_this.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.closeApplyModal()
								_this.showApplySuccess(response.payload)
							} else {
								_this.applyErrorMessage = response.message
								_this.$scrollTo(_this.$refs.applyErrorMessage, 1000, {
									offset: -50
								})
							}
						})
						.catch(reason => {
							_this.loadingItemTypes = false
							ajaxErrorHandler({
								reason,
								errorText: 'We could not apply tax classes to this item type',
								errorName: 'applyErrorMessage',
								vue: _this
							})
						})
						.finally(() => {
							_this.applying = false
						})
				})
				.catch(reason => {
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
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showApplySuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Tax Classes have been saved'
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
		}
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

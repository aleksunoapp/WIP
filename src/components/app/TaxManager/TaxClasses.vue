<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->

    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Tax Classes
    </h1>
    <!-- END PAGE TITLE -->
    <div class="note note-info">
      <p>Add and manage tax classes.</p>
    </div>

    <!-- BEGIN CREATE -->
    <div
      v-if="$root.permissions['tax tax_classes create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create a New Tax Class
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
            <p>Please select a store from the stores panel on the right to create a tax class for it.</p>
          </div>
        </div>
        <form
          v-show="activeLocationId !== undefined"
          role="form"
          @submit.prevent="createTaxClass()"
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
                  v-model="newTaxClass.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newTaxClass.name.length}"
                >
                <label for="form_control_1">
                  Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_3"
                  v-model="newTaxClass.value"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newTaxClass.value.length}"
                >
                <label for="form_control_3">
                  Value
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_3"
                  v-model="newTaxClass.min_amount"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newTaxClass.min_amount.length}"
                >
                <label for="form_control_3">
                  Minimum Amount
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_3"
                  v-model="newTaxClass.max_amount"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newTaxClass.max_amount.length}"
                >
                <label for="form_control_3">
                  Maximum Amount
                </label>
              </div>
              <label
                v-if="!loadingItemTypes"
                class="display-block margin-bottom-15"
              >
                Pair with:
                <el-select
                  v-if="!loadingItemTypes"
                  v-model="newTaxClass.paired_with"
                  placeholder="Select Item Type"
                  size="small"
                >
                  <el-option
                    v-for="type in itemTypes"
                    :key="type.id"
                    :label="type.name"
                    :value="type.id"
                  />
                  <el-option
                    key="none"
                    label="none"
                    :value="0"
                  />
                </el-select>
              </label>
              <label>
                Apply:
                <el-select
                  v-model="newTaxClass.apply"
                  placeholder="Select an option"
                  size="small"
                >
                  <el-option
                    key="flat"
                    label="flat"
                    value="flat"
                  />
                  <el-option
                    key="percentage"
                    label="percentage"
                    value="percentage"
                  />
                </el-select>
              </label>
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
        <p>Please select a store from the stores panel on the right to view tax classes for it.</p>
      </div>
    </div>
    <div v-else>
      <div
        id="taxClasses-container"
        class="portlet light portlet-fit bordered margin-top-20"
      >
        <div class="portlet-title bg-blue-chambray">
          <div class="menu-image-main">
            <img src="../../../../public/client_logo.png">
          </div>
          <div class="caption">
            <span class="caption-subject font-default bold uppercase">
              Tax Classes
            </span>
            <div class="caption-desc font-grey-cascade">
              Create, edit or delete tax classes.
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
            :show="loadingTaxClasses"
            :color="'#2C3E50'"
            :display="'inline'"
          />
          <div
            v-if="taxClasses.length && !loadingTaxClasses"
            class="mt-element-list margin-top-15"
          >
            <div class="mt-list-container list-news ext-1 no-border">
              <ul>
                <li
                  v-for="taxClass in taxClasses"
                  :id="'taxClass-' + taxClass.id"
                  :key="taxClass.id"
                  class="mt-list-item actions-at-left margin-top-15"
                >
                  <div class="list-item-actions">
                    <el-tooltip
                      v-if="$root.permissions['tax tax_classes update']"
                      content="Edit"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="editTaxClass(taxClass, $event)"
                      >
                        <i class="fa fa-lg fa-pencil" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['tax tax_classes read'] && !$root.permissions['tax tax_classes update']"
                      content="View"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="editTaxClass(taxClass, $event)"
                      >
                        <i class="fa fa-lg fa-eye" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['tax tax_classes delete']"
                      content="Delete"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="confirmDelete(taxClass, $event)"
                      >
                        <i class="fa fa-lg fa-trash" />
                      </a>
                    </el-tooltip>
                  </div>
                  <div class="list-datetime bold uppercase font-red">
                    <span>{{ taxClass.name }}</span>
                  </div>
                  <div class="list-item-content height-mod">
                    <div class="col-xs-5">
                      <strong>Value:</strong>
                      <span>{{ taxClass.value }}</span>
                    </div>
                    <div class="col-xs-5">
                      <strong>Minimum amount:</strong>
                      <span>{{ taxClass.min_amount }}</span>
                    </div>
                    <div class="col-xs-5">
                      <strong>Maximum amount:</strong>
                      <span>{{ taxClass.max_amount }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="margin-top-20">
            <no-results
              :show="!taxClasses.length && !loadingTaxClasses"
              :type="'tax classes'"
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
          Edit Tax Class
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
              <fieldset :disabled="!$root.permissions['tax tax_classes update']">
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_1"
                    v-model="taxClassToEdit.name"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': taxClassToEdit.name.length}"
                  >
                  <label for="form_control_1">
                    Name
                  </label>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_3"
                    v-model="taxClassToEdit.value"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': taxClassToEdit.value.length}"
                  >
                  <label for="form_control_3">
                    Value
                  </label>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_3"
                    v-model="taxClassToEdit.min_amount"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': taxClassToEdit.min_amount.length}"
                  >
                  <label for="form_control_3">
                    Minimum amount
                  </label>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_3"
                    v-model="taxClassToEdit.max_amount"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': taxClassToEdit.max_amount.length}"
                  >
                  <label for="form_control_3">
                    Maximum amount
                  </label>
                </div>
              </fieldset>
              <label
                v-if="!loadingItemTypes"
                class="display-block margin-bottom-15"
              >
                Pair with:
                <el-select
                  v-model="taxClassToEdit.paired_with"
                  :disabled="!$root.permissions['tax tax_classes update']"
                  placeholder="Select Item Type"
                  size="small"
                >
                  <el-option
                    v-for="type in itemTypes"
                    :key="type.id"
                    :label="type.name"
                    :value="type.id"
                  />
                  <el-option
                    key="none"
                    label="none"
                    :value="0"
                  />
                </el-select>
              </label>
              <label>
                Apply:
                <el-select
                  v-model="taxClassToEdit.apply"
                  placeholder="Select an option"
                  size="small"
                >
                  <el-option
                    key="flat"
                    label="flat"
                    value="flat"
                  />
                  <el-option
                    key="percentage"
                    label="percentage"
                    value="percentage"
                  />
                </el-select>
              </label>
            </div>
          </div>
        </form>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          v-if="!$root.permissions['tax tax_classes update']"
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
          @click="updateTaxClass()"
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
        <p>Are you sure you want to delete {{ taxClassToDelete.name }}?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="deleting"
          @click="deleteTaxClass()"
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
import TaxClassesFunctions from '../../../controllers/TaxClasses'
import ItemTypesFunctions from '../../../controllers/ItemTypes'
import Modal from '../../modules/Modal'
import NoResults from '../../modules/NoResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import $ from 'jquery'

export default {
  components: {
    Breadcrumb,
    LoadingScreen,
    Modal,
    NoResults
  },
  data () {
    return {
      breadcrumbArray: [{ name: 'Tax Classes', link: false }],

      createNewCollapse: true,
      creating: false,
      createErrorMessage: '',
      newTaxClass: {
        location_id: '',
        name: '',
        value: '',
        min_amount: '',
        max_amount: '',
        paired_with: '',
        apply: ''
      },

      loadingTaxClasses: false,
      listErrorMessage: '',
      taxClasses: [],

      showEditModal: false,
      editErrorMessage: '',
      updating: false,
      taxClassToEdit: {
        location_id: '',
        name: '',
        value: '',
        paired_with: '',
        apply: '',
        min_amount: '',
        max_amount: ''
      },

      showDeleteModal: false,
      deleting: false,
      deleteErrorMessage: '',
      taxClassToDelete: {
        name: ''
      },
      loadingItemTypes: false,
      itemTypes: []
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
        this.clearError('listErrorMessage')
        this.getTaxClasses()
        this.getItemTypes()
      }
    }
  },
  mounted () {
    if (this.$root.activeLocation.id !== undefined) {
      this.getTaxClasses()
      this.getItemTypes()
    }
  },
  methods: {
    /**
		 * To get a list of all item types.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getItemTypes () {
      this.loadingItemTypes = true
      this.itemTypes = []
      var _this = this
      let payload = { location_id: this.$root.activeLocation.id }
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
            errorName: 'createErrorMessage',
            vue: _this
          })
        })
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
          console.log({ e })
        }
        return false
      }
    },
    /**
		 * To check if the tax class data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateNewTaxClassData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.newTaxClass.name.length) {
          reject('Name cannot be blank')
        } else if (!$.isNumeric(_this.newTaxClass.value)) {
          reject('Value must be a number')
        } else if (!_this.isNonNegativeNumber(_this.newTaxClass.min_amount)) {
          reject('Minimum amount cannot be negative')
        } else if (!_this.isNonNegativeNumber(_this.newTaxClass.max_amount)) {
          reject('Maximum amount cannot be negative')
        } else if (!(Number(_this.newTaxClass.max_amount) >= Number(_this.newTaxClass.min_amount))) {
          reject('Maximum amount cannot be smaller than minimum amount')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To create a new tax class.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    createTaxClass () {
      var _this = this
      _this.clearError('createErrorMessage')
      this.newTaxClass.location_id = this.activeLocationId

      return _this
        .validateNewTaxClassData()
        .then(response => {
          this.creating = true
          let payload = this.newTaxClass

          TaxClassesFunctions.createTaxClass(
            payload,
            _this.$root.appId,
            _this.$root.appSecret,
            _this.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                _this.showCreateSuccess(response.payload)
                _this.clearNewTaxClass()
                _this.getTaxClasses()
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
                errorText: 'We could not create the tax class',
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
      let text = 'The Tax Class has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Tax Class has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To clear the new tax class form.
		 * @function
		 * @returns {undefined}
		 */
    clearNewTaxClass () {
      this.newTaxClass = {
        location_id: '',
        name: '',
        value: '',
        min_amount: '',
        max_amount: '',
        paired_with: '',
        apply: ''
      }
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
            _this.taxClasses = response.payload
          } else {
            _this.loadingTaxClasses = false
          }
        })
        .catch(reason => {
          _this.loadingTaxClasses = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch the list of tax classes',
            errorName: 'listErrorMessage',
            vue: _this
          })
        })
    },
    /**
		 * To show the modal to edit an tax class details.
		 * @function
		 * @param {object} taxClass - The selected tax class.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    editTaxClass (taxClass, event) {
      event.stopPropagation()
      this.taxClassToEdit = {
        ...taxClass,
        value: String(taxClass.value),
        min_amount: String(taxClass.min_amount),
        max_amount: String(taxClass.max_amount)
      }
      this.showEditModal = true
    },
    /**
		 * To check if the tax class data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateEditedTaxClassData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.taxClassToEdit.name.length) {
          reject('Name cannot be blank')
        } else if (!$.isNumeric(_this.taxClassToEdit.value)) {
          reject('Value must be a number')
        } else if (!_this.isNonNegativeNumber(_this.taxClassToEdit.min_amount)) {
          reject('Minimum amount cannot be negative')
        } else if (!_this.isNonNegativeNumber(_this.taxClassToEdit.max_amount)) {
          reject('Maximum amount cannot be negative')
        } else if (!(Number(_this.taxClassToEdit.max_amount) >= Number(_this.taxClassToEdit.min_amount))) {
          reject('Maximum amount cannot be smaller than minimum amount')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To update a tax class.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    updateTaxClass () {
      var _this = this
      _this.clearError('editErrorMessage')
      this.taxClassToEdit.location_id = this.activeLocationId

      return _this
        .validateEditedTaxClassData()
        .then(response => {
          this.updating = true
          let payload = this.taxClassToEdit

          TaxClassesFunctions.updateTaxClass(
            payload,
            _this.$root.appId,
            _this.$root.appSecret,
            _this.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                _this.getTaxClasses()
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
                errorText: 'We could not update the tax class',
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
      let text = 'The Tax Class has been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
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
      this.taxClassToEdit = {
        location_id: '',
        name: '',
        value: '',
        min_amount: '',
        max_amount: '',
        paired_with: '',
        apply: ''
      }
    },
    /**
		 * To display the modal for deleting an tax class.
		 * @function
		 * @param {object} taxClass - The selected taxClass
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    confirmDelete (taxClass, event) {
      event.stopPropagation()
      this.taxClassToDelete = { ...taxClass }
      this.showDeleteModal = true
    },
    /**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
    deleteTaxClass () {
      this.deleting = true
      var _this = this
      return TaxClassesFunctions.deleteTaxClass(
        _this.taxClassToDelete.id,
        _this.$root.appId,
        _this.$root.appSecret,
        _this.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.getTaxClasses()
            _this.closeDeleteModal()
            _this.showDeleteSuccess(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: `We could not delete ${this.taxClassToDelete.name}`,
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
      let text = 'The Tax Class has been deleted'
      let type = 'success'

      if (payload && payload.pending_approval) {
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
</style>


<template>
  <div>
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Currencies
    </h1>
    <!-- END PAGE TITLE -->
    <div class="note note-info">
      <p>Add and manage currencies.</p>
    </div>

    <!-- BEGIN CREATE -->
    <div
      v-if="$root.permissions['stores accepted_currencies create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create a New Currency
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
            <p>Please select a store from the stores panel on the right to create currencies.</p>
          </div>
        </div>
        <form
          v-show="activeLocationId !== undefined"
          role="form"
          @submit.prevent="create()"
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
                  @click.prevent="clearError('createErrorMessage')"
                />
                <span>{{ createErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="select">
                <label>Currency</label>
                <br>
                <el-select
                  v-model="toCreate.currency"
                  class="width-100"
                  filterable
                  placeholder="Select a currency"
                  size="mini"
                >
                  <el-option
                    v-for="(item, i) in currencies"
                    :key="i"
                    :label="`${item.code} - ${item.currency}`"
                    :value="item.code"
                  />
                </el-select>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_new_conversion"
                  v-model="toCreate.conversion"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': toCreate.conversion.length}"
                >
                <label for="form_control_new_conversion">
                  Conversion
                </label>
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
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- END CREATE -->

    <!-- BEGIN LIST -->
    <div
      id="list-container"
      class="portlet light portlet-fit bordered margin-top-20"
    >
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <client-logo />
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            Currencies
          </span>
          <div class="caption-desc font-grey-cascade">
            Edit or delete store currencies.
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
          :show="loading"
          :color="'#2C3E50'"
          :display="'inline'"
        />
        <div v-if="activeLocationId === undefined && !loading">
          <div class="alert center alert-info">
            <h4>No Store Selected</h4>
            <p>Please select a store from the stores panel on the right to view currencies for it.</p>
          </div>
        </div>
        <div
          v-if="list.length && !loading"
          class="mt-element-list margin-top-15"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="item in list"
                :id="'item-' + item.id"
                :key="item.id"
                class="mt-list-item actions-at-left margin-top-15 two-vertical-actions"
              >
                <div
                  class="list-item-actions"
                  @click.stop
                >
                  <el-tooltip
                    v-if="$root.permissions['stores accepted_currencies update']"
                    content="Edit"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click.stop="edit(item)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['stores accepted_currencies read'] && !$root.permissions['stores accepted_currencies update']"
                    content="View"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click.stop="edit(item)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['stores accepted_currencies delete']"
                    content="Delete"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click.stop="confirm(item)"
                    >
                      <i class="fa fa-lg fa-trash" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ item.currency }}</span>
                </div>
                <div class="list-item-content">
                  Conversion: {{ item.conversion }}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="margin-top-20">
          <no-results
            :show="!(activeLocationId === undefined) && !list.length && !loading"
            :type="'currencies'"
          />
        </div>
      </div>
    </div>
    <!-- END LIST -->

    <!-- START EDIT -->
    <modal
      ref="editModal"
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
          Edit Currency
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
                  @click.prevent="clearError('editErrorMessage')"
                />
                <span>{{ editErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-12">
              <fieldset :disabled="!$root.permissions['stores accepted_currencies update']">
                <div class="select">
                  <label>Currency</label>
                  <br>
                  <el-select
                    v-model="toEdit.currency"
                    class="width-100"
                    filterable
                    placeholder="Select a currency"
                    size="mini"
                  >
                    <el-option
                      v-for="(item, i) in currencies"
                      :key="i"
                      :label="`${item.code} - ${item.currency}`"
                      :value="item.code"
                    />
                  </el-select>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_edited_conversion"
                    v-model="toEdit.conversion"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': toEdit.conversion.length}"
                  >
                  <label for="form_control_edited_conversion">
                    Conversion
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          v-if="!$root.permissions['stores accepted_currencies update']"
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
          @click="update()"
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
      ref="deleteModal"
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
        <div class="row">
          <div class="col-md-12">
            <div
              v-show="deleteErrorMessage.length"
              ref="deleteErrorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                data-close="alert"
                @click.prevent="clearError('deleteErrorMessage')"
              />
              <span>{{ deleteErrorMessage }}</span>
            </div>
          </div>
        </div>
        <p>Are you sure you want to delete {{ toDelete.currency }}?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="deleting"
          @click="remove()"
        >
          Delete
          <i
            v-show="deleting"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
    <!-- END DELETE -->
  </div>
</template>

<script>
import ClientLogo from '@/components/modules/ClientLogo'
import LoadingScreen from '@/components/modules/LoadingScreen'
import Modal from '@/components/modules/Modal'
import NoResults from '@/components/modules/NoResults'
import CurrenciesFunctions from '@/controllers/Currencies'
import ajaxErrorHandler from '@/controllers/ErrorController'
import CurrenciesArray from '@/components/app/StoreManager/CurrenciesArray.js'
import { isNonNegativeNumber } from '@/controllers/utils'

export default {
  name: 'Currencies',
  components: {
    ClientLogo,
    LoadingScreen,
    Modal,
    NoResults
  },
  data () {
    return {
      currencies: [],

      createNewCollapse: true,
      creating: false,
      createErrorMessage: '',
      toCreate: {
        currency: '',
        conversion: ''
      },

      loading: false,
      listErrorMessage: '',
      list: [],

      showEditModal: false,
      editErrorMessage: '',
      updating: false,
      toEdit: {
        currency: '',
        conversion: ''
      },

      showDeleteModal: false,
      deleting: false,
      deleteErrorMessage: '',
      toDelete: {
        currency: '',
        conversion: ''
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
          this.getCurrencies()
        } else {
          this.list = []
        }
      },
      immediate: true
    }
  },
  created () {
    this.currencies = CurrenciesArray
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
     * To check if the currency data is valid before submitting to the backend.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    validateNewCurrencyData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.toCreate.currency) {
          reject('Currency cannot be blank')
        } else if (!_this.toCreate.conversion) {
          reject('Conversion cannot be blank')
        } else if (!isNonNegativeNumber(_this.toCreate.conversion)) {
          reject('Conversion must be zero or more')
        }
        resolve('Hurray')
      })
    },
    /**
     * To create a new currency.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    create () {
      var _this = this
      _this.clearError('createErrorMessage')

      return _this
        .validateNewCurrencyData()
        .then(response => {
          this.creating = true

          CurrenciesFunctions.createCurrency({
            locationId: this.activeLocationId,
            currency: this.toCreate
          })
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                _this.showCreateSuccess(response.payload)
                _this.clearNewCurrency()
                _this.getCurrencies()
              } else {
                _this.createErrorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not create the currency',
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
        })
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    showCreateSuccess (payload = {}) {
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'The Currency has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Currency has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
     * To clear the new currency form.
     * @function
     * @returns {undefined}
     */
    clearNewCurrency () {
      this.toCreate = {
        currency: '',
        conversion: ''
      }
    },
    /**
     * To get a list of all currencies.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getCurrencies () {
      this.loading = true
      this.list = []
      var _this = this
      return CurrenciesFunctions.listCurrencies({
        locationId: this.activeLocationId
      })
        .then(response => {
          _this.list = response.payload.sort((a, b) => {
            if (a.currency.toLowerCase() < b.currency.toLowerCase()) {
              return -1
            } else if (a.currency.toLowerCase() > b.currency.toLowerCase()) {
              return 1
            } else {
              return 0
            }
          })
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch the list of currencies',
            errorName: 'listErrorMessage',
            vue: _this
          })
        })
        .finally(() => {
          _this.loading = false
        })
    },
    /**
     * To show the modal to edit an currency details.
     * @function
     * @param {object} currency - The selected currency.
     * @returns {undefined}
     */
    edit (currency) {
      this.toEdit = { ...currency }
      this.showEditModal = true
    },
    /**
     * To check if the currency data is valid before submitting to the backend.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    validateEditedCurrencyData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.toEdit.currency) {
          reject('Currency cannot be blank')
        } else if (!_this.toEdit.conversion) {
          reject('Conversion cannot be blank')
        } else if (!isNonNegativeNumber(_this.toEdit.conversion)) {
          reject('Conversion must be zero or more')
        }

        resolve('Hurray')
      })
    },
    /**
     * To update a currency.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    update () {
      var _this = this
      _this.clearError('editErrorMessage')
      let payload = { ...this.toEdit }
      payload.location_id = this.activeLocationId

      return _this
        .validateEditedCurrencyData()
        .then(response => {
          this.updating = true

          CurrenciesFunctions.updateCurrency({
            locationId: this.activeLocationId,
            currency: this.toEdit
          })
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                _this.getCurrencies()
                _this.closeEditModal()
                _this.showEditSuccess(response.payload)
                _this.resetEdit()
              } else {
                _this.editErrorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the currency',
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
        })
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    showEditSuccess (payload = {}) {
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'Saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'Sent for approval'
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
      this.toEdit = {
        name: '',
        conversion: ''
      }
    },
    /**
     * To display the modal for deleting an currency.
     * @function
     * @param {object} currency - The selected currency
     * @returns {undefined}
     */
    confirm (currency) {
      this.toDelete = { ...currency }
      this.showDeleteModal = true
    },
    /**
     * To close the modal for deleting a promotion and remove that promotion from DOM.
     * @function
     * @returns {undefined}
     */
    remove () {
      this.deleting = true
      var _this = this
      return CurrenciesFunctions.deleteCurrency({
        locationId: this.activeLocationId,
        currency: this.toDelete
      })
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.getCurrencies()
            _this.closeDeleteModal()
            _this.showDeleteSuccess(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: `We could not delete ${this.toDelete.currency}`,
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
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'Deleted'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'Sent for approval'
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
.two-vertical-actions {
  min-height: 90px;
}
.select {
  margin: 1rem 0;
  font-size: 13px;
  color: rgb(136, 136, 136);
}
</style>

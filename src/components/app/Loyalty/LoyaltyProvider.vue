<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->

    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Loyalty Provider
    </h1>
    <!-- END PAGE TITLE -->
    <div class="note note-info">
      <p>Add and manage the loyalty provider.</p>
    </div>

    <div v-if="activeLocationId === undefined">
      <div class="alert center alert-info">
        <h4>No Store Selected</h4>
        <p>Please select a store from the stores panel on the right to view the loyalty provider for it.</p>
      </div>
    </div>

    <template v-else>
      <loading-screen
        v-if="loadingLoyaltyProvider"
        :show="loadingLoyaltyProvider"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <template v-else>
        <!-- BEGIN CREATE -->
        <div
          v-if="loyaltyProvider.id === undefined"
          class="portlet box blue-hoki"
        >
          <div
            class="portlet-title bg-blue-chambray"
          >
            <div class="caption">
              <i class="fa fa-2x fa-plus-circle" />
              Create a New Loyalty Provider
            </div>
          </div>
          <div
            class="portlet-body relative-block"
          >
            <div
              v-show="activeLocationId === undefined"
              class="col-md-12"
            >
              <div class="alert center alert-info">
                <h4>No Store Selected</h4>
                <p>Please select a store from the stores panel on the right to create a loyalty provider for it.</p>
              </div>
            </div>
            <form
              v-show="activeLocationId !== undefined"
              role="form"
              @submit.prevent="createLoyaltyProvider()"
            >
              <div class="row">
                <div class="col-md-offset-3 col-md-6">
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
                <div class="col-md-offset-3 col-md-6">
                  <el-select
                    v-model="newLoyaltyProvider.provider"
                    placeholder="Select a provider"
                    size="small"
                    class="mb-1em"
                  >
                    <el-option
                      label="Spoonity"
                      value="spoonity"
                    />
                    <el-option
                      label="UNOapp"
                      value="unoapp"
                    />
                  </el-select>
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      id="form_control_vendor_id"
                      v-model="newLoyaltyProvider.loyalty_vendor_id"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': newLoyaltyProvider.loyalty_vendor_id}"
                    >
                    <label for="form_control_vendor_id">
                      Vendor ID
                    </label>
                  </div>
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      id="form_control_app_id"
                      v-model="newLoyaltyProvider.app_id"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': newLoyaltyProvider.app_id}"
                    >
                    <label for="form_control_app_id">
                      App ID
                    </label>
                  </div>
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      id="form_control_app_secret"
                      v-model="newLoyaltyProvider.app_secret"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': newLoyaltyProvider.app_secret}"
                    >
                    <label for="form_control_app_secret">
                      App Secret
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
        <!-- BEGIN EDIT -->
        <div
          v-else
          id="loyaltyProvider-container"
          class="portlet light portlet-fit bordered margin-top-20"
        >
          <div class="portlet-title bg-blue-chambray">
            <div class="menu-image-main">
              <img src="@/../public/client_logo.png">
            </div>
            <div class="caption">
              <span class="caption-subject font-default bold uppercase">
                Loyalty Provider
              </span>
              <div class="caption-desc font-grey-cascade">
                Edit or delete the loyalty provider.
              </div>
            </div>
          </div>
          <div class="col-md-offset-3 col-md-6">
            <div
              v-show="listErrorMessage.length"
              ref="listErrorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                @click="clearError('listErrorMessage')"
              />
              <span>{{ listErrorMessage }}</span>
            </div>
          </div>
          <div class="portlet-body relative-block">
            <div
              v-if="loyaltyProvider.id !== undefined && !loadingLoyaltyProvider"
              class="mt-element-list margin-top-15"
            >
              <div class="mt-list-container list-news ext-1 no-border">
                <div class="row">
                  <div class="col-md-offset-3 col-md-6">
                    <el-select
                      v-model="loyaltyProviderToEdit.provider"
                      placeholder="Select a provider"
                      size="small"
                      class="mb-1em"
                    >
                      <el-option
                        label="Spoonity"
                        value="spoonity"
                      />
                      <el-option
                        label="UNOapp"
                        value="unoapp"
                      />
                    </el-select>
                    <div class="form-group form-md-line-input form-md-floating-label">
                      <input
                        id="form_control_edit_vendor_id"
                        v-model="loyaltyProviderToEdit.loyalty_vendor_id"
                        type="text"
                        class="form-control input-sm"
                        :class="{'edited': loyaltyProviderToEdit.loyalty_vendor_id}"
                      >
                      <label for="form_control_edit_vendor_id">
                        Vendor ID
                      </label>
                    </div>
                    <div class="form-group form-md-line-input form-md-floating-label">
                      <input
                        id="form_control_edit_app_id"
                        v-model="loyaltyProviderToEdit.app_id"
                        type="text"
                        class="form-control input-sm"
                        :class="{'edited': loyaltyProviderToEdit.app_id}"
                      >
                      <label for="form_control_edit_app_id">
                        App ID
                      </label>
                    </div>
                    <div class="form-group form-md-line-input form-md-floating-label">
                      <input
                        id="form_control_edit_app_secret"
                        v-model="loyaltyProviderToEdit.app_secret"
                        type="text"
                        class="form-control input-sm"
                        :class="{'edited': loyaltyProviderToEdit.app_secret}"
                      >
                      <label for="form_control_edit_app_secret">
                        App secret
                      </label>
                    </div>
                    <button
                      type="button"
                      class="btn blue mx-1em pull-right"
                      :disabled="!edited || updating || deleting"
                      @click="updateLoyaltyProvider()"
                    >
                      Save
                      <i
                        v-show="updating"
                        class="fa fa-spinner fa-pulse fa-fw"
                      />
                    </button>
                    <button
                      type="button"
                      class="btn blue btn-outline mx-1em pull-right"
                      :disabled="updating || deleting"
                      @click="confirmDelete()"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END EDIT -->
      </template>
    </template>

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
        <p>Are you sure you want to delete the loyalty provider?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="deleting"
          @click="deleteLoyaltyProvider()"
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
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import LoyaltyProviderFunctions from '@/controllers/LoyaltyProvider'
import Modal from '@/components/modules/Modal'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { isNonNegativeNumber } from '@/controllers/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'LoyaltyProvider',
  components: {
    Breadcrumb,
    LoadingScreen,
    Modal
  },
  data () {
    return {
      breadcrumbArray: [{ name: 'Loyalty Provider', link: false }],

      creating: false,
      createErrorMessage: '',
      newLoyaltyProvider: {
        provider: '',
        loyalty_vendor_id: '',
        app_id: '',
        app_secret: ''
      },

      loadingLoyaltyProvider: false,
      listErrorMessage: '',
      loyaltyProvider: {
        provider: '',
        loyalty_vendor_id: '',
        app_id: '',
        app_secret: ''
      },

      updating: false,
      loyaltyProviderToEdit: {
        provider: '',
        loyalty_vendor_id: '',
        app_id: '',
        app_secret: ''
      },

      showDeleteModal: false,
      deleting: false,
      deleteErrorMessage: '',
      loyaltyProviderToDelete: {
        provider: ''
      }
    }
  },
  computed: {
    activeLocationId: function () {
      return this.$root.activeLocation.id
    },
    edited () {
      let edited = false
      if (
        this.loyaltyProvider.provider !== this.loyaltyProviderToEdit.provider ||
        this.loyaltyProvider.loyalty_vendor_id !== this.loyaltyProviderToEdit.loyalty_vendor_id ||
        this.loyaltyProvider.app_id !== this.loyaltyProviderToEdit.app_id ||
        this.loyaltyProvider.app_secret !== this.loyaltyProviderToEdit.app_secret
      ) {
        edited = true
      }
      return edited
    },
    ...mapGetters(['can'])
  },
  watch: {
    activeLocationId: {
      handler: function (newId) {
        if (newId !== undefined) {
          this.clearError('listErrorMessage')
          this.getLoyaltyProvider()
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * To get a details of the loyalty provider.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getLoyaltyProvider () {
      this.loadingLoyaltyProvider = true
      this.clearLoyaltyProvider()
      this.clearLoyaltyProviderToEdit()
      var _this = this
      return LoyaltyProviderFunctions.getLoyaltyProvider(_this.activeLocationId)
        .then(response => {
          if (!response.payload) {
            response.payload = {}
          }
          _this.loyaltyProvider = {
            ...response.payload,
            loyalty_vendor_id: `${response.payload.loyalty_vendor_id}`
          }
          _this.loyaltyProviderToEdit = {
            ...response.payload,
            loyalty_vendor_id: `${response.payload.loyalty_vendor_id}`
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch the loyalty provider',
            errorName: 'listErrorMessage',
            vue: _this
          })
        })
        .finally(() => {
          _this.loadingLoyaltyProvider = false
        })
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
     * To check if the loyalty provider data is valid before submitting to the backend.
     * @function
     * @param {string} name - Name of the error variable to use
     * @returns {object} A promise that will validate the input form
     */
    validateLoyaltyProviderToCreate (name) {
      let message = ''
      if (!this.newLoyaltyProvider.provider) {
        message = 'Provider cannot be blank'
      } else if (!this.newLoyaltyProvider.loyalty_vendor_id) {
        message = 'Vendor ID cannot be blank'
      } else if (!isNonNegativeNumber(this.newLoyaltyProvider.loyalty_vendor_id)) {
        message = 'Vendor ID must be zero or more'
      } else if (!this.newLoyaltyProvider.app_id) {
        message = 'App ID cannot be blank'
      } else if (!this.newLoyaltyProvider.app_secret) {
        message = 'App secret cannot be blank'
      }
      this[name] = message
      return message.length === 0
    },
    /**
     * To create a new loyalty provider.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    createLoyaltyProvider () {
      if (!this.validateLoyaltyProviderToCreate('createErrorMessage')) return

      this.creating = true
      const payload = {
        ...this.newLoyaltyProvider,
        location_id: this.activeLocationId
      }

      const _this = this
      LoyaltyProviderFunctions.createLoyaltyProvider(payload)
        .then(response => {
          _this.showCreateSuccess(response.payload)
          _this.clearNewLoyaltyProvider()
          _this.getLoyaltyProvider()
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not create the loyalty provider',
            errorName: 'createErrorMessage',
            vue: _this
          })
        })
        .finally(() => {
          _this.creating = false
        })
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    showCreateSuccess (payload) {
      if (!payload) { payload = {} }
      let title = 'Success'
      let text = 'The Loyalty Provider has been created'
      let type = 'success'

      if (typeof payload === 'object' && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Loyalty Provider has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
     * To clear the new loyalty provider form.
     * @function
     * @returns {undefined}
     */
    clearNewLoyaltyProvider () {
      this.newLoyaltyProvider = {
        provider: '',
        loyalty_vendor_id: '',
        app_id: '',
        app_secret: ''
      }
    },
    /**
     * To clear the new loyalty provider form.
     * @function
     * @returns {undefined}
     */
    clearLoyaltyProvider () {
      this.loyaltyProvider = {
        provider: '',
        loyalty_vendor_id: '',
        app_id: '',
        app_secret: ''
      }
    },
    /**
     * To check if the loyalty provider data is valid before submitting to the backend.
     * @function
     * @param {string} name - Name of the error variable to use
     * @returns {object} A promise that will validate the input form
     */
    validateLoyaltyProviderToEdit (name) {
      let message = ''
      if (!this.loyaltyProviderToEdit.provider) {
        message = 'Provider cannot be blank'
      } else if (!this.loyaltyProviderToEdit.loyalty_vendor_id) {
        message = 'Vendor ID cannot be blank'
      } else if (!isNonNegativeNumber(this.loyaltyProviderToEdit.loyalty_vendor_id)) {
        message = 'Vendor ID must be zero or more'
      } else if (!this.loyaltyProviderToEdit.app_id) {
        message = 'App ID cannot be blank'
      } else if (!this.loyaltyProviderToEdit.app_secret) {
        message = 'App secret cannot be blank'
      }
      this[name] = message
      return message.length === 0
    },
    /**
     * To update a loyalty provider.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    updateLoyaltyProvider () {
      if (!this.validateLoyaltyProviderToEdit('listErrorMessage')) return

      this.updating = true
      const _this = this
      LoyaltyProviderFunctions.updateLoyaltyProvider(this.loyaltyProviderToEdit)
        .then(response => {
          _this.getLoyaltyProvider()
          _this.showEditSuccess(response.payload)
          _this.clearLoyaltyProviderToEdit()
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not update the loyalty provider',
            errorName: 'listErrorMessage',
            vue: _this
          })
        })
        .finally(() => {
          _this.updating = false
        })
    },
    /**
     * To clear the new loyalty provider form.
     * @function
     * @returns {undefined}
     */
    clearLoyaltyProviderToEdit () {
      this.loyaltyProvider = {
        provider: '',
        loyalty_vendor_id: '',
        app_id: '',
        app_secret: ''
      }
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    showEditSuccess (payload) {
      if (!payload) { payload = {} }
      let title = 'Success'
      let text = 'The Loyalty Provider has been saved'
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
     * To display the modal for deleting an loyalty provider.
     * @function
     * @returns {undefined}
     */
    confirmDelete () {
      this.loyaltyProviderToDelete = { ...this.loyaltyProvider }
      this.showDeleteModal = true
    },
    /**
     * To close the modal for deleting a promotion and remove that promotion from DOM.
     * @function
     * @returns {undefined}
     */
    deleteLoyaltyProvider () {
      this.deleting = true
      const _this = this
      LoyaltyProviderFunctions.deleteLoyaltyProvider(_this.loyaltyProviderToDelete)
        .then(response => {
          _this.getLoyaltyProvider()
          _this.closeDeleteModal()
          _this.showDeleteSuccess(response.payload)
          _this.clearLoyaltyProviderToDelete()
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: `We could not delete ${this.loyaltyProviderToDelete.name}`,
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
    showDeleteSuccess (payload) {
      if (!payload) { payload = {} }
      let title = 'Success'
      let text = 'The Loyalty Provider has been deleted'
      let type = 'success'

      if (typeof payload === 'object' && payload.pending_approval) {
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
     * To clear the new loyalty provider form.
     * @function
     * @returns {undefined}
     */
    clearLoyaltyProviderToDelete () {
      this.loyaltyProviderToDelete = {
        provider: ''
      }
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

<template>
  <div>
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Discounts
    </h1>
    <!-- END PAGE TITLE -->
    <div class="note note-info">
      <p>Add and manage discounts.</p>
    </div>

    <!-- BEGIN CREATE -->
    <div
      v-if="$root.permissions['stores discounts create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create a New Discount
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
            <p>Please select a store from the stores panel on the right to create discounts for it.</p>
          </div>
        </div>
        <form
          v-show="activeLocationId !== undefined"
          role="form"
          @submit.prevent="createDiscount()"
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
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_new_name"
                  v-model="newDiscount.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newDiscount.name.length}"
                >
                <label for="form_control_new_name">
                  Name
                </label>
              </div>
              <div class="width-100 display-flex align-items-center margin-top-20">
                <label
                  class="select-label"
                >
                  Apply to:
                </label>
                <el-select
                  v-model="newDiscount.apply_on"
                  placeholder="select"
                  size="small"
                >
                  <el-option
                    label="items"
                    value="items"
                  />
                  <el-option
                    label="cart"
                    value="cart"
                  />
                </el-select>
              </div>
              <div class="width-100 display-flex align-items-center margin-top-20">
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
                  <el-option
                    label="percent"
                    value="percentage"
                  />
                  <el-option
                    label="dollars"
                    value="dollar"
                  />
                </el-select>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_new_value"
                  v-model="newDiscount.value"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newDiscount.value.length}"
                >
                <label for="form_control_new_value">
                  Value
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
      id="discounts-container"
      class="portlet light portlet-fit bordered margin-top-20"
    >
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <client-logo />
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            Discounts
          </span>
          <div class="caption-desc font-grey-cascade">
            Edit or delete store discounts. Assign discounts to permissions.
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
          :show="loadingDiscounts"
          :color="'#2C3E50'"
          :display="'inline'"
        />
        <div v-if="activeLocationId === undefined && !loadingDiscounts">
          <div class="alert center alert-info">
            <h4>No Store Selected</h4>
            <p>Please select a store from the stores panel on the right to view discounts for it.</p>
          </div>
        </div>
        <div
          v-if="discounts.length && !loadingDiscounts"
          class="mt-element-list margin-top-15"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="discount in discounts"
                :id="'discount-' + discount.id"
                :key="discount.id"
                class="mt-list-item actions-at-left margin-top-15 three-vertical-actions"
              >
                <div class="list-item-actions">
                  <el-tooltip
                    v-if="$root.permissions['stores discounts update']"
                    content="Edit"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editDiscount(discount, $event)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['stores discounts read'] && !$root.permissions['stores discounts update']"
                    content="View"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editDiscount(discount, $event)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['stores discounts permission sync']"
                    content="Permissions"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click.stop="sync(discount)"
                    >
                      <i class="fa fa-lg fa-ban" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['stores discounts delete']"
                    content="Delete"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="confirmDelete(discount, $event)"
                    >
                      <i class="fa fa-lg fa-trash" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ discount.name }}</span>
                </div>
                <div class="list-item-content height-mod">
                  <div class="col-md-4">
                    {{ discount.type === 'dollar' ? '$' : '' }}{{ discount.value }}{{ discount.type === 'percentage' ? '%' : '' }} on {{ discount.apply_on }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="margin-top-20">
          <no-results
            :show="!(activeLocationId === undefined) && !discounts.length && !loadingDiscounts"
            :type="'discounts'"
          />
        </div>
      </div>
    </div>
    <!-- END LIST -->

    <assign-permissions-to-discount
      v-if="showSyncModal"
      :discount="toSync"
      @close="closeSyncModal"
    />

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
          Edit Discount
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
              <fieldset :disabled="!$root.permissions['stores discounts update']">
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_edited_name"
                    v-model="discountToEdit.name"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': discountToEdit.name.length}"
                  >
                  <label for="form_control_edited_name">
                    Name
                  </label>
                </div>
                <div class="width-100 display-flex align-items-center margin-top-20">
                  <label
                    class="select-label"
                  >
                    Apply to:
                  </label>
                  <el-select
                    v-model="discountToEdit.apply_on"
                    placeholder="select"
                    size="small"
                  >
                    <el-option
                      label="items"
                      value="items"
                    />
                    <el-option
                      label="cart"
                      value="cart"
                    />
                  </el-select>
                </div>
                <div class="width-100 display-flex align-items-center margin-top-20">
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
                    <el-option
                      label="percent"
                      value="percentage"
                    />
                    <el-option
                      label="dollars"
                      value="dollar"
                    />
                  </el-select>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_edited_value"
                    v-model="discountToEdit.value"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': discountToEdit.value.length}"
                  >
                  <label for="form_control_edited_value">
                    Value
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
          v-if="!$root.permissions['stores discounts update']"
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
          @click="updateDiscount()"
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
        <p>Are you sure you want to delete {{ discountToDelete.name }}?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="deleting"
          @click="deleteDiscount()"
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
import AssignPermissionsToDiscount from '@/components/app/StoreManager/Discounts/AssignPermissionsToDiscount'
import ClientLogo from '@/components/modules/ClientLogo'
import LoadingScreen from '@/components/modules/LoadingScreen'
import Modal from '@/components/modules/Modal'
import NoResults from '@/components/modules/NoResults'
import DiscountsFunctions from '@/controllers/Discounts'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { isNonNegativeNumber } from '@/controllers/utils'

export default {
  name: 'Discounts',
  components: {
    AssignPermissionsToDiscount,
    ClientLogo,
    LoadingScreen,
    Modal,
    NoResults
  },
  data () {
    return {
      createNewCollapse: true,
      creating: false,
      createErrorMessage: '',
      newDiscount: {
        name: '',
        apply_on: '',
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
        apply_on: '',
        type: '',
        value: ''
      },

      showDeleteModal: false,
      deleting: false,
      deleteErrorMessage: '',
      discountToDelete: {
        name: '',
        apply_on: '',
        type: '',
        value: ''
      },

      showSyncModal: false,
      syncing: false,
      syncErrorMessage: '',
      toSync: {
        name: '',
        apply_on: '',
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
        this.$router.push({ name: 'DiscountCategories' })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.params.id === undefined) {
      this.$router.push({ name: 'DiscountCategories' })
    } else next()
  },
  created () {
    this.getDiscounts()
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
        } else if (!_this.newDiscount.apply_on) {
          reject('Select what the discount is applied to')
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

          DiscountsFunctions.createDiscount(this.newDiscount, this.$route.params.id)
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
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'The Discount has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
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
      return DiscountsFunctions.getDiscountsInCategory(this.$route.params.id)
        .then(response => {
          _this.discounts = response.payload.location_discounts.sort((a, b) => {
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
      this.discountToEdit = { ...discount }
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
      let payload = {
        ...this.discountToEdit,
        category_id: this.$route.params.id
      }
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
      let text = 'The Discount has been saved'
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
      this.discountToEdit = {
        name: '',
        apply_on: '',
        type: '',
        value: ''
      }
    },
    /**
     * To display the modal for assigning permissions to a discount.
     * @function
     * @param {object} item - The selected discount
     * @returns {undefined}
     */
    sync (item) {
      this.toSync = item
      this.showSyncModal = true
    },
    /**
     * To close the modal for deleting an discount.
     * @function
     * @returns {undefined}
     */
    closeSyncModal () {
      this.showSyncModal = false
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
          _this.getDiscounts()
          _this.closeDeleteModal()
          _this.showDeleteSuccess(response.payload)
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
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'The Discount has been deleted'
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
.two-vertical-actions {
  min-height: 90px;
}
.select-label {
  color: #999;
  margin-right: 5px;
}
</style>


<template>
  <div>
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Discount Categories
    </h1>
    <!-- END PAGE TITLE -->
    <div class="note note-info">
      <p>Add and manage discount categories.</p>
    </div>

    <!-- BEGIN CREATE -->
    <div
      v-if="$root.permissions['stores discount categories create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create a New Discount Category
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
            <p>Please select a store from the stores panel on the right to create discount categories.</p>
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
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_new_name"
                  v-model="toCreate.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': toCreate.name.length}"
                >
                <label for="form_control_new_name">
                  Name
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
            Discount Categories
          </span>
          <div class="caption-desc font-grey-cascade">
            Edit or delete store discount categories.
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
            <p>Please select a store from the stores panel on the right to view discount categories for it.</p>
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
                @click="viewChildren(item)"
              >
                <div
                  class="list-item-actions"
                  @click.stop
                >
                  <el-tooltip
                    v-if="$root.permissions['stores discount categories update']"
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
                    v-if="$root.permissions['stores discount categories read'] && !$root.permissions['stores discount categories update']"
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
                    v-if="$root.permissions['stores discount categories delete']"
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
                <div class="list-icon-container">
                  <i class="fa fa-angle-right" />
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ item.name }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="margin-top-20">
          <no-results
            :show="!(activeLocationId === undefined) && !list.length && !loading"
            :type="'discount categories'"
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
              <fieldset :disabled="!$root.permissions['stores discount categories update']">
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_edited_name"
                    v-model="toEdit.name"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': toEdit.name.length}"
                  >
                  <label for="form_control_edited_name">
                    Name
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
          v-if="!$root.permissions['stores discount categories update']"
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
        <p>Are you sure you want to delete {{ toDelete.name }}?</p>
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
import DiscountsFunctions from '@/controllers/Discounts'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  name: 'DiscountCategories',
  components: {
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
      toCreate: {
        name: ''
      },

      loading: false,
      listErrorMessage: '',
      list: [],

      showEditModal: false,
      editErrorMessage: '',
      updating: false,
      toEdit: {
        name: ''
      },

      showDeleteModal: false,
      deleting: false,
      deleteErrorMessage: '',
      toDelete: {
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
    activeLocationId: {
      handler: function (newId) {
        if (newId !== undefined) {
          this.clearError('listErrorMessage')
          this.getDiscounts()
        } else {
          this.list = []
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
        if (!_this.toCreate.name) {
          reject('Name cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
     * To create a new discount.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    create () {
      var _this = this
      _this.clearError('createErrorMessage')

      return _this
        .validateNewDiscountData()
        .then(response => {
          this.creating = true

          DiscountsFunctions.createDiscountCategory({
            locationId: this.activeLocationId,
            data: this.toCreate
          })
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
      this.toCreate = {
        name: ''
      }
    },
    /**
     * To get a list of all discounts.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getDiscounts () {
      this.loading = true
      this.list = []
      var _this = this
      return DiscountsFunctions.getDiscountCategoriesForLocation(this.activeLocationId)
        .then(response => {
          _this.list = response.payload.sort((a, b) => {
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
            errorText: 'We could not fetch the list of discount categories',
            errorName: 'listErrorMessage',
            vue: _this
          })
        })
        .finally(() => {
          _this.loading = false
        })
    },
    /**
     * To show the modal to edit an discount details.
     * @function
     * @param {object} discount - The selected discount.
     * @returns {undefined}
     */
    edit (discount) {
      this.toEdit = { ...discount }
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
        if (!_this.toEdit.name) {
          reject('Name cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
     * To update a discount.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    update () {
      var _this = this
      _this.clearError('editErrorMessage')
      let payload = { ...this.toEdit }
      payload.location_id = this.activeLocationId

      return _this
        .validateEditedDiscountData()
        .then(response => {
          this.updating = true

          DiscountsFunctions.updateDiscountCategory(payload)
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
        type: '',
        value: ''
      }
    },
    /**
     * To display the modal for deleting an discount.
     * @function
     * @param {object} discount - The selected discount
     * @returns {undefined}
     */
    confirm (discount) {
      this.toDelete = { ...discount }
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
      return DiscountsFunctions.deleteDiscountCategory(_this.toDelete.id)
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
            errorText: `We could not delete ${this.toDelete.name}`,
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
    },
    /**
     * To view item's children
     * @function
     * @param {object} item - The item to view the children of
     * @returns {undefined}
     */
    viewChildren (item) {
      this.$router.push({
        name: 'Discounts',
        params: {
          id: item.id
        }
      })
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

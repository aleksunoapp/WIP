<template>
  <div>
    <div>
      <div class="page-bar">
        <breadcrumb :crumbs="breadcrumbArray" />
      </div>
      <h1 class="page-title">
        Permissions
      </h1>
      <div class="note note-info">
        <p>Create and manage user permissions.</p>
      </div>

      <!-- CREATE NEW START -->
      <div
        v-if="$root.permissions['create permission']"
        class="portlet box blue-hoki margin-top-20"
      >
        <div
          class="portlet-title bg-blue-chambray"
          @click="toggleCreatePermissionPanel()"
        >
          <div class="caption">
            <i class="fa fa-plus-circle" />
            Create New Permission
          </div>
          <div class="tools">
            <a :class="{'expand': !createCollapse, 'collapse': createCollapse}" />
          </div>
        </div>
        <div
          v-show="!createCollapse"
          class="portlet-body"
        >
          <form
            role="form"
            @submit.prevent="createPermission()"
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
                    @click.prevent="clearCreateError()"
                  />
                  <span>{{ createErrorMessage }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_name"
                    ref="newPermissionName"
                    v-model="newPermission.name"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newPermission.name.length}"
                  >
                  <label for="form_control_name">
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
      <!-- CREATE NEW END -->

      <!-- SEARCH START -->
      <div
        v-if="permissions.length"
        class="margin-top-20"
      >
        <div class="portlet box blue-hoki">
          <div
            class="portlet-title"
            @click="toggleSearchPanel()"
          >
            <div class="caption">
              <i class="fa fa-search" />
              Search Panel
            </div>
            <div class="tools">
              <a :class="{'expand': !searchCollapse, 'collapse': searchCollapse}" />
            </div>
          </div>
          <div
            v-show="!searchCollapse"
            class="portlet-body"
          >
            <form role="form">
              <div class="form-body row">
                <div class="col-md-6">
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      ref="search"
                      v-model="searchTerm"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': searchTerm.length}"
                    >
                    <label for="search_options_search">
                      Search
                    </label>
                    <span
                      v-if="searchTerm.length && !filteredResults.length"
                      class="help-block persist"
                    >
                      No matching results.
                    </span>
                    <span
                      v-else
                      class="help-block persist"
                    >
                      Search by name
                    </span>
                  </div>
                  <button
                    type="button"
                    class="btn btn-default pull-right"
                    @click="resetSearch()"
                  >
                    Reset Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- SEARCH END -->

      <!-- LIST START -->
      <loading-screen
        :show="loading"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <div v-if="!loading && filteredResults.length">
        <div class="portlet light portlet-fit bordered margin-top-20">
          <div class="portlet-title bg-blue-chambray">
            <div class="menu-image-main">
              <img src="@/../public/client_logo.png">
            </div>
            <div class="caption">
              <span class="caption-subject font-default bold uppercase">
                Permissions
              </span>
              <div class="caption-desc font-grey-cascade">
                Click on the edit button to edit a permission.
              </div>
            </div>
          </div>
          <div class="portlet-body">
            <div
              v-if="permissions.length"
              class="clearfix margin-bottom-10"
            >
              <el-dropdown
                trigger="click"
                size="mini"
                :show-timeout="50"
                :hide-timeout="50"
                @command="updateSortByOrder"
              >
                <el-button size="mini">
                  Sort by
                  <span>
                    <i
                      v-if="sortBy.order === 'ASC'"
                      class="fa fa-sort-alpha-asc"
                    />
                    <i
                      v-if="sortBy.order === 'DESC'"
                      class="fa fa-sort-alpha-desc"
                    />
                  </span>
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="ASC">
                    <i class="fa fa-sort-alpha-asc" />
                  </el-dropdown-item>
                  <el-dropdown-item command="DESC">
                    <i class="fa fa-sort-alpha-desc" />
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <page-results
                class="pull-right"
                :total-results="filteredResults.length"
                :active-page="activePage"
                @pageResults="pageResultsUpdate"
              />
            </div>
            <div class="mt-element-list">
              <div class="mt-list-container list-news">
                <ul>
                  <li
                    v-for="permission in currentActivePageItems"
                    :id="'permission-' + permission.id"
                    :key="permission.id"
                    class="mt-list-item actions-at-left margin-top-15"
                    :class="{'animated' : animated === `permission-${permission.id}`}"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="$root.permissions['update permission']"
                        content="Edit"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editPermission(permission)"
                        >
                          <i
                            class="fa fa-pencil"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['list permission'] && !$root.permissions['update permission']"
                        content="View"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editPermission(permission)"
                        >
                          <i
                            class="fa fa-eye"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['delete permission']"
                        content="Delete"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="showDeleteModal(permission)"
                        >
                          <i
                            class="fa fa-trash"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                    </div>
                    <div class="list-datetime bold uppercase font-red">
                      <span>{{ permission.name }}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div
                v-if="permissions.length && numPages > 1"
                class="clearfix"
              >
                <pagination
                  :passed-page="activePage"
                  :num-pages="numPages"
                  @activePageChange="activePageUpdate"
                />
              </div>
            </div>
            <div
              v-show="listErrorMessage.length"
              ref="listErrorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                data-close="alert"
                @click="clearListError()"
              />
              <span>{{ listErrorMessage }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!filteredResults.length && !loading">
        <no-results
          :show="!permissions.length"
          :type="'permissions'"
        />
      </div>
    </div>
    <!-- LIST END -->

    <!-- EDIT MODAL START -->
    <modal
      :show="showEditPermissionModal"
      effect="fade"
      @closeOnEscape="closeEditPermissionModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeEditPermissionModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Edit Permission
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="editErrorMessage.length"
          ref="editErrorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            data-close="alert"
            @click="clearEditError()"
          />
          <span>{{ editErrorMessage }}</span>
        </div>
        <div class="form-group form-md-line-input form-md-floating-label">
          <input
            id="form_control_edited_name"
            v-model="permissionToEdit.name"
            :disabled="$root.permissions['list permission'] && !$root.permissions['update permission']"
            type="text"
            class="form-control input-sm"
            :class="{'edited': permissionToEdit.name.length}"
          >
          <label for="form_control_edited_name">
            Name
          </label>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          v-if="$root.permissions['list permission'] && !$root.permissions['update permission']"
          type="button"
          class="btn btn-primary"
          @click="closeEditPermissionModal()"
        >
          Close
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary"
          :disabled="updating"
          @click="updatePermission()"
        >
          Save
          <i
            v-show="updating"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
    <!-- EDIT MODAL END -->

    <!-- DELETE MODAL START -->
    <modal
      :show="showDeletePermissionModal"
      effect="fade"
      @closeOnEscape="closeDeletePermissionModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeDeletePermissionModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Delete Permission
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="deleteErrorMessage.length"
          ref="deleteErrorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            data-close="alert"
            @click="clearDeleteError()"
          />
          <span>{{ deleteErrorMessage }}</span>
        </div>
        <p>Are you sure you want to delete this permission?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          type="button"
          class="btn btn-primary"
          :disabled="deleting"
          @click="deletePermission()"
        >
          Delete
          <i
            v-show="deleting"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
    <!-- DELETE MODAL END -->
  </div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import PermissionsFunctions from '../../../controllers/Permissions'
import Modal from '../../modules/Modal'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
  components: {
    Breadcrumb,
    NoResults,
    LoadingScreen,
    Modal,
    Pagination,
    PageResults
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Admin Manager', link: false },
        { name: 'Permissions', link: false }
      ],
      createCollapse: true,
      createErrorMessage: '',
      creating: false,
      newPermission: {
        name: '',
        guard_name: 'admin',
        permissions: []
      },
      editErrorMessage: '',
      updating: false,
      permissionToEdit: {
        name: '',
        guard_name: 'admin',
        permissions: []
      },
      loading: false,
      permissions: [],
      showEditPermissionModal: false,
      animated: '',
      searchCollapse: true,
      searchError: '',
      searchTerm: '',
      activePage: 1,
      resultsPerPage: 25,
      sortBy: {
        order: 'ASC'
      },
      showDeletePermissionModal: false,
      permissionToDelete: {
        name: ''
      },
      deleting: false,
      deleteErrorMessage: '',
      listErrorMessage: ''
    }
  },
  computed: {
    numPages () {
      return Math.ceil(this.filteredResults.length / this.resultsPerPage)
    },
    currentActivePageItems () {
      return this.userSort(this.filteredResults).slice(
        this.resultsPerPage * (this.activePage - 1),
        this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage
      )
    },
    filteredResults () {
      return this.permissions.filter(permission => (
        permission.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      ))
    }
  },
  created () {
    this.getAllPermissions()
  },
  methods: {
    /**
     * To format a phone number
     * @function
     * @param {string} phone - The phone number to format
     * @returns {string} The formatted phone string
     */
    formatPhone (phone) {
      try {
        let digits = phone.replace(/\D/g, '')
        return (
          digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
        )
      } catch (err) {
        return ''
      }
    },
    /**
     * To update the order property of sortBy.
     * @function
     * @param {object} value - The new value to assign.
     * @returns {undefined}
     */
    updateSortByOrder (value) {
      this.sortBy.order = value
      this.activePageUpdate(1)
    },
    /**
     * To sort the orders list.
     * @function
     * @param {array} orders - The array of orders.
     * @returns {array} - The sorted array of orders
     */
    userSort (orders) {
      let input = orders
      function asc (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        } else {
          if (a.id > b.id) {
            return -1
          } else if (a.id < b.id) {
            return 1
          } else {
            return 0
          }
        }
      }

      function desc (a, b) {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return 1
        } else {
          if (a.id > b.id) {
            return -1
          } else if (a.id < b.id) {
            return 1
          } else {
            return 0
          }
        }
      }

      if (this.sortBy.order === 'ASC') {
        return input.sort(asc)
      } else {
        return input.sort(desc)
      }
    },
    /**
     * To catch updates from the PageResults component when the number of page results is updated.
     * @function
     * @param {integer} val - The number of page results to be returned.
     * @returns {undefined}
     */
    pageResultsUpdate (val) {
      if (parseInt(this.resultsPerPage) !== parseInt(val)) {
        this.resultsPerPage = val
        this.activePageUpdate(1)
      }
    },
    /**
     * To update the currently active pagination page.
     * @function
     * @param {integer} val - An integer representing the page number that we are updating to.
     * @returns {undefined}
     */
    activePageUpdate (val) {
      if (parseInt(this.activePage) !== parseInt(val)) {
        this.activePage = val
      }
    },
    /**
     * To toggle the search panel
     * @function
     * @returns {undefined}
     */
    toggleSearchPanel () {
      if (!this.searchTerm) {
        this.searchCollapse = !this.searchCollapse
      }
      this.$nextTick(function () {
        if (!this.searchCollapse) {
          this.$refs.search.focus()
        }
      })
    },
    /**
     * To clear the search
     * @function
     * @returns {undefined}
     */
    resetSearch () {
      this.searchTerm = ''
    },
    /**
     * To display the edit modal
     * @function
     * @param {object} permission - The permission object to be edited
     * @returns {undefined}
     */
    editPermission (permission) {
      this.permissionToEdit = { ...permission }
      this.showEditPermissionModal = true
    },
    /**
     * To display the delete modal
     * @function
     * @param {object} permission - The permission object to be edited
     * @returns {undefined}
     */
    showDeleteModal (permission) {
      this.permissionToDelete = { ...permission }
      this.showDeletePermissionModal = true
    },
    /**
     * To close the delete modal
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    closeDeletePermissionModal () {
      this.clearDeleteError()
      this.showDeletePermissionModal = false
    },
    /**
     * To delete a permission.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    deletePermission () {
      this.deleting = true
      this.clearDeleteError()
      var permissionsVue = this
      return PermissionsFunctions.deletePermission(
        permissionsVue.permissionToDelete
      )
        .then(response => {
          permissionsVue.getAllPermissions()
          permissionsVue.closeDeletePermissionModal()
          permissionsVue.showDeleteSuccess(response.payload)
          permissionsVue.resetDeleteForm()
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'Could not delete permission',
            errorName: 'deleteErrorMessage',
            vue: permissionsVue
          })
        })
        .finally(() => {
          permissionsVue.deleting = false
        })
    },
    /**
     * To close the edit modal
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    closeEditPermissionModal () {
      this.clearEditError()
      this.showEditPermissionModal = false
    },
    /**
     * To get a list of brand admins.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getAllPermissions () {
      this.loading = true
      this.clearListError()
      var permissionsVue = this
      return PermissionsFunctions.getAllPermissions()
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            permissionsVue.loading = false
            permissionsVue.permissions = response.payload
          } else {
            permissionsVue.loading = false
          }
        })
        .catch(reason => {
          permissionsVue.loading = false
          ajaxErrorHandler({
            reason,
            errorText: 'Could not get permissions',
            errorName: 'listErrorMessage',
            vue: permissionsVue
          })
        })
    },
    /**
     * To get a list of brand admins.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    createPermission () {
      var permissionsVue = this

      return this.validateNewPermissionData()
        .then(response => {
          permissionsVue.creating = true
          permissionsVue.clearCreateError()
          return PermissionsFunctions.createPermission(
            permissionsVue.newPermission
          )
            .then(response => {
              permissionsVue.getAllPermissions()
              permissionsVue.resetCreateForm()
              permissionsVue.showCreateSuccess(response.payload)
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'Could not get create permission',
                errorName: 'createErrorMessage',
                vue: permissionsVue
              })
            })
        })
        .catch(reason => {
          permissionsVue.createErrorMessage = reason
          permissionsVue.$scrollTo(
            permissionsVue.$refs.createErrorMessage,
            1000,
            { offset: -50 }
          )
        })
        .finally(() => {
          permissionsVue.creating = false
        })
    },
    /**
     * To reset the create new form.
     * @function
     * @returns {undefined}
     */
    resetCreateForm () {
      this.newPermission = {
        name: '',
        guard_name: 'admin',
        permissions: []
      }
    },
    /**
     * To reset the create new form.
     * @function
     * @returns {undefined}
     */
    resetEditForm () {
      this.permissionToEdit = {
        name: '',
        guard_name: 'admin',
        permissions: []
      }
    },
    /**
     * To reset the delete form.
     * @function
     * @returns {undefined}
     */
    resetDeleteForm () {
      this.permissionToDelete = {
        name: ''
      }
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    showCreateSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Permission has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Permission has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
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
      let text = 'The Permission has been updated'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Permission has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
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
      let text = 'The Permission has been deleted'
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
     * To toggle the create new panel.
     * @function
     * @returns {undefined}
     */
    toggleCreatePermissionPanel () {
      this.createCollapse = !this.createCollapse
      this.$nextTick(function () {
        if (!this.createCollapse) {
          this.$refs.newPermissionName.focus()
        }
      })
    },
    /**
     * To clear the current error.
     * @function
     * @returns {undefined}
     */
    clearCreateError () {
      this.createErrorMessage = ''
    },
    /**
     * To clear the current error.
     * @function
     * @returns {undefined}
     */
    clearEditError () {
      this.editErrorMessage = ''
    },
    /**
     * To clear the current error.
     * @function
     * @returns {undefined}
     */
    clearListError () {
      this.listErrorMessage = ''
    },
    /**
     * To clear the current error.
     * @function
     * @returns {undefined}
     */
    clearDeleteError () {
      this.deleteErrorMessage = ''
    },
    /**
     * To update a permission.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    updatePermission () {
      var permissionsVue = this

      return this.validateEditedPermissionData()
        .then(response => {
          permissionsVue.updating = true
          permissionsVue.clearEditError()
          return PermissionsFunctions.updatePermission(
            permissionsVue.permissionToEdit
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                permissionsVue.closeEditPermissionModal()
                permissionsVue.showEditSuccess(response.payload)
                for (var i = 0; i < permissionsVue.permissions.length; i++) {
                  if (
                    permissionsVue.permissions[i].id === response.payload.id
                  ) {
                    permissionsVue.permissions[i].name = response.payload.name
                  }
                }
                permissionsVue.animated = `permission-${response.payload.id}`
                permissionsVue.resetEditForm()
                window.setTimeout(() => {
                  permissionsVue.animated = ''
                }, 3000)
              } else {
                let me = new Error(response)
                throw me
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'Could not get save permission',
                errorName: 'editErrorMessage',
                vue: permissionsVue
              })
            })
            .finally(() => {
              permissionsVue.updating = false
            })
        })
        .catch(reason => {
          permissionsVue.editErrorMessage = reason
          permissionsVue.$scrollTo(
            permissionsVue.$refs.editErrorMessage,
            1000,
            { offset: -50 }
          )
        })
    },
    /**
     * To check if the item data is valid before submitting to the backend.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    validateNewPermissionData () {
      var permissionsVue = this
      return new Promise(function (resolve, reject) {
        if (!permissionsVue.newPermission.name.length) {
          reject('Name cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
     * To check if the item data is valid before submitting to the backend.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    validateEditedPermissionData () {
      var permissionsVue = this
      return new Promise(function (resolve, reject) {
        if (!permissionsVue.permissionToEdit.name.length) {
          reject('Name cannot be blank')
        }
        resolve('Hurray')
      })
    }
  }
}
</script>

<style scoped>
.animated {
  animation: listItemHighlight 1s 2 ease-in-out both;
}
.mt-element-list .list-news.mt-list-container ul > .mt-list-item:hover {
  background-color: white;
}
.mt-element-list .list-news.mt-list-container ul > .mt-list-item {
  min-height: 80px;
}
</style>

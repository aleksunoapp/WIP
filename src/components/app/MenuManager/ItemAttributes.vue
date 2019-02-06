<template>
  <div>
    <!-- PAGE BAR START -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- PAGE BAR END -->

    <!-- HEADER SART -->
    <h1 class="page-title">
      Item Attributes
    </h1>
    <div class="note note-info">
      <p>Create, view, edit and delete Item Attributes. View or edit Items the Item Attribute is assigned to. View or edit what User Attributes the Item Attribute is associated with.</p>
    </div>
    <!-- HEADER END -->

    <!-- CREATE START -->
    <div
      v-if="$root.permissions['menu_manager attributes create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-plus-circle" />
          Create A New Item Attribute
        </div>
        <div class="tools">
          <a :class="{'expand': expandCreateForm, 'collapse': !expandCreateForm}" />
        </div>
      </div>
      <div
        v-show="expandCreateForm"
        class="portlet-body"
      >
        <form
          role="form"
          @submit="createItemAttribute()"
        >
          <div
            v-show="createErrorMessage"
            ref="createErrorMessage"
            class="row"
          >
            <div class="col-md-6">
              <div class="alert alert-danger">
                <button
                  class="close"
                  @click.prevent="clearError('createErrorMessage')"
                />
                <span>{{ createErrorMessage }}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_2"
                  v-model="newItemAttribute.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newItemAttribute.name.length}"
                  @keyup.enter.stop="createItemAttribute()"
                >
                <label for="form_control_2">
                  Item Attribute Name
                </label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <button
                type="submit"
                class="btn blue pull-right"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- CREATE END -->

    <!-- SEARCH START -->
    <div
      v-show="itemAttributes.length"
      class="margin-top-20"
    >
      <div class="portlet box blue-hoki">
        <div
          class="portlet-title"
          @click="toggleSearchPanel()"
        >
          <div class="caption">
            <i class="fa fa-search" />
            Search
          </div>
          <div class="tools">
            <a :class="{'expand': expandSearchPanel, 'collapse': !expandSearchPanel}" />
          </div>
        </div>
        <div
          v-show="expandSearchPanel"
          class="portlet-body"
        >
          <form role="form">
            <div class="row">
              <div class="col-md-6">
                <div
                  v-show="searchErrorMessage.length"
                  class="alert alert-danger"
                >
                  <button
                    class="close"
                    @click="clearError('searchErrorMessage')"
                  />
                  <span>{{ searchErrorMessage }}</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 margin-bottom-20">
                <div class="form-group form-md-line-input form-md-floating-label">
                  <div class="input-icon right">
                    <input
                      id="search_options_search"
                      ref="search"
                      v-model="searchTerm"
                      type="text"
                      placeholder="Search by name"
                      class="form-control input-sm"
                      :class="{'edited': searchTerm.length}"
                    >
                    <span class="help-block persist">
                      At least 3 characters.
                    </span>
                  </div>
                </div>
                <div class="pull-right">
                  <button
                    type="button"
                    class="btn btn-default"
                    @click.prevent="resetSearch()"
                  >
                    Reset Search
                  </button>
                  <button
                    type="submit"
                    class="btn blue"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- SEARCH END -->

    <!-- LIST START -->
    <div class="portlet light portlet-fit bordered margin-top-20">
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <img src="../../../../public/client_logo.png">
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            Item Attributes
          </span>
          <div class="caption-desc font-grey-cascade">
            <span v-show="searchTerm.length < 3">
              All Item Attributes
            </span>
            <span v-show="searchTerm.length > 2">
              Search results
            </span>
          </div>
        </div>
      </div>
      <div class="portlet-body">
        <div class="row">
          <div class="col-md-12">
            <div
              v-show="listErrorMessage"
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
        </div>
        <div
          v-show="searchResults.length"
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
                  v-show="sortBy.order === 'ASC'"
                  class="fa fa-sort-alpha-asc"
                />
                <i
                  v-show="sortBy.order === 'DESC'"
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
            :total-results="itemAttributes.length"
            :active-page="activePage"
            @pageResults="pageResultsUpdate"
          />
        </div>
        <div
          v-show="!searchResults.length && loadingItemAttributes"
          class="spinner"
        >
          <div>
            <i class="fa fa-spinner fa-spin" />
          </div>
        </div>
        <div
          class="mt-element-list margin-top-15"
          :show="searchResults.length && !loadingItemAttributes"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="itemAttribute in searchResults"
                :key="itemAttribute.id"
                class="mt-list-item margin-top-15"
                :class="{'animated' : animatedId === itemAttribute.id}"
              >
                <div class="margin-bottom-15 actions-on-top">
                  <el-tooltip
                    v-if="$root.permissions['menu_manager attributes update']"
                    content="Edit"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openEditModal(itemAttribute)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['menu_manager attributes read'] && !$root.permissions['menu_manager attributes update']"
                    content="View"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openEditModal(itemAttribute)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['menu_manager attributes assign item']"
                    content="Apply to Items"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openAssignItemsModal(itemAttribute)"
                    >
                      <i class="icon-layers" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['menu_manager attributes assign user_attribute']"
                    content="Apply to User Attributes"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openAssignUserAttributesModal(itemAttribute)"
                    >
                      <i class="fa fa-lg fa-user" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['menu_manager attributes delete']"
                    content="Delete"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openDeleteModal(itemAttribute)"
                    >
                      <i class="fa fa-lg fa-trash" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ itemAttribute.name }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div
          v-show="searchResults.length && numPages > 1"
          class="clearfix margin-top-20"
        >
          <pagination
            :passed-page="activePage"
            :num-pages="numPages"
            @activePageChange="activePageUpdate"
          />
        </div>
        <no-results
          :show="!searchResults.length && !loadingItemAttributes"
          :type="'Item Attributes'"
        />
      </div>
    </div>
    <!-- LIST END -->

    <!-- EDIT START -->
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
          Edit Item Attribute
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="updateErrorMessage"
          ref="updateErrorMessage"
          class="row"
        >
          <div class="col-md-6">
            <div class="alert alert-danger">
              <button
                class="close"
                @click.prevent="clearError('updateErrorMessage')"
              />
              <span>{{ updateErrorMessage }}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_2"
                v-model="itemAttributeToEdit.name"
                :disabled="!$root.permissions['menu_manager attributes update']"
                type="text"
                class="form-control input-sm"
                :class="{'edited': itemAttributeToEdit.name.length}"
              >
              <label for="form_control_2">
                Item Attribute Name
              </label>
            </div>
          </div>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <div class="row">
          <div class="col-md-12">
            <button
              v-if="!$root.permissions['menu_manager attributes update']"
              type="button"
              class="btn blue pull-right"
              @click="closeEditModal()"
            >
              Close
            </button>
            <button
              v-else
              type="button"
              class="btn blue pull-right"
              @click="updateItemAttribute()"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </modal>
    <!-- EDIT END -->

    <!-- ASSIGN ITEMS START -->
    <menu-tree
      v-if="showAssignItemsModal"
      ref="menuTree"
      update-type="attribute"
      :header-text="itemAttributeToAssignItemsTo.name"
      :show-corporate-menus="true"
      :selected-object="itemAttributeToAssignItemsTo"
      :selected-s-k-us="itemsOfItemAttribute"
      :error-message="assignItemsErrorMessage"
      @clearError="clearError('assignItemsErrorMessage')"
      @selectedItems="assignItemsToItemAttribute"
      @closeMenuTreeModal="closeAssignItemsModal"
    />
    <!-- ASSIGN ITEMS END -->

    <!-- ASSIGN USER ATTRIBUTES START -->
    <modal
      ref="assignModal"
      :show="showAssignUserAttributesModal"
      effect="fade"
      @closeOnEscape="closeAssignUserAttributesModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeAssignUserAttributesModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Apply
          <i>{{ itemAttributeToAssignUserAttributesTo.name }}</i> to Multiple User Attributes
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="assignUserAttributesErrorMessage"
          ref="assignUserAttributesErrorMessage"
          class="row"
        >
          <div class="col-md-12">
            <div class="alert alert-danger">
              <button
                class="close"
                @click.prevent="clearError('assignUserAttributesErrorMessage')"
              />
              <span>{{ assignUserAttributesErrorMessage }}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="table">
              <thead>
                <tr>
                  <th class="table-column--checkboxes">
                    <div
                      class="md-checkbox has-success"
                      @change="selectAll()"
                    >
                      <input
                        id="locations-promocodes"
                        v-model="selectAllSelected"
                        type="checkbox"
                        class="md-check"
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
                  v-for="userAttribute in userAttributes"
                  :key="userAttribute.id"
                >
                  <td class="table-column--names">
                    <div class="md-checkbox has-success">
                      <input
                        :id="`ua-${userAttribute.id}`"
                        v-model="userAttribute.selected"
                        type="checkbox"
                        class="md-check"
                        @change="syncSelectAll(userAttribute.selected)"
                      >
                      <label :for="`ua-${userAttribute.id}`">
                        <span class="inc" />
                        <span class="check" />
                        <span class="box" />
                      </label>
                    </div>
                  </td>
                  <td> {{ userAttribute.name }} </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <div class="row">
          <div class="col-md-12">
            <button
              type="button"
              class="btn blue pull-right"
              @click="assignUserAttributesToItemAttributes()"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </modal>
    <!-- ASSIGN USER ATTRIBUTES END -->

    <!-- DELETE START -->
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
        <div
          v-show="deleteErrorMessage"
          ref="deleteErrorMessage"
          class="row"
        >
          <div class="col-md-12">
            <div class="alert alert-danger">
              <button
                class="close"
                @click.prevent="clearError('deleteErrorMessage')"
              />
              <span>{{ deleteErrorMessage }}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            Are you sure you want to delete
            <i>{{ itemAttributeToDelete.name }}</i>?
          </div>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <div class="row">
          <div class="col-md-12">
            <button
              type="button"
              class="btn blue pull-right"
              @click="deleteItemAttribute()"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </modal>
    <!-- DELETE END -->
  </div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import Modal from '../../modules/Modal'
import NoResults from '../../modules/NoResults'
import MenuTree from '../../modules/MenuTree'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import ItemAttributesFunctions from '../../../controllers/ItemAttributes'
import UserAttributesFunctions from '../../../controllers/UserAttributes'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Breadcrumb,
    NoResults,
    Modal,
    MenuTree,
    Pagination,
    PageResults
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Menu Manager', link: false },
        { name: 'Item Attributes', link: false }
      ],
      loadingItemAttributes: false,
      listErrorMessage: '',
      createErrorMessage: '',
      updateErrorMessage: '',
      deleteErrorMessage: '',
      searchErrorMessage: '',
      assignUserAttributesErrorMessage: '',
      assignItemsErrorMessage: '',
      expandCreateForm: false,
      expandSearchPanel: false,
      animatedId: null,
      showDeleteModal: false,
      showEditModal: false,
      showAssignUserAttributesModal: false,
      showAssignItemsModal: false,
      newItemAttribute: {
        name: ''
      },
      itemAttributes: [],
      sortBy: {
        order: 'ASC'
      },
      activePage: 1,
      resultsPerPage: 25,
      searchTerm: '',
      currentSearchPage: 1,
      itemsPerSearchPage: 25,
      itemAttributeToEdit: {
        id: null,
        name: ''
      },
      itemAttributeToDelete: {
        id: null
      },
      itemsOfItemAttribute: [],
      itemAttributeToAssignItemsTo: {
        id: null,
        name: ''
      },
      userAttributes: [],
      selectAllSelected: false,
      userAttributesOfItemAttribute: [],
      itemAttributeToAssignUserAttributesTo: {}
    }
  },
  computed: {
    searchResults () {
      if (this.searchTerm.length > 2) {
        let filtered = this.searchItemAttributes()
        this.numPages = Math.ceil(filtered.length / this.resultsPerPage)
        return this.sortItemAttributes(filtered).slice(
          this.resultsPerPage * (this.activePage - 1),
          this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage
        )
      } else {
        this.numPages = Math.ceil(
          this.itemAttributes.length / this.resultsPerPage
        )
        return this.sortItemAttributes(this.itemAttributes).slice(
          this.resultsPerPage * (this.activePage - 1),
          this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage
        )
      }
    }
  },
  mounted () {
    this.listItemAttributes()
  },
  methods: {
    /**
		 * To open or close the create form
		 * @function
		 * @returns {undefined}
		 */
    toggleCreatePanel () {
      this.expandCreateForm = !this.expandCreateForm
    },
    /**
		 * To clear an error
		 * @function
		 * @param {string} name - The variable name of the error to clear
		 * @returns {undefined}
		 */
    clearError (name) {
      this[name] = ''
    },
    /**
		 * To validate data in the create form
		 * @function
		 * @returns {undefined}
		 */
    validateNewItemAttribute () {
      this.clearError('createErrorMessage')
      const attributesVue = this
      return new Promise(function (resolve, reject) {
        if (!attributesVue.newItemAttribute.name.length) {
          reject('Name cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To make the API call to the create endpoint
		 * @function
		 * @returns {undefined}
		 */
    createItemAttribute () {
      const attributesVue = this

      return this.validateNewItemAttribute()
        .then(response => {
          attributesVue.clearError('createErrorMessage')
          return ItemAttributesFunctions.createItemAttribute(
            attributesVue.$root.appId,
            attributesVue.$root.appSecret,
            attributesVue.$root.userToken,
            attributesVue.newItemAttribute
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                attributesVue.confirmCreated(response.payload)
              } else {
                attributesVue.createErrorMessage =
									response.message || 'Something went wrong ...'
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not create the attribute',
                errorName: 'createErrorMessage',
                vue: attributesVue
              })
            })
        })
        .catch(reason => {
          // Catch validation error
          attributesVue.createErrorMessage = reason
          window.scrollTo(0, 0)
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    confirmCreated (payload = {}) {
      let title = 'Success'
      let text = 'The Item Attribute has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Item Attribute has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      }).then(() => {
        this.itemAttributes.push(payload)
        if (!payload.pending_approval) {
          this.animatedId = payload.id
          window.setTimeout(() => {
            this.animatedId = null
          }, 3000)
        }
        this.resetNewItemAttribute()
      })
    },
    /**
		 * To reset the create form
		 * @function
		 * @returns {undefined}
		 */
    resetNewItemAttribute () {
      this.newItemAttribute = {
        name: ''
      }
    },
    /**
		 * To open or close the search form
		 * @function
		 * @returns {undefined}
		 */
    toggleSearchPanel () {
      this.expandSearchPanel = !this.expandSearchPanel
    },
    /**
		 * To reset the search form
		 * @function
		 * @returns {undefined}
		 */
    resetSearch () {
      this.searchTerm = ''
    },
    /**
		 * To get a list of existing Item Attributes
		 * @function
		 * @returns {undefined}
		 */
    listItemAttributes () {
      this.loadingItemAttributes = true
      const attributesVue = this

      return ItemAttributesFunctions.listItemAttributes(
        attributesVue.$root.appId,
        attributesVue.$root.appSecret,
        attributesVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            attributesVue.itemAttributes = response.payload
            attributesVue.loadingItemAttributes = false
          } else {
            attributesVue.loadingItemAttributes = false
          }
        })
        .catch(reason => {
          attributesVue.loadingItemAttributes = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch attributes',
            errorName: 'listErrorMessage',
            vue: attributesVue
          })
        })
    },
    /**
		 * To filter the display list
		 * @function
		 * @returns {array} An array of Item Attributes
		 */
    searchItemAttributes () {
      return this.itemAttributes.filter(itemAttribute => {
        return itemAttribute.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      })
    },
    /**
		 * To sort the display list
		 * @function
		 * @param {array} attributes - The list to sort
		 * @returns {array} An array of Item Attributes
		 */
    sortItemAttributes (attributes) {
      const asc = function (a, b) {
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
      const desc = function (a, b) {
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

      return this.sortBy.order === 'ASC'
        ? attributes.sort(asc)
        : attributes.sort(desc)
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
        window.scrollTo(0, 0)
      }
    },
    /**
		 * To open the edit modal
		 * @function
		 * @param {object} itemAttribute - The Item Attribute to edit
		 * @returns {undefined}
		 */
    openEditModal (itemAttribute) {
      this.itemAttributeToEdit.id = itemAttribute.id
      this.itemAttributeToEdit.name = itemAttribute.name
      this.showEditModal = true
    },
    /**
		 * To open the edit modal
		 * @function
		 * @param {string} itemAttribute - The Item Attribute to edit
		 * @returns {undefined}
		 */
    validateItemAttributeToEdit () {
      this.clearError('updateErrorMessage')
      const attributesVue = this
      return new Promise(function (resolve, reject) {
        if (!attributesVue.itemAttributeToEdit.name.length) {
          reject('Name cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To make the API call to the update endpoint
		 * @function
		 * @returns {undefined}
		 */
    updateItemAttribute () {
      const attributesVue = this

      return this.validateItemAttributeToEdit()
        .then(response => {
          attributesVue.clearError('updateErrorMessage')
          return ItemAttributesFunctions.updateItemAttribute(
            attributesVue.$root.appId,
            attributesVue.$root.appSecret,
            attributesVue.$root.userToken,
            attributesVue.itemAttributeToEdit
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                let edited = attributesVue.itemAttributes.findIndex(
                  itemAttribute => {
                    return (
                      itemAttribute.id === attributesVue.itemAttributeToEdit.id
                    )
                  }
                )
                attributesVue.itemAttributes[edited].name =
									attributesVue.itemAttributeToEdit.name
                attributesVue.closeEditModal()
                attributesVue.confirmUpdated(response.payload)
              } else {
                attributesVue.updateErrorMessage =
									response.message || 'Something went wrong ...'
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the attribute',
                errorName: 'updateErrorMessage',
                vue: attributesVue,
                containerRef: 'editModal'
              })
            })
        })
        .catch(reason => {
          // Catch validation error
          attributesVue.createErrorMessage = reason
          window.scrollTo(0, 0)
        })
    },
    /**
		 * To close the edit modal
		 * @function
		 * @param {string} itemAttribute - The Item Attribute to edit
		 * @returns {undefined}
		 */
    closeEditModal () {
      this.clearError('updateErrorMessage')
      this.showEditModal = false
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    confirmUpdated (payload = {}) {
      let title = 'Success'
      let text = 'The Item Attribute has been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Item Attribute has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      }).then(() => {
        if (!payload.pending_approval) {
          this.animatedId = this.itemAttributeToEdit.id
          window.setTimeout(() => {
            this.animatedId = null
          }, 3000)
        }
        this.resetItemAttributeToEdit()
      })
    },
    /**
		 * To reset edit
		 * @function
		 * @returns {undefined}
		 */
    resetItemAttributeToEdit () {
      this.itemAttributeToEdit = {
        id: null,
        name: ''
      }
    },
    /**
		 * To open the assign Items modal
		 * @function
		 * @param {object} itemAttribute - The Item Attribute to assign to
		 * @returns {undefined}
		 */
    openAssignItemsModal (itemAttribute) {
      this.itemAttributeToAssignItemsTo.id = itemAttribute.id
      this.itemAttributeToAssignItemsTo.name = itemAttribute.name
      this.listItemsOfItemAttribute()
    },
    /**
		 * To get a list of Items assigned to an Item Attribute
		 * @function
		 * @returns {undefined}
		 */
    listItemsOfItemAttribute () {
      const attributesVue = this
      return ItemAttributesFunctions.listItemsOfItemAttribute(
        attributesVue.$root.appId,
        attributesVue.$root.appSecret,
        attributesVue.$root.userToken,
        attributesVue.itemAttributeToAssignItemsTo.id
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            attributesVue.itemsOfItemAttribute = response.payload.map(item => {
              return item.sku
            })
            attributesVue.showAssignItemsModal = true
          } else {
            attributesVue.assignItemsErrorMessage = 'Something went wrong ...'
            attributesVue.showAssignItemsModal = true
          }
        })
        .catch(reason => {
          attributesVue.showAssignItemsModal = true
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch attribute info',
            errorName: 'assignItemsErrorMessage',
            vue: attributesVue,
            containerRef: 'menuTree'
          })
        })
    },
    /**
		 * To assign Items to an Item Attribute
		 * @function
		 * @param {object} items - Items to add and remove
		 * @returns {undefined}
		 */
    assignItemsToItemAttribute (items) {
      let payload = {
        items_to_add: items.selectedItems,
        items_to_remove: items.unselectedItems
      }
      const attributesVue = this
      return ItemAttributesFunctions.assignItemsToItemAttribute(
        attributesVue.$root.appId,
        attributesVue.$root.appSecret,
        attributesVue.$root.userToken,
        attributesVue.itemAttributeToAssignItemsTo.id,
        payload
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            attributesVue.closeAssignItemsModal()
            attributesVue.confirmAssignItems(response.payload)
          } else {
            window.scrollTo(0, 0)
            attributesVue.assignItemsErrorMessage = 'Something went wrong ...'
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not assign the items',
            errorName: 'assignItemsErrorMessage',
            vue: attributesVue,
            containerRef: 'menuTree'
          })
        })
    },
    /**
		 * To close the assign Items modal
		 * @function
		 * @returns {undefined}
		 */
    closeAssignItemsModal () {
      this.clearError('assignItemsErrorMessage')
      this.showAssignItemsModal = false
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    confirmAssignItems (payload = {}) {
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'The Items have been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Items have been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      }).then(() => {
        if (!payload.pending_approval) {
          this.animatedId = this.itemAttributeToAssignItemsTo.id
          window.setTimeout(() => {
            this.animatedId = null
          }, 3000)
        }
        this.resetAssignItems()
      })
    },
    /**
		 * To reset asssign Items
		 * @function
		 * @returns {undefined}
		 */
    resetAssignItems () {
      this.itemAttributeToAssignItemsTo = {
        id: null,
        name: ''
      }
      this.itemsOfItemAttribute = []
    },
    /**
		 * To open the assign User Attributes modal
		 * @function
		 * @param {object} itemAttribute - The Item Attribute to assign to
		 * @returns {undefined}
		 */
    openAssignUserAttributesModal (itemAttribute) {
      this.itemAttributeToAssignUserAttributesTo.id = itemAttribute.id
      this.itemAttributeToAssignUserAttributesTo.name = itemAttribute.name
      this.listUserAttributes()
    },
    /**
		 * To get a list of existing User Attributes
		 * @function
		 * @returns {undefined}
		 */
    listUserAttributes () {
      const attributesVue = this

      return UserAttributesFunctions.listUserAttributes(
        attributesVue.$root.appId,
        attributesVue.$root.appSecret,
        attributesVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            attributesVue.userAttributes = response.payload.map(
              userAttribute => {
                userAttribute.selected = false
                return userAttribute
              }
            )
            attributesVue.listUserAttributesofItemAttribute()
          } else {
            attributesVue.assignUserAttributesErrorMessage =
							'Something went wrong ...'
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch attribute info',
            errorName: 'assignUserAttributesErrorMessage',
            vue: attributesVue,
            containerRef: 'assignModal'
          })
        })
    },
    /**
		 * To get a list of User Attributes assigned to an Item Attribute
		 * @function
		 * @returns {undefined}
		 */
    listUserAttributesofItemAttribute () {
      const attributesVue = this
      return ItemAttributesFunctions.listUserAttributesofItemAttribute(
        attributesVue.$root.appId,
        attributesVue.$root.appSecret,
        attributesVue.$root.userToken,
        attributesVue.itemAttributeToAssignUserAttributesTo.id
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            for (let r = 0; r < attributesVue.userAttributes.length; r++) {
              if (response.payload.attributes_userattributes.length) {
                for (
                  let s = 0;
                  s < response.payload.attributes_userattributes.length;
                  s++
                ) {
                  let userAttribute = attributesVue.userAttributes[r]
                  if (
                    userAttribute.id ===
										response.payload.attributes_userattributes[s].id
                  ) {
                    userAttribute.selected = true
                    break
                  } else {
                    userAttribute.selected = false
                  }
                }
              }
            }
            let notAll = attributesVue.userAttributes.some(userAttribute => {
              return userAttribute.selected === false
            })
            notAll
              ? (attributesVue.selectAllSelected = false)
              : (attributesVue.selectAllSelected = true)
            attributesVue.showAssignUserAttributesModal = true
          } else {
            attributesVue.assignUserAttributesErrorMessage =
							'Something went wrong ...'
            attributesVue.showAssignUserAttributesModal = true
          }
        })
        .catch(reason => {
          attributesVue.showAssignUserAttributesModal = true
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch attribute info',
            errorName: 'assignUserAttributesErrorMessage',
            vue: attributesVue,
            containerRef: 'assignModal'
          })
        })
    },
    /**
		 * To select all or deselect all
		 * @function
		 * @returns {undefined}
		 */
    selectAll () {
      for (var i = 0; i < this.userAttributes.length; i++) {
        this.userAttributes[i].selected = this.selectAllSelected
      }
    },
    /**
		 * To sync Select All checkbox
		 * @function
		 * @param {boolean} value - The value of the checkbox
		 * @returns {undefined}
		 */
    syncSelectAll (value) {
      if (!value) {
        this.selectAllSelected = false
      } else {
        this.selectAllSelected = this.userAttributes.every(userAttribute => {
          return userAttribute.selected === true
        })
      }
    },
    /**
		 * To assign User Attributes to an Item Attribute
		 * @function
		 * @returns {undefined}
		 */
    assignUserAttributesToItemAttributes () {
      let payload = {
        attribute: []
      }
      this.userAttributes.forEach(userAttribute => {
        if (userAttribute.selected) {
          payload.attribute.push({
            id: userAttribute.id,
            created_by: userAttribute.created_by
          })
        }
      })
      const attributesVue = this
      return ItemAttributesFunctions.assignUserAttributesToItemAttributes(
        attributesVue.$root.appId,
        attributesVue.$root.appSecret,
        attributesVue.$root.userToken,
        attributesVue.itemAttributeToAssignUserAttributesTo.id,
        payload
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            attributesVue.closeAssignUserAttributesModal()
            attributesVue.confirmAssignUserAttributes(response.payload)
          } else {
            window.scrollTo(0, 0)
            attributesVue.assignUserAttributesErrorMessage =
							'Something went wrong ...'
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch attribute info',
            errorName: 'assignUserAttributesErrorMessage',
            vue: attributesVue,
            containerRef: 'assignModal'
          })
        })
    },
    /**
		 * To close the assign User Attributes modal
		 * @function
		 * @returns {undefined}
		 */
    closeAssignUserAttributesModal () {
      this.clearError('assignUserAttributesErrorMessage')
      this.showAssignUserAttributesModal = false
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    confirmAssignUserAttributes (payload = {}) {
      let title = 'Success'
      let text = 'The User Attributes have been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The User Attributes have been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      }).then(() => {
        if (!payload.pending_approval) {
          this.animatedId = this.itemAttributeToAssignUserAttributesTo.id
          window.setTimeout(() => {
            this.animatedId = null
          }, 3000)
        }
        this.resetAssignUserAttributes()
      })
    },
    /**
		 * To reset assign User Attributes
		 * @function
		 * @returns {undefined}
		 */
    resetAssignUserAttributes () {
      this.itemAttributeToAssignUserAttributesTo = {
        id: null,
        name: ''
      }
      this.userAttributesOfItemAttribute = []
    },
    /**
		 * To open the delete modal
		 * @function
		 * @param {object} itemAttribute - The Item Attribute to delete
		 * @returns {undefined}
		 */
    openDeleteModal (itemAttribute) {
      this.itemAttributeToDelete.id = itemAttribute.id
      this.itemAttributeToDelete.name = itemAttribute.name
      this.showDeleteModal = true
    },
    /**
		 * To make the API call to the delete endpoint
		 * @function
		 * @returns {undefined}
		 */
    deleteItemAttribute () {
      const attributesVue = this

      return ItemAttributesFunctions.deleteItemAttribute(
        attributesVue.$root.appId,
        attributesVue.$root.appSecret,
        attributesVue.$root.userToken,
        attributesVue.itemAttributeToDelete
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            attributesVue.itemAttributes = attributesVue.itemAttributes.filter(
              itemAttribute => {
                return (
                  itemAttribute.id !== attributesVue.itemAttributeToDelete.id
                )
              }
            )
            attributesVue.closeDeleteModal()
            attributesVue.confirmDelete(response.payload)
          } else {
            attributesVue.deleteErrorMessage =
							response.message || 'Something went wrong ...'
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the attribute',
            errorName: 'deleteErrorMessage',
            vue: attributesVue,
            containerRef: 'deleteModal'
          })
        })
    },
    /**
		 * To close the delete modal
		 * @function
		 * @returns {undefined}
		 */
    closeDeleteModal () {
      this.clearError('deleteErrorMessage')
      this.showDeleteModal = false
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    confirmDelete (payload = {}) {
      let title = 'Success'
      let text = 'The Item Attribute has been deleted'
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
      }).then(() => {
        this.itemAttributeToDelete.id = null
        this.itemAttributeToDelete.name = ''
      })
    }
  }
}
</script>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 100px;
  font-size: 400%;
}
.actions-on-top {
  margin-top: -5px;
}
.mt-list-container.list-news.ext-1.no-border ul > .mt-list-item:hover {
  background-color: white;
}
.animated {
  animation: listItemHighlight 1s 2 ease-in-out both;
}
.table-column--checkboxes {
  width: 50px;
}
</style>

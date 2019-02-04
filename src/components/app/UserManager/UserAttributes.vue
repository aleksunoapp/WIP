<template>
  <div>
    <!-- PAGE BAR START -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- PAGE BAR END -->

    <!-- HEADER SART -->
    <h1 class="page-title">
      User Attributes
    </h1>
    <div class="note note-info">
      <p>Create, view, edit and delete User Attributes. View or edit what Item Attributes the User Attribute is associated with.</p>
    </div>
    <!-- HEADER END -->

    <!-- CREATE START -->
    <div
      v-if="$root.permissions['user_manager attributes create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-plus-circle" />
          Create A New User Attribute
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
          @submit="createUserAttribute()"
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
                  v-model="newUserAttribute.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newUserAttribute.name.length}"
                  @keyup.enter.stop="createUserAttribute()"
                >
                <label for="form_control_2">
                  User Attribute Name
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
    <!-- CREATE END -->

    <!-- SEARCH START -->
    <div
      v-show="userAttributes.length"
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
                  v-show="searchErrorMessage"
                  ref="searchErrorMessage"
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
            User Attributes
          </span>
          <div class="caption-desc font-grey-cascade">
            <span v-show="searchTerm.length < 3">
              All User Attributes
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
            :total-results="userAttributes.length"
            :active-page="activePage"
            @pageResults="pageResultsUpdate"
          />
        </div>
        <div
          v-show="!searchResults.length && loadingUserAttributes"
          class="spinner"
        >
          <div>
            <i class="fa fa-spinner fa-spin" />
          </div>
        </div>
        <div
          class="mt-element-list margin-top-15"
          :show="searchResults.length && !loadingUserAttributes"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="userAttribute in searchResults"
                :key="userAttribute.id"
                class="mt-list-item margin-top-15"
                :class="{'animated' : animatedId === userAttribute.id}"
              >
                <div class="margin-bottom-15 actions-on-top">
                  <el-tooltip
                    v-if="$root.permissions['user_manager attributes update']"
                    content="Edit"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openEditModal(userAttribute)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['user_manager attributes read'] && !$root.permissions['user_manager attributes update']"
                    content="View"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openEditModal(userAttribute)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['user_manager attributes update']"
                    content="Apply to Item Attributes"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openAssignItemAttributesModal(userAttribute)"
                    >
                      <i class="icon-layers" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['user_manager attributes delete']"
                    content="Delete"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openDeleteModal(userAttribute)"
                    >
                      <i class="fa fa-lg fa-trash" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ userAttribute.name }}</span>
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
          :show="!searchResults.length && !loadingUserAttributes"
          :type="'User Attributes'"
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
          Edit User Attribute
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
                v-model="userAttributeToEdit.name"
                :disabled="!$root.permissions['user_manager attributes update']"
                type="text"
                class="form-control input-sm"
                :class="{'edited': userAttributeToEdit.name.length}"
              >
              <label for="form_control_2">
                User Attribute Name
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
              v-if="!$root.permissions['user_manager attributes update']"
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
              :disabled="updating"
              @click="updateUserAttribute()"
            >
              Save
              <i
                v-show="updating"
                class="fa fa-spinner fa-pulse fa-fw"
              />
            </button>
          </div>
        </div>
      </div>
    </modal>
    <!-- EDIT END -->

    <!-- ASSIGN ITEM ATTRIBUTES START -->
    <modal
      ref="assignItemsModal"
      :show="showAssignItemAttributesModal"
      effect="fade"
      @closeOnEscape="closeAssignItemAttributesModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeAssignItemAttributesModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Apply
          <i>{{ userAttributeToAssignItemAttributesTo.name }}</i> to Multiple Item Attributes
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="assignItemAttributesErrorMessage"
          ref="assignItemAttributesErrorMessage"
          class="row"
        >
          <div class="col-md-12">
            <div class="alert alert-danger">
              <button
                class="close"
                @click.prevent="clearError('assignItemAttributesErrorMessage')"
              />
              <span>{{ assignItemAttributesErrorMessage }}</span>
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
                  v-for="itemAttribute in itemAttributes"
                  :key="itemAttribute.id"
                >
                  <td class="table-column--names">
                    <div class="md-checkbox has-success">
                      <input
                        :id="`ia-${itemAttribute.id}`"
                        v-model="itemAttribute.selected"
                        type="checkbox"
                        class="md-check"
                        @change="syncSelectAll(itemAttribute.selected)"
                      >
                      <label :for="`ia-${itemAttribute.id}`">
                        <span class="inc" />
                        <span class="check" />
                        <span class="box" />
                      </label>
                    </div>
                  </td>
                  <td> {{ itemAttribute.name }} </td>
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
              :disabled="assigning"
              @click="assignItemAttributesToUserAttributes()"
            >
              Save
              <i
                v-show="assigning"
                class="fa fa-spinner fa-pulse fa-fw"
              />
            </button>
          </div>
        </div>
      </div>
    </modal>
    <!-- ASSIGN ITEM ATTRIBUTES END -->

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
        <div class="row">
          <div class="col-md-12">
            Are you sure you want to delete
            <i>{{ userAttributeToDelete.name }}</i>?
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
              :disabled="deleting"
              @click="deleteUserAttribute()"
            >
              Delete
              <i
                v-show="deleting"
                class="fa fa-spinner fa-pulse fa-fw"
              />
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
		Pagination,
		PageResults
	},
	data () {
		return {
			breadcrumbArray: [
				{ name: 'User Manager', link: false },
				{ name: 'User Attributes', link: false }
			],
			loadingUserAttributes: false,
			creating: false,
			updating: false,
			assigning: false,
			deleting: false,
			createErrorMessage: '',
			listErrorMessage: '',
			updateErrorMessage: '',
			deleteErrorMessage: '',
			searchErrorMessage: '',
			assignItemAttributesErrorMessage: '',
			expandCreateForm: false,
			expandSearchPanel: false,
			animatedId: null,
			showDeleteModal: false,
			showEditModal: false,
			showAssignItemAttributesModal: false,
			newUserAttribute: {
				name: ''
			},
			userAttributes: [],
			sortBy: {
				order: 'ASC'
			},
			activePage: 1,
			resultsPerPage: 25,
			numPages: 1,
			searchTerm: '',
			currentSearchPage: 1,
			itemsPerSearchPage: 25,
			userAttributeToEdit: {
				id: null,
				name: ''
			},
			userAttributeToDelete: {
				id: null
			},
			itemAttributes: [],
			selectAllSelected: false,
			itemAttributesOfUserAttribute: [],
			userAttributeToAssignItemAttributesTo: {}
		}
	},
	computed: {
		searchResults () {
			if (this.searchTerm.length > 2) {
				let filtered = this.searchUserAttributes()
				this.numPages = Math.ceil(filtered.length / this.resultsPerPage)
				return this.sortUserAttributes(filtered).slice(
					this.resultsPerPage * (this.activePage - 1),
					this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage
				)
			} else {
				this.numPages = Math.ceil(
					this.userAttributes.length / this.resultsPerPage
				)
				return this.sortUserAttributes(this.userAttributes).slice(
					this.resultsPerPage * (this.activePage - 1),
					this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage
				)
			}
		}
	},
	mounted () {
		this.listUserAttributes()
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
		validateNewUserAttribute () {
			this.clearError('createErrorMessage')
			const attributesVue = this
			return new Promise(function (resolve, reject) {
				if (!attributesVue.newUserAttribute.name.length) {
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
		createUserAttribute () {
			const attributesVue = this

			return this.validateNewUserAttribute()
				.then(response => {
					attributesVue.creating = true
					attributesVue.clearError('createErrorMessage')
					return UserAttributesFunctions.createUserAttribute(
						attributesVue.$root.appId,
						attributesVue.$root.appSecret,
						attributesVue.$root.userToken,
						attributesVue.newUserAttribute
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
								errorText: 'We could not delete the modifier',
								errorName: 'createErrorMessage',
								vue: attributesVue
							})
						})
						.finally(() => {
							attributesVue.creating = false
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
			let text = 'The User Attribute has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The User Attribute has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			}).then(() => {
				this.userAttributes.push(payload)
				if (!payload.pending_approval) {
					this.animatedId = payload.id
					window.setTimeout(() => {
						this.animatedId = null
					}, 3000)
				}
				this.resetNewUserAttribute()
			})
		},
		/**
		 * To reset the create form
		 * @function
		 * @returns {undefined}
		 */
		resetNewUserAttribute () {
			this.newUserAttribute = {
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
		 * To get a list of existing User Attributes
		 * @function
		 * @returns {undefined}
		 */
		listUserAttributes () {
			this.loadingUserAttributes = true
			const attributesVue = this

			return UserAttributesFunctions.listUserAttributes(
				attributesVue.$root.appId,
				attributesVue.$root.appSecret,
				attributesVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						attributesVue.userAttributes = response.payload
						attributesVue.loadingUserAttributes = false
					} else {
						attributesVue.loadingUserAttributes = false
					}
				})
				.catch(reason => {
					attributesVue.loadingUserAttributes = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch user attributes',
						errorName: 'listErrorMessage',
						vue: attributesVue
					})
				})
		},
		/**
		 * To filter the display list
		 * @function
		 * @returns {array} An array of User Attributes
		 */
		searchUserAttributes () {
			return this.userAttributes.filter(userAttribute => {
				return userAttribute.name
					.toLowerCase()
					.includes(this.searchTerm.toLowerCase())
			})
		},
		/**
		 * To sort the display list
		 * @function
		 * @param {array} attributes - The list to sort
		 * @returns {array} An array of User Attributes
		 */
		sortUserAttributes (attributes) {
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
		 * @param {object} userAttribute - The User Attribute to edit
		 * @returns {undefined}
		 */
		openEditModal (userAttribute) {
			this.userAttributeToEdit.id = userAttribute.id
			this.userAttributeToEdit.name = userAttribute.name
			this.showEditModal = true
		},
		/**
		 * To open the edit modal
		 * @function
		 * @param {string} userAttribute - The User Attribute to edit
		 * @returns {undefined}
		 */
		validateUserAttributeToEdit () {
			this.clearError('updateErrorMessage')
			const attributesVue = this
			return new Promise(function (resolve, reject) {
				if (!attributesVue.userAttributeToEdit.name.length) {
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
		updateUserAttribute () {
			const attributesVue = this

			return this.validateUserAttributeToEdit()
				.then(response => {
					attributesVue.updating = true
					attributesVue.clearError('updateErrorMessage')
					return UserAttributesFunctions.updateUserAttribute(
						attributesVue.$root.appId,
						attributesVue.$root.appSecret,
						attributesVue.$root.userToken,
						attributesVue.userAttributeToEdit
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								let edited = attributesVue.userAttributes.findIndex(
									userAttribute => {
										return (
											userAttribute.id === attributesVue.userAttributeToEdit.id
										)
									}
								)
								attributesVue.userAttributes[edited].name =
									attributesVue.userAttributeToEdit.name
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
						.finally(() => {
							attributesVue.updating = false
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
		 * @param {string} userAttribute - The User Attribute to edit
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
			let text = 'The User Attribute has been saved'
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
			}).then(() => {
				if (!payload.pending_approval) {
					this.animatedId = this.userAttributeToEdit.id
					window.setTimeout(() => {
						this.animatedId = null
					}, 3000)
				}
				this.resetUserAttributeToEdit()
			})
		},
		/**
		 * To reset edit
		 * @function
		 * @returns {undefined}
		 */
		resetUserAttributeToEdit () {
			this.userAttributeToEdit = {
				id: null,
				name: ''
			}
		},
		/**
		 * To open the assign Item Attributes modal
		 * @function
		 * @param {object} userAttribute - The User Attribute to assign to
		 * @returns {undefined}
		 */
		openAssignItemAttributesModal (userAttribute) {
			this.userAttributeToAssignItemAttributesTo.id = userAttribute.id
			this.userAttributeToAssignItemAttributesTo.name = userAttribute.name
			this.listItemAttributes()
		},
		/**
		 * To get a list of existing Item Attributes
		 * @function
		 * @returns {undefined}
		 */
		listItemAttributes () {
			const attributesVue = this

			return ItemAttributesFunctions.listItemAttributes(
				attributesVue.$root.appId,
				attributesVue.$root.appSecret,
				attributesVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						attributesVue.itemAttributes = response.payload.map(
							itemAttribute => {
								itemAttribute.selected = false
								return itemAttribute
							}
						)
						attributesVue.listItemAttributesofUserAttribute()
					} else {
						attributesVue.assignItemAttributesErrorMessage =
							'Something went wrong ...'
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch attribute info',
						errorName: 'assignItemAttributesErrorMessage',
						vue: attributesVue,
						containerRef: 'assignItemsModal'
					})
				})
		},
		/**
		 * To get a list of Item Attributes assigned to a User Attribute
		 * @function
		 * @returns {undefined}
		 */
		listItemAttributesofUserAttribute () {
			const attributesVue = this
			return UserAttributesFunctions.listItemAttributesofUserAttribute(
				attributesVue.$root.appId,
				attributesVue.$root.appSecret,
				attributesVue.$root.userToken,
				attributesVue.userAttributeToAssignItemAttributesTo.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						for (let r = 0; r < attributesVue.itemAttributes.length; r++) {
							if (response.payload.attributes_userattributes.length) {
								for (
									let s = 0;
									s < response.payload.attributes_userattributes.length;
									s++
								) {
									let itemAttribute = attributesVue.itemAttributes[r]
									if (
										itemAttribute.id ===
										response.payload.attributes_userattributes[s].id
									) {
										itemAttribute.selected = true
										break
									} else {
										itemAttribute.selected = false
									}
								}
							}
						}
						let notAll = attributesVue.itemAttributes.some(itemAttribute => {
							return itemAttribute.selected === false
						})
						notAll
							? (attributesVue.selectAllSelected = false)
							: (attributesVue.selectAllSelected = true)
						attributesVue.showAssignItemAttributesModal = true
					} else {
						attributesVue.assignItemAttributesErrorMessage =
							'Something went wrong ...'
						attributesVue.showAssignItemAttributesModal = true
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch attribute info',
						errorName: 'assignItemAttributesErrorMessage',
						vue: attributesVue,
						containerRef: 'assignItemsModal'
					})
				})
		},
		/**
		 * To select all or deselect all
		 * @function
		 * @returns {undefined}
		 */
		selectAll () {
			for (var i = 0; i < this.itemAttributes.length; i++) {
				this.itemAttributes[i].selected = this.selectAllSelected
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
				this.selectAllSelected = this.itemAttributes.every(itemAttribute => {
					return itemAttribute.selected === true
				})
			}
		},
		/**
		 * To assign Item Attributes to an User Attribute
		 * @function
		 * @returns {undefined}
		 */
		assignItemAttributesToUserAttributes () {
			this.assigning = true
			let payload = {
				attribute: []
			}
			this.itemAttributes.forEach(itemAttribute => {
				if (itemAttribute.selected) {
					payload.attribute.push({
						id: itemAttribute.id,
						created_by: itemAttribute.created_by
					})
				}
			})
			const attributesVue = this
			return UserAttributesFunctions.assignItemAttributesToUserAttributes(
				attributesVue.$root.appId,
				attributesVue.$root.appSecret,
				attributesVue.$root.userToken,
				attributesVue.userAttributeToAssignItemAttributesTo.id,
				payload
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						attributesVue.closeAssignItemAttributesModal()
						attributesVue.confirmAssignItemAttributes(response.payload)
					} else {
						window.scrollTo(0, 0)
						attributesVue.assignItemAttributesErrorMessage =
							'Something went wrong ...'
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not assign the attributes',
						errorName: 'assignItemAttributesErrorMessage',
						vue: attributesVue,
						containerRef: 'assignItemsModal'
					})
				})
				.finally(() => {
					attributesVue.assigning = false
				})
		},
		/**
		 * To close the assign Item Attributes modal
		 * @function
		 * @returns {undefined}
		 */
		closeAssignItemAttributesModal () {
			this.clearError('assignItemAttributesErrorMessage')
			this.showAssignItemAttributesModal = false
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		confirmAssignItemAttributes (payload = {}) {
			let title = 'Success'
			let text = 'The Item Attributes has been saved'
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
			}).then(() => {
				if (!payload.pending_approval) {
					this.animatedId = this.userAttributeToAssignItemAttributesTo.id
					window.setTimeout(() => {
						this.animatedId = null
					}, 3000)
				}
				this.resetAssignItemAttributes()
			})
		},
		/**
		 * To reset assign Item Attributes
		 * @function
		 * @returns {undefined}
		 */
		resetAssignItemAttributes () {
			this.userAttributeToAssignItemAttributesTo = {
				id: null,
				name: ''
			}
			this.itemAttributesOfUserAttribute = []
		},
		/**
		 * To open the delete modal
		 * @function
		 * @param {object} userAttribute - The User Attribute to delete
		 * @returns {undefined}
		 */
		openDeleteModal (userAttribute) {
			this.userAttributeToDelete.id = userAttribute.id
			this.userAttributeToDelete.name = userAttribute.name
			this.showDeleteModal = true
		},
		/**
		 * To make the API call to the delete endpoint
		 * @function
		 * @returns {undefined}
		 */
		deleteUserAttribute () {
			this.deleting = true
			const attributesVue = this

			return UserAttributesFunctions.deleteUserAttribute(
				attributesVue.$root.appId,
				attributesVue.$root.appSecret,
				attributesVue.$root.userToken,
				attributesVue.userAttributeToDelete
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						attributesVue.userAttributes = attributesVue.userAttributes.filter(
							userAttribute => {
								return (
									userAttribute.id !== attributesVue.userAttributeToDelete.id
								)
							}
						)
						attributesVue.closeDeleteModal()
						attributesVue.confirmDelete(response.payload)
					} else throw response
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
				.finally(() => {
					attributesVue.deleting = false
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
			let text = 'The User Attribute has been deleted'
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
			}).then(() => {
				this.userAttributeToDelete.id = null
				this.userAttributeToDelete.name = ''
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

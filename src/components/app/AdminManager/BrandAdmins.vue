<template>
  <div>
    <div>
      <div class="page-bar">
        <breadcrumb :crumbs="breadcrumbArray" />
      </div>
      <h1 class="page-title">
        Brand Admins
      </h1>
      <div class="note note-info">
        <p>Create and manage Brand Admin accounts.</p>
      </div>

      <!-- CREATE NEW START -->
      <div
        v-if="$root.permissions['admin brand_admins create']"
        class="portlet box blue-hoki margin-top-20"
      >
        <div
          class="portlet-title bg-blue-chambray"
          @click="toggleCreateBrandAdminPanel()"
        >
          <div class="caption">
            <i class="fa fa-plus-circle" />
            Create New Brand Admin
          </div>
          <div class="tools">
            <a :class="{'expand': !createBrandAdminCollapse, 'collapse': createBrandAdminCollapse}" />
          </div>
        </div>
        <div
          v-show="!createBrandAdminCollapse"
          class="portlet-body"
        >
          <form
            role="form"
            @submit.prevent="createBrandAdmin()"
          >
            <div class="row">
              <div class="col-md-12">
                <div
                  v-show="createErrorMessage"
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
                    id="form_control_name"
                    ref="newBrandAdminName"
                    v-model="newBrandAdmin.name"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newBrandAdmin.name.length}"
                  >
                  <label for="form_control_name">
                    Name
                  </label>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_phone"
                    v-model="newBrandAdmin.phone"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newBrandAdmin.phone.length}"
                  >
                  <label for="form_control_phone">
                    Phone
                  </label>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_email"
                    v-model="newBrandAdmin.email"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newBrandAdmin.email.length}"
                  >
                  <label for="form_control_email">
                    Email
                  </label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group form-md-line-input form-md-floating-label">
                  <div
                    v-show="passwordMasked"
                    class="input-group"
                  >
                    <input
                      id="form_control_password_masked"
                      v-model="newBrandAdmin.password"
                      type="password"
                      class="form-control input-sm"
                      :class="{'edited': newBrandAdmin.password.length}"
                    >
                    <label for="form_control_password_masked">
                      Password
                    </label>
                    <span
                      class="input-group-addon clickable"
                      @click="flipPasswordMask()"
                    >
                      <i class="fa fa-eye" />
                    </span>
                  </div>
                  <div
                    v-show="!passwordMasked"
                    class="input-group"
                  >
                    <input
                      id="form_control_password"
                      v-model="newBrandAdmin.password"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': newBrandAdmin.password.length}"
                    >
                    <label for="form_control_password">
                      Password
                    </label>
                    <span
                      class="input-group-addon clickable"
                      @click="flipPasswordMask()"
                    >
                      <i class="fa fa-eye-slash" />
                    </span>
                  </div>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <div
                    v-show="passwordConfirmMasked"
                    class="input-group"
                  >
                    <input
                      id="form_control_confirm_masked"
                      v-model="passwordCheck"
                      type="password"
                      class="form-control input-sm"
                      :class="{'edited': passwordCheck}"
                    >
                    <label for="form_control_confirm_masked">
                      Confirm password
                    </label>
                    <span
                      class="input-group-addon clickable"
                      @click="flipPasswordConfirmMask()"
                    >
                      <i class="fa fa-eye" />
                    </span>
                  </div>
                  <div
                    v-show="!passwordConfirmMasked"
                    class="input-group"
                  >
                    <input
                      id="form_control_confirm"
                      v-model="passwordCheck"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': passwordCheck}"
                    >
                    <label for="form_control_confirm">
                      Confirm password
                    </label>
                    <span
                      class="input-group-addon clickable"
                      @click="flipPasswordConfirmMask()"
                    >
                      <i class="fa fa-eye-slash" />
                    </span>
                  </div>
                </div>
                <div class="alert alert-info">
                  Password must be at least 8 characters long. It can contain English alphabet letters only. It must include at least one capital letter and one number.
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
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
        v-if="brandAdmins.length"
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
            <form
              role="form"
              @submit.prevent="advancedSearch()"
            >
              <div class="form-body row">
                <div class="col-md-12">
                  <div
                    v-show="searchError"
                    ref="searchError"
                    class="alert alert-danger"
                  >
                    <button
                      class="close"
                      @click="clearError('searchError')"
                    />
                    <span>{{ searchError }}</span>
                  </div>
                </div>
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
                    <span class="help-block persist">
                      Search by Name or Email.
                    </span>
                  </div>
                </div>
              </div>
              <div class="form-actions right margin-top-20">
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
            </form>
          </div>
        </div>
      </div>
      <!-- SEARCH END -->

      <!-- LIST START -->
      <loading-screen
        :show="loadingBrandAdminsData"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <div v-if="brandAdmins.length && !loadingBrandAdminsData && !filteredResults.length">
        <div class="portlet light portlet-fit bordered margin-top-20">
          <div class="portlet-title bg-blue-chambray">
            <div class="menu-image-main">
              <img src="../../../../public/client_logo.png">
            </div>
            <div class="caption">
              <span class="caption-subject font-default bold uppercase">
                Brand Admins
              </span>
              <div class="caption-desc font-grey-cascade">
                Click on the edit icon to edit a brand admin.
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
              v-if="brandAdmins.length"
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
                :total-results="brandAdmins.length"
                :active-page="activePage"
                @pageResults="pageResultsUpdate"
              />
            </div>
            <div class="mt-element-list">
              <div class="mt-list-container list-news">
                <ul>
                  <li
                    v-for="brandAdmin in currentActivePageItems"
                    :id="'brandAdmin-' + brandAdmin.id"
                    :key="brandAdmin.id"
                    class="mt-list-item actions-at-left margin-top-15"
                    :class="{'animated' : animated === `brandAdmin-${brandAdmin.id}`}"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="$root.permissions['admin brand_admins update']"
                        content="Edit"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editBrandAdmin(brandAdmin)"
                        >
                          <i
                            class="fa fa-pencil"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']"
                        content="View"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editBrandAdmin(brandAdmin)"
                        >
                          <i
                            class="fa fa-eye"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="canAny([
                          'list user\'s roles',
                          'assign roles to user',
                          'revoke roles from user',
                          'sync roles for user'
                        ])"
                        content="Roles"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="openRolesModal(brandAdmin)"
                        >
                          <i
                            class="fa fa-id-badge"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                    </div>
                    <div class="list-datetime bold uppercase font-red">
                      <span>{{ brandAdmin.name }}</span>
                    </div>
                    <div class="list-item-content height-mod">
                      <div class="col-md-4">
                        <span>{{ brandAdmin.email }}</span>
                      </div>
                      <div class="col-md-4">
                        <span>{{ formatPhone(brandAdmin.phone) }}</span>
                      </div>
                      <div class="col-md-4">
                        <span v-if="brandAdmin.active === 1">
                          ACTIVE
                        </span>
                        <span v-else>
                          DISABLED
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div
                v-if="brandAdmins.length && numPages > 1"
                class="clearfix"
              >
                <pagination
                  :passed-page="activePage"
                  :num-pages="numPages"
                  @activePageChange="activePageUpdate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="brandAdmins.length && !loadingBrandAdminsData && filteredResults.length">
        <div class="portlet light portlet-fit bordered margin-top-20">
          <div class="portlet-title bg-blue-chambray">
            <div class="menu-image-main">
              <img src="../../../../public/client_logo.png">
            </div>
            <div class="caption">
              <span class="caption-subject font-default bold uppercase">
                Search Results
              </span>
              <div class="caption-desc font-grey-cascade">
                Click on the edit icon to edit a brand admin.
              </div>
            </div>
          </div>
          <div class="portlet-body">
            <div
              v-if="filteredResults.length"
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
                :active-page="searchActivePage"
                @pageResults="pageResultsUpdate"
              />
            </div>
            <div class="mt-element-list">
              <div class="mt-list-container list-news">
                <ul>
                  <li
                    v-for="brandAdmin in currentActiveSearchPageItems"
                    :id="'brandAdmin-' + brandAdmin.id"
                    :key="brandAdmin.id"
                    class="mt-list-item actions-at-left margin-top-15"
                    :class="{'animated' : animated === `brandAdmin-${brandAdmin.id}`}"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="$root.permissions['admin brand_admins update']"
                        content="Edit"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editBrandAdmin(brandAdmin)"
                        >
                          <i
                            class="fa fa-pencil"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']"
                        content="View"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editBrandAdmin(brandAdmin)"
                        >
                          <i
                            class="fa fa-eye"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="canAny([
                          'list user\'s roles',
                          'assign roles to user',
                          'revoke roles from user',
                          'sync roles for user'
                        ])"
                        content="Roles"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="openRolesModal(brandAdmin)"
                        >
                          <i
                            class="fa fa-id-badge"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                    </div>
                    <div class="list-datetime bold uppercase font-red">
                      <span>{{ brandAdmin.name }}</span>
                    </div>
                    <div class="list-item-content height-mod">
                      <div class="col-md-4">
                        <span>{{ brandAdmin.email }}</span>
                      </div>
                      <div class="col-md-4">
                        <span>{{ formatPhone(brandAdmin.phone) }}</span>
                      </div>
                      <div class="col-md-4">
                        <span v-if="brandAdmin.active === 1">
                          ACTIVE
                        </span>
                        <span v-else>
                          DISABLED
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div
                v-if="filteredResults.length && searchNumPages > 1"
                class="clearfix"
              >
                <pagination
                  :passed-page="searchActivePage"
                  :num-pages="searchNumPages"
                  @activePageChange="activeSearchPageUpdate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!brandAdmins.length && !loadingBrandAdminsData">
        <no-results
          :show="!brandAdmins.length"
          :type="'brand admins'"
        />
      </div>
    </div>
    <!-- LIST END -->

    <!-- EDIT MODAL START -->
    <modal
      ref="editModal"
      :show="showEditBrandAdminModal"
      effect="fade"
      @closeOnEscape="closeEditBrandAdminModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeEditBrandAdminModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Edit Brand Admin
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="editErrorMessage"
          ref="editErrorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click="clearError('editErrorMessage')"
          />
          <span>{{ editErrorMessage }}</span>
        </div>
        <fieldset :disabled="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']">
          <div class="form-group form-md-line-input form-md-floating-label">
            <input
              id="form_control_edited_name"
              v-model="brandAdminToBeEdited.name"
              type="text"
              class="form-control input-sm"
              :class="{'edited': brandAdminToBeEdited.name.length}"
            >
            <label for="form_control_edited_name">
              Name
            </label>
          </div>
          <div class="form-group form-md-line-input form-md-floating-label">
            <input
              id="form_control_edited_phone"
              v-model="brandAdminToBeEdited.phone"
              type="text"
              class="form-control input-sm"
              :class="{'edited': brandAdminToBeEdited.phone.length}"
            >
            <label for="form_control_edited_phone">
              Phone
            </label>
          </div>
        </fieldset>
        <div class="form-group form-md-line-input form-md-floating-label">
          <label>Status</label><br>
          <el-switch
            v-model="brandAdminToBeEdited.active"
            :disabled="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']"
            active-color="#0c6"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text="Active"
            inactive-text="Disabled"
          />
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          v-if="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']"
          type="button"
          class="btn btn-primary"
          @click="closeEditBrandAdminModal()"
        >
          Close
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary"
          :disabled="updating"
          @click="updateBrandAdmin()"
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

    <!-- ROLES MODAL START -->
    <modal
      ref="rolesModal"
      :show="showAssignRolesModal"
      effect="fade"
      @closeOnEscape="closeRolesModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeRolesModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Assign Roles
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="assignRolesErrorMessage"
          ref="assignRolesErrorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click="clearError('assignRolesErrorMessage')"
          />
          <span>{{ assignRolesErrorMessage }}</span>
        </div>
        <roles-picker
          v-if="showAssignRolesModal"
          :editable="canAny([
            'assign roles to user',
            'revoke roles from user',
            'sync roles for user'
          ])"
          :previously-selected="brandAdminToAssignRolesTo.roles"
          @rolesSelected="updateRoles"
        />
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          v-if="canAny([
            'assign roles to user',
            'revoke roles from user',
            'sync roles for user'
          ])"
          type="button"
          class="btn btn-primary"
          :disabled="assigning"
          @click="assignRoles()"
        >
          Save
          <i
            v-show="assigning"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary"
          :disabled="assigning"
          @click="closeRolesModal()"
        >
          Close
        </button>
      </div>
    </modal>
    <!-- ROLES MODAL END -->
  </div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import AdminManagerFunctions from '../../../controllers/AdminManager'
import Modal from '../../modules/Modal'
import Dropdown from '../../modules/Dropdown'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import RolesPicker from '@/components/app/ApprovalsManager/RolesPicker'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { mapGetters } from 'vuex'

/**
 * Define the email pattern to check for valid emails.
 * @var {regex}
 * @memberof Login
 */
var emailPattern = /^.+@.+\..+$/

export default {
  data () {
    return {
      breadcrumbArray: [
        { name: 'Admin Manager', link: false },
        { name: 'Brand Admins', link: false }
      ],
      createBrandAdminCollapse: true,
      createErrorMessage: '',
      creating: false,
      newBrandAdmin: {
        name: '',
        phone: '',
        email: '',
        password: '',
        type: 'admin',
        active: 1,
        created_by: this.$root.createdBy
      },
      listErrorMessage: '',
      editErrorMessage: '',
      updating: false,
      brandAdminToBeEdited: {
        name: '',
        phone: '',
        active: 1,
        type: 'admin'
      },
      loadingBrandAdminsData: false,
      brandAdmins: [],
      showEditBrandAdminModal: false,
      animated: '',
      searchCollapse: true,
      searchError: '',
      filteredResults: [],
      searchTerm: '',
      activePage: 1,
      resultsPerPage: 25,
      sortBy: {
        order: 'ASC'
      },
      searchActivePage: 1,
      passwordMasked: true,
      passwordConfirmMasked: true,
      passwordCheck: '',
      brandAdminToAssignRolesTo: {},
      assigning: false,
      showAssignRolesModal: false,
      assignRolesErrorMessage: ''
    }
  },
  computed: {
    numPages () {
      return Math.ceil(this.brandAdmins.length / this.resultsPerPage)
    },
    currentActivePageItems () {
      return this.userSort(this.brandAdmins).slice(
        this.resultsPerPage * (this.activePage - 1),
        this.resultsPerPage * (this.activePage - 1) +
					this.resultsPerPage
      )
    },
    searchNumPages () {
      return Math.ceil(this.filteredResults.length / this.resultsPerPage)
    },
    currentActiveSearchPageItems () {
      return this.userSort(this.filteredResults).slice(
        this.resultsPerPage * (this.searchActivePage - 1),
        this.resultsPerPage * (this.searchActivePage - 1) +
					this.resultsPerPage
      )
    },
    ...mapGetters(['can', 'canAny'])
  },
  mounted () {
    this.getAllBrandAdmins()
  },
  methods: {
    /**
		 * To format a phone number
		 * @function
		 * @param {string} phone - The phone number to format
		 * @returns {string} The formatted phone string
		 */
    formatPhone (phone) {
      let digits = phone.replace(/\D/g, '')
      return (
        digits.slice(0, 3) +
				'-' +
				digits.slice(3, 6) +
				'-' +
				digits.slice(6)
      )
    },
    /**
		 * To switch bewteen masked and unmasked password fields.
		 * @function
		 * @returns {undefined}
		 */
    flipPasswordMask () {
      this.passwordMasked = !this.passwordMasked
    },
    /**
		 * To switch bewteen masked and unmasked password confirm fields.
		 * @function
		 * @returns {undefined}
		 */
    flipPasswordConfirmMask () {
      this.passwordConfirmMasked = !this.passwordConfirmMasked
    },
    /**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
    updateSortByOrder (value) {
      this.sortBy.order = value
      this.filteredResults.length
        ? this.activeSearchPageUpdate(1)
        : this.activePageUpdate(1)
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
        this.filteredResults.length
          ? this.activeSearchPageUpdate(1)
          : this.activePageUpdate(1)
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
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
    activeSearchPageUpdate (val) {
      if (parseInt(this.searchActivePage) !== parseInt(val)) {
        this.searchActivePage = val
        window.scrollTo(0, 0)
      }
    },
    /**
		 * To toggle the search panel
		 * @function
		 * @returns {undefined}
		 */
    toggleSearchPanel () {
      this.searchCollapse = !this.searchCollapse
      this.$nextTick(function () {
        if (!this.searchCollapse) {
          this.$refs.search.focus()
        }
      })
    },
    /**
		 * To filter the results based on the search term.
		 * @function
		 * @returns {undefined}
		 */
    advancedSearch () {
      this.clearError('searchError')
      this.filteredResults = []
      if (this.searchTerm.length) {
        if (this.searchTerm.length < 3) {
          this.searchError =
						'Search term must be at least 3 characters.'
        } else {
          for (var i = 0; i < this.brandAdmins.length; i++) {
            if (
              this.brandAdmins[i].name
                .toLowerCase()
                .indexOf(this.searchTerm.toLowerCase()) > -1 ||
							this.brandAdmins[i].email
							  .toLowerCase()
							  .indexOf(this.searchTerm.toLowerCase()) > -1
            ) {
              this.filteredResults.push(this.brandAdmins[i])
            }
          }
          if (!this.filteredResults.length) {
            this.searchError =
							'There are no matching records. Please try again.'
          }
        }
      } else {
        this.$refs.search.focus()
      }
    },
    /**
		 * To clear an error.
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
    clearError (name) {
      this[name] = ''
    },
    /**
		 * To clear the current search criteria.
		 * @function
		 * @returns {undefined}
		 */
    resetSearch () {
      this.searchTerm = ''
      this.filteredResults = []
      this.activePage = 1
      this.searchActivePage = 1
      this.clearError('searchError')
    },
    /**
		 * To get roles already assigned to the user
		 * @function
		 * @param {object} user - The user to fetch roles for
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getUserRoles (user) {
      return AdminManagerFunctions.getUserRoles(user)
        .then(response => {
          return response.payload.map(role => role.id)
        })
        .catch(reason => {
          return []
        })
    },
    /**
		 * To update the roles based on user's selection
		 * @function
		 * @param {array} roles - An array of role ids
		 * @returns {undefined}
		 */
    updateRoles (roles) {
      this.brandAdminToAssignRolesTo.roles = roles
    },
    /**
		 * To validate data before submitting to the backend
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    validateRoles () {
      var brandAdminsVue = this
      return new Promise(function (resolve, reject) {
        if (!brandAdminsVue.brandAdminToAssignRolesTo.roles.length) {
          reject('Select at least one role')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To assign roles to a user
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    assignRoles () {
      var brandAdminsVue = this

      return this.validateRoles()
        .then(response => {
          brandAdminsVue.assigning = true
          brandAdminsVue.clearError('assignRolesErrorMessage')
          return AdminManagerFunctions.assignRoles(
            brandAdminsVue.brandAdminToAssignRolesTo,
            brandAdminsVue.$root.appId,
            brandAdminsVue.$root.appSecret,
            brandAdminsVue.$root.userToken
          )
            .then(response => {
              brandAdminsVue.closeRolesModal()
              brandAdminsVue.showRolesSuccess(response.payload)
              this.animated = `brandAdmin-${
                brandAdminsVue.brandAdminToBeEdited.id
              }`
              window.setTimeout(() => {
                brandAdminsVue.animated = ''
              }, 3000)
              brandAdminsVue.resetRolesForm()
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'Could not assign roles',
                errorName: 'assignRolesErrorMessage',
                vue: brandAdminsVue,
                containerRef: 'rolesModal'
              })
            })
            .finally(() => {
              brandAdminsVue.assigning = false
            })
        })
        .catch(reason => {
          brandAdminsVue.assignRolesErrorMessage = reason
          brandAdminsVue.$scrollTo(
            brandAdminsVue.$refs.assignRolesErrorMessage,
            1000,
            { offset: -50 }
          )
        })
    },
    /**
		 * To open the roles modal
		 * @function
		 * @param {object} brandAdmin - The selected brand admin
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    openRolesModal (brandAdmin) {
      let brandAdminsVue = this
      this.getUserRoles(brandAdmin)
        .then(roles => {
          brandAdminsVue.brandAdminToAssignRolesTo = {
            ...brandAdmin,
            roles
          }
        })
        .catch(err => {
          brandAdminsVue.brandAdminToAssignRolesTo = {
            ...brandAdmin,
            roles: []
          }
          err
        })
        .finally(() => {
          brandAdminsVue.showAssignRolesModal = true
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showRolesSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Roles have been saved'
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
		 * To close the modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    closeRolesModal () {
      this.clearError('assignRolesErrorMessage')
      this.showAssignRolesModal = false
    },
    /**
		 * To reset the roles form
		 * @function
		 * @returns {undefined}
		 */
    resetRolesForm () {
      this.brandAdminToAssignRolesTo = {}
    },
    /**
		 * To display the edit modal
		 * @function
		 * @param {object} brandAdmin - The brand admin object to be edited
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    editBrandAdmin (brandAdmin) {
      this.brandAdminToBeEdited.name = brandAdmin.name
      this.brandAdminToBeEdited.phone = brandAdmin.phone
      this.brandAdminToBeEdited.active = brandAdmin.active
      this.brandAdminToBeEdited.id = brandAdmin.id
      this.showEditBrandAdminModal = true
    },
    /**
		 * To close the edit modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    closeEditBrandAdminModal () {
      this.clearError('editErrorMessage')
      this.showEditBrandAdminModal = false
    },
    /**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getAllBrandAdmins () {
      this.loadingBrandAdminsData = true
      var brandAdminsVue = this
      return AdminManagerFunctions.getAllAdmins(
        brandAdminsVue.$root.appId,
        brandAdminsVue.$root.appSecret,
        brandAdminsVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            brandAdminsVue.loadingBrandAdminsData = false
            let filtered = []
            response.payload.forEach(admin => {
              if (admin.type === 'admin') {
                filtered.push(admin)
              }
            })
            brandAdminsVue.brandAdmins = filtered
          } else {
            brandAdminsVue.loadingBrandAdminsData = false
          }
        })
        .catch(reason => {
          brandAdminsVue.loadingBrandAdminsData = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch Brand Admins',
            errorName: 'listErrorMessage',
            vue: brandAdminsVue
          })
        })
    },
    /**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    createBrandAdmin () {
      var brandAdminsVue = this

      return this.validateNewBrandAdminData()
        .then(response => {
          brandAdminsVue.creating = true
          brandAdminsVue.clearError('createErrorMessage')
          return AdminManagerFunctions.createAdmin(
            brandAdminsVue.newBrandAdmin,
            brandAdminsVue.$root.appId,
            brandAdminsVue.$root.appSecret,
            brandAdminsVue.$root.userToken
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                brandAdminsVue.getAllBrandAdmins()
                brandAdminsVue.resetCreateForm()
                brandAdminsVue.showCreateSuccess(response.payload)
              } else {
                brandAdminsVue.createErrorMessage =
									response.message
              }
            })
            .catch(reason => {
              if (reason.responseJSON && reason.responseJSON.message === 'The email has already been taken.') {
                reason.responseJSON.message = 'A Brand Admin or a Location Manager with this email already exists.'
              }
              ajaxErrorHandler({
                reason,
                errorText:
									'We could not create the Brand Admin',
                errorName: 'createErrorMessage',
                vue: brandAdminsVue
              })
            })
            .finally(() => {
              brandAdminsVue.creating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          if (reason.responseJSON) {
            brandAdminsVue.createErrorMessage =
							reason.responseJSON.message
            window.scrollTo(0, 0)
          } else {
            brandAdminsVue.createErrorMessage = reason
            window.scrollTo(0, 0)
          }
        })
    },
    /**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
    resetCreateForm () {
      this.newBrandAdmin = {
        name: '',
        phone: '',
        email: '',
        password: '',
        type: 'admin',
        active: 1,
        created_by: this.$root.createdBy
      }
      this.passwordCheck = ''
    },
    /**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
    resetEditForm () {
      this.brandAdminToBeEdited = {
        name: '',
        phone: '',
        active: 1,
        type: 'admin'
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
      let text = 'The Brand Admin has been created'
      let type = 'success'

      if (payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Brand Admin has been sent for approval'
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
      let text = 'The Brand Admin has been updated'
      let type = 'success'

      if (payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Brand Admin has been sent for approval'
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
    toggleCreateBrandAdminPanel () {
      this.createBrandAdminCollapse = !this.createBrandAdminCollapse
      this.$nextTick(function () {
        if (!this.createBrandAdminCollapse) {
          this.$refs.newBrandAdminName.focus()
        }
      })
    },
    /**
		 * To update the brand admin object.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    updateBrandAdmin () {
      var brandAdminsVue = this

      return this.validateEditedBrandAdminData()
        .then(response => {
          brandAdminsVue.updating = true
          brandAdminsVue.clearError('editErrorMessage')
          return AdminManagerFunctions.updateAdmin(
            brandAdminsVue.brandAdminToBeEdited,
            brandAdminsVue.$root.appId,
            brandAdminsVue.$root.appSecret,
            brandAdminsVue.$root.userToken
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                brandAdminsVue.closeEditBrandAdminModal()
                brandAdminsVue.showEditSuccess(response.payload)
                for (
                  var i = 0;
                  i < this.brandAdmins.length;
                  i++
                ) {
                  if (
                    this.brandAdmins[i].id ===
										brandAdminsVue.brandAdminToBeEdited.id
                  ) {
                    this.brandAdmins[i].name =
											brandAdminsVue.brandAdminToBeEdited.name
                    this.brandAdmins[i].phone =
											brandAdminsVue.brandAdminToBeEdited.phone
                    this.brandAdmins[i].active =
											brandAdminsVue.brandAdminToBeEdited.active
                  }
                }
                brandAdminsVue.resetEditForm()
                this.animated = `brandAdmin-${
                  brandAdminsVue.brandAdminToBeEdited.id
                }`
                window.setTimeout(() => {
                  brandAdminsVue.animated = ''
                }, 3000)
              } else {
                brandAdminsVue.editErrorMessage =
									response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText:
									'We could not update the Brand Admin',
                errorName: 'editErrorMessage',
                vue: brandAdminsVue,
                containerRef: 'editModal'
              })
            })
            .finally(() => {
              brandAdminsVue.updating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          if (reason.responseJSON) {
            brandAdminsVue.editErrorMessage =
							reason.responseJSON.message
            window.scrollTo(0, 0)
          } else {
            brandAdminsVue.editErrorMessage = reason
            window.scrollTo(0, 0)
          }
        })
    },
    /**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateNewBrandAdminData () {
      var brandAdminsVue = this
      const passwordRegex = new RegExp(
        /^((?=\S*?[A-Z])(?=\S*?[0-9]).{7,})\S$/
      )
      return new Promise(function (resolve, reject) {
        if (!brandAdminsVue.newBrandAdmin.name.length) {
          reject('Name cannot be blank')
        } else if (
          brandAdminsVue.newBrandAdmin.phone.replace(/\D/g, '')
            .length < 10
        ) {
          reject('Phone number should have at least 10 digits')
        } else if (!brandAdminsVue.newBrandAdmin.email.length) {
          reject('Email cannot be blank')
        } else if (
          !emailPattern.test(brandAdminsVue.newBrandAdmin.email)
        ) {
          reject('Please enter a valid email')
        } else if (
          !passwordRegex.test(brandAdminsVue.newBrandAdmin.password)
        ) {
          reject(
            'Password should: be at least 8 characters long, contain only English letters and numbers, contain at least one uppercase letter and one number'
          )
        } else if (
          brandAdminsVue.newBrandAdmin.password !==
					brandAdminsVue.passwordCheck
        ) {
          reject('Passwords do not match')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateEditedBrandAdminData () {
      var brandAdminsVue = this
      return new Promise(function (resolve, reject) {
        if (!brandAdminsVue.brandAdminToBeEdited.name.length) {
          reject('Name cannot be blank')
        } else if (
          brandAdminsVue.brandAdminToBeEdited.phone.replace(/\D/g, '')
            .length < 10
        ) {
          reject('Phone number should have at least 10 digits')
        }
        resolve('Hurray')
      })
    }
  },
  components: {
    Breadcrumb,
    NoResults,
    LoadingScreen,
    Modal,
    Dropdown,
    Pagination,
    PageResults,
    RolesPicker
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
</style>

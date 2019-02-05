<template>
  <div>
    <div>
      <div class="page-bar">
        <breadcrumb :crumbs="breadcrumbArray" />
      </div>
      <h1 class="page-title">
        Store App Users
      </h1>
      <div class="note note-info">
        <p>Create and manage Store App User accounts.</p>
      </div>

      <!-- CREATE NEW START -->
      <div
        v-if="$root.permissions['admin store_app_users create']"
        class="portlet box blue-hoki margin-top-20"
      >
        <div
          class="portlet-title bg-blue-chambray"
          @click="toggleCreateStoreAppUserPanel()"
        >
          <div class="caption">
            <i class="fa fa-plus-circle" />
            Create New Store App User
          </div>
          <div class="tools">
            <a :class="{'expand': !createStoreAppUserCollapse, 'collapse': createStoreAppUserCollapse}" />
          </div>
        </div>
        <div
          class="portlet-body"
          :class="{'display-hide': createStoreAppUserCollapse}"
        >
          <form
            role="form"
            @submit.prevent="createStoreAppUser()"
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
                    ref="newStoreAppUserName"
                    v-model="newStoreAppUser.name"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newStoreAppUser.name.length}"
                  >
                  <label for="form_control_name">
                    Name
                  </label>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_email"
                    v-model="newStoreAppUser.email"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newStoreAppUser.email.length}"
                  >
                  <label for="form_control_email">
                    Email
                  </label>
                </div>
                <div>
                  <button
                    type="button"
                    class="btn blue btn-outline"
                    @click="assignStoreToStoreAppUser(newStoreAppUser, 'new')"
                  >
                    Select a location
                  </button>
                  <span
                    v-if="newStoreAppUser.location_id"
                    class="grey-inline-label"
                  >
                    Selected {{ selectedNewLocationName }}
                  </span>
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
                      v-model="newStoreAppUser.password"
                      type="password"
                      class="form-control input-sm"
                      :class="{'edited': newStoreAppUser.password.length}"
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
                      v-model="newStoreAppUser.password"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': newStoreAppUser.password.length}"
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
        v-if="storeAppUsers.length"
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
            class="portlet-body"
            :class="{'display-hide': searchCollapse}"
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
                      @click.prevent="clearError('searchError')"
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
                  @click="resetSearch()"
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
        :show="loadingStoreAppUsersData"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <div v-if="storeAppUsers.length && !loadingStoreAppUsersData && !filteredResults.length">
        <div class="portlet light portlet-fit bordered margin-top-20">
          <div class="portlet-title bg-blue-chambray">
            <div class="menu-image-main">
              <img src="../../../../public/client_logo.png">
            </div>
            <div class="caption">
              <span class="caption-subject font-default bold uppercase">
                Store App Users
              </span>
              <div class="caption-desc font-grey-cascade">
                Click on a store app user to edit their details or change the store assigned to them.
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
              v-if="storeAppUsers.length"
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
                :total-results="storeAppUsers.length"
                :active-page="activePage"
                @pageResults="pageResultsUpdate"
              />
            </div>
            <div class="mt-element-list">
              <div class="mt-list-container list-news">
                <ul>
                  <li
                    v-for="storeAppUser in currentActivePageItems"
                    :id="'storeAppUser-' + storeAppUser.id"
                    :key="storeAppUser.id"
                    class="mt-list-item actions-at-left margin-top-15"
                    :class="{'animated' : animated === `storeAppUser-${storeAppUser.id}`}"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="$root.permissions['admin store_app_users update']"
                        content="Edit"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editStoreAppUser(storeAppUser)"
                        >
                          <i
                            class="fa fa-pencil"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['admin store_app_users read'] && !$root.permissions['admin store_app_users update']"
                        content="View"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editStoreAppUser(storeAppUser)"
                        >
                          <i
                            class="fa fa-eye"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                    </div>
                    <div class="list-datetime bold uppercase font-red">
                      <span>{{ storeAppUser.name }}</span>
                    </div>
                    <div class="list-item-content height-mod">
                      <div class="col-md-4">
                        <span>{{ storeAppUser.email }}</span>
                      </div>
                      <div class="col-md-4">
                        <span v-if="storeAppUser.is_active === 1">
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
                v-if="storeAppUsers.length && numPages > 1"
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
      <div v-if="storeAppUsers.length && !loadingStoreAppUsersData && filteredResults.length">
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
                Click on a store app user to edit their details or change the store assigned to them.
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
                    v-for="storeAppUser in currentActiveSearchPageItems"
                    :id="'storeAppUser-' + storeAppUser.id"
                    :key="storeAppUser.id"
                    class="mt-list-item actions-at-left margin-top-15"
                    :class="{'animated' : animated === `storeAppUser-${storeAppUser.id}`}"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="$root.permissions['admin store_app_users update']"
                        content="Edit"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editStoreAppUser(storeAppUser)"
                        >
                          <i
                            class="fa fa-pencil"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['admin store_app_users read'] && !$root.permissions['admin store_app_users update']"
                        content="View"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editStoreAppUser(storeAppUser)"
                        >
                          <i
                            class="fa fa-eye"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                    </div>
                    <div class="list-datetime bold uppercase font-red">
                      <span>{{ storeAppUser.name }}</span>
                    </div>
                    <div class="list-item-content height-mod">
                      <div class="col-md-4">
                        <span>{{ storeAppUser.email }}</span>
                      </div>
                      <div class="col-md-4">
                        <span>{{ storeAppUser.phone }}</span>
                      </div>
                      <div class="col-md-4">
                        <span v-if="storeAppUser.is_active === 1">
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
      <div v-if="!storeAppUsers.length && !loadingStoreAppUsersData">
        <no-results
          :show="!storeAppUsers.length"
          :type="'store app users'"
        />
      </div>
    </div>
    <!-- LIST END -->

    <!-- ASSIGN STORES MODAL START -->
    <modal
      ref="storesModal"
      :show="showAssignStoresModal"
      effect="fade"
      @closeOnEscape="closeAssignStoresModal"
    >
      <div
        slot="modal-header"
        class="modal-header center"
      >
        <button
          type="button"
          class="close"
          @click="closeAssignStoresModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Select A Store
          <span v-if="selectedStoreAppUser.name.length">
            For
          </span>{{ selectedStoreAppUser.name }}
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="assignErrorMessage"
          ref="assignErrorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click.prevent="clearError('assignErrorMessage')"
          />
          <span>{{ assignErrorMessage }}</span>
        </div>
        <store-picker
          :multiple="false"
          @update="setLocationId"
        />
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <div class="row">
          <div class="col-xs-12">
            <button
              type="button"
              class="btn blue"
              @click="assignStores($event)"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </modal>
    <!-- ASSIGN STORES MODAL START -->

    <!-- EDIT MODAL START -->
    <modal
      ref="editModal"
      :show="showEditStoreAppUserModal"
      effect="fade"
      @closeOnEscape="closeEditStoreAppUserModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
        mode="out-in"
      >
        <transition
          name="fade"
          mode="out-in"
        >
          <div
            v-if="!editLocationMode"
            key="mainEditMode"
          >
            <button
              type="button"
              class="close"
              @click="closeEditStoreAppUserModal()"
            >
              <span>&times;</span>
            </button>
            <h4 class="modal-title center">
              Edit Store App User
            </h4>
          </div>
          <div
            v-if="editLocationMode"
            key="selectLocationMode"
          >
            <button
              type="button"
              class="close"
              @click="closeEditStoreAppUserModal()"
            >
              <span>&times;</span>
            </button>
            <h4 class="modal-title center">
              <i
                class="fa fa-chevron-left clickable pull-left back-button"
                @click="closeEditLocationMode()"
              />
              Select A Store
              <span v-if="selectedStoreAppUser.name.length">
                For
              </span>{{ selectedStoreAppUser.name }}
            </h4>
          </div>
        </transition>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <transition
          name="fade"
          mode="out-in"
        >
          <div
            v-if="!editLocationMode"
            key="mainEditMode"
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
            <fieldset :disabled="$root.permissions['admin store_app_users read'] && !$root.permissions['admin store_app_users update']">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_edited_name"
                  v-model="storeAppUserToBeEdited.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': storeAppUserToBeEdited.name.length}"
                >
                <label for="form_control_edited_name">
                  Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_edited_password"
                  v-model="storeAppUserToBeEdited.password"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': storeAppUserToBeEdited.password.length}"
                >
                <label for="form_control_edited_password">
                  Password
                </label>
              </div>
            </fieldset>
            <div>
              <button
                type="button"
                class="btn blue btn-outline"
                @click="assignStoreToStoreAppUser(storeAppUserToBeEdited, 'existing')"
              >
                Select a location
              </button>
              <p
                v-if="storeAppUserToBeEdited.location_id"
                class="grey-label margin-top-10"
              >
                Selected {{ selectedEditedLocationName }}
              </p>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <label>Status</label><br>
              <el-switch
                v-model="storeAppUserToBeEdited.is_active"
                :disabled="$root.permissions['admin store_app_users read'] && !$root.permissions['admin store_app_users update']"
                active-color="#0c6"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                active-text="Active"
                inactive-text="Disabled"
              />
            </div>
          </div>
          <form
            v-if="editLocationMode"
            key="selectLocationMode"
            role="form"
            novalidate
          >
            <div
              v-show="assignErrorMessage"
              ref="assignErrorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                @click.prevent="clearError('assignErrorMessage')"
              />
              <span>{{ assignErrorMessage }}</span>
            </div>
            <store-picker
              :multiple="false"
              :previously-selected="[storeAppUserToBeEdited.location_id]"
              @update="setLocationId"
            />
          </form>
        </transition>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <div
          v-if="editLocationMode"
          class="row"
        >
          <div class="col-xs-12">
            <button
              v-if="$root.permissions['admin store_app_users read'] && !$root.permissions['admin store_app_users update']"
              type="button"
              class="btn btn-primary"
              @click="closeEditLocationMode()"
            >
              Back
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary"
              @click="assignStores($event)"
            >
              Select
            </button>
          </div>
        </div>
        <button
          v-if="!editLocationMode && $root.permissions['admin store_app_users read'] && !$root.permissions['admin store_app_users update']"
          type="button"
          class="btn btn-primary"
          @click="closeEditStoreAppUserModal()"
        >
          Close
        </button>
        <button
          v-if="!editLocationMode && $root.permissions['admin store_app_users update']"
          type="button"
          class="btn btn-primary"
          :disabled="updating"
          @click="updateStoreAppUser()"
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
  </div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import AdminManagerFunctions from '../../../controllers/AdminManager'
import Modal from '../../modules/Modal'
import StorePicker from '@/components/modules/StorePicker'
import Dropdown from '../../modules/Dropdown'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import ajaxErrorHandler from '@/controllers/ErrorController'

/**
 * Define the email pattern to check for valid emails.
 * @var {regex}
 * @memberof Login
 */
var emailPattern = /^.+@.+\..+$/

export default {
  components: {
    Breadcrumb,
    NoResults,
    LoadingScreen,
    Modal,
    Dropdown,
    Pagination,
    PageResults,
    StorePicker
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Admin Manager', link: false },
        { name: 'Store App Users', link: false }
      ],
      createStoreAppUserCollapse: true,
      createErrorMessage: '',
      creating: false,
      newStoreAppUser: {
        name: '',
        email: '',
        password: '',
        location_id: null
      },
      editErrorMessage: '',
      updating: false,
      storeAppUserToBeEdited: {
        name: '',
        password: '',
        email: '',
        location_id: 0,
        is_active: 1
      },
      selectedStoreAppUser: {
        name: '',
        email: '',
        location_id: 0,
        is_active: 1
      },
      selectedLocationId: null,
      selectedStoreAppUserType: '',
      loadingStoreAppUsersData: false,
      assignErrorMessage: '',
      listErrorMessage: '',
      storeAppUsers: [],
      showAssignStoresModal: false,
      showEditStoreAppUserModal: false,
      animated: '',
      selectAllSelected: false,
      activePage: 1,
      resultsPerPage: 25,
      sortBy: {
        order: 'ASC'
      },
      searchActivePage: 1,
      editLocationMode: false,
      searchCollapse: true,
      searchError: '',
      filteredResults: [],
      searchTerm: '',
      passwordMasked: true,
      passwordConfirmMasked: true,
      passwordCheck: ''
    }
  },
  computed: {
    selectedNewLocationName () {
      let name = ''
      this.$root.storeLocations.forEach(store => {
        if (store.id === this.newStoreAppUser.location_id) {
          name = store.display_name
        }
      })
      return name
    },
    selectedEditedLocationName () {
      let name = ''
      this.$root.storeLocations.forEach(store => {
        if (store.id === this.storeAppUserToBeEdited.location_id) {
          name = store.display_name
        }
      })
      return name
    },
    numPages () {
      return Math.ceil(this.storeAppUsers.length / this.resultsPerPage)
    },
    currentActivePageItems () {
      return this.userSort(this.storeAppUsers).slice(
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
    }
  },
  mounted () {
    this.getAllStoreAppUsers()
  },
  methods: {
    setLocationId (id) {
      this.selectedLocationId = id
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
          for (var i = 0; i < this.storeAppUsers.length; i++) {
            if (
              this.storeAppUsers[i].name
                .toLowerCase()
                .indexOf(this.searchTerm.toLowerCase()) > -1 ||
							this.storeAppUsers[i].email
							  .toLowerCase()
							  .indexOf(this.searchTerm.toLowerCase()) > -1
            ) {
              this.filteredResults.push(this.storeAppUsers[i])
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
		 * To assign the selected stores to the current group.
		 * @function
		 * @param {object} event - The event that initiated the action
		 * @returns {undefined}
		 */
    assignStores (event) {
      event.preventDefault()
      if (this.selectedStoreAppUserType === 'new') {
        this.newStoreAppUser.location_id = this.selectedLocationId
        this.selectedLocationId = null
        this.selectedStoreAppUserType = ''
        this.showAssignStoresModal = false
      } else if (this.selectedStoreAppUserType === 'existing') {
        this.selectedStoreAppUser.location_id = this.selectedLocationId
        this.selectedLocationId = null
        this.selectedStoreAppUserType = ''
        this.editLocationMode = false
      }
    },
    /**
		 * To display the edit modal
		 * @function
		 * @param {object} storeAppUser - The store app user object to be edited
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    editStoreAppUser (storeAppUser) {
      this.storeAppUserToBeEdited.name = storeAppUser.name
      this.storeAppUserToBeEdited.password = ''
      this.storeAppUserToBeEdited.email = storeAppUser.email
      this.storeAppUserToBeEdited.is_active = storeAppUser.is_active
      this.storeAppUserToBeEdited.location_id = storeAppUser.location_id
      this.storeAppUserToBeEdited.id = storeAppUser.id
      this.showEditStoreAppUserModal = true
    },
    /**
		 * To return to the main edit modal.
		 * @function
		 * @returns {undefined}
		 */
    closeEditLocationMode () {
      this.editLocationMode = false
    },
    /**
		 * To close the edit modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    closeEditStoreAppUserModal () {
      this.editLocationMode = false
      this.showEditStoreAppUserModal = false
    },
    /**
		 * To get a list of store app users.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getAllStoreAppUsers () {
      this.loadingStoreAppUsersData = true
      var storeAppUsersVue = this
      return AdminManagerFunctions.getAllPOCUsers(
        storeAppUsersVue.$root.appId,
        storeAppUsersVue.$root.appSecret,
        storeAppUsersVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            storeAppUsersVue.loadingStoreAppUsersData = false
            storeAppUsersVue.storeAppUsers = response.payload
          } else {
            storeAppUsersVue.loadingStoreAppUsersData = false
          }
        })
        .catch(reason => {
          storeAppUsersVue.loadingStoreAppUsersData = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch Store App Users',
            errorName: 'listErrorMessage',
            vue: storeAppUsersVue
          })
        })
    },
    /**
		 * To get a list of store app users.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    createStoreAppUser () {
      var storeAppUsersVue = this

      return this.validateNewStoreAppUserData()
        .then(response => {
          storeAppUsersVue.creating = true
          storeAppUsersVue.clearError('createErrorMessage')
          return AdminManagerFunctions.createPOCUser(
            storeAppUsersVue.newStoreAppUser,
            storeAppUsersVue.$root.appId,
            storeAppUsersVue.$root.appSecret,
            storeAppUsersVue.$root.userToken
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                storeAppUsersVue.getAllStoreAppUsers()
                storeAppUsersVue.resetCreateForm()
                storeAppUsersVue.showCreateSuccess(response.payload)
              } else {
                storeAppUsersVue.createErrorMessage =
									response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText:
									'We could not create the Store App User',
                errorName: 'createErrorMessage',
                vue: storeAppUsersVue
              })
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          if (reason.responseJSON) {
            storeAppUsersVue.createErrorMessage =
							reason.responseJSON.message
            window.scrollTo(0, 0)
          } else {
            storeAppUsersVue.createErrorMessage = reason
            window.scrollTo(0, 0)
          }
        })
        .finally(() => {
          storeAppUsersVue.creating = false
        })
    },
    /**
		 * To reset the create new form.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    resetCreateForm () {
      this.newStoreAppUser = {
        name: '',
        email: '',
        password: '',
        location_id: null
      }
      this.passwordCheck = ''
    },
    /**
		 * To reset the assign form.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    resetAssignForm () {
      this.selectedStoreAppUser = {
        name: '',
        email: '',
        location_id: 0,
        is_active: 1
      }
    },
    /**
		 * To reset the edit form.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    resetEditForm () {
      this.storeAppUserToBeEdited = {
        name: '',
        email: '',
        password: '',
        location_id: 0,
        is_active: 1
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
      let text = 'The Store App User has been created'
      let type = 'success'

      if (payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Store App User has been sent for approval'
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
      let text = 'The Store App User has been saved'
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
		 * To toggle the create new panel.
		 * @function
		 * @returns {undefined}
		 */
    toggleCreateStoreAppUserPanel () {
      this.createStoreAppUserCollapse = !this.createStoreAppUserCollapse
      this.$nextTick(function () {
        if (!this.createStoreAppUserCollapse) {
          this.$refs.newStoreAppUserName.focus()
        }
      })
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
		 * To activate the right half panel which lists the store locations.
		 * @function
		 * @param {object} user - The user a store is selected for
		 * @param {string} type - The type of use (new or existing)
		 * @returns {undefined}
		 */
    assignStoreToStoreAppUser (user, type) {
      this.selectedStoreAppUser = user
      this.selectedStoreAppUserType = type
      this.selectedLocationId = user.location_id
      if (type === 'existing') {
        this.editLocationMode = true
      } else {
        this.showAssignStoresModal = true
      }
    },
    /**
		 * To close anything active in the side panel
		 * @function
		 * @returns {undefined}
		 */
    closeAssignStoresModal () {
      this.showAssignStoresModal = false
    },
    /**
		 * To update the store app user object.
		 * @function
		 * @returns {undefined}
		 */
    updateStoreAppUser () {
      var storeAppUsersVue = this

      return this.validateEditedStoreAppUserData()
        .then(response => {
          storeAppUsersVue.updating = true
          storeAppUsersVue.clearError('createErrorMessage')
          return AdminManagerFunctions.updatePOCUser(
            storeAppUsersVue.storeAppUserToBeEdited,
            storeAppUsersVue.$root.appId,
            storeAppUsersVue.$root.appSecret,
            storeAppUsersVue.$root.userToken
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                storeAppUsersVue.closeEditStoreAppUserModal()
                storeAppUsersVue.showEditSuccess(response.payload)
                for (
                  var i = 0;
                  i < this.storeAppUsers.length;
                  i++
                ) {
                  if (
                    this.storeAppUsers[i].id ===
										storeAppUsersVue.storeAppUserToBeEdited
										  .id
                  ) {
                    this.storeAppUsers[i].name =
											storeAppUsersVue.storeAppUserToBeEdited.name
                    this.storeAppUsers[i].location_id =
											storeAppUsersVue.storeAppUserToBeEdited.location_id
                    this.storeAppUsers[i].is_active =
											storeAppUsersVue.storeAppUserToBeEdited.is_active
                  }
                }
                storeAppUsersVue.resetEditForm()
                this.animated = `storeAppUser-${
                  storeAppUsersVue.storeAppUserToBeEdited.id
                }`
                window.setTimeout(() => {
                  storeAppUsersVue.animated = ''
                }, 3000)
              } else {
                storeAppUsersVue.editErrorMessage =
									response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText:
									'We could not update the Store App User',
                errorName: 'editErrorMessage',
                vue: storeAppUsersVue,
                containerRef: 'editModal'
              })
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          if (reason.responseJSON) {
            storeAppUsersVue.editErrorMessage =
							reason.responseJSON.message
            window.scrollTo(0, 0)
          } else {
            storeAppUsersVue.editErrorMessage = reason
            window.scrollTo(0, 0)
          }
        })
        .finally(() => {
          storeAppUsersVue.updating = false
        })
    },
    /**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateNewStoreAppUserData () {
      var storeAppUsersVue = this
      return new Promise(function (resolve, reject) {
        if (!storeAppUsersVue.newStoreAppUser.name.length) {
          reject('Name cannot be blank')
        } else if (!storeAppUsersVue.newStoreAppUser.email.length) {
          reject('Email cannot be blank')
        } else if (
          !emailPattern.test(storeAppUsersVue.newStoreAppUser.email)
        ) {
          reject('Please enter a valid email')
        } else if (
          storeAppUsersVue.newStoreAppUser.password.length < 6
        ) {
          reject('Defaul password should be at least 6 characters')
        } else if (
          storeAppUsersVue.newStoreAppUser.password !==
					storeAppUsersVue.passwordCheck
        ) {
          reject('Passwords do not match')
        } else if (!storeAppUsersVue.newStoreAppUser.location_id) {
          reject('Please select a location')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateEditedStoreAppUserData () {
      var storeAppUsersVue = this
      return new Promise(function (resolve, reject) {
        if (!storeAppUsersVue.storeAppUserToBeEdited.name.length) {
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
.modal-content {
	max-height: calc(100vh - 60px);
}
.modal-body {
	overflow-y: auto;
	max-height: calc(100vh - 180px);
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
.mt-element-list .list-news.mt-list-container ul > .mt-list-item:hover {
	background-color: white;
}
.form-md-line-input-trimmed {
	padding-top: 0 !important;
	margin-bottom: 0 !important;
}
.grey-inline-label {
	color: #555;
	margin: 0 0 0 10px;
}
</style>

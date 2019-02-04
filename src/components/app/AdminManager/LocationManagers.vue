<template>
  <div>
    <div>
      <div class="page-bar">
        <breadcrumb :crumbs="breadcrumbArray" />
      </div>
      <h1 class="page-title">
        Location Managers
      </h1>
      <div class="note note-info">
        <p>Create and manage Location Manager accounts.</p>
      </div>

      <!-- CREATE NEW START -->
      <div
        v-if="$root.permissions['admin location_managers create']"
        class="portlet box blue-hoki margin-top-20"
      >
        <div
          class="portlet-title bg-blue-chambray"
          @click="toggleCreateLocationManagerPanel()"
        >
          <div class="caption">
            <i class="fa fa-plus-circle" />
            Create New Location Manager
          </div>
          <div class="tools">
            <a :class="{'expand': !createLocationManagerCollapse, 'collapse': createLocationManagerCollapse}" />
          </div>
        </div>
        <div
          class="portlet-body"
          :class="{'display-hide': createLocationManagerCollapse}"
        >
          <form
            role="form"
            @submit.prevent="createLocationManager()"
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
                    ref="newLocationManagerName"
                    v-model="newLocationManager.name"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newLocationManager.name.length}"
                  >
                  <label for="form_control_name">
                    Name
                  </label>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_phone"
                    v-model="newLocationManager.phone"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newLocationManager.phone.length}"
                  >
                  <label for="form_control_phone">
                    Phone
                  </label>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_email"
                    v-model="newLocationManager.email"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newLocationManager.email.length}"
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
                      v-model="newLocationManager.password"
                      type="password"
                      class="form-control input-sm"
                      :class="{'edited': newLocationManager.password.length}"
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
                      v-model="newLocationManager.password"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': newLocationManager.password.length}"
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
                      id="form_control_confirm"
                      v-model="passwordCheck"
                      type="password"
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
                      <i class="fa fa-eye" />
                    </span>
                  </div>
                  <div
                    v-show="!passwordConfirmMasked"
                    class="input-group"
                  >
                    <input
                      id="form_control_confirm_masked"
                      v-model="passwordCheck"
                      type="text"
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
        v-if="locationManagers.length"
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
        :show="loadingLocationManagersData"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <div v-if="locationManagers.length && !loadingLocationManagersData && !filteredResults.length">
        <div class="portlet light portlet-fit bordered margin-top-20">
          <div class="portlet-title bg-blue-chambray">
            <div class="menu-image-main">
              <img src="../../../../public/client_logo.png">
            </div>
            <div class="caption">
              <span class="caption-subject font-default bold uppercase">
                Location Managers
              </span>
              <div class="caption-desc font-grey-cascade">
                Click on a location manager to edit their details or change store locations assigned to them.
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
                    @click.prevent="clearError('listErrorMessage')"
                  />
                  <span>{{ listErrorMessage }}</span>
                </div>
              </div>
            </div>
            <div
              v-if="locationManagers.length"
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
                :total-results="locationManagers.length"
                :active-page="activePage"
                @pageResults="pageResultsUpdate"
              />
            </div>
            <div class="mt-element-list">
              <div class="mt-list-container list-news">
                <ul>
                  <li
                    v-for="locationManager in currentActivePageItems"
                    :id="'locationManager-' + locationManager.id"
                    :key="locationManager.id"
                    class="mt-list-item actions-at-left margin-top-15"
                    :class="{'animated' : animated === `locationManager-${locationManager.id}`}"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="$root.permissions['admin location_managers update']"
                        content="Edit"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editLocationManager(locationManager)"
                        >
                          <i
                            class="fa fa-pencil"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['admin location_managers read'] && !$root.permissions['admin location_managers update']"
                        content="View"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editLocationManager(locationManager)"
                        >
                          <i
                            class="fa fa-eye"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['admin brand_admins assign locations']"
                        content="Assign stores"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="assignStoresToLocationManager(locationManager)"
                        >
                          <i class="icon-layers" />
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
                          @click="openRolesModal(locationManager)"
                        >
                          <i
                            class="fa fa-id-badge"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                    </div>
                    <div class="list-datetime bold uppercase font-red">
                      <span>{{ locationManager.name }}</span>
                    </div>
                    <div class="list-item-content height-mod">
                      <div class="col-md-4">
                        <span>{{ formatPhone(locationManager.phone) }}</span>
                      </div>
                      <div class="col-md-4">
                        <span>{{ locationManager.email }}</span>
                      </div>
                      <div class="col-md-4">
                        <span v-if="locationManager.active === 1">
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
                v-if="locationManagers.length && numPages > 1"
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
      <div v-if="locationManagers.length && !loadingLocationManagersData && filteredResults.length">
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
                Click on a location manager to edit their details or change store locations assigned to them.
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
                    v-for="locationManager in currentActiveSearchPageItems"
                    :id="'locationManager-' + locationManager.id"
                    :key="locationManager.id"
                    class="mt-list-item actions-at-left margin-top-15"
                    :class="{'animated' : animated === `locationManager-${locationManager.id}`}"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="$root.permissions['admin location_managers update']"
                        content="Edit"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editLocationManager(locationManager)"
                        >
                          <i
                            class="fa fa-pencil"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['admin location_managers read'] && !$root.permissions['admin location_managers update']"
                        content="View"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editLocationManager(locationManager)"
                        >
                          <i
                            class="fa fa-eye"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['admin brand_admins assign locations']"
                        content="Assign stores"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="assignStoresToLocationManager(locationManager)"
                        >
                          <i class="icon-layers" />
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
                          @click="openRolesModal(locationManager)"
                        >
                          <i
                            class="fa fa-id-badge"
                            aria-hidden="true"
                          />
                        </a>
                      </el-tooltip>
                    </div>
                    <div class="list-datetime bold uppercase font-red">
                      <span>{{ locationManager.name }}</span>
                    </div>
                    <div class="list-item-content height-mod">
                      <div class="col-md-4">
                        <span>{{ locationManager.email }}</span>
                      </div>
                      <div class="col-md-4">
                        <span>{{ formatPhone(locationManager.phone) }}</span>
                      </div>
                      <div class="col-md-4">
                        <span v-if="locationManager.active === 1">
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
      <div v-if="!locationManagers.length && !loadingLocationManagersData">
        <no-results
          :show="!locationManagers.length"
          :type="'location managers'"
        />
      </div>
    </div>
    <!-- LIST END -->

    <!-- ASSIGN STORES MODAL START -->
    <modal
      ref="assignModal"
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
          Assign Stores To {{ selectedLocationManager.name }}
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body relative-block"
      >
        <div
          v-show="assignErrorMessage"
          ref="assignErrorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click="clearError('assignErrorMessage')"
          />
          <span>{{ assignErrorMessage }}</span>
        </div>
        <store-picker
          v-if="showAssignStoresModal"
          :previously-selected="previouslySelected"
          @update="selectedLocations"
        />
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="assigningStores"
          @click="assignStores()"
        >
          Assign
          <i
            v-show="assigningStores"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>

    <!-- ASSIGN STORES MODAL START -->

    <!-- EDIT MODAL START -->
    <modal
      ref="editModal"
      :show="showEditLocationManagerModal"
      effect="fade"
      @closeOnEscape="closeEditLocationManagerModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeEditLocationManagerModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Edit Location Manager
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
        <fieldset :disabled="$root.permissions['admin location_managers read'] && !$root.permissions['admin location_managers update']">
          <div class="form-group form-md-line-input form-md-floating-label">
            <input
              id="form_control_edited_name"
              v-model="locationManagerToBeEdited.name"
              type="text"
              class="form-control input-sm"
              :class="{'edited': locationManagerToBeEdited.name.length}"
            >
            <label for="form_control_edited_name">
              Name
            </label>
          </div>
          <div class="form-group form-md-line-input form-md-floating-label">
            <input
              id="form_control_edited_phone"
              v-model="locationManagerToBeEdited.phone"
              type="text"
              class="form-control input-sm"
              :class="{'edited': locationManagerToBeEdited.phone.length}"
            >
            <label for="form_control_edited_phone">
              Phone
            </label>
          </div>
        </fieldset>
        <div class="form-group form-md-line-input form-md-floating-label">
          <label>Status</label><br>
          <el-switch
            v-model="locationManagerToBeEdited.active"
            :disabled="$root.permissions['admin location_managers read'] && !$root.permissions['admin location_managers update']"
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
          v-if="$root.permissions['admin location_managers read'] && !$root.permissions['admin location_managers update']"
          type="button"
          class="btn btn-primary"
          @click="closeEditLocationManagerModal()"
        >
          Close
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary"
          :disabled="updating"
          @click="updateLocationManager()"
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
          :previously-selected="locationManagerToAssignRolesTo.roles"
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
          :disabled="assigningRoles"
          @click="assignRoles()"
        >
          Save
          <i
            v-show="assigningRoles"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary"
          :disabled="assigningRoles"
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
import StorePicker from '@/components/modules/StorePicker'
import RolesPicker from '@/components/app/ApprovalsManager/RolesPicker'
import ajaxErrorHandler from '../../../controllers/ErrorController'
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
				{ name: 'Location Managers', link: false }
			],
			createLocationManagerCollapse: true,
			createErrorMessage: '',
			creating: false,
			newLocationManager: {
				name: '',
				phone: '',
				email: '',
				password: '',
				type: 'restricted',
				active: 1,
				created_by: this.$root.createdBy
			},
			editErrorMessage: '',
			updating: false,
			locationManagerToBeEdited: {
				name: '',
				phone: '',
				active: 1,
				type: 'restricted'
			},
			selectedLocationManager: {
				locations: []
			},
			assigningStores: false,
			loadingLocationManagersData: false,
			assignErrorMessage: '',
			listErrorMessage: '',
			locationManagers: [],
			showAssignStoresModal: false,
			showEditLocationManagerModal: false,
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
			locationManagerToAssignRolesTo: {},
			assigningRoles: false,
			showAssignRolesModal: false,
			assignRolesErrorMessage: ''
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.locationManagers.length / this.resultsPerPage)
		},
		currentActivePageItems () {
			return this.userSort(this.locationManagers).slice(
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
		previouslySelected () {
			return this.selectedLocationManager.locations.map(x => x.id) || []
		},
		...mapGetters(['can', 'canAny'])
	},
	mounted () {
		this.getAllLocationManagers()
	},
	methods: {
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
			this.locationManagerToAssignRolesTo.roles = roles
		},
		/**
		 * To validate data before submitting to the backend
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		validateRoles () {
			var locationManagersVue = this
			return new Promise(function (resolve, reject) {
				if (
					!locationManagersVue.locationManagerToAssignRolesTo.roles
						.length
				) {
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
			var locationManagersVue = this

			return this.validateRoles()
				.then(response => {
					locationManagersVue.assigningRoles = true
					locationManagersVue.clearError('assignRolesErrorMessage')
					return AdminManagerFunctions.assignRoles(
						locationManagersVue.locationManagerToAssignRolesTo,
						locationManagersVue.$root.appId,
						locationManagersVue.$root.appSecret,
						locationManagersVue.$root.userToken
					)
						.then(response => {
							locationManagersVue.closeRolesModal()
							locationManagersVue.showRolesSuccess(response.payload)
							this.animated = `locationManager-${
								locationManagersVue.locationManagerToBeEdited.id
							}`
							window.setTimeout(() => {
								locationManagersVue.animated = ''
							}, 3000)
							locationManagersVue.resetRolesForm()
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'Could not assign roles',
								errorName: 'assignRolesErrorMessage',
								vue: locationManagersVue,
								containerRef: 'rolesModal'
							})
						})
						.finally(() => {
							locationManagersVue.assigningRoles = false
						})
				})
				.catch(reason => {
					locationManagersVue.assignRolesErrorMessage = reason
					locationManagersVue.$scrollTo(
						locationManagersVue.$refs.assignRolesErrorMessage,
						1000,
						{ offset: -50 }
					)
				})
		},
		/**
		 * To open the roles modal
		 * @function
		 * @param {object} locationManager - The selected locations manager
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		openRolesModal (locationManager) {
			let locationManagersVue = this
			this.getUserRoles(locationManager)
				.then(roles => {
					locationManagersVue.locationManagerToAssignRolesTo = {
						...locationManager,
						roles
					}
				})
				.catch(err => {
					locationManagersVue.locationManagerToAssignRolesTo = {
						...locationManager,
						roles: []
					}
					err
				})
				.finally(() => {
					locationManagersVue.showAssignRolesModal = true
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
				text = 'The Roles have been sent for approval'
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
			this.locationManagerToAssignRolesTo = {}
		},
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
		 * To switch bewteen masked and unmasked password fields.
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
					for (var i = 0; i < this.locationManagers.length; i++) {
						if (
							this.locationManagers[i].name
								.toLowerCase()
								.indexOf(this.searchTerm.toLowerCase()) > -1 ||
							this.locationManagers[i].email
								.toLowerCase()
								.indexOf(this.searchTerm.toLowerCase()) > -1
						) {
							this.filteredResults.push(this.locationManagers[i])
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
		 * To update the locations selected in the child component
		 * @function
		 * @param {array} locations - Arrray of store ids
		 * @returns {undefined}
		 */
		selectedLocations (locations) {
			this.selectedLocationManager.selectedLocations = locations
		},
		/**
		 * To assign the selected stores to the current user.
		 * @function
		 * @param {array} storesToBeAssigned - An array of store ids
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		assignStores (storesToBeAssigned) {
			var assignStoresVue = this
			if (this.selectedLocationManager.selectedLocations.length === 0) {
				this.assignErrorMessage = 'You have not selected any stores'
				this.$el.scrollTop = 0
				return
			}
			this.assigningStores = true
			let payload = {
				locations:
					assignStoresVue.selectedLocationManager.selectedLocations,
				admin: assignStoresVue.selectedLocationManager.id
			}
			this.clearError('assignErrorMessage')
			AdminManagerFunctions.assignStores(
				payload,
				assignStoresVue.$root.appId,
				assignStoresVue.$root.appSecret,
				assignStoresVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						assignStoresVue.getAllLocationManagers()
						assignStoresVue.closeAssignStoresModal()
						assignStoresVue.resetAssignForm()
						assignStoresVue.resetSearch()
						assignStoresVue.showAssignSuccess(response.payload)
						assignStoresVue.showAssignStoresModal = false
						assignStoresVue.animated = `locationManager-${
							assignStoresVue.selectedLocationManager.id
						}`
						window.setTimeout(() => {
							assignStoresVue.animated = ''
						}, 3000)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not assign the stores',
						errorName: 'assignErrorMessage',
						vue: assignStoresVue,
						containerRef: 'assignModal'
					})
				})
				.finally(() => {
					assignStoresVue.assigningStores = false
				})
		},
		/**
		 * To display the edit modal
		 * @function
		 * @param {object} locationManager - The location manager object to be edited
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		editLocationManager (locationManager) {
			this.locationManagerToBeEdited.name = locationManager.name
			this.locationManagerToBeEdited.phone = locationManager.phone
			this.locationManagerToBeEdited.status = locationManager.active
			this.locationManagerToBeEdited.id = locationManager.id
			this.showEditLocationManagerModal = true
		},
		/**
		 * To close the edit modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		closeEditLocationManagerModal () {
			this.clearError('editErrorMessage')
			this.showEditLocationManagerModal = false
		},
		/**
		 * To get a list of location managers.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllLocationManagers () {
			this.loadingLocationManagersData = true
			var locationManagersVue = this
			return AdminManagerFunctions.getAllAdmins(
				locationManagersVue.$root.appId,
				locationManagersVue.$root.appSecret,
				locationManagersVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						locationManagersVue.loadingLocationManagersData = false
						let filtered = []
						response.payload.forEach(admin => {
							if (admin.type === 'restricted') {
								filtered.push(admin)
							}
						})
						locationManagersVue.locationManagers = filtered
					} else {
						locationManagersVue.loadingLocationManagersData = false
					}
				})
				.catch(reason => {
					locationManagersVue.loadingLocationManagersData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch Location Managers',
						errorName: 'listErrorMessage',
						vue: locationManagersVue
					})
				})
		},
		/**
		 * To get a list of location managers.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createLocationManager () {
			var locationManagersVue = this

			return this.validateNewLocationManagerData()
				.then(response => {
					locationManagersVue.creating = true
					locationManagersVue.clearError('createErrorMessage')
					return AdminManagerFunctions.createAdmin(
						locationManagersVue.newLocationManager,
						locationManagersVue.$root.appId,
						locationManagersVue.$root.appSecret,
						locationManagersVue.$root.userToken
					)
						.then(response => {
							if (
								response.code === 200 &&
								response.status === 'ok'
							) {
								locationManagersVue.getAllLocationManagers()
								locationManagersVue.resetCreateForm()
								locationManagersVue.showCreateSuccess(response.payload)
							} else {
								locationManagersVue.createErrorMessage =
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
									'We could not create the Location Manager',
								errorName: 'createErrorMessage',
								vue: locationManagersVue
							})
						})
						.finally(() => {
							locationManagersVue.creating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					if (reason.responseJSON) {
						locationManagersVue.createErrorMessage =
							reason.responseJSON.message
						window.scrollTo(0, 0)
					} else {
						locationManagersVue.createErrorMessage = reason
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
			this.newLocationManager = {
				name: '',
				phone: '',
				email: '',
				password: '',
				type: 'restricted',
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
		resetAssignForm () {
			this.selectedLocationManager = {
				locations: []
			}
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetEditForm () {
			this.locationManagerToBeEdited = {
				name: '',
				phone: '',
				active: 1,
				type: 'restricted'
			}
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAssignSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Stores have been assigned'
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
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showCreateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Location Manager has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Location Manager has been sent for approval'
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
			let text = 'The Location Manager has been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Location Manager has been sent for approval'
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
		toggleCreateLocationManagerPanel () {
			this.createLocationManagerCollapse = !this
				.createLocationManagerCollapse
			this.$nextTick(function () {
				if (!this.createLocationManagerCollapse) {
					this.$refs.newLocationManagerName.focus()
				}
			})
		},
		/**
		 * To clear the current error.
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
		 * @param {object} locationManager - The selected location manager.
		 * @returns {undefined}
		 */
		assignStoresToLocationManager (locationManager) {
			this.selectedLocationManager = locationManager
			this.selectedLocationManager.selectedLocations = []
			this.showAssignStoresModal = true
		},
		/**
		 * To close anything active in the side panel
		 * @function
		 * @returns {undefined}
		 */
		closeAssignStoresModal () {
			this.clearError('assignErrorMessage')
			this.showAssignStoresModal = false
		},
		/**
		 * To update the location manager object.
		 * @function
		 * @returns {undefined}
		 */
		updateLocationManager () {
			var locationManagersVue = this

			return this.validateEditedLocationManagerData()
				.then(response => {
					locationManagersVue.updating = true
					locationManagersVue.clearError('editErrorMessage')
					return AdminManagerFunctions.updateAdmin(
						locationManagersVue.locationManagerToBeEdited,
						locationManagersVue.$root.appId,
						locationManagersVue.$root.appSecret,
						locationManagersVue.$root.userToken
					)
						.then(response => {
							if (
								response.code === 200 &&
								response.status === 'ok'
							) {
								locationManagersVue.closeEditLocationManagerModal()
								locationManagersVue.showEditSuccess(response.payload)
								for (
									var i = 0;
									i < this.locationManagers.length;
									i++
								) {
									if (
										this.locationManagers[i].id ===
										locationManagersVue
											.locationManagerToBeEdited.id
									) {
										this.locationManagers[i].name =
											locationManagersVue.locationManagerToBeEdited.name
										this.locationManagers[i].phone =
											locationManagersVue.locationManagerToBeEdited.phone
										this.locationManagers[i].active =
											locationManagersVue.locationManagerToBeEdited.active
									}
								}
								locationManagersVue.resetEditForm()
								this.animated = `locationManager-${
									locationManagersVue
										.locationManagerToBeEdited.id
								}`
								window.setTimeout(() => {
									locationManagersVue.animated = ''
								}, 3000)
							} else {
								locationManagersVue.editErrorMessage =
									response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText:
									'We could not update the Location Manager',
								errorName: 'editErrorMessage',
								vue: locationManagersVue,
								containerRef: 'editModal'
							})
						})
						.finally(() => {
							locationManagersVue.updating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					locationManagersVue.editErrorMessage = reason
					window.scrollTo(0, 0)
				})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewLocationManagerData () {
			var locationManagersVue = this
			const passwordRegex = new RegExp(
				/^((?=\S*?[A-Z])(?=\S*?[0-9]).{7,})\S$/
			)
			return new Promise(function (resolve, reject) {
				if (!locationManagersVue.newLocationManager.name.length) {
					reject('Name cannot be blank')
				} else if (
					locationManagersVue.newLocationManager.phone.replace(
						/\D/g,
						''
					).length < 10
				) {
					reject('Phone number should have at least 10 digits')
				} else if (
					!locationManagersVue.newLocationManager.email.length
				) {
					reject('Email cannot be blank')
				} else if (
					!emailPattern.test(
						locationManagersVue.newLocationManager.email
					)
				) {
					reject('Please enter a valid email')
				} else if (
					!passwordRegex.test(
						locationManagersVue.newLocationManager.password
					)
				) {
					reject(
						'Password should: be at least 8 characters long, contain only English letters and numbers, contain at least one uppercase letter and one number'
					)
				} else if (
					locationManagersVue.newLocationManager.password !==
					locationManagersVue.passwordCheck
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
		validateEditedLocationManagerData () {
			var locationManagersVue = this
			return new Promise(function (resolve, reject) {
				if (
					!locationManagersVue.locationManagerToBeEdited.name.length
				) {
					reject('Name cannot be blank')
				} else if (
					locationManagersVue.locationManagerToBeEdited.phone.replace(
						/\D/g,
						''
					).length < 10
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
		StorePicker,
		RolesPicker
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
.mt-element-list .list-news.mt-list-container ul > .mt-list-item:hover {
	background-color: white;
}
</style>

<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->

    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Countries
    </h1>
    <!-- END PAGE TITLE -->
    <div class="note note-info">
      <p>Add and manage countries.</p>
    </div>

    <!-- BEGIN CREATE -->
    <div
      v-if="$root.permissions['localization countries create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create a New Country
        </div>
        <div class="tools">
          <a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}" />
        </div>
      </div>
      <div
        class="portlet-body relative-block"
        :class="{'display-hide': createNewCollapse}"
      >
        <form
          role="form"
          @submit.prevent="createCountry()"
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
                  @click.prevent="clearError('createErrorMessage')"
                />
                <span>{{ createErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  v-model="newCountry.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newCountry.name.length}"
                >
                <label for="form_control_1">
                  Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_code"
                  v-model="newCountry.code"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newCountry.code.length}"
                >
                <label for="form_control_code">
                  Code
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

    <!-- BEGIN LIST -->
    <div
      id="countries-container"
      class="portlet light portlet-fit bordered margin-top-20"
    >
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <img src="../../../../public/client_logo.png">
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            Countries
          </span>
          <div class="caption-desc font-grey-cascade">
            Create, edit or delete countries and assign languages to them.
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
          :show="loadingCountries"
          :color="'#2C3E50'"
          :display="'inline'"
        />
        <div
          v-if="countries.length && !loadingCountries"
          class="mt-element-list margin-top-15"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="country in countries"
                :id="'country-' + country.id"
                :key="country.id"
                class="mt-list-item actions-at-left margin-top-15 three-vertical-actions"
              >
                <div class="list-item-actions">
                  <el-tooltip
                    v-if="$root.permissions['localization countries update']"
                    content="Edit"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editCountry(country, $event)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['localization countries read'] && !$root.permissions['localization countries update']"
                    content="View"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editCountry(country, $event)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['localization countries update']"
                    content="Assign Promotions"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openAssignPromotionsModal(country)"
                    >
                      <i class="fa fa-lg fa-money" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['localization countries delete']"
                    content="Delete"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="confirmDelete(country, $event)"
                    >
                      <i class="fa fa-lg fa-trash" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="col-md-12 bold uppercase font-red">
                  <span>{{ country.name }}</span>
                </div>
                <div class="col-md-6">
                  <strong />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="margin-top-20">
          <no-results
            :show="!countries.length && !loadingCountries"
            :type="'countries'"
          />
        </div>
      </div>
    </div>
    <!-- END LIST -->

    <!-- START EDIT -->
    <modal
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
          Edit Country
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
                  data-close="alert"
                  @click.prevent="clearError('editErrorMessage')"
                />
                <span>{{ editErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  v-model="countryToEdit.name"
                  :disabled="!$root.permissions['localization countries update']"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': countryToEdit.name.length}"
                >
                <label for="form_control_1">
                  Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_code"
                  v-model="countryToEdit.code"
                  :disabled="!$root.permissions['localization countries update']"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': countryToEdit.code.length}"
                >
                <label for="form_control_code">
                  Code
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          v-if="!$root.permissions['localization countries update']"
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
          @click="updateCountry()"
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

    <!-- START ASSIGN PROMOTIONS -->
    <modal
      ref="assignPromotionsModal"
      :show="showAssignPromotionsModal"
      effect="fade"
      @closeOnEscape="closeAssignPromotionsModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeAssignPromotionsModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Assign Promotions to {{ countryToAssignPromotionsTo.name }}
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
                v-show="assignPromotionsErrorMessage.length"
                ref="assignPromotionsErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  data-close="alert"
                  @click.prevent="clearError('assignPromotionsErrorMessage')"
                />
                <span>{{ assignPromotionsErrorMessage }}</span>
              </div>
            </div>
            <div
              v-if="activeLocationId === undefined"
              class="col-md-12"
            >
              <div class="alert alert-info center margin-top-20">
                <h4>No Store Selected</h4>
                <p>Please select a store from the stores panel on the right to view its promotions</p>
              </div>
            </div>
            <loading-screen
              :show="loadingPromotions"
              :color="'#2C3E50'"
              :display="'inline'"
            />
            <div
              v-if="!loadingPromotions && promotions.length"
              class="col-md-12"
            >
              <table class="table">
                <thead>
                  <tr>
                    <th class="fit-to-content">
                      <div class="md-checkbox has-success">
                        <input
                          :id="`promotion-all`"
                          v-model="allPromotionsSelected"
                          type="checkbox"
                          class="md-check"
                        >
                        <label :for="`promotion-all`">
                          <span class="inc" />
                          <span class="check" />
                          <span class="box" />
                        </label>
                      </div>
                    </th>
                    <th> Promotions </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="promotion in promotions"
                    :key="promotion.id"
                  >
                    <td class="fit-to-content">
                      <div class="md-checkbox has-success">
                        <input
                          :id="`promotion-${promotion.id}`"
                          v-model="promotion.selected"
                          type="checkbox"
                          class="md-check"
                        >
                        <label :for="`promotion-${promotion.id}`">
                          <span class="inc" />
                          <span class="check" />
                          <span class="box" />
                        </label>
                      </div>
                    </td>
                    <td> {{ promotion.name }} </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-if="activeLocationId !== undefined && !loadingPromotions && !promotions.length && !assignPromotionsErrorMessage"
              class="col-md-12"
            >
              <div class="alert alert-info">
                <span>
                  No promotions exist for the selected store{{ activeLocationId === undefined ? '' : `, ${$root.activeLocation.display_name}` }}. Select another store or <router-link to="/app/promotions">
                    create a promotion
                  </router-link>.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          v-if="
            !$root.permissions['localization countries update'] ||
              activeLocationId === undefined ||
              promotions.length === 0
          "
          type="button"
          class="btn blue"
          @click="closeAssignPromotionsModal()"
        >
          Close
        </button>
        <button
          v-else
          type="submit"
          class="btn blue"
          :disabled="assigning"
          @click="assignPromotionsToCountry()"
        >
          Save
          <i
            v-show="assigning"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
    <!-- END EDIT -->

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
        <p>Are you sure you want to delete {{ countryToDelete.name }}?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="deleting"
          @click="deleteCountry()"
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
import CountriesFunctions from '@/controllers/Countries'
import PromotionsFunctions from '@/controllers/Promotions'
import Modal from '@/components/modules/Modal'
import NoResults from '@/components/modules/NoResults'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Breadcrumb,
    LoadingScreen,
    Modal,
    NoResults
  },
  data () {
    return {
      breadcrumbArray: [{ name: 'Countries', link: false }],

      createNewCollapse: true,
      creating: false,
      createErrorMessage: '',
      newCountry: {
        name: '',
        code: ''
      },

      loadingCountries: false,
      listErrorMessage: '',
      countries: [],

      showEditModal: false,
      updating: false,
      editErrorMessage: '',
      countryToEdit: {
        name: '',
        code: ''
      },

      showAssignPromotionsModal: false,
      countryToAssignPromotionsTo: {
        name: '',
        code: ''
      },
      loadingPromotions: false,
      promotions: [],
      assigning: false,
      assignPromotionsErrorMessage: '',

      showDeleteModal: false,
      deleting: false,
      deleteErrorMessage: '',
      countryToDelete: {
        name: '',
        code: ''
      }
    }
  },
  computed: {
    activeLocationId: function () {
      return this.$root.activeLocation.id
    },
    allPromotionsSelected: {
      get () {
        return !this.promotions.some(promotion => !promotion.selected)
      },
      set (value) {
        this.promotions.forEach(promotion => {
          promotion.selected = value
        })
      }
    }
  },
  watch: {
    activeLocationId: function (newId) {
      if (newId !== undefined && this.showAssignPromotionsModal) {
        this.getPromotionsForAStore()
      }
    }
  },
  mounted () {
    this.getCountries()
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
		 * To check if the country data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateNewCountryData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.newCountry.name.length) {
          reject('Name cannot be blank')
        } else if (!_this.newCountry.code.length) {
          reject('Code cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To create a new country.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    createCountry () {
      var _this = this
      _this.clearError('createErrorMessage')

      return _this
        .validateNewCountryData()
        .then(response => {
          _this.creating = true
          CountriesFunctions.createCountry(_this.newCountry)
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                _this.showCreateSuccess(response.payload)
                _this.clearNewCountry()
                _this.getCountries()
              } else {
                _this.createErrorMessage = response.message
                _this.$scrollTo(_this.$refs.createErrorMessage, 1000, {
                  offset: -50
                })
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not create the country',
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
          _this.$scrollTo(_this.$refs.createErrorMessage, 1000, { offset: -50 })
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
      let text = 'The Country has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Country has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To clear the new country form.
		 * @function
		 * @returns {undefined}
		 */
    clearNewCountry () {
      this.newCountry = {
        location_id: '',
        name: '',
        code: ''
      }
    },
    /**
		 * To get a list of all countries.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getCountries () {
      this.clearError('listErrorMessage')
      this.loadingCountries = true
      this.countries = []
      var _this = this
      return CountriesFunctions.listCountries()
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.loadingCountries = false
            _this.countries = response.payload
          } else {
            _this.loadingCountries = false
          }
        })
        .catch(reason => {
          _this.loadingCountries = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch the list of countries',
            errorName: 'listErrorMessage',
            vue: _this
          })
        })
    },
    /**
		 * To show the modal to edit an country details.
		 * @function
		 * @param {object} country - The selected country.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    editCountry (country, event) {
      event.stopPropagation()
      this.countryToEdit = { ...country }
      this.showEditModal = true
    },
    /**
		 * To check if the country data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateEditedCountryData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.countryToEdit.name.length) {
          reject('Name cannot be blank')
        } else if (!_this.countryToEdit.code.length) {
          reject('Code cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To update a country.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    updateCountry () {
      var _this = this
      _this.clearError('editErrorMessage')
      let payload = { ...this.countryToEdit }

      return _this
        .validateEditedCountryData()
        .then(response => {
          _this.updating = true
          CountriesFunctions.updateCountry(
            payload,
            _this.$root.appId,
            _this.$root.appSecret,
            _this.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                _this.getCountries()
                _this.closeEditModal()
                _this.resetEdit()
                _this.showEditSuccess(response.payload)
              } else {
                _this.editErrorMessage = response.message
                _this.$scrollTo(_this.$refs.editErrorMessage, 1000, {
                  offset: -50
                })
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the country',
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
          _this.$scrollTo(_this.$refs.editErrorMessage, 1000, { offset: -50 })
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
      let text = 'The Country has been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Country has been sent for approval'
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
      this.countryToEdit = {
        location_id: '',
        name: '',
        code: ''
      }
    },
    /**
		 * To get a list of promotions for the selected store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getPromotionsForAStore () {
      if (this.$root.activeLocation.id === undefined) return
      this.promotions = []
      var _this = this
      this.loadingPromotions = true
      return PromotionsFunctions.getPromotionsForAStore(_this.$root.activeLocation.id)
        .then(response => {
          _this.promotions = response.payload.promotions.map(promotion => {
            return {
              ...promotion,
              selected: false
            }
          })
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch promotions',
            errorName: 'assignPromotionsErrorMessage',
            vue: _this
          })
        })
        .finally(() => {
          _this.loadingPromotions = false
        })
    },
    /**
		 * To open the assign promotions modal.
		 * @function
		 * @param {object} country - Selected country
		 * @returns {undefined}
		 */
    openAssignPromotionsModal (country) {
      this.getPromotionsForAStore()
      this.countryToAssignPromotionsTo = country
      this.showAssignPromotionsModal = true
    },
    /**
		 * To check if promotions have been selected
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validatePromotionsToAssign () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.promotions.some(promotion => promotion.selected)) {
          reject('Select at least one promotion')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To assign selected promotions to a store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    assignPromotionsToCountry () {
      var _this = this
      _this.clearError('assignPromotionsErrorMessage')

      return _this
        .validatePromotionsToAssign()
        .then(response => {
          _this.assigning = true
          const payload = {
            id: _this.countryToAssignPromotionsTo.id,
            promotions: _this.promotions
              .filter(promotion => promotion.selected)
              .map(promotion => promotion.id)
          }
          CountriesFunctions.assignPromotionsToCountry({ ...payload })
            .then(response => {
              _this.closeAssignPromotionsModal()
              _this.showAssignPromotionsSuccess(response.payload)
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not assign the promotions',
                errorName: 'assignPromotionsErrorMessage',
                vue: _this,
                containerRef: 'assignPromotionsModal'
              })
            })
            .finally(() => {
              _this.assigning = false
            })
        })
        .catch(reason => {
          _this.assignPromotionsErrorMessage = reason
          _this.$scrollTo(_this.$refs.assignPromotionsErrorMessage, 1000, {
            container: _this.$refs.assignPromotionsModal.$el
          })
        })
    },
    closeAssignPromotionsModal () {
      this.showAssignPromotionsModal = false
      this.clearError('assignPromotionsErrorMessage')
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showAssignPromotionsSuccess (payload = {}) {
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'The Promotions have been saved'
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
		 * To display the modal for deleting an country.
		 * @function
		 * @param {object} country - The selected country
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    confirmDelete (country, event) {
      event.stopPropagation()
      this.countryToDelete = { ...country }
      this.showDeleteModal = true
    },
    /**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
    deleteCountry () {
      this.deleting = true
      var _this = this
      return CountriesFunctions.deleteCountry(_this.countryToDelete)
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.getCountries()
            _this.closeDeleteModal()
            _this.showDeleteSuccess(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: `We could not delete ${this.countryToDelete.name}`,
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
    showDeleteSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Country has been deleted'
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
.three-vertical-actions {
  min-height: 124px;
}
.fit-to-content {
	width: 1%;
}
</style>

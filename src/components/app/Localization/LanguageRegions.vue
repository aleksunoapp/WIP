<template>
  <div>
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>

    <h1 class="page-title">
      Language Regions
    </h1>

    <div class="note note-info">
      <p>Add and manage language regions.</p>
    </div>

    <!-- BEGIN CREATE -->
    <div
      v-if="can('localization locale_regions create')"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create a New Language Region
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
          @submit.prevent="createLanguageRegion()"
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
              <div class="autocomplete-wrapper">
                <label
                  for="form_control_create_name"
                  class="fake-md-label"
                  :class="{
                    'raised' : newLanguageRegion.name.length ||
                      autocompleteFocusedCreate
                  }"
                >
                  Name
                </label>
                <el-autocomplete
                  id="form_control_create_name"
                  v-model="newLanguageRegion.name"
                  class="inline-input md-autocomplete"
                  :class="{'raised' : newLanguageRegion.name}"
                  label="Name"
                  :fetch-suggestions="querySearchCreate"
                  :trigger-on-focus="false"
                  @select="selectLocationCreate"
                  @focus="focusAutocompleteCreate"
                  @blur="blurAutocompleteCreate"
                />
              </div>
              <label>
                Language:
                <el-select
                  v-model="newLanguageRegion.locale_id"
                  placeholder="English"
                  size="small"
                  no-data-text="No languages"
                  remote
                  :loading="loadingLanguages"
                >
                  <el-option
                    v-for="language in languages"
                    :key="language.id"
                    :label="language.name"
                    :value="language.id"
                  />
                </el-select>
              </label>
              <map-area
                v-if="!createNewCollapse"
                ref="createMap"
                :lat="latitude"
                :lng="longitude"
                width="100%"
                height="500px"
                class="margin-top-20"
                @polygonEmitted="updateNewLanguageRegion"
              />
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
      id="languages-container"
      class="portlet light portlet-fit bordered margin-top-20"
    >
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <img src="../../../../public/client_logo.png">
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            Language Regions
          </span>
          <div class="caption-desc font-grey-cascade">
            Create, edit or delete language regions.
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
          :show="loadingLanguageRegions"
          :color="'#2C3E50'"
          :display="'inline'"
        />
        <div
          v-if="languageRegions.length && !loadingLanguageRegions"
          class="mt-element-list margin-top-15"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="languageRegion in languageRegions"
                :key="languageRegion.id"
                class="mt-list-item actions-at-left margin-top-15 three-vertical-actions"
              >
                <div class="list-item-actions">
                  <el-tooltip
                    v-if="can('localization locale_regions update')"
                    content="Edit"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editLanguageRegion(languageRegion, $event)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-else
                    content="View"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editLanguageRegion(languageRegion, $event)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="can('localization locale_regions delete')"
                    content="Delete"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openDeleteModal(languageRegion, $event)"
                    >
                      <i class="fa fa-lg fa-trash" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="col-md-12 bold uppercase font-red">
                  <span>{{ languageRegion.name }} - {{ languageNames[languageRegion.locale_id] }}</span>
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
            :show="!languageRegions.length && !loadingLanguageRegions"
            :type="'language regions'"
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
          Edit Language Region
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
              <div class="autocomplete-wrapper">
                <label
                  for="form_control_create_name"
                  class="fake-md-label"
                  :class="{
                    'raised' : languageRegionToEdit.name.length ||
                      autocompleteFocusedEdit
                  }"
                >
                  Name
                </label>
                <el-autocomplete
                  id="form_control_edit_name"
                  ref="autocompleteEdit"
                  v-model="languageRegionToEdit.name"
                  class="inline-input md-autocomplete"
                  :class="{'raised' : languageRegionToEdit.name}"
                  label="Name"
                  :fetch-suggestions="querySearchEdit"
                  :trigger-on-focus="false"
                  @select="selectLocationEdit"
                  @focus="focusAutocompleteEdit"
                  @blur="blurAutocompleteEdit"
                />
              </div>
              <label>
                Language:
                <el-select
                  v-model="languageRegionToEdit.locale_id"
                  :disabled="!can('localization locale_regions update')"
                  placeholder="English"
                  size="small"
                  no-data-text="No languages"
                  remote
                  :loading="loadingLanguages"
                >
                  <el-option
                    v-for="language in languages"
                    :key="language.id"
                    :label="language.name"
                    :value="language.id"
                  />
                </el-select>
              </label>
              <map-area
                v-if="showEditModal"
                ref="editMap"
                :polygons="[languageRegionToEdit]"
                :lat="latitude"
                :lng="longitude"
                width="100%"
                height="500px"
                :editable="can('localization locale_regions update')"
                class="margin-top-20"
                @polygonEmitted="updateLanguageRegionToEdit"
              />
            </div>
          </div>
        </form>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          v-if="!can('localization locale_regions update')"
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
          @click="updateLanguageRegion()"
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
          Delete Language Region
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
                v-show="deleteErrorMessage.length"
                ref="deleteErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  @click.prevent="clearError('deleteErrorMessage')"
                />
                <span>{{ deleteErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-12">
              <p>Are you sure you want to delete the Language Region?</p>
            </div>
          </div>
        </form>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="submit"
          class="btn blue"
          :disabled="deleting"
          @click="deleteLanguageRegion()"
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
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import LanguagesFunctions from '@/controllers/Languages'
import LanguageRegionsFunctions from '@/controllers/LanguageRegions'
import AppFunctions from '@/controllers/App'
import Modal from '@/components/modules/Modal'
import NoResults from '@/components/modules/NoResults'
import MapArea from '@/components/modules/MapArea'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'

export default {
  data () {
    return {
      breadcrumbArray: [{ name: 'Language Regions', link: false }],

      createNewCollapse: true,
      creating: false,
      createErrorMessage: '',
      newLanguageRegion: {
        locale_id: null,
        name: '',
        region: []
      },
      autocompleteFocusedCreate: false,

      loadingLanguageRegions: false,
      listErrorMessage: '',
      languageRegions: [],

      showEditModal: false,
      updating: false,
      editErrorMessage: '',
      languageRegionToEdit: {
        locale_id: null,
        name: '',
        region: []
      },
      autocompleteFocusedEdit: false,

      showDeleteModal: false,
      deleting: false,
      languageRegionToDelete: {},
      deleteErrorMessage: '',

      loadingLanguages: false,
      languages: []
    }
  },
  computed: {
    activeLocationId: function () {
      return this.$root.activeLocation.id
    },
    languageNames () {
      let languageNames = {}
      this.languages.forEach(language => {
        languageNames[language.id] = language.name
      })
      return languageNames
    },
    latitude () {
      if (
        this.$root.activeLocation.latitude !== null &&
				this.$root.activeLocation.latitude !== undefined
      ) {
        return Number(this.$root.activeLocation.latitude)
      } else {
        return 43.6532
      }
    },
    longitude () {
      if (
        this.$root.activeLocation.longitude !== null &&
				this.$root.activeLocation.longitude !== undefined
      ) {
        return Number(this.$root.activeLocation.longitude)
      } else {
        return -79.3832
      }
    },
    ...mapGetters(['can', 'canAny'])
  },
  watch: {
    activeLocationId: function (newId) {
      if (newId !== undefined) {
        this.getLanguageRegions()
        this.getLanguages()
      }
    }
  },
  mounted () {
    this.getLanguageRegions()
    this.getLanguages()
  },
  methods: {
    /**
		 * To get a list of all language regions.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getLanguageRegions () {
      this.loadingLanguageRegions = true
      this.languageRegions = []
      var _this = this
      return LanguageRegionsFunctions.listLocaleRegions()
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.languageRegions = response.payload
          } else {
            throw new Error()
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText:
							'We could not fetch the list of language regions',
            errorName: 'listErrorMessage',
            vue: _this
          })
        })
        .finally(() => {
          _this.loadingLanguageRegions = false
        })
    },
    /**
		 * To get a list of all languages.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getLanguages () {
      this.clearError('listErrorMessage')
      this.loadingLanguages = true
      this.languages = []
      var _this = this
      return LanguagesFunctions.listLanguages()
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.languages = response.payload
          } else {
            throw new Error()
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch the list of languages',
            errorName: 'listErrorMessage',
            vue: _this
          })
        })
        .finally(() => {
          _this.loadingLanguages = false
        })
    },
    /**
		 * To toggle the create panel
		 * @function
		 * @returns {undefined}
		 */
    toggleCreatePanel () {
      this.createNewCollapse = !this.createNewCollapse
    },
    /**
		 * To get results based off google's places search API.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    querySearchCreate: debounce(function (string, cb) {
      var _this = this
      if (_this.newLanguageRegion.name.length >= 3) {
        AppFunctions.getGoogleLocationSearchResults(
          _this.newLanguageRegion.name
        )
          .then(response => {
            response.forEach(result => {
              result.value = result.description
            })
            cb(response)
          })
          .catch(reason => {
            throw reason
          })
      }
    }, 500),
    /**
		 * To get results based off google's places search API.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    querySearchEdit: debounce(function (string, cb) {
      var _this = this
      if (_this.languageRegionToEdit.name.length >= 3) {
        AppFunctions.getGoogleLocationSearchResults(
          _this.languageRegionToEdit.name
        )
          .then(response => {
            response.forEach(result => {
              result.value = result.description
            })
            cb(response)
          })
          .catch(reason => {
            throw reason
          })
      }
    }, 500),
    /**
		 * To set the selected location and get its details.
		 * @function
		 * @param {object} location - The selected location object.
		 * @returns {undefined}
		 */
    selectLocationCreate (location) {
      this.getGoogleLocationDetails(
        location.place_id,
        this.newLanguageRegion,
        'createMap'
      )
    },
    /**
		 * To set the selected location and get its details.
		 * @function
		 * @param {object} location - The selected location object.
		 * @returns {undefined}
		 */
    selectLocationEdit (location) {
      this.getGoogleLocationDetails(
        location.place_id,
        this.languageRegionToEdit,
        'editMap'
      )
    },
    /**
		 * To get complete details of a particular location using the google places API.
		 * @function
		 * @param {string} placeId - To google placeId of the selected location.
		 * @param {string} languageRegion - The language region object to update
		 * @param {string} mapReference - Reference of the map component to use
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getGoogleLocationDetails (placeId, languageRegion, mapReference) {
      var _this = this
      AppFunctions.getGoogleLocationDetails(placeId)
        .then(response => {
          languageRegion.name = response.name
          const bounds = [
            [
              response.geometry.viewport.southwest.lat,
              response.geometry.viewport.southwest.lng
            ],
            [
              response.geometry.viewport.northeast.lat,
              response.geometry.viewport.northeast.lng
            ]
          ]
          const center = response.geometry.location
          _this.$refs[mapReference].panAndCenter(bounds, center)
        })
        .catch(reason => {})
    },
    /**
		 * To raise the autocomplete label.
		 * @function
		 * @returns {undefined}
		 */
    focusAutocompleteCreate () {
      this.autocompleteFocusedCreate = true
    },
    /**
		 * To lower the autocomplete label.
		 * @function
		 * @returns {undefined}
		 */
    blurAutocompleteCreate () {
      this.autocompleteFocusedCreate = false
    },
    /**
		 * To raise the autocomplete label.
		 * @function
		 * @returns {undefined}
		 */
    focusAutocompleteEdit () {
      this.autocompleteFocusedEdit = true
    },
    /**
		 * To lower the autocomplete label.
		 * @function
		 * @returns {undefined}
		 */
    blurAutocompleteEdit () {
      this.autocompleteFocusedEdit = false
    },

    /**
		 * To update map area when user creates or edits it
		 * @function
		 * @param {array} polygons - An array of objects containing polygon paths and color
		 * @returns {undefined}
		 */
    updateNewLanguageRegion (polygons) {
      if (polygons.length) {
        this.newLanguageRegion.region = polygons[0].paths
      } else {
        this.newLanguageRegion.region = []
      }
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
		 * To check if the language region data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateNewLanguageRegionData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.newLanguageRegion.name.length) {
          reject('Name cannot be blank')
        } else if (_this.newLanguageRegion.locale_id === null) {
          reject('Select a language')
        } else if (!_this.newLanguageRegion.region.length) {
          reject('Draw an area on the map')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To create a new language.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    createLanguageRegion () {
      var _this = this
      _this.clearError('createErrorMessage')

      return _this
        .validateNewLanguageRegionData()
        .then(response => {
          _this.creating = true
          LanguageRegionsFunctions.createLocaleRegion(
            _this.newLanguageRegion
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                _this.showCreateSuccess(response.payload)
                _this.clearNewLanguageRegion()
                _this.getLanguageRegions()
              } else {
                throw new Error()
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText:
									'We could not create the Language Region',
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
          _this.$scrollTo(_this.$refs.createErrorMessage, 1000, {
            offset: -50
          })
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
      let text = 'The Language Region has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Language Region has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To clear the new language form.
		 * @function
		 * @returns {undefined}
		 */
    clearNewLanguageRegion () {
      this.createNewCollapse = true
      this.newLanguageRegion = {
        locale_id: null,
        name: '',
        region: [],
        paths: []
      }
    },
    /**
		 * To show the modal to edit a language region.
		 * @function
		 * @param {object} languageRegion - The selected language region.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    editLanguageRegion (languageRegion, event) {
      event.stopPropagation()
      this.languageRegionToEdit = {
        id: languageRegion.id,
        name: languageRegion.name,
        locale_id: languageRegion.locale_id,
        region: languageRegion.region,
        paths: languageRegion.region
      }
      this.showEditModal = true
    },
    /**
		 * To update map area when user creates or edits it
		 * @function
		 * @param {array} polygons - An array of objects containing polygon paths and color
		 * @returns {undefined}
		 */
    updateLanguageRegionToEdit (polygons) {
      if (polygons.length) {
        this.languageRegionToEdit.region = polygons[0].paths
      } else {
        this.languageRegionToEdit.region = []
      }
    },
    /**
		 * To check if the language region data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateEditedLanguageRegionData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.languageRegionToEdit.name.length) {
          reject('Name cannot be blank')
        } else if (!_this.languageRegionToEdit.region.length) {
          reject('Draw an area on the map')
        } else if (_this.languageRegionToEdit.locale_id === null) {
          reject('Select a language')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To update a language region.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    updateLanguageRegion () {
      var _this = this
      _this.clearError('editErrorMessage')
      let payload = { ...this.languageRegionToEdit }

      return _this
        .validateEditedLanguageRegionData()
        .then(response => {
          _this.updating = true
          LanguageRegionsFunctions.updateLocaleRegion(payload)
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                _this.getLanguageRegions()
                _this.closeEditModal()
                _this.resetEdit()
                _this.showEditSuccess(response.payload)
              } else {
                _this.editErrorMessage = response.message
                _this.$scrollTo(
                  _this.$refs.editErrorMessage,
                  1000,
                  {
                    offset: -50
                  }
                )
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the language',
                errorName: 'editErrorMessage',
                vue: _this,
                containerRef: 'editModal'
              })
            })
            .finally(() => {
              _this.updating = false
            })
        })
        .catch(reason => {
          _this.editErrorMessage = reason
          _this.$scrollTo(_this.$refs.editErrorMessage, 1000, {
            offset: -50
          })
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
      let text = 'The Language Region has been saved'
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
      this.clearError('editErrorMessage')
      this.showEditModal = false
    },
    /**
		 * To reset the edit form
		 * @function
		 * @returns {undefined}
		 */
    resetEdit () {
      this.languageRegionToEdit = {
        locale_id: null,
        name: '',
        region: []
      }
    },
    /**
		 * To open the delete modal
		 * @function
		 * @param {object} languageRegion - The language region to delete
		 * @returns {undefined}
		 */
    openDeleteModal (languageRegion) {
      this.languageRegionToDelete = languageRegion
      this.showDeleteModal = true
    },
    /**
		 * To make the delete call
		 * @function
		 * @returns {undefined}
		 */
    deleteLanguageRegion () {
      this.deleting = true
      var _this = this
      return LanguageRegionsFunctions.deleteLocaleRegion(
        _this.languageRegionToDelete
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.getLanguageRegions()
            _this.closeDeleteModal()
            _this.showDeleteSuccess(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: `We could not delete the Language Region`,
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
    showDeleteSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Language Region has been deleted'
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
    }
  },
  components: {
    Breadcrumb,
    LoadingScreen,
    Modal,
    NoResults,
    MapArea
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
.md-autocomplete {
	width: 100%;
	height: 100%;
}
div.autocomplete-wrapper {
	margin-top: 35px;
	height: 45px;
	position: relative;
	width: 100%;
}
.fake-md-label {
	position: absolute;
	top: 4px;
	left: 0;
	color: #999;
	margin-bottom: 0;
	font-size: 14px;
	z-index: 2;
	pointer-events: none;
	transition-property: top, font-size, font-color, border-bottom-color;
	transition-duration: 0.2s;
	transition-timing-function: ease;
}
.fake-md-label.raised {
	font-size: 13px;
	top: -21px;
}
</style>
<style>
div.el-autocomplete.inline-input.md-autocomplete > div.el-input {
	height: 100%;
}
div.el-autocomplete.inline-input.md-autocomplete
	> div.el-input
	> input.el-input__inner {
	border-top-width: 0px;
	border-right-width: 0px;
	border-bottom-color: rgb(194, 202, 216);
	border-bottom-style: solid;
	border-bottom-width: 1px;
	border-left-width: 0px;
	border-bottom: 1px solid #c2cad8;
	border-bottom-width: 1px;
	border-bottom-style: solid;
	border-bottom-color: rgb(194, 202, 216);
	padding: 6px 0;
	border-radius: 0;
	height: 30px;
	margin-bottom: 10px;
	transition-property: border-bottom-color, border-bottom-width;
	transition-duration: 0.2s;
	transition-timing-function: ease;
}
div.el-autocomplete.inline-input.md-autocomplete.raised
	> div.el-input
	> input.el-input__inner {
	border-bottom-color: #36c6d3;
	border-bottom-width: 2px;
}
div.el-autocomplete.inline-input.md-autocomplete
	> div.el-input
	> input.el-input__inner::placeholder {
	color: #999;
}
</style>

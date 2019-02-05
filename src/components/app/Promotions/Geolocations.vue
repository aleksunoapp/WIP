<template>
  <div>
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <h1 class="page-title">
      Geolocations
    </h1>
    <div class="note note-info">
      <p>Create and manage geolocations.</p>
    </div>

    <!-- BEGIN CREATE NEW -->
    <div
      v-if="$root.permissions['promotions geolocations create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleNewPanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create New Geolocation
        </div>
        <div class="tools">
          <a :class="{'expand': !newCollapse, 'collapse': newCollapse}" />
        </div>
      </div>
      <div
        class="portlet-body"
        :class="{'display-hide': newCollapse}"
      >
        <div class="form-group form-md-line-input form-md-floating-label">
          <form
            role="form"
            @submit.prevent="createNewGeolocation()"
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
                    id="form_control_1"
                    v-model="newGeolocation.name"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newGeolocation.name.length}"
                  >
                  <label for="form_control_1">
                    Name
                  </label>
                </div>
                <map-area
                  v-if="!newCollapse"
                  :lat="latitude"
                  :lng="longitude"
                  width="100%"
                  height="500px"
                  @polygonEmitted="updateNewPolygon"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <button
                  type="submit"
                  class="btn blue pull-right margin-top-20"
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
    </div>
    <!-- END CREATE NEW -->

    <!-- LIST START -->
    <div class="portlet light portlet-fit bordered margin-top-20">
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <img src="../../../../public/client_logo.png">
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            Geolocations
          </span>
          <div class="caption-desc font-grey-cascade">
            See and edit geolocations
          </div>
        </div>
      </div>
      <div class="portlet-body relative-block">
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

        <loading-screen
          :show="loadingGeolocations"
          :color="'#2C3E50'"
          :display="'inline'"
        />

        <div class="mt-element-list">
          <div class="mt-list-container list-news">
            <ul>
              <li
                v-for="gl in geolocations"
                :key="gl.id"
                class="mt-list-item actions-at-left margin-top-15"
                :class="{'animated' : animated === gl.id}"
              >
                <div class="list-item-actions">
                  <el-tooltip
                    v-if="$root.permissions['promotions geolocations update']"
                    content="Edit"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default clickable"
                      @click="editGeolocation(gl)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['promotions geolocations read'] && !$root.permissions['promotions geolocations update']"
                    content="View"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default clickable"
                      @click="editGeolocation(gl)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['promotions geolocations delete']"
                    content="Delete"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default clickable"
                      @click="openDelete(gl)"
                    >
                      <i class="fa fa-lg fa-trash" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ gl.name }}</span>
                </div>
                <div class="list-item-content height-mod" />
              </li>
            </ul>
          </div>
        </div>
        <div v-if="!loadingGeolocations && !geolocations.length">
          <no-results
            :show="true"
            :type="'printers'"
          />
        </div>
      </div>
    </div>
    <!-- LIST END -->

    <!-- EDIT MODAL START -->
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
          Edit Geolocation
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
        <div class="row">
          <div class="col-md-6">
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_1"
                v-model="editedGeolocation.name"
                :disabled="!$root.permissions['promotions geolocations update']"
                type="text"
                class="form-control input-sm"
                :class="{'edited': editedGeolocation.name.length}"
              >
              <label for="form_control_1">
                Geolocation Name
              </label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <map-area
              v-if="showEditModal"
              :polygons="[editedGeolocation]"
              :editable="$root.permissions['promotions geolocations update']"
              width="100%"
              height="500px"
              @polygonEmitted="updateEditedPolygon"
            />
          </div>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          v-if="!$root.permissions['promotions geolocations update']"
          type="button"
          class="btn btn-primary"
          @click="closeEditModal()"
        >
          Close
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary"
          :disabled="updating"
          @click="updateGeolocation()"
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
          Delete Geolocation
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="deleteErrorMessage"
          ref="deleteErrorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click="clearError('deleteErrorMessage')"
          />
          <span>{{ deleteErrorMessage }}</span>
        </div>
        <div class="col-md-12">
          Are you sure you want to delete '{{ selectedGeolocation.name }}'?
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          type="button"
          class="btn btn-primary"
          :disabled="deleting"
          @click="deleteGeolocation()"
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
import PromotionsFunctions from '../../../controllers/Promotions'
import Modal from '../../modules/Modal'
import MapArea from '../../modules/MapArea'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Breadcrumb,
    LoadingScreen,
    NoResults,
    Modal,
    MapArea
  },
  data () {
    return {
      breadcrumbArray: [{ name: 'Geolocations', link: false }],
      newCollapse: true,
      creating: false,
      newGeolocation: {
        name: '',
        polygon: []
      },
      createErrorMessage: '',
      loadingGeolocations: false,
      listErrorMessage: '',
      geolocations: [],
      showEditModal: false,
      updating: false,
      editErrorMessage: '',
      editedGeolocation: {
        name: '',
        id: 0
      },
      animated: null,
      showDeleteModal: false,
      selectedGeolocation: {
        name: '',
        id: 0
      },
      deleting: false,
      deleteErrorMessage: ''
    }
  },
  computed: {
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
    }
  },
  mounted () {
    this.getGeolocations()
  },
  methods: {
    /**
		 * To update map area when user creates or edits it
		 * @function
		 * @param {array} polygons - An array of objects containing polygon paths and color
		 * @returns {undefined}
		 */
    updateEditedPolygon (polygons) {
      if (polygons.length) {
        this.editedGeolocation.polygon = polygons[0].paths
      } else {
        this.editedGeolocation.polygon = []
      }
    },
    /**
		 * To update map area when user creates or edits it
		 * @function
		 * @param {array} polygons - An array of objects containing polygon paths and color
		 * @returns {undefined}
		 */
    updateNewPolygon (polygons) {
      if (polygons.length) {
        this.newGeolocation.polygon = polygons[0].paths
      } else {
        this.newGeolocation.polygon = []
      }
    },
    /**
		 * To toggle the create new panel
		 * @function
		 * @returns {undefined}
		 */
    toggleNewPanel () {
      this.newCollapse = !this.newCollapse
    },
    /**
		 * To get a list of geolocations.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getGeolocations () {
      this.loadingGeolocations = true
      var geolocationsVue = this
      PromotionsFunctions.getGeolocations(
        geolocationsVue.$root.appId,
        geolocationsVue.$root.appSecret,
        geolocationsVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            geolocationsVue.geolocations = response.payload
            geolocationsVue.loadingGeolocations = false
          } else {
            geolocationsVue.loadingGeolocations = false
          }
        })
        .catch(reason => {
          geolocationsVue.loadingGeolocations = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch geolocations',
            errorName: 'listErrorMessage',
            vue: geolocationsVue
          })
        })
    },
    /**
		 * To check if the data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateGeolocationData () {
      var geolocationsVue = this
      return new Promise(function (resolve, reject) {
        if (!geolocationsVue.newGeolocation.name.length) {
          reject('Geolocation name cannot be blank')
        } else if (!geolocationsVue.newGeolocation.polygon.length) {
          reject('Please draw an area on the map.')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To create a geolocation.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    createNewGeolocation () {
      var geolocationsVue = this
      return this.validateGeolocationData()
        .then(response => {
          geolocationsVue.creating = true
          PromotionsFunctions.createGeolocation(
            geolocationsVue.$root.appId,
            geolocationsVue.$root.appSecret,
            geolocationsVue.$root.userToken,
            geolocationsVue.newGeolocation
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                geolocationsVue.getGeolocations()
                geolocationsVue.resetForm()
                geolocationsVue.confirmCreated(response.payload)
              } else {
                geolocationsVue.createErrorMessage = 'Something went wrong ...'
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not add the geolocations',
                errorName: 'createErrorMessage',
                vue: geolocationsVue
              })
            })
            .finally(() => {
              geolocationsVue.creating = false
            })
        })
        .catch(reason => {
          geolocationsVue.createErrorMessage = reason
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
      let text = 'The Geolocation has been created'
      let type = 'success'

      if (payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Geolocation has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To clear the error.
		 * @function
		 * @param {string} type - The type of error to clear
		 * @returns {undefined}
		 */
    clearError (type) {
      this[type] = ''
    },
    /**
		 * To reset the create form.
		 * @function
		 * @returns {undefined}
		 */
    resetForm () {
      this.newCollapse = true
      this.newGeolocation = {
        name: '',
        polygon: []
      }
    },
    /**
		 * To close the edit modal
		 * @function
		 * @returns {undefined}
		 */
    closeEditModal () {
      this.editedGeolocation.name = ''
      this.editedGeolocation.id = 0
      this.showEditModal = false
    },
    /**
		 * To check if the data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateEditedData () {
      var geolocationsVue = this
      return new Promise(function (resolve, reject) {
        if (!geolocationsVue.editedGeolocation.name.length) {
          reject('Geolocation name cannot be blank')
        } else if (!geolocationsVue.editedGeolocation.polygon.length) {
          reject('Please draw an area on the map.')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To update the geolocation
		 * @function
		 * @returns {undefined}
		 */
    updateGeolocation () {
      var geolocationsVue = this
      return this.validateEditedData()
        .then(response => {
          geolocationsVue.updating = true
          PromotionsFunctions.updateGeolocation(
            geolocationsVue.$root.appId,
            geolocationsVue.$root.appSecret,
            geolocationsVue.$root.userToken,
            geolocationsVue.editedGeolocation
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                geolocationsVue.getGeolocations()
                geolocationsVue.resetEdited()
                geolocationsVue.closeEditModal()
                geolocationsVue.confirmEdited(response.payload)
              } else {
                throw response
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the geolocation',
                errorName: 'editErrorMessage',
                vue: geolocationsVue,
                containerRef: 'editModal'
              })
            })
            .finally(() => {
              geolocationsVue.updating = false
            })
        })
        .catch(reason => {
          geolocationsVue.editErrorMessage = reason
          geolocationsVue.$scrollTo(
            geolocationsVue.$refs.editErrorMessage,
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
    confirmEdited (payload = {}) {
      let title = 'Success'
      let text = 'The Geolocation has been saved'
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
		 * To open the edit modal
		 * @function
		 * @param {object} geolocation - The geolocation to edit
		 * @returns {undefined}
		 */
    editGeolocation (geolocation) {
      this.editedGeolocation.name = geolocation.name
      this.editedGeolocation.polygon = geolocation.polygon
      this.editedGeolocation.paths = geolocation.polygon
      this.editedGeolocation.id = geolocation.id
      this.showEditModal = true
    },
    /**
		 * To clear the edited geolocation
		 * @function
		 * @returns {undefined}
		 */
    resetEdited () {
      this.editedGeolocation.name = ''
      this.editedGeolocation.id = 0
    },
    /**
		 * To clear the selected geolocation
		 * @function
		 * @returns {undefined}
		 */
    resetSelected () {
      this.selectedGeolocation.name = ''
      this.selectedGeolocation.id = 0
    },
    /**
		 * To close the delte modal
		 * @function
		 * @returns {undefined}
		 */
    closeDeleteModal () {
      this.showDeleteModal = false
    },
    /**
		 * To open the delete modal
		 * @function
		 * @param {object} geolocation - The selected geolocation
		 * @returns {undefined}
		 */
    openDelete (geolocation) {
      this.selectedGeolocation.name = geolocation.name
      this.selectedGeolocation.id = geolocation.id
      this.showDeleteModal = true
    },
    /**
		 * To update the geolocation
		 * @function
		 * @returns {undefined}
		 */
    deleteGeolocation () {
      this.deleting = true
      let geolocationsVue = this
      PromotionsFunctions.deleteGeolocation(
        geolocationsVue.$root.appId,
        geolocationsVue.$root.appSecret,
        geolocationsVue.$root.userToken,
        geolocationsVue.selectedGeolocation
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            geolocationsVue.getGeolocations()
            geolocationsVue.resetSelected()
            geolocationsVue.closeDeleteModal()
            geolocationsVue.confirmDeleted(response.payload)
          } else {
            geolocationsVue.deleteErrorMessage = 'Something went wrong ...'
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the geolocation',
            errorName: 'deleteErrorMessage',
            vue: geolocationsVue,
            containerRef: 'deleteModal'
          })
        })
        .finally(() => {
          geolocationsVue.deleting = false
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    confirmDeleted (payload = {}) {
      let title = 'Success'
      let text = 'The Geolocation has been deleted'
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
  background-color: rgb(255, 255, 255);
}
</style>

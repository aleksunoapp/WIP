<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->

    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Amenities
    </h1>
    <!-- END PAGE TITLE -->
    <div class="note note-info">
      <p>Add and manage a store amenities.</p>
    </div>

    <!-- BEGIN CREATE -->
    <div
      v-if="$root.permissions['stores amenities create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create a New Amenity
        </div>
        <div class="tools">
          <a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}" />
        </div>
      </div>
      <div
        class="portlet-body"
        :class="{'display-hide': createNewCollapse}"
      >
        <form
          role="form"
          @submit.prevent="createAmenity()"
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
            <div :class="{'col-md-2 col-md-offset-2' : !newAmenity.selectImageMode, 'col-md-12' : newAmenity.selectImageMode}">
              <resource-picker
                :image-button="true"
                :image-url="newAmenity.image_url"
                class="margin-top-15"
                @open="toggleImageMode(newAmenity, true)"
                @close="toggleImageMode(newAmenity, false)"
                @selected="updateNewImage"
              />
            </div>
          </div>
          <div
            v-show="!newAmenity.selectImageMode"
            class="row"
          >
            <div class="col-md-6">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  v-model="newAmenity.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newAmenity.name.length}"
                >
                <label for="form_control_1">
                  Amenity Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_3"
                  v-model="newAmenity.order"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newAmenity.order.length}"
                >
                <label for="form_control_3">
                  Amenity Order
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
    <div>
      <div
        id="amenities-container"
        class="portlet light portlet-fit bordered margin-top-20"
      >
        <div class="portlet-title bg-blue-chambray">
          <div class="menu-image-main">
            <img src="../../../../public/client_logo.png">
          </div>
          <div class="caption">
            <span class="caption-subject font-default bold uppercase">
              Amenities
            </span>
            <div
              v-if="$root.accountType !== 'store_admin'"
              class="caption-desc font-grey-cascade"
            >
              Create, edit or delete amenities and assign them to the active store.
            </div>
            <div
              v-if="$root.accountType === 'store_admin'"
              class="caption-desc font-grey-cascade"
            >
              View amenities and assign them to the active store.
            </div>
          </div>
        </div>
        <div class="portlet-body relative-block">
          <div
            v-if="activeLocationId === undefined"
            class="col-md-12"
          >
            <div class="alert center alert-info">
              <h4>No Store Selected</h4>
              <p>Please select a store from the stores panel on the right to view amenities and apply them to the store.</p>
            </div>
          </div>
          <div v-else>
            <div class="row">
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
            </div>
            <loading-screen
              :show="loadingAmenities"
              :color="'#2C3E50'"
              :display="'inline'"
            />
            <div
              v-if="amenities.length && !loadingAmenities"
              class="mt-element-list margin-top-15"
            >
              <div
                v-show="activeLocationId"
                class="mt-list-container list-news ext-1 no-border"
              >
                <ul>
                  <li
                    v-for="amenity in amenities"
                    :id="'amenity-' + amenity.id"
                    :key="amenity.id"
                    class="mt-list-item actions-at-left margin-top-15"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="!$root.permissions['stores amenities update'] && !$root.permissions['stores amenities read']"
                        content="View"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editAmenity(amenity, $event)"
                        >
                          <i class="fa fa-lg fa-eye" />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['stores amenities update']"
                        content="Edit"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="editAmenity(amenity, $event)"
                        >
                          <i class="fa fa-lg fa-pencil" />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['stores amenities delete']"
                        content="Delete"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="confirmDelete(amenity, $event)"
                        >
                          <i class="fa fa-lg fa-trash" />
                        </a>
                      </el-tooltip>
                    </div>
                    <div class="list-thumb">
                      <img
                        v-if="amenity.image_url.length"
                        :src="amenity.image_url"
                      >
                      <img
                        v-else
                        src="../../../assets/img/app/image-placeholder.png"
                      >
                    </div>
                    <div class="list-datetime bold uppercase font-red">
                      <span>{{ amenity.name }}</span>
                    </div>
                    <div class="list-item-content height-mod">
                      <div class="col-xs-5">
                        <strong>Order:</strong>
                        <span>{{ amenity.order }}</span>
                      </div>
                      <div class="">
                        <div v-if="amenity.selected">
                          <button
                            class="btn btn-success custom-button full-width"
                            :disabled="!$root.permissions['stores amenities update']"
                            @click="toggleChecked(amenity, $event)"
                          >
                            <i class="fa fa-2x fa-check" />
                          </button>
                        </div>
                        <div v-if="!amenity.selected">
                          <button
                            class="btn btn-danger custom-button full-width"
                            :disabled="!$root.permissions['stores amenities update']"
                            @click="toggleChecked(amenity, $event)"
                          >
                            <i class="fa fa-2x fa-times" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div
                  v-show="$root.activeLocation.id !== undefined"
                  class="form-actions right margin-top-20"
                >
                  <button
                    type="button"
                    class="btn blue"
                    :disabled="!$root.permissions['stores amenities update'] || assigning"
                    @click="assignAmenitiesToLocation()"
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
            <div class="margin-top-20">
              <no-results
                :show="!amenities.length && !loadingAmenities"
                :type="'amenities'"
              />
            </div>
          </div>
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
        <h4
          v-if="!$root.permissions['stores amenities update']"
          class="modal-title center"
        >
          View Amenity
        </h4>
        <h4
          v-if="$root.permissions['stores amenities update']"
          class="modal-title center"
        >
          Edit Amenity
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
            <div :class="{'col-xs-4 col-xs-offset-4' : !selectImageMode, 'col-xs-12' : selectImageMode}">
              <resource-picker
                button-text="Select Image"
                :is-modal="false"
                :image-url="amenityToEdit.image_url"
                :image-button="true"
                class="margin-top-15"
                :disabled="!$root.permissions['stores amenities update']"
                @open="imageEdit()"
                @close="mainEdit()"
                @selected="updateEditedImage"
              />
            </div>
            <div
              v-show="!selectImageMode"
              class="col-xs-12"
            >
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  v-model="amenityToEdit.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': amenityToEdit.name.length}"
                  :disabled="!$root.permissions['stores amenities update']"
                >
                <label for="form_control_1">
                  Amenity Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_3"
                  v-model="amenityToEdit.order"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': amenityToEdit.order.length}"
                  :disabled="!$root.permissions['stores amenities update']"
                >
                <label for="form_control_3">
                  Amenity Order
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
          v-show="!selectImageMode"
          v-if="$root.permissions['stores amenities update']"
          type="submit"
          class="btn blue"
          :disabled="updating"
          @click="updateAmenity()"
        >
          Save
          <i
            v-show="updating"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
        <button
          v-show="!selectImageMode"
          v-if="!$root.permissions['stores amenities update']"
          type="submit"
          class="btn blue"
          @click="closeEditModal()"
        >
          Close
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
        <p>Are you sure you want to delete {{ amenityToDelete.name }}?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="deleting"
          @click="deleteAmenity()"
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
import Modal from '@/components/modules/Modal'
import ResourcePicker from '@/components/modules/ResourcePicker'
import NoResults from '@/components/modules/NoResults'
import AmenitiesFunctions from '@/controllers/Amenities'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	components: {
		Breadcrumb,
		LoadingScreen,
		Modal,
		NoResults,
		ResourcePicker
	},
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Menu Manager', link: false },
				{ name: 'Amenities', link: false }
			],

			createNewCollapse: true,
			createErrorMessage: '',
			creating: false,
			newAmenity: {
				name: '',
				image_url: '',
				order: '',
				selectImageMode: false
			},

			loadingAmenities: false,
			listErrorMessage: '',
			amenities: [],
			assigning: false,

			showEditModal: false,
			editErrorMessage: '',
			updating: false,
			selectImageMode: false,
			amenityToEdit: {
				name: '',
				image_url: '',
				order: ''
			},

			showDeleteModal: false,
			deleteErrorMessage: '',
			deleting: false,
			amenityToDelete: {
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
		activeLocationId: function (newId) {
			if (newId !== undefined) {
				this.getAmenitiesForStore()
			}
		}
	},
	mounted () {
		this.getAllAmenities()
	},
	methods: {
		/**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @param {object} object - The object an image is selected for
		 * @param {object} value - The open / closed value of the picker
		 * @returns {undefined}
		 */
		toggleImageMode (object, value) {
			object.selectImageMode = value
		},
		/**
		 * To toggle the create tier panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePanel () {
			this.createNewCollapse = !this.createNewCollapse
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateNewImage (val) {
			this.newAmenity.image_url = val.image_url
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
		 * To check if the input is a positive number
		 * @function
		 * @param {string} input - User's input
		 * @returns {boolean} True is positive integer or float, false is not
		 */
		isNonNegativeNumber (input) {
			try {
				const inputString = String(input)
				if (inputString.length > inputString.replace(/[^\d.]/g, '').length) {
					return false
				}
				const value = Number(input)
				if (value < 0) {
					return false
				}
				return true
			} catch (e) {
				if (this.environment !== 'production') {
					console.log({e})
				}
				return false
			}
		},
		/**
		 * To check if the amenity data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewAmenityData () {
			var amenitiesVue = this
			return new Promise(function (resolve, reject) {
				if (!amenitiesVue.newAmenity.name.length) {
					reject('Name cannot be blank')
				} else if (!amenitiesVue.newAmenity.image_url.length) {
					reject('Select an image')
				} else if (!amenitiesVue.isNonNegativeNumber(amenitiesVue.newAmenity.order)) {
					reject('Order cannot be negative')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new amenity.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createAmenity () {
			var amenitiesVue = this
			amenitiesVue.clearError('createErrorMessage')

			return amenitiesVue
				.validateNewAmenityData()
				.then(response => {
					amenitiesVue.creating = true
					AmenitiesFunctions.createAmenity(
						amenitiesVue.$root.appId,
						amenitiesVue.$root.appSecret,
						amenitiesVue.$root.userToken,
						amenitiesVue.newAmenity
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								amenitiesVue.showCreateSuccess(response.payload)
								amenitiesVue.clearNewAmenity()
								amenitiesVue.getAllAmenities()
							} else {
								amenitiesVue.createErrorMessage = response.message
								amenitiesVue.$scrollTo(
									amenitiesVue.$refs.createErrorMessage,
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
								errorText: 'We could not create the amenity',
								errorName: 'createErrorMessage',
								vue: amenitiesVue
							})
						})
						.finally(() => {
							amenitiesVue.creating = false
						})
				})
				.catch(reason => {
					amenitiesVue.createErrorMessage = reason
					amenitiesVue.$scrollTo(amenitiesVue.$refs.createErrorMessage, 1000, {
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
			let text = 'The Amenity has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Amenity has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To clear the new amenity form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewAmenity () {
			this.newAmenity = {
				name: '',
				image_url: '',
				order: '',
				selectImageMode: false
			}
		},
		/**
		 * To get a list of all amenities.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllAmenities () {
			this.loadingAmenities = true
			this.amenities = []
			var amenitiesVue = this
			return AmenitiesFunctions.getAllAmenities(
				amenitiesVue.$root.appId,
				amenitiesVue.$root.appSecret,
				amenitiesVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						amenitiesVue.amenities = response.payload.map(amenity => {
							amenity.selected = false
							return amenity
						})
						if (amenitiesVue.$root.activeLocation.id !== undefined) {
							amenitiesVue.getAmenitiesForStore()
						}
					} else {
						amenitiesVue.loadingAmenities = false
					}
				})
				.catch(reason => {
					amenitiesVue.loadingAmenities = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch amenities',
						errorName: 'listErrorMessage',
						vue: amenitiesVue
					})
				})
		},
		/**
		 * To get a list of amenities for the current active store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAmenitiesForStore () {
			var amenitiesVue = this
			return AmenitiesFunctions.getAmenitiesForStore(
				amenitiesVue.$root.appId,
				amenitiesVue.$root.appSecret,
				amenitiesVue.$root.userToken,
				amenitiesVue.$root.activeLocation.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						amenitiesVue.amenities.forEach(globalAmenity => {
							globalAmenity.selected = false
						})
						response.payload.forEach(storeAmenity => {
							amenitiesVue.amenities.forEach(globalAmenity => {
								if (globalAmenity.id === storeAmenity.pivot.amenities_id) {
									globalAmenity.selected = true
								}
							})
						})
						amenitiesVue.loadingAmenities = false
					}
				})
				.catch(reason => {
					amenitiesVue.loadingAmenities = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not get amenities for the active store',
						errorName: 'listErrorMessage',
						vue: amenitiesVue
					})
				})
		},
		/**
		 * To toggle the checkbox of the amenity.
		 * @function
		 * @param {object} amenity - The selected amenity
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		toggleChecked (amenity, event) {
			event.stopPropagation()
			amenity.selected = !amenity.selected
		},
		/**
		 * To show the modal to edit an amenity's details.
		 * @function
		 * @param {object} amenity - The selected amenity.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editAmenity (amenity, event) {
			event.stopPropagation()
			this.amenityToEdit = {
				...amenity,
				order: String(amenity.order)
			}
			this.showEditModal = true
		},
		/**
		 * To change the page to the gallery view on the modal.
		 * @function
		 * @returns {undefined}
		 */
		imageEdit () {
			this.selectImageMode = true
		},
		/**
		 * To change the page to the main/form view on the modal.
		 * @function
		 * @returns {undefined}
		 */
		mainEdit () {
			this.selectImageMode = false
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateEditedImage (val) {
			this.mainEdit()
			this.amenityToEdit.image_url = val.image_url
		},
		/**
		 * To check if the amenity data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedAmenityData () {
			var amenitiesVue = this
			return new Promise(function (resolve, reject) {
				if (!amenitiesVue.amenityToEdit.name.length) {
					reject('Name cannot be blank')
				} else if (!amenitiesVue.amenityToEdit.image_url.length) {
					reject('Select an image')
				} else if (!amenitiesVue.isNonNegativeNumber(amenitiesVue.amenityToEdit.order)) {
					reject('Order cannot be negative')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update an amenity.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updateAmenity () {
			var amenitiesVue = this
			amenitiesVue.clearError('editErrorMessage')

			return amenitiesVue
				.validateEditedAmenityData()
				.then(response => {
					amenitiesVue.updating = true
					AmenitiesFunctions.updateAmenity(
						amenitiesVue.$root.appId,
						amenitiesVue.$root.appSecret,
						amenitiesVue.$root.userToken,
						amenitiesVue.amenityToEdit
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								amenitiesVue.getAllAmenities()
								amenitiesVue.closeEditModal()
								amenitiesVue.showEditSuccess(response.payload)
								amenitiesVue.resetEdit()
							} else {
								amenitiesVue.editErrorMessage = response.message
								amenitiesVue.$scrollTo(
									amenitiesVue.$refs.editErrorMessage,
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
								errorText: 'We could not update the amenity',
								errorName: 'editErrorMessage',
								vue: amenitiesVue
							})
						})
						.finally(() => {
							amenitiesVue.updating = false
						})
				})
				.catch(reason => {
					amenitiesVue.editErrorMessage = reason
					amenitiesVue.$scrollTo(amenitiesVue.$refs.editErrorMessage, 1000, {
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
			let text = 'The Amenity has been saved'
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
			this.amenityToEdit = {
				name: '',
				image_url: '',
				order: ''
			}
		},
		/**
		 * To apply amenities to the current active location
		 * @function
		 * @returns {undefined}
		 */
		assignAmenitiesToLocation () {
			var amenitiesVue = this
			this.assigning = true
			let payload = {
				amenities: [
					...this.amenities
						.filter(amenity => amenity.selected)
						.map(amenity => amenity.id)
				]
			}
			return AmenitiesFunctions.assignAmenitiesToLocation(
				amenitiesVue.$root.appId,
				amenitiesVue.$root.appSecret,
				amenitiesVue.$root.userToken,
				amenitiesVue.$root.activeLocation.id,
				payload
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						amenitiesVue.showAssignSuccess(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not save amenities for ${
							this.$root.activeLocation.display_name
						}`,
						errorName: 'listErrorMessage',
						vue: amenitiesVue
					})
				})
				.finally(() => {
					amenitiesVue.assigning = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAssignSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Amenities have been saved'
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
		 * To display the modal for deleting an amenity.
		 * @function
		 * @param {object} amenity - The selected amenity
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		confirmDelete (amenity, event) {
			event.stopPropagation()
			this.amenityToDelete = { ...amenity }
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteAmenity () {
			this.deleting = true
			var amenitiesVue = this
			return AmenitiesFunctions.deleteAmenity(
				amenitiesVue.$root.appId,
				amenitiesVue.$root.appSecret,
				amenitiesVue.$root.userToken,
				amenitiesVue.amenityToDelete.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						amenitiesVue.getAllAmenities()
						amenitiesVue.closeDeleteModal()
						amenitiesVue.showDeleteSuccess(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not delete ${this.amenityToDelete.name}`,
						errorName: 'deleteErrorMessage',
						vue: amenitiesVue
					})
				})
				.finally(() => {
					amenitiesVue.deleting = false
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
			let text = 'The Amenity has been deleted'
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
.btn.custom-button:not(.md-skip):not(.bs-select-all):not(.bs-deselect-all) {
  position: absolute;
  bottom: 0;
  height: 100%;
  width: 5em;
  border-radius: 0;
}
.custom-button.full-width {
  right: 0;
}
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover {
  background-color: white;
}
.tiles .tile .tile-body > div {
  height: 80px;
  background-size: cover;
  background-repeat: no-repeat;
  background-size: 100%;
}
.tile-width {
  width: 127px;
  text-align: center;
}
.tile-width > span {
  max-width: 90%;
  height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  font-size: 13px;
}
.tiles .tile.image .corner:after {
  z-index: 1;
}
.tiles .tile.image.selected .check:after {
  z-index: 1;
  content: "\f040";
  color: #000;
}
.tiles .tile.image.selected.active .check:after {
  content: "\F00C";
}
.tiles .tile.image.selected.active .corner:after {
  border-right: 40px solid rgba(55, 183, 217, 1);
}
.grey-label {
  color: rgb(136, 136, 136);
  font-size: 13px;
  margin-bottom: 5px;
}
.group-radio {
  display: block;
}
.group-radio.el-radio + .group-radio.el-radio {
  margin-left: 0;
}
.container__flex-row--center {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.footer-wrapper {
  display: flex;
  justify-content: space-between;
}
</style>

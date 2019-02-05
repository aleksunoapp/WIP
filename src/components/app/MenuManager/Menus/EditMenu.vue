<template>
  <modal
    ref="editModal"
    :show="showEditMenuModal"
    effect="fade"
    @closeOnEscape="closeModal"
  >
    <div
      slot="modal-header"
      class="modal-header center"
    >
      <button
        type="button"
        class="close"
        @click="closeModal()"
      >
        <span>&times;</span>
      </button>
      <transition
        name="fade"
        mode="out-in"
      >
        <h4
          v-if="!selectImageMode && !selectLocationMode"
          key="mainEditMode"
          class="modal-title center"
        >
          Edit Menu
        </h4>
        <h4
          v-if="!selectImageMode && selectLocationMode"
          key="selectLocationMode"
          class="modal-title center"
        >
          <i
            class="fa fa-chevron-left clickable pull-left back-button"
            @click="closeSelectLocationsPopup()"
          />Select Stores
        </h4>
        <h4
          v-if="selectImageMode && !selectLocationMode"
          key="selectImageMode"
          class="modal-title center"
        >
          Select An Image
        </h4>
      </transition>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <div class="row">
        <div class="col-xs-12">
          <div
            v-show="errorMessage.length"
            ref="errorMessage"
            class="alert alert-danger"
          >
            <button
              class="close"
              data-close="alert"
              @click="clearError()"
            />
            <span>{{ errorMessage }}</span>
          </div>
        </div>
        <div
          v-if="!selectLocationMode"
          :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}"
        >
          <resource-picker
            :image-button="true"
            :image-url="menuToBeEdited.image_url"
            class="margin-top-15"
            @open="goToPageTwo()"
            @close="goToPageOne()"
            @selected="updateImage"
          />
        </div>

        <div
          v-if="selectLocationMode"
          class="col-xs-12"
        >
          <store-picker-with-button
            :previously-selected="selectedLocations"
            @close="updateSelectedLocations"
          />
        </div>

        <div
          v-show="!selectImageMode && !selectLocationMode"
          class="col-md-12"
        >
          <fieldset :disabled="!$root.permissions['menu_manager menus update']">
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_1"
                v-model="menuToBeEdited.name"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_1">
                Menu Name
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_2"
                v-model="menuToBeEdited.desc"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_2">
                Menu Description
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_3"
                v-model="menuToBeEdited.sku"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_3">
                Menu SKU
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_4"
                v-model="menuToBeEdited.order"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_4">
                Menu Order
              </label>
            </div>
          </fieldset>
          <div class="form-group form-md-line-input form-md-floating-label">
            <label>Menu Status:</label><br>
            <el-switch
              v-model="menuToBeEdited.status"
              :disabled="!$root.permissions['menu_manager menus update']"
              active-color="#0c6"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              active-text="Active"
              inactive-text="Sold Out"
            />
          </div>
          <fieldset :disabled="!$root.permissions['menu_manager menus update']">
            <div class="form-group form-md-checkboxes">
              <label>Availability</label>
              <div class="md-checkbox-inline">
                <div class="md-checkbox">
                  <input
                    id="availability_pos_edit"
                    v-model="menuToBeEdited.pos"
                    type="checkbox"
                    class="md-check"
                  >
                  <label for="availability_pos_edit">
                    <span />
                    <span class="check" />
                    <span class="box" /> POS
                  </label>
                </div>
                <div class="md-checkbox">
                  <input
                    id="availability_kiosk_edit"
                    v-model="menuToBeEdited.kiosk"
                    type="checkbox"
                    class="md-check"
                    checked=""
                  >
                  <label for="availability_kiosk_edit">
                    <span />
                    <span class="check" />
                    <span class="box" /> Kiosk
                  </label>
                </div>
                <div class="md-checkbox">
                  <input
                    id="availability_online_edit"
                    v-model="menuToBeEdited.online"
                    type="checkbox"
                    class="md-check"
                  >
                  <label for="availability_online_edit">
                    <span />
                    <span class="check" />
                    <span class="box" /> Online
                  </label>
                </div>
                <div class="md-checkbox">
                  <input
                    id="availability_web_edit"
                    v-model="menuToBeEdited.web"
                    type="checkbox"
                    class="md-check"
                  >
                  <label for="availability_web_edit">
                    <span />
                    <span class="check" />
                    <span class="box" /> Web
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
          <el-date-picker
            v-model="menuToBeEdited.start_from"
            :disabled="!$root.permissions['menu_manager menus update']"
            :editable="false"
            type="date"
            class="narrow-datepicker"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="From"
          />
          -
          <el-date-picker
            v-model="menuToBeEdited.stop_on"
            :disabled="!$root.permissions['menu_manager menus update']"
            :editable="false"
            type="date"
            class="narrow-datepicker"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="To"
          />
          <div class="form-group form-md-line-input form-md-floating-label">
            <label>Catering:</label><br>
            <el-switch
              v-model="menuToBeEdited.catering"
              :disabled="!$root.permissions['menu_manager menus update']"
              active-color="#0c6"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              active-text="Available"
              inactive-text="Unavailable"
            />
          </div>
          <fieldset :disabled="!$root.permissions['menu_manager menus update']">
            <div
              v-if="menuToBeEdited.catering"
              class="form-group form-md-line-input form-md-floating-label"
            >
              <input
                id="form_control_5"
                v-model="menuToBeEdited.min"
                type="text"
                class="form-control input-sm"
                :class="{'edited': menuToBeEdited.min.length}"
              >
              <label for="form_control_5">
                Minimum order value
              </label>
            </div>
            <div
              v-if="menuToBeEdited.catering"
              class="form-group form-md-line-input form-md-floating-label"
            >
              <input
                id="form_control_6"
                v-model="menuToBeEdited.max"
                type="text"
                class="form-control input-sm"
                :class="{'edited': menuToBeEdited.max.length}"
              >
              <label for="form_control_6">
                Maximum order value
              </label>
            </div>
          </fieldset>
          <div>
            <p class="margin-bottom-10 margin-top-30 margin-right-10">
              Select locations to apply the changes to:
            </p>
            <button
              type="submit"
              class="btn blue btn-outline"
              @click="selectLocations($event)"
            >
              Select locations
            </button>
            <p
              v-if="selectedLocations.length"
              class="grey-label margin-top-10"
            >
              Selected {{ selectedLocations.length }}
              <span v-if="selectedLocations.length !== 1">
                locations
              </span>
              <span v-else>
                location
              </span>
            </p>
          </div>
          <button
            v-if="!$root.permissions['menu_manager menus update']"
            type="button"
            class="btn btn-primary pull-right"
            @click="closeModal()"
          >
            Close
          </button>
          <button
            v-else
            type="button"
            class="btn btn-primary pull-right"
            :disabled="updating"
            @click="updateMenu()"
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
    <div slot="modal-footer" />
  </modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'
import ajaxErrorHandler from '../../../../controllers/ErrorController'
import ResourcePicker from '../../../modules/ResourcePicker'
import StorePickerWithButton from '@/components/modules/StorePickerWithButton'

export default {
  components: {
    Modal,
    ResourcePicker,
    StorePickerWithButton
  },
  props: {
    passedMenuId: {
      type: Number
    }
  },
  data () {
    return {
      showEditMenuModal: false,
      menuToBeEdited: {
        image_url: ''
      },
      updating: false,
      errorMessage: '',
      selectImageMode: false,
      customWidth: 90,
      statusChecked: false,
      selectLocationMode: false,
      selectedLocations: []
    }
  },
  created () {
    // get category details by category id passed as route param
    this.getMenuDetails()
  },
  mounted () {
    this.showEditMenuModal = true
  },
  methods: {
    /**
		 * To toggle select location mode on.
		 * @function
		 * @param {object} event - The event that triggered the action
		 * @returns {undefined}
		 */
    selectLocations (event) {
      event.preventDefault()
      this.selectLocationMode = true
    },
    /**
		 * To toggle select location mode on.
		 * @function
		 * @param {array} locations - The array of selected locations
		 * @returns {undefined}
		 */
    updateSelectedLocations (locations) {
      if (this.$root.permissions['menu_manager menus update']) {
        this.selectedLocations = locations
      }
      this.closeSelectLocationsPopup()
    },
    /**
		 * To toggle select location mode on.
		 * @function
		 * @returns {undefined}
		 */
    closeSelectLocationsPopup () {
      this.selectLocationMode = false
    },
    /**
		 * To check if the menu data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateCategoryData () {
      var editMenuVue = this
      return new Promise(function (resolve, reject) {
        if (!editMenuVue.menuToBeEdited.image_url.length) {
          reject('Menu image cannot be blank')
        } else if (!editMenuVue.menuToBeEdited.name.length) {
          reject('Menu name cannot be blank')
        } else if (!editMenuVue.menuToBeEdited.desc.length) {
          reject('Menu description cannot be blank')
        } else if (!editMenuVue.menuToBeEdited.sku) {
          reject('Menu SKU cannot be blank')
        } else if (!$.isNumeric(editMenuVue.menuToBeEdited.order)) {
          reject('Menu order should be a number')
        } else if (
          editMenuVue.menuToBeEdited.start_from &&
					!editMenuVue.menuToBeEdited.stop_on
        ) {
          reject('Please provide an end date')
        } else if (
          !editMenuVue.menuToBeEdited.start_from &&
					editMenuVue.menuToBeEdited.stop_on
        ) {
          reject('Please provide a start date')
        } else if (
          editMenuVue.menuToBeEdited.catering &&
					!editMenuVue.menuToBeEdited.min
        ) {
          reject('Minimum order value cannot be blank')
        } else if (
          editMenuVue.menuToBeEdited.catering &&
					!editMenuVue.menuToBeEdited.max
        ) {
          reject('Maximum order value cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
    clearError () {
      this.errorMessage = ''
    },
    /**
		 * To get the details of the menu to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getMenuDetails () {
      var editMenuVue = this
      MenusFunctions.getMenuDetails(
        editMenuVue.passedMenuId,
        editMenuVue.$root.appId,
        editMenuVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            editMenuVue.menuToBeEdited = {
              ...response.payload,
              pos: !!editMenuVue.menuToBeEdited.pos,
              kiosk: !!editMenuVue.menuToBeEdited.kiosk,
              online: !!editMenuVue.menuToBeEdited.online,
              web: !!editMenuVue.menuToBeEdited.web
            }
            if (
              editMenuVue.menuToBeEdited.min === 0 ||
							editMenuVue.menuToBeEdited.min
            ) {
              editMenuVue.menuToBeEdited.min = editMenuVue.menuToBeEdited.min.toString()
            }
            if (
              editMenuVue.menuToBeEdited.max === 0 ||
							editMenuVue.menuToBeEdited.max
            ) {
              editMenuVue.menuToBeEdited.max = editMenuVue.menuToBeEdited.max.toString()
            }
            if (editMenuVue.menuToBeEdited.status === 1) {
              editMenuVue.statusChecked = true
            }
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch menu info',
            errorName: 'errorMessage',
            vue: editMenuVue,
            containerRef: 'editModal'
          })
        })
    },
    /**
		 * To update the menu and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    updateMenu () {
      var editMenuVue = this
      editMenuVue.menuToBeEdited.user_id = editMenuVue.$root.createdBy
      editMenuVue.menuToBeEdited.location_id =
				editMenuVue.$root.activeLocation.id
      editMenuVue.menuToBeEdited.update_locations =
				editMenuVue.selectedLocations
      editMenuVue.clearError()

      return editMenuVue
        .validateCategoryData()
        .then(response => {
          editMenuVue.updating = true
          let payload = {
            ...editMenuVue.menuToBeEdited,
            pos: editMenuVue.menuToBeEdited.pos ? 1 : 0,
            kiosk: editMenuVue.menuToBeEdited.kiosk ? 1 : 0,
            online: editMenuVue.menuToBeEdited.online ? 1 : 0,
            web: editMenuVue.menuToBeEdited.web ? 1 : 0
          }

          MenusFunctions.updateMenu(
            payload,
            editMenuVue.$root.appId,
            editMenuVue.$root.appSecret,
            editMenuVue.$root.userToken
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                this.closeModalAndUpdate(response.payload)
              } else {
                editMenuVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the item',
                errorName: 'errorMessage',
                vue: editMenuVue,
                containerRef: 'editModal'
              })
            })
            .finally(() => {
              editMenuVue.updating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          editMenuVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeEditMenuModal')
    },
    /**
		 * To close the modal and update the menu details.
		 * @function
		 * @param {object} payload - The payload parameter of the server response
		 * @returns {undefined}
		 */
    closeModalAndUpdate (payload = {}) {
      this.$emit('updateMenu', {
        menu: this.menuToBeEdited,
        payload
      })
    },
    /**
		 * To change the page to the gallery view on the modal.
		 * @function
		 * @returns {undefined}
		 */
    goToPageTwo () {
      this.selectImageMode = true
    },
    /**
		 * To change the page to the main/form view on the modal.
		 * @function
		 * @returns {undefined}
		 */
    goToPageOne () {
      this.selectImageMode = false
    },
    /**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
    updateImage (val) {
      this.goToPageOne()
      if (this.$root.permissions['menu_manager menus update']) {
        this.menuToBeEdited.image_url = val.image_url
      }
    }
  }
}
</script>
<style scoped>
.image-container {
	border: 1px dotted #c2cad8;
	text-align: center;
}
.narrow-datepicker {
	max-width: 40%;
}
</style>

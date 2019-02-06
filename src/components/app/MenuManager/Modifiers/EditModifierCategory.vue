<template>
  <modal
    ref="modal"
    :show="showEditCategoryModal"
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
          <div>Edit <strong>{{ categoryToBeEdited.name }} </strong></div>
          <br>
          <small>{{ categoryToBeEdited.sku ? `SKU: ${categoryToBeEdited.sku}` : '' }}</small>
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
      <div class="col-xs-12">
        <div
          v-show="errorMessage"
          ref="errorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click="clearError()"
          />
          <span>{{ errorMessage }}</span>
        </div>
        <div
          v-if="!selectLocationMode"
          :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}"
        >
          <resource-picker
            :image-button="true"
            :image-url="categoryToBeEdited.image_url"
            class="margin-top-15"
            @open="goToPageTwo()"
            @close="goToPageOne()"
            @selected="updateImage"
          />
        </div>

        <store-picker-with-button
          v-if="selectLocationMode"
          :previously-selected="selectedLocations"
          @close="updateSelectedLocations"
        />

        <div
          v-show="!selectImageMode && !selectLocationMode"
          class="col-md-12"
        >
          <fieldset :disabled="!$root.permissions['menu_manager modifiers update']">
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_1"
                v-model="categoryToBeEdited.name"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_1">
                Modifier Category Name
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_2"
                v-model="categoryToBeEdited.desc"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_2">
                Modifier Category Description
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_4"
                v-model="categoryToBeEdited.min"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_4">
                Modifier Category Min
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_5"
                v-model="categoryToBeEdited.max"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_5">
                Modifier Category Max
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_6"
                v-model="categoryToBeEdited.included"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_6">
                Modifier Category Number Free
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_7"
                v-model="categoryToBeEdited.order"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_7">
                Modifier Category Order
              </label>
            </div>
          </fieldset>
          <div class="form-group form-md-line-input form-md-floating-label">
            <label>Modifier Category Status:</label><br>
            <el-switch
              v-model="categoryToBeEdited.status"
              :disabled="!$root.permissions['menu_manager modifiers update']"
              active-color="#0c6"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              active-text="Available"
              inactive-text="Sold Out"
            />
          </div>
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
            v-if="!$root.permissions['menu_manager modifiers update']"
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
            :disabled="saving"
            @click="updateModifierCategory()"
          >
            Save
            <i
              v-show="saving"
              class="fa fa-spinner fa-pulse fa-fw"
            />
          </button>
        </div>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    />
  </modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import ModifiersFunctions from '../../../../controllers/Modifiers'
import StorePickerWithButton from '@/components/modules/StorePickerWithButton'
import ResourcePicker from '../../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal,
    ResourcePicker,
    StorePickerWithButton
  },
  data () {
    return {
      showEditCategoryModal: false,
      categoryToBeEdited: {
        image_url: ''
      },
      saving: false,
      errorMessage: '',
      selectImageMode: false,
      customWidth: 90,
      selectLocationMode: false,
      selectedLocations: []
    }
  },
  created () {
    // get category details by category id passed as route param
    this.getModifierCategoryDetails()
  },
  mounted () {
    this.showEditCategoryModal = true
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
      if (this.$root.permissions['menu_manager modifiers update']) {
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
          console.log({ e })
        }
        return false
      }
    },
    /**
		 * To check if the modifier category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateModifierCategoryData () {
      var editModifierCategoryVue = this
      return new Promise(function (resolve, reject) {
        if (!editModifierCategoryVue.categoryToBeEdited.image_url.length) {
          reject('Modifier Category image cannot be blank')
        } else if (!editModifierCategoryVue.categoryToBeEdited.name.length) {
          reject('Modifier Category Name cannot be blank')
        } else if (!editModifierCategoryVue.categoryToBeEdited.desc.length) {
          reject('Modifier Category Description cannot be blank')
        } else if (!editModifierCategoryVue.isNonNegativeNumber(editModifierCategoryVue.categoryToBeEdited.min)) {
          reject('Modifier Category Min must be zero or more')
        } else if (!editModifierCategoryVue.isNonNegativeNumber(editModifierCategoryVue.categoryToBeEdited.max)) {
          reject('Modifier Category Max must be zero or more')
        } else if (Number(editModifierCategoryVue.categoryToBeEdited.min) > Number(editModifierCategoryVue.categoryToBeEdited.max)) {
          reject('Modifier Category Min cannot be larger than Max')
        } else if (!editModifierCategoryVue.categoryToBeEdited.sku.length) {
          reject('Modifier Category SKU cannot be blank')
        } else if (!editModifierCategoryVue.isNonNegativeNumber(editModifierCategoryVue.categoryToBeEdited.included)) {
          reject('Modifier Category Number Free cannot be negative')
        } else if (!editModifierCategoryVue.isNonNegativeNumber(editModifierCategoryVue.categoryToBeEdited.order)) {
          reject('Modifier Category Order cannot be negative')
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
		 * To get the details of the modifier category to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getModifierCategoryDetails () {
      var editModifierCategoryVue = this
      ModifiersFunctions.getModifierCategoryDetails(
        editModifierCategoryVue.$route.params.modifier_category_id,
        editModifierCategoryVue.$root.appId,
        editModifierCategoryVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            editModifierCategoryVue.categoryToBeEdited =
							response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch modifier info',
            errorName: 'errorMessage',
            vue: editModifierCategoryVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To update the modifier category and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    updateModifierCategory () {
      var editModifierCategoryVue = this
      editModifierCategoryVue.categoryToBeEdited.user_id =
				editModifierCategoryVue.$root.createdBy
      editModifierCategoryVue.categoryToBeEdited.update_locations =
				editModifierCategoryVue.selectedLocations
      editModifierCategoryVue.clearError()

      return editModifierCategoryVue
        .validateModifierCategoryData()
        .then(response => {
          editModifierCategoryVue.saving = true
          ModifiersFunctions.updateModifierCategory(
            editModifierCategoryVue.categoryToBeEdited,
            editModifierCategoryVue.$root.appId,
            editModifierCategoryVue.$root.appSecret,
            editModifierCategoryVue.$root.userToken
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                this.closeModalAndUpdate()
                this.showEditSuccess(response.payload)
              } else {
                editModifierCategoryVue.errorMessage =
									response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the modifier',
                errorName: 'errorMessage',
                vue: editModifierCategoryVue,
                containerRef: 'modal'
              })
            })
            .finally(() => {
              editModifierCategoryVue.saving = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          editModifierCategoryVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
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
      let text = 'The Modifier has been updated'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Modifier has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('deactivateEditCategoryModal')
      this.$router.push('/app/menu_manager/modifiers')
    },
    /**
		 * To close the modal and emit the updated modifier category object to the parent.
		 * @function
		 * @returns {undefined}
		 */
    closeModalAndUpdate () {
      this.$emit('updateModifierCategory')
      this.$router.push('/app/menu_manager/modifiers')
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
      if (this.$root.permissions['menu_manager modifiers update']) {
        this.categoryToBeEdited.image_url = val.image_url
      }
      this.goToPageOne()
    }
  }
}
</script>
</script>
<style scoped>
.image-container {
	border: 1px dotted #c2cad8;
	text-align: center;
}
.narrow-datepicker {
	max-width: 40%;
}
.modal-title.center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
span.modal-title {
	display: inline-block;
}
</style>

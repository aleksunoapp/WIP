<template>
  <modal
    ref="modal"
    :show="showEditOptionItemModal"
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
      <h4
        v-if="!selectImageMode"
        class="modal-title center"
      >
        Update Option Item
      </h4>
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
        <div :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
          <resource-picker
            :image-button="true"
            :image-url="optionItemToBeEdited.image_url"
            class="margin-top-15"
            @open="goToPageTwo()"
            @close="goToPageOne()"
            @selected="updateImage"
          />
        </div>
        <div
          v-show="!selectImageMode"
          class="col-md-12"
        >
          <fieldset :disabled="!$root.permissions['menu_manager options items update']">
            <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
              <input
                id="form_control_1"
                v-model="optionItemToBeEdited.name"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_1">
                Option Item Name
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
              <input
                id="form_control_2"
                v-model="optionItemToBeEdited.description"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_2">
                Option Item Description
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
              <input
                id="form_control_3"
                v-model="optionItemToBeEdited.order"
                type="number"
                class="form-control input-sm edited"
              >
              <label for="form_control_3">
                Option Item Order
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
              <input
                id="form_control_4"
                v-model="optionItemToBeEdited.sku"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_4">
                Option Item SKU
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
              <input
                id="form_control_5"
                v-model="optionItemToBeEdited.price"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_5">
                Option Item Price
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-if="!selectImageMode && !$root.permissions['menu_manager options items update']"
        type="button"
        class="btn btn-primary"
        @click="closeModal()"
      >
        Close
      </button>
      <button
        v-if="!selectImageMode && $root.permissions['menu_manager options items update']"
        type="button"
        class="btn btn-primary"
        @click="updateOptionItem()"
      >
        Save
        <i
          v-show="saving"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import Dropdown from '../../../modules/Dropdown'
import OptionsFunctions from '../../../../controllers/Options'
import ResourcePicker from '../../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal,
    Dropdown,
    ResourcePicker
  },
  props: {
    selectedOptionItemId: {
      type: Number
    }
  },
  data () {
    return {
      showEditOptionItemModal: false,
      optionItemToBeEdited: {
        image_url: ''
      },
      errorMessage: '',
      selectImageMode: false,
      saving: false
    }
  },
  mounted () {
    this.showEditOptionItemModal = true
    this.getOptionItemDetails()
  },
  methods: {
    /**
		 * To check if the portion data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateOptionData () {
      var editOptionVue = this
      return new Promise(function (resolve, reject) {
        if (!editOptionVue.optionItemToBeEdited.name.length) {
          reject('Option Item name cannot be blank')
        } else if (!editOptionVue.optionItemToBeEdited.image_url.length) {
          reject('Option Item image URL cannot be blank')
        } else if (!$.isNumeric(editOptionVue.optionItemToBeEdited.order)) {
          reject('Option Item order should be numerical')
        } else if (!editOptionVue.optionItemToBeEdited.description.length) {
          reject('Option Item description should be numerical')
        } else if (!editOptionVue.optionItemToBeEdited.sku.length) {
          reject('Option Item SKU should be numerical')
        } else if (!editOptionVue.optionItemToBeEdited.price.length) {
          reject('Option Item price should be numerical')
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
		 * To get the details of a specific portion.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getOptionItemDetails () {
      var editOptionVue = this
      OptionsFunctions.getOptionItemDetails(
        editOptionVue.selectedOptionItemId,
        editOptionVue.$root.appId,
        editOptionVue.$root.appSecret,
        editOptionVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            editOptionVue.optionItemToBeEdited = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch option item info',
            errorName: 'errorMessage',
            vue: editOptionVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To update an existing portion.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    updateOptionItem () {
      var editOptionVue = this
      editOptionVue.clearError()

      return editOptionVue
        .validateOptionData()
        .then(response => {
          editOptionVue.saving = true
          OptionsFunctions.updateOptionItem(
            editOptionVue.optionItemToBeEdited,
            editOptionVue.$root.appId,
            editOptionVue.$root.appSecret,
            editOptionVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                this.closeModalAndUpdate()
                this.showEditSuccess(response.payload)
              } else {
                editOptionVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the option item',
                errorName: 'errorMessage',
                vue: editOptionVue,
                containerRef: 'modal'
              })
            })
            .finally(() => {
              editOptionVue.saving = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          editOptionVue.errorMessage = reason
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
      let text = 'The Option has been saved'
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
		 * To close the modal and emit the newly created tag object to the parent.
		 * @function
		 * @returns {undefined}
		 */
    closeModalAndUpdate () {
      this.$emit('updateOptionItem', this.optionItemToBeEdited)
    },
    /**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeEditOptionItemModal')
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
      if (this.$root.permissions['menu_manager options items update']) {
        this.optionItemToBeEdited.image_url = val.image_url
      }
      this.goToPageOne()
    }
  }
}
</script>

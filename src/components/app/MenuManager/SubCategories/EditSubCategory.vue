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
      <h4
        v-if="!selectImageMode"
        class="modal-title center"
      >
        Edit Category
      </h4>
      <h4
        v-else
        class="modal-title center"
      >
        <i
          class="fa fa-chevron-left clickable pull-left back-button"
          @click="goToPageOne()"
        /> Select An Image
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
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
      <div class="row">
        <div :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
          <resource-picker
            :image-button="true"
            :image-url="categoryToBeEdited.image_url"
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
          <fieldset :disabled="!can('menu_manager menus categories subcategories update')">
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_1"
                v-model="categoryToBeEdited.name"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_1">
                Category Name
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
                Category Description
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_3"
                v-model="categoryToBeEdited.sku"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_3">
                Category SKU
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_4"
                v-model="categoryToBeEdited.order"
                type="number"
                class="form-control input-sm edited"
              >
              <label for="form_control_4">
                Category Order
              </label>
            </div>
          </fieldset>
          <div class="form-group form-md-line-input form-md-floating-label">
            <label>Category Status:</label><br>
            <el-switch
              v-model="categoryToBeEdited.status"
              :disabled="!can('menu_manager menus categories subcategories update')"
              active-color="#0c6"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              active-text="Available"
              inactive-text="Sold Out"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-if="!selectImageMode"
        type="button"
        class="btn btn-primary"
        :disabled="updating"
        @click="updateMenuCategory()"
      >
        Save
        <i
          v-show="updating"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import CategoriesFunctions from '../../../../controllers/Categories'
import ResourcePicker from '../../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { mapGetters } from 'vuex'

export default {
	data () {
		return {
			showEditCategoryModal: false,
			updating: false,
			categoryToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false
		}
	},
	computed: {
		...mapGetters(['can', 'canAny'])
	},
	created () {
		// get category details by category id passed as route param
		this.getCategoryDetails()
	},
	mounted () {
		this.showEditCategoryModal = true
	},
	methods: {
		/**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateCategoryData () {
			var editSubCategoryVue = this
			return new Promise(function (resolve, reject) {
				if (!editSubCategoryVue.categoryToBeEdited.name.length) {
					reject('Category name cannot be blank')
				} else if (!editSubCategoryVue.categoryToBeEdited.desc.length) {
					reject('Category description cannot be blank')
				} else if (!editSubCategoryVue.categoryToBeEdited.sku.length) {
					reject('Category SKU cannot be blank')
				} else if (!editSubCategoryVue.categoryToBeEdited.image_url.length) {
					reject('Category image cannot be blank')
				} else if (!$.isNumeric(editSubCategoryVue.categoryToBeEdited.status)) {
					reject('Category status cannot be blank')
				} else if (!$.isNumeric(editSubCategoryVue.categoryToBeEdited.order)) {
					reject('Category order should be a number')
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
		 * To get the details of the category to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCategoryDetails () {
			var editSubCategoryVue = this
			CategoriesFunctions.getCategoryDetails(
				editSubCategoryVue.$route.params.sub_category_id,
				editSubCategoryVue.$root.appId,
				editSubCategoryVue.$root.appSecret,
				editSubCategoryVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editSubCategoryVue.categoryToBeEdited = response.payload[0]
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch subcategory info',
						errorName: 'errorMessage',
						vue: editSubCategoryVue,
						containerRef: 'modal'
					})
				})
		},
		/**
		 * To update the category and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateMenuCategory () {
			var editSubCategoryVue = this
			editSubCategoryVue.clearError()
			editSubCategoryVue.categoryToBeEdited.user_id =
				editSubCategoryVue.$root.createdBy

			return editSubCategoryVue
				.validateCategoryData()
				.then(response => {
					editSubCategoryVue.updating = true
					CategoriesFunctions.updateMenuCategory(
						editSubCategoryVue.categoryToBeEdited,
						editSubCategoryVue.$root.appId,
						editSubCategoryVue.$root.appSecret,
						editSubCategoryVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								this.showUpdateSuccess(response.payload)
								this.closeModalAndUpdate()
							} else {
								editSubCategoryVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the subcategory',
								errorName: 'errorMessage',
								vue: editSubCategoryVue,
								containerRef: 'modal'
							})
						})
						.finally(() => {
							editSubCategoryVue.updating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					editSubCategoryVue.errorMessage = reason
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
		showUpdateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Subcategory has been saved'
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
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('deactivateEditSubCategoryModal')
			this.$router.push(
				'/app/menu_manager/categories/' + this.$route.params.menu_id
			)
		},
		/**
		 * To close the modal and emit the updated category object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateSubCategory', this.categoryToBeEdited)
			this.$router.push(
				'/app/menu_manager/categories/' + this.$route.params.menu_id
			)
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
			if (!this.can('menu_manager menus categories subcategories update')) {
				this.categoryToBeEdited.image_url = val.image_url
			}
			this.goToPageOne()
		}
	},
	components: {
		Modal,
		ResourcePicker
	}
}
</script>

<template>
	<modal :show="showEditCategoryModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center" v-if="!selectImageMode">Edit Category</h4>
			<h4 class="modal-title center" v-else><i class="fa fa-chevron-left clickable pull-left back-button" @click="goToPageOne()"></i>  Select An Image</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="page-one" v-if="!selectImageMode" :class="{'active': !selectImageMode, 'disabled': selectImageMode}">
				<div class="alert alert-danger" v-if="errorMessage.length">
				    <button class="close" data-close="alert" @click="clearError()"></button>
				    <span>{{errorMessage}}</span>
				</div>
				<div class="col-md-3">
					<label>Sub Category Image</label>
					<div class="image-container clickable" v-if="!categoryToBeEdited.image_url.length">
						<img width="100" height="80" src="../../../../assets/img/app/image-placeholder.png" @click="goToPageTwo()">
					</div>
					<div class="image-container clickable" v-else>
						<img width="100" height="80" :src="categoryToBeEdited.image_url" @click="goToPageTwo()">
					</div>
				</div>
				<div class="col-md-9">
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="categoryToBeEdited.name">
					    <label for="form_control_1">Category Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="categoryToBeEdited.desc">
					    <label for="form_control_2">Category Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="categoryToBeEdited.sku">
					    <label for="form_control_3">Category SKU</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="number" class="form-control input-sm edited" id="form_control_4" v-model="categoryToBeEdited.order">
					    <label for="form_control_4">Category Order</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
		                <label>Category Status:</label><br>
		                <el-switch
		                	v-model="categoryToBeEdited.status"
		                	active-color="#0c6"
		                	inactive-color="#ff4949"
		                	:active-value="1"
		                	:inactive-value="0"
		                	active-text="Available"
		                	inactive-text="Sold Out">
		                </el-switch>
		            </div>
		        </div>
	        </div>
	        <div class="page-two" v-if="selectImageMode" :class="{'active': selectImageMode, 'disabled': !selectImageMode}">
				<gallery-popup @selectedImage="updateImage"></gallery-popup>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button v-if="!selectImageMode" type="button" class="btn btn-primary" @click="updateMenuCategory()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import CategoriesFunctions from '../../../../controllers/Categories'
import GalleryPopup from '../../../modules/GalleryPopup'

export default {
	data () {
		return {
			showEditCategoryModal: false,
			categoryToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false
		}
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
			CategoriesFunctions.getCategoryDetails(editSubCategoryVue.$route.params.sub_category_id, editSubCategoryVue.$root.appId, editSubCategoryVue.$root.appSecret, editSubCategoryVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editSubCategoryVue.categoryToBeEdited = response.payload[0]
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editSubCategoryVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
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
			editSubCategoryVue.categoryToBeEdited.user_id = editSubCategoryVue.$root.createdBy

			return editSubCategoryVue.validateCategoryData()
			.then(response => {
				CategoriesFunctions.updateMenuCategory(editSubCategoryVue.categoryToBeEdited, editSubCategoryVue.$root.appId, editSubCategoryVue.$root.appSecret, editSubCategoryVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editSubCategoryVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editSubCategoryVue.$router.push('/login/expired')
						return
					}
					editSubCategoryVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editSubCategoryVue.errorMessage = reason
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
			this.$emit('deactivateEditSubCategoryModal')
			this.$router.push('/app/menu_manager/categories/' + this.$route.params.menu_id)
		},
		/**
		 * To close the modal and emit the updated category object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateSubCategory', this.categoryToBeEdited)
			this.$router.push('/app/menu_manager/categories/' + this.$route.params.menu_id)
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
			this.categoryToBeEdited.image_url = val.image_url
		}
	},
	components: {
		Modal,
		GalleryPopup
	}
}
</script>

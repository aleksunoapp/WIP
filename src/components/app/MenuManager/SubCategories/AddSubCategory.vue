<template>
	<modal :show="showAddCategoryModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center" v-if="!selectImageMode">Add New Sub Category</h4>
			<h4 class="modal-title center" v-else><i class="fa fa-chevron-left clickable pull-left back-button" @click="goToPageOne()"></i>Select An Image</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="page-one" v-if="!selectImageMode" :class="{'active': !selectImageMode, 'disabled': selectImageMode}">
				<div class="alert alert-danger" v-if="errorMessage.length">
				    <button class="close" data-close="alert" @click="clearError()"></button>
				    <span>{{errorMessage}}</span>
				</div>
				<div class="col-md-3">
					<label>Sub Category Image</label>
					<div class="image-container clickable" v-if="!newSubCategory.image_url.length">
						<img width="100" height="80" src="../../../../assets/img/app/image-placeholder.png" @click="goToPageTwo()">
					</div>
					<div class="image-container clickable" v-else>
						<img width="100" height="80" :src="newSubCategory.image_url" @click="goToPageTwo()">
					</div>
				</div>
				<div class="col-md-9">
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm" :class="{'edited': newSubCategory.name.length}" id="form_control_1" v-model="newSubCategory.name">
					    <label for="form_control_1">Sub Category Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm" :class="{'edited': newSubCategory.desc.length}" id="form_control_2" v-model="newSubCategory.desc">
					    <label for="form_control_2">Sub Category Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm" :class="{'edited': newSubCategory.sku.length}" id="form_control_3" v-model="newSubCategory.sku">
					    <label for="form_control_3">Sub Category SKU</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="number" class="form-control input-sm" :class="{'edited': newSubCategory.order}" id="form_control_4" v-model="newSubCategory.order">
					    <label for="form_control_4">Sub Category Order</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
		                <label>Sub Category Status:</label><br>
		                <el-switch
		                	v-model="newSubCategory.status"
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
			<button v-if="!selectImageMode" type="button" class="btn btn-primary" @click="addNewMenuCategory()">Add</button>
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
			showAddCategoryModal: false,
			newSubCategory: {
				menu_id: this.$route.params.menu_id,
				name: '',
				desc: '',
				sku: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				order: null,
				parent_category: this.parentCategoryId
			},
			errorMessage: '',
			selectImageMode: false
		}
	},
	props: {
		parentCategoryId: {
			type: Number,
			required: true
		}
	},
	mounted () {
		this.showAddCategoryModal = true
	},
	methods: {
		/**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateCategoryData () {
			var addSubCategoryVue = this
			return new Promise(function (resolve, reject) {
				if (!addSubCategoryVue.newSubCategory.name.length) {
					reject('Category name cannot be blank')
				} else if (!addSubCategoryVue.newSubCategory.desc.length) {
					reject('Category description cannot be blank')
				} else if (!addSubCategoryVue.newSubCategory.sku.length) {
					reject('Category SKU cannot be blank')
				} else if (!addSubCategoryVue.newSubCategory.image_url.length) {
					reject('Category image URL cannot be blank')
				} else if (!$.isNumeric(addSubCategoryVue.newSubCategory.status)) {
					reject('Category status cannot be blank')
				} else if (!$.isNumeric(addSubCategoryVue.newSubCategory.order)) {
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
		 * To add the new category to the menu and close the modal and redirect to the menus page.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		addNewMenuCategory () {
			var addSubCategoryVue = this
			addSubCategoryVue.clearError()

			return addSubCategoryVue.validateCategoryData()
			.then(response => {
				CategoriesFunctions.addNewMenuCategory(addSubCategoryVue.newSubCategory, addSubCategoryVue.$root.appId, addSubCategoryVue.$root.appSecret, addSubCategoryVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						addSubCategoryVue.newSubCategory.id = response.payload.new_category_id
						this.closeModalAndAdd()
					} else {
						addSubCategoryVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						addSubCategoryVue.$router.push('/login/expired')
						return
					}
					addSubCategoryVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				addSubCategoryVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To close the modal and emit the newly created category object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndAdd () {
			this.$emit('addSubCategory', this.newSubCategory)
			this.$router.push('/app/menu_manager/categories/' + this.$route.params.menu_id)
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new category.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('deactivateAddSubCategoryModal')
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
			this.newSubCategory.image_url = val.image_url
		}
	},
	components: {
		Modal,
		GalleryPopup
	}
}
</script>

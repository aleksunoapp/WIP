<template>
	<modal :show="showAddCategoryModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="modal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center"
			    v-if="!imageMode">Add New Sub Category</h4>
			<h4 class="modal-title center"
			    v-else>Select An Image</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="alert alert-danger"
			     v-show="errorMessage"
			     ref="errorMessage">
				<button class="close"
				        @click="clearError()"></button>
				<span>{{errorMessage}}</span>
			</div>
			<div :class="{'col-md-2' : !imageMode, 'col-md-12' : imageMode}">
				<resource-picker @open="toggleImageMode()"
				                 @close="toggleImageMode()"
				                 @selected="updateImage"
				                 :imageButton="true"
				                 :imageUrl="newSubCategory.image_url"
				                 class="margin-top-15">
				</resource-picker>
			</div>
			<div class="col-md-9"
			     v-show="!imageMode">
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text"
					       class="form-control input-sm"
					       :class="{'edited': newSubCategory.name.length}"
					       id="form_control_1"
					       v-model="newSubCategory.name">
					<label for="form_control_1">Sub Category Name</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text"
					       class="form-control input-sm"
					       :class="{'edited': newSubCategory.desc.length}"
					       id="form_control_2"
					       v-model="newSubCategory.desc">
					<label for="form_control_2">Sub Category Description</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text"
					       class="form-control input-sm"
					       :class="{'edited': newSubCategory.sku.length}"
					       id="form_control_3"
					       v-model="newSubCategory.sku">
					<label for="form_control_3">Sub Category SKU</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="number"
					       class="form-control input-sm"
					       :class="{'edited': newSubCategory.order}"
					       id="form_control_4"
					       v-model="newSubCategory.order">
					<label for="form_control_4">Sub Category Order</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<label>Sub Category Status:</label><br>
					<el-switch v-model="newSubCategory.status"
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
		<div slot="modal-footer"
		     class="modal-footer">
			<button v-if="!imageMode"
			        type="button"
			        class="btn btn-primary"
			        @click="addNewMenuCategory()"
			        :disabled="creating">
				Add
				<i v-show="creating"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
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

export default {
	data () {
		return {
			showAddCategoryModal: false,
			creating: false,
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
			imageMode: false
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
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @returns {undefined}
		 */
		toggleImageMode () {
			this.imageMode = !this.imageMode
		},
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

			return addSubCategoryVue
				.validateCategoryData()
				.then(response => {
					addSubCategoryVue.creating = true
					CategoriesFunctions.addNewMenuCategory(
						addSubCategoryVue.newSubCategory,
						addSubCategoryVue.$root.appId,
						addSubCategoryVue.$root.appSecret,
						addSubCategoryVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								addSubCategoryVue.newSubCategory.id =
									response.payload.new_category_id
								this.closeModalAndAdd()
							} else {
								addSubCategoryVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add the subcategory',
								errorName: 'errorMessage',
								vue: addSubCategoryVue,
								containerRef: 'modal'
							})
						})
						.finally(() => {
							addSubCategoryVue.creating = false
						})
				})
				.catch(reason => {
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
			this.$router.push(
				'/app/menu_manager/categories/' + this.$route.params.menu_id
			)
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('deactivateAddSubCategoryModal')
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.newSubCategory.image_url = val.image_url
		}
	},
	components: {
		Modal,
		ResourcePicker
	}
}
</script>

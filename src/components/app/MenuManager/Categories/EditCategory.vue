<template>
	<modal :show="showEditCategoryModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="editModal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<transition name="fade"
			            mode="out-in">
				<h4 class="modal-title center"
				    v-if="!selectImageMode && !selectLocationMode"
				    key="mainEditMode">Edit Category</h4>
				<h4 class="modal-title center"
				    v-if="!selectImageMode && selectLocationMode"
				    key="selectLocationMode">
					<i class="fa fa-chevron-left clickable pull-left back-button"
					   @click="closeSelectLocationsPopup()"></i>Select Stores</h4>
				<h4 class="modal-title center"
				    v-if="selectImageMode && !selectLocationMode"
				    key="selectImageMode">Select An Image</h4>
			</transition>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="col-xs-12">
				<div class="alert alert-danger"
				     v-show="errorMessage"
				     ref="errorMessage">
					<button class="close"
					        @click="clearError()"></button>
					<span>{{errorMessage}}</span>
				</div>
				<div v-if="!selectLocationMode"
				     :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
					<resource-picker @open="goToPageTwo()"
					                 @close="goToPageOne()"
					                 @selected="updateImage"
					                 :imageButton="true"
					                 :imageUrl="categoryToBeEdited.image_url"
					                 class="margin-top-15">
					</resource-picker>
				</div>
				<div class="col-xs-12">
					<select-locations-popup v-if="selectLocationMode"
					                        @closeSelectLocationsPopup='updateSelectedLocations'
					                        :previouslySelected="selectedLocations">
					</select-locations-popup>
				</div>
				<div class="col-md-12"
				     v-if="!selectLocationMode && !selectImageMode">
					<fieldset :disabled="!$root.permissions['menu_manager menus categories update']">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_2"
							       v-model="categoryToBeEdited.name">
							<label for="form_control_2">Category Name</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_3"
							       v-model="categoryToBeEdited.desc">
							<label for="form_control_3">Category Description</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_4"
							       v-model="categoryToBeEdited.sku">
							<label for="form_control_4">Category SKU</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_5"
							       v-model="categoryToBeEdited.order">
							<label for="form_control_5">Category Order</label>
						</div>
					</fieldset>
					<div class="form-group form-md-line-input form-md-floating-label">
						<label>Category Status:</label><br>
						<el-switch :disabled="!$root.permissions['menu_manager menus categories update']"
						           v-model="categoryToBeEdited.status"
						           active-color="#0c6"
						           inactive-color="#ff4949"
						           :active-value="1"
						           :inactive-value="0"
						           active-text="Active"
						           inactive-text="Sold Out">
						</el-switch>
					</div>
					<div>
						<p class="margin-bottom-10 margin-top-30 margin-right-10">Select locations to apply the changes to:</p>
						<button type="submit"
						        class="btn blue btn-outline"
						        @click="selectLocations($event)">Select locations</button>
						<p class="grey-label margin-top-10"
						   v-if="selectedLocations.length">Selected {{ selectedLocations.length }}
							<span v-if="selectedLocations.length !== 1">locations</span>
							<span v-else>location</span>
						</p>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button v-if="!selectImageMode && !selectLocationMode && !$root.permissions['menu_manager menus categories update']"
			        type="button"
			        class="btn btn-primary"
			        @click="closeModal()">
				Close
			</button>
			<button v-if="!selectImageMode && !selectLocationMode && $root.permissions['menu_manager menus categories update']"
			        type="button"
			        class="btn btn-primary"
			        @click="updateMenuCategory()"
			        :disabled="updating">
				Save
				<i v-show="updating"
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
import SelectLocationsPopup from '../../../modules/SelectLocationsPopup'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showEditCategoryModal: false,
			updating: false,
			categoryToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false,
			selectedLocations: [],
			selectLocationMode: false
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
			if (
				this.$root.permissions['menu_manager menus categories update']
			) {
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
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateCategoryData () {
			var editCategoryVue = this
			return new Promise(function (resolve, reject) {
				if (!editCategoryVue.categoryToBeEdited.name.length) {
					reject('Category name cannot be blank')
				} else if (!editCategoryVue.categoryToBeEdited.desc.length) {
					reject('Category description cannot be blank')
				} else if (!editCategoryVue.categoryToBeEdited.sku.length) {
					reject('Category SKU cannot be blank')
				} else if (
					!editCategoryVue.categoryToBeEdited.image_url.length
				) {
					reject('Category image cannot be blank')
				} else if (
					!$.isNumeric(editCategoryVue.categoryToBeEdited.status)
				) {
					reject('Category status cannot be blank')
				} else if (
					!$.isNumeric(editCategoryVue.categoryToBeEdited.order)
				) {
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
			var editCategoryVue = this
			CategoriesFunctions.getCategoryDetails(
				editCategoryVue.$route.params.category_id,
				editCategoryVue.$root.appId,
				editCategoryVue.$root.appSecret,
				editCategoryVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editCategoryVue.categoryToBeEdited = response.payload[0]
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch category info',
						errorName: 'errorMessage',
						vue: editCategoryVue,
						containerRef: 'editModal'
					})
				})
		},
		/**
		 * To update the category and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateMenuCategory () {
			var editCategoryVue = this
			editCategoryVue.clearError()
			editCategoryVue.categoryToBeEdited.user_id =
				editCategoryVue.$root.createdBy
			editCategoryVue.categoryToBeEdited.update_locations =
				editCategoryVue.selectedLocations

			return editCategoryVue
				.validateCategoryData()
				.then(response => {
					editCategoryVue.updating = true
					CategoriesFunctions.updateMenuCategory(
						editCategoryVue.categoryToBeEdited,
						editCategoryVue.$root.appId,
						editCategoryVue.$root.appSecret,
						editCategoryVue.$root.userToken
					)
						.then(response => {
							if (
								response.code === 200 &&
								response.status === 'ok'
							) {
								this.closeModalAndUpdate()
							} else {
								editCategoryVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the category',
								errorName: 'errorMessage',
								vue: editCategoryVue,
								containerRef: 'editModal'
							})
						})
						.finally(() => {
							editCategoryVue.updating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					editCategoryVue.errorMessage = reason
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
			this.$emit('deactivateEditCategoryModal')
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
			this.$emit('updateCategory', this.categoryToBeEdited)
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
			if (
				this.$root.permissions['menu_manager menus categories update']
			) {
				this.categoryToBeEdited.image_url = val.image_url
			}
			this.goToPageOne()
		}
	},
	components: {
		Modal,
		ResourcePicker,
		SelectLocationsPopup
	}
}
</script>

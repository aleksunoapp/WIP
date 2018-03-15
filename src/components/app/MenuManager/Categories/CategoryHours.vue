<template>
	<modal :show="showEditCategoryModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<transition name="fade" mode="out-in">
				<h4 class="modal-title center" v-if="!selectImageMode && !selectLocationMode" key="mainEditMode">Edit Category</h4>
				<h4 class="modal-title center" v-if="!selectImageMode && selectLocationMode" key="selectLocationMode"><i class="fa fa-chevron-left clickable pull-left back-button" @click="closeSelectLocationsPopup()"></i>Select Stores</h4>
				<h4 class="modal-title center" v-if="selectImageMode && !selectLocationMode" key="selectImageMode"><i class="fa fa-chevron-left clickable pull-left back-button" @click="goToPageOne()"></i>  Select An Image</h4>
			</transition>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="page-one" v-if="!selectImageMode && !selectLocationMode" :class="{'active': !selectImageMode, 'disabled': selectImageMode}">
				<div class="alert alert-danger" v-if="errorMessage.length">
					<button class="close" data-close="alert" @click="clearError()"></button>
					<span>{{errorMessage}}</span>
				</div>
				<div class="col-md-3">
					<label for="form_control_1">Category Image</label>
					<div class="image-container clickable" v-if="!categoryToBeEdited.image_url.length">
						<img width="100" height="80" src="../../../../assets/img/app/image-placeholder.png" @click="goToPageTwo()">
					</div>
					<div class="image-container clickable" v-else>
						<img width="100" height="80" :src="categoryToBeEdited.image_url" @click="goToPageTwo()">
					</div>
				</div>
				<div class="col-md-9">
					<div class="form-group form-md-line-input form-md-floating-label">
						<input type="text" class="form-control input-sm edited" id="form_control_2" v-model="categoryToBeEdited.name">
						<label for="form_control_2">Category Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
						<input type="text" class="form-control input-sm edited" id="form_control_3" v-model="categoryToBeEdited.desc">
						<label for="form_control_3">Category Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
						<input type="text" class="form-control input-sm edited" id="form_control_4" v-model="categoryToBeEdited.sku">
						<label for="form_control_4">Category SKU</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
						<input type="text" class="form-control input-sm edited" id="form_control_5" v-model="categoryToBeEdited.order">
						<label for="form_control_5">Category Order</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
						<label>Category Status:</label><br>
						<el-switch
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
						<button type="submit" class="btn blue btn-outline" @click="selectLocations($event)">Select locations</button>
						<p class="grey-label margin-top-10" v-if="selectedLocations.length">Selected {{ selectedLocations.length }} location<span v-if="selectedLocations.length !== 1">s</span></p>
					</div>
				</div>	
			</div>
			<div class="page-two" :class="{'active': selectImageMode, 'disabled': !selectImageMode}">
				<gallery-popup v-if="selectImageMode" @selectedImage="updateImage"></gallery-popup>
				<select-locations-popup v-if="selectLocationMode" @closeSelectLocationsPopup='updateSelectedLocations' :previouslySelected="selectedLocations"></select-locations-popup>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button v-if="!selectImageMode && !selectLocationMode" type="button" class="btn btn-primary" @click="updateMenuCategory()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import CategoriesFunctions from '../../../../controllers/Categories'
import GalleryPopup from '../../../modules/GalleryPopup'
import SelectLocationsPopup from '../../../modules/SelectLocationsPopup'
import ajaxErrorHandler from '../../../../controllers/ErrorController'

export default {
	data () {
		return {
			showModal: false,
			errorMessage: '',
			category: {
				category_id: null,
				start_from: '',
				stop_on: '',
				category_hours: [
					{
						day: 0,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 2,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 3,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 4,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 5,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 6,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					}
				]
			}
		}
	},
	props: {
		originalCategory: {
			type: Object,
			required: true,
			default: () => {}
		}
	},
	created () {
		this.category.id = this.originalCategory.id
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
		validateData () {
			var editCategoryVue = this
			return new Promise(function (resolve, reject) {
				if (!editCategoryVue.categoryToBeEdited.name.length) {
					reject('Category name cannot be blank')
				} else if (!editCategoryVue.categoryToBeEdited.desc.length) {
					reject('Category description cannot be blank')
				} else if (!editCategoryVue.categoryToBeEdited.sku.length) {
					reject('Category SKU cannot be blank')
				} else if (!editCategoryVue.categoryToBeEdited.image_url.length) {
					reject('Category image cannot be blank')
				} else if (!$.isNumeric(editCategoryVue.categoryToBeEdited.status)) {
					reject('Category status cannot be blank')
				} else if (!$.isNumeric(editCategoryVue.categoryToBeEdited.order)) {
					reject('Category order should be a number')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {string} errorName - Name of the error to clear
		 * @returns {undefined}
		 */
		clearError (errorName) {
			this[errorName] = ''
		},
		/**
		 * To get the details of the category to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCategoryHours () {
			let _this = this
			CategoriesFunctions.getCategoryHours(_this.originalCategory.id, _this.$root.appId, _this.$root.appSecret, _this.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					_this.hours
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch hours for this category',
					errorName: 'errorMessage',
					vue: _this
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
			editCategoryVue.categoryToBeEdited.user_id = editCategoryVue.$root.createdBy
			editCategoryVue.categoryToBeEdited.update_locations = editCategoryVue.selectedLocations

			return editCategoryVue.validateCategoryData()
			.then(response => {
				CategoriesFunctions.updateMenuCategory(editCategoryVue.categoryToBeEdited, editCategoryVue.$root.appId, editCategoryVue.$root.appSecret, editCategoryVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editCategoryVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editCategoryVue.$router.push('/login/expired')
						return
					}
					editCategoryVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
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
			this.$router.push('/app/menu_manager/categories/' + this.$route.params.menu_id)
		},
		/**
		 * To close the modal and emit the updated category object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateCategory', this.categoryToBeEdited)
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
		GalleryPopup,
		SelectLocationsPopup
	}
}
</script>

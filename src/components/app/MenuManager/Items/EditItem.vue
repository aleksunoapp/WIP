<template>
	<modal :show="showEditItemModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<transition name="fade" mode="out-in">
				<h4 class="modal-title center" v-if="!selectImageMode && !selectLocationMode" key="mainEditMode">Edit Item</h4>
				<h4 class="modal-title center" v-if="!selectImageMode && selectLocationMode" key="selectLocationMode"><i class="fa fa-chevron-left clickable pull-left back-button" @click="closeSelectLocationsPopup()"></i>Select Stores</h4>
				<h4 class="modal-title center" v-if="selectImageMode && !selectLocationMode" key="selectImageMode"><i class="fa fa-chevron-left clickable pull-left back-button" @click="goToPageOne()"></i>  Select An Image</h4>
			</transition>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="page-one" v-if="!selectImageMode && !selectLocationMode" :class="{'active': !selectImageMode, 'disabled': selectImageMode}">
				<div class="alert alert-danger" v-show="errorMessage.length" ref="errorMessage">
				    <button class="close" data-close="alert" @click="clearError()"></button>
				    <span>{{errorMessage}}</span>
				</div>
				<div class="col-md-3">
					<label for="form_control_1">Item Image</label>
					<div class="image-container clickable" v-if="!itemToBeEdited.image_url.length">
						<img width="100" height="80" src="../../../../assets/img/app/image-placeholder.png" @click="goToPageTwo()">
					</div>
					<div class="image-container clickable" v-else>
						<img width="100" height="80" :src="itemToBeEdited.image_url" @click="goToPageTwo()">
					</div>
				</div>
				<div class="col-md-9">
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="itemToBeEdited.name">
					    <label for="form_control_2">Item Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="itemToBeEdited.desc">
					    <label for="form_control_3">Item Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="itemToBeEdited.short_description">
					    <label for="form_control_3">Item Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_4" v-model="itemToBeEdited.price">
					    <label for="form_control_4">Item Price</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm" :class="{'edited': itemToBeEdited.nutrition_summary.length}" id="form_control_3" v-model="itemToBeEdited.nutrition_summary">
					    <label for="form_control_3">Nutrition Summary</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_5" v-model="itemToBeEdited.sku">
					    <label for="form_control_5">Item SKU</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_6" v-model="itemToBeEdited.order">
					    <label for="form_control_6">Item Order</label>
					</div>
				    <div class="form-group form-md-line-input form-md-floating-label" v-if="itemTypes.length">
						<label>Item type:</label><br>
						<el-dropdown trigger="click" @command="updateItemType" size="mini" :show-timeout="50" :hide-timeout="50">
							<el-button size="mini">
								{{ itemTypeLabel }} <i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="type in itemTypes" :command="type.id" :key="id">{{type.name}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
		                <label>Item Status:</label><br>
		                <el-switch
		                	v-model="itemToBeEdited.status"
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
			<button v-if="!selectImageMode && !selectLocationMode" type="button" class="btn btn-primary" @click="updateCategoryItem()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import ItemsFunctions from '../../../../controllers/Items'
import GalleryPopup from '../../../modules/GalleryPopup'
import SelectLocationsPopup from '../../../modules/SelectLocationsPopup'
import ItemTypesFunctions from '../../../../controllers/ItemTypes'
import ajaxErrorHandler from '../../../../controllers/ErrorController'

export default {
	data () {
		return {
			showEditItemModal: false,
			itemToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false,
			selectedLocations: [],
			selectLocationMode: false,
			itemTypes: []
		}
	},
	computed: {
		itemTypeLabel () {
			if (!this.itemToBeEdited.item_type_id) {
				return 'Select'
			} else {
				return this.itemTypes.filter(type => type.id === this.itemToBeEdited.item_type_id).map(type => type.name)[0]
			}
		}
	},
	created () {
		// get category details by category id passed as route param
		this.getItemDetails()
		this.getItemTypes()
	},
	mounted () {
		this.showEditItemModal = true
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
			this.selectedLocations = locations
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
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateCategoryData () {
			var editItemVue = this
			return new Promise(function (resolve, reject) {
				if (!editItemVue.itemToBeEdited.name.length) {
					reject('Item name cannot be blank')
				} else if (!editItemVue.itemToBeEdited.desc.length) {
					reject('Item description cannot be blank')
				} else if (!editItemVue.itemToBeEdited.short_description.length) {
					reject('Item short description cannot be blank')
				} else if (!editItemVue.itemToBeEdited.price.length) {
					reject('Item price cannot be blank')
				} else if (!editItemVue.itemToBeEdited.nutrition_summary.length) {
					reject('Nutrition summary cannot be blank')
				} else if (!editItemVue.itemToBeEdited.sku.length) {
					reject('Item SKU cannot be blank')
				} else if (!editItemVue.itemToBeEdited.image_url.length) {
					reject('Item image URL cannot be blank')
				} else if (!$.isNumeric(editItemVue.itemToBeEdited.order)) {
					reject('Item order should be a number')
				} else if (!editItemVue.itemToBeEdited.item_type_id) {
					reject('Select an item type')
				} else if (!$.isNumeric(editItemVue.itemToBeEdited.status)) {
					reject('Item status cannot be blank')
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
		 * To get the details of the item to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemDetails () {
			var editItemVue = this
			ItemsFunctions.getItemDetails(editItemVue.$route.params.item_id, editItemVue.$root.appId, editItemVue.$root.appSecret, editItemVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editItemVue.itemToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editItemVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To update the item and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateCategoryItem () {
			var editItemVue = this
			editItemVue.itemToBeEdited.user_id = editItemVue.$root.createdBy
			editItemVue.itemToBeEdited.update_locations = editItemVue.selectedLocations
			if (!editItemVue.itemToBeEdited.type) { editItemVue.itemToBeEdited.type === 'custom' }
			editItemVue.clearError()

			return editItemVue.validateCategoryData()
			.then(response => {
				ItemsFunctions.updateCategoryItem(editItemVue.itemToBeEdited, editItemVue.$root.appId, editItemVue.$root.appSecret, editItemVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editItemVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editItemVue.$router.push('/login/expired')
						return
					}
					editItemVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editItemVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To close the modal and emit the updated item object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('editItem', this.itemToBeEdited)
			this.$router.push('/app/menu_manager/items/' + this.$route.params.category_id)
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('deactivateEditItemModal')
			this.$router.push('/app/menu_manager/items/' + this.$route.params.category_id)
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
			this.itemToBeEdited.image_url = val.image_url
		},
		/**
		 * To get a list of all item types.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemTypes () {
			var _this = this
			return ItemTypesFunctions.getItemTypes(_this.$root.appId, _this.$root.appSecret, _this.$root.userToken)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					_this.itemTypes = response.payload
				} else {

				}
			}).catch(reason => {
				_this.loadingItemTypes = false
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch the list of item types',
					errorName: 'errorMessage',
					vue: _this
				})
			})
		},
		/**
		 * To update the item_type_id field of the new item
		 * @function
		 * @param {integer} id - The selected id
		 * @returns {undefined}
		 */
		getItemTypeName (id) {
			if (!id || !this.itemTypes.length) {
				return 'n/a'
			} else {
				return this.itemTypes.filter(type => type.id === id).map(type => type.name)[0]
			}
		},
		/**
		 * To update the item_type_id field of the new item
		 * @function
		 * @param {integer} id - The selected id
		 * @returns {undefined}
		 */
		updateItemType (id) {
			this.itemToBeEdited.item_type_id = id
		}
	},
	components: {
		Modal,
		GalleryPopup,
		SelectLocationsPopup
	}
}
</script>

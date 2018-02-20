<template>
	<modal :show="showEditMenuModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<transition name="fade" mode="out-in">
				<h4 class="modal-title center" v-if="!selectImageMode && !selectLocationMode" key="mainEditMode">Edit Menu</h4>
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
					<label for="form_control_7">Menu Image</label>
					<div class="image-container clickable" v-if="!menuToBeEdited.image_url.length">
						<img width="100" height="80" src="../../../../assets/img/app/image-placeholder.png" @click="goToPageTwo()">
					</div>
					<div class="image-container clickable" v-else>
						<img width="100" height="80" :src="menuToBeEdited.image_url" @click="goToPageTwo()">
					</div>
				</div>
				<div class="col-md-9">
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="menuToBeEdited.name">
					    <label for="form_control_1">Menu Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="menuToBeEdited.desc">
					    <label for="form_control_2">Menu Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="menuToBeEdited.sku">
					    <label for="form_control_3">Menu SKU</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm edited" id="form_control_4" v-model="menuToBeEdited.order">
					    <label for="form_control_4">Menu Order</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
		                <label>Menu Status:</label><br>
		                <el-switch
		                	v-model="menuToBeEdited.status"
		                	active-color="#0c6"
		                	inactive-color="#ff4949"
		                	:active-value="1"
		                	:inactive-value="0"
		                	active-text="Active"
		                	inactive-text="Sold Out">
		                </el-switch>
		            </div>
        			<div class="form-group form-md-line-input form-md-floating-label">
                        <label>Catering:</label><br>
                        <el-switch
                        	v-model="menuToBeEdited.catering"
                        	active-color="#0c6"
                        	inactive-color="#ff4949"
                        	:active-value="1"
                        	:inactive-value="0"
                        	active-text="Available"
                        	inactive-text="Unavailable">
                        </el-switch>
                    </div>
        			<div v-if="menuToBeEdited.catering" class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm" id="form_control_5" :class="{'edited': menuToBeEdited.min.length}" v-model="menuToBeEdited.min">
					    <label for="form_control_5">Minimum order value</label>
					</div>
        			<div v-if="menuToBeEdited.catering" class="form-group form-md-line-input form-md-floating-label">
					    <input type="text" class="form-control input-sm" id="form_control_6" :class="{'edited': menuToBeEdited.max.length}" v-model="menuToBeEdited.max">
					    <label for="form_control_6">Maximum order value</label>
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
		<div slot="modal-footer" class="modal-footer clear">
			<button v-if="!selectImageMode && !selectLocationMode" type="button" class="btn btn-primary" @click="updateMenu()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'
import GalleryPopup from '../../../modules/GalleryPopup'
import SelectLocationsPopup from '../../../modules/SelectLocationsPopup'

export default {
	data () {
		return {
			showEditMenuModal: false,
			menuToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false,
			customWidth: 90,
			statusChecked: false,
			selectLocationMode: false,
			selectedLocations: []
		}
	},
	props: {
		passedMenuId: {
			type: Number
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
				} else if (editMenuVue.menuToBeEdited.catering && !editMenuVue.menuToBeEdited.min) {
					reject('Minimum order value cannot be blank')
				} else if (editMenuVue.menuToBeEdited.catering && !editMenuVue.menuToBeEdited.max) {
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
			MenusFunctions.getMenuDetails(editMenuVue.passedMenuId, editMenuVue.$root.appId, editMenuVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editMenuVue.menuToBeEdited = response.payload
					if (editMenuVue.menuToBeEdited.min === 0 || editMenuVue.menuToBeEdited.min) {
						editMenuVue.menuToBeEdited.min = editMenuVue.menuToBeEdited.min.toString()
					}
					if (editMenuVue.menuToBeEdited.max === 0 || editMenuVue.menuToBeEdited.max) {
						editMenuVue.menuToBeEdited.max = editMenuVue.menuToBeEdited.max.toString()
					}
					if (editMenuVue.menuToBeEdited.status === 1) {
						editMenuVue.statusChecked = true
					}
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editMenuVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
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
			editMenuVue.menuToBeEdited.location_id = editMenuVue.$root.activeLocation.id
			editMenuVue.menuToBeEdited.update_locations = editMenuVue.selectedLocations
			editMenuVue.clearError()

			return editMenuVue.validateCategoryData()
			.then(response => {
				MenusFunctions.updateMenu(editMenuVue.menuToBeEdited, editMenuVue.$root.appId, editMenuVue.$root.appSecret, editMenuVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editMenuVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editMenuVue.$router.push('/login/expired')
						return
					}
					editMenuVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
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
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateMenu', this.menuToBeEdited)
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
			this.menuToBeEdited.image_url = val.image_url
		}
	},
	components: {
		Modal,
		GalleryPopup,
		SelectLocationsPopup
	}
}
</script>
<style scoped>
.image-container {
	border: 1px dotted #c2cad8;
	text-align: center;
}
</style>

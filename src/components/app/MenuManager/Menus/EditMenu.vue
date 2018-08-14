<template>
	<modal :show="showEditMenuModal" effect="fade" @closeOnEscape="closeModal" ref="editModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<transition name="fade" mode="out-in">
				<h4 class="modal-title center" v-if="!selectImageMode && !selectLocationMode" key="mainEditMode">Edit Menu</h4>
				<h4 class="modal-title center" v-if="!selectImageMode && selectLocationMode" key="selectLocationMode"><i class="fa fa-chevron-left clickable pull-left back-button" @click="closeSelectLocationsPopup()"></i>Select Stores</h4>
				<h4 class="modal-title center" v-if="selectImageMode && !selectLocationMode" key="selectImageMode">Select An Image</h4>
			</transition>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="row">
				<div class="col-xs-12">
					<div class="alert alert-danger" v-show="errorMessage.length" ref="errorMessage">
					    <button class="close" data-close="alert" @click="clearError()"></button>
					    <span>{{errorMessage}}</span>
					</div>					
				</div>
        		<div v-if="!selectLocationMode" :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
					<resource-picker 
						@open="goToPageTwo()"
						@close="goToPageOne()"
						@selected="updateImage" 
						:imageButton="true"
						:imageUrl="menuToBeEdited.image_url"
						class="margin-top-15"
					>
					</resource-picker>
        		</div>
        		<div class="col-xs-12">        			
	    			<select-locations-popup 
	    				v-if="selectLocationMode" 
	    				@closeSelectLocationsPopup='updateSelectedLocations' 
	    				:previouslySelected="selectedLocations"
	    			>
					</select-locations-popup>
        		</div>
				<div class="col-md-12" v-show="!selectImageMode && !selectLocationMode">
					<fieldset :disabled="!$root.permissions['menu_manager menus update']">
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
					</fieldset>
					<div class="form-group form-md-line-input form-md-floating-label">
		                <label>Menu Status:</label><br>
		                <el-switch
							:disabled="!$root.permissions['menu_manager menus update']"
		                	v-model="menuToBeEdited.status"
		                	active-color="#0c6"
		                	inactive-color="#ff4949"
		                	:active-value="1"
		                	:inactive-value="0"
		                	active-text="Active"
		                	inactive-text="Sold Out">
		                </el-switch>
		            </div>
		            <el-date-picker 
						:disabled="!$root.permissions['menu_manager menus update']"
		            	v-model="menuToBeEdited.start_from" 
		            	:editable="false"
		            	type="date" 
		            	class="narrow-datepicker"
		            	format="yyyy-MM-dd" 
		            	value-format="yyyy-MM-dd" 
		            	placeholder="From"></el-date-picker>
		            -
		            <el-date-picker 
						:disabled="!$root.permissions['menu_manager menus update']"
		            	v-model="menuToBeEdited.stop_on" 
		            	:editable="false"
		            	type="date" 
		            	class="narrow-datepicker"
		            	format="yyyy-MM-dd" 
		            	value-format="yyyy-MM-dd" 
		            	placeholder="To"></el-date-picker>
        			<div class="form-group form-md-line-input form-md-floating-label">
                        <label>Catering:</label><br>
                        <el-switch
                        	:disabled="!$root.permissions['menu_manager menus update']"
							v-model="menuToBeEdited.catering"
                        	active-color="#0c6"
                        	inactive-color="#ff4949"
                        	:active-value="1"
                        	:inactive-value="0"
                        	active-text="Available"
                        	inactive-text="Unavailable">
                        </el-switch>
                    </div>
					<fieldset :disabled="!$root.permissions['menu_manager menus update']">
						<div v-if="menuToBeEdited.catering" class="form-group form-md-line-input form-md-floating-label">
							<input 
								type="text" class="form-control input-sm" id="form_control_5" :class="{'edited': menuToBeEdited.min.length}" v-model="menuToBeEdited.min">
							<label for="form_control_5">Minimum order value</label>
						</div>
						<div v-if="menuToBeEdited.catering" class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm" id="form_control_6" :class="{'edited': menuToBeEdited.max.length}" v-model="menuToBeEdited.max">
							<label for="form_control_6">Maximum order value</label>
						</div>
					</fieldset>
        			<div>
						<p class="margin-bottom-10 margin-top-30 margin-right-10">Select locations to apply the changes to:</p>
        				<button type="submit" class="btn blue btn-outline" @click="selectLocations($event)">Select locations</button>
        				<p class="grey-label margin-top-10" v-if="selectedLocations.length">Selected {{ selectedLocations.length }} location<span v-if="selectedLocations.length !== 1">s</span></p>
        			</div>
        			<button 
						v-if="!$root.permissions['menu_manager menus update']"
						type="button" 
						class="btn btn-primary pull-right" 
						@click="closeModal()">
						Close
					</button>
        			<button 
						v-else
						type="button" 
						class="btn btn-primary pull-right" 
						@click="updateMenu()"
						:disabled="updating">
						Save
						<i 
							v-show="updating"
							class="fa fa-spinner fa-pulse fa-fw">
						</i>
					</button>
				</div>
			</div>
		</div>
		<div slot="modal-footer"></div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'
import ajaxErrorHandler from '../../../../controllers/ErrorController'
import ResourcePicker from '../../../modules/ResourcePicker'
import SelectLocationsPopup from '../../../modules/SelectLocationsPopup'

export default {
	data () {
		return {
			showEditMenuModal: false,
			menuToBeEdited: {
				image_url: ''
			},
			updating: false,
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
			if (this.$root.permissions['menu_manager menus update']) {
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
				} else if (editMenuVue.menuToBeEdited.start_from && !editMenuVue.menuToBeEdited.stop_on) {
					reject('Please provide an end date')
				} else if (!editMenuVue.menuToBeEdited.start_from && editMenuVue.menuToBeEdited.stop_on) {
					reject('Please provide a start date')
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
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch menu info',
					errorName: 'errorMessage',
					vue: editMenuVue,
					containerRef: 'editModal'
				})
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
				editMenuVue.updating = true
				MenusFunctions.updateMenu(editMenuVue.menuToBeEdited, editMenuVue.$root.appId, editMenuVue.$root.appSecret, editMenuVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editMenuVue.errorMessage = response.message
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the item',
						errorName: 'errorMessage',
						vue: editMenuVue,
						containerRef: 'editModal'
					})
				}).finally(() => {
					editMenuVue.updating = false
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
			if (this.$root.permissions['menu_manager menus update']) {
				this.menuToBeEdited.image_url = val.image_url
			}
		}
	},
	components: {
		Modal,
		ResourcePicker,
		SelectLocationsPopup
	}
}
</script>
<style scoped>
.image-container {
	border: 1px dotted #c2cad8;
	text-align: center;
}
.narrow-datepicker {
	max-width: 40%;
}
</style>

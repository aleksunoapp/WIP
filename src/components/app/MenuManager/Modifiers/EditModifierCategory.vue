<template>
	<modal :show="showEditCategoryModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<transition name="fade" mode="out-in">
				<h4 class="modal-title center" v-if="!selectImageMode && !selectLocationMode" key="mainEditMode">Edit Modifier Category</h4>
				<h4 class="modal-title center" v-if="!selectImageMode && selectLocationMode" key="selectLocationMode"><i class="fa fa-chevron-left clickable pull-left back-button" @click="closeSelectLocationsPopup()"></i>Select Stores</h4>
			    <h4 class="modal-title center" v-if="selectImageMode && !selectLocationMode" key="selectImageMode">Select An Image</h4>
			</transition>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="col-xs-12">
				<div class="alert alert-danger" v-if="errorMessage.length">
				    <button class="close" data-close="alert" @click="clearError()"></button>
				    <span>{{errorMessage}}</span>
				</div>
			    <div v-if="!selectLocationMode" :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
					<resource-picker 
						@open="goToPageTwo()"
						@close="goToPageOne()"
						@selected="updateImage" 
						:imageButton="true"
						:imageUrl="categoryToBeEdited.image_url"
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
					<fieldset :disabled="!$root.permissions['menu_manager modifiers update']">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm edited" id="form_control_1" v-model="categoryToBeEdited.name">
							<label for="form_control_1">Modifier Category Name</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm edited" id="form_control_2" v-model="categoryToBeEdited.desc">
							<label for="form_control_2">Modifier Category Description</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm edited" id="form_control_3" v-model="categoryToBeEdited.sku">
							<label for="form_control_3">Modifier Category SKU</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm edited" id="form_control_4" v-model="categoryToBeEdited.min">
							<label for="form_control_4">Modifier Category Min</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm edited" id="form_control_5" v-model="categoryToBeEdited.max">
							<label for="form_control_5">Modifier Category Max</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm edited" id="form_control_6" v-model="categoryToBeEdited.included">
							<label for="form_control_6">Modifier Category Number Free</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm edited" id="form_control_7" v-model="categoryToBeEdited.order">
							<label for="form_control_7">Modifier Category Order</label>
						</div>
					</fieldset>
					<div class="form-group form-md-line-input form-md-floating-label">
		                <label>Modifier Category Status:</label><br>
		                <el-switch
		                	:disabled="!$root.permissions['menu_manager modifiers update']"
							v-model="categoryToBeEdited.status"
		                	active-color="#0c6"
		                	inactive-color="#ff4949"
		                	:active-value="1"
		                	:inactive-value="0"
		                	active-text="Available"
		                	inactive-text="Sold Out">
		                </el-switch>
		            </div>
        			<div>
						<p class="margin-bottom-10 margin-top-30 margin-right-10">Select locations to apply the changes to:</p>
        				<button type="submit" class="btn blue btn-outline" @click="selectLocations($event)">Select locations</button>
        				<p class="grey-label margin-top-10" v-if="selectedLocations.length">Selected {{ selectedLocations.length }} location<span v-if="selectedLocations.length !== 1">s</span></p>
        			</div>
					<button 
						v-if="!$root.permissions['menu_manager modifiers update']"
						type="button" 
						class="btn btn-primary pull-right" 
						@click="closeModal()">
						Close
					</button>
					<button 
						v-else
						type="button" 
						class="btn btn-primary pull-right" 
						@click="updateModifierCategory()">
						Save
					</button>
	         	</div>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import ModifiersFunctions from '../../../../controllers/Modifiers'
import SelectLocationsPopup from '../../../modules/SelectLocationsPopup'
import ResourcePicker from '../../../modules/ResourcePicker'

export default {
	data () {
		return {
			showEditCategoryModal: false,
			categoryToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false,
			customWidth: 90,
			selectLocationMode: false,
			selectedLocations: []
		}
	},
	created () {
		// get category details by category id passed as route param
		this.getModifierCategoryDetails()
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
			if (this.$root.permissions['menu_manager modifiers update']) {
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
		 * To check if the modifier category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateModifierCategoryData () {
			var editModifierCategoryVue = this
			return new Promise(function (resolve, reject) {
				if (!editModifierCategoryVue.categoryToBeEdited.name.length) {
					reject('Modifier Category name cannot be blank')
				} else if (!editModifierCategoryVue.categoryToBeEdited.desc.length) {
					reject('Modifier Category description cannot be blank')
				} else if (!editModifierCategoryVue.categoryToBeEdited.sku.length) {
					reject('Modifier Category SKU cannot be blank')
				} else if (!editModifierCategoryVue.categoryToBeEdited.image_url.length) {
					reject('Modifier Category image cannot be blank')
				} else if (!$.isNumeric(editModifierCategoryVue.categoryToBeEdited.status)) {
					reject('Modifier Category status cannot be blank')
				} else if (!$.isNumeric(editModifierCategoryVue.categoryToBeEdited.included)) {
					reject('Modifier Category included should be a number')
				} else if (!$.isNumeric(editModifierCategoryVue.categoryToBeEdited.max)) {
					reject('Modifier Category max should be a number')
				} else if (!$.isNumeric(editModifierCategoryVue.categoryToBeEdited.min)) {
					reject('Modifier Category min should be a number')
				} else if (!$.isNumeric(editModifierCategoryVue.categoryToBeEdited.order)) {
					reject('Modifier Category order should be a number')
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
		 * To get the details of the modifier category to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifierCategoryDetails () {
			var editModifierCategoryVue = this
			ModifiersFunctions.getModifierCategoryDetails(editModifierCategoryVue.$route.params.modifier_category_id, editModifierCategoryVue.$root.appId, editModifierCategoryVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editModifierCategoryVue.categoryToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editModifierCategoryVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To update the modifier category and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateModifierCategory () {
			var editModifierCategoryVue = this
			editModifierCategoryVue.categoryToBeEdited.user_id = editModifierCategoryVue.$root.createdBy
			editModifierCategoryVue.categoryToBeEdited.update_locations = editModifierCategoryVue.selectedLocations
			editModifierCategoryVue.clearError()

			return editModifierCategoryVue.validateModifierCategoryData()
			.then(response => {
				ModifiersFunctions.updateModifierCategory(editModifierCategoryVue.categoryToBeEdited, editModifierCategoryVue.$root.appId, editModifierCategoryVue.$root.appSecret, editModifierCategoryVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editModifierCategoryVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editModifierCategoryVue.$router.push('/login/expired')
						return
					}
					editModifierCategoryVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editModifierCategoryVue.errorMessage = reason
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
			this.$router.push('/app/menu_manager/modifiers')
		},
		/**
		 * To close the modal and emit the updated modifier category object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateModifierCategory', this.categoryToBeEdited)
			this.$router.push('/app/menu_manager/modifiers')
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
			if (this.$root.permissions['menu_manager modifiers update']) {
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

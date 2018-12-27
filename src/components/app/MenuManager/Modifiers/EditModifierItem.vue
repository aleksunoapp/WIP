<template>
	<modal :show="showEditItemModal"
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
			<transition name="fade"
			            mode="out-in">
				<h4 class="modal-title center"
				    v-if="!selectImageMode && !selectLocationMode"
				    key="mainEditMode">
						<div>Edit <strong>{{itemToBeEdited.name}} </strong></div>
						<br />
						<small>{{itemToBeEdited.sku ? `SKU: ${itemToBeEdited.sku}` : ''}}</small>
					</h4>
				<h4 class="modal-title center"
				    v-if="selectImageMode && !selectLocationMode"
				    key="imageMode">Select an Image</h4>
				<h4 class="modal-title center"
				    v-if="!selectImageMode && selectLocationMode"
				    key="selectLocationMode">
					<i class="fa fa-chevron-left clickable pull-left back-button"
					   @click="closeSelectLocationsPopup()"></i>Select Stores</h4>
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
					                 :imageUrl="itemToBeEdited.image_url"
					                 class="margin-top-15">
					</resource-picker>
				</div>

				<store-picker-with-button
					v-if="selectLocationMode"
					:previouslySelected="selectedLocations"
					@close="updateSelectedLocations"
				>
				</store-picker-with-button>

				<div class="col-xs-12"
				     v-show="!selectImageMode && !selectLocationMode">
					<fieldset :disabled="!$root.permissions['menu_manager modifiers items update']">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_1"
							       v-model="itemToBeEdited.name">
							<label for="form_control_1">Modifier Item Name</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_2"
							       v-model="itemToBeEdited.desc">
							<label for="form_control_2">Modifier Item Description</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_3"
							       v-model="itemToBeEdited.price">
							<label for="form_control_3">Modifier Item Price</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_5"
							       v-model="itemToBeEdited.min">
							<label for="form_control_5">Modifier Item Min</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_6"
							       v-model="itemToBeEdited.max">
							<label for="form_control_6">Modifier Item Max</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm edited"
							       id="form_control_7"
							       v-model="itemToBeEdited.order">
							<label for="form_control_7">Modifier Item Order</label>
						</div>
					</fieldset>
					<div class="form-group form-md-line-input form-md-floating-label">
						<label>Modifier Item Status:</label><br>
						<el-switch :disabled="!$root.permissions['menu_manager modifiers items update']"
						           v-model="itemToBeEdited.status"
						           active-color="#0c6"
						           inactive-color="#ff4949"
						           :active-value="1"
						           :inactive-value="0"
						           active-text="Available"
						           inactive-text="Sold Out">
						</el-switch>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
						<label>Override:</label><br>
						<el-switch v-model="itemToBeEdited.override"
												active-color="#0c6"
												inactive-color="#ff4949"
												:active-value="1"
												:inactive-value="0"
												active-text="Yes"
												inactive-text="No">
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
							<span v-else>locations</span>
						</p>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button v-if="!selectImageMode && !selectLocationMode && !$root.permissions['menu_manager modifiers items update']"
			        type="button"
			        class="btn btn-primary"
			        @click="closeModal()">
				Close
			</button>
			<button v-if="!selectImageMode && !selectLocationMode && $root.permissions['menu_manager modifiers items update']"
			        type="button"
			        class="btn btn-primary"
			        @click="updateModifierItem()">
				Save
			</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import ModifiersFunctions from '../../../../controllers/Modifiers'
import ResourcePicker from '../../../modules/ResourcePicker'
import StorePickerWithButton from '@/components/modules/StorePickerWithButton'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showEditItemModal: false,
			itemToBeEdited: {
				image_url: ''
			},
			errorMessage: '',
			selectImageMode: false,
			selectLocationMode: false,
			selectedLocations: []
		}
	},
	created () {
		// get category details by category id passed as route param
		this.getModifierItemDetails()
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
			if (this.$root.permissions['menu_manager modifiers items update']) {
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
		 * To check if the modifier item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateModifierItemData () {
			var editModifierItemVue = this
			return new Promise(function (resolve, reject) {
				if (!editModifierItemVue.itemToBeEdited.name.length) {
					reject('Item name cannot be blank')
				} else if (!editModifierItemVue.itemToBeEdited.desc.length) {
					reject('Item description cannot be blank')
				} else if (!editModifierItemVue.itemToBeEdited.price.length) {
					reject('Item price cannot be blank')
				} else if (
					!editModifierItemVue.itemToBeEdited.image_url.length
				) {
					reject('Item image URL cannot be blank')
				} else if (
					!$.isNumeric(editModifierItemVue.itemToBeEdited.status)
				) {
					reject('Item status cannot be blank')
				} else if (
					!$.isNumeric(editModifierItemVue.itemToBeEdited.min)
				) {
					reject('Modifier Item min should be a number')
				} else if (
					!$.isNumeric(editModifierItemVue.itemToBeEdited.max)
				) {
					reject('Modifier Item max should be a number')
				} else if (
					Number(editModifierItemVue.itemToBeEdited.min) >
					Number(editModifierItemVue.itemToBeEdited.max)
				) {
					reject('Modifier Item max cannot be larger than min')
				} else if (
					!$.isNumeric(editModifierItemVue.itemToBeEdited.order)
				) {
					reject('Modifier Item order should be a number')
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
		 * To get the details of the modifier item to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifierItemDetails () {
			var editModifierItemVue = this
			ModifiersFunctions.getModifierItemDetails(
				editModifierItemVue.$route.params.modifier_item_id,
				editModifierItemVue.$root.appId,
				editModifierItemVue.$root.appSecret,
				editModifierItemVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editModifierItemVue.itemToBeEdited = response.payload[0]
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not get modifier info',
						errorName: 'errorMessage',
						vue: editModifierItemVue,
						containerRef: 'modal'
					})
				})
		},
		/**
		 * To update the modifier item and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateModifierItem () {
			var editModifierItemVue = this
			editModifierItemVue.itemToBeEdited.user_id =
				editModifierItemVue.$root.createdBy
			editModifierItemVue.itemToBeEdited.update_locations =
				editModifierItemVue.selectedLocations
			editModifierItemVue.clearError()

			return editModifierItemVue
				.validateModifierItemData()
				.then(response => {
					ModifiersFunctions.updateModifierItem(
						editModifierItemVue.itemToBeEdited,
						editModifierItemVue.$root.appId,
						editModifierItemVue.$root.appSecret,
						editModifierItemVue.$root.userToken
					)
						.then(response => {
							if (
								response.code === 200 &&
								response.status === 'ok'
							) {
								this.closeModalAndUpdate()
								this.showEditSuccess(response.payload)
							} else {
								editModifierItemVue.errorMessage =
									response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not get modifier info',
								errorName: 'errorMessage',
								vue: editModifierItemVue,
								containerRef: 'modal'
							})
						})
				})
				.catch(reason => {
					editModifierItemVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showEditSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Modifier Item has been saved'
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
		 * To close the modal and emit the updated modifier item object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('editModifierItem')
			this.$router.push(
				'/app/menu_manager/modifier_items/' +
					this.$route.params.modifier_id
			)
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('deactivateEditItemModal')
			this.$router.push(
				'/app/menu_manager/modifier_items/' +
					this.$route.params.modifier_id
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
			if (this.$root.permissions['menu_manager modifiers items update']) {
				this.itemToBeEdited.image_url = val.image_url
			}
			this.goToPageOne()
		}
	},
	components: {
		Modal,
		ResourcePicker,
		StorePickerWithButton
	}
}
</script>
<style scoped>
.modal-title.center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
span.modal-title {
	display: inline-block;
}
</style>

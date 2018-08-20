<template>
	<modal v-bind:show="showNutritionModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="modal">
		<div slot="modal-header"
		     class="modal-header">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<transition name="fade"
			            mode="out-in">
				<h4 class="modal-title center"
				    v-if="!selectLocationMode"
				    key="mainEditMode">Modifier Item Nutrition Info</h4>
				<h4 class="modal-title center"
				    v-if="selectLocationMode"
				    key="selectLocationMode">
					<i class="fa fa-chevron-left clickable pull-left back-button"
					   @click="closeSelectLocationsPopup()"></i>Select Stores</h4>
			</transition>
		</div>
		<div slot="modal-body"
		     class="modal-body"
		     v-if="!creatingModifierNutritionInfo">
			<div class="margin-top-20"
			     v-show="errorMessage"
			     ref="errorMessage">
				<div class="alert alert-danger">
					<span>{{ errorMessage }}</span>
					<div class="margin-top-15">
						<button type="button"
						        class="btn blue"
						        @click="creatingModifierNutritionInfo = true">Add Nutrition Info</button>
					</div>
				</div>
			</div>
			<div class="portlet light bg-inverse clear"
			     v-if="!errorMessage.length && !creatingModifierNutritionInfo && !selectLocationMode">
				<div class="portlet-title">
					<div class="caption">Click the button on the right to edit</div>
					<div class="actions">
						<a class="btn btn-circle btn-icon-only btn-default"
						   @click="editingModifierNutritionInfo = true">
							<i class="fa fa-lg fa-pencil"></i>
						</a>
					</div>
				</div>
				<div class="portlet-body">
					<div v-show="editNutritionError"
					     ref="editNutritionError">
						<div class="alert alert-danger">
							<span>{{ editNutritionError }}</span>
						</div>
					</div>
					<div class='table-scrollable table-fixed-height'>
						<table class='table'>
							<thead>
								<tr>
									<th> Category </th>
									<th> Value </th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="info in itemNutritionInfo" :key="info.id">
									<td v-if="info.key !== 'id' && info.key !== 'modifier_item_id'"> {{ info.name }} </td>
									<td v-if="info.key !== 'id' && info.key !== 'modifier_item_id'">
										<input type="text"
										       class="form-control input-sm"
										       v-model="info.value"
										       :disabled="!editingModifierNutritionInfo">
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div>
						<p class="margin-bottom-10 margin-top-30 margin-right-10">Select locations to apply the changes to:</p>
						<button type="submit"
						        class="btn blue btn-outline"
						        @click="selectLocations($event)">Select locations</button>
						<p class="grey-label margin-top-10"
						   v-if="selectedLocations.length">Selected {{ selectedLocations.length }} location
							<span v-if="selectedLocations.length !== 1">s</span>
						</p>
						<div class="form-group form-md-line-input form-md-floating-label">
							<label>Update all items?</label><br>
							<el-switch v-model="update_all_items"
							           active-color="#0c6"
							           inactive-color="#ff4949"
							           :active-value="1"
							           :inactive-value="0"
							           active-text="Yes"
							           inactive-text="No">
							</el-switch>
						</div>
					</div>
				</div>
			</div>
			<select-locations-popup v-if="selectLocationMode"
			                        @closeSelectLocationsPopup='updateSelectedLocations'
			                        :previouslySelected="selectedLocations"></select-locations-popup>
		</div>
		<div slot="modal-body"
		     class="modal-body"
		     v-if="creatingModifierNutritionInfo">
			<div class="margin-top-20"
			     v-show="createModifierNutritionError"
			     ref="createModifierNutritionError">
				<div class="alert alert-danger">
					<span>{{ createModifierNutritionError }}</span>
				</div>
			</div>
			<div class="portlet light bg-inverse clear">
				<div class="portlet-title">
					<div class="caption">Add nutrition info for modifier item '{{ modifierItem.name }}'</div>
				</div>
				<div class="portlet-body">
					<div class='table-scrollable table-fixed-height'>
						<table class='table'>
							<thead>
								<tr>
									<th> Category </th>
									<th> Value </th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td> Calories </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.calories"> </td>
								</tr>
								<tr>
									<td> Minimum Calories </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.min_cal"> </td>
								</tr>
								<tr>
									<td> Total Fat </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.total_fat"> </td>
								</tr>
								<tr>
									<td> Saturated Fat </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.saturated_fat"> </td>
								</tr>
								<tr>
									<td> Trans Fat </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.trans_fat"> </td>
								</tr>
								<tr>
									<td> Cholesterol </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.cholesterol"> </td>
								</tr>
								<tr>
									<td> Sodium </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.sodium"> </td>
								</tr>
								<tr>
									<td> Carbohydrates </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.carbs"> </td>
								</tr>
								<tr>
									<td> Fibre </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.fibre"> </td>
								</tr>
								<tr>
									<td> Sugar </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.sugar"> </td>
								</tr>
								<tr>
									<td> Protein </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.protein"> </td>
								</tr>
								<tr>
									<td> Vitamin A </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.vit_a"> </td>
								</tr>
								<tr>
									<td> Vitamin C </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.vit_c"> </td>
								</tr>
								<tr>
									<td> Calcium </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.calcium"> </td>
								</tr>
								<tr>
									<td> Iron </td>
									<td> <input type="text"
										       class="form-control input-sm"
										       v-model="newModifierNutritionInfo.iron"> </td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button type="button"
			        class="btn btn-primary"
			        v-if="editingModifierNutritionInfo && !creatingModifierNutritionInfo && !selectLocationMode"
			        @click="updateModifierNutritionInfo()">Update</button>
			<button type="button"
			        class="btn btn-primary"
			        v-if="!editingModifierNutritionInfo && creatingModifierNutritionInfo && !selectLocationMode"
			        @click="createModifierNutritionInfo()">Create</button>
			<button type="button"
			        class="btn btn-primary"
			        v-if="!editingModifierNutritionInfo && !creatingModifierNutritionInfo && !selectLocationMode">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import ModifiersFunctions from '../../../../controllers/Modifiers'
import SelectLocationsPopup from '../../../modules/SelectLocationsPopup'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showNutritionModal: false,
			itemNutritionInfo: {},
			editingModifierNutritionInfo: false,
			creatingModifierNutritionInfo: false,
			createModifierNutritionError: '',
			errorMessage: '',
			editNutritionError: '',
			newModifierNutritionInfo: {
				modifier_item_id: this.modifierItem.id,
				user_id: this.$root.createdBy
			},
			selectLocationMode: false,
			selectedLocations: [],
			update_all_items: false
		}
	},
	props: {
		modifierItem: {
			type: Object,
			default: {}
		}
	},
	mounted () {
		this.showNutritionModal = true
		this.getModifierItemNutritionInfo()
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
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To get the nutrition info for the modifier item.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifierItemNutritionInfo () {
			var nutritionInfoVue = this
			nutritionInfoVue.itemNutritionInfo = {}
			nutritionInfoVue.errorMessage = ''
			ModifiersFunctions.getModifierItemNutritionInfo(
				nutritionInfoVue.modifierItem.id,
				nutritionInfoVue.$root.appId,
				nutritionInfoVue.$root.appSecret
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						nutritionInfoVue.itemNutritionInfo = response.payload[0]
					} else {
						nutritionInfoVue.errorMessage = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch nutrition info',
						errorName: 'errorMessage',
						vue: nutritionInfoVue,
						containerRef: 'modal'
					})
				})
		},
		/**
		 * To check if the nutrition data is valid before submitting to the backend.
		 * @function
		 * @param {object} inputObject - The object to be validated
		 * @returns {object} A promise that will validate the input form
		 */
		validateNutritionData (inputObject) {
			return new Promise(function (resolve, reject) {
				if (!$.isNumeric(inputObject.calories)) {
					reject('Calories should be a number')
					// } else if (!$.isNumeric(inputObject.min_cal)) {
					// 	reject('Minimum Calories should be a number')
				} else if (!$.isNumeric(inputObject.total_fat)) {
					reject('Total Fat should be a number')
				} else if (!$.isNumeric(inputObject.saturated_fat)) {
					reject('Saturated Fat should be a number')
				} else if (!$.isNumeric(inputObject.trans_fat)) {
					reject('Trans Fat should be a number')
				} else if (!$.isNumeric(inputObject.cholesterol)) {
					reject('Cholesterol should be a number')
				} else if (!$.isNumeric(inputObject.sodium)) {
					reject('Sodium should be a number')
				} else if (!$.isNumeric(inputObject.carbs)) {
					reject('Carbohydrates should be a number')
				} else if (!$.isNumeric(inputObject.fibre)) {
					reject('Fibre should be a number')
				} else if (!$.isNumeric(inputObject.sugar)) {
					reject('Sugar should be a number')
				} else if (!$.isNumeric(inputObject.protein)) {
					reject('Protein should be a number')
				} else if (!$.isNumeric(inputObject.vit_a)) {
					reject('Vitamin A should be a number')
				} else if (!$.isNumeric(inputObject.vit_c)) {
					reject('Vitamin C should be a number')
				} else if (!$.isNumeric(inputObject.calcium)) {
					reject('Calcium should be a number')
				} else if (!$.isNumeric(inputObject.iron)) {
					reject('Iron should be a number')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To send the updated modifier nutrition info to the backend and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateModifierNutritionInfo () {
			var nutritionInfoVue = this
			var updatedNutritionInfo = {}
			for (var i = 0; i < nutritionInfoVue.itemNutritionInfo.length; i++) {
				if (nutritionInfoVue.itemNutritionInfo[i].key !== 'modifier_item_id') {
					if (nutritionInfoVue.itemNutritionInfo[i].key === 'id') {
						updatedNutritionInfo.id =
							nutritionInfoVue.itemNutritionInfo[i].value
					}
					var tempKey = nutritionInfoVue.itemNutritionInfo[i].key
					updatedNutritionInfo[tempKey] =
						nutritionInfoVue.itemNutritionInfo[i].value
				}
			}
			updatedNutritionInfo.modifier_item_id = nutritionInfoVue.modifierItem.id
			updatedNutritionInfo.user_id = nutritionInfoVue.$root.createdBy
			updatedNutritionInfo.update_locations = nutritionInfoVue.selectedLocations
			updatedNutritionInfo.update_all_items = nutritionInfoVue.update_all_items
			nutritionInfoVue.editNutritionError = ''

			return nutritionInfoVue
				.validateNutritionData(updatedNutritionInfo)
				.then(response => {
					this.editingModifierNutritionInfo = false
					ModifiersFunctions.updateModifierNutritionInfo(
						updatedNutritionInfo,
						nutritionInfoVue.$root.appId,
						nutritionInfoVue.$root.appSecret,
						nutritionInfoVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								this.closeModal()
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the nutrition info',
								errorName: 'errorMessage',
								vue: 'editNutritionError',
								containerRef: 'modal'
							})
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					nutritionInfoVue.editNutritionError = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To create new nutrition info for the modifier item (if it doesn't exist) and send it to the backend and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createModifierNutritionInfo () {
			var nutritionInfoVue = this

			return nutritionInfoVue
				.validateNutritionData(nutritionInfoVue.newModifierNutritionInfo)
				.then(response => {
					ModifiersFunctions.createModifierNutritionInfo(
						nutritionInfoVue.newModifierNutritionInfo,
						nutritionInfoVue.$root.appId,
						nutritionInfoVue.$root.appSecret,
						nutritionInfoVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								this.closeModal()
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add the nutrition info',
								errorName: 'createModifierNutritionError',
								vue: nutritionInfoVue,
								containerRef: 'modal'
							})
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					nutritionInfoVue.createModifierNutritionError = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new category.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('deactivateNutritionInfoModal')
		}
	},
	components: {
		Modal,
		SelectLocationsPopup
	}
}
</script>

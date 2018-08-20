<template>
	<modal v-bind:show="showNutritionModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="nutritionModal">
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
				    key="mainEditMode">Item Nutrition Info</h4>
				<h4 class="modal-title center"
				    v-if="selectLocationMode"
				    key="selectLocationMode">
					<i class="fa fa-chevron-left clickable pull-left back-button"
					   @click="closeSelectLocationsPopup()"></i>Select Stores</h4>
			</transition>
		</div>
		<div slot="modal-body"
		     class="modal-body"
		     v-if="!creatingNutritionInfo">
			<div class="margin-top-20"
			     v-show="errorMessage"
			     ref="errorMessage">
				<div class="alert alert-danger">
					<button class="close"
					        @click="clearError('errorMessage')"></button>
					<span>{{ errorMessage }}</span>
				</div>
			</div>
			<div class="margin-top-15">
				<button type="button"
				        class="btn blue"
				        @click="enableCreate()">Add Nutrition Info</button>
			</div>
			<div class="portlet light bg-inverse clear"
			     v-if="!errorMessage.length && !selectLocationMode">
				<div class="portlet-title">
					<div class="caption">Click on the button on the right to edit</div>
					<div class="actions">
						<a class="btn btn-circle btn-icon-only btn-default"
						   @click="enableEdit()">
							<i class="fa fa-lg fa-pencil"></i>
						</a>
					</div>
				</div>
				<div class="portlet-body">
					<div v-show="editNutritionError"
					     ref="editNutritionError">
						<div class="alert alert-danger">
							<button class="close"
							        @click="clearError('editNutritionError')"></button>
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
								<tr v-for="info in itemNutritionInfo"
								    :key="info.id">
									<td v-if="info.key !== 'id' && info.key !== 'item_id'"> {{ info.name }} </td>
									<td v-if="info.key !== 'id' && info.key !== 'item_id'">
										<input :disabled="!editingNutritionInfo && !can('menu_manager menus categories subcategories items nutrition update')"
										       type="text"
										       class="form-control input-sm"
										       v-model="info.value">
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
							<el-switch :disabled="!can('menu_manager menus categories subcategories items nutrition update')"
							           v-model="update_all_items"
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
			                        :previouslySelected="selectedLocations">
			</select-locations-popup>
		</div>
		<div slot="modal-body"
		     class="modal-body"
		     v-if="creatingNutritionInfo">
			<div class="portlet light bg-inverse clear">
				<div class="portlet-title">
					<div class="caption">Add nutrition info for '{{ item.name }}'</div>
				</div>
				<div class="portlet-body">
					<div class="margin-top-20"
					     v-show="createNutritionError"
					     ref="createNutritionError">
						<div class="alert alert-danger">
							<button class="close"
							        @click="clearError('createNutritionError')"></button>
							<span>{{ createNutritionError }}</span>
						</div>
					</div>
					<div class='table-scrollable table-fixed-height'>
						<fieldset :disabled="!can('menu_manager menus categories subcategories items nutrition create')">
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
											       v-model="newNutritionInfo.calories"> </td>
									</tr>
									<tr>
										<td> Minimum Calories </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.min_cal"> </td>
									</tr>
									<tr>
										<td> Total Fat </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.total_fat"> </td>
									</tr>
									<tr>
										<td> Saturated Fat </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.saturated_fat"> </td>
									</tr>
									<tr>
										<td> Trans Fat </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.trans_fat"> </td>
									</tr>
									<tr>
										<td> Cholesterol </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.cholesterol"> </td>
									</tr>
									<tr>
										<td> Sodium </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.sodium"> </td>
									</tr>
									<tr>
										<td> Carbohydrates </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.carbs"> </td>
									</tr>
									<tr>
										<td> Fibre </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.fibre"> </td>
									</tr>
									<tr>
										<td> Sugar </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.sugar"> </td>
									</tr>
									<tr>
										<td> Protein </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.protein"> </td>
									</tr>
									<tr>
										<td> Vitamin A </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.vit_a"> </td>
									</tr>
									<tr>
										<td> Vitamin C </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.vit_c"> </td>
									</tr>
									<tr>
										<td> Calcium </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.calcium"> </td>
									</tr>
									<tr>
										<td> Iron </td>
										<td> <input type="text"
											       class="form-control input-sm"
											       v-model="newNutritionInfo.iron"> </td>
									</tr>
								</tbody>
							</table>
						</fieldset>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button type="button"
			        class="btn btn-primary"
			        v-if="editingNutritionInfo && !creatingNutritionInfo && !selectLocationMode"
			        @click="updateItemNutritionInfo()"
			        :disabled="updating">
				Save
				<i v-show="updating"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
			<button type="button"
			        class="btn btn-primary"
			        v-if="!editingNutritionInfo && creatingNutritionInfo && !selectLocationMode"
			        @click="createItemNutritionInfo()"
			        :disabled="creating">
				Create
				<i v-show="creating"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
			<button type="button"
			        class="btn btn-primary"
			        v-if="!editingNutritionInfo && !creatingNutritionInfo && !selectLocationMode"
			        @click="closeModal()">
				Close
			</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import ItemsFunctions from '../../../../controllers/Items'
import SelectLocationsPopup from '../../../modules/SelectLocationsPopup'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { mapGetters } from 'vuex'

export default {
	data () {
		return {
			showNutritionModal: false,
			itemNutritionInfo: {},
			editingNutritionInfo: false,
			updating: false,
			creatingNutritionInfo: false,
			creating: false,
			createNutritionError: '',
			editNutritionError: '',
			errorMessage: '',
			newNutritionInfo: {
				item_id: this.item.id,
				user_id: this.$root.createdBy
			},
			selectLocationMode: false,
			selectedLocations: [],
			update_all_items: false
		}
	},
	computed: {
		...mapGetters(['can', 'canAny'])
	},
	props: {
		item: {
			type: Object,
			default: {}
		}
	},
	mounted () {
		this.showNutritionModal = true
		this.getItemNutritionInfo()
	},
	methods: {
		/**
		 * To toggle edit mode on.
		 * @function
		 * @returns {undefined}
		 */
		enableCreate () {
			if (this.can('menu_manager menus categories subcategories items nutrition create')) {
				this.creatingNutritionInfo = true
			}
		},
		/**
		 * To toggle edit mode on.
		 * @function
		 * @returns {undefined}
		 */
		enableEdit () {
			if (this.can('menu_manager menus categories subcategories items nutrition update')) {
				this.editingNutritionInfo = true
			}
		},
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
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To get the nutrition info for the item.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemNutritionInfo () {
			var nutritionInfoVue = this
			nutritionInfoVue.itemNutritionInfo = {}
			nutritionInfoVue.errorMessage = ''
			ItemsFunctions.getItemNutritionInfo(
				nutritionInfoVue.item.id,
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
						containerRef: 'nutritionModal'
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
		 * To send the updated nutrition info to the backend and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateItemNutritionInfo () {
			var nutritionInfoVue = this
			var updatedNutritionInfo = {}
			for (var i = 0; i < nutritionInfoVue.itemNutritionInfo.length; i++) {
				if (nutritionInfoVue.itemNutritionInfo[i].key !== 'modifier_item_id') {
					var tempKey = nutritionInfoVue.itemNutritionInfo[i].key
					updatedNutritionInfo[tempKey] =
						nutritionInfoVue.itemNutritionInfo[i].value
				}
			}
			updatedNutritionInfo.item_id = nutritionInfoVue.item.id
			updatedNutritionInfo.user_id = nutritionInfoVue.$root.createdBy
			updatedNutritionInfo.update_locations = nutritionInfoVue.selectedLocations
			updatedNutritionInfo.update_all_items = nutritionInfoVue.update_all_items
			nutritionInfoVue.editNutritionError = ''

			return nutritionInfoVue
				.validateNutritionData(updatedNutritionInfo)
				.then(response => {
					nutritionInfoVue.updating = true
					nutritionInfoVue.editingNutritionInfo = false
					ItemsFunctions.updateItemNutritionInfo(
						updatedNutritionInfo,
						nutritionInfoVue.$root.appId,
						nutritionInfoVue.$root.appSecret,
						nutritionInfoVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								this.closeModalAndUpdate()
							} else {
								nutritionInfoVue.editNutritionError = 'Something'
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update nutrition info',
								errorName: 'editNutritionError',
								vue: nutritionInfoVue,
								containerRef: 'nutritionModal'
							})
						})
						.finally(() => {
							nutritionInfoVue.updating = false
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
		 * To create new nutrition info for the item (if it doesn't exist) and send it to the backend and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createItemNutritionInfo () {
			var nutritionInfoVue = this

			return nutritionInfoVue
				.validateNutritionData(nutritionInfoVue.newNutritionInfo)
				.then(response => {
					nutritionInfoVue.creating = true
					nutritionInfoVue.createNutritionError = false
					ItemsFunctions.createItemNutritionInfo(
						nutritionInfoVue.newNutritionInfo,
						nutritionInfoVue.$root.appId,
						nutritionInfoVue.$root.appSecret,
						nutritionInfoVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								this.closeModalAndUpdate()
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add nutrition info',
								errorName: 'createNutritionError',
								vue: nutritionInfoVue,
								containerRef: 'nutritionModal'
							})
						})
						.finally(() => {
							nutritionInfoVue.creating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					nutritionInfoVue.createNutritionError = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To notify that changes were saved
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('nutritionInfoSaved', this.item.id)
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
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

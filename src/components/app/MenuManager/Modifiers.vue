<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Modifiers</h1>
		<!-- END PAGE TITLE-->
		<div class="note note-info">
			<p>Create and manage menu modifiers.</p>
		</div>
		<!-- BEGIN CREATE NEW MODIFIER CATEGORY-->
		<div class="portlet box blue-hoki"
		     v-if="$root.activeLocation && $root.activeLocation.id && $root.permissions['menu_manager modifiers create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreateModifierPanel()">
				<div class="custom tools">
					<a :class="{'expand': !createModifierCollapse, 'collapse': createModifierCollapse}"></a>
				</div>
				<div class="caption">
					&emsp;Create A New Modifier Category
				</div>
			</div>
			<div class="portlet-body"
			     :class="{'display-hide': createModifierCollapse}">
				<form role="form"
				      @submit.prevent="addNewModifierCategory()">
					<div class="form-body row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="errorMessage"
							     ref="errorMessage">
								<button class="close"
								        @click.prevent="clearError()"></button>
								<span>{{errorMessage}}</span>
							</div>
						</div>
						<div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
							<resource-picker @open="toggleImageMode('newMenu', true)"
							                 @close="toggleImageMode('newMenu', false)"
							                 @selected="updateImage"
							                 :imageButton="true"
							                 :imageUrl="newCategory.image_url"
							                 class="margin-top-15">
							</resource-picker>
						</div>
						<div class="col-md-5"
						     v-show="!imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newCategory.name.length}"
								       id="form_control_1"
								       v-model="newCategory.name">
								<label for="form_control_1">Modifier Category Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newCategory.desc.length}"
								       id="form_control_2"
								       v-model="newCategory.desc">
								<label for="form_control_2">Modifier Category Description</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="number"
								       class="form-control input-sm"
								       :class="{'edited': newCategory.min}"
								       id="form_control_3"
								       v-model="newCategory.min">
								<label for="form_control_3">Modifier Category Min</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="number"
								       class="form-control input-sm"
								       :class="{'edited': newCategory.max}"
								       id="form_control_4"
								       v-model="newCategory.max">
								<label for="form_control_4">Modifier Category Max</label>
							</div>
						</div>
						<div class="col-md-5"
						     v-show="!imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newCategory.sku.length}"
								       id="form_control_5"
								       v-model="newCategory.sku">
								<label for="form_control_5">Modifier Category SKU</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="number"
								       class="form-control input-sm"
								       :class="{'edited': newCategory.included}"
								       id="form_control_6"
								       v-model="newCategory.included">
								<label for="form_control_6">Modifier Category Number Free</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="number"
								       class="form-control input-sm"
								       :class="{'edited': newCategory.order}"
								       id="form_control_7"
								       v-model="newCategory.order">
								<label for="form_control_7">Modifier Category Order</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<label>Modifier Category Status:</label><br>
								<el-switch v-model="newCategory.status"
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
					<div class="form-actions right margin-top-20"
					     v-show="!imageMode.newMenu">
						<button type="submit"
						        class="btn blue">Create</button>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE NEW MODIFIER CATEGORY-->
		<loading-screen :show="displayModifierData"
		                :color="'#2C3E50'"
		                :display="'inline'"></loading-screen>
		<div class="alert alert-info center margin-top-20"
		     v-if="!$root.activeLocation.id">
			<h4>No Store Selected</h4>
			<p>Please select a store from the location panel on the right to view its modifers</p>
		</div>
		<div v-if="$root.activeLocation && $root.activeLocation.id && !displayModifierData">
			<div class="portlet light portlet-fit bordered margin-top-20"
			     id="categories-container">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image-main">
						<img src="../../../../static/client_logo.png">
					</div>
					<div class="caption">
						<span class="caption-subject font-default bold uppercase">Modifiers</span>
						<div class="caption-desc font-grey-cascade">Click on a modifer category to view its items.</div>
					</div>
				</div>
				<div class="portlet-body">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="listErrorMessage.length"
							     ref="listErrorMessage">
								<button class="close"
								        @click.prevent="clearError('listErrorMessage')"></button>
								<span>{{listErrorMessage}}</span>
							</div>
						</div>
					</div>
					<div class="row"
					     v-show="$root.activeLocation.is_corporate">
						<div class="col-xs-12">
							<el-select v-if="modifierTiers !== null"
							           size="small"
							           v-model="indexOfTierToDisplay"
							           placeholder="Select Tier"
							           @change="updateList()"
							           :clearable="true">
								<el-option v-for="(tier, index) in modifierTiers"
								           :label="tier.name"
								           :value="index"
								           :key="tier.id">
								</el-option>
							</el-select>
						</div>
					</div>
					<div class="mt-element-list margin-top-15"
					     v-if="storeModifiers.length">
						<div class="mt-list-container list-news ext-1 no-border">
							<ul>
								<li class="mt-list-item margin-top-15 clickable"
								    @click="viewModifierCategoryItems(modifier)"
								    v-for="modifier in storeModifiers"
								    :id="'modifierCategory-' + modifier.id"
								    :key="modifier.id">
									<div class="actions-on-top margin-bottom-15">
										<el-tooltip v-if="$root.permissions['menu_manager modifiers update']"
										            content="Edit"
										            effect="light"
										            placement="top">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="editModifierCategory(modifier, $event)">
												<i class="fa fa-lg fa-pencil"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['menu_manager modifiers read'] && !$root.permissions['menu_manager modifiers update']"
										            content="View"
										            effect="light"
										            placement="top">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="editModifierCategory(modifier, $event)">
												<i class="fa fa-lg fa-eye"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['menu_manager modifiers update items']"
										            content="Apply to items"
										            effect="light"
										            placement="top">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="displayMenuTreeModal(modifier, $event)">
												<i class="icon-layers"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['stores copy modifier modifier_to_multiple_location']"
										            content="Copy to stores"
										            effect="light"
										            placement="top">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="displayCopyToLocationsModal(modifier, $event)">
												<i class="fa fa-lg fa-copy"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['stores add item_to_multiple_locations']"
										            content="Apply to items at stores"
										            effect="light"
										            placement="top">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="displayApplyToItemsAtLocationsModal(modifier, $event)">
												<i class="fa fa-lg fa-plus"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['menu_manager modifiers delete']"
										            content="Delete"
										            effect="light"
										            placement="top">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="deleteModifierCategory(modifier, $event)">
												<i class="fa fa-lg fa-trash"></i>
											</a>
										</el-tooltip>
									</div>
									<div class="list-icon-container">
										<a>
											<i class="fa fa-angle-right"></i>
										</a>
									</div>
									<div class="list-thumb">
										<a v-if="modifier.image_url.length">
											<img alt=""
											     :src="modifier.image_url" />
										</a>
										<a v-else>
											<img src="../../../assets/img/app/login/bg1.jpg">
										</a>
									</div>
									<div class="list-datetime bold uppercase font-red">
										<span>{{ modifier.name }}</span>
									</div>
									<div class="list-item-content height-mod">
										<div class="col-md-2">
											<strong>Min:</strong>
											<span>{{ modifier.min }}</span>
										</div>
										<div class="col-md-2">
											<strong>Max:</strong>
											<span>{{ modifier.max }}</span>
										</div>
										<div class="col-md-4">
											<strong>Status:</strong>
											<span v-if="modifier.status == 1">Available</span>
											<span v-if="modifier.status == 0">Sold Out</span>
										</div>
										<div class="col-md-4">
											<strong>SKU:</strong>
											<span>{{ modifier.sku }}</span>
										</div>
										<div class="col-md-12">
											<strong>Description:</strong>
											<span>{{ modifier.desc }}</span>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div class="margin-top-20"
					     v-if="!storeModifiers.length && !displayModifierData">
						<no-results :show="!storeModifiers.length"
						            :type="'modifier categories'"
						            :custom="true"
						            :text="customText"></no-results>
					</div>
				</div>
			</div>
		</div>
		<div class="margin-top-20"
		     v-if="$root.activeLocation.id && !displayModifierData">
			<no-results :type="'modifier categories'"></no-results>
		</div>
		<edit-modifier-category v-if="editCategoryModalActive"
		                        @updateModifierCategory="updateModifierCategory"
		                        @deactivateEditCategoryModal="closeEditCategoryModal"></edit-modifier-category>
		<delete-modifier-category v-if="deleteCategoryModalActive"
		                          :passedModifierCategoryId="passedModifierCategoryId"
		                          @closeDeleteModifierCategoryModal="closeDeleteModifierCategoryModal"
		                          @deleteModifierCategoryAndCloseModal="deleteModifierCategoryAndCloseModal"></delete-modifier-category>
		<menu-tree v-if="showMenuTreeModal"
		           :selectedObject="selectedModifier"
		           :headerText="headerText"
		           :updateType="'modifier'"
		           @closeMenuTreeModal="closeMenuTreeModal"></menu-tree>
		<apply-modifier-to-items-at-locations v-if="showModifierToApplyToItemsAtLocationsModal"
		                                      :modifier="modifierToApplyToItemsAtLocations"
		                                      @closeApplyModifierToItemsAtLocations="closeApplyModifierToItemsAtLocationsModal"
		                                      @applyModifierToItemsAtLocationsSuccess="showApplyModifierToItemsAtLocationsSuccess">
		</apply-modifier-to-items-at-locations>
		<copy-modifier-to-locations v-if="showCopyModifierToLocationsModal"
		                            :modifier="modifierToCopyToLocations"
		                            @closeCopyModifierToLocations="closeCopyModifierToLocationsModal"
		                            @copyModifierToLocationsSuccess="showCopyModifierToLocationsSuccess">
		</copy-modifier-to-locations>
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import Modal from '../../modules/Modal'
import LoadingScreen from '../../modules/LoadingScreen'
import EditModifierCategory from './Modifiers/EditModifierCategory'
import DeleteModifierCategory from './Modifiers/DeleteModifierCategory'
import ModifiersFunctions from '../../../controllers/Modifiers'
import MenuTree from '../../modules/MenuTree'
import ResourcePicker from '../../modules/ResourcePicker'
import ApplyModifierToItemsAtLocations from '@/components/app/MenuManager/Modifiers/ApplyModifierToItemsAtLocations'
import CopyModifierToLocations from '@/components/app/MenuManager/Modifiers/CopyModifierToLocations'
import ajaxErrorHandler from '@/controllers/ErrorController'
import ModifierTiersFunctions from '@/controllers/ModifierTiers'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Menu Manager', link: false },
				{ name: 'Modifiers', link: false }
			],
			displayModifierData: false,
			editCategoryModalActive: false,
			deleteCategoryModalActive: false,
			storeModifiers: [],
			newCategory: {
				name: '',
				desc: '',
				sku: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				min: null,
				max: null,
				included: null,
				order: null
			},
			errorMessage: '',
			createModifierCollapse: true,
			showMenuTreeModal: false,
			selectedModifier: {},
			passedModifierCategoryId: 0,
			headerText: '',
			imageMode: {
				newMenu: false
			},
			modifierToApplyToItemsAtLocations: {},
			showModifierToApplyToItemsAtLocationsModal: false,
			modifierTiers: null,
			listErrorMessage: '',
			indexOfTierToDisplay: null,
			showCopyModifierToLocationsModal: false,
			modifierToCopyToLocations: {}
		}
	},
	computed: {
		customText () {
			if (this.indexOfTierToDisplay === '') {
				return 'This location does not have any Modifier Categories.'
			} else {
				return 'This tier does not have any Modifier Categories.'
			}
		}
	},
	mounted () {
		if (this.$root.activeLocation && this.$root.activeLocation.id) {
			this.getStoreModifiers()
		}
		this.getModifierTiers()
	},
	methods: {
		/**
		 * To update the modifiers shown in the list based on user's filter selection
		 * @function
		 * @returns {undefined}
		 */
		updateList () {
			if (this.indexOfTierToDisplay !== '') {
				this.getModifierTierDetails()
			} else {
				this.getStoreModifiers()
			}
		},
		/**
		 * To fetch a list of modifiers for a tier
		 * @function
		 * @returns {object} - A network call promise
		 */
		getModifierTierDetails () {
			let modifiersVue = this
			const tier = modifiersVue.modifierTiers[modifiersVue.indexOfTierToDisplay]
			return ModifierTiersFunctions.getModifierTierDetails(tier)
				.then(response => {
					modifiersVue.storeModifiers = response.payload
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorName: 'listErrorMessage',
						errorText: "We couldn't fetch modifiers for this tier",
						vue: modifiersVue
					})
				})
		},
		/**
		 * To fetch a list of Modifier Tiers
		 * @function
		 * @returns {object} Network call promise
		 */
		getModifierTiers () {
			let modifiersVue = this
			return ModifierTiersFunctions.getModifierTiers()
				.then(response => {
					modifiersVue.modifierTiers = response.payload
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorName: 'listErrorMessage',
						errorText: "We couldn't fetch modifier tiers",
						vue: modifiersVue
					})
				})
		},
		/**
		 * To display the modal to apply a modifier to selected items at selected locations.
		 * @function
		 * @param {object} modifier - The selected modifier category.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayApplyToItemsAtLocationsModal (modifier, event) {
			event.stopPropagation()
			this.modifierToApplyToItemsAtLocations = modifier
			this.showModifierToApplyToItemsAtLocationsModal = true
		},
		/**
		 * To display the modal to copy a modifier to selected locations.
		 * @function
		 * @param {object} modifier - The selected modifier category.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayCopyToLocationsModal (modifier, event) {
			event.stopPropagation()
			this.modifierToCopyToLocations = modifier
			this.showCopyModifierToLocationsModal = true
		},
		/**
		 * To close the modal to copy a modifier to selected locations.
		 * @function
		 * @returns {undefined}
		 */
		closeCopyModifierToLocationsModal () {
			this.showCopyModifierToLocationsModal = false
		},
		/**
		 * To close the modal to apply a modifier to selected items at selected locations.
		 * @function
		 * @returns {undefined}
		 */
		closeApplyModifierToItemsAtLocationsModal () {
			this.showModifierToApplyToItemsAtLocationsModal = false
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showApplyModifierToItemsAtLocationsSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Modifiers have been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Modifiers have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showCopyModifierToLocationsSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Modifier has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Modifier has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @param {string} object - The name of the object the image is for
		 * @param {object} value - The open / closed value of the picker
		 * @returns {undefined}
		 */
		toggleImageMode (object, value) {
			this.imageMode[object] = value
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.newCategory.image_url = val.image_url
		},
		/**
		 * To display the modal to apply a modifier to multiple items.
		 * @function
		 * @param {object} modifier - The selected modifier category
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayMenuTreeModal (modifier, event) {
			event.stopPropagation()
			this.selectedModifier = modifier
			this.headerText = "Modifier '" + this.selectedModifier.name + "'"
			this.showMenuTreeModal = true
		},
		/**
		 * To close the menu tree modal.
		 * @function
		 * @returns {undefined}
		 */
		closeMenuTreeModal () {
			this.showMenuTreeModal = false
		},
		/**
		 * To get a list of modifier categories for the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreModifiers () {
			this.displayModifierData = true
			var menusVue = this
			menusVue.storeModifiers = []
			return ModifiersFunctions.getStoreModifiers(
				menusVue.$root.activeLocation.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						menusVue.displayModifierData = false
						menusVue.storeModifiers = response.payload
					} else {
						menusVue.displayModifierData = false
					}
				})
				.catch(reason => {
					menusVue.displayModifierData = false
					ajaxErrorHandler({
						reason,
						errorName: 'listErrorMessage',
						errorText: 'We could not fetch modifiers',
						vue: menusVue
					})
				})
		},
		/**
		 * To display the modal to edit a modifier category.
		 * @function
		 * @param {object} modifier - The selected modifier category
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editModifierCategory (modifier, event) {
			event.stopPropagation()
			this.editCategoryModalActive = true
			this.$router.push(
				'/app/menu_manager/modifiers/edit_category/' + modifier.id
			)
		},
		/**
		 * To display the modal to delete a modifier category.
		 * @function
		 * @param {object} modifier - The selected modifier category
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		deleteModifierCategory (modifier, event) {
			event.stopPropagation()
			this.deleteCategoryModalActive = true
			this.passedModifierCategoryId = modifier.id
		},
		/**
		 * To update the modifier category list and close the edit modal
		 * @function
		 * @returns {undefined}
		 */
		updateModifierCategory () {
			this.getStoreModifiers()
			this.editCategoryModalActive = false
		},
		/**
		 * To check if the input is a positive number
		 * @function
		 * @param {string} input - User's input
		 * @returns {boolean} True is positive integer or float, false is not
		 */
		isNonNegativeNumber (input) {
			try {
				const inputString = String(input)
				if (inputString.length > inputString.replace(/[^\d.]/g, '').length) {
					return false
				}
				const value = Number(input)
				if (value < 0) {
					return false
				}
				return true
			} catch (e) {
				if (this.environment !== 'production') {
					console.log({e})
				}
				return false
			}
		},
		/**
		 * To check if the modifier category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateModifierCategoryData () {
			var addModifierCategoryVue = this
			return new Promise(function (resolve, reject) {
				if (!addModifierCategoryVue.newCategory.image_url.length) {
					reject('Modifier Category image cannot be blank')
				} else if (!addModifierCategoryVue.newCategory.name.length) {
					reject('Modifier Category Name cannot be blank')
				} else if (!addModifierCategoryVue.newCategory.desc.length) {
					reject('Modifier Category Description cannot be blank')
				} else if (!addModifierCategoryVue.isNonNegativeNumber(addModifierCategoryVue.newCategory.min)) {
					reject('Modifier Category Min must be zero or more')
				} else if (!addModifierCategoryVue.isNonNegativeNumber(addModifierCategoryVue.newCategory.max)) {
					reject('Modifier Category Max must be zero or more')
				} else if (Number(addModifierCategoryVue.newCategory.min) > Number(addModifierCategoryVue.newCategory.max)) {
					reject('Modifier Category Min cannot be larger than Max')
				} else if (!addModifierCategoryVue.newCategory.sku.length) {
					reject('Modifier Category SKU cannot be blank')
				} else if (!addModifierCategoryVue.isNonNegativeNumber(addModifierCategoryVue.newCategory.included)) {
					reject('Modifier Category Number Free cannot be negative')
				} else if (!addModifierCategoryVue.isNonNegativeNumber(addModifierCategoryVue.newCategory.order)) {
					reject('Modifier Category Order cannot be negative')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To clear the new menu form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewCategory () {
			this.newCategory = {
				name: '',
				desc: '',
				sku: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				min: null,
				max: null,
				included: null,
				order: null
			}
		},
		/**
		 * To add the new modifier category and close the modal and redirect to the modifiers page.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		addNewModifierCategory () {
			var addModifierCategoryVue = this
			addModifierCategoryVue.clearError()

			return addModifierCategoryVue
				.validateModifierCategoryData()
				.then(response => {
					addModifierCategoryVue.newCategory.location_id =
						addModifierCategoryVue.$root.activeLocation.id
					ModifiersFunctions.addNewModifierCategory(
						addModifierCategoryVue.newCategory,
						addModifierCategoryVue.$root.appId,
						addModifierCategoryVue.$root.appSecret,
						addModifierCategoryVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								addModifierCategoryVue.newCategory.id = response.payload.id
								addModifierCategoryVue.getStoreModifiers()
								addModifierCategoryVue.showAlert(response.payload)
								addModifierCategoryVue.clearNewCategory()
							} else {
								addModifierCategoryVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorName: 'errorMessage',
								errorText: 'We could not create the modifier category',
								vue: addModifierCategoryVue
							})
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					addModifierCategoryVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAlert (payload = {}) {
			let title = 'Success'
			let text = 'The Modifier Category has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Modifier Category has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To close the modal to edit a modifier category.
		 * @function
		 * @returns {undefined}
		 */
		closeEditCategoryModal () {
			this.editCategoryModalActive = false
		},
		/**
		 * To close the modal to delete a modifier category.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModifierCategoryModal () {
			this.deleteCategoryModalActive = false
		},
		/**
		 * To close the modal to delete a modifier category.
		 * @function
		 * @returns {undefined}
		 */
		deleteModifierCategoryAndCloseModal () {
			this.deleteCategoryModalActive = false
			for (var i = 0; i < this.storeModifiers.length; i++) {
				if (this.storeModifiers[i].id === this.passedModifierCategoryId) {
					this.storeModifiers.splice(i, 1)
				}
			}
		},
		/**
		 * To route to the modifier items page.
		 * @function
		 * @param {object} modifier - The selected modifier category
		 * @returns {undefined}
		 */
		viewModifierCategoryItems (modifier) {
			this.$router.push('/app/menu_manager/modifier_items/' + modifier.id)
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {string} name - Name of the error variable
		 * @returns {undefined}
		 */
		clearError (name = 'errorMessage') {
			this[name] = ''
		},
		/**
		 * To toggle the create menu panel, initially set to opened
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateModifierPanel () {
			this.createModifierCollapse = !this.createModifierCollapse
		}
	},
	watch: {
		'$root.activeLocation' () {
			this.getStoreModifiers()
			this.indexOfTierToDisplay = null
			this.getModifierTiers()
		}
	},
	components: {
		Breadcrumb,
		Modal,
		LoadingScreen,
		EditModifierCategory,
		DeleteModifierCategory,
		NoResults,
		MenuTree,
		ResourcePicker,
		ApplyModifierToItemsAtLocations,
		CopyModifierToLocations
	}
}
</script>

<style scoped>
.actions-on-top {
  margin-top: -5px;
}
</style>


<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Modifier Items</h1>
		<!-- END PAGE TITLE-->
		<div class="note note-info">
			<p>View items for modifier category '{{ modifierCategoryDetails.name }}'.</p>
		</div>
		<!-- BEGIN CREATE NEW MODIFIER ITEM -->
		<div 
			class="portlet box blue-hoki" 
			v-if="$root.activeLocation && $root.activeLocation.id && $root.permissions['menu_manager modifiers items create']">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreateModifierItemPanel()">
				<div class="custom tools">
					<a :class="{'expand': !createModifierItemCollapse, 'collapse': createModifierItemCollapse}"></a>
				</div>
				<div class="caption">
					&emsp;Create A New Modifier Item
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': createModifierItemCollapse}">
				<form role="form" @submit.prevent="addNewModifierItem()">
					<div class="form-body row">
						<div class="col-md-12">
							<div class="alert alert-danger" v-if="errorMessage.length">
								<button class="close" data-close="alert" @click="clearError('errorMessage')"></button>
								<span>{{errorMessage}}</span>
							</div>
						</div>
						<div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
							<resource-picker 
								@open="toggleImageMode('newMenu', true)"
								@close="toggleImageMode('newMenu', false)"
								@selected="updateImage" 
								:imageButton="true"
								:imageUrl="newModifierItem.image_url"
								class="margin-top-15"
							>
							</resource-picker>
						</div>
						<div class="col-md-5" v-show="!imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newModifierItem.name.length}" id="form_control_1" v-model="newModifierItem.name">
								<label for="form_control_1">Modifier Item Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newModifierItem.desc.length}" id="form_control_2" v-model="newModifierItem.desc">
								<label for="form_control_2">Modifier Item Description</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newModifierItem.price.length}" id="form_control_3" v-model="newModifierItem.price">
								<label for="form_control_3">Modifier Item Price</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newModifierItem.sku.length}" id="form_control_4" v-model="newModifierItem.sku">
								<label for="form_control_4">Modifier Item SKU</label>
							</div>
						</div>
						<div class="col-md-5" v-show="!imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="number" class="form-control input-sm" :class="{'edited': newModifierItem.min}" id="form_control_5" v-model="newModifierItem.min">
								<label for="form_control_5">Modifier Item Min</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="number" class="form-control input-sm" :class="{'edited': newModifierItem.max}" id="form_control_6" v-model="newModifierItem.max">
								<label for="form_control_6">Modifier Item Max</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="number" class="form-control input-sm" :class="{'edited': newModifierItem.order}" id="form_control_7" v-model="newModifierItem.order">
								<label for="form_control_7">Modifier Item Order</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<label>Modifier Item Status:</label><br>
								<el-switch
									v-model="newModifierItem.status"
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
					<div class="form-actions right margin-top-20" v-show="!imageMode.newMenu">
						<button type="submit" class="btn blue">Create</button>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE NEW MODIFIER ITEM -->
		<loading-screen :show="displayModifierItemData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
		<div v-if="$root.activeLocation && $root.activeLocation.id && !displayModifierItemData">
			<div class="portlet light portlet-fit bordered margin-top-20">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image">
						<img :src="modifierCategoryDetails.image_url">
					</div>
					<div class="caption">
						<span class="caption-subject font-default bold uppercase">{{ modifierCategoryDetails.name }}</span>
						<div class="caption-desc font-grey-cascade">{{ modifierCategoryDetails.desc }}</div>
					</div>
				</div>
				<div class="portlet-body">
					<div class="mt-element-list margin-top-15" v-if="modifierCategoryItems.length">
						<div class="mt-list-container list-news ext-1 no-border">
							<ul>
							<li 
								v-for="modifierItem in modifierCategoryItems" 
								class="mt-list-item margin-top-15"  
								:class="{'no-hover-highlight' : expanded === modifierItem.id, 'clickable' : expanded !== modifierItem.id}" 
								:id="'modifierItem-' + modifierItem.id" 
								@click="expandDetails(modifierItem.id)"
								:key="modifierItem.id"
							>
								<div class="margin-bottom-15 actions-on-top">
									<el-tooltip 
										v-if="$root.permissions['menu_manager modifiers items update']"
										content="Edit" 
										effect="light" 
										placement="right">
										<a class="btn btn-circle btn-icon-only btn-default" @click="displayEditItemModal(modifierItem, $event)">
											<i class="fa fa-lg fa-pencil"></i>
										</a>
									</el-tooltip>
									<el-tooltip 
										v-if="$root.permissions['menu_manager modifiers items read'] && !$root.permissions['menu_manager modifiers items update']"
										content="View" 
										effect="light" 
										placement="right">
										<a class="btn btn-circle btn-icon-only btn-default" @click="displayEditItemModal(modifierItem, $event)">
											<i class="fa fa-lg fa-eye"></i>
										</a>
									</el-tooltip>
									<el-tooltip 
										v-if="$root.permissions['menu_manager modifiers items update']"
										content="Nutrition info" 
										effect="light" 
										placement="right">
										<a class="btn btn-circle btn-icon-only btn-default" @click="viewModifierNutritionInfo(modifierItem, $event)">
											<i class="fa fa-lg fa-heartbeat"></i>
										</a>
									</el-tooltip>
									<el-tooltip 
										v-if="$root.permissions['menu_manager modifiers items update']"
										content="Apply To Locations" 
										effect="light" 
										placement="right">
										<a class="btn btn-circle btn-icon-only btn-default" @click="openApplyToLocationsModal(modifierItem)">
											<i class="icon-layers"></i>
										</a>
									</el-tooltip>
									<el-tooltip 
										v-if="$root.permissions['menu_manager modifiers items delete']"
										content="Delete" 
										effect="light" 
										placement="right">
										<a class="btn btn-circle btn-icon-only btn-default" @click="displayDeleteItemModal(modifierItem, $event)">
											<i class="fa fa-lg fa-trash"></i>
										</a>
									</el-tooltip>
								</div>
								<div class="list-icon-container" v-show="expanded !== modifierItem.id">
									<a>
										<i :id="'icon-' + modifierItem.id" class="fa fa-angle-right"></i>
									</a>
								</div>
								<div class="list-thumb">
									<a v-if="modifierItem.image_url.length">
										<img alt="" :src="modifierItem.image_url" />
									</a>
									<a v-else>
										<img src="../../../assets/img/app/login/bg1.jpg">
									</a>
								</div>
								<div class="list-datetime bold uppercase font-red">
									<span>{{ modifierItem.name }}</span>
								</div>
	                            <div class="row">
	                            	<div class="col-md-4">
	                                	<strong>Price:</strong>
	                                	<span>{{ modifierItem.price }}</span><br>
	                                	<strong>SKU:</strong>
	                                	<span>{{ modifierItem.sku }}</span><br>
	                                </div>
                                	<div class="col-md-4">
                                    	<strong>Min:</strong>
                                    	<span>{{ modifierItem.min }}</span><br>
                                    	<strong>Max:</strong>
                                    	<span>{{ modifierItem.max }}</span>
                                    </div>
                                	<div class="col-md-4">
                                		<strong>Status:</strong>
                                		<span v-if="modifierItem.status == 1">Available</span>
                                		<span v-if="modifierItem.status == 0">Sold Out</span>
                                		<strong>Description:</strong>
                                		<span>{{ modifierItem.desc }}</span>
                                    </div>
	                            </div>
                                <div class="row" :class="{'mt-list-item-expanded' : expanded === modifierItem.id, 'mt-list-item-collapsed' : expanded !== modifierItem.id}">
			                        <div class="col-md-4">
			                        	<div class="col-md-12">
				                        	<h5 class="inline-block">Tags</h5>
			                        	</div>
			                        	<div class="col-md-12">
			                        		<div v-if="modifierItem.tags && modifierItem.tags.length">
                				        	    <ul class="item-modifier-list">
                				        	    	<li 
														class="col-md-6" 
														v-for="tag in modifierItem.tags"
														:key="tag.id">
                				        	    		{{tag.name}}
                				        	    	</li>
                				        	    </ul>
			                        		</div>
			                        		<div class="col-md-12" v-if="!modifierItem.tags || !modifierItem.tags.length">
			                        			<p class="grey-text">No tags have been applied to this modifier item.</p>
			                        		</div>
			                        		<div class="col-md-12">
			                        			<button 
													v-if="$root.permissions['menu_manager modifiers items update tags']"
													type="button" 
													class="btn btn-outline btn-xs blue margin-top-10" 
													@click="showTagsModal(modifierItem.id, modifierItem.tags)">
													Add Tags
												</button>
			                        		</div>
			                        	</div>
			                        </div>
			                        <div class="col-md-4">
			                        	<div class="col-md-12">
				                        	<h5 class="inline-block">Portions</h5>
			                        	</div>
			                        	<div class="col-md-12">
			                        		<div v-if="modifierItem.modifier_item_portions && modifierItem.modifier_item_portions.length">
                				        	    <ul class="item-modifier-list">
                				        	    	<li 
														class="col-md-6" 
														v-for="portion in modifierItem.modifier_item_portions"
														:key="portion.id">
                				        	    		{{portion.name}}
                				        	    	</li>
                				        	    </ul>
			                        		</div>
			                        		<div class="col-md-12" v-if="!modifierItem.modifier_item_portions || !modifierItem.modifier_item_portions.length">
			                        			<p class="grey-text">No portions have been applied to this modifier item.</p>
			                        		</div>
			                        		<div class="col-md-12">
			                        			<button 
													v-if="$root.permissions['menu_manager modifiers items update portions']"
													type="button" 
													class="btn btn-outline btn-xs blue margin-top-10" 
													@click="showPortionsModal(modifierItem.id, modifierItem.modifier_item_portions)">
													Add Portions
												</button>
			                        		</div>
			                        	</div>
			                        </div>
			                        <div class="col-md-4">
			                        	<div class="col-md-12">
				                        	<h5 class="inline-block">Options</h5>
			                        	</div>
			                        	<div class="col-md-12">
			                        		<div v-if="modifierItem.options && modifierItem.options.length">
                				        	    <ul class="item-modifier-list">
                				        	    	<li 
														class="col-md-6" 
														v-for="option in modifierItem.options"
														:key="option.id">
                				        	    		{{option.name}}
                				        	    	</li>
                				        	    </ul>
			                        		</div>
			                        		<div class="col-md-12" v-if="!modifierItem.options || !modifierItem.options.length">
			                        			<p class="grey-text">No options have been applied to this modifier item.</p>
			                        		</div>
			                        		<div class="col-md-12">
			                        			<button 
													v-if="$root.permissions['menu_manager modifiers items update options']"
													type="button" 
													class="btn btn-outline btn-xs blue margin-top-10" 
													@click="showOptionsModal(modifierItem.id, modifierItem.options)">
													Add Options
												</button>
			                        		</div>
			                        	</div>
			                        </div>
			                    </div>
							</li>
							</ul>
						</div>
					</div>
					<div class="margin-top-20" v-else>
						<no-results :show="!modifierCategoryItems.length" :type="'categories'" :custom="true" :text="customText"></no-results>
					</div>
				</div>
			</div>
		</div>
		<div class="margin-top-20" v-if="!displayModifierItemData">
			<no-results :show="!$root.activeLocation || !$root.activeLocation.id" :type="'modifier items'"></no-results>
		</div>

		<!-- ASSIGN TO STORES MODAL START -->
		<modal :show="showApplyToLocationsModal" effect="fade" @closeOnEscape="closeApplyToLocationsModal">
			<div slot="modal-header" class="modal-header center">
				<button type="button" class="close" @click="closeApplyToLocationsModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Assign {{modifierToApplyToLocations.name}} To Stores</h4>
			</div>
			<div slot="modal-body" class="modal-body relative-block">
				<div class="alert alert-danger" v-show="applyErrorMessage.length" ref="applyErrorMessage">
				    <button class="close" data-close="alert" @click="clearError('applyErrorMessage')"></button>
                    <span>{{ applyErrorMessage }}</span>
				</div>
				<select-locations-popup 
					v-if="showApplyToLocationsModal"
					@selectedLocations="selectedLocations" 
					:withButton="false">
				</select-locations-popup>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button 
					type="button" 
					class="btn blue" 
					@click="applyModifierToLocations()"
					:disabled="assigningModifierToLocations">
					Assign
					<i 
						v-show="assigningModifierToLocations"
						class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- ASSIGN TO STORES MODAL END -->

		<edit-modifier-item v-if="editItemModalActive" @editModifierItem="editModifierItem" @deactivateEditItemModal="closeEditItemModal"></edit-modifier-item>
		<delete-modifier-item v-if="deleteItemModalActive" :itemId="selectedItemId" @closeDeleteModifierItemModal="closeDeleteItemModal" @deleteModifierItemAndCloseModal="deleteModifierItemAndCloseModal"></delete-modifier-item>
		<modifier-nutrition-info v-if="displayNutritionModal" :modifierItem="selectedItem" @deactivateNutritionInfoModal="displayNutritionModal = false"></modifier-nutrition-info>
		<tags-list v-if="displayTagsListModal" :itemType="'modifier-item'" :appliedTags="appliedTags" :selectedItemId="selectedItemId" @deactivateTagsListModal="closeTagsListModal"></tags-list>
		<portions-list v-if="displayPortionsListModal" :itemType="'modifier-item'" :appliedPortions="appliedPortions" :selectedItemId="selectedItemId" @closePortionsListModal="closePortionsListModal"></portions-list>
		<options-list v-if="displayOptionsListModal" :itemType="'modifier-item'" :appliedOptions="appliedOptions" :selectedItemId="selectedItemId" @closeOptionsListModal="closeOptionsListModal"></options-list>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import LoadingScreen from '../../modules/LoadingScreen'
import ModifiersFunctions from '../../../controllers/Modifiers'
import EditModifierItem from './Modifiers/EditModifierItem'
import DeleteModifierItem from './Modifiers/DeleteModifierItem'
import ModifierNutritionInfo from './Modifiers/ModifierNutritionInfo'
import TagsList from './Tags/TagsList'
import PortionsList from './Portions/PortionsList'
import OptionsList from './Options/OptionsList'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'
import SelectLocationsPopup from '@/components/modules/SelectLocationsPopup'
import Modal from '@/components/modules/Modal'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Menu Manager', link: false},
				{name: 'Modifiers', link: '/app/menu_manager/modifiers'},
				{name: 'Modifier Items', link: false}
			],
			editItemModalActive: false,
			deleteItemModalActive: false,
			displayModifierItemData: false,
			displayNutritionModal: false,
			modifierCategoryDetails: {},
			modifierCategoryItems: [],
			selectedItem: {},
			appliedTags: [],
			appliedPortions: [],
			appliedOptions: [],
			selectedItemId: 0,
			displayTagsListModal: false,
			customText: 'There are no items in this category. Click on the button above to add one.',
			createModifierItemCollapse: true,
			newModifierItem: {
				modifier_id: this.$route.params.modifier_id,
				name: '',
				desc: '',
				sku: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				price: '',
				min: null,
				max: null,
				order: null
			},
			showGalleryModal: false,
			errorMessage: '',
			displayPortionsListModal: false,
			displayOptionsListModal: false,
			expanded: null,
			imageMode: {
				newMenu: false
			},
			showApplyToLocationsModal: false,
			assigningModifierToLocations: false,
			modifierToApplyToLocations: {},
			applyErrorMessage: ''
		}
	},
	mounted () {
		if (this.$root.activeLocation && this.$root.activeLocation.id && this.$route.params.modifier_id) {
			this.getModifierCategoryDetails()
			this.getModifierCategoryItems()
		}
	},
	methods: {
		/**
		 * To update the locations selected in the child component
		 * @function
		 * @param {array} locations - Arrray of store ids
		 * @returns {undefined}
		 */
		selectedLocations (locations) {
			this.modifierToApplyToLocations.locations = locations
		},
		/**
		 * To open the modal for applying a modifier to locations
		 * @function
		 * @param {object} modifier - Modifier the user clicked
		 * @returns {undefined}
		 */
		openApplyToLocationsModal (modifier) {
			this.modifierToApplyToLocations = {
				...modifier,
				locations: []
			}
			this.showApplyToLocationsModal = true
		},
		/**
		 * To close the modal for applying a modifier to locations
		 * @function
		 * @returns {undefined}
		 */
		closeApplyToLocationsModal () {
			this.modifierToApplyToLocations = {}
			this.showApplyToLocationsModal = false
		},
		/**
		 * To check if data is ready to post
		 * @function
		 * @returns {object} - A resolved promise if ok, a reject with error message if failed
		 */
		validateApplyToLocations () {
			var modifierItemsVue = this
			return new Promise(function (resolve, reject) {
				if (!modifierItemsVue.modifierToApplyToLocations.locations.length) {
					reject('Select at least one store')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To save selected modifier-locaton links in the API
		 * @function
		 * @returns {undefined}
		 */
		applyModifierToLocations () {
			var modifierItemsVue = this
			modifierItemsVue.clearError('applyErrorMessage')

			this.validateApplyToLocations()
			.then(response => {
				modifierItemsVue.assigningModifierToLocations = true
				let payload = {
					'modifier_item_id': modifierItemsVue.modifierToApplyToLocations.id,
					'locations': modifierItemsVue.modifierToApplyToLocations.locations
				}
				ModifiersFunctions.applyModifierToLocations(payload).then(response => {
					modifierItemsVue.closeApplyToLocationsModal()
					modifierItemsVue.showApplySuccess()
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could apply modifier to stores',
						errorName: 'applyErrorMessage',
						vue: modifierItemsVue
					})
				}).finally(() => {
					modifierItemsVue.assigningModifierToLocations = false
				})
			}).catch(reason => {
				// If validation fails then display the error message
				modifierItemsVue.applyErrorMessage = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To confirm operation succeeded
		 * @function
		 * @returns {undefined}
		 */
		showApplySuccess () {
			this.$swal({
				title: 'Success!',
				text: 'Modifier applied to selected stores',
				type: 'success',
				confirmButtonText: 'OK'
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
		 * To clear an error.
		 * @function
		 * @param {string} name - Name of the error to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.showGalleryModal = false
			this.newModifierItem.image_url = val.image_url
		},
		/**
		 * To toggle the create menu panel, initially set to opened
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateModifierItemPanel () {
			this.createModifierItemCollapse = !this.createModifierItemCollapse
		},
		/**
		 * To check if the modifier item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateModifierItemData () {
			var modifierItemsVue = this
			return new Promise(function (resolve, reject) {
				if (!modifierItemsVue.newModifierItem.name.length) {
					reject('Modifier Item name cannot be blank')
				} else if (!modifierItemsVue.newModifierItem.desc.length) {
					reject('Modifier Item description cannot be blank')
				} else if (!modifierItemsVue.newModifierItem.sku.length) {
					reject('Modifier Item SKU cannot be blank')
				} else if (!modifierItemsVue.newModifierItem.price.length) {
					reject('Modifier Item price cannot be blank')
				} else if (!modifierItemsVue.newModifierItem.image_url.length) {
					reject('Modifier Item image URL cannot be blank')
				} else if (!$.isNumeric(modifierItemsVue.newModifierItem.status)) {
					reject('Modifier Item status cannot be blank')
				} else if (!$.isNumeric(modifierItemsVue.newModifierItem.min)) {
					reject('Modifier Item min should be a number')
				} else if (!$.isNumeric(modifierItemsVue.newModifierItem.max)) {
					reject('Modifier Item max should be a number')
				} else if (!$.isNumeric(modifierItemsVue.newModifierItem.order)) {
					reject('Modifier Item order should be a number')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To add the new modifier item and close the modal and redirect to the modifier categories page.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		addNewModifierItem () {
			var modifierItemsVue = this
			modifierItemsVue.clearError('errorMessage')

			return modifierItemsVue.validateModifierItemData()
			.then(response => {
				ModifiersFunctions.addNewModifierItem(modifierItemsVue.newModifierItem, modifierItemsVue.$root.appId, modifierItemsVue.$root.appSecret, modifierItemsVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						modifierItemsVue.newModifierItem.id = response.payload.new_modifier_item_id
						modifierItemsVue.addModifierItem(modifierItemsVue.newModifierItem)
					} else {
						modifierItemsVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						modifierItemsVue.$router.push('/login/expired')
						return
					}
					modifierItemsVue.errorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				modifierItemsVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To get the details of the selected modifier category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifierCategoryDetails () {
			var modifierItemsVue = this
			ModifiersFunctions.getModifierCategoryDetails(modifierItemsVue.$route.params.modifier_id, modifierItemsVue.$root.appId, modifierItemsVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					modifierItemsVue.modifierCategoryDetails = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					modifierItemsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get the list of modifier items for the selected modifier category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifierCategoryItems () {
			this.displayModifierItemData = true
			var modifierItemsVue = this
			modifierItemsVue.modifierCategoryItems = []
			return ModifiersFunctions.getModifierCategoryItems(modifierItemsVue.$route.params.modifier_id, modifierItemsVue.$root.appId, modifierItemsVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					modifierItemsVue.displayModifierItemData = false
					modifierItemsVue.modifierCategoryItems = response.payload
				} else {
					modifierItemsVue.displayModifierItemData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					modifierItemsVue.$router.push('/login/expired')
					return
				}
				modifierItemsVue.displayModifierItemData = false
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get the complete details of a modifier item.
		 * @function
		 * @param {integer} modifierItemId - The selected item id
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifierItemDetails (modifierItemId) {
			var modifierItemsVue = this
			ModifiersFunctions.getModifierItemDetails(modifierItemId, modifierItemsVue.$root.appId, modifierItemsVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					for (var i = 0; i < modifierItemsVue.modifierCategoryItems.length; i++) {
						if (modifierItemsVue.modifierCategoryItems[i].id === modifierItemId) {
							modifierItemsVue.$set(modifierItemsVue.modifierCategoryItems[i], 'tags', response.payload[0].tags)
							modifierItemsVue.$set(modifierItemsVue.modifierCategoryItems[i], 'modifier_item_portions', response.payload[0].modifier_item_portions)
							modifierItemsVue.$set(modifierItemsVue.modifierCategoryItems[i], 'options', response.payload[0].options)
						}
					}
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					modifierItemsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To expand/collapse the dropdown div under a modifier item.
		 * @function
		 * @param {integer} itemId - The selected modifier item id
		 * @returns {undefined}
		 */
		expandDetails (itemId) {
			this.expanded = itemId
		},
		/**
		 * To display the modal to edit modifier items.
		 * @function
		 * @param {object} modifierItem - The selected modifier item
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayEditItemModal (modifierItem, event) {
			event.stopPropagation()
			this.editItemModalActive = true
			this.$router.push('/app/menu_manager/modifier_items/' + this.$route.params.modifier_id + '/edit_modifier_item/' + modifierItem.id)
		},
		/**
		 * To display the modal to delete modifier item.
		 * @function
		 * @param {object} modifierItem - The selected modifier item
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayDeleteItemModal (modifierItem, event) {
			event.stopPropagation()
			console.log('displayDeleteItemModal', modifierItem.id)
			this.selectedItemId = modifierItem.id
			this.deleteItemModalActive = true
		},
		/**
		 * To clear the new modifier item form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewModifierItem () {
			this.newModifierItem = {
				modifier_id: this.$route.params.modifier_id,
				name: '',
				desc: '',
				sku: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				price: '',
				min: null,
				max: null,
				order: null
			}
		},
		/**
		 * To add the modifier item emitted by the child to the items list.
		 * @function
		 * @param {object} val - The new modifier item
		 * @returns {undefined}
		 */
		addModifierItem (val) {
			if (parseInt(val.order) > 0) {
				var done = false
				for (var i = 0; i < this.modifierCategoryItems.length; i++) {
					if (parseInt(this.modifierCategoryItems[i].order) < parseInt(val.order)) {
						this.modifierCategoryItems.splice(i, 0, val)
						done = true
						break
					}
				}
				if (!done) {
					this.modifierCategoryItems.push(val)
				}
			} else {
				this.modifierCategoryItems.push(val)
			}
			this.showAlert()
			this.clearNewModifierItem()
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Modifier Item \'' + this.newModifierItem.name + '\' has been successfully created!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To update the modifier item emitted by the child and highlist it on the items list.
		 * @function
		 * @param {object} val - The updated item
		 * @returns {undefined}
		 */
		editModifierItem (val) {
			this.editItemModalActive = false
			for (var i = 0; i < this.modifierCategoryItems.length; i++) {
				if (this.modifierCategoryItems[i].id === val.id) {
					this.modifierCategoryItems[i] = val
				}
			}
			$('#modifierItem-' + val.id).addClass('highlight')
			setTimeout(function () {
				$('#modifierItem-' + val.id).removeClass('highlight')
			}, 2000)
		},
		/**
		 * To close the modal to edit a modifier item.
		 * @function
		 * @returns {undefined}
		 */
		closeEditItemModal () {
			this.editItemModalActive = false
		},
		/**
		 * To close the modal to delete a modifier item.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteItemModal () {
			this.deleteItemModalActive = false
		},
		/**
		 * To close the modal to delete a modifier item.
		 * @function
		 * @returns {undefined}
		 */
		deleteModifierItemAndCloseModal () {
			this.deleteItemModalActive = false
			for (var i = 0; i < this.modifierCategoryItems.length; i++) {
				if (parseInt(this.modifierCategoryItems[i].id) === parseInt(this.selectedItemId)) {
					this.modifierCategoryItems.splice(i, 1)
				}
			}
		},
		/**
		 * To view the nutrition info of a modifier item.
		 * @function
		 * @param {object} item - The selected item
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		viewModifierNutritionInfo (item, event) {
			event.stopPropagation()
			this.displayNutritionModal = true
			this.selectedItem = item
		},
		/**
		 * To show the modal to apply tags to an item.
		 * @function
		 * @param {integer} modifierItemId - The selected modifier item id
		 * @param {object} appliedTags - The tags already applied to the item.
		 * @returns {undefined}
		 */
		showTagsModal (modifierItemId, appliedTags) {
			this.appliedTags = appliedTags
			this.selectedItemId = modifierItemId
			this.displayTagsListModal = true
		},
		/**
		 * To show the modal to apply portions to an item.
		 * @function
		 * @param {integer} modifierItemId - The selected modifier item id
		 * @param {object} appliedPortions - The portions already applied to the item.
		 * @returns {undefined}
		 */
		showPortionsModal (modifierItemId, appliedPortions) {
			this.appliedPortions = appliedPortions
			this.selectedItemId = modifierItemId
			this.displayPortionsListModal = true
		},
		/**
		 * To show the modal to apply options to an item.
		 * @function
		 * @param {integer} modifierItemId - The selected modifier item id
		 * @param {object} appliedOptions - The portions already applied to the item.
		 * @returns {undefined}
		 */
		showOptionsModal (modifierItemId, appliedOptions) {
			this.appliedOptions = appliedOptions
			this.selectedItemId = modifierItemId
			this.displayOptionsListModal = true
		},
		/**
		 * To close the tags modal and update the item to show the updated tags.
		 * @function
		 * @param {integer} val - The id of the item to which the tags were applied
		 * @returns {undefined}
		 */
		closeTagsListModal (val) {
			this.displayTagsListModal = false
			this.getModifierItemDetails(val)
		},
		/**
		 * To close the portions modal and update the item to show the updated portions.
		 * @function
		 * @param {integer} val - The id of the item to which the portions were applied
		 * @returns {undefined}
		 */
		closePortionsListModal (val) {
			this.displayPortionsListModal = false
			this.getModifierItemDetails(val)
		},
		/**
		 * To close the options modal and update the item to show the updated options.
		 * @function
		 * @param {integer} val - The id of the item to which the options were applied
		 * @returns {undefined}
		 */
		closeOptionsListModal (val) {
			this.displayOptionsListModal = false
			this.getModifierItemDetails(val)
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		EditModifierItem,
		DeleteModifierItem,
		ModifierNutritionInfo,
		TagsList,
		NoResults,
		ResourcePicker,
		PortionsList,
		OptionsList,
		SelectLocationsPopup,
		Modal
	}
}
</script>
<style scoped>
.mt-list-item-collapsed {
	overflow: hidden;
	max-height: 0;
	opacity: 0;
	transition: max-height 0.2s ease-out, opacity 0.1s ease-out;
}
.mt-list-item-expanded {
	max-height: 100%;
	opacity: 1;
	transition: max-height 0.2s ease-in, opacity 0.5s ease-in;
}
.mt-element-list .list-news.ext-1.mt-list-container ul>.mt-list-item.no-hover-highlight:hover, 
.mt-element-list .list-news.ext-2.mt-list-container ul>.mt-list-item.no-hover-highlight:hover {
	background-color: rgb(255, 255, 255);
}
.actions-on-top {
	margin-top: -5px;
}
</style>

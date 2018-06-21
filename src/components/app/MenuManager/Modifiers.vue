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
        <div class="portlet box blue-hoki" v-if="$root.activeLocation && $root.activeLocation.id">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreateModifierPanel()">
				<div class="custom tools">
					<a :class="{'expand': !createModifierCollapse, 'collapse': createModifierCollapse}"></a>
				</div>
				<div class="caption">
					&emsp;Create A New Modifier Category
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': createModifierCollapse}">
      			<form role="form" @submit.prevent="addNewModifierCategory()">
      				<div class="form-body row">
      					<div class="col-md-12">
			        		<div class="alert alert-danger" v-if="errorMessage.length">
			        		    <button class="close" data-close="alert" @click.prevent="clearError()"></button>
			        		    <span>{{errorMessage}}</span>
			        		</div>
			        	</div>
		        			<div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
							<resource-picker 
								@open="toggleImageMode('newMenu', true)"
								@close="toggleImageMode('newMenu', false)"
								@selected="updateImage" 
								:imageButton="true"
								:imageUrl="newCategory.image_url"
								class="margin-top-15"
							>
							</resource-picker>
		        		</div>
		        		<div class="col-md-5" v-show="!imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm"  :class="{'edited': newCategory.name.length}" id="form_control_1" v-model="newCategory.name">
							    <label for="form_control_1">Modifier Category Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm"  :class="{'edited': newCategory.desc.length}" id="form_control_2" v-model="newCategory.desc">
							    <label for="form_control_2">Modifier Category Description</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="number" class="form-control input-sm"  :class="{'edited': newCategory.min}" id="form_control_3" v-model="newCategory.min">
							    <label for="form_control_3">Modifier Category Min</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="number" class="form-control input-sm"  :class="{'edited': newCategory.max}" id="form_control_4" v-model="newCategory.max">
							    <label for="form_control_4">Modifier Category Max</label>
							</div>
		        		</div>
		        		<div class="col-md-5" v-show="!imageMode.newMenu">
		        			<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm"  :class="{'edited': newCategory.sku.length}" id="form_control_5" v-model="newCategory.sku">
							    <label for="form_control_5">Modifier Category SKU</label>
							</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="number" class="form-control input-sm"  :class="{'edited': newCategory.included}" id="form_control_6" v-model="newCategory.included">
							    <label for="form_control_6">Modifier Category Number Free</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="number" class="form-control input-sm"  :class="{'edited': newCategory.order}" id="form_control_7" v-model="newCategory.order">
							    <label for="form_control_7">Modifier Category Order</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
				                <label>Modifier Category Status:</label><br>
				                <el-switch
				                	v-model="newCategory.status"
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
        <!-- END CREATE NEW MODIFIER CATEGORY-->
        <loading-screen :show="displayModifierData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
        <div class="alert alert-info center margin-top-20" v-if="!$root.activeLocation.id">
            <h4>No Store Selected</h4>
            <p>Please select a store from the location panel on the right to view its modifers</p>
        </div>
        <div v-if="$root.activeLocation && $root.activeLocation.id && !displayModifierData">
		    <div class="portlet light portlet-fit bordered margin-top-20" id="categories-container">
		        <div class="portlet-title bg-blue-chambray">
		        	<div class="menu-image-main">
		        		<img src="../../../../static/client_logo.png">
		        	</div>
		            <div class="caption">
		                <span class="caption-subject font-green bold uppercase">Modifiers</span>
                        <div class="caption-desc font-grey-cascade">Click on a modifer category to view its items.</div>
		            </div>
		        </div>
		        <div class="portlet-body">
		            <div class="mt-element-list margin-top-15" v-if="storeModifiers.length">
		                <div class="mt-list-container list-news ext-1 no-border">
		                    <ul>
		                        <li 
									class="mt-list-item margin-top-15 clickable" 
									@click="viewModifierCategoryItems(modifier)" 
									v-for="modifier in storeModifiers" 
									:id="'modifierCategory-' + modifier.id"
									:key="modifier.id"
								>
		                        	<div class="actions-on-top margin-bottom-15">
		                        		<el-tooltip content="Edit" effect="light" placement="right">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editModifierCategory(modifier, $event)">
	                                            <i class="fa fa-lg fa-pencil"></i>
	                                        </a>
		                        		</el-tooltip>
		                        		<el-tooltip content="Apply to items" effect="light" placement="right">
	                                        <a class="btn btn-circle btn-icon-only btn-default" @click="displayMenuTreeModal(modifier, $event)">
	                                            <i class="icon-layers"></i>
	                                        </a>
		                        		</el-tooltip>
										<el-tooltip content="Apply to items at locations" effect="light" placement="right">
	                                        <a class="btn btn-circle btn-icon-only btn-default" @click="displayApplyToItemsAtLocationsModal(modifier, $event)">
	                                            <i class="fa fa-lg fa-plus"></i>
	                                        </a>
		                        		</el-tooltip>
		                        		<el-tooltip content="Delete" effect="light" placement="right">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="deleteModifierCategory(modifier, $event)">
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
		                                    <img alt="" :src="modifier.image_url" />
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
		            <div class="margin-top-20" v-if="!storeModifiers.length && !displayModifierData">
			            <no-results :show="!storeModifiers.length" :type="'modifier categories'" :custom="true" :text="customText"></no-results>
			        </div>
		        </div>
		    </div>
        </div>
        <div class="margin-top-20" v-if="$root.activeLocation.id && !displayModifierData">
            <no-results :type="'modifier categories'"></no-results>
        </div>
        <edit-modifier-category v-if="editCategoryModalActive" @updateModifierCategory="updateModifierCategory" @deactivateEditCategoryModal="closeEditCategoryModal"></edit-modifier-category>
        <delete-modifier-category v-if="deleteCategoryModalActive" :passedModifierCategoryId="passedModifierCategoryId" @closeDeleteModifierCategoryModal="closeDeleteModifierCategoryModal" @deleteModifierCategoryAndCloseModal="deleteModifierCategoryAndCloseModal"></delete-modifier-category>
		<menu-tree v-if="showMenuTreeModal" :selectedObject="selectedModifier" :headerText="headerText" :updateType="'modifier'" @closeMenuTreeModal="closeMenuTreeModal"></menu-tree>
		<apply-modifier-to-items-at-locations
			v-if="showModifierToApplyToItemsAtLocationsModal"
			:modifier="modifierToApplyToItemsAtLocations"
			@closeApplyModifierToItemsAtLocations="closeApplyModifierToItemsAtLocationsModal"
			@applyModifierToItemsAtLocationsSuccess="showApplyModifierToItemsAtLocationsSuccess"
		>
		</apply-modifier-to-items-at-locations>
	</div>
</template>

<script>
import $ from 'jquery'
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

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Menu Manager', link: false},
				{name: 'Modifiers', link: false}
			],
			displayModifierData: false,
			editCategoryModalActive: false,
			deleteCategoryModalActive: false,
			storeModifiers: [],
			customText: 'There are no modifier categories in this menu. Click on the button above to add one.',
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
			showModifierToApplyToItemsAtLocationsModal: false
		}
	},
	mounted () {
		if (this.$root.activeLocation && this.$root.activeLocation.id) {
			this.getStoreModifiers()
		}
	},
	methods: {
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
		 * To close the modal to apply a modifier to selected items at selected locations.
		 * @function
		 * @returns {undefined}
		 */
		closeApplyModifierToItemsAtLocationsModal () {
			this.showModifierToApplyToItemsAtLocationsModal = false
		},
		/**
		 * To confirm operation succeeded
		 * @function
		 * @returns {undefined}
		 */
		showApplyModifierToItemsAtLocationsSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Modifier applied',
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
			this.headerText = 'Modifier \'' + this.selectedModifier.name + '\''
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
			return ModifiersFunctions.getStoreModifiers(menusVue.$root.appId, menusVue.$root.appSecret, menusVue.$root.activeLocation.id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					menusVue.displayModifierData = false
					menusVue.storeModifiers = response.payload
				} else {
					menusVue.displayModifierData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					menusVue.$router.push('/login/expired')
					return
				}
				menusVue.displayModifierData = false
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
			this.$router.push('/app/menu_manager/modifiers/edit_category/' + modifier.id)
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
		 * To update the modifier category emitted by the child and highlist it on the categories list.
		 * @function
		 * @param {object} val - The updated category
		 * @returns {undefined}
		 */
		updateModifierCategory (val) {
			this.editCategoryModalActive = false
			for (var i = 0; i < this.storeModifiers.length; i++) {
				if (this.storeModifiers[i].id === val.id) {
					this.storeModifiers[i] = val
				}
			}
			$('#modifierCategory-' + val.id).addClass('highlight')
			setTimeout(function () {
				$('#modifierCategory-' + val.id).removeClass('highlight')
			}, 2000)
		},
		/**
		 * To check if the modifier category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateModifierCategoryData () {
			var addModifierCategoryVue = this
			return new Promise(function (resolve, reject) {
				if (!addModifierCategoryVue.newCategory.name.length) {
					reject('Modifier Category name cannot be blank')
				} else if (!addModifierCategoryVue.newCategory.desc.length) {
					reject('Modifier Category description cannot be blank')
				} else if (!addModifierCategoryVue.newCategory.sku.length) {
					reject('Modifier Category SKU cannot be blank')
				} else if (!addModifierCategoryVue.newCategory.image_url.length) {
					reject('Modifier Category image cannot be blank')
				} else if (!$.isNumeric(addModifierCategoryVue.newCategory.status)) {
					reject('Modifier Category status should be a number')
				} else if (!$.isNumeric(addModifierCategoryVue.newCategory.included)) {
					reject('Modifier Category included should be a number')
				} else if (!$.isNumeric(addModifierCategoryVue.newCategory.max)) {
					reject('Modifier Category max should be a number')
				} else if (!$.isNumeric(addModifierCategoryVue.newCategory.min)) {
					reject('Modifier Category min should be a number')
				} else if (!$.isNumeric(addModifierCategoryVue.newCategory.order)) {
					reject('Modifier Category order should be a number')
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

			return addModifierCategoryVue.validateModifierCategoryData()
			.then(response => {
				addModifierCategoryVue.newCategory.location_id = addModifierCategoryVue.$root.activeLocation.id
				ModifiersFunctions.addNewModifierCategory(addModifierCategoryVue.newCategory, addModifierCategoryVue.$root.appId, addModifierCategoryVue.$root.appSecret, addModifierCategoryVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						addModifierCategoryVue.newCategory.id = response.payload.id
						addModifierCategoryVue.addModifierCategory(addModifierCategoryVue.newCategory)
					} else {
						addModifierCategoryVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						addModifierCategoryVue.$router.push('/login/expired')
						return
					}
					addModifierCategoryVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				addModifierCategoryVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To add the modifier category emitted by the child to the categories list.
		 * @function
		 * @param {object} val - The new category
		 * @returns {undefined}
		 */
		addModifierCategory (val) {
			if (parseInt(val.order) > 0) {
				var done = false
				for (var i = 0; i < this.storeModifiers.length; i++) {
					if (parseInt(this.storeModifiers[i].order) < parseInt(val.order)) {
						this.storeModifiers.splice(i, 0, val)
						done = true
						break
					}
				}
				if (!done) {
					this.storeModifiers.push(val)
				}
			} else {
				this.storeModifiers.push(val)
			}
			this.showAlert()
			this.clearNewCategory()
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Modifier category \'' + this.newCategory.name + '\' has been successfully created!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
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
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
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
		ApplyModifierToItemsAtLocations
	}
}
</script>

<style scoped>
.actions-on-top {
	margin-top: -5px;
}
</style>


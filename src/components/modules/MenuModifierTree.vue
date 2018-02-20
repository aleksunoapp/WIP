<template>
	<modal :show="showMenuModifierTreeModal" :width="900" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Select Items for {{ selectedObject.name }}</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="portlet light bordered height-mod">
				<div class="portlet-body">
  					<div class="col-md-12">
		        		<div class="alert alert-danger" v-if="errorMessage.length">
		        		    <button class="close" data-close="alert" @click="clearError()"></button>
		        		    <span>{{errorMessage}}</span>
		        		</div>
		        	</div>
					<tabset :active="activeTab">
						<tab header="Menu Items">
							<div class="col-md-4">
								<h4>Menus</h4>
								<div class="dd" id="nestable_list_1" v-if="menus.length">
	                            	<ol class="dd-list">
	                                	<li class="dd-item" v-for="menu in menus" :data-id="menu.id" @click.stop.prevent="selectMenu(menu)" :key="menu.id">
	                                    	<div class="dd-handle" :class="{'active': menu.id === activeMenu.id}"> {{ menu.name }}
	                                    	<span class="pull-right"><i class="fa fa-chevron-right"></i></span>
	                                    	</div>
	                                	</li>
	                            	</ol>
	                        	</div>
	                        	<div v-else>
	                        		<div class="alert alert-warning">
	       	   							<span>There are no menus to display.</span>
	       							</div>
	                        	</div>
							</div>
							<div class="col-md-4" v-if="isMenuSelected">
								<h4>{{ activeMenu.name }} - Categories</h4>
								<div class="dd" id="nestable_list_2" v-if="categories.length">
						            <ol class="dd-list">
						                <li class="dd-item" v-for="category in categories" :data-id="category.id" @click="selectCategory(category)">
						                    <div class="dd-handle" :class="{'active': category.id === activeCategory.id}"> {{ category.name }}
						                        <span class="pull-right"><i class="fa fa-chevron-right"></i></span>
						                    </div>
						                </li>
						            </ol>
							    </div>
							    <div v-else>
							    	<div class="alert alert-warning">
							           	<span>There are no categories in the menu '{{ activeMenu.name }}'.</span>
							        </div>
							    </div>
							</div>
							<div class="col-md-4" v-if="isCategorySelected">
								<h4><input type="checkbox" @change="selectAllMenuItems()" class="md-check" v-model="selectAllMenuItemsSelected"> {{ activeCategory.name }} - Items</h4>
								<div class="dd" id="nestable_list_3" v-if="items.length">
							        <ol class="dd-list">
							            <li class="dd-item" v-for="item in items" :data-id="item.id">
							                <div class="dd-handle" @click.stop="toggleSKUSelected(item)">
							                    <span class="pull-left">
							                    	<i class="fa check" :class="{'fa-check-square checked': item.selected, 'fa-square-o unchecked': !item.selected}" aria-hidden="true"></i>
							                    	<label :for="'item_checkbox_' + item.id">{{ item.name }}
							                    	</label>
							                    </span>
							                </div>
							            </li>
							        </ol>
							    </div>
							    <div v-else>
							        <div class="alert alert-warning">
							           	<span>There are no items in the category '{{ activeCategory.name }}'.</span>
							        </div>
							    </div>
							</div>
						</tab>
						<tab header="Modifier Items">
							<div class="col-md-6">
								<h4>Modifier Categories</h4>
								<div class="dd" id="nestable_list_1" v-if="modifiers.length">
	                                <ol class="dd-list">
	                                    <li class="dd-item" v-for="modifier in modifiers" :data-id="modifier.id" @click="selectModifier(modifier, $event)">
	                                        <div class="dd-handle" :class="{'active': modifier.id === activeModifier.id}"> {{ modifier.name }}
	                                        	<span class="pull-right"><i class="fa fa-chevron-right"></i></span>
	                                        </div>
	                                    </li>
	                                </ol>
	                            </div>
	                            <div v-else>
	                            	<div class="alert alert-warning">
	    			        		    <span>There are no modifier categories to display.</span>
	    			        		</div>
	                            </div>
							</div>
							<div class="col-md-6" v-if="isModifierCategorySelected">
								<h4><input type="checkbox" @change="selectAllModifierItems()" class="md-check" v-model="selectAllModifierItemsSelected"> {{ activeModifier.name }} - Items</h4>
								<div class="dd" id="nestable_list_3" v-if="modifierItems.length">
	                                <ol class="dd-list">
	                                    <li class="dd-item" v-for="item in modifierItems" :data-id="item.id">
	                                        <div class="dd-handle">
	                                        	<span class="pull-left" @click.prevent="toggleSKUSelected(item)">
	                                        		<i class="fa check" :class="{'fa-check-square checked': item.selected, 'fa-square-o unchecked': !item.selected}" aria-hidden="true"></i>
	                                        		<label :for="'item_checkbox_' + item.id">{{ item.name }}
	                                        		</label>
	                                        	</span>
	                                        </div>
	                                    </li>
	                                </ol>
	                            </div>
	                            <div v-else>
	                            	<div class="alert alert-warning">
	    			        		    <span>There are no items in the category '{{ activeModifier.name }}'.</span>
	    			        		</div>
	                            </div>
							</div>
						</tab>
					</tabset>
				</div>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="applySelectedItems()">Save</button>
		</div>
	</modal>
</template>

<script>
// import $ from 'jquery'
import Modal from './Modal'
import MenusFunctions from '../../controllers/Menus'
import CategoriesFunctions from '../../controllers/Categories'
import ItemsFunctions from '../../controllers/Items'
import ModifiersFunctions from '../../controllers/Modifiers'
import Tab from '../modules/Tab'
import Tabset from '../modules/Tabset'
import RewardsFunctions from '../../controllers/Rewards'

export default {
	data () {
		return {
			showMenuModifierTreeModal: false,
			menus: [],
			categories: [],
			items: [],
			modifiers: [],
			modifierItems: [],
			isMenuSelected: false,
			selectAllMenuItemsSelected: false,
			selectAllModifierItemsSelected: false,
			isCategorySelected: false,
			activeMenu: {},
			activeCategory: {},
			isModifierCategorySelected: false,
			activeModifier: {},
			activeTab: 0,
			selectedSKUs: [],
			errorMessage: ''
		}
	},
	props: {
		selectedObject: {
			type: Object,
			default: () => { return {} }
		}
	},
	created () {
		this.getMenus()
		this.getModifiers()
	},
	mounted () {
		this.showMenuModifierTreeModal = true
		this.selectedObject.sku_array.forEach(sku => this.selectedSKUs.push(sku))
	},
	methods: {
		/**
		 * To select or unselect the SKU.
		 * @param {object} item - The item to toggle.
		 * @function
		 * @returns {undefined}
		 */
		toggleSKUSelected (item) {
			const i = this.selectedSKUs.indexOf(item.sku)
			if (i !== -1) {
				this.selectedSKUs.splice(i, 1)
				this.$set(item, 'selected', false)
			} else {
				this.selectedSKUs.push(item.sku)
				this.$set(item, 'selected', true)
			}
		},
		/**
		 * To clear the items array.
		 * @function
		 * @returns {undefined}
		 */
		clearModifierItems () {
			this.modifierItems = []
		},
		/**
		 * To set the value of the variable 'activeModifier' as the selected modifier object.
		 * @function
		 * @param {object} modifier - The selected modifier.
		 * @param {object} event - The click event that initiated the action.
		 * @returns {undefined}
		 */
		selectModifier (modifier, event) {
			event.stopPropagation()
			event.preventDefault()
			this.activeModifier = modifier
			this.isModifierCategorySelected = true
			this.clearModifierItems()
			this.getItemsForActiveModifier()
		},
		/**
		 * To get a list of all item for the current active modifier category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemsForActiveModifier () {
			var modifierTreeVue = this
			modifierTreeVue.modifierItems = []
			return ModifiersFunctions.getModifierCategoryItems(modifierTreeVue.activeModifier.id, modifierTreeVue.$root.appId, modifierTreeVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					let all = true
					response.payload.forEach(item => {
						if (!modifierTreeVue.selectedSKUs.includes(item.sku)) {
							all = false
						}
						modifierTreeVue.selectedSKUs.forEach(previous => {
							if (item.sku === previous) {
								item.selected = true
							} else if (item.selected !== true) {
								item.selected = false
							}
						})
					})
					modifierTreeVue.selectAllModifierItemsSelected = all
					modifierTreeVue.modifierItems = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					modifierTreeVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get a list of all modifiers for the current active location.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifiers () {
			this.modifiers = []
			var modifierTreeVue = this
			return ModifiersFunctions.getStoreModifiers(modifierTreeVue.$root.appId, modifierTreeVue.$root.appSecret, modifierTreeVue.$root.activeLocation.id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					modifierTreeVue.modifiers = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					modifierTreeVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeMenuModifierTreeModal')
		},
		/**
		 * To get a list of all menus for the current active location.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getMenus () {
			this.menus = []
			var menuTreeVue = this
			return MenusFunctions.getStoreMenus(menuTreeVue.$root.appId, menuTreeVue.$root.appSecret, menuTreeVue.$root.activeLocation.id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					menuTreeVue.menus = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					menuTreeVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get a list of all categories for the current active menu.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCategoriesForActiveMenu () {
			var menuTreeVue = this
			menuTreeVue.categories = []
			return CategoriesFunctions.getMenuCategories(menuTreeVue.activeMenu.id, menuTreeVue.$root.appId, menuTreeVue.$root.appSecret, menuTreeVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					menuTreeVue.categories = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					menuTreeVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get a list of all item for the current active category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemsForActiveCategory () {
			var menuTreeVue = this
			menuTreeVue.items = []
			return ItemsFunctions.getCategoryItemsFull(menuTreeVue.activeCategory.id, menuTreeVue.$root.appId, menuTreeVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					let all = true
					response.payload.forEach(item => {
						if (!menuTreeVue.selectedSKUs.includes(item.sku)) {
							all = false
						}
						menuTreeVue.selectedSKUs.forEach(previous => {
							if (item.sku === previous) {
								item.selected = true
							} else if (item.selected !== true) {
								item.selected = false
							}
						})
					})
					menuTreeVue.selectAllMenuItemsSelected = all
					menuTreeVue.items = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					menuTreeVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To clear the categories array and also the active category.
		 * @function
		 * @returns {undefined}
		 */
		clearActiveCategory () {
			this.activeCategory = {}
			this.categories = []
		},
		/**
		 * To set the value of the variable 'activeMenu' as the selected menu object.
		 * @function
		 * @param {object} menu - The selected menu.
		 * @returns {undefined}
		 */
		selectMenu (menu) {
			this.activeMenu = menu
			this.isMenuSelected = true
			if (this.isCategorySelected) {
				this.isCategorySelected = false
			}
			this.clearActiveCategory()
			this.getCategoriesForActiveMenu()
		},
		/**
		 * To set the value of the variable 'activeCategory' as the selected category object.
		 * @function
		 * @param {object} category - The selected category.
		 * @returns {undefined}
		 */
		selectCategory (category) {
			this.activeCategory = category
			this.isCategorySelected = true
			this.getItemsForActiveCategory()
			this.selectAllMenuItemsSelected = false
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
		selectAllMenuItems () {
			var menuTreeVue = this
			for (var i = 0; i < menuTreeVue.items.length; i++) {
				var item = menuTreeVue.items[i]
				menuTreeVue.$set(item, 'selected', this.selectAllMenuItemsSelected)
				const index = this.selectedSKUs.indexOf(item.sku)
				if (index !== -1) {
					this.selectedSKUs.splice(index, 1)
				} else {
					this.selectedSKUs.push(item.sku)
				}
			}
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
		selectAllModifierItems () {
			var menuTreeVue = this
			for (var i = 0; i < menuTreeVue.modifierItems.length; i++) {
				var item = menuTreeVue.modifierItems[i]
				menuTreeVue.$set(item, 'selected', this.selectAllModifierItemsSelected)
				const index = this.selectedSKUs.indexOf(item.sku)
				if (index !== -1) {
					this.selectedSKUs.splice(index, 1)
				} else {
					this.selectedSKUs.push(item.sku)
				}
			}
			console.log('ran')
		},
		/**
		 * To determine which function to call based on the update type passed in by the parent as a prop.
		 * @function
		 * @returns {undefined}
		 */
		applySelectedItems () {
			var editRewardItemVue = this
			editRewardItemVue.clearError()
			editRewardItemVue.selectedObject.updated_by = editRewardItemVue.$root.createdBy
			editRewardItemVue.selectedObject.sku = editRewardItemVue.selectedSKUs
			editRewardItemVue.selectedObject.reward_item_id = editRewardItemVue.selectedObject.id

			RewardsFunctions.updateRewardItemDetails(editRewardItemVue.selectedObject, editRewardItemVue.$root.appId, editRewardItemVue.$root.appSecret, editRewardItemVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editRewardItemVue.$emit('closeMenuModifierTreeModalAndUpdate', {id: editRewardItemVue.selectedObject.id, selectedSKUs: editRewardItemVue.selectedSKUs})
					editRewardItemVue.showAlert()
				} else {
					editRewardItemVue.errorMessage = response.message
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editRewardItemVue.$router.push('/login/expired')
					return
				}
				editRewardItemVue.errorMessage = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Items successfully applied',
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		}
	},
	components: {
		Modal,
		Tab,
		Tabset
	}
}
</script>
<style scoped>
.height-mod {
	max-height: 500px;
    overflow: auto;
}
.dd-handle {
	cursor: pointer;
	overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    white-space: nowrap;
}
.dd-handle * {
	cursor: pointer;
}
.active {
	color: #2ea8e5;
    background: #fff;
}
.check {
	color: rgb(46, 168, 229);
	margin-right: 2px;
}

.checked {
	color: rgb(46, 168, 229);
}
.unchecked {
	color: rgb(51, 51, 51);
}
</style>

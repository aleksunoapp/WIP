<template>
	<modal :show="showMenuModifierTreeModal"
	       :width="900"
	       effect="fade"
	       @closeOnEscape="closeModal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Select Items
				<span v-if="selectedObject.name"> for {{ selectedObject.name }}</span>
			</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="portlet light bordered height-mod">
				<div class="portlet-body">
					<div class="col-md-12">
						<div class="alert alert-danger"
						     v-show="errorMessage.length"
						     ref="errorMessage">
							<button class="close"
							        @click="clearError('errorMessage')"></button>
							<span>{{errorMessage}}</span>
						</div>
						<div class="alert alert-danger"
						     v-show="internalErrorMessage.length"
						     ref="internalErrorMessage">
							<button class="close"
							        @click="clearError('internalErrorMessage')"></button>
							<span>{{internalErrorMessage}}</span>
						</div>
						<div class="alert alert-info center margin-top-20"
						     v-if="$root.activeLocation.id === undefined">
							<h4>No Store Selected</h4>
							<p>Please select a store from the stores panel on the right to view Menus and Modifiers.</p>
						</div>
					</div>
					<tabset :active="activeTab"
					        v-show="$root.activeLocation.id !== undefined">
						<tab header="Menu Items">
							<div class="col-md-4">
								<h4>Menus</h4>
								<div class="dd"
								     id="nestable_list_1"
								     v-if="menus.length">
									<ol class="dd-list">
										<li class="dd-item"
										    v-for="menu in menus"
										    :data-id="menu.id"
										    @click.stop.prevent="selectMenu(menu)"
										    :key="menu.id">
											<div class="dd-handle"
											     :class="{'active': menu.id === activeMenu.id}"> {{ menu.name }}
												<span class="pull-right">
													<i class="fa fa-chevron-right"></i>
												</span>
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
							<div class="col-md-4"
							     v-if="isMenuSelected">
								<h4>{{ activeMenu.name }} - Categories</h4>
								<div class="dd"
								     id="nestable_list_2"
								     v-if="categories.length">
									<ol class="dd-list">
										<li class="dd-item"
										    v-for="category in categories"
										    :data-id="category.id"
										    @click="selectCategory(category)"
											:key="category.id">
											<div class="dd-handle"
											     :class="{'active': category.id === activeCategory.id}"> {{ category.name }}
												<span class="pull-right">
													<i class="fa fa-chevron-right"></i>
												</span>
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
							<div class="col-md-4"
							     v-if="isCategorySelected">
								<h4>
									<i class="fa check clickable"
									   @click="selectAllMenuItems()"
									   :class="{'fa-check-square checked': selectAllMenuItemsSelected, 'fa-square-o unchecked': !selectAllMenuItemsSelected}"
									   aria-hidden="true"></i>
									{{ activeCategory.name }} - Items</h4>
								<div class="dd"
								     id="nestable_list_3"
								     v-if="items.length">
									<ol class="dd-list">
										<li class="dd-item"
										    v-for="item in items"
										    :data-id="item.id"
											:key="item.id">
											<div class="dd-handle"
											     @click.stop="toggleSKUSelected(item)">
												<span class="pull-left">
													<i class="fa check"
													   :class="{'fa-check-square checked': item.selected, 'fa-square-o unchecked': !item.selected}"
													   aria-hidden="true"></i>
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
						<tab header="Modifier Items"
						     v-if="showModifierItems">
							<div class="col-md-6">
								<h4>Modifier Categories</h4>
								<div class="dd"
								     id="nestable_list_1"
								     v-if="modifiers.length">
									<ol class="dd-list">
										<li class="dd-item"
										    v-for="modifier in modifiers"
										    :data-id="modifier.id"
										    @click="selectModifier(modifier, $event)"
											:key="modifier.id">
											<div class="dd-handle"
											     :class="{'active': modifier.id === activeModifier.id}"> {{ modifier.name }}
												<span class="pull-right">
													<i class="fa fa-chevron-right"></i>
												</span>
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
							<div class="col-md-6"
							     v-if="isModifierCategorySelected">
								<h4>
									<i class="fa check clickable"
									   @click="selectAllModifierItems()"
									   :class="{'fa-check-square checked': selectAllModifierItemsSelected, 'fa-square-o unchecked': !selectAllMenuItemsSelected}"
									   aria-hidden="true"></i>
									{{ activeModifier.name }} - Items</h4>
								<div class="dd"
								     id="nestable_list_3"
								     v-if="modifierItems.length">
									<ol class="dd-list">
										<li class="dd-item"
										    v-for="item in modifierItems"
										    :data-id="item.id"
											:key="item.id">
											<div class="dd-handle">
												<span class="pull-left"
												      @click.prevent="toggleSKUSelected(item)">
													<i class="fa check"
													   :class="{'fa-check-square checked': item.selected, 'fa-square-o unchecked': !item.selected}"
													   aria-hidden="true"></i>
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
		<div slot="modal-footer"
		     class="modal-footer">
			<button type="button"
			        class="btn btn-primary"
			        @click="applySelectedItems()"
			        v-show="$root.activeLocation.id !== undefined">Save</button>
			<button type="button"
			        class="btn btn-default"
			        @click="closeModal()"
			        v-show="$root.activeLocation.id === undefined">Close</button>
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
import ajaxErrorHandler from '../../controllers/ErrorController'

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
			isCategorySelected: false,
			activeMenu: {},
			activeCategory: {},
			isModifierCategorySelected: false,
			activeModifier: {},
			activeTab: 0,
			selectedSKUs: [],
			internalErrorMessage: '',
			menuAll: false,
			modifierAll: false
		}
	},
	props: {
		selectedObject: {
			type: Object,
			default: () => ({ skuArray: [] })
		},
		errorMessage: {
			type: String,
			default: () => ''
		},
		showModifierItems: {
			type: Boolean,
			default: () => true
		}
	},
	computed: {
		selectAllMenuItemsSelected () {
			if (this.items.length) {
				return !this.items.some(item => !item.selected)
			}
			return false
		},
		selectAllModifierItemsSelected () {
			if (this.modifierItems.length) {
				return !this.modifierItems.some(item => !item.selected)
			}
			return false
		}
	},
	created () {
		this.getMenus()
		this.getModifiers()
	},
	mounted () {
		this.showMenuModifierTreeModal = true
		if (this.selectedObject.skuArray) {
			this.selectedObject.skuArray.forEach(sku => this.selectedSKUs.push(sku))
		}
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
			return ModifiersFunctions.getModifierCategoryItems(
				modifierTreeVue.activeModifier.id,
				modifierTreeVue.$root.appId,
				modifierTreeVue.$root.appSecret
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						response.payload.forEach(item => {
							modifierTreeVue.selectedSKUs.forEach(previous => {
								if (item.sku === previous) {
									item.selected = true
								} else if (item.selected !== true) {
									item.selected = false
								}
							})
						})
						modifierTreeVue.modifierItems = response.payload
						modifierTreeVue.modifierAll = Boolean(
							modifierTreeVue.selectAllModifierItemsSelected
						)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch modifier items',
						errorName: 'internalErrorMessage',
						vue: modifierTreeVue
					})
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
			return ModifiersFunctions.getStoreModifiers(
				modifierTreeVue.$root.activeLocation.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						modifierTreeVue.modifiers = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch modifier categories',
						errorName: 'internalErrorMessage',
						vue: modifierTreeVue
					})
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
			return MenusFunctions.getStoreMenus(
				menuTreeVue.$root.appId,
				menuTreeVue.$root.appSecret,
				menuTreeVue.$root.activeLocation.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						menuTreeVue.menus = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch menus',
						errorName: 'internalErrorMessage',
						vue: menuTreeVue
					})
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
			return CategoriesFunctions.getMenuCategories(
				menuTreeVue.activeMenu.id,
				menuTreeVue.$root.appId,
				menuTreeVue.$root.appSecret,
				menuTreeVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						menuTreeVue.categories = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch menu categories',
						errorName: 'internalErrorMessage',
						vue: menuTreeVue
					})
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
			return ItemsFunctions.getCategoryItemsFull(
				menuTreeVue.activeCategory.id,
				menuTreeVue.$root.appId,
				menuTreeVue.$root.appSecret
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						response.payload.forEach(item => {
							menuTreeVue.selectedSKUs.forEach(previous => {
								if (item.sku === previous) {
									item.selected = true
								} else if (item.selected !== true) {
									item.selected = false
								}
							})
						})
						menuTreeVue.items = response.payload
						menuTreeVue.menuAll = Boolean(
							menuTreeVue.selectAllMenuItemsSelected
						)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch menu items',
						errorName: 'internalErrorMessage',
						vue: menuTreeVue
					})
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
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
		selectAllMenuItems () {
			this.menuAll = !this.menuAll
			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i]
				this.$set(item, 'selected', this.menuAll)
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
			this.modifierAll = !this.modifierAll
			for (var i = 0; i < this.modifierItems.length; i++) {
				var item = this.modifierItems[i]
				this.$set(item, 'selected', this.modifierAll)
				const index = this.selectedSKUs.indexOf(item.sku)
				if (index !== -1) {
					this.selectedSKUs.splice(index, 1)
				} else {
					this.selectedSKUs.push(item.sku)
				}
			}
		},
		/**
		 * To determine which function to call based on the update type passed in by the parent as a prop.
		 * @function
		 * @returns {undefined}
		 */
		applySelectedItems () {
			this.$emit('closeMenuModifierTreeModalAndUpdate', {
				selectedSKUs: this.selectedSKUs
			})
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {string} errorName - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (errorName) {
			this[errorName] = ''
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
</style>

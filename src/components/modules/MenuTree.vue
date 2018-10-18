<template>
	<modal :show="showMenuTreeModal"
	       :width="900"
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
			<h4 v-if="updateType !== 'sku'"
			    class="modal-title center">Apply
				<i>{{ headerText }}</i> To Multiple Items</h4>
			<h4 v-else
			    class="modal-title center">{{ headerText }}</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="portlet light bordered height-mod">
				<div v-if="updateType !== 'sku' && selectedObject.name"
				     class="portlet-title">
					<div class="caption">
						<i class="fa fa-cog font-default"></i>
						<span class="caption-subject font-default sbold uppercase">{{ selectedObject.name }}</span>
					</div>
				</div>
				<div class="portlet-body">
					<div class="row"
					     v-show="errorMessage"
					     ref="errorMessage">
						<div class="col-md-12">
							<div class="alert alert-danger">
								<button class="close"
								        @click="clearError()"></button>
								<span>{{errorMessage}}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-4">
							<h4>Menus</h4>
							<div class="dd"
							     id="nestable_list_1"
							     v-if="menus.length">
								<ol class="dd-list">
									<li class="dd-item"
									    v-for="menu in menus"
									    :data-id="menu.id"
									    @click="selectMenu(menu)"
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
							<h4><input type="checkbox"
								       @change="selectAll()"
								       class="md-check"
								       v-model="selectAllSelected"> {{ activeCategory.name }} - Items</h4>
							<div class="dd"
							     id="nestable_list_3"
							     v-if="items.length">
								<ol class="dd-list">
									<li class="dd-item"
									    v-for="item in items"
									    :data-id="item.id"
										:key="item.id">
										<div class="dd-handle">
											<span class="pull-left">
												<input type="checkbox"
												       :id="'item_checkbox_' + item.id"
												       class="md-check"
												       v-model="item.selected">&emsp;
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
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button type="button"
			        class="btn btn-primary"
			        @click="applySelectedItems()">Save</button>
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
import TagsFunctions from '../../controllers/Tags'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showMenuTreeModal: false,
			menus: [],
			categories: [],
			items: [],
			isMenuSelected: false,
			selectAllSelected: false,
			isCategorySelected: false,
			activeMenu: {},
			activeCategory: {}
		}
	},
	props: {
		headerText: {
			type: String
		},
		selectedObject: {
			type: Object,
			default: () => {
				return {}
			}
		},
		updateType: {
			type: String
		},
		showCorporateMenus: {
			type: Boolean,
			default: false
		},
		selectedSKUs: {
			type: Array,
			default: () => {
				return []
			}
		},
		errorMessage: {
			type: String,
			default: ''
		}
	},
	created () {
		if (this.showCorporateMenus) {
			this.getCorporateMenus()
		} else {
			this.getMenus()
		}
	},
	mounted () {
		this.showMenuTreeModal = true
	},
	methods: {
		/**
		 * To close the modal.
		 * @function
		 * @param {object} payload - payload property of the server response
		 * @returns {undefined}
		 */
		closeModal (payload) {
			this.$emit('closeMenuTreeModal', payload)
		},
		/**
		 * To notify parent error should be cleared.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.$emit('clearError')
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
						errorName: 'errorMessage',
						vue: menuTreeVue,
						containerRef: 'modal'
					})
				})
		},
		/**
		 * To get a list of all menus for the corporate location.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCorporateMenus () {
			this.menus = []
			var menuTreeVue = this
			return MenusFunctions.getStoreMenus(
				menuTreeVue.$root.appId,
				menuTreeVue.$root.appSecret,
				menuTreeVue.$root.corporateStoreId
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
						errorName: 'errorMessage',
						vue: menuTreeVue,
						containerRef: 'modal'
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
						errorText: 'We could not fetch categories',
						errorName: 'errorMessage',
						vue: menuTreeVue,
						containerRef: 'modal'
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
						menuTreeVue.items = response.payload

						if (menuTreeVue.updateType === 'modifier') {
							for (var i = 0; i < menuTreeVue.items.length; i++) {
								if (menuTreeVue.items[i].modifiers.length) {
									for (
										var j = 0;
										j < menuTreeVue.items[i].modifiers.length;
										j++
									) {
										var modItem = menuTreeVue.items[i]
										if (
											modItem.modifiers[j].id === menuTreeVue.selectedObject.id
										) {
											menuTreeVue.$set(modItem, 'selected', true)
											break
										} else {
											menuTreeVue.$set(modItem, 'selected', false)
										}
									}
								}
							}
						} else if (menuTreeVue.updateType === 'tag') {
							for (var x = 0; x < menuTreeVue.items.length; x++) {
								if (menuTreeVue.items[x].tags.length) {
									for (var y = 0; y < menuTreeVue.items[x].tags.length; y++) {
										var tagItem = menuTreeVue.items[x]
										if (tagItem.tags[y].id === menuTreeVue.selectedObject.id) {
											menuTreeVue.$set(tagItem, 'selected', true)
											break
										} else {
											menuTreeVue.$set(tagItem, 'selected', false)
										}
									}
								}
							}
						} else if (menuTreeVue.updateType === 'sku') {
							for (var p = 0; p < menuTreeVue.items.length; p++) {
								if (menuTreeVue.selectedSKUs.length) {
									for (var q = 0; q < menuTreeVue.selectedSKUs.length; q++) {
										var skuItem = menuTreeVue.items[p]
										if (skuItem.sku === menuTreeVue.selectedSKUs[q]) {
											menuTreeVue.$set(skuItem, 'selected', true)
											break
										} else {
											menuTreeVue.$set(skuItem, 'selected', false)
										}
									}
								}
							}
						} else if (menuTreeVue.updateType === 'attribute') {
							for (let r = 0; r < menuTreeVue.items.length; r++) {
								if (menuTreeVue.selectedSKUs.length) {
									for (let s = 0; s < menuTreeVue.selectedSKUs.length; s++) {
										let item = menuTreeVue.items[r]
										if (item.id === menuTreeVue.selectedSKUs[s]) {
											menuTreeVue.$set(item, 'selected', true)
											break
										} else {
											menuTreeVue.$set(item, 'selected', false)
										}
									}
								}
							}
						}
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch items',
						errorName: 'errorMessage',
						vue: menuTreeVue,
						containerRef: 'modal'
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
			this.selectAllSelected = false
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
		selectAll () {
			var menuTreeVue = this
			for (var i = 0; i < menuTreeVue.items.length; i++) {
				var item = menuTreeVue.items[i]
				menuTreeVue.$set(item, 'selected', this.selectAllSelected)
			}
		},
		/**
		 * To apply the selected modifier to all the checked off menu items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyModifierToSelectedItems () {
			var menuTreeVue = this
			var selectedItems = []
			var unselectedItems = []
			for (var i = 0; i < menuTreeVue.items.length; i++) {
				if (menuTreeVue.items[i].selected) {
					selectedItems.push(menuTreeVue.items[i].id)
				} else {
					unselectedItems.push(menuTreeVue.items[i].id)
				}
			}
			ModifiersFunctions.applyModifierToMultipleItems(
				menuTreeVue.selectedObject.id,
				selectedItems,
				unselectedItems,
				menuTreeVue.$root.appId,
				menuTreeVue.$root.appSecret,
				menuTreeVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						menuTreeVue.closeModal(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not apply the modifier',
						errorName: 'errorMessage',
						vue: menuTreeVue,
						containerRef: 'modal'
					})
				})
		},
		/**
		 * To apply the selected tag to all the checked off menu items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyTagToSelectedItems () {
			var menuTreeVue = this
			var selectedItems = []
			var unselectedItems = []
			for (var i = 0; i < menuTreeVue.items.length; i++) {
				if (menuTreeVue.items[i].selected) {
					selectedItems.push(menuTreeVue.items[i].id)
				} else {
					unselectedItems.push(menuTreeVue.items[i].id)
				}
			}
			TagsFunctions.applyTagToMultipleItems(
				menuTreeVue.selectedObject.id,
				selectedItems,
				unselectedItems,
				menuTreeVue.$root.appId,
				menuTreeVue.$root.appSecret,
				menuTreeVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						menuTreeVue.closeModal()
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not apply the tag',
						errorName: 'errorMessage',
						vue: menuTreeVue,
						containerRef: 'modal'
					})
				})
		},
		applyItemSKUToRewardItem () {
			var menuTreeVue = this
			var selectedItems = []
			for (var i = 0; i < menuTreeVue.items.length; i++) {
				if (menuTreeVue.items[i].selected) {
					selectedItems.push(menuTreeVue.items[i].sku)
				}
			}
			this.$emit('updateSKUs', selectedItems)
		},
		selectItemsForPromoCode () {
			var selectedItems = []
			var unselectedItems = []
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].selected) {
					selectedItems.push(this.items[i].sku)
				} else {
					unselectedItems.push(this.items[i].sku)
				}
			}
			this.$emit('closeMenuTreeModal', { selectedItems, unselectedItems })
		},
		selectItemsForAttributes () {
			var selectedItems = []
			var unselectedItems = []
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].selected) {
					selectedItems.push(this.items[i].id)
				} else {
					unselectedItems.push(this.items[i].id)
				}
			}
			this.$emit('selectedItems', { selectedItems, unselectedItems })
		},
		/**
		 * To determine which function to call based on the update type passed in by the parent as a prop.
		 * @function
		 * @returns {undefined}
		 */
		applySelectedItems () {
			if (this.updateType === 'modifier') {
				this.applyModifierToSelectedItems()
			} else if (this.updateType === 'tag') {
				this.applyTagToSelectedItems()
			} else if (this.updateType === 'sku') {
				this.applyItemSKUToRewardItem()
			} else if (this.updateType === 'promocode') {
				this.selectItemsForPromoCode()
			} else if (this.updateType === 'attribute') {
				this.selectItemsForAttributes()
			}
		}
	},
	components: {
		Modal
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
</style>

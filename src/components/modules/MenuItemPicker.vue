<template>
	<div class="row">
		<div class="col-xs-12">
			<div class="alert alert-danger"
			     v-show="errorMessage.length"
			     ref="errorMessage">
				<button class="close"
				        @click="clearError('errorMessage')"></button>
				<span>{{errorMessage}}</span>
			</div>
		</div>
		<div class="col-xs-4">
			<h4>Menus</h4>
		</div>
		<div class="col-xs-4">
			<div class="header">
				<i class="fa check"
				   :class="{
						'transparent': !menuSelectable(activeMenu),
						'fa-check-square checked': allCategoriesSelected, 
						'fa-square-o unchecked': !allCategoriesSelected
					}"
				   aria-hidden="true"
				   @click="toggleAllCategories()">
				</i>
				<h4 class="inline-block">
					Categories
				</h4>
			</div>
		</div>
		<div class="col-xs-4">
			<div class="header">
				<i class="fa check"
				   :class="{
						'transparent' : !activeItems.length,
						'fa-check-square checked': allItemsSelected, 
						'fa-square-o unchecked': !allItemsSelected
					}"
				   aria-hidden="true"
				   @click="toggleAllItems">
				</i>
				<h4 class="inline-block">
					Items
				</h4>
			</div>
		</div>
		<div class="col-xs-4">
			<div class="dd">
				<ol class="dd-list">
					<li class="dd-item"
					    v-for="menu in menus"
					    :key="menu.id">
						<div @click="toggleMenu(menu)"
						     class="dd-handle pointer"
						     :class="{'active': menu.id === activeMenu.id}">
							<span class="pull-left">
								<i class="fa check"
								   :class="{
										'transparent' : !menuSelectable(menu),
										'fa-check-square checked': menuSelected(menu), 
										'fa-minus-square checked': menuPartiallySelected(menu),
										'fa-square-o unchecked': !menuSelected(menu)
									}"
								   aria-hidden="true"
								   @click.stop="toggleAllInMenu(menu)">
								</i>
								{{ menu.name }}
							</span>
							<span class="pull-right transparent"
							      :class="{'permanent' : menu.id === activeMenu.id}">
								<i class="fa fa-chevron-right"></i>
							</span>
						</div>
					</li>
				</ol>
			</div>
		</div>
		<div class="col-xs-4">
			<div class="dd"
			     id="nestable_list_2">
				<ol class="dd-list">
					<li class="dd-item"
					    v-for="category in activeMenu.categories"
					    :data-id="category.id"
					    :key="category.id">
						<div class="dd-handle pointer"
						     :class="{'active': category.id === activeCategory.id}"
						     @click="toggleCategory(category)">
							<span class="pull-left">
								<i class="fa check"
								   :class="{
										'transparent' : !categorySelectable(category),
										'fa-check-square checked': categorySelected(category), 
										'fa-minus-square checked': categoryPartiallySelected(category),
										'fa-square-o unchecked': !categorySelected(category)
									}"
								   aria-hidden="true"
								   @click.stop="toggleAllInCategory(category)">
								</i>
								{{ category.name }}
							</span>
							<span class="pull-right transparent"
							      :class="{'permanent' : category.id === activeCategory.id}">
								<i class="fa fa-chevron-right"></i>
							</span>
						</div>
					</li>
				</ol>
			</div>
		</div>
		<div class="col-xs-4"
		     v-show="activeCategory.id !== undefined">
			<div class="dd"
			     id="nestable_list_3">
				<ol class="dd-list">
					<li class="dd-item"
					    v-for="item in activeItems"
					    :key="item.id"
					    @click="toggleItem(item)">
						<div class="dd-handle pointer">
							<span class="pull-left">
								<i class="fa check"
								   :class="{
										'fa-check-square checked': item.selected, 
										'fa-square-o unchecked': !item.selected
									}"
								   aria-hidden="true">
								</i>
								{{ item.name }}
								<span v-show="item.category_name">({{item.category_name}})</span>
							</span>
						</div>
					</li>
					<p class="no-items"
					   v-show="!activeItems.length">
						This category is empty
					</p>
				</ol>
			</div>
		</div>
	</div>
</template>

<script>
import MenusFunctions from '@/controllers/Menus'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'menu-item-picker',
	props: {
		/**
		 * @property {array} previouslySelected - An array of SKU strings of previously selected items
		 */
		previouslySelected: {
			type: Array,
			default: () => [],
			required: false
		}
	},
	data: () => ({
		previous: [],
		errorMessage: '',
		menus: [],
		activeMenu: {
			categories: [],
			items: []
		},
		activeCategory: {}
	}),
	computed: {
		activeItems () {
			if (this.activeMenu.items) {
				return this.activeMenu.items.filter(item => {
					return item.category.id === this.activeCategory.id
				})
			} else {
				return []
			}
		},
		allCategoriesSelected () {
			if (this.activeMenu.categories) {
				return (
					this.activeMenu.items.length &&
					!this.activeMenu.items.some(item => !item.selected)
				)
			} else {
				return false
			}
		},
		allItemsSelected () {
			return (
				this.activeItems.length &&
				!this.activeItems.some(item => !item.selected)
			)
		}
	},
	watch: {
		'$root.activeLocation': function () {
			this.getMenus()
		}
	},
	created () {
		this.previous = [...this.previouslySelected]
		if (this.$root.activeLocation.id !== undefined) {
			this.getMenus()
		}
	},
	methods: {
		/**
		 * To change selection an item
		 * @function
		 * @param {object} item - The item to toggle
		 * @returns {undefined}
		 */
		toggleItem (item) {
			item.selected = !item.selected
			this.update()
		},
		/**
		 * To toggle selection of all items
		 * @function
		 * @returns {undefined}
		 */
		toggleAllItems () {
			const selected = this.allItemsSelected
			this.activeItems.forEach(item => {
				item.selected = !selected
			})
			this.update()
		},
		/**
		 * To change the active category
		 * @function
		 * @param {object} category - Selected category
		 * @returns {undefined}
		 */
		toggleCategory (category) {
			this.activeCategory = category
			this.update()
		},
		/**
		 * To toggle selection of all categories
		 * @function
		 * @returns {undefined}
		 */
		toggleAllCategories () {
			const selected = this.allCategoriesSelected
			this.activeMenu.items.forEach(item => {
				item.selected = !selected
			})
			this.update()
		},
		/**
		 * To select a menu and fetch its items
		 * @function
		 * @param {object} menu - The selected menu.
		 * @returns {undefined}
		 */
		toggleMenu (menu) {
			this.activeCategory = {}
			this.activeMenu = menu
			if (menu.items === undefined) {
				return new Promise((resolve, reject) => {
					this.getAllItemsInMenu().then(() => resolve())
				})
			}
		},
		/**
		 * To change selection of all items in a menu
		 * @function
		 * @param {object} menu - The menu of items to toggle
		 * @returns {undefined}
		 */
		toggleAllInMenu (menu) {
			const selected = this.menuSelected(menu)
			if (menu.items) {
				menu.items.forEach(item => {
					item.selected = !selected
				})
				this.update()
			} else {
				this.toggleMenu(menu).then(() => {
					this.activeMenu.items.forEach(item => {
						item.selected = !selected
					})
					this.update()
				})
			}
		},
		/**
		 * To change selection of all items in a category
		 * @function
		 * @param {object} category - The category of items to toggle
		 * @returns {undefined}
		 */
		toggleAllInCategory (category) {
			const selected = this.categorySelected(category)
			let menu = this.menus.filter(menu => menu.id === category.menu_id)[0]
			let items = menu.items.filter(item => {
				return item.category.id === category.id
			})
			items.forEach(item => {
				item.selected = !selected
			})
			if (this.activeCategory.id !== category.id) {
				this.toggleCategory(category)
			}
			this.update()
		},
		/**
		 * To clear an error variable
		 * @function
		 * @param {string} name - Name of the variable to clear
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To get a list of all menus for the current active location
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getMenus () {
			this.menus = []
			var pickerVue = this
			return MenusFunctions.getStoreMenus(
				pickerVue.$root.appId,
				pickerVue.$root.appSecret,
				pickerVue.$root.activeLocation.id,
				{
					all_type: 1
				}
			)
				.then(response => {
					pickerVue.menus = response.payload.map(menu => {
						return {
							...menu,
							selected: false,
							indeterminate: false
						}
					})
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not get menus',
						errorName: 'errorMessage',
						vue: pickerVue
					})
				})
		},
		/**
		 * To get a list of all items for a menu.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllItemsInMenu () {
			var pickerVue = this
			return MenusFunctions.getAllItemsInMenu(pickerVue.activeMenu.id)
				.then(response => {
					let menu = pickerVue.menus.filter(
						menu => menu.id === pickerVue.activeMenu.id
					)[0]
					let items = response.payload.map(item => {
						return {
							...item,
							selected: pickerVue.previous.includes(item.sku)
						}
					})
					let categories = []
					response.payload.forEach(item => {
						if (
							categories.findIndex(
								included => item.category.id === included.id
							) === -1
						) {
							categories.push({
								...item.category,
								selected: false
							})
						}
					})
					pickerVue.$set(menu, 'items', items)
					pickerVue.$set(menu, 'categories', categories)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not get menu items',
						errorName: 'errorMessage',
						vue: pickerVue
					})
				})
		},
		/**
		 * To determine if a menu contains items to select
		 * @function
		 * @param {object} menu - The menu to check
		 * @returns {boolean} True if it contains items, false if not
		 */
		menuSelectable (menu) {
			if (!menu.items) {
				return false
			} else {
				return menu.items.length !== 0
			}
		},
		/**
		 * To determine if a category contains items to select
		 * @function
		 * @param {object} category - The category to check
		 * @returns {boolean} True if it contains items, false if not
		 */
		categorySelectable (category) {
			let menu = this.menus.filter(menu => menu.id === category.menu_id)[0]
			return menu.items.length !== 0
		},
		/**
		 * To determine if a menu is selected
		 * @function
		 * @param {object} menu - The menu to check
		 * @returns {boolean} True if it's selected, false if not
		 */
		menuSelected (menu) {
			if (menu.items) {
				return !menu.items.some(item => !item.selected)
			} else {
				return false
			}
		},
		/**
		 * To determine if a menu is partially selected (indeterminate)
		 * @function
		 * @param {object} menu - The menu to check
		 * @returns {boolean} True if it's partially selected, false if not
		 */
		menuPartiallySelected (menu) {
			if (menu.items) {
				let itemsLength = menu.items.length
				let selectedItems = menu.items.filter(item => item.selected)
				let selectedItemsLength = selectedItems.length
				return selectedItemsLength !== 0 && selectedItemsLength !== itemsLength
			} else {
				return false
			}
		},
		/**
		 * To determine if a category is selected
		 * @function
		 * @param {object} category - The category to check
		 * @returns {boolean} True if it's selected, false if not
		 */
		categorySelected (category) {
			let menu = this.menus.filter(menu => menu.id === category.menu_id)[0]
			let items = menu.items.filter(item => {
				return item.category.id === category.id
			})
			return items.length && !items.some(item => !item.selected)
		},
		/**
		 * To determine if a category is partially selected (indeterminate)
		 * @function
		 * @param {object} category - The category to check
		 * @returns {boolean} True if it's partially selected, false if not
		 */
		categoryPartiallySelected (category) {
			let menu = this.menus.filter(menu => menu.id === category.menu_id)[0]
			let items = menu.items.filter(item => {
				return item.category.id === category.id
			})
			let itemsLength = items.length
			let selectedItems = items.filter(item => item.selected)
			let selectedItemsLength = selectedItems.length
			return selectedItemsLength !== 0 && selectedItemsLength !== itemsLength
		},
		/**
		 * To notify the parent item selection has changed
		 * @function
		 * @returns {undefined}
		 */
		update () {
			let selected = []
			let menusWithItems = this.menus.filter(menu => menu.items !== undefined)
			menusWithItems.forEach(menu => {
				let selectedMenuItems = menu.items.filter(item => item.selected)
				selected = selected.concat(selectedMenuItems)
			})
			this.$emit('update', selected)
		}
	}
}
</script>
<style scoped>
.pointer {
  cursor: default;
}
.active,
i {
  color: #2ea8e5;
}
.transparent {
  transition: opacity 0.3s;
  opacity: 0;
}
.dd-item:hover .pull-right {
  opacity: 1;
}
.permanent {
  opacity: 1;
}
.header {
  padding-left: 13px;
}
.no-items {
  margin: 0;
  padding-left: 20px;
  height: 30px;
  display: flex;
  align-items: center;
  color: #ccc;
}
</style>

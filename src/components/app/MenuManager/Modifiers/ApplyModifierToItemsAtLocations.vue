<template>
	<modal :show="showComponent"
	       :width="900"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="applyModal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Apply Modifier</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="row"
			     v-show="errorMessage"
			     ref="errorMessage">
				<div class="col-md-12">
					<div class="alert alert-danger">
						<button class="close"
						        @click="clearError('errorMessage')"></button>
						<span>{{errorMessage}}</span>
					</div>
				</div>
			</div>
			<div class="row"
			     v-show="itemSelection">
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
			<div class="row"
			     v-show="locationSelection">
				<div class="col-xs-12">
					<select-locations-popup @selectedLocations="updateLocations"
					                        :withButton="false">
					</select-locations-popup>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button v-show="itemSelection"
			        type="button"
			        class="btn btn-primary"
			        @click="showLocationSelection()">
				Next
			</button>
			<button v-show="locationSelection"
			        type="button"
			        class="btn btn-outline"
			        @click="showItemSelection()">
				Back
			</button>
			<button v-show="locationSelection"
			        type="button"
			        class="btn btn-primary"
			        @click="applyModifierToItemsAtLocations()"
			        :disabled="saving">
				Save
				<i v-show="saving"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '@/components/modules/Modal'
import MenusFunctions from '@/controllers/Menus'
import CategoriesFunctions from '@/controllers/Categories'
import ItemsFunctions from '@/controllers/Items'
import ModifiersFunctions from '@/controllers/Modifiers'
import SelectLocationsPopup from '@/components/modules/SelectLocationsPopup'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'apply-modifier-to-items-at-locations',
	data () {
		return {
			saving: false,
			errorMessage: '',
			showComponent: false,
			itemSelection: true,
			locationSelection: false,
			menus: [],
			categories: [],
			items: [],
			isMenuSelected: false,
			selectAllSelected: false,
			isCategorySelected: false,
			activeMenu: {},
			activeCategory: {},
			selectedLocations: [],
			showApplyToLocationsModal: false,
			modifierToApplyToLocations: {}
		}
	},
	props: {
		modifier: {
			type: Object,
			required: true
		}
	},
	created () {
		if (this.$root.activeLocation.is_corporate) {
			this.getCorporateMenus()
		} else {
			this.getMenus()
		}
	},
	mounted () {
		this.showComponent = true
	},
	methods: {
		/**
		 * To display the location selecor
		 * @function
		 * @returns {undefined}
		 */
		showLocationSelection () {
			if (this.items.some(item => item.selected)) {
				this.itemSelection = false
				this.locationSelection = true
			} else {
				this.errorMessage = 'Select at least one item to apply the Modifier to'
			}
		},
		/**
		 * To display the item selecor
		 * @function
		 * @returns {undefined}
		 */
		showItemSelection () {
			this.locationSelection = false
			this.itemSelection = true
		},
		/**
		 * To update the locations selected in the child component
		 * @function
		 * @param {array} locations - Arrray of store ids
		 * @returns {undefined}
		 */
		updateLocations (locations) {
			this.selectedLocations = locations
		},
		/**
		 * To clear an error
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
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
						containerRef: 'applyModal'
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
						containerRef: 'applyModal'
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
						containerRef: 'applyModal'
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
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch items',
						errorName: 'errorMessage',
						vue: menuTreeVue,
						containerRef: 'applyModal'
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
		applyModifierToItemsAtLocations () {
			if (!this.selectedLocations.length) {
				this.errorMessage = 'Select at least one store'
				return
			}

			this.saving = true
			var menuTreeVue = this
			let payload = {
				modifier_id: this.modifier.id,
				item_sku: this.items
					.filter(item => item.selected)
					.map(item => item.sku),
				locations: this.selectedLocations
			}
			ModifiersFunctions.applyModifierToItemsAtLocations(
				payload,
				menuTreeVue.$root.appId,
				menuTreeVue.$root.appSecret,
				menuTreeVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						menuTreeVue.closeModal()
						menuTreeVue.emitSuccess()
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could apply the modifier',
						errorName: 'errorMessage',
						vue: menuTreeVue,
						containerRef: 'applyModal'
					})
				})
				.finally(() => {
					menuTreeVue.saving = false
				})
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeApplyModifierToItemsAtLocations')
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		emitSuccess () {
			this.$emit('applyModifierToItemsAtLocationsSuccess')
		}
	},
	components: {
		Modal,
		SelectLocationsPopup
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

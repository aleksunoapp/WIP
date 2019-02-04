<template>
  <modal
    :show="showMenuModifierTreeModal"
    :width="900"
    effect="fade"
    @closeOnEscape="closeModal"
  >
    <div
      slot="modal-header"
      class="modal-header center"
    >
      <button
        type="button"
        class="close"
        @click="closeModal()"
      >
        <span>&times;</span>
      </button>
      <h4 class="modal-title center">
        Select Items
        <span v-if="selectedObject.name">
          for {{ selectedObject.name }}
        </span>
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <div class="portlet light bordered height-mod">
        <div class="portlet-body">
          <div class="col-md-12">
            <div
              v-show="errorMessage.length"
              ref="errorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                @click="clearError('errorMessage')"
              />
              <span>{{ errorMessage }}</span>
            </div>
            <div
              v-show="internalErrorMessage.length"
              ref="internalErrorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                @click="clearError('internalErrorMessage')"
              />
              <span>{{ internalErrorMessage }}</span>
            </div>
            <div
              v-if="$root.activeLocation.id === undefined"
              class="alert alert-info center margin-top-20"
            >
              <h4>No Store Selected</h4>
              <p>Please select a store from the stores panel on the right to view Menus and Modifiers.</p>
            </div>
          </div>
          <tabset
            v-show="$root.activeLocation.id !== undefined"
            :active="activeTab"
          >
            <tab header="Menu Items">
              <div class="col-xs-12">
                <menu-item-picker
                  :previously-selected="selectedObject.sku_array"
                  @update="itemsSelected"
                />
              </div>
            </tab>
            <tab
              v-if="showModifierItems"
              header="Modifier Items"
            >
              <div class="col-md-6">
                <h4>Modifier Categories</h4>
                <div v-if="loadingModifiers">
                  <div class="alert alert-info">
                    <span>Loading ...</span>
                  </div>
                </div>
                <div
                  v-else-if="modifiers.length"
                  id="nestable_list_1"
                  class="dd"
                >
                  <ol class="dd-list">
                    <li
                      v-for="modifier in modifiers"
                      :key="modifier.id"
                      class="dd-item"
                      :data-id="modifier.id"
                      @click="selectModifier(modifier, $event)"
                    >
                      <div
                        class="dd-handle"
                        :class="{'active': modifier.id === activeModifier.id}"
                      >
                        {{ modifier.name }}
                        <span class="pull-right">
                          <i class="fa fa-chevron-right" />
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
              <div
                v-if="isModifierCategorySelected"
                class="col-md-6"
              >
                <h4>
                  <i
                    class="fa check clickable"
                    :class="{'fa-check-square checked': selectAllModifierItemsSelected, 'fa-square-o unchecked': !selectAllModifierItemsSelected}"
                    aria-hidden="true"
                    @click="selectAllModifierItems()"
                  />
                  {{ activeModifier.name }} - Items
                </h4>
                <div v-if="loadingModifierItems">
                  <div class="alert alert-info">
                    <span>Loading ...</span>
                  </div>
                </div>
                <div
                  v-else-if="modifierItems.length"
                  id="nestable_list_3"
                  class="dd"
                >
                  <ol class="dd-list">
                    <li
                      v-for="item in modifierItems"
                      :key="item.id"
                      class="dd-item"
                      :data-id="item.id"
                    >
                      <div class="dd-handle">
                        <span
                          class="pull-left"
                          @click.prevent="toggleSKUSelected(item)"
                        >
                          <i
                            class="fa check"
                            :class="{'fa-check-square checked': item.selected, 'fa-square-o unchecked': !item.selected}"
                            aria-hidden="true"
                          />
                          <label :for="'item_checkbox_' + item.id">
                            {{ item.name }}
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
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-show="$root.activeLocation.id !== undefined"
        type="button"
        class="btn btn-primary"
        @click="applySelectedItems()"
      >
        Save
      </button>
      <button
        v-show="$root.activeLocation.id === undefined"
        type="button"
        class="btn btn-default"
        @click="closeModal()"
      >
        Close
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from './Modal'
import ModifiersFunctions from '../../controllers/Modifiers'
import Tab from '../modules/Tab'
import Tabset from '../modules/Tabset'
import ajaxErrorHandler from '../../controllers/ErrorController'
import MenuItemPicker from '@/components/modules/MenuItemPicker'

export default {
	components: {
		Modal,
		Tab,
		Tabset,
		MenuItemPicker
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
	data () {
		return {
			showMenuModifierTreeModal: false,
			modifiers: [],
			modifierItems: [],
			isModifierCategorySelected: false,
			activeModifier: {},
			activeTab: 0,
			selectedSKUs: [],
			selectedItems: [],
			internalErrorMessage: '',
			menuAll: false,
			modifierAll: false,
			loadingMenus: false,
			loadingMenuCategories: false,
			loadingMenuItems: false,
			loadingModifiers: false,
			loadingModifierItems: false
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
		 * To update selection of items
		 * @function
		 * @param {array} items - Array of selected items
		 * @returns {undefined}
		 */
		itemsSelected (items) {
			this.selectedItems = items.map(item => item.sku)
		},
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
			this.loadingModifierItems = true
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
				.finally(() => {
					modifierTreeVue.loadingModifierItems = false
				})
		},
		/**
		 * To get a list of all modifiers for the current active location.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifiers () {
			this.loadingModifiers = true
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
				.finally(() => {
					modifierTreeVue.loadingModifiers = false
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
				selectedSKUs:
				[
					...this.selectedSKUs,
					...this.selectedItems
				]
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

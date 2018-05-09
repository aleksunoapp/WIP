<template>
	<modal :show="showModifierTreeModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Apply {{ headerText }} To Multiple Modifier Items</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="portlet light bordered height-mod">
				<div class="portlet-title">
					<div class="caption">
                        <i class="fa fa-cog font-green"></i>
                        <span class="caption-subject font-green sbold uppercase">{{ selectedObject.name }}</span>
                    </div>
				</div>
				<div class="portlet-body">
					<div class="row">
						<div class="col-md-6">
							<h4>Modifier Categories</h4>
							<div class="dd" id="nestable_list_1" v-if="modifiers.length">
                                <ol class="dd-list">
                                    <li class="dd-item" v-for="modifier in modifiers" :data-id="modifier.id" @click="selectModifier(modifier)">
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
							<h4>{{ activeModifier.name }} - Items</h4>
							<div class="dd" id="nestable_list_3" v-if="items.length">
                                <ol class="dd-list">
                                    <li class="dd-item" v-for="item in items" :data-id="item.id">
                                        <div class="dd-handle">
                                        	<span class="pull-left"><input type="checkbox" :id="'item_checkbox_' + item.id" class="md-check" v-model="item.selected">&emsp;</span>
                                        	{{ item.name }}
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
					</div>
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
import ModifiersFunctions from '../../controllers/Modifiers'
import PortionsFunctions from '../../controllers/Portions'
import TagsFunctions from '../../controllers/Tags'
import OptionsFunctions from '../../controllers/Options'

export default {
	data () {
		return {
			showModifierTreeModal: false,
			modifiers: [],
			items: [],
			isModifierCategorySelected: false,
			activeModifier: {}
		}
	},
	props: {
		headerText: {
			type: String
		},
		selectedObject: {
			type: Object
		},
		updateType: {
			type: String
		}
	},
	created () {
		this.getModifiers()
	},
	mounted () {
		this.showModifierTreeModal = true
	},
	methods: {
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeModifierTreeModal')
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
		 * To get a list of all item for the current active modifier category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemsForActiveModifier () {
			var modifierTreeVue = this
			modifierTreeVue.items = []
			return ModifiersFunctions.getModifierCategoryItems(modifierTreeVue.activeModifier.id, modifierTreeVue.$root.appId, modifierTreeVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					modifierTreeVue.items = response.payload

					if (modifierTreeVue.updateType === 'portion') {
						for (var i = 0; i < modifierTreeVue.items.length; i++) {
							if (modifierTreeVue.items[i].modifier_item_portions.length) {
								for (var j = 0; j < modifierTreeVue.items[i].modifier_item_portions.length; j++) {
									var portionItem = modifierTreeVue.items[i]
									if (portionItem.modifier_item_portions[j].id === modifierTreeVue.selectedObject.id) {
										modifierTreeVue.$set(portionItem, 'selected', true)
										break
									} else {
										modifierTreeVue.$set(portionItem, 'selected', false)
									}
								}
							}
						}
					} else if (modifierTreeVue.updateType === 'tag') {
						for (var x = 0; x < modifierTreeVue.items.length; x++) {
							if (modifierTreeVue.items[x].tags.length) {
								for (var y = 0; y < modifierTreeVue.items[x].tags.length; y++) {
									var tagItem = modifierTreeVue.items[x]
									if (tagItem.tags[y].id === modifierTreeVue.selectedObject.id) {
										modifierTreeVue.$set(tagItem, 'selected', true)
										break
									} else {
										modifierTreeVue.$set(tagItem, 'selected', false)
									}
								}
							}
						}
					}
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
		 * To clear the items array.
		 * @function
		 * @returns {undefined}
		 */
		clearItems () {
			this.items = []
		},
		/**
		 * To set the value of the variable 'activeModifier' as the selected modifier object.
		 * @function
		 * @param {object} modifier - The selected modifier.
		 * @returns {undefined}
		 */
		selectModifier (modifier) {
			this.activeModifier = modifier
			this.isModifierCategorySelected = true
			this.clearItems()
			this.getItemsForActiveModifier()
		},
		/**
		 * To apply the selected portion to all the checked off modifier items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyPortionToSelectedItems () {
			var modifierTreeVue = this
			var selectedModifierItems = []
			var unselectedModifierItems = []
			for (var i = 0; i < modifierTreeVue.items.length; i++) {
				if (modifierTreeVue.items[i].selected) {
					selectedModifierItems.push(modifierTreeVue.items[i].id)
				} else {
					unselectedModifierItems.push(modifierTreeVue.items[i].id)
				}
			}
			PortionsFunctions.applyPortionToMultipleModItems(modifierTreeVue.selectedObject.id, selectedModifierItems, unselectedModifierItems, modifierTreeVue.$root.appId, modifierTreeVue.$root.appSecret, modifierTreeVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					modifierTreeVue.closeModal()
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
		 * To apply the selected tag to all the checked off modifier items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyTagToSelectedItems () {
			var modifierTreeVue = this
			var selectedModifierItems = []
			var unselectedModifierItems = []
			for (var i = 0; i < modifierTreeVue.items.length; i++) {
				if (modifierTreeVue.items[i].selected) {
					selectedModifierItems.push(modifierTreeVue.items[i].id)
				} else {
					unselectedModifierItems.push(modifierTreeVue.items[i].id)
				}
			}
			TagsFunctions.applyTagToMultipleModItems(modifierTreeVue.selectedObject.id, selectedModifierItems, unselectedModifierItems, modifierTreeVue.$root.appId, modifierTreeVue.$root.appSecret, modifierTreeVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					modifierTreeVue.closeModal()
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
		 * To apply the selected option to all the checked off modifier items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyOptionToSelectedItems () {
			var modifierTreeVue = this
			var selectedModifierItems = []
			var unselectedModifierItems = []
			for (var i = 0; i < modifierTreeVue.items.length; i++) {
				if (modifierTreeVue.items[i].selected) {
					selectedModifierItems.push(modifierTreeVue.items[i].id)
				} else {
					unselectedModifierItems.push(modifierTreeVue.items[i].id)
				}
			}
			var payload = {
				'modifier_items_to_add': selectedModifierItems,
				'modifier_items_to_remove': unselectedModifierItems
			}
			OptionsFunctions.applyOptionToMultipleModItems(modifierTreeVue.selectedObject.id, payload, modifierTreeVue.$root.appId, modifierTreeVue.$root.appSecret, modifierTreeVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					modifierTreeVue.closeModal()
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
		 * To determine which function to call based on the update type passed in by the parent as a prop.
		 * @function
		 * @returns {undefined}
		 */
		applySelectedItems () {
			if (this.updateType === 'portion') {
				this.applyPortionToSelectedItems()
			} else if (this.updateType === 'tag') {
				this.applyTagToSelectedItems()
			} else if (this.updateType === 'option') {
				this.applyOptionToSelectedItems()
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
	max-height: 400px;
    overflow: auto;
}
.dd-handle {
	cursor: pointer;
	overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    white-space: nowrap;
}
.active {
	color: #2ea8e5;
    background: #fff;
}
</style>

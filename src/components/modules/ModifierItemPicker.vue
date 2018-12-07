<template>
	<div slot="modal-body"
			class="modal-body">
		<div v-if="$root.activeLocation.id === undefined">
			<div class="row">
				<div class="col-md-12">
					<div class="alert alert-info center margin-top-20"
						v-if="!$root.activeLocation.id">
						<h4>No Store Selected</h4>
						<p>Please select a store from the stores panel on the right to view Modifiers</p>
					</div>
				</div>
			</div>
		</div>
		<div 
			v-else
		>
			<div class="portlet-body">
				<div class="row">
					<div class="col-md-12">
						<div class="alert alert-danger"
								v-show="errorMessage"
								ref="errorMessage">
							<button class="close"
									@click="clearError('errorMessage')"></button>
							<span>{{errorMessage}}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6">
						<h4>Modifier Categories</h4>
						<div v-if="loadingModifiers && !modifiers.length">
							<div class="alert alert-info">
								<span>Loading...</span>
							</div>
						</div>
						<div class="dd"
								id="nestable_list_1"
								v-else-if="modifiers.length && !loadingModifiers">
							<ol class="dd-list">
								<li class="dd-item"
									v-for="modifier in modifiers"
									:data-id="modifier.id"
									@click="selectModifier(modifier)"
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
						<h4>{{ activeModifier.name }} - Items</h4>
						<div v-if="loadingModifierItems && activeModifier.items === null">
							<div class="alert alert-info">
								<span>Loading...</span>
							</div>
						</div>
						<div class="dd"
								id="nestable_list_3"
								v-else-if="activeModifier.items !== null && activeModifier.items.length">
							<ol class="dd-list">
								<li class="dd-item"
									v-for="item in activeModifier.items"
									:data-id="item.id"
									:key="item.id">
									<div class="dd-handle">
										<span class="pull-left"><input type="checkbox"
													:id="'item_checkbox_' + item.id"
													class="md-check"
													v-model="item.selected"
                                                    @change="itemsSelected(item)">&emsp;</span>
                                        <label :for="'item_checkbox_' + item.id">{{ item.name }}</label>
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
</template>

<script>
import ModifiersFunctions from '../../controllers/Modifiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
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
	data () {
		return {
			errorMessage: '',
			showModifierTreeModal: false,
			previous: [],
			loadingModifiers: false,
			modifiers: [],
			loadingModifierItems: false,
			items: [],
			isModifierCategorySelected: false,
			activeModifier: {
				items: []
			}
		}
	},
	computed: {
		selectedItems () {
			let allItems = []
			this.modifiers.forEach(modifier => {
				if (modifier.items !== null) {
					allItems = allItems.concat(modifier.items)
				}
			})
			return allItems.filter(item => item.selected)
		}
	},
	watch: {
		'$root.activeLocation': function () {
			this.getModifiers()
		}
	},
	created () {
		this.previous = [...this.previouslySelected]
		this.getModifiers()
	},
	mounted () {
		this.showModifierTreeModal = true
	},
	methods: {
		/**
		 * To clear an error.
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To close the modal.
		 * @function
		 * @param {object} item - The item toggled by the user
		 * @returns {undefined}
		 */
		itemsSelected (item) {
			if (!item.selected) {
				const previousIndex = this.previous.indexOf(item.sku)
				if (previousIndex !== -1) {
					this.previous.splice(previousIndex, 1)
				}
			}
			const selected = [
				...this.previous.map(sku => ({previous: true, sku, name: ''})),
				...this.selectedItems.filter(item => !this.previous.includes(item.sku))
			]
			this.$emit('update', selected)
		},
		/**
		 * To get a list of all modifiers for the current active location.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifiers () {
			if (this.$root.activeLocation.id === undefined) {
				this.errorMessage = 'Please select a store to view Modifiers.'
				return
			}
			this.loadingModifiers = true
			this.modifiers = []
			var modifierTreeVue = this
			return ModifiersFunctions.getStoreModifiers(
				modifierTreeVue.$root.activeLocation.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						modifierTreeVue.modifiers = response.payload.map(modifier => ({
							...modifier,
							items: null,
							selected: false,
							partiallySelected: false
						}))
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch modifiers',
						errorName: 'errorMessage',
						vue: modifierTreeVue,
						containerRef: 'modal'
					})
				})
				.finally(() => {
					modifierTreeVue.loadingModifiers = false
				})
		},
		/**
		 * To get a list of all item for the current active modifier category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemsForActiveModifier () {
			this.loadingModifierItems = true
			var modifierTreeVue = this
			modifierTreeVue.items = []
			return ModifiersFunctions.getModifierCategoryItems(
				modifierTreeVue.activeModifier.id,
				modifierTreeVue.$root.appId,
				modifierTreeVue.$root.appSecret
			)
				.then(response => {
					modifierTreeVue.activeModifier.items = response.payload.map(item => ({
						...item,
						selected: modifierTreeVue.previous.includes(item.sku)
					}))
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch items',
						errorName: 'errorMessage',
						vue: modifierTreeVue,
						containerRef: 'modal'
					})
				})
				.finally(() => {
					modifierTreeVue.loadingModifierItems = false
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
			if (this.activeModifier.items === null) {
				this.getItemsForActiveModifier()
			}
		}
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

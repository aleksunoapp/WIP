<template>
	<modal :show="showModal" effect="fade" @closeOnEscape="closeModal">

		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()" ref="closeModalButton">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Preset Settings</h4>
		</div>

		<div slot="modal-body" class="modal-body">

			<!-- ERROR START -->
			<div class="row" v-show="errorMessage.length">
				<div class="col-md-12" v-show="errorMessage" ref="errorMessage">
					<div class="alert alert-danger">
						<button class="close" data-close="alert" @click="clearError('errorMessage')"></button>
						<span>{{errorMessage}}</span>
					</div>
				</div>
			</div>
			<!-- ERROR END -->

			<div class="row" v-show="preset_item_modifier_item.length === 0">
				<div class="col-xs-12">
					<div class="alert alert-info">
						No preset settings yet. Add a Modifier to start.
					</div>
				</div>
			</div>

			<!-- SETTINGS START -->
			<div class="row">
				<div class="col-xs-12">
					<div class="settings__container">
						<div 
                            v-for="(modifier, index) in preset_item_modifier_item"
                            @click="setActive(modifier)"
                            class="preset-option"
                            :class="{'active' : modifier.modifier_id === activeSetting.modifier_id && modifier.modifier_item_id === activeSetting.modifier_item_id}"
                            :key="index"
                        >
							{{modifier.modifier_item_name}}
							<div class="counter-container">
								<div class="incrementer clickable">
									<i class="fa fa-minus" aria-hidden="true" @click="decrementAmount(modifier, index)"></i>
								</div>
								{{modifier.qty}}
								<div class="decrementer clickable">
									<i class="fa fa-plus clickable" aria-hidden="true" @click="incrementAmount(modifier, index)"></i>
								</div>
							</div>
							<div class="remove-modifier clickable" @click="removeModifierCategory(index)">
								<i class="fa fa-times-circle-o" aria-hidden="true"></i>
							</div>
							<ul class="list-unstyled margin-top-15 options-list">
								<li 
                                    v-for="(option, index) in modifier.preset_item_modifier_item_option_item"
                                    :key="index"
                                >
									{{option.option_item_name}} 
									<div class="pill-container">
										<i class="fa fa-times-circle-o clickable" aria-hidden="true" @click="removeOption(modifier, index)"></i>
									</div>
								</li>
								<li class="margin-top-10">
									<button type="button" class="btn btn-outline blue btn-xs" @click="displayOptionsSelection()">add Option</button>
								</li>
							</ul>						
						</div>
						<div class="preset-option add">
							<button type="button margin-top-20 margin-bottom-20" class="btn btn-outline blue btn-sm" @click="displayModifiersSelection()">Add Modifier</button>	
						</div>
					</div>
				</div>
			</div>
			<!-- SETTINGS END -->

			<hr v-show="showModifiersSelection || showOptionsSelection" />

			<!-- MODIFIERS START -->
			<div class="row" v-show="showModifiersSelection">
				<div class="col-md-6">
					<h5>Select Modifier Category</h5>
					<div class="dd">
						<ol class="dd-list">
							<li 
                                class="dd-item" 
                                v-for="modifierCategory in modifierCategories" 
                                @click="selectModifierCategory(modifierCategory)"
                                :key="modifierCategory.id"
                            >
								<div class="dd-handle" :class="{'active': modifierCategory.id === activeModifierCategory.id}"> {{ modifierCategory.name }}
									<span class="pull-right"><i class="fa fa-chevron-right"></i></span>
								</div>
							</li>
						</ol>
					</div>
					<div class="alert alert-warning" v-show="!modifierCategories && !loadingModifierCategories">
						There are no Modifier Categories. Create one <router-link :to="'/app/menu_manager/modifiers'">in Menu Manager.</router-link>
					</div>
				</div>
				<div class="col-md-6" v-show="activeModifierCategory.name">
					<h5>Select Modifier</h5>
					<div class="dd">
						<ol class="dd-list">
							<li 
                                class="dd-item" 
                                v-for="item in modifierItems" 
                                @click="selectModifierItem(item)"
                                :key="item.id"
                            >
								<div class="dd-handle" :class="{'inactive' : modifierInSettings(item)}">
									{{ item.name }}
								</div>
							</li>
						</ol>
					</div>
					<div class="alert alert-warning" v-show="!loadingModifierItems && !modifierItems.length">
						There are no Modifiers in {{ activeModifierCategory.name }}. Create one <router-link :to="`/app/menu_manager/modifier_items/${activeModifierCategory.id}`">in Menu Manager.</router-link>
					</div>
				</div>				
			</div>
			<!-- MODIFIERS END -->

			<!-- OPTIONS START -->
			<div class="row" v-show="showOptionsSelection">
				<div class="col-md-6">
					<h5>Select Option Category</h5>
					<div class="dd">
						<ol class="dd-list">
							<li 
                                class="dd-item" 
                                v-for="optionCategory in optionCategories" 
                                @click="selectOptionCategory(optionCategory)"
                                :key="optionCategory.id"
                            >
								<div class="dd-handle" :class="{'active': optionCategory.id === activeOptionCategory.id}"> {{ optionCategory.name }}
									<span class="pull-right"><i class="fa fa-chevron-right"></i></span>
								</div>
							</li>
						</ol>
					</div>
					<div class="alert alert-warning" v-show="!optionCategories && !loadingOptionsCategories">
						There are no Option Categories. Create one <router-link :to="'/app/menu_manager/options'">in Menu Manager.</router-link>
					</div>
				</div>
				<div class="col-md-6" v-show="activeOptionCategory.name">
					<h5>Select Option</h5>
					<div class="dd">
						<ol class="dd-list">
							<li 
                                class="dd-item" 
                                v-for="item in optionItems" 
                                @click="selectOptionItem(item)"
                                :key="item.id"
                            >
								<div class="dd-handle" :class="{'inactive' : optionInSetting(item)}">
									{{ item.name }}
								</div>
							</li>
						</ol>
					</div>
					<div class="alert alert-warning" v-show="!loadingOptionItems && !optionItems.length">
						There are no Options in {{ activeOptionCategory.name }}. Create one <router-link :to="`/app/menu_manager/options/${activeOptionCategory.id}/option_items`">in Menu Manager.</router-link>
					</div>
				</div>				
			</div>
			<!-- OPTIONS END -->

		</div>

		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" :disabled="!modifierCategories.length" @click="savePresetSettings()">Save</button>
		</div>

	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import ModifiersFunctions from '../../../../controllers/Modifiers'
import ItemsFunctions from '../../../../controllers/Items'
import OptionsFunctions from '../../../../controllers/Options'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showModal: false,
			errorMessage: '',
			preset_item_modifier_item: [
				{
					preset_item_modifier_item_option_item: []
				}
			],
			activeSetting: {
				modifier_id: null,
				modifier_item_id: null
			},
			loadingModifierCategories: false,
			modifierCategories: [],
			updateMode: false,
			showModifiersSelection: false,
			showOptionsSelection: false,
			activeModifierCategory: {
				id: null,
				name: ''
			},
			loadingModifierItems: false,
			modifierItems: [],
			loadingOptionsCategories: false,
			optionCategories: [],
			loadingOptionItems: false,
			optionItems: [],
			activeOptionCategory: {
				id: null,
				name: ''
			},
			loadingOptionItemsData: false
		}
	},
	props: {
		item: {
			type: Object,
			default: () => ({
				id: null,
				name: '',
				preset_item_modifier_item: []
			})
		}
	},
	created () {
		this.getModifierCategories()
		this.getOptionCategories()
	},
	mounted () {
		this.preset_item_modifier_item = [...this.item.preset_item_modifier_item]
		this.showModal = true

		// set focus to modal
		this.$nextTick(function () {
			this.$refs.closeModalButton.focus()
		})
	},
	methods: {
		/**
		 * To get the list of available options.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getOptionCategories () {
			this.loadingOptionsCategories = true
			var presetsVue = this
			presetsVue.optionCategories = []
			OptionsFunctions.getOptions(presetsVue.$root.appId, presetsVue.$root.appSecret, presetsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					presetsVue.loadingOptionsCategories = false
					presetsVue.optionCategories = response.payload
				} else {
					presetsVue.loadingOptionsCategories = false
				}
			}).catch(reason => {
				presetsVue.loadingOptionsCategories = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not get options',
					errorName: 'errorMessage',
					vue: presetsVue
				})
			})
		},
		/**
		 * To get a list of modifier categories.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifierCategories () {
			var presetsVue = this
			presetsVue.modifierCategories = []
			presetsVue.loadingModifierCategories = true
			ModifiersFunctions.getStoreModifiers(presetsVue.$root.appId, presetsVue.$root.appSecret, presetsVue.$root.activeLocation.id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					presetsVue.modifierCategories = response.payload
					presetsVue.loadingModifierCategories = false
				} else {
					presetsVue.errorMessage = response.payload.message || 'Couldn\'t load Modifier Categories'
					presetsVue.loadingModifierCategories = false
				}
			}).catch(reason => {
				presetsVue.loadingModifierCategories = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not get modifiers',
					errorName: 'errorMessage',
					vue: presetsVue
				})
			})
		},
		/**
		 * To close the modal without saving
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closePresetModal', null)
		},
		/**
		 * To clear the error message.
		 * @function
		 * @param {string} errorName - The name of the variable to clear
		 * @returns {undefined}
		 */
		clearError (errorName) {
			this[errorName] = ''
		},
		/**
		 * To set details of the setting being edited.
		 * @function
		 * @param {string} setting - The setting object
		 * @returns {undefined}
		 */
		setActive (setting) {
			this.activeSetting.modifier_id = setting.modifier_id
			this.activeSetting.modifier_item_id = setting.modifier_item_id
		},
		/**
		 * To increment the quantity of the modifier item.
		 * @function
		 * @param {object} modifier - The modifier item to increment the quantity of
		 * @param {integer} index - The index of the modifier in the preset_item_modifier_item array
		 * @returns {undefined}
		 */
		incrementAmount (modifier, index) {
			if (this.preset_item_modifier_item[index].qty < this.preset_item_modifier_item[index].modifier_item_max) {
				this.preset_item_modifier_item[index].qty++
			}
		},
		/**
		 * To decrement the quantity of the modifier item.
		 * @function
		 * @param {object} modifier - The modifier item to decrement the quantity of
		 * @param {integer} index - The index of the modifier in the preset_item_modifier_item array
		 * @returns {undefined}
		 */
		decrementAmount (modifier, index) {
			if (this.preset_item_modifier_item[index].qty > this.preset_item_modifier_item[index].modifier_item_min) {
				this.preset_item_modifier_item[index].qty--
			}
		},
		/**
		 * To decrement the quantity of the modifier item.
		 * @function
		 * @param {integer} index - The index of the modifier in the preset_item_modifier_item array
		 * @returns {undefined}
		 */
		removeModifierCategory (index) {
			this.preset_item_modifier_item.splice(index, 1)
		},
		/**
		 * To decrement the quantity of the modifier item.
		 * @function
		 * @param {object} modifier - The setting to remove the option from
		 * @param {integer} index - The index of the modifier in the preset_item_modifier_item_option_item
		 * @returns {undefined}
		 */
		removeOption (modifier, index) {
			modifier.preset_item_modifier_item_option_item.splice(index, 1)
		},
		/**
		 * To display modifier selection.
		 * @function
		 * @returns {undefined}
		 */
		displayModifiersSelection () {
			this.activeModifierCategory.id = null
			this.activeModifierCategory.name = ''
			this.showOptionsSelection = false
			this.showModifiersSelection = true
		},
		/**
		 * To select a modifier category
		 * @function
		 * @param {object} modifierCategory - The selected modifier category
		 * @returns {undefined}
		 */
		selectModifierCategory (modifierCategory) {
			this.activeModifierCategory.id = modifierCategory.id
			this.getModifierItems()
			this.activeModifierCategory.name = modifierCategory.name
		},
		/**
		 * To get a list of all item for the current active modifier category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModifierItems () {
			this.loadingModifierItems = true
			var presetsVue = this
			presetsVue.modifierItems = []
			return ModifiersFunctions.getModifierCategoryItems(presetsVue.activeModifierCategory.id, presetsVue.$root.appId, presetsVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					response.payload.forEach((item) => { item.selected = false })
					presetsVue.modifierItems = response.payload
					presetsVue.loadingModifierItems = false
				} else {
					presetsVue.loadingModifierItems = false
				}
			}).catch(reason => {
				presetsVue.loadingModifierItems = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not get modifiers',
					errorName: 'errorMessage',
					vue: presetsVue
				})
			})
		},
		/**
		 * To check if the modifier is already included in settings
		 * @function
		 * @param {object} item - The item to find
		 * @returns {undefined}
		 */
		modifierInSettings (item) {
			let included = this.preset_item_modifier_item.findIndex(
				function (element) {
					return element.modifier_item_id === item.id && element.modifier_id === item.modifier_id
				})
			return included !== -1
		},
		/**
		 * To select a modifier
		 * @function
		 * @param {object} item - The selected modifier item
		 * @returns {undefined}
		 */
		selectModifierItem (item) {
			if (!this.modifierInSettings(item)) {
				this.preset_item_modifier_item.push(
					{
						modifier_item_id: item.id,
						modifier_item_name: item.name,
						modifier_item_min: item.min,
						modifier_item_max: item.max,
						modifier_id: this.activeModifierCategory.id,
						qty: 1,
						preset_item_modifier_item_option_item: []
					}
				)
				this.hideModifiersSelection()
			}
		},
		/**
		 * To hide modifier selection.
		 * @function
		 * @returns {undefined}
		 */
		hideModifiersSelection () {
			this.showModifiersSelection = false
		},
		/**
		 * To display option selection.
		 * @function
		 * @returns {undefined}
		 */
		displayOptionsSelection () {
			this.showModifiersSelection = false
			this.showOptionsSelection = true
		},
		/**
		 * To select a option category
		 * @function
		 * @param {object} optionCategory - The selected option category
		 * @returns {undefined}
		 */
		selectOptionCategory (optionCategory) {
			this.activeOptionCategory.id = optionCategory.id
			this.getOptionItems()
			this.activeOptionCategory.name = optionCategory.name
		},
		/**
		 * To get a list of all items for the current active option category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getOptionItems () {
			this.loadingOptionItems = true
			var presetsVue = this
			presetsVue.optionItems = []
			OptionsFunctions.getOptionItems(presetsVue.activeOptionCategory.id, presetsVue.$root.appId, presetsVue.$root.appSecret, presetsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					presetsVue.loadingOptionItems = false
					presetsVue.optionItems = response.payload
				} else {
					presetsVue.loadingOptionItems = false
				}
			}).catch(reason => {
				presetsVue.loadingOptionItems = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not get options',
					errorName: 'errorMessage',
					vue: presetsVue
				})
			})
		},
		/**
		 * To check if the option is already included in the active setting
		 * @function
		 * @param {object} item - The item to find
		 * @returns {undefined}
		 */
		optionInSetting (item) {
			let included
			this.preset_item_modifier_item.forEach((modifier) => {
				if (modifier.modifier_item_id === this.activeSetting.modifier_item_id) {
					included = modifier.preset_item_modifier_item_option_item.findIndex(
						function (element) {
							return element.option_item_id === item.id && element.option_id === item.option_id
						})
				}
			})
			return included !== -1
		},
		/**
		 * To select an option
		 * @function
		 * @param {object} optionItem - The selected option item
		 * @returns {undefined}
		 */
		selectOptionItem (optionItem) {
			this.preset_item_modifier_item.forEach((modifier) => {
				if (modifier.modifier_item_id === this.activeSetting.modifier_item_id) {
					if (!this.optionInSetting(optionItem)) {
						modifier.preset_item_modifier_item_option_item.push({
							option_id: optionItem.option_id,
							option_item_id: optionItem.id,
							option_item_name: optionItem.name
						})
					}
				}
			})
			this.hideOptionsSelection()
		},
		/**
		 * To hide option selection.
		 * @function
		 * @returns {undefined}
		 */
		hideOptionsSelection () {
			this.showOptionsSelection = false
		},
		/**
		 * To call the API to update the preset settings
		 * @function
		 * @returns {object} A promise that will resolve or return an error
		 */
		savePresetSettings () {
			var presetsVue = this

			let payload = {modifier_items: []}
			presetsVue.preset_item_modifier_item.forEach((modifier) => {
				payload.modifier_items.push({
					'modifier_item_id': modifier.modifier_item_id,
					'modifier_id': modifier.modifier_id,
					'qty': modifier.qty,
					'option_items': modifier.preset_item_modifier_item_option_item.map(
						function (option) {
							return {
								option_item_id: option.option_item_id,
								option_id: option.option_id
							}
						}
					)
				})
			})

			ItemsFunctions.updatePresetItem(presetsVue.$root.appId, presetsVue.$root.appSecret, presetsVue.$root.userToken, presetsVue.item.id, payload)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					presetsVue.closeModalAndUpdate()
				} else {
					presetsVue.errorMessage = response.message
				}
			}).catch(reason => {
				presetsVue.loadingModifierItems = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not save preset settings',
					errorName: 'errorMessage',
					vue: presetsVue
				})
			})
		},
		/**
		 * To close the modal and emit settings
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('closeAndUpdate', this.preset_item_modifier_item)
		}
	},
	components: {
		Modal
	}
}
</script>

<style scoped>
.settings__container {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
}

.preset-option {
	border: 1px solid rgb(204, 204, 204);
	border-radius: 3px;
	padding: 10px;
	margin: 5px;
	position: relative;
	flex-basis: calc(50% - 10px);
}
.preset-option:hover {
	border: 1px solid #2ea8e5;
}
.preset-option.active {
	border: 1px solid #2ea8e5;
}
.preset-option.add {
	display: flex;
	justify-content: center;
	align-items: center;
}

.dd-handle {
	cursor: pointer;
}
.dd-handle.active {
	color: #2ea8e5;
}
.dd-handle.inactive {
	cursor: not-allowed;
	color: #333;
}

.fa {
	opacity: .2;
	transition: opacity .2s ease-in;
}

.pill-container {
	display: inline-block;
	padding: 3px;
}
.pill-container:hover .fa {
	opacity: 1;
}

.remove-modifier {
	position: absolute;
	top: 0;
	right: 0;
	padding: 3px;
}
.remove-modifier:hover .fa {
	opacity: 1;
}

.incrementer, .decrementer {
	display: inline-block;
	padding: 0 4px;
}
.incrementer:hover .fa, .decrementer:hover .fa {
	opacity: 1;
}

.options-list {
	margin-left: 20px;
}

.add-modifier {
	cursor: pointer;
	margin-top: 10px;
}
.add-modifier:hover {
	color: #2ea8e5;
}
</style>

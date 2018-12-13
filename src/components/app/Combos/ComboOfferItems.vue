<template>
	<div>
		<!-- PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>

		<!-- PAGE TITLE-->
		<h1 class="page-title">{{comboOffer.name}}</h1>
		<div class="note note-info">
			<p>Create, edit and delete items of this combo offer.</p>
		</div>

		<div class="portlet light portlet-fit bordered margin-top-20"
				id="comboOfferItems-container">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Items</span>
					<div class="caption-desc font-grey-cascade">This offer can have a maximum of {{comboOffer.number_of_items}} {{comboOffer.number_of_items !== 1 ? 'items' : 'item'}}.</div>
				</div>
			</div>
			<div class="portlet-body">
				<div class="alert alert-info text-center"
						v-show="infoMessage.length"
						ref="infoMessage">
					<span>{{ infoMessage }}</span>
				</div>
				<div class="alert alert-danger"
						v-show="errorMessage.length"
						ref="errorMessage">
					<button class="close"
							data-close="alert"
							@click="clearError('errorMessage')"></button>
					<span>{{ errorMessage }}</span>
				</div>

				<loading-screen 
					:show="loading"
					:color="'#2C3E50'"
					:display="'inline'"
				>
				</loading-screen>

				<!-- LIST -->
				<div 
					v-show="view === 'list'"
					class="width-100 display-flex flex-wrap-wrap justify-content-space-between pa-1em"
				>
					<div
						v-show="!loading"
						v-for="item in comboOffer.combo_item"
						@click="setActive(item)"
						:key="item.id" 
						class="position-relative display-flex flex-basis-48 flex-direction-column min-height-100 mb-1em card--shadow"
						:class="{'active' : item.id === activeComboOfferItem.id}"
					>
						<div class="width-100 display-flex flex-direction-column align-items-center mb-3em pa-1em card__body">
							<!-- SKU -->
							<div>
								<div
									v-for="sku in item.combo_item_sku"
									:key="sku.id"
									class="width-100 display-flex justify-content-space-between pt-1em px-1em"
								>
									<p class="my-0em">
										{{sku.sku}}
									</p>
									<transition
										name="quick-fade"
										mode="out-in"
									>
										<div
											v-if="SkuToDelete.id !== sku.id"
											key="initial"
										>
											<button
												class="btn blue btn-xs btn-outline ml-1em"
												@click="deleteSku(sku)"
												aria-label="delete"
											>
												<i
													class="fa fa-lg fa-trash"
													aria-hidden="true"
												>
												</i>
											</button>
										</div>
										<!-- SKU DELETE -->
										<div
											v-else
											class="display-flex align-items-center"
											key="delete"
										>
											<button
												@click="removeSku(sku)"
												:disabled="sku.deleting"
												aria-label="confirm"
												class="btn blue btn-xs btn-outline ml-1em"
											>
												Delete
												<i
													v-if="sku.deleting"
													class="fa fa-spinner fa-pulse fa-fw"
													aria-hidden="true"
												>
												</i>
											</button>
											<button
												@click="cancelSkuDelete()"
												:disabled="sku.deleting"
												aria-label="delete"
												class="btn blue btn-xs btn-outline ml-5px"
											>
												Cancel
											</button>
										</div>
									</transition>
								</div>
								<div class="width-100 display-flex justify-content-center pt-1em px-1em">
									<button
										class="btn blue btn-xs btn-outline"
										@click="addSkusToItem(item)"
									>
										<i
											class="fa fa-lg fa-plus"
											aria-hidden="true"
										>
										</i>
									</button>
								</div>
							</div>
						</div>

						<!-- CARD ACTIONS -->
						<div class="display-flex width-100 justify-content-flex-end align-items-center py-1em mb-5px card__actions">
							<transition
								name="quick-fade"
								mode="out-in"
							>
								<div
									v-if="item.view === 'initial'"
									key="initial"
								>
									<button
										class="btn blue btn-xs btn-outline"
										@click="confirmItemDelete(item)"
									>
										<i
											class="fa fa-lg fa-trash"
											aria-hidden="true"
										>
										</i>
									</button>
								</div>
								<!-- DELETE ITEM -->
								<div
									v-else-if="activeComboOfferItem.view === 'delete'"
									key="delete"
								>
									<button
										class="btn blue btn-sm btn-outline"
										@click="removeItem"
									>
										Delete
										<i
											v-if="item.deleting"
											class="fa fa-spinner fa-pulse fa-fw"
											aria-hidden="true"
										>
										</i>
									</button>
									<button
										class="btn blue btn-sm btn-outline"
										@click="cancelItemDelete"
										:disabled="item.deleting"
									>
										Cancel
									</button>
								</div>
							</transition>
						</div>
					</div>
					<div
						v-if="comboOffer.combo_item.length < comboOffer.number_of_items"
						key="add"
						class="display-flex flex-basis-48 justify-content-center align-items-center min-height-100px mb-1em pa-1em card--shadow"
					>
						<button
							class="btn blue btn-outline display-flex justify-content-center align-items-center"
							aria-label="add"
							@click="showAddView"
						>
							<i class="fa fa-lg fa-plus" aria-hidden="true"></i>
						</button>
					</div>
				</div>

				<!-- ADD ITEM -->
				<div
					v-if="view === 'add'"
					class="width-100 display-flex flex-direction-column"
				>
					<menu-and-modifier-item-picker
						:previouslySelected="currentSkus"
						:modifierDisabled="true"
						@update="itemsSelected"
					>
					</menu-and-modifier-item-picker>
					<div class="width-100 display-flex justify-content-space-between align-items-flex-end">
						<p class="my-0em text-muted">
							{{this.selected === null ? 
								`${this.currentSkus.length} selected` :
								`${this.selected.length} selected`
							}}
						</p>
						<div>
							<button
								class="btn blue btn-sm btn-outline"
								@click="showListView"
								:disabled="creating"
							>
								Cancel
							</button>
							<button
								class="btn blue btn-sm btn-outline"
								@click="saveSkus"
								:disabled="creating"
							>
								Save
								<i
									v-if="creating"
									class="fa fa-spinner fa-pulse fa-fw"
									aria-hidden="true"
								>
								</i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import MenuAndModifierItemPicker from '@/components/modules/MenuAndModifierItemPicker'
import ComboOffersFunctions from '@/controllers/Combos'
import Modal from '@/components/modules/Modal'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'ComboOfferItems',
	components: {
		Breadcrumb,
		LoadingScreen,
		Modal,
		MenuAndModifierItemPicker
	},
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Combos', link: '/app/combos/offers' },
				{ name: 'Combos Offer Items', link: false }
			],

			comboOffer: {},

			errorMessage: '',
			infoMessage: '',

			view: 'list',
			tab: 0,

			loading: false,

			activeComboOfferItem: {
				id: null,
				deleting: false,
				deleted: false
			},
			selected: null,

			SkuToDelete: {},

			deleting: false,
			creating: false
		}
	},
	computed: {
		currentSkus () {
			if (!this.activeComboOfferItem.combo_item_sku) {
				return []
			} else {
				return this.activeComboOfferItem.combo_item_sku.map(sku => sku.sku)
			}
		},
		...mapGetters({
			parentComboOffer: 'combos/comboOffer'
		})
	},
	watch: {
		'$root.activeLocation': function (location) {
			if (location.id !== undefined && this.infoMessage) {
				this.infoMessage = ''
			}
		}
	},
	created () {
		if (this.parentComboOffer.id === null) {
			this.$router.push({name: 'ComboOffers'})
		}

		this.copyComboOffer(this.parentComboOffer)
	},
	beforeDestroy () {
		this.clearComboOffer({})
	},
	methods: {
		/**
		 * To clear the current error.
		 * @function
		 * @param {object} errorMessageName - The error message to be cleared.
		 * @returns {undefined}
		 */
		clearError (errorMessageName) {
			this[errorMessageName] = ''
		},

		/**
		 * To append display properties to the API format.
		 * @function
		 * @param {object} comboOffer - The original offer object
		 * @returns {undefined}
		 */
		copyComboOffer (comboOffer) {
			this.comboOffer = {
				...comboOffer,
				combo_item: comboOffer.combo_item.map(item => ({
					...item,
					deleting: false,
					view: 'initial',
					combo_item_sku: item.combo_item_sku.map(sku => ({
						...sku,
						deleting: false
					}))
				}))
			}
		},

		/**
		 * To make an item active
		 * @function
		 * @param {object} item - The item to make active
		 * @returns {undefined}
		 */
		setActive (item) {
			this.activeComboOfferItem = item
		},

		/**
		 * To show the create view
		 * @function
		 * @returns {undefined}
		 */
		showAddView () {
			if (this.$root.activeLocation.id === undefined) {
				this.infoMessage = 'Please select a store to view Menu and Modifier Items'
				return
			}
			this.activeComboOfferItem = {
				id: null,
				deleting: false,
				deleted: false
			}
			this.view = 'add'
		},
		/**
		 * To show the list view
		 * @function
		 * @returns {undefined}
		 */
		showListView () {
			this.view = 'list'
		},

		/**
		 * To display the modal for deleting an comboOfferItem.
		 * @function
		 * @param {object} item - The selected comboOfferItem
		 * @returns {undefined}
		 */
		confirmItemDelete (item) {
			item.view = 'delete'
			this.activeComboOfferItem = item
		},
		/**
		 * To close the confirmation view.
		 * @function
		 * @returns {undefined}
		 */
		cancelItemDelete () {
			this.activeComboOfferItem.view = 'initial'
		},
		/**
		 * To remove an item from the database
		 * @function
		 * @returns {undefined}
		 */
		removeItem () {
			this.activeComboOfferItem.deleting = true
			const _this = this
			return ComboOffersFunctions.deleteComboOfferItem(_this.activeComboOfferItem.id)
				.then(response => {
					if (response.payload.pending_approval !== true) {
						const index = _this.comboOffer.combo_item.findIndex(item => item.id === _this.activeComboOfferItem.id)
						_this.comboOffer.combo_item.splice(index, 1)
					}
					_this.showRemoveItemSuccess(response.payload)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not create the comboOffer',
						errorName: 'errorMessage',
						vue: _this
					})
				})
				.finally(() => {
					_this.SkuToDelete.deleting = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @functionsku
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showRemoveItemSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Combo Offer Item has been removed'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The removal has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},

		/**
		 * To show delete confirmation view.
		 * @function
		 * @param {object} sku - The selected SKU
		 * @returns {undefined}
		 */
		deleteSku (sku) {
			if (this.SkuToDelete.id !== sku.id) {
				this.SkuToDelete = sku
			}
		},
		/**
		 * To close delete confirmation view.
		 * @function
		 * @returns {undefined}
		 */
		cancelSkuDelete () {
			this.SkuToDelete = {}
		},
		/**
		 * To remove the SKU from the database
		 * @function
		 * @returns {undefined}
		 */
		removeSku () {
			this.SkuToDelete.deleting = true
			const _this = this
			return ComboOffersFunctions.deleteSKUFromComboOfferItem(_this.SkuToDelete.id)
				.then(response => {
					if (response.payload.pending_approval !== true) {
						const parent = _this.comboOffer.combo_item.find(item => item.id === _this.SkuToDelete.combo_item_id)
						const index = parent.combo_item_sku.findIndex(sku => sku.id === _this.SkuToDelete.id)
						parent.combo_item_sku.splice(index, 1)
					}
					_this.showRemoveSkuSuccess(response.payload)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not create the comboOffer',
						errorName: 'errorMessage',
						vue: _this
					})
				})
				.finally(() => {
					_this.SkuToDelete.deleting = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showRemoveSkuSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The SKU has been removed'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The removal has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},

		/**
		 * To show view for adding Skus to an item
		 * @function
		 * @param {object} item - Item selected by user
		 * @returns {undefined}
		 */
		addSkusToItem (item) {
			if (this.$root.activeLocation.id === undefined) {
				this.infoMessage = 'Please select a store to view Menu and Modifier Items'
				return
			}
			this.activeComboOfferItem = item
			this.selected = [...this.currentSkus]
			this.view = 'add'
		},
		/**
		 * To save menu item selection
		 * @function
		 * @param {array} selected - An array of selected item Skus
		 * @returns {undefined}
		 */
		itemsSelected (selected) {
			console.log({selected})
			this.selected = selected
		},
		/**
		 * To create an item, if necessary, and save its Skus
		 * @function
		 * @returns {undefined}
		 */
		async saveSkus () {
			this.creating = true
			const _this = this
			if (this.activeComboOfferItem.id === null) {
				const response = await ComboOffersFunctions.createComboOfferItem(this.comboOffer.id)
				_this.comboOffer.combo_item.push({
					...response.payload,
					deleting: false,
					view: 'initial',
					combo_item_sku: []
				})
				_this.activeComboOfferItem = _this.comboOffer.combo_item[_this.comboOffer.combo_item.length - 1]
			}
			return ComboOffersFunctions.createComboOfferItemSKUs({
				combo_item_id: _this.activeComboOfferItem.id,
				sku: [...this.selected]
			})
				.then(response => {
					if (response.payload.pending_approval !== true) {
						_this.activeComboOfferItem.combo_item_sku = response.payload.combo_item_sku.map(sku => ({
							...sku,
							deleting: false
						}))
					}
					_this.view = 'list'
					_this.showAddSkusSuccess(response.payload)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch data',
						errorName: 'errorMessage',
						vue: _this
					})
				})
				.finally(() => {
					_this.creating = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAddSkusSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Item has been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The changes have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},

		/**
		 * To clear the combo offer before navigating away.
		 * @function
		 * @returns {undefined}
		 */
		...mapActions({
			clearComboOffer: 'combos/clearComboOffer'
		})
	}
}
</script>

<style scoped>
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover {
  background-color: white;
}
.card__actions {
	min-height: 2em;
	position: absolute;
	bottom: 0;
	left: 0;
}
.card--shadow {
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}
.card--shadow.active {
	box-shadow: 0 0 0 1px #409eff;
}
</style>

<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Reward Items</h1>
		<!-- END PAGE TITLE-->
		<div class="note note-info">
			<p>Manage items for a reward tier.</p>
		</div>
		<!-- BEGIN CREATE NEW -->
		<div class="portlet box blue-hoki"
		     v-if="$root.permissions['reward_tiers items create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreateItemPanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Reward Item
				</div>
				<div class="tools">
					<a :class="{'expand': !createItemCollapse, 'collapse': createItemCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body"
			     :class="{'display-hide': createItemCollapse}">
				<form role="form"
				      @submit.prevent="createNewRewardItem()">
					<div class="form-body row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="errorMessage.length"
							     ref="errorMessage">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError('errorMessage')"></button>
								<span>{{errorMessage}}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newRewardItem.name.length}"
								       id="form_control_1"
								       v-model="newRewardItem.name">
								<label for="form_control_1">Reward Item Name</label>
							</div>
							<div class="side-by-side-item">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       :class="{'edited': newRewardItem.value.length}"
									       id="form_control_2"
									       v-model="newRewardItem.value">
									<label for="form_control_2">Reward Item Value</label>
								</div>
							</div>
							<el-select class="side-by-side-item"
							           v-model="newRewardItem.value_type"
							           placeholder="Select type"
							           size="small">
								<el-option label="$"
								           value="dollar"></el-option>
								<el-option label="%"
								           value="percentage"></el-option>
							</el-select>
							<div class="side-by-side-item">
								from:
								<el-date-picker v-model="newRewardItem.start_on"
								                type="date"
								                format="yyyy-MM-dd"
								                value-format="yyyy-MM-dd"
								                :clearable="false"
								                placeholder="Select start date">
								</el-date-picker>
							</div>
							<div class="side-by-side-item">
								to:
								<el-date-picker v-model="newRewardItem.expiry"
								                type="date"
								                format="yyyy-MM-dd"
								                value-format="yyyy-MM-dd"
								                :clearable="false"
								                placeholder="Select end date">
								</el-date-picker>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       id="form_control_3"
								       :class="{'edited': newRewardItem.points.length}"
								       v-model="newRewardItem.points">
								<label for="form_control_3">Reward Item Points</label>
							</div>
							<button type="submit"
							        class="btn blue btn-outline inline"
							        @click.prevent="displayMenuModifierTreeModal(newRewardItem, $event)">Select Items</button>
							<p v-if="newRewardItem.sku.length"
							   class="margin-top-10 margin-left-10 inline">Selected
								<span>{{newRewardItem.sku.length}}</span>
								<span v-if="newRewardItem.sku.length > 1">items</span>
								<span v-else>item</span>
							</p>
						</div>
					</div>
					<div class="form-actions right">
						<button type="submit"
						        class="btn blue"
						        :disabled="creating">
							Create
							<i v-show="creating"
							   class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE NEW -->
		<div>
			<div class="portlet light portlet-fit bordered margin-top-20">
				<div class="portlet-title bg-blue-chambray">
					<div class="caption">
						<span class="caption-subject font-default bold uppercase">{{ $router.passedTier.name }}</span>
						<div class="caption-desc font-grey-cascade">Edit a reward item or select items to apply the reward to.</div>
					</div>
				</div>
				<div class="portlet-body relative-block">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="listErrorMessage"
							     ref="listErrorMessage">
								<button class="close"
								        @click="clearError('listErrorMessage')"></button>
								<span>{{listErrorMessage}}</span>
							</div>
						</div>
					</div>

					<loading-screen :show="loadingRewardItems"
					                :color="'#2C3E50'"
					                :display="'inline'"></loading-screen>

					<div class="mt-element-list margin-top-15"
					     v-if="rewardItems.length && !loadingRewardItems">
						<div class="mt-list-container list-news ext-1 no-border">
							<ul>
								<li class="mt-list-item actions-at-left margin-top-15"
								    v-for="item in rewardItems"
								    :id="'reward-' + item.id"
								    :key="item.id">
									<div class="list-item-actions">
										<el-tooltip v-if="$root.permissions['reward_tiers items update']"
										            content="Edit"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="showEditRewardItemModal(item)">
												<i class="fa fa-lg fa-pencil"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['reward_tiers items read'] && !$root.permissions['reward_tiers items update']"
										            content="View"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="showEditRewardItemModal(item)">
												<i class="fa fa-lg fa-eye"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['reward_tiers items update']"
										            content="Apply to items"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="checkForLocation(item, $event)">
												<i class="icon-layers"></i>
											</a>
										</el-tooltip>
									</div>
									<div style="min-height:95px">
										<div class="col-sm-12">
											<div class="bold uppercase font-red">
												<span>{{ item.name }}</span>
											</div>
										</div>
										<div class="col-sm-4">
											<div>
												<strong>Value:</strong>
												<span v-if="item.value_type === 'dollar'">$</span>
												<span>{{ item.value }}</span>
												<span v-if="item.value_type === 'percentage'">%</span>
											</div>
											<div>
												<strong>Points:</strong>
												<span>{{ item.points }}</span>
											</div>
										</div>
										<div class="col-sm-4">
											<div>
												<strong>Starts:</strong>
												<span>{{ item.start_on }}</span>
											</div>
										</div>
										<div class="col-sm-4">
											<div>
												<strong>Expires:</strong>
												<span>{{ item.expiry }}</span>
											</div>
										</div>
										<div class="col-sm-4">
											<div>
												<strong>Applied to:</strong>
												<span>{{ item.sku_array.length }}
													<span v-if="item.sku_array.length !== 1">items</span>
													<span v-else>item</span>
												</span>
											</div>
										</div>
									</div>

								</li>
							</ul>
						</div>
					</div>
					<div v-if="!rewardItems.length && !loadingRewardItems">
						<no-results :show="true"
						            :type="'reward items'"></no-results>
					</div>
				</div>
			</div>
		</div>
		<edit-reward-item v-if="displayEditRewardItemModal"
		                  :passedRewardItem="passedRewardItem"
		                  :passedRewardTierId="passedRewardTierId"
		                  @updateRewardItemDetails="updateRewardItemDetails"
		                  @closeRewardItemModal="closeRewardItemModal"></edit-reward-item>

		<menu-modifier-tree v-if="showMenuModifierTreeModal"
		                    :selectedObject="selectedItem"
		                    :headerText="headerText"
		                    updateType="combo"
		                    :errorMessage="menuModifierTreeErrorMessage"
		                    @closeMenuModifierTreeModal="closeMenuModifierTreeModal"
		                    @closeMenuModifierTreeModalAndUpdate="skusSelected">
		</menu-modifier-tree>

		<!-- DELETE MODAL START -->
		<modal :show="displayDeleteModal"
		       effect="fade"
		       @closeOnEscape="closeDeleteModal"
		       ref="deleteModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Reward Item</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<div class="row"
				     v-show="deleteErrorMessage"
				     ref="deleteErrorMessage">
					<div class="col-md-12">
						<div class="alert alert-danger">
							<button class="close"
							        @click.stop="clearDeleteError()"></button>
							<span>{{deleteErrorMessage}}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<p>Are you sure you want to delete {{itemToBeDeleted.name}}?</p>
					</div>
				</div>
			</div>
			<div slot="modal-footer"
			     class="modal-footer">
				<button type="submit"
				        class="btn blue"
				        @click.stop="deleteItem()"
				        :disabled="deleting">
					Delete
					<i v-show="deleting"
					   class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../modules/Breadcrumb'
import NoResults from '../modules/NoResults'
import MenuModifierTree from '../modules/MenuModifierTree'
import LoadingScreen from '../modules/LoadingScreen'
import Modal from '../modules/Modal'
import RewardFunctions from '../../controllers/Rewards'
import EditRewardItem from './Rewards/EditRewardItem'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Reward Tiers', link: '/app/loyalty/rewards' },
				{ name: 'Reward Items', link: false }
			],
			loadingRewardItems: false,
			listErrorMessage: '',
			rewardItems: [],
			errorMessage: '',
			displayEditRewardItemModal: false,
			passedRewardItem: 0,
			passedRewardTierId: this.$route.params.folder_id,
			createItemCollapse: true,
			creating: false,
			newRewardItem: {
				sku: [],
				points: '',
				loyalty_reward_id: this.$router.passedTier.loyalty_reward_id,
				name: '',
				value: '',
				expiry: '',
				start_on: '',
				value_type: '', // 'dollar','percentage'
				created_by: this.$root.createdBy
			},
			showMenuModifierTreeModal: false,
			headerText: '',
			showModifierTreeModal: false,
			selectedItem: {},
			displayDeleteModal: false,
			deleting: false,
			itemToBeDeleted: {
				reward_id: null,
				reward_item_id: null,
				name: ''
			},
			deleteErrorMessage: '',
			menuModifierTreeErrorMessage: ''
		}
	},
	mounted () {
		this.getRewardItems()
	},
	methods: {
		skusSelected (selection) {
			if (this.selectedItem.id === undefined) {
				this.newRewardItem.sku = selection.selectedSKUs
				this.closeMenuModifierTreeModal()
			} else {
				this.applySelectedItems(selection)
			}
		},
		/**
		 * To determine which function to call based on the update type passed in by the parent as a prop.
		 * @function
		 * @param {object} selection - An object containing the selected SKUs
		 * @returns {undefined}
		 */
		applySelectedItems (selection) {
			this.selectedItem.sku = selection.selectedSKUs
			let payload = {
				...this.selectedItem,
				reward_item_id: this.selectedItem.id
			}
			var rewardItemsVue = this

			RewardFunctions.updateRewardItemDetails(
				payload,
				rewardItemsVue.$root.appId,
				rewardItemsVue.$root.appSecret,
				rewardItemsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						rewardItemsVue.closeMenuModifierTreeModal()
						rewardItemsVue.getRewardItems()
						rewardItemsVue.showApplySuccess(response.payload)
					} else {
						rewardItemsVue.menuModifierTreeErrorMessage =
							response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not create the reward item',
						errorName: 'menuModifierTreeErrorMessage',
						vue: rewardItemsVue
					})
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showApplySuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Items have been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Items have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To close the menu tree modal.
		 * @function
		 * @returns {undefined}
		 */
		closeMenuModifierTreeModal () {
			this.selectedItem = {}
			this.menuModifierTreeErrorMessage = ''
			this.showMenuModifierTreeModal = false
		},
		/**
		 * To close the menu tree modal.
		 * @function
		 * @param {object} data - The data object containing item id and selected SKUs.
		 * @returns {undefined}
		 */
		closeMenuModifierTreeModalAndUpdate (data) {
			this.menuModifierTreeErrorMessage = ''
			this.showMenuModifierTreeModal = false
			this.selectedItem.sku = data.selectedSKUs
		},
		/**
		 * To get a list of reward items for the current tier.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getRewardItems () {
			this.loadingRewardItems = true
			this.rewardItems = []
			var rewardItemsVue = this

			RewardFunctions.getRewardItems(
				rewardItemsVue.$router.passedTier.id,
				rewardItemsVue.$root.appId,
				rewardItemsVue.$root.appSecret,
				rewardItemsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						rewardItemsVue.loadingRewardItems = false
						rewardItemsVue.rewardItems =
							response.payload.reward_item_all
					} else {
						rewardItemsVue.loadingRewardItems = false
					}
				})
				.catch(reason => {
					rewardItemsVue.loadingRewardItems = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch reward items',
						errorName: 'listErrorMessage',
						vue: rewardItemsVue
					})
				})
		},
		/**
		 * To show the modal for editing details of a reward item.
		 * @function
		 * @param {object} item - The selected reward item object.
		 * @returns {undefined}
		 */
		showEditRewardItemModal (item) {
			this.passedRewardItem = item
			this.displayEditRewardItemModal = true
		},
		/**
		 * To check if the reward item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateRewardItemData () {
			var rewardItemsVue = this
			return new Promise(function (resolve, reject) {
				if (!rewardItemsVue.newRewardItem.name.length) {
					reject('Name cannot be blank')
				} else if (!$.isNumeric(rewardItemsVue.newRewardItem.value)) {
					reject('Value should be a number')
				} else if (!$.isNumeric(rewardItemsVue.newRewardItem.points)) {
					reject('Points should be a number')
				} else if (!rewardItemsVue.newRewardItem.expiry.toString()) {
					reject('Expiry date connot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To add the new reward item to the current tier and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createNewRewardItem () {
			var rewardItemsVue = this
			rewardItemsVue.clearError('errorMessage')

			return rewardItemsVue
				.validateRewardItemData()
				.then(response => {
					rewardItemsVue.creating = true
					RewardFunctions.createNewRewardItem(
						rewardItemsVue.$router.passedTier.id,
						rewardItemsVue.newRewardItem,
						rewardItemsVue.$root.appId,
						rewardItemsVue.$root.appSecret,
						rewardItemsVue.$root.userToken
					)
						.then(response => {
							if (
								response.code === 200 &&
								response.status === 'ok'
							) {
								rewardItemsVue.newRewardItem.id =
									response.payload.id
								rewardItemsVue.newRewardItem.sku_array =
									response.payload.sku_array
								rewardItemsVue.addRewardItem(
									rewardItemsVue.newRewardItem
								)
								rewardItemsVue.showAlert(response.payload)
								rewardItemsVue.clearNewRewardForm()
							} else {
								rewardItemsVue.errorMessage = response.message
								rewardItemsVue.$scrollTo(
									rewardItemsVue.$refs.errorMessage,
									1000,
									{ offset: -50 }
								)
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText:
									'We could not create the reward item',
								errorName: 'errorMessage',
								vue: rewardItemsVue
							})
						})
						.finally(() => {
							rewardItemsVue.creating = false
						})
				})
				.catch(reason => {
					rewardItemsVue.errorMessage = reason
					rewardItemsVue.$scrollTo(
						rewardItemsVue.$refs.errorMessage,
						1000,
						{
							offset: -50
						}
					)
				})
		},
		/**
		 * To check if a location has been selected.
		 * @function
		 * @param {object} item - The item to assign to.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		checkForLocation (item, event) {
			event.preventDefault()
			if (this.$root.activeLocation && this.$root.activeLocation.id) {
				this.displayMenuModifierTreeModal(item, event)
			} else {
				this.showLocationAlert()
			}
		},
		/**
		 * To display a prompt to select a location.
		 * @function
		 * @returns {undefined}
		 */
		showLocationAlert () {
			this.$swal({
				title: 'No store',
				text:
					'Please select a store from the stores panel on the right before selecting items',
				type: 'warning'
			})
		},
		/**
		 * To show the menu-modifier tree modal to select items for reward SKUs.
		 * @function
		 * @param {object} item - The item to assign to.
		 * @param {object} event - The event that triggered this action.
		 * @returns {undefined}
		 */
		displayMenuModifierTreeModal (item, event) {
			event.stopPropagation()
			this.selectedItem = { ...item }
			this.headerText = 'Select Menu Items for Reward Items'
			this.showMenuModifierTreeModal = true
		},
		/**
		 * To clear the new reward item form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewRewardForm () {
			this.newRewardItem = {
				name: '',
				created_by: this.$root.createdBy,
				expiry: '',
				value: '',
				loyalty_reward_id: this.$router.passedTier.loyalty_reward_id,
				points: '',
				sku: []
			}
		},
		/**
		 * To add the reward item to the items list.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		addRewardItem (val) {
			this.rewardItems.push(val)
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAlert (payload = {}) {
			let title = 'Success'
			let text = 'The Reward Item has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Reward Item has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To update the image according to the emitted value.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		updateRewardItemDetails ({val, payload}) {
			this.getRewardItems()
			this.displayEditRewardItemModal = false
			this.showEditSuccess(payload)
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showEditSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Reward Item has been saved'
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
		 * To close the modal for editing the detils of an image.
		 * @function
		 * @returns {undefined}
		 */
		closeRewardItemModal () {
			this.displayEditRewardItemModal = false
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {string} errorName - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (errorName) {
			this[errorName] = ''
		},
		/**
		 * To toggle the create menu panel, initially set to opened
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateItemPanel () {
			this.createItemCollapse = !this.createItemCollapse
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearDeleteError () {
			this.deleteErrorMessage = ''
		},
		/**
		 * To show the modal for deleting a reward item.
		 * @function
		 * @param {object} item - The selected item object.
		 * @returns {undefined}
		 */
		showDeleteModal (item) {
			this.itemToBeDeleted.reward_item_id = item.id
			this.itemToBeDeleted.name = item.name
			this.itemToBeDeleted.reward_id = item.reward_id

			this.displayDeleteModal = true
		},
		/**
		 * To delete a reward item in the API.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteItem () {
			this.deleting = true
			var rewardsVue = this
			RewardFunctions.deleteRewardItem(
				rewardsVue.itemToBeDeleted,
				rewardsVue.$root.appId,
				rewardsVue.$root.appSecret,
				rewardsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						rewardsVue.getRewardItems()
						rewardsVue.closeDeleteModal()
						rewardsVue.confirmDelete(response.payload)
						rewardsVue.resetItemToBeDeleted()
					} else {
						rewardsVue.deleteErrorMessage = response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not delete the reward item',
						errorName: 'deleteErrorMessage',
						vue: rewardsVue,
						containerRef: 'deleteModal'
					})
				})
				.finally(() => {
					rewardsVue.deleting = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		confirmDelete (payload = {}) {
			let title = 'Success'
			let text = 'The Reward Item has been deleted'
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
		 * To clear the item delete form
		 * @function
		 * @returns {undefined}
		 */
		resetItemToBeDeleted () {
			this.itemToBeDeleted = {
				reward_id: null,
				reward_item_id: null,
				name: ''
			}
		},
		/**
		 * To close the modal for deleting an item.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.displayDeleteModal = false
		}
	},
	watch: {},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		EditRewardItem,
		MenuModifierTree,
		Modal
	}
}
</script>

<style scoped>
.grey-label {
	color: rgb(153, 153, 153);
}
.side-by-side-item {
	display: inline-block;
	width: 49%;
}
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover,
.mt-element-list .list-news.ext-2.mt-list-container ul > .mt-list-item:hover {
	background-color: white;
}
</style>

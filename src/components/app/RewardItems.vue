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
        <!-- BEGIN CREATE NEW MENU-->
        <div class="portlet box blue-hoki">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreateItemPanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Reward Item
				</div>
				<div class="tools">
					<a :class="{'expand': !createItemCollapse, 'collapse': createItemCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': createItemCollapse}">
      			<form role="form" @submit.prevent="createNewRewardItem()">
      				<div class="form-body row">
      					<div class="col-md-12">
			        		<div class="alert alert-danger" v-if="errorMessage.length">
			        		    <button class="close" data-close="alert" @click="clearError()"></button>
			        		    <span>{{errorMessage}}</span>
			        		</div>
			        	</div>
		        		<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" :class="{'edited': newRewardItem.name.length}" id="form_control_1" v-model="newRewardItem.name">
							    <label for="form_control_1">Reward Item Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" :class="{'edited': newRewardItem.value.length}" id="form_control_2" v-model="newRewardItem.value">
							    <label for="form_control_2">Reward Item Value</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
							    <label>Reward Item Expiry</label><br>
					    	    <el-date-picker 
					    	    	v-model="newRewardItem.expiry" 
					    	    	type="date" 
					    	    	format="yyyy-MM-dd" 
					    	    	value-format="yyyy-MM-dd" 
					    	    	:clearable="false" 
					    	    	placeholder="Pick an expiry date">
					        	</el-date-picker>
							</div>
		        		</div>
		        		<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" id="form_control_3" :class="{'edited': newRewardItem.points.length}" v-model="newRewardItem.points">
							    <label for="form_control_3">Reward Item Points</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" :class="{'edited': newRewardItem.spoonity_reward_id.length}" id="form_control_4" v-model="newRewardItem.spoonity_reward_id">
							    <label for="form_control_4">Reward Item Spoonity ID</label>
							</div>
		        		</div>
		        	</div>
      				<div class="form-actions right margin-top-20">
						<button type="submit" class="btn blue">Create</button>
					</div>
      			</form>
  			</div>
        </div>
        <!-- END CREATE NEW MENU-->
        <loading-screen :show="loadingRewardItems" :color="'#2C3E50'" :display="'inline'"></loading-screen>
        <div v-if="rewardItems.length && !loadingRewardItems">
		    <div class="portlet light portlet-fit bordered margin-top-20">
		        <div class="portlet-title bg-blue-chambray">
		            <div class="caption">
		                <span class="caption-subject font-green bold uppercase">{{ $router.passedTier.name }}</span>
		                <div class="caption-desc font-grey-cascade">Edit a reward item or select items to apply the reward to.</div>
		            </div>
		        </div>
		        <div class="portlet-body">
		            <div class="mt-element-list margin-top-15">
		                <div class="mt-list-container list-news ext-1 no-border">
		                    <ul>
		                        <li class="mt-list-item actions-at-left margin-top-15" v-for="item in rewardItems" :id="'reward-' + item.id">
		                        	<div class="list-item-actions">
		                        		<el-tooltip content="Edit" effect="light" placement="right">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="showEditRewardItemModal(item)">
		                                        <i class="fa fa-lg fa-pencil"></i>
		                                    </a>
		                        		</el-tooltip>
		                        		<el-tooltip content="Apply to multiple" effect="light" placement="right">
		                                    <a class="btn btn-circle btn-icon-only btn-default" @click="checkForLocation(item, $event)">
												<i class="icon-layers"></i>
		                                    </a>
		                        		</el-tooltip>
		                        		<el-tooltip content="Delete" effect="light" placement="right">
		                                    <a class="btn btn-circle btn-icon-only btn-default" @click.stop="showDeleteModal(item)">
												<i class="fa fa-lg fa-trash"></i>
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
                                    			<span>{{ item.value }}</span>
                                    		</div>
                                    		<div>
                                    			<strong>Points:</strong>
                                    			<span>{{ item.points }}</span>
                                    		</div>
                                		</div>
                                		<div class="col-sm-4">
                                    		<div>
                                    			<strong>Spoonity ID:</strong>
                                    			<span>{{ item.spoonity_reward_id }}</span>
                                    		</div>
                                    		<div>
                                    			<strong>Expires:</strong>
                                    			<span>{{ item.expiry }}</span>
                                    		</div>
                                    	</div>
                                  		<div class="col-sm-4">
                                    		<div>
                                    			<strong>Applied to:</strong>
                                    			<span>{{ item.sku_array.length }} item<span v-if="item.sku_array.length !== 1">s</span></span>
                                    		</div>
                                    	</div>
                                    </div>

		                        </li>
		                    </ul>
		                </div>
		            </div>
		        </div>
		    </div>
        </div>
        <div v-if="!rewardItems.length && !loadingRewardItems">
        	<no-results :show="true" :type="'reward items'"></no-results>
        </div>
        <edit-reward-item v-if="displayEditRewardItemModal" :passedRewardItem="passedRewardItem" :passedRewardTierId="passedRewardTierId" @updateRewardItemDetails="updateRewardItemDetails" @closeRewardItemModal="closeRewardItemModal"></edit-reward-item>
        <menu-modifier-tree v-if="showMenuModifierTreeModal" :selectedObject="selectedItem" :headerText="headerText" :updateType="'option'" @closeMenuModifierTreeModal="closeMenuModifierTreeModal" @closeMenuModifierTreeModalAndUpdate="closeMenuModifierTreeModalAndUpdate"></menu-modifier-tree>

        <!-- DELETE MODAL START -->
        <modal :show="displayDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal">
        	<div slot="modal-header" class="modal-header">
        		<button type="button" class="close" @click="closeDeleteModal()">
        			<span>&times;</span>
        		</button>
        		<h4 class="modal-title center">Delete Reward Item</h4>
        	</div>
        	<div slot="modal-body" class="modal-body">
        		<div class="row" v-show="deleteErrorMessage.length">
        			<div class="col-md-12">
        				<div class="alert alert-danger">
        					<button class="close" @click.stop="clearDeleteError()"></button>
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
        	<div slot="modal-footer" class="modal-footer">
        		<button type="submit" class="btn blue" @click.stop="deleteItem()">Delete</button>
        	</div>
        </modal>
        <!-- DELETE MODAL END -->
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../modules/Breadcrumb'
import NoResults from '../modules/NoResults'
import MenuTree from '../modules/MenuTree'
import MenuModifierTree from '../modules/MenuModifierTree'
import LoadingScreen from '../modules/LoadingScreen'
import Modal from '../modules/Modal'
import RewardFunctions from '../../controllers/Rewards'
import EditRewardItem from './Rewards/EditRewardItem'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Reward Tiers', link: '/app/rewards'},
				{name: 'Reward Items', link: false}
			],
			loadingRewardItems: false,
			rewardItems: [],
			errorMessage: '',
			displayEditRewardItemModal: false,
			passedRewardItem: 0,
			passedRewardTierId: this.$route.params.folder_id,
			createItemCollapse: true,
			newRewardItem: {
				name: '',
				created_by: this.$root.createdBy,
				expiry: '',
				value: '',
				spoonity_reward_id: '',
				points: '',
				sku: []
			},
			showMenuTreeModal: false,
			showMenuModifierTreeModal: false,
			headerText: '',
			showModifierTreeModal: false,
			selectedItem: {},
			displayDeleteModal: false,
			itemToBeDeleted: {
				reward_id: null,
				reward_item_id: null,
				name: ''
			},
			deleteErrorMessage: ''
		}
	},
	props: {
		passedTier: {
			type: Object,
			default: () => { return {} }
		}
	},
	mounted () {
		this.getRewardItems()
	},
	methods: {
		/**
		 * To close the menu tree modal.
		 * @function
		 * @returns {undefined}
		 */
		closeMenuModifierTreeModal () {
			this.showMenuModifierTreeModal = false
		},
		/**
		 * To close the menu tree modal.
		 * @function
		 * @param {object} data - The data object containing item id and selected SKUs.
		 * @returns {undefined}
		 */
		closeMenuModifierTreeModalAndUpdate (data) {
			this.showMenuModifierTreeModal = false
			this.rewardItems.forEach(item => {
				if (data.id === item.id) {
					item.sku_array = data.selectedSKUs
					return
				}
			})
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

			RewardFunctions.getRewardItems(rewardItemsVue.$router.passedTier.id, rewardItemsVue.$root.appId, rewardItemsVue.$root.appSecret, rewardItemsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					rewardItemsVue.loadingRewardItems = false
					rewardItemsVue.rewardItems = response.payload.reward_item_all
				} else {
					rewardItemsVue.loadingRewardItems = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					rewardItemsVue.$router.push('/login/expired')
					return
				}
				rewardItemsVue.loadingRewardItems = false
				if (reason.responseJSON) {
				}
				throw reason
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
				} else if (!rewardItemsVue.newRewardItem.spoonity_reward_id) {
					reject('Spoonity ID cannot be blank')
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
			rewardItemsVue.clearError()

			return rewardItemsVue.validateRewardItemData()
			.then(response => {
				RewardFunctions.createNewRewardItem(rewardItemsVue.$router.passedTier.id, rewardItemsVue.newRewardItem, rewardItemsVue.$root.appId, rewardItemsVue.$root.appSecret, rewardItemsVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						rewardItemsVue.newRewardItem.id = response.payload.id
						rewardItemsVue.newRewardItem.sku_array = response.payload.sku_array
						rewardItemsVue.addRewardItem(rewardItemsVue.newRewardItem)
					} else {
						rewardItemsVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						rewardItemsVue.$router.push('/login/expired')
						return
					}
					rewardItemsVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				rewardItemsVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
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
				text: 'Please select a store from the stores panel on the right before selecting items',
				type: 'warning',
				confirmButtonText: 'OK'
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
			this.selectedItem = item
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
				spoonity_reward_id: '',
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
			this.showAlert()
			this.clearNewRewardForm()
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Reward item \'' + this.newRewardItem.name + '\' has been successfully added!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To update the image according to the emitted value.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateRewardItemDetails (val) {
			this.displayEditRewardItemModal = false
			for (var i = 0; i < this.rewardItems.length; i++) {
				if (this.rewardItems[i].id === val.id) {
					this.rewardItems[i] = val
				}
			}
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
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
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
			var rewardsVue = this
			RewardFunctions.deleteRewardItem(rewardsVue.itemToBeDeleted, rewardsVue.$root.appId, rewardsVue.$root.appSecret, rewardsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					rewardsVue.getRewardItems()
					rewardsVue.closeDeleteModal()
					rewardsVue.confirmDelete()
					rewardsVue.resetItemToBeDeleted()
				} else {
					rewardsVue.deleteErrorMessage = response.message
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					rewardsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					rewardsVue.deleteErrorMessage = reason.responseJSON.message || 'Something went wrong ...'
					window.scrollTo(0, 0)
				} else {
					rewardsVue.deleteErrorMessage = reason.message || 'Something went wrong ...'
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To confirm the item was deleted
		 * @function
		 * @returns {undefined}
		 */
		confirmDelete () {
			this.$swal({
				title: 'Success',
				text: 'Reward Item deleted',
				type: 'success',
				confirmButtonText: 'OK'
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
		MenuTree,
		MenuModifierTree,
		Modal
	}
}
</script>

<style scoped>
.grey-label {
	color: rgb(153, 153, 153);
}
.mt-element-list .list-news.ext-1.mt-list-container ul>.mt-list-item:hover, .mt-element-list .list-news.ext-2.mt-list-container ul>.mt-list-item:hover {
	background-color: white;
}
</style>

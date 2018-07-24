<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
	    <h1 class="page-title">Reward Tiers</h1>
	    <!-- END PAGE TITLE-->
		<div class="note note-info">
            <p>Add and manage an application's reward tiers and their items.</p>
        </div>
        <!-- BEGIN CREATE NEW-->
        <div class="portlet box blue-hoki" v-if="$root.permissions['reward_tiers create']">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreateTierPanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Reward Tier
				</div>
				<div class="tools">
					<a :class="{'expand': !createTierCollapse, 'collapse': createTierCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': createTierCollapse}">
      			<form role="form" @submit.prevent="createRewardsTier()">
      				<div class="form-body row">
      					<div class="col-md-12">
			        		<div class="alert alert-danger" v-if="errorMessage.length">
			        		    <button class="close" data-close="alert" @click.prevent="clearError()"></button>
			        		    <span>{{errorMessage}}</span>
			        		</div>
			        	</div>
		        		<div class="col-md-6">
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newRewardsTier.name.length}" id="form_control_1" v-model="newRewardsTier.name">
		        			    <label for="form_control_1">Reward Tier Name</label>
		        			</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newRewardsTier.description.length}" id="form_control_3" v-model="newRewardsTier.description">
		        			    <label for="form_control_3">Reward Tier Description</label>
		        			</div>
		        		</div>
		        		<div class="col-md-6">
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newRewardsTier.points !== null}" id="form_control_2" v-model="newRewardsTier.points">
		        			    <label for="form_control_2">Reward Tier Points</label>
		        			</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newRewardsTier.stars !== null}" id="form_control_3" v-model="newRewardsTier.stars">
		        			    <label for="form_control_3">Reward Tier Stars</label>
		        			</div>
		        		</div>
		        	</div>
      				<div class="form-actions right margin-top-20">
						<button type="submit" class="btn blue">Create</button>
					</div>
      			</form>
  			</div>
        </div>
        <!-- END CREATE NEW-->

        <loading-screen :show="displayRewardsData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
        <div v-if="rewardTiers.length && !displayRewardsData">
		    <div class="portlet light portlet-fit bordered margin-top-20">
		        <div class="portlet-title bg-blue-chambray">
		        	<div class="menu-image-main">
		        		<img src="../../../static/client_logo.png">
		        	</div>
		            <div class="caption">
		                <span class="caption-subject font-green bold uppercase">Reward Tier</span>
                        <div class="caption-desc font-grey-cascade">Click on a tier to view its items.</div>
		            </div>
		        </div>
		        <div class="portlet-body">
		            <div class="mt-element-list margin-top-15" v-if="rewardTiers.length">
		                <div class="mt-list-container list-news ext-1 no-border">
		                    <ul>
		                        <li class="mt-list-item actions-at-left margin-top-15 clickable" v-for="tier in rewardTiers" :id="'tier-' + tier.id" :key="tier.id" @click="openTier(tier)">
		                        	<div class="list-item-actions cursor-pointer" @click.stop>
		                        		<el-tooltip 
											v-if="$root.permissions['reward_tiers update']"
											content="Edit" 
											effect="light" 
											placement="right">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="showEditTierModal(tier, $event)">
	                                            <i class="fa fa-lg fa-pencil"></i>
	                                        </a>
		                        		</el-tooltip>
		                        		<el-tooltip 
											v-if="$root.permissions['reward_tiers read'] && !$root.permissions['reward_tiers update']"
											content="View" 
											effect="light" 
											placement="right">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="showEditTierModal(tier, $event)">
	                                            <i class="fa fa-lg fa-eye"></i>
	                                        </a>
		                        		</el-tooltip>
		                        	</div>
		                        	<div class="list-icon-container">
                                        <i class="fa fa-angle-right"></i>
                                    </div>
		                            <div class="list-item-content height-mod">
		                            	<div class="col-sm-5">
			                            	<div class="bold uppercase font-red">
			                            		<span>{{ tier.name }}</span>
			                            	</div>
			                            	<div>
			                            		<strong>Description:</strong>
			                            		<span>{{ tier.description }}</span>
			                            	</div>
		                            	</div>
		                            	<div class="col-sm-5">
		                            		<div>
		                            			<strong>Points:</strong>
		                            			<span>{{ tier.points }}</span>
		                            		</div>
			                            	<div>
		                            			<strong>Starts:</strong>
		                            			<span>{{ tier.stars }}</span>
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
        <div v-if="!rewardTiers.length && !displayRewardsData">
        	<no-results :show="!rewardTiers.length" :type="'reward tiers'"></no-results>
        </div>
        <edit-rewards-tier v-if="displayEditTierModal" :passedRewardTier="passedRewardTier" @closeEditTierModal="closeEditTierModal" @updateRewardTier="updateRewardTier"></edit-rewards-tier>

		<!-- DELETE MODAL START -->
		<modal :show="displayDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Tier</h4>
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
						<p>Are you sure you want to delete {{tierToBeDeleted.name}}?</p>
					</div>
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="submit" class="btn blue" @click.stop="deleteTier()">Delete</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../modules/Breadcrumb'
import NoResults from '../modules/NoResults'
import LoadingScreen from '../modules/LoadingScreen'
import Modal from '../modules/Modal'
import RewardsFunctions from '../../controllers/Rewards'
import EditRewardsTier from './Rewards/EditRewardsTier'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Reward Tiers', link: false}
			],
			displayRewardsData: false,
			rewardTiers: [],
			errorMessage: '',
			displayEditTierModal: false,
			passedRewardTier: {},
			createTierCollapse: true,
			newRewardsTier: {
				name: '',
				points: null,
				stars: null,
				description: '',
				created_by: this.$root.createdBy
			},
			displayDeleteModal: false,
			tierToBeDeleted: {
				id: null,
				name: ''
			},
			deleteErrorMessage: ''
		}
	},
	mounted () {
		this.getRewardTiers()
	},
	methods: {
		/**
		 * To get a list of reward tiers.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getRewardTiers () {
			this.displayRewardsData = true
			this.rewardTiers = []
			var rewardsVue = this
			return RewardsFunctions.getRewardTiers(rewardsVue.$root.appId, rewardsVue.$root.appSecret, rewardsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					rewardsVue.displayRewardsData = false
					rewardsVue.rewardTiers = response.payload
				} else {
					rewardsVue.displayRewardsData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					rewardsVue.$router.push('/login/expired')
					return
				}
				rewardsVue.displayRewardsData = false
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To show the modal for editing a reward tier.
		 * @function
		 * @param {object} tier - The tier object that is to be edited.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		showEditTierModal (tier, event) {
			event.stopPropagation()
			this.passedRewardTier = tier
			this.displayEditTierModal = true
		},
		/**
		 * To close the modal for editing a reward tier.
		 * @function
		 * @returns {undefined}
		 */
		closeEditTierModal () {
			this.displayEditTierModal = false
		},
		/**
		 * To clear the new reward tier form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewRewardTier () {
			this.newRewardsTier = {
				name: '',
				description: '',
				points: null,
				stars: null
			}
		},
		/**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateTierData () {
			var rewardsVue = this
			return new Promise(function (resolve, reject) {
				if (!rewardsVue.newRewardsTier.name.length) {
					reject('Rewards tier name cannot be blank')
				} else if (!rewardsVue.newRewardsTier.description.length) {
					reject('Rewards tier description cannot be blank')
				} else if (!$.isNumeric(rewardsVue.newRewardsTier.points)) {
					reject('Rewards tier points should be a number')
				} else if (!$.isNumeric(rewardsVue.newRewardsTier.stars)) {
					reject('Rewards tier stars should be a number')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new rewards tier.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createRewardsTier () {
			var rewardsVue = this
			rewardsVue.clearError()

			return rewardsVue.validateTierData()
			.then(response => {
				RewardsFunctions.createRewardsTier(rewardsVue.newRewardsTier, rewardsVue.$root.appId, rewardsVue.$root.appSecret, rewardsVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						rewardsVue.newRewardsTier.id = response.payload.id
						rewardsVue.addTier(rewardsVue.newRewardsTier)
					} else {
						rewardsVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						rewardsVue.$router.push('/login/expired')
						return
					}
					rewardsVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				rewardsVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To add the newly created rewards tier to the list of tiers.
		 * @function
		 * @param {object} tier - The tier object that is to be added.
		 * @returns {undefined}
		 */
		addTier (tier) {
			this.rewardTiers.push(tier)
			this.showAlert()
		},
		/**
		 * To alert the user that the tier has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Reward Tier \'' + this.newRewardsTier.name + '\' has been successfully added!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.clearNewRewardTier()
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To update the rewards tier info.
		 * @function
		 * @param {object} tier - The tier object that is to be updated.
		 * @returns {undefined}
		 */
		updateRewardTier (tier) {
			this.getRewardTiers()
			this.displayEditTierModal = false
		},
		/**
		 * To route to the reward items page.
		 * @function
		 * @param {object} tier - The selected tier.
		 * @returns {undefined}
		 */
		openTier (tier) {
			this.$router.passedTier = tier
			this.$router.push({path: '/app/loyalty/rewards/' + tier.id + '/items', props: {passedTier: tier}})
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
		 * To toggle the create tier panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateTierPanel () {
			this.createTierCollapse = !this.createTierCollapse
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
		 * To show the modal for deleting a tier.
		 * @function
		 * @param {object} tier - The selected tier object.
		 * @returns {undefined}
		 */
		showDeleteModal (tier) {
			this.tierToBeDeleted.id = tier.id
			this.tierToBeDeleted.name = tier.name

			this.displayDeleteModal = true
		},
		/**
		 * To delete a tier in the API.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteTier () {
			var rewardsVue = this
			RewardsFunctions.deleteRewardTier(rewardsVue.tierToBeDeleted.id, rewardsVue.$root.appId, rewardsVue.$root.appSecret, rewardsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					rewardsVue.getRewardTiers()
					rewardsVue.closeDeleteModal()
					rewardsVue.confirmDelete()
					rewardsVue.resetTierToBeDeleted()
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
		 * To confirm the tier was deleted
		 * @function
		 * @returns {undefined}
		 */
		confirmDelete () {
			this.$swal({
				title: 'Success',
				text: 'Tier deleted',
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To clear the tier delete form
		 * @function
		 * @returns {undefined}
		 */
		resetTierToBeDeleted () {
			this.tierToBeDeleted = {
				id: null,
				name: ''
			}
		},
		/**
		 * To close the modal for deleting a tier.
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
		EditRewardsTier,
		Modal
	}
}
</script>

<style>
.cursor-pointer {
	cursor: default;
}
</style>

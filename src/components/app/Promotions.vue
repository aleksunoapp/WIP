<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
	    <h1 class="page-title">Promotions</h1>
	    <!-- END PAGE TITLE -->
		<div class="note note-info">
            <p>Add and manage an application's promotions.</p>
        </div>
        <!-- BEGIN CREATE NEW PROMOTION -->
        <div class="portlet box blue-hoki" v-if="$root.accountType !== 'store_admin'">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreatePromotionPanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Promotion
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewPromotionCollapse, 'collapse': createNewPromotionCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': createNewPromotionCollapse}">
      			<form role="form" @submit.prevent="createNewPromotion()">
      				<div class="form-body row">
      					<div class="col-md-12">
			        		<div class="alert alert-danger" v-if="createErrorMessage.length">
			        		    <button class="close" data-close="alert" @click.prevent="clearError('createErrorMessage')"></button>
			        		    <span>{{ createErrorMessage }}</span>
			        		</div>
			        	</div>
		        		<div class="col-md-2">
		        			<label class="grey-label">Promotion Image</label>
							<div class="image-container" v-if="!newPromotion.image.length">
								<img width="100" height="80" src="../../assets/img/app/image-placeholder.png" @click="openGalleryPopup()">
							</div>
							<div class="image-container" v-else>
								<img width="100" height="80" :src="newPromotion.image" @click="openGalleryPopup()">
							</div>
		        		</div>
		        		<div class="col-md-5">
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newPromotion.name.length}" id="form_control_1" v-model="newPromotion.name">
		        			    <label for="form_control_1">Promotion Name</label>
		        			</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newPromotion.description.length}" id="form_control_2" v-model="newPromotion.description">
		        			    <label for="form_control_2">Promotion Description</label>
		        			</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newPromotion.external_url.length}" id="form_control_3" v-model="newPromotion.external_url">
		        			    <label for="form_control_3">Promotion Link</label>
		        			</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        				<p class="grey-label">Promotion Start Date and Time</p>
		        				<el-date-picker 
		        					v-model="newPromotion.start_date" 
		        					type="datetime" 
		        					format="yyyy-MM-dd HH:mm" 
		        					value-format="yyyy-MM-dd HH:mm" 
		        					:clearable="false" 
		        					placeholder="Select start">
	        					</el-date-picker>
		        			</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        				<p class="grey-label">Promotion End Date and Time</p>
			        			<el-date-picker 
			        				v-model="newPromotion.end_date" 
			        				type="datetime" 
			        				format="yyyy-MM-dd HH:mm" 
			        				value-format="yyyy-MM-dd HH:mm" 
			        				:clearable="false" 
			        				placeholder="Select end">
		        				</el-date-picker>
		        			</div>
		        		</div>
		        		<div class="col-md-5">
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        				<label>Apply to all stores:</label><br>
			        			<el-switch
			        				v-model="newPromotion.apply_to_all_locations"
			        				active-color="#0c6"
			        				inactive-color="#ff4949"
			        				:active-value="1"
			        				:inactive-value="0"
			        				active-text="Yes"
			        				inactive-text="No">
			        			</el-switch>
		        			</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        				<label>Apply to a store group:</label><br>
			        			<el-switch
			        				v-model="newPromotion.apply_to_a_store_group"
			        				active-color="#0c6"
			        				inactive-color="#ff4949"
			        				:active-value="1"
			        				:inactive-value="0"
			        				active-text="Yes"
			        				inactive-text="No">
			        			</el-switch>
		        			</div>
		        			<div v-if="newPromotion.apply_to_a_store_group">
		        				<button type="button" class="btn blue btn-outline" @click="openStoreGroupsModal()"><span v-if="newPromotion.location_group_id === ''">Select</span><span v-else>Change</span> group</button>	
		        				<p class="grey-label margin-top-10" v-if="newPromotion.location_group_id !== ''">Selected {{newPromotion.location_group_name}}</p>	
		        			</div>
		        		</div>
		        	</div>

      				<div class="form-actions right margin-top-20">
						<button type="submit" class="btn blue">Create</button>
					</div>
      			</form>
  			</div>
        </div>
        <!-- END CREATE NEW PROMOTION -->

        <!-- BEGIN DISPLAY PROMOTIONS -->
        <loading-screen :show="displayPromotionsData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
        <div v-if="!displayPromotionsData">
		    <div class="portlet light portlet-fit bordered margin-top-20" id="promotions-container">
		        <div class="portlet-title bg-blue-chambray">
		        	<div class="menu-image-main">
		        		<img src="../../../static/client_logo.png">
		        	</div>
		            <div class="caption">
		                <span class="caption-subject font-green bold uppercase">Promotions</span>
                        <div class="caption-desc font-grey-cascade">Select promotions to assign to a store.</div>
		            </div>
		        </div>
				<div class="col-md-12">
	        		<div class="alert alert-danger" v-if="assignErrorMessage.length">
	        		    <button class="close" data-close="alert" @click="clearError('assignErrorMessage')"></button>
	        		    <span>{{ assignErrorMessage }}</span>
	        		</div>
	        	</div>
		        <div class="portlet-body">
		            <div class="mt-element-list margin-top-15" v-if="promotions.length">
		                <div class="mt-list-container list-news ext-1 no-border">
		                    <ul>
		                        <li class="mt-list-item actions-at-left margin-top-15" v-for="promotion in promotions" :id="'promotion-' + promotion.id" :key="promotion.id">
		                        	<div class="list-item-actions">
		                        		<el-tooltip content="Edit" effect="light" placement="right">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editPromotion(promotion, $event)">
	                                            <i class="fa fa-lg fa-pencil"></i>
	                                        </a>
		                        		</el-tooltip>
		                        		<el-tooltip content="Apply to ..." effect="light" placement="right">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="applyPromotion(promotion, $event)">
	                                            <i class="icon-layers"></i>
	                                        </a>
		                        		</el-tooltip>
		                        		<el-tooltip content="Delete" effect="light" placement="right">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="deletePromotion(promotion, $event)">
	                                            <i class="fa fa-lg fa-trash"></i>
	                                        </a>
		                        		</el-tooltip>
		                        	</div>
		                            <div class="list-thumb">
		                                <a v-if="promotion.image.length">
		                                    <img alt="" :src="promotion.image" />
		                                </a>
		                                <a v-else>
		                                	<img src="../../assets/img/app/login/bg1.jpg">
		                                </a>
		                            </div>
		                            <div class="list-datetime bold uppercase font-red">
		                            	<span>{{ promotion.name }}</span>
		                            </div>
		                            <div class="list-item-content height-mod">
	                            		<div class="col-xs-5">
	                            			<strong>Start:</strong>
	                            			<span>{{ promotion.start_date }}</span>
	                            		</div>
	                            		<div class="col-xs-5">
	                            			<strong>End:</strong>
	                            			<span>{{ promotion.end_date }}</span>
	                            		</div>
		                            	<div class="col-xs-10">
	                            			<strong>Description:</strong>
	                            			<span>{{ promotion.description }}</span>
	                            		</div>
		                            </div>
		                        	<div class="">
		                        		<div v-if="promotion.selected">
			                        		<button @click="toggleChecked(promotion, $event)" class="btn btn-success custom-button full-width">ON</button>
		                        		</div>
		                        		<div v-if="!promotion.selected">
			                        		<button @click="toggleChecked(promotion, $event)" class="btn btn-danger custom-button full-width">OFF</button>
		                        		</div>
		                        	</div>
		                        </li>
		                    </ul>
              				<div class="form-actions right margin-top-20">
			                    <button type="button" class="btn blue" @click="checkForLocation()">Save</button>
        					</div>
		                </div>
		            </div>
			        <div class="margin-top-20" v-if="!promotions.length && !displayPromotionsData">
			        	<no-results :show="!promotions.length" :type="'promotions'"></no-results>
			        </div>
		        </div>
		    </div>
        </div>
        <!-- END DISPLAY PROMOTIONS -->
        <edit-promotion v-if="showEditPromotionModal" :selectedPromotionId="selectedPromotionId" @updatePromotion="updatePromotion" @closeEditPromotionModal="closeEditPromotionModal"></edit-promotion>
        <delete-promotion v-if="deletePromotionModalActive" :selectedPromotionId="selectedPromotionId" @closeDeletePromotionModal="closeDeletePromotionModal" @deletePromotionAndCloseModal="deletePromotionAndCloseModal"></delete-promotion>
		<modal :show="showGalleryModal" effect="fade" @closeOnEscape="closeGalleryModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeGalleryModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Select An Image</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<gallery-popup @selectedImage="updateImage"></gallery-popup>
			</div>
			<div slot="modal-footer" class="modal-footer clear"></div>
		</modal>
		<modal :show="showStoreGroupsModal" effect="fade" @closeOnEscape="closeGalleryModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeStoreGroupsModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Select A Store Group</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<el-radio-group v-model="newPromotion.location_group_id" @change="saveGroupName">
					<el-radio v-for="group in storeGroups" :label="group.id" class="group-radio margin-top-15" :key="group.id">{{group.name}}</el-radio>
				</el-radio-group>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<button type="button" class="btn blue btn-outline" @click="closeStoreGroupsModal()">Done</button>
			</div>
		</modal>
		<modal :show="showApplyPromotionModal" effect="fade" @closeOnEscape="closeApplyModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeApplyModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Apply Promotion</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="row">
					<div class="col-md-12" v-if="applyErrorMessage.length">
						<div class="alert alert-danger">
						    <button class="close" data-close="alert" @click="clearError('applyErrorMessage')"></button>
						    <span>{{ applyErrorMessage }}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-10 col-md-offset-1">
						<div class="container__flex-row--center">
							<h5 class="modal-title margin-bottom-10">Apply to:</h5>
							<el-radio-group v-model="applyMode" size="small">
								<el-radio-button label="all" >All stores</el-radio-button>
								<el-radio-button label="group">Store group</el-radio-button>
								<el-radio-button label="geolocation">Geolocation</el-radio-button>
								<el-radio-button label="userGroup">User group</el-radio-button>
							</el-radio-group>							
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-10 col-md-offset-1" v-if="applyMode === 'all'">
						<p>
							This promotion will be applied to all stores.
						</p>
					</div>
					<div class="col-md-10 col-md-offset-1" v-if="applyMode === 'group'">
						<el-radio-group v-model="selectedGroupId">
							<el-radio v-for="group in storeGroups" :label="group.id" class="group-radio margin-top-15" :key="group.id">{{group.name}}</el-radio>
						</el-radio-group>
					</div>
					<div class="col-md-10 col-md-offset-1" v-if="applyMode === 'geolocation'">
						<el-radio-group v-model="selectedGeolocationId">
							<el-radio v-for="gl in geolocations" :label="gl.id" class="group-radio margin-top-15" :key="gl.id">{{gl.name}}</el-radio>
						</el-radio-group>
					</div>
					<div class="col-md-10 col-md-offset-1" v-if="applyMode === 'userGroup'">
						<el-radio-group v-model="selectedUserGroupId">
							<el-radio v-for="userGroup in userGroups" :label="userGroup.id" class="group-radio margin-top-15" :key="userGroup.id">{{userGroup.name}}</el-radio>
						</el-radio-group>
					</div>
				</div>
				
			</div>
			<div slot="modal-footer" class="modal-footer center">
				<button v-if="applyMode === 'all'" type="button" class="btn blue" @click="applyToAllStores()">Apply</button>
				<button v-if="applyMode === 'group'" type="button" class="btn blue" @click="applyToGroup()">Apply</button>
				<button v-if="applyMode === 'geolocation'" type="button" class="btn blue" @click="applyToGeolocation()">Apply</button>
				<div class="footer-wrapper" v-if="applyMode === 'userGroup'">
					<el-pagination
						class="inline-block pagination-center"
						small
						layout="prev, pager, next"
						:page-count="pageCount"
						@current-change="changeCurrentPage">
					</el-pagination>
					<button type="button" class="btn blue" @click="applyToUserGroup()">Apply</button>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import Breadcrumb from '../modules/Breadcrumb'
import LoadingScreen from '../modules/LoadingScreen'
import PromotionsFunctions from '../../controllers/Promotions'
import StoreGroupsFunctions from '../../controllers/StoreGroups'
import UserGroupsFunctions from '../../controllers/UserGroups'
import Modal from '../modules/Modal'
import GalleryPopup from '../modules/GalleryPopup'
import NoResults from '../modules/NoResults'
import EditPromotion from './Promotions/EditPromotion'
import DeletePromotion from './Promotions/DeletePromotion'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Promotions', link: false}
			],
			displayPromotionsData: false,
			promotions: [],
			createErrorMessage: '',
			assignErrorMessage: '',
			createNewPromotionCollapse: true,
			newPromotion: {
				name: '',
				description: '',
				image: '',
				external_url: '',
				start_date: '',
				end_date: '',
				apply_to_all_locations: 0,
				apply_to_a_store_group: 0,
				location_group_id: '',
				location_group_name: '',
				created_by: this.$root.createdBy
			},
			showGalleryModal: false,
			showEditPromotionModal: false,
			selectedPromotionId: 0,
			deletePromotionModalActive: false,
			showStoreGroupsModal: false,
			loadingGroupsData: false,
			storeGroups: [],
			geolocations: [],
			storeGroupsError: '',
			showApplyPromotionModal: false,
			selectedPromotion: {},
			applyMode: 'all',
			selectedGroupId: null,
			applyErrorMessage: '',
			selectedGeolocationId: null,
			loadingUserGroupsData: false,
			userGroups: [],
			selectedUserGroupId: null,
			pageCount: 1,
			currentPage: 1
		}
	},
	computed: {
		activeLocationId: function () {
			return this.$root.activeLocation.id
		}
	},
	watch: {
		activeLocationId: function () {
			this.getPromotionsForAStore()
		},
		'newPromotion.apply_to_all_locations' (newVal) {
			if (newVal) { this.newPromotion.apply_to_a_store_group = 0 }
		},
		'newPromotion.apply_to_a_store_group' (newVal) {
			if (newVal) {
				this.newPromotion.apply_to_all_locations = 0
			} else {
				this.newPromotion.location_group_id = ''
				this.newPromotion.location_group_name = ''
			}
		}
	},
	mounted () {
		this.getAllPromotions()
		this.getGroups()
		this.getGeolocations()
		this.getUserGroups()
	},
	methods: {
		/**
		 * To update the current page.
		 * @function
		 * @param {integer} page - The new current page number
		 * @returns {undefined}
		 */
		changeCurrentPage (page) {
			this.currentPage = page
			this.getUserGroups()
		},
		/**
		 * To reset applying promotion to stores
		 * @function
		 * @returns {undefined}
		 */
		resetApply () {
			this.storeGroupsError = ''
			this.showApplyPromotionModal = false
			this.selectedPromotion = {}
			this.applyMode = 'all'

			if (this.storeGroups.length) {
				this.selectedGroupId = this.storeGroups[0].id
			} else {
				this.selectedGroupId = null
			}

			if (this.userGroups.length) {
				this.selectedUserGroupId = this.userGroups[0].id
			} else {
				this.selectedUserGroupId = null
			}

			if (this.geolocations.length) {
				this.selectedGeolocationId = this.geolocations[0].id
			} else {
				this.selectedGeolocationId = null
			}

			this.applyErrorMessage = ''
		},
		/**
		 * To get a list of geolocations.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGeolocations () {
			var promotionsVue = this
			PromotionsFunctions.getGeolocations(promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					promotionsVue.geolocations = response.payload
					if (response.payload.length) {
						promotionsVue.selectedGeolocationId = response.payload[0].id
					}
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					promotionsVue.$router.push('/login/expired')
					return
				}
			})
		},
		/**
		 * To get a list of user groups.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserGroups () {
			this.loadingUserGroupsData = true
			var promotionsVue = this
			promotionsVue.userGroups = []
			let paginationPreferences = {
				page: this.currentPage
			}
			return UserGroupsFunctions.getGroups(promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken, paginationPreferences).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					promotionsVue.userGroups = response.payload.data
					promotionsVue.pageCount = response.payload.last_page
				} else {
					promotionsVue.loadingUserGroupsData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					promotionsVue.$router.push('/login/expired')
					return
				}
				promotionsVue.loadingUserGroupsData = false
				if (reason.responseJSON) {
					promotionsVue.applyErrorMessage = reason.responseJSON.message || 'Something went wrong ...'
					window.scrollTo(0, 0)
				} else {
					promotionsVue.applyErrorMessage = reason.message || 'Something went wrong ...'
				}
			})
		},
		/**
		 * To apply promotion to a user group
		 * @function
		 * @returns {undefined}
		 */
		applyToUserGroup () {
			var promotionsVue = this
			let payload = {
				promotions: [this.selectedPromotion.id]
			}
			return PromotionsFunctions.applyToUserGroup(promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken, payload, promotionsVue.selectedUserGroupId).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					promotionsVue.closeApplyModal()
					promotionsVue.showAssignSuccess()
					promotionsVue.resetApply()
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					promotionsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					promotionsVue.applyErrorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				} else {
					promotionsVue.applyErrorMessage = 'Something went wrong ...'
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To apply promotion to all stores
		 * @function
		 * @param {integer} id - The id of the group
		 * @returns {undefined}
		 */
		applyToAllStores () {
			var promotionsVue = this
			let payload = {
				promotions: [this.selectedPromotion.id]
			}
			return PromotionsFunctions.applyToAllStores(promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken, payload).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					promotionsVue.closeApplyModal()
					promotionsVue.showAssignSuccess()
					promotionsVue.resetApply()
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					promotionsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					promotionsVue.applyErrorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				} else {
					promotionsVue.applyErrorMessage = 'Something went wrong ...'
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To apply promotion to a store group
		 * @function
		 * @param {integer} id - The id of the group
		 * @returns {undefined}
		 */
		applyToGroup () {
			var promotionsVue = this
			let payload = {
				promotions: [this.selectedPromotion.id]
			}
			return PromotionsFunctions.applyToGroup(promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken, payload, promotionsVue.selectedGroupId).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					promotionsVue.closeApplyModal()
					promotionsVue.showAssignSuccess()
					promotionsVue.resetApply()
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					promotionsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					promotionsVue.applyErrorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				} else {
					promotionsVue.applyErrorMessage = 'Something went wrong ...'
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To apply promotion to a store group
		 * @function
		 * @param {integer} id - The id of the group
		 * @returns {undefined}
		 */
		applyToGeolocation () {
			var promotionsVue = this
			let payload = {
				promotions: [this.selectedPromotion.id]
			}
			return PromotionsFunctions.applyToGeolocation(promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken, payload, promotionsVue.selectedGeolocationId).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					promotionsVue.closeApplyModal()
					promotionsVue.showAssignSuccess()
					promotionsVue.resetApply()
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					promotionsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					promotionsVue.applyErrorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				} else {
					promotionsVue.applyErrorMessage = 'Something went wrong ...'
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To save the name of the selected group
		 * @function
		 * @param {integer} id - The id of the group
		 * @returns {undefined}
		 */
		saveGroupName (id) {
			let selected = this.storeGroups.find((group) => {
				return group.id === id
			})
			this.newPromotion.location_group_name = selected.name
		},
		/**
		 * To get a list of store groups.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroups () {
			this.loadingGroupsData = true
			var promotionsVue = this
			return StoreGroupsFunctions.getGroups(promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					promotionsVue.loadingGroupsData = false
					promotionsVue.storeGroups = response.payload
					if (response.payload.length) {
						promotionsVue.selectedGroupId = response.payload[0].id
					}
				} else {
					promotionsVue.loadingGroupsData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					promotionsVue.$router.push('/login/expired')
					return
				}
				promotionsVue.loadingGroupsData = false
				if (reason.responseJSON) {
					promotionsVue.storeGroupsError = reason.responseJSON.message
				}
			})
		},
		/**
		 * To open the store groups modal
		 * @function
		 * @returns {undefined}
		 */
		openStoreGroupsModal () {
			this.showStoreGroupsModal = true
		},
		/**
		 * To close the store groups modal
		 * @function
		 * @returns {undefined}
		 */
		closeStoreGroupsModal () {
			this.showStoreGroupsModal = false
		},
		/**
		 * To check if a location has been selected.
		 * @function
		 * @returns {undefined}
		 */
		checkForLocation () {
			if (this.$root.activeLocation && this.$root.activeLocation.id) {
				this.applySelectedPromotions()
			} else {
				this.showLocationAlert()
			}
		},
		/**
		 * To display notification that promotions were successfully assigned.
		 * @function
		 * @returns {undefined}
		 */
		showAssignSuccess () {
			this.$swal({
				title: 'Success!',
				text: 'Successfully applied!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To apply the selected promotion(s) to the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applySelectedPromotions () {
			var promotionsVue = this
			var selectedItems = []
			var unselectedItems = []
			for (var i = 0; i < promotionsVue.promotions.length; i++) {
				if (promotionsVue.promotions[i].selected) {
					selectedItems.push(promotionsVue.promotions[i].id)
				} else {
					unselectedItems.push(promotionsVue.promotions[i].id)
				}
			}
			if (selectedItems.length) {
				PromotionsFunctions.assignPromotionsToLocation(promotionsVue.$root.activeLocation.id, selectedItems, promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						promotionsVue.showAssignSuccess()
					} else {
						throw new Error(response.message)
					}
				}).catch(error => {
					this.assignErrorMessage = error.message
				})
			} else {
				this.assignErrorMessage = 'Please select at least one promotion.'
			}
		},
		/**
		 * To toggle the checkbox of the promotion.
		 * @function
		 * @param {object} promotion - The selected promotion
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		toggleChecked (promotion, event) {
			event.stopPropagation()
			this.promotions.forEach((promo) => { if (promo.id === promotion.id) { promo.selected = !promo.selected } })
		},
		/**
		 * To display the modal for deleting a promotion.
		 * @function
		 * @param {object} promotion - The selected promotion
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		deletePromotion (promotion, event) {
			event.stopPropagation()
			this.selectedPromotionId = promotion.id
			this.deletePromotionModalActive = true
		},
		/**
		 * To close the modal for deleting a promotion.
		 * @function
		 * @returns {undefined}
		 */
		closeDeletePromotionModal () {
			this.deletePromotionModalActive = false
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deletePromotionAndCloseModal () {
			this.deletePromotionModalActive = false
			for (var i = 0; i < this.promotions.length; i++) {
				if (parseInt(this.promotions[i].id) === parseInt(this.selectedPromotionId)) {
					this.promotions.splice(i, 1)
					break
				}
			}
		},
		/**
		 * To show the modal to apply a promotion to stores.
		 * @function
		 * @param {object} promotion - The selected promotion object.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		applyPromotion (promotion, event) {
			event.stopPropagation()
			if (!this.$root.activeLocation.id) {
				this.showLocationAlert()
				return
			}
			this.selectedPromotion = promotion
			this.showApplyPromotionModal = true
		},
		/**
		 * To display a prompt to select a location.
		 * @function
		 * @returns {undefined}
		 */
		showLocationAlert () {
			this.$swal({
				title: 'No location',
				text: 'Please select a store from the stores panel first.',
				type: 'warning',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To show the modal to edit a promotion's details.
		 * @function
		 * @param {object} promotion - The selected promotion object.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editPromotion (promotion, event) {
			event.stopPropagation()
			this.selectedPromotionId = promotion.id
			this.showEditPromotionModal = true
		},
		/**
		 * To get a list of all promotions.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllPromotions () {
			this.displayPromotionsData = true
			this.promotions = []
			var promotionsVue = this
			return PromotionsFunctions.getPromotionsList(promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					promotionsVue.displayPromotionsData = false
					promotionsVue.promotions = response.payload
					for (var i = 0; i < promotionsVue.promotions.length; i++) {
						promotionsVue.$set(promotionsVue.promotions[i], 'selected', false)
					}
					if (promotionsVue.$root.activeLocation.id) {
						promotionsVue.getPromotionsForAStore()
					}
				} else {
					promotionsVue.displayPromotionsData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					promotionsVue.$router.push('/login/expired')
					return
				}
				promotionsVue.displayPromotionsData = false
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get a list of promotions for the selected store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPromotionsForAStore () {
			var promotionsVue = this
			return PromotionsFunctions.getPromotionsForAStore(promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.activeLocation.id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					response.payload.promotions.forEach(
						(storePromotion) => {
							promotionsVue.promotions.forEach(
								(globalPromotion) => {
									if (globalPromotion.id === storePromotion.id) {
										globalPromotion.selected = true
									}
								}
							)
						}
					)
				} else {
					promotionsVue.displayPromotionsData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					promotionsVue.$router.push('/login/expired')
					return
				}
				promotionsVue.displayPromotionsData = false
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To close the modal for editing a promotion.
		 * @function
		 * @returns {undefined}
		 */
		closeEditPromotionModal () {
			this.showEditPromotionModal = false
		},
		/**
		 * To clear the new promotion form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewPromotion () {
			this.newPromotion = {
				name: '',
				description: '',
				image: '',
				external_url: '',
				start_date: '',
				end_date: '',
				apply_to_all_locations: 0,
				apply_to_a_store_group: 0,
				location_group_id: '',
				location_group_name: '',
				created_by: this.$root.createdBy
			}
		},
		/**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validatePromotionData () {
			var promotionsVue = this
			return new Promise(function (resolve, reject) {
				if (!promotionsVue.newPromotion.name.length) {
					reject('Promotion name cannot be blank')
				} else if (!promotionsVue.newPromotion.description.length) {
					reject('Promotion description cannot be blank')
				} else if (!promotionsVue.newPromotion.image.length) {
					reject('Promotion image cannot be blank')
				} else if (!promotionsVue.newPromotion.external_url.length) {
					reject('Promotion link cannot be blank')
				} else if (!promotionsVue.newPromotion.start_date) {
					reject('Please provide Start Date and Time')
				} else if (!promotionsVue.newPromotion.end_date) {
					reject('Please provide End Date and Time')
				} else if (new Date(promotionsVue.newPromotion.start_date) > new Date(promotionsVue.newPromotion.end_date)) {
					reject('Start Date cannot be after End Date')
				} else if (promotionsVue.newPromotion.apply_to_a_store_group && promotionsVue.newPromotion.location_group_id === '') {
					reject('Please select a store group')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new promotion.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createNewPromotion () {
			var promotionsVue = this
			promotionsVue.clearError()

			return promotionsVue.validatePromotionData()
			.then(response => {
				let payload = {}
				payload.name = promotionsVue.newPromotion.name
				payload.description = promotionsVue.newPromotion.description
				payload.image = promotionsVue.newPromotion.image
				payload.external_url = promotionsVue.newPromotion.external_url
				payload.start_date = promotionsVue.newPromotion.start_date
				payload.end_date = promotionsVue.newPromotion.end_date
				payload.apply_to_all_locations = promotionsVue.newPromotion.apply_to_all_locations
				payload.location_group_id = promotionsVue.newPromotion.location_group_id
				payload.created_by = promotionsVue.newPromotion.created_by

				PromotionsFunctions.createNewPromotion(payload, promotionsVue.$root.appId, promotionsVue.$root.appSecret, promotionsVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						promotionsVue.showAlert()
						promotionsVue.getAllPromotions()
					} else {
						promotionsVue.createErrorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						promotionsVue.$router.push('/login/expired')
						return
					}
					promotionsVue.createErrorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				promotionsVue.createErrorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To alert the user that the promotion has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Promotion \'' + this.newPromotion.name + '\' has been successfully added!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.clearNewPromotion()
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To update the promotion info.
		 * @function
		 * @param {object} promotion - The promotion object that is to be updated.
		 * @returns {undefined}
		 */
		updatePromotion (promotion) {
			this.displayEditPromotionModal = false
			for (var i = 0; i < this.promotions.length; i++) {
				if (this.promotions[i].id === promotion.id) {
					this.promotions[i] = promotion
				}
			}
		},
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
		 * To toggle the create tier panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePromotionPanel () {
			this.createNewPromotionCollapse = !this.createNewPromotionCollapse
		},
		/**
		 * To open the gallery modal.
		 * @function
		 * @returns {undefined}
		 */
		openGalleryPopup () {
			this.showGalleryModal = true
		},
		/**
		 * To close the gallery popup.
		 * @function
		 * @returns {undefined}
		 */
		closeGalleryModal () {
			this.showGalleryModal = false
		},
		/**
		 * To close the apply promotion modal.
		 * @function
		 * @returns {undefined}
		 */
		closeApplyModal () {
			this.showApplyPromotionModal = false
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.showGalleryModal = false
			this.newPromotion.image = val.image_url
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		Modal,
		GalleryPopup,
		NoResults,
		EditPromotion,
		DeletePromotion
	}
}
</script>

<style scoped>
.btn.custom-button:not(.md-skip):not(.bs-select-all):not(.bs-deselect-all) {
	position: absolute;
    bottom: 0;
    height: 100%;
    width: 5em;
    border-radius: 0;
}
.custom-button.full-width {
	right: 0;
}
.mt-element-list .list-news.ext-1.mt-list-container ul>.mt-list-item:hover {
	background-color: white;
}
.tiles .tile .tile-body > div {
    height: 80px;
    background-size: cover;
    background-repeat: no-repeat;
    background-size: 100%;
}
.tile-width {
	width: 127px;
	text-align: center;
}
.tile-width > span {
	max-width: 90%;
	height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    font-size: 13px;
}
.tiles .tile.image .corner:after {
	z-index: 1;
}
.tiles .tile.image.selected .check:after {
	z-index: 1;
	content: "\f040";
	color: #000;
}
.tiles .tile.image.selected.active .check:after {
	content: "\F00C";
}
.tiles .tile.image.selected.active .corner:after {
	border-right: 40px solid rgba(55, 183, 217, 1);
}
.grey-label {
	color: rgb(136, 136, 136);
	font-size: 13px;
	margin-bottom: 5px;
}
.group-radio {
	display: block;
}
.group-radio.el-radio+.group-radio.el-radio {
	margin-left: 0;
}
.container__flex-row--center {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.footer-wrapper {
	display: flex;
	justify-content: space-between;
}
</style>

<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Order Settings</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage order settings for the active store.</p>
		</div>

		<div class="row">
			<div class="col-md-12" v-show="activeLocationId === undefined">
				<div class="alert center alert-info">
					<h4>No Store Selected</h4>
					<p>Please select a store from the stores panel on the right to view order settings and apply them to the store.</p>
				</div>
			</div>			
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki" v-if="activeLocationId !== undefined && orderSettingsToEdit.id === undefined">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create Order Settings
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body relative-block" :class="{'display-hide': createNewCollapse}">
				<form role="form" @submit.prevent="createOrderSettings()" v-show="activeLocationId !== undefined">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger" v-show="createErrorMessage.length" ref="createErrorMessage">
								<button class="close" data-close="alert" @click.prevent="clearError('createErrorMessage')"></button>
								<span>{{ createErrorMessage }}</span>
							</div>
						</div>
		        	</div>
		        	<div class="row">
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.pickup_time_slot.length}" id="form_control_1" v-model="newOrderSettings.pickup_time_slot">
								<label for="form_control_1">Pickup Time Slot</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.pickup_orders_per_slot.length}" id="form_control_3" v-model="newOrderSettings.pickup_orders_per_slot">
								<label for="form_control_3">Pickup Orders Per Slot</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.pickup_order_time_cut_off.length}" id="create_pickup_order_time_cut_off" v-model="newOrderSettings.pickup_order_time_cut_off">
								<label for="create_pickup_order_time_cut_off">Pickup Order Time Cut Off</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.pickup_cancellation_time_cut_off.length}" id="form_control_3" v-model="newOrderSettings.pickup_cancellation_time_cut_off">
								<label for="form_control_3">Pickup Cancellation Time Cut Off</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
				                <label>Pickup Cancellation Enabled</label><br>
				                <el-switch
				                	v-model="newOrderSettings.pickup_cancellation_enabled"
				                	active-color="#0c6"
				                	inactive-color="#ff4949"
				                	active-value="1"
				                	inactive-value="0"
				                	active-text="Yes"
				                	inactive-text="No">
				                </el-switch>
				            </div>

	            			<div class="form-group form-md-line-input form-md-floating-label">
	            				<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.group_order_time_slot.length}" id="form_control_1" v-model="newOrderSettings.group_order_time_slot">
	            				<label for="form_control_1">Group Order Time Slot</label>
	            			</div>
	            			<div class="form-group form-md-line-input form-md-floating-label">
	            				<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.group_order_order_time_cut_off.length}" id="form_control_3" v-model="newOrderSettings.group_order_order_time_cut_off">
	            				<label for="form_control_3">Group Order Order Time Cut Off</label>
	            			</div>
	            			<div class="form-group form-md-line-input form-md-floating-label">
	            				<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.group_order_cancellation_time_cut_off.length}" id="form_control_3" v-model="newOrderSettings.group_order_cancellation_time_cut_off">
	            				<label for="form_control_3">Group Order Cancellation Time Cut Off</label>
	            			</div>
	            			<div class="form-group form-md-line-input form-md-floating-label">
	                            <label>Group Order Cancellation Enabled</label><br>
	                            <el-switch
	                            	v-model="newOrderSettings.group_order_cancellation_enabled"
	                            	active-color="#0c6"
	                            	inactive-color="#ff4949"
	                            	active-value="1"
	                            	inactive-value="0"
	                            	active-text="Active"
	                            	inactive-text="In Active">
	                            </el-switch>
	                        </div>
                    	</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.delivery_time_slot.length}" id="form_control_1" v-model="newOrderSettings.delivery_time_slot">
								<label for="form_control_1">Delivery Time Slot</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.delivery_orders_per_slot.length}" id="create_delivery_orders_per_slot" v-model="newOrderSettings.delivery_orders_per_slot">
								<label for="create_delivery_orders_per_slot">Delivery Orders Per Slot</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input 
									type="text" 
									class="form-control input-sm" 
									:class="{'edited': newOrderSettings.delivery_order_time_cut_off.length}" 
									id="form_control_3" 
									v-model="newOrderSettings.delivery_order_time_cut_off"
								>
								<label for="form_control_3">Delivery Order Time Cut Off</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input 
									type="text" 
									class="form-control input-sm" 
									:class="{'edited': newOrderSettings.delivery_cancellation_time_cut_off.length}" 
									id="form_control_3" 
									v-model="newOrderSettings.delivery_cancellation_time_cut_off"
								>
								<label for="form_control_3">Delivery Cancellation Time Cut Off</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
				                <label>Delivery Cancellation Enabled</label><br>
				                <el-switch
				                	v-model="newOrderSettings.delivery_cancellation_enabled"
				                	active-color="#0c6"
				                	inactive-color="#ff4949"
				                	active-value="1"
				                	inactive-value="0"
				                	active-text="Active"
				                	inactive-text="In Active">
				                </el-switch>
				            </div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.catering_time_slot.length}" id="form_control_1" v-model="newOrderSettings.catering_time_slot">
								<label for="form_control_1">Catering Time Slot</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.catering_order_time_cut_off.length}" id="form_control_3" v-model="newOrderSettings.catering_order_time_cut_off">
								<label for="form_control_3">Catering Order Time Cut Off</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newOrderSettings.catering_cancellation_time_cut_off.length}" id="form_control_3" v-model="newOrderSettings.catering_cancellation_time_cut_off">
								<label for="form_control_3">Catering Cancellation Time Cut Off</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
				                <label>Catering Cancellation Enabled</label><br>
				                <el-switch
				                	v-model="newOrderSettings.catering_cancellation_enabled"
				                	active-color="#0c6"
				                	inactive-color="#ff4949"
				                	active-value="1"
				                	inactive-value="0"
				                	active-text="Active"
				                	inactive-text="In Active">
				                </el-switch>
				            </div>
                            <button type="submit" class="btn blue pull-right">Create</button>
						</div>
					 </div>
				</form>
			</div>
		</div>
		<!-- END CREATE -->

		<!-- BEGIN LIST -->
		<div v-show="activeLocationId !== undefined">
			<div class="portlet light portlet-fit bordered margin-top-20">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image-main">
						<img src="../../../../static/client_logo.png">
					</div>
					<div class="caption">
						<span class="caption-subject font-green bold uppercase">Order Settings</span>
						<div class="caption-desc font-grey-cascade">Create, edit or delete Order Settings for the active store.</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="alert alert-danger" v-show="listErrorMessage.length" ref="listErrorMessage">
						<button class="close" data-close="alert" @click="clearError('listErrorMessage')"></button>
						<span>{{ listErrorMessage }}</span>
					</div>
				</div>
				<div class="portlet-body relative-block">
					<loading-screen :show="loading" :color="'#2C3E50'" :display="'inline'"></loading-screen>
					<div class="mt-element-list margin-top-15" v-if="!loading && orderSettingsToEdit.id !== undefined">
						<div class="row">
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.pickup_time_slot.length}" id="form_control_1" v-model="orderSettingsToEdit.pickup_time_slot">
									<label for="form_control_1">Pickup Time Slot</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.pickup_orders_per_slot.length}" id="form_control_3" v-model="orderSettingsToEdit.pickup_orders_per_slot">
									<label for="form_control_3">Pickup Orders Per Slot</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.pickup_order_time_cut_off.length}" id="create_pickup_order_time_cut_off" v-model="orderSettingsToEdit.pickup_order_time_cut_off">
									<label for="create_pickup_order_time_cut_off">Pickup Order Time Cut Off</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.pickup_cancellation_time_cut_off.length}" id="form_control_3" v-model="orderSettingsToEdit.pickup_cancellation_time_cut_off">
									<label for="form_control_3">Pickup Cancellation Time Cut Off</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
					                <label>Pickup Cancellation Enabled:</label><br>
					                <el-switch
					                	v-model="orderSettingsToEdit.pickup_cancellation_enabled"
					                	active-color="#0c6"
					                	inactive-color="#ff4949"
					                	active-value="1"
					                	inactive-value="0"
					                	active-text="Yes"
					                	inactive-text="No">
					                </el-switch>
					            </div>

		            			<div class="form-group form-md-line-input form-md-floating-label">
		            				<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.group_order_time_slot.length}" id="form_control_1" v-model="orderSettingsToEdit.group_order_time_slot">
		            				<label for="form_control_1">Group Order Time Slot</label>
		            			</div>
		            			<div class="form-group form-md-line-input form-md-floating-label">
		            				<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.group_order_order_time_cut_off.length}" id="form_control_3" v-model="orderSettingsToEdit.group_order_order_time_cut_off">
		            				<label for="form_control_3">Group Order Order Time Cut Off</label>
		            			</div>
		            			<div class="form-group form-md-line-input form-md-floating-label">
		            				<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.group_order_cancellation_time_cut_off.length}" id="form_control_3" v-model="orderSettingsToEdit.group_order_cancellation_time_cut_off">
		            				<label for="form_control_3">Group Order Cancellation Time Cut Off</label>
		            			</div>
		            			<div class="form-group form-md-line-input form-md-floating-label">
		                            <label>Group Order Cancellation Enabled:</label><br>
		                            <el-switch
		                            	v-model="orderSettingsToEdit.group_order_cancellation_enabled"
		                            	active-color="#0c6"
		                            	inactive-color="#ff4949"
		                            	active-value="1"
		                            	inactive-value="0"
		                            	active-text="Active"
		                            	inactive-text="In Active">
		                            </el-switch>
		                        </div>
	                    	</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.delivery_time_slot.length}" id="form_control_1" v-model="orderSettingsToEdit.delivery_time_slot">
									<label for="form_control_1">Delivery Time Slot</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.delivery_orders_per_slot.length}" id="create_delivery_orders_per_slot" v-model="orderSettingsToEdit.delivery_orders_per_slot">
									<label for="create_delivery_orders_per_slot">Delivery Orders Per Slot</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input 
										type="text" 
										class="form-control input-sm" 
										:class="{'edited': orderSettingsToEdit.delivery_order_time_cut_off.length}" 
										id="form_control_3" 
										v-model="orderSettingsToEdit.delivery_order_time_cut_off"
									>
									<label for="form_control_3">Delivery Order Time Cut Off</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input 
										type="text" 
										class="form-control input-sm" 
										:class="{'edited': orderSettingsToEdit.delivery_cancellation_time_cut_off.length}" 
										id="form_control_3" 
										v-model="orderSettingsToEdit.delivery_cancellation_time_cut_off"
									>
									<label for="form_control_3">Delivery Cancellation Time Cut Off</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
					                <label>Delivery Cancellation Enabled:</label><br>
					                <el-switch
					                	v-model="orderSettingsToEdit.delivery_cancellation_enabled"
					                	active-color="#0c6"
					                	inactive-color="#ff4949"
					                	active-value="1"
					                	inactive-value="0"
					                	active-text="Active"
					                	inactive-text="In Active">
					                </el-switch>
					            </div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.catering_time_slot.length}" id="form_control_1" v-model="orderSettingsToEdit.catering_time_slot">
									<label for="form_control_1">Catering Time Slot</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.catering_order_time_cut_off.length}" id="form_control_3" v-model="orderSettingsToEdit.catering_order_time_cut_off">
									<label for="form_control_3">Catering Order Time Cut Off</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" :class="{'edited': orderSettingsToEdit.catering_cancellation_time_cut_off.length}" id="form_control_3" v-model="orderSettingsToEdit.catering_cancellation_time_cut_off">
									<label for="form_control_3">Catering Cancellation Time Cut Off</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
					                <label>Catering Cancellation Enabled:</label><br>
					                <el-switch
					                	v-model="orderSettingsToEdit.catering_cancellation_enabled"
					                	active-color="#0c6"
					                	inactive-color="#ff4949"
					                	active-value="1"
					                	inactive-value="0"
					                	active-text="Active"
					                	inactive-text="In Active">
					                </el-switch>
					            </div>
							</div>
							<div class="col-xs-12 right margin-top-20">
								<div class="pull-right">
									<button 
										type="button" 
										class="btn btn-outline blue margin-right-10" 
										@click.stop.prevent="confirmDelete()"
									>
										Delete
									</button>
									<button 
										type="button" 
										class="btn blue" 
										@click="updateOrderSettings()"
									>
										Save
									</button>									
								</div>
							</div>
						</div>
					</div>
					<div class="margin-top-20">
						<no-results 
							:show="!loading && orderSettingsToEdit.id === undefined" 
							:type="'order settings'"
						>	
						</no-results>
					</div>
				</div>
			</div>
		</div>
		<!-- END LIST -->

		<modal :show="showDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal">
			<div slot="modal-header" class="modal-header center">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Order Settings</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="deleteErrorMessage.length">
				    <button 
				    	class="close" 
				    	ref="deleteErrorMessage"
				    	@click="clearError('deleteErrorMessage')"></button>
				    <span>{{deleteErrorMessage}}</span>
				</div>
				<div class="col-md-12">
					Are you sure you want to delete order settings for {{$root.activeLocation.name}}?
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<button type="button" class="btn btn-primary" @click="deleteOrderSettings()">Delete</button>
			</div>
		</modal>
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import OrderSettingsFunctions from '../../../controllers/OrderSettings'
import Modal from '../../modules/Modal'
import ResourcePicker from '../../modules/ResourcePicker'
import NoResults from '../../modules/NoResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Menu Manager', link: false},
				{name: 'Order Settings', link: false}
			],
			createNewCollapse: true,
			createErrorMessage: '',
			newOrderSettings: {
				pickup_time_slot: '',
				pickup_orders_per_slot: '',
				pickup_order_time_cut_off: '',
				pickup_cancellation_time_cut_off: '',
				pickup_cancellation_enabled: '0',
				catering_time_slot: '',
				catering_order_time_cut_off: '',
				catering_cancellation_time_cut_off: '',
				catering_cancellation_enabled: '0',
				delivery_time_slot: '',
				delivery_orders_per_slot: '',
				delivery_order_time_cut_off: '',
				delivery_cancellation_time_cut_off: '',
				delivery_cancellation_enabled: '0',
				group_order_time_slot: '',
				group_order_order_time_cut_off: '',
				group_order_cancellation_time_cut_off: '',
				group_order_cancellation_enabled: '0'
			},
			listErrorMessage: '',
			loading: false,
			orderSettingsToEdit: {
				pickup_orders_per_slot: '',
				pickup_order_time_cut_off: '',
				pickup_cancellation_time_cut_off: '',
				pickup_cancellation_enabled: '0',
				catering_time_slot: '',
				catering_order_time_cut_off: '',
				catering_cancellation_time_cut_off: '',
				catering_cancellation_enabled: '0',
				delivery_time_slot: '',
				delivery_orders_per_slot: '',
				delivery_order_time_cut_off: '',
				delivery_cancellation_time_cut_off: '',
				delivery_cancellation_enabled: '0',
				group_order_time_slot: '',
				group_order_order_time_cut_off: '',
				group_order_cancellation_time_cut_off: '',
				group_order_cancellation_enabled: '0'
			},
			showDeleteModal: false,
			deleteErrorMessage: ''
		}
	},
	computed: {
		activeLocationId: function () {
			return this.$root.activeLocation.id
		}
	},
	watch: {
		activeLocationId: function (newId) {
			if (newId !== undefined) {
				this.getOrderSettingsForStore()
			}
		}
	},
	created () {
		if (this.activeLocationId) {
			this.getOrderSettingsForStore()
		}
	},
	methods: {
		/**
		 * To toggle the create tier panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePanel () {
			this.createNewCollapse = !this.createNewCollapse
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
		 * To check if the OrderSettings data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validatenewOrderSettingsData () {
			var orderSettingsVue = this
			return new Promise(function (resolve, reject) {
				if (!orderSettingsVue.newOrderSettings.pickup_time_slot) {
					reject('Pickup Time Slot cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.pickup_orders_per_slot) {
					reject('Pickup Orders Per Slot cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.pickup_order_time_cut_off) {
					reject('Pickup Order Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.pickup_cancellation_time_cut_off) {
					reject('Pickup Cancellation Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.pickup_cancellation_enabled) {
					reject('Pickup Cancellation Enabled cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.group_order_time_slot) {
					reject('Group Order Time  cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.group_order_order_time_cut_off) {
					reject('Group Order Order Time Cut cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.group_order_cancellation_time_cut_off) {
					reject('Group Order Cancellation Time Cut cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.group_order_cancellation_enabled) {
					reject('Group Order Cancellation Enabled cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.delivery_time_slot) {
					reject('Delivery Time Slot cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.delivery_orders_per_slot) {
					reject('Delivery Orders Per Slot cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.delivery_order_time_cut_off) {
					reject('Delivery Order Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.delivery_cancellation_time_cut_off) {
					reject('Delivery Cancellation Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.delivery_cancellation_enabled) {
					reject('Delivery Cancellation Enabled cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.catering_time_slot) {
					reject('Catering Time Slot cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.catering_order_time_cut_off) {
					reject('Catering Order Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.catering_cancellation_time_cut_off) {
					reject('Catering Cancellation Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.newOrderSettings.catering_cancellation_enabled) {
					reject('Catering Cancellation Enabled cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new OrderSettings.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createOrderSettings () {
			var orderSettingsVue = this
			orderSettingsVue.clearError('createErrorMessage')

			let payload = { ...this.newOrderSettings }
			payload.location_id = this.$root.activeLocation.id

			return orderSettingsVue
				.validatenewOrderSettingsData()
				.then(response => {
					OrderSettingsFunctions.setOrderSettings(
							orderSettingsVue.$root.appId,
							orderSettingsVue.$root.appSecret,
							orderSettingsVue.$root.userToken,
							payload
						)
						.then(response => {
							orderSettingsVue.showCreateSuccess()
							orderSettingsVue.newOrderSettings = orderSettingsVue.blankOrderSettings()
							orderSettingsVue.getOrderSettingsForStore()
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create order settings',
								errorName: 'createErrorMessage',
								vue: orderSettingsVue
							})
						})
				})
				.catch(reason => {
					orderSettingsVue.createErrorMessage = reason
					orderSettingsVue.$scrollTo(orderSettingsVue.$refs.createErrorMessage, 1000, {
						offset: -50
					})
				})
		},
		/**
		 * To update order settings.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updateOrderSettings () {
			var orderSettingsVue = this
			orderSettingsVue.clearError('createErrorMessage')

			return orderSettingsVue
				.validateEditedOrderSettingsData()
				.then(response => {
					OrderSettingsFunctions.setOrderSettings(
							orderSettingsVue.$root.appId,
							orderSettingsVue.$root.appSecret,
							orderSettingsVue.$root.userToken,
							orderSettingsVue.orderSettingsToEdit
						)
						.then(response => {
							orderSettingsVue.showEditSuccess()
							orderSettingsVue.getOrderSettingsForStore()
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create order settings',
								errorName: 'listErrorMessage',
								vue: orderSettingsVue
							})
						})
				})
				.catch(reason => {
					orderSettingsVue.listErrorMessage = reason
					orderSettingsVue.$scrollTo(orderSettingsVue.$refs.listErrorMessage, 1000, {
						offset: -50
					})
				})
		},
		/**
		 * To alert the user that the OrderSetting has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showCreateSuccess () {
			this.$swal({
				title: 'Success!',
				text: 'Order settings saved',
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To clear the new OrderSetting form.
		 * @function
		 * @returns {undefined}
		 */
		blankOrderSettings () {
			return {
				pickup_time_slot: '',
				pickup_orders_per_slot: '',
				pickup_order_time_cut_off: '',
				pickup_cancellation_time_cut_off: '',
				pickup_cancellation_enabled: '',
				catering_time_slot: '',
				catering_order_time_cut_off: '',
				catering_cancellation_time_cut_off: '',
				catering_cancellation_enabled: '',
				delivery_time_slot: '',
				delivery_orders_per_slot: '',
				delivery_order_time_cut_off: '',
				delivery_cancellation_time_cut_off: '',
				delivery_cancellation_enabled: '',
				group_order_time_slot: '',
				group_order_order_time_cut_off: '',
				group_order_cancellation_time_cut_off: '',
				group_order_cancellation_enabled: ''
			}
		},
		/**
		 * To get a list of OrderSettings for the current active store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getOrderSettingsForStore () {
			this.loading = true
			var orderSettingsVue = this

			return OrderSettingsFunctions.getOrderSettingsForStore(
					orderSettingsVue.$root.appId,
					orderSettingsVue.$root.appSecret,
					orderSettingsVue.$root.userToken,
					orderSettingsVue.$root.activeLocation.id
				)
				.then(response => {
					orderSettingsVue.loading = false
					Object.keys(response.payload).forEach(key => {
						orderSettingsVue.orderSettingsToEdit[key] = String(response.payload[key])
					})
				})
				.catch(reason => {
					orderSettingsVue.loading = false
					console.log(reason)
					if (reason.responseJSON.message === 'Location order configurations for selected location doesnt exist.') {
						orderSettingsVue.orderSettingsToEdit = orderSettingsVue.blankOrderSettings()
						return
					}
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch order settings',
						errorName: 'listErrorMessage',
						vue: orderSettingsVue
					})
				})
		},
		/**
		 * To check if the order data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedOrderSettingsData () {
			var orderSettingsVue = this
			return new Promise(function (resolve, reject) {
				if (!orderSettingsVue.orderSettingsToEdit.pickup_time_slot) {
					reject('Pickup Time Slot cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.pickup_orders_per_slot) {
					reject('Pickup Orders Per Slot cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.pickup_order_time_cut_off) {
					reject('Pickup Order Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.pickup_cancellation_time_cut_off) {
					reject('Pickup Cancellation Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.pickup_cancellation_enabled) {
					reject('Pickup Cancellation Enabled cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.group_order_time_slot) {
					reject('Group Order Time  cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.group_order_order_time_cut_off) {
					reject('Group Order Order Time Cut cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.group_order_cancellation_time_cut_off) {
					reject('Group Order Cancellation Time Cut cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.group_order_cancellation_enabled) {
					reject('Group Order Cancellation Enabled cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.delivery_time_slot) {
					reject('Delivery Time Slot cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.delivery_orders_per_slot) {
					reject('Delivery Orders Per Slot cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.delivery_order_time_cut_off) {
					reject('Delivery Order Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.delivery_cancellation_time_cut_off) {
					reject('Delivery Cancellation Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.delivery_cancellation_enabled) {
					reject('Delivery Cancellation Enabled cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.catering_time_slot) {
					reject('Catering Time Slot cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.catering_order_time_cut_off) {
					reject('Catering Order Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.catering_cancellation_time_cut_off) {
					reject('Catering Cancellation Time Cut Off cannot be blank')
				} else if (!orderSettingsVue.orderSettingsToEdit.catering_cancellation_enabled) {
					reject('Catering Cancellation Enabled cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To display notification that OrderSettings were successfully saved.
		 * @function
		 * @returns {undefined}
		 */
		showEditSuccess () {
			this.$swal({
				title: 'Success!',
				text: `Order settings updated`,
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To reset the edit form
		 * @function
		 * @returns {undefined}
		 */
		resetEdit () {
			// TODO
		},
		/**
		 * To display the modal for deleting an order.
		 * @function
		 * @returns {undefined}
		 */
		confirmDelete () {
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteOrderSettings () {
			var orderSettingsVue = this
			return OrderSettingsFunctions.deleteOrderSettings(
					orderSettingsVue.$root.appId,
					orderSettingsVue.$root.appSecret,
					orderSettingsVue.$root.userToken,
					orderSettingsVue.$root.activeLocation.id
				)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						orderSettingsVue.getOrderSettingsForStore()
						orderSettingsVue.closeDeleteModal()
						orderSettingsVue.showDeleteSuccess()
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not delete order settings`,
						errorName: 'deleteErrorMessage',
						vue: orderSettingsVue
					})
				})
		},
		/**
		 * To display notification that OrderSettings were successfully saved.
		 * @function
		 * @returns {undefined}
		 */
		showDeleteSuccess () {
			this.$swal({
				title: 'Success!',
				text: `Settings deleted`,
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To close the delete modal.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.showDeleteModal = false
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		Modal,
		NoResults,
		ResourcePicker
	}
}
</script>

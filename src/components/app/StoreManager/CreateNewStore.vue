<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Create New Store</h1>
		<!-- END PAGE TITLE-->
		<div class="alert alert-danger"
		     v-if="errorMessage.length">
			<span>{{errorMessage}}</span>
		</div>
		<el-steps :active="activeTab"
		          align-center>
			<el-step title="Store Information"
			         :status="steps.step0_status"
			         description="Enter address and basic info"></el-step>
			<el-step title="Store Profile"
			         :status="steps.step1_status"
			         description="Enter delivery info"></el-step>
			<el-step title="Store Hours"
			         :status="steps.step2_status"
			         description="Enter store hours"></el-step>
			<el-step @click.native="goToStep(3)"
			         :class="{'clickable' : steps.step2_status === 'success'}"
			         title="Store Holiday Hours"
			         :status="steps.step3_status"
			         description="Add holiday hours"></el-step>
			<el-step title="Store Images"
			         :class="{'clickable' : steps.step2_status === 'success'}"
			         @click.native="goToStep(4)"
			         :status="steps.step4_status"
			         description="Add images"></el-step>
		</el-steps>
		<div class="panels-wrapper margin-top-15"
		     v-show="displayStoreForm && !errorMessage.length && !successMessage.length">
			<div class="panel"
			     v-show="activeTab === 0">
				<div class="portlet light bordered">
					<div class="portlet-body form">
						<form role="form"
						      novalidate>
							<div class="alert alert-danger"
							     v-show="storeInformationError.length"
							     ref="storeInformationError">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError('storeInformationError')"></button>
								<span>{{storeInformationError}}</span>
							</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input ref="name"
									       type="text"
									       class="form-control input-sm"
									       :class="{'edited' : newStore.name.length}"
									       id="form_control_1"
									       v-model="newStore.name">
									<label for="form_control_1">Store Name</label>
								</div>
								<div class="autocomplete-wrapper">
									<label for="address_line_1"
									       class="fake-md-label"
									       :class="{'raised' : newStore.address_line_1.length || autocompleteFocused}">Address Line 1</label>
									<el-autocomplete class="inline-input md-autocomplete"
									                 :class="{'raised' : newStore.address_line_1.length || autocompleteFocused}"
									                 label="Address Line 1"
									                 v-model="newStore.address_line_1"
									                 :fetch-suggestions="querySearch"
									                 :trigger-on-focus="false"
									                 @select="selectLocation"
									                 @focus="focusAutocomplete"
									                 @blur="blurAutocomplete"
									                 id="address_line_1">
									</el-autocomplete>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_2"
									       v-model="newStore.address_line_2">
									<label for="form_control_2">Address Line 2</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       :readonly="placesApi.city"
									       class="form-control input-sm"
									       id="form_control_3"
									       :class="{'edited': newStore.city.length}"
									       v-model="newStore.city">
									<label for="form_control_3">Store City</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       :readonly="placesApi.province"
									       class="form-control input-sm"
									       id="form_control_4"
									       :class="{'edited': newStore.province.length}"
									       v-model="newStore.province">
									<label for="form_control_4">Store Province</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       :readonly="placesApi.country"
									       class="form-control input-sm"
									       id="form_control_5"
									       :class="{'edited': newStore.country.length}"
									       v-model="newStore.country">
									<label for="form_control_5">Store Country</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       :readonly="placesApi.postal_code"
									       class="form-control input-sm"
									       id="form_control_6"
									       :class="{'edited': newStore.postal_code.length}"
									       v-model="newStore.postal_code">
									<label for="form_control_6">Store Postal Code</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label"
								     v-if="storeGroups.length">
									<label>Select Store Group:</label><br>
									<el-select v-model="newStore.locationsgroup_id"
									           filterable
									           placeholder="Select a group"
									           size="mini">
										<el-option v-for="group in storeGroups"
										           :key="group.id"
										           :label="group.name"
										           :value="group.id">
										</el-option>
									</el-select>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<label>Store Timezone:</label><br>
									<el-select v-model="newStore.timezone"
									           filterable
									           placeholder="Select a timezone"
									           size="mini">
										<el-option v-for="(zone, i) in timezones"
										           :label="zone.label"
										           :value="zone.value"
										           :key="i">
										</el-option>
									</el-select>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<label>Store Currency:</label><br>
									<el-select v-model="newStore.currency"
									           filterable
									           placeholder="Select a currency"
									           size="mini">
										<el-option label="CAD"
										           value="CAD"></el-option>
										<el-option label="USD"
										           value="USD"></el-option>
									</el-select>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<label>Menu Tier:</label><br>
									<el-select v-model="newStore.menu_tier_id"
									           filterable
									           placeholder="Select a tier"
									           size="mini">
										<el-option key="default"
										           label="none"
										           value="0">
										</el-option>
										<el-option v-if="menuTiers.length"
										           v-for="tier in menuTiers"
										           :key="tier.id"
										           :label="tier.name"
										           :value="tier.id">
										</el-option>
									</el-select>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input ref="displayName"
									       type="text"
									       class="form-control input-sm"
									       id="form_control_7"
									       v-model="newStore.display_name">
									<label for="form_control_7">Store Display Name</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_8"
									       v-model="newStore.internal_id">
									<label for="form_control_8">Store Internal ID</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_9"
									       v-model="newStore.api_key">
									<label for="form_control_9">External API Key (optional)</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_10"
									       v-model="newStore.phone"
									       v-mask="'(###) ###-####'">
									<label for="form_control_10">Store Phone Number</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_11"
									       v-model="newStore.fax"
									       v-mask="'(###) ###-####'">
									<label for="form_control_11">Store Fax Number (optional)</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_12"
									       v-model="newStore.email">
									<label for="form_control_12">Store Email</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<label>Store Is Corporate:</label><br>
									<el-switch v-model="newStore.is_corporate"
									           active-color="#0c6"
									           inactive-color="#ff4949"
									           :active-value="1"
									           :inactive-value="0"
									           active-text="Yes"
									           inactive-text="No">
									</el-switch>
								</div>
							</div>
							<div class="form-actions noborder clear">
								<div class="col-md-12">
									<el-button type="primary"
									           @click="createNewStore($event)"
									           :loading="loadingCreateNewStore"
									           :disabled="loadingCreateNewStore && createStoreMode === 'info'"
									           size="medium">
										<span v-show="!loadingCreateNewStore">Save And Next</span>
									</el-button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div class="panel"
			     v-show="activeTab === 1">
				<div class="portlet light bordered">
					<div class="portlet-body form">
						<form role="form"
						      novalidate
						      @submit.prevent="createStoreMeta()">
							<div class="form-body">
								<div class="alert alert-danger"
								     v-show="storeMetaError.length"
								     ref="storeMetaError">
									<button class="close"
									        data-close="alert"
									        @click="clearError('storeMetaError')"></button>
									<span>{{storeMetaError}}</span>
								</div>
								<div class="col-md-6">
									<table class="table">
										<thead>
											<tr>
												<th> Field </th>
												<th> Value </th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>
													Opening Soon
												</td>
												<td>
													<el-switch ref="openingSoon"
													           v-model="newStoreMeta.opening_soon"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr>
												<td>
													Store Has Online Ordering
												</td>
												<td>
													<el-switch v-model="newStoreMeta.online_ordering"
													           :disabled="newStoreMeta.opening_soon === 1"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr>
												<td>
													Store Has Online Ordering Enabled
												</td>
												<td>
													<el-switch v-model="newStoreMeta.current_online_ordering_status"
													           :disabled="newStoreMeta.online_ordering === 0 || newStoreMeta.opening_soon === 1"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr>
												<td>
													Store Has Delivery
												</td>
												<td>
													<el-switch ref="delivery"
													           v-model="newStoreMeta.delivery"
													           :disabled="newStoreMeta.opening_soon === 1"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr>
												<td>
													Store Has Delivery Enabled
												</td>
												<td>
													<el-switch v-model="newStoreMeta.current_delivery_status"
													           :disabled="newStoreMeta.delivery === 0 || newStoreMeta.opening_soon === 1"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr>
												<td>
													Pickup Later
												</td>
												<td>
													<el-switch v-model="newStoreMeta.enable_pickup_later"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr>
												<td>
													Catering
												</td>
												<td>
													<el-switch v-model="newStoreMeta.catering"
													           :disabled="newStoreMeta.opening_soon === 1"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr>
												<td>
													Catering Enabled
												</td>
												<td>
													<el-switch v-model="newStoreMeta.current_catering_status"
													           :disabled="newStoreMeta.catering === 0 || newStoreMeta.opening_soon === 1"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>

											<tr>
												<td>
													Gift Cards
												</td>
												<td>
													<el-switch v-model="newStoreMeta.gift_card"
													           :disabled="newStoreMeta.opening_soon === 1"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr>
												<td>
													Digital Rewards
												</td>
												<td>
													<el-switch v-model="newStoreMeta.digital_reward"
													           :disabled="newStoreMeta.opening_soon === 1"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr>
												<td>
													External online ordering enabled
												</td>
												<td>
													<el-switch v-model="newStoreMeta.external_online_ordering_enabled"
													           :disabled="newStoreMeta.opening_soon === 1"
													           active-color="#0c6"
													           inactive-color="#ff4949"
													           :active-value="1"
													           :inactive-value="0"
													           active-text="Yes"
													           inactive-text="No">
													</el-switch>
												</td>
											</tr>
											<tr v-show="newStoreMeta.external_online_ordering_enabled">
												<td>
													External order link
												</td>
												<td>
													<input type="text"
													       class="form-control input-sm"
													       v-model="newStoreMeta.external_online_ordering_url"
													       :disabled="newStoreMeta.opening_soon === 1">
												</td>
											</tr>
											<tr>
												<td>
													GST Number
												</td>
												<td>
													<input type="text"
													       class="form-control input-sm"
													       v-model="newStoreMeta.gst_number"
													       :disabled="newStoreMeta.opening_soon === 1">
												</td>
											</tr>
											<tr>
												<td>
													Payment Processor Merchant ID (MID)
												</td>
												<td>
													<input type="text"
													       class="form-control input-sm"
													       :disabled="newStoreMeta.opening_soon === 1"
													       v-model="newStoreMeta.merchant_id">
												</td>
											</tr>
											<tr>
												<td>
													Payment Processor Merchant Key
												</td>
												<td>
													<input type="text"
													       class="form-control input-sm"
													       :disabled="newStoreMeta.opening_soon === 1"
													       v-model="newStoreMeta.merchant_key">
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div class="form-actions noborder clear">
								<div class="col-md-12">
									<button type="submit"
									        class="btn blue"
									        :disabled="createStoreMode !== 'meta' || savingStoreMeta">
										Save And Next
										<i v-show="savingStoreMeta"
										   class="fa fa-spinner fa-pulse fa-fw">
										</i>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div class="panel"
			     v-show="activeTab === 2">
				<div class="portlet light bordered">
					<div class="portlet-body form">
						<div class="form-body">
							<div class="alert alert-danger"
							     v-show="storeHoursError.length"
							     ref="storeHoursError">
								<button class="close"
								        data-close="alert"
								        @click="clearError('storeHoursError')"></button>
								<span>{{storeHoursError}}</span>
							</div>
							<table class="table">
								<thead>
									<tr>
										<th>Day</th>
										<th>Opening Time</th>
										<th>Closing Time</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="hour in newStoreHours"
									    :key="hour.day">
										<td class="align-middle"
										    v-if="hour.day === 0"> Sunday </td>
										<td class="align-middle"
										    v-if="hour.day === 1"> Monday </td>
										<td class="align-middle"
										    v-if="hour.day === 2"> Tuesday </td>
										<td class="align-middle"
										    v-if="hour.day === 3"> Wednesday </td>
										<td class="align-middle"
										    v-if="hour.day === 4"> Thursday </td>
										<td class="align-middle"
										    v-if="hour.day === 5"> Friday </td>
										<td class="align-middle"
										    v-if="hour.day === 6"> Saturday </td>
										<td class="align-middle">
											<el-time-select v-model="hour.open_time"
											                :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
											                placeholder="Opening time"
											                class="narrow-picker"></el-time-select>
											<button data-toggle="tooltip"
											        title="Copy to all"
											        class="btn btn-icon-only btn-outline blue"
											        @click="applyOpeningTimeToAll(hour.open_time, $event)">
												<i class="fa fa-clone"
												   aria-hidden="true"></i>
											</button>
										</td>
										<td class="align-middle">
											<el-time-select v-model="hour.close_time"
											                :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
											                placeholder="Closing time"
											                class="narrow-picker"></el-time-select>
											<button data-toggle="tooltip"
											        title="Copy to all"
											        class="btn btn-icon-only btn-outline blue"
											        @click="applyClosingTimeToAll(hour.close_time, $event)">
												<i class="fa fa-clone"
												   aria-hidden="true"></i>
											</button>
										</td>
										<td class="align-middle">
											<el-switch v-model="hour.open"
											           active-color="#0c6"
											           inactive-color="#ff4949"
											           :active-value="1"
											           :inactive-value="0"
											           active-text="Open"
											           inactive-text="Closed">
											</el-switch>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="form-actions noborder clear">
							<button type="button"
							        class="btn blue"
							        :disabled="createStoreMode !== 'hours' || savingStoreHours"
							        @click="createStoreHours()">
								Save
								<i v-show="savingStoreHours"
								   class="fa fa-spinner fa-pulse fa-fw">
								</i>
							</button>
						</div>
						<modal :show="showHoursAlertModal"
						       effect="fade"
						       @closeOnEscape="closeHoursAlert">
							<div slot="modal-header"
							     class="modal-header">
								<button type="button"
								        class="close"
								        @click="closeHoursAlert()">
									<span>&times;</span>
								</button>
								<h4 class="modal-title center">Success</h4>
							</div>
							<div slot="modal-body"
							     class="modal-body">
								<div>Do you want to
									<strong>set up holiday hours</strong>,
									<strong>add images</strong> or
									<strong>set up amenities</strong> for this store?</div>
							</div>
							<div slot="modal-footer"
							     class="modal-footer">
								<button class="btn btn-primary"
								        @click="setUpHolidayHours()">Set up Holiday Hours</button>
								<button class="btn btn-primary"
								        @click="addImages()">Add Images</button>
								<router-link to="/app/store_manager/amenities">
									<button class="btn btn-primary">Set up Amenities</button>
								</router-link>
								<button class="btn"
								        @click="imDone()">I'm done</button>
							</div>
						</modal>
					</div>
				</div>
			</div>
			<div class="panel"
			     v-show="activeTab === 3">
				<div class="portlet light bordered">
					<div class="portlet-body form">
						<add-holiday-hours :selectedLocationId="newStoreId"
						                   :savingHolidayHours="savingHolidayHours"
						                   @addHolidayHours="addHolidayHours">
						</add-holiday-hours>
					</div>
				</div>
			</div>
			<div class="panel"
			     v-show="activeTab === 4">
				<store-images v-if="newStoreId !== null"
				              :storeId="newStoreId" />
			</div>
		</div>
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import Modal from '../../modules/Modal'
import StoresFunctions from '../../../controllers/Stores'
import MenuTiersFunctions from '../../../controllers/MenuTiers'
import AppFunctions from '../../../controllers/App'
import AddHolidayHours from './AddHolidayHours'
import StoreGroupsFunctions from '../../../controllers/StoreGroups'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import { mask } from 'vue-the-mask'
import { debounce, isEqual } from 'lodash'
import TimezonesArray from './TimezonesArray'
import StoreImages from '@/components/app/StoreManager/StoreImages'
import { mapMutations } from 'vuex'

/**
 * Define the email pattern to check for valid emails.
 * @var {regex}
 * @memberof Login
 */
var emailPattern = /^.+@.+\..+$/

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Store Manager', link: false },
				{ name: 'Create New Store', link: false }
			],
			displayStoreForm: false,
			errorMessage: '',
			loadingCreateNewStore: false,
			successMessage: '',
			storeInformationError: '',
			storeMetaError: '',
			storeHoursError: '',
			newStore: {
				locationsgroup_id: '',
				internal_id: null,
				name: '',
				display_name: '',
				address_line_1: '',
				address_line_2: '',
				city: '',
				province: '',
				country: '',
				postal_code: '',
				longitude: null,
				latitude: null,
				phone: '',
				fax: '',
				email: '',
				timezone: '',
				currency: '',
				status: 1,
				created_by: this.$root.createdBy,
				is_corporate: 0,
				api_key: null,
				menu_tier_id: null
			},
			locationDetails: {},
			activeTab: 0,
			createStoreMode: 'info',
			newStoreId: null,
			savingStoreMeta: false,
			newStoreMeta: {
				gst_number: '',
				opening_soon: 0,
				gift_card: 0,
				digital_reward: 0,
				catering: 0,
				current_catering_status: 0,
				delivery: 0,
				current_delivery_status: 0,
				online_ordering: 0,
				current_online_ordering_status: 0,
				merchant_id: null,
				merchant_key: null,
				created_by: this.$root.createdBy,
				enable_pickup_later: 0,
				external_online_ordering_enabled: 0,
				external_online_ordering_url: ''
			},
			savingStoreHours: false,
			newStoreHours: [
				{
					created_by: this.$root.createdBy,
					day: 1,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 2,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 3,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 4,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 5,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 6,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 0,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				}
			],
			savingHolidayHours: false,
			newHolidayHours: [],
			storeGroups: [],
			menuTiers: [],
			autocompleteFocused: false,
			steps: {
				step0_status: 'finish',
				step1_status: 'process',
				step2_status: 'process',
				step3_status: 'wait',
				step4_status: 'wait'
			},
			showHoursAlertModal: false,
			placesApi: {
				address_line_1: true,
				city: true,
				province: true,
				country: true,
				postal_code: true
			},
			timezones: []
		}
	},
	created () {
		this.timezones = TimezonesArray
		this.displayStoreForm = true
		// get store groups
		this.getStoreGroups()
		this.getMenuTiers()
	},
	mounted () {
		this.$refs.name.focus()
	},
	methods: {
		/**
		 * To move to the selected step
		 * @function
		 * @param {integer} step - The step to move to
		 * @returns {undefined}
		 */
		goToStep (step) {
			if (this.steps.step2_status === 'success') {
				this.activeTab = step
			}
		},
		/**
		 * To copy the time to other days.
		 * @function
		 * @param {string} time - The time to copy
		 * @param {object} event - The click event that initiated the action
		 * @returns {undefined}
		 */
		applyOpeningTimeToAll (time, event) {
			event.preventDefault()
			this.newStoreHours.forEach(day => {
				day.open_time = time
			})
		},
		/**
		 * To copy the time to other days.
		 * @function
		 * @param {string} time - The time to copy
		 * @param {object} event - The click event that initiated the action
		 * @returns {undefined}
		 */
		applyClosingTimeToAll (time, event) {
			event.preventDefault()
			this.newStoreHours.forEach(day => {
				day.close_time = time
			})
		},
		/**
		 * To get a list of store groups.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreGroups () {
			var storeGroupsVue = this
			storeGroupsVue.storeGroups = []
			return StoreGroupsFunctions.getGroups(
				storeGroupsVue.$root.appId,
				storeGroupsVue.$root.appSecret,
				storeGroupsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						storeGroupsVue.storeGroups = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch store groups',
						errorName: 'storeInformationError',
						vue: storeGroupsVue
					})
				})
		},
		/**
		 * To get a list of menu tiers.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getMenuTiers () {
			var storeGroupsVue = this
			return MenuTiersFunctions.getMenuTiers(
				storeGroupsVue.$root.corporateStoreId,
				storeGroupsVue.$root.appId,
				storeGroupsVue.$root.appSecret,
				storeGroupsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						storeGroupsVue.menuTiers = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch menu tiers',
						errorName: 'storeInformationError',
						vue: storeGroupsVue
					})
				})
		},
		/**
		 * To update the value of the 'is_corporate' field.
		 * @function
		 * @param {integer} val - The new value.
		 * @returns {undefined}
		 */
		updateStoreIsCorporate (val) {
			this.newStore.is_corporate = val
		},
		/**
		 * To update the value of the 'is_active' field.
		 * @function
		 * @param {integer} val - The new value.
		 * @returns {undefined}
		 */
		updateStoreActiveStatus (val) {
			this.newStore.is_active = val
		},
		/**
		 * To update the value of a store meta.
		 * @function
		 * @param {object} meta - The input meta object.
		 * @param {integer} event - The new value.
		 * @returns {undefined}
		 */
		updateCustom (meta, event) {
			meta.custom_value = event
		},
		/**
		 * To update the value of the store 'is_opened' field for a given day.
		 * @function
		 * @param {object} object - The day object.
		 * @param {integer} event - The new value.
		 * @returns {undefined}
		 */
		updateStoreOpenStatus (object, event) {
			object.open = event
		},
		/**
		 * To capitalize a value (note that this is currently only functional for words with 1 space)
		 * @function
		 * @param {string} val - The value to be capitalized.
		 * @returns {undefined}
		 */
		capitalize (val) {
			var output

			val = val.replace(/_/g, ' ')
			var index = val.indexOf(' ')

			if (index !== -1) {
				output =
					val.substring(0, 1).toUpperCase() +
					val.substring(1, index + 1) +
					val.substring(index + 1, index + 2).toUpperCase() +
					val.substring(index + 2)
			} else {
				output = val.substring(0, 1).toUpperCase() + val.substring(1)
			}
			return output
		},
		/**
		 * To clear the passed in error.
		 * @function
		 * @param {string} val - The error/message to be cleared
		 * @returns {undefined}
		 */
		clearError (val) {
			if (val === 'storeInformationError') {
				this.storeInformationError = ''
			} else if (val === 'storeMetaSuccess') {
				this.storeMetaSuccess = ''
			} else if (val === 'storeMetaError') {
				this.storeMetaError = ''
			} else if (val === 'storeHoursError') {
				this.storeHoursError = ''
			} else if (val === 'storeHolidayHoursError') {
				this.storeHolidayHoursError = ''
			}
		},
		/**
		 * To access a blank newStore object.
		 * @function
		 * @returns {object} a blank newStore object
		 */
		blankNewStore () {
			return {
				locationsgroup_id: '',
				internal_id: null,
				name: '',
				display_name: '',
				address_line_1: '',
				address_line_2: '',
				city: '',
				province: '',
				country: '',
				postal_code: '',
				longitude: null,
				latitude: null,
				phone: '',
				fax: '',
				email: '',
				timezone: '',
				currency: '',
				status: 1,
				created_by: this.$root.createdBy,
				is_corporate: 0,
				api_key: null,
				menu_tier_id: null
			}
		},
		/**
		 * To clear the form input.
		 * @function
		 * @returns {undefined}
		 */
		resetForm () {
			this.newStore = this.blankNewStore()
			this.storeInformationError = ''
			this.storeMetaError = ''
			this.storeHoursError = ''
			this.newStoreMeta = {
				gst_number: '',
				opening_soon: 0,
				gift_card: 0,
				digital_reward: 0,
				catering: 0,
				current_catering_status: 0,
				delivery: 0,
				current_delivery_status: 0,
				online_ordering: 0,
				current_online_ordering_status: 0,
				merchant_id: null,
				merchant_key: null,
				created_by: this.$root.createdBy,
				enable_pickup_later: 0,
				external_online_ordering_enabled: 0,
				external_online_ordering_url: ''
			}
			this.newHolidayHours = []
			this.newStoreHours = [
				{
					created_by: this.$root.createdBy,
					day: 1,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 2,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 3,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 4,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 5,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 6,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				},
				{
					created_by: this.$root.createdBy,
					day: 0,
					open: 1,
					open_time: '00:00',
					close_time: '00:00',
					status: 1
				}
			]
			this.steps = {
				step0_status: 'finish',
				step1_status: 'process',
				step2_status: 'process',
				step3_status: 'wait',
				step4_status: 'wait'
			}
			this.newStoreId = null
		},
		/**
		 * To check if the store data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateStoreData () {
			var createStoreVue = this
			return new Promise(function (resolve, reject) {
				if (!createStoreVue.newStore.name.length) {
					reject('Store name cannot be blank')
				} else if (!createStoreVue.newStore.address_line_1.length) {
					reject('Address line 1 cannot be blank')
				} else if (!createStoreVue.newStore.city.length) {
					reject('Store city cannot be blank')
				} else if (!createStoreVue.newStore.province.length) {
					reject('Store province cannot be blank')
				} else if (!createStoreVue.newStore.country.length) {
					reject('Store country cannot be blank')
				} else if (!createStoreVue.newStore.postal_code.length) {
					reject('Store postal code cannot be blank')
				} else if (!createStoreVue.newStore.timezone.length) {
					reject('Store timezone cannot be blank')
				} else if (!createStoreVue.newStore.currency.length) {
					reject('Store currency cannot be blank')
				} else if (createStoreVue.newStore.menu_tier_id === null) {
					reject('Menu tier cannot be blank')
				} else if (!createStoreVue.newStore.display_name.length) {
					reject('Store display name cannot be blank')
				} else if (createStoreVue.newStore.internal_id === null) {
					reject('Store internal id cannot be blank')
				} else if (createStoreVue.newStore.phone.length < 14) {
					reject('Store phone number should have at least 10 digits')
				} else if (
					createStoreVue.newStore.fax &&
					createStoreVue.newStore.fax.length < 14
				) {
					reject('Store fax number should have at least 10 digits')
				} else if (!createStoreVue.newStore.email.length) {
					reject('Store email cannot be blank')
				} else if (!emailPattern.test(createStoreVue.newStore.email)) {
					reject('Please enter a valid store email')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new store.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createNewStore (event) {
			this.loadingCreateNewStore = true
			var createStoreVue = this
			createStoreVue.clearError('storeInformationError')
			return createStoreVue
				.validateStoreData()
				.then(response => {
					createStoreVue.newStore.phone = createStoreVue.newStore.phone.replace(
						/[^\d]/g,
						''
					)
					createStoreVue.newStore.fax = createStoreVue.newStore.fax.replace(
						/[^\d]/g,
						''
					)
					if (!createStoreVue.newStore.fax) {
						createStoreVue.newStore.fax = '0000000000'
					}
					StoresFunctions.createNewStore(
						createStoreVue.newStore,
						createStoreVue.$root.appId,
						createStoreVue.$root.appSecret,
						createStoreVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								let temp = [...createStoreVue.$root.storeLocations]
								temp.push(response.payload)
								createStoreVue.setStoreLocations(temp)
								createStoreVue.newStoreId = response.payload.id
								createStoreVue.activeTab = 1
								createStoreVue.steps.step0_status = 'success'
								createStoreVue.steps.step1_status = 'finish'
								createStoreVue.createStoreMode = 'meta'
								createStoreVue.$nextTick(function () {
									createStoreVue.$refs.openingSoon.focus()
								})
							} else {
								createStoreVue.storeInformationError = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create the store',
								errorName: 'storeInformationError',
								vue: createStoreVue
							})
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					createStoreVue.storeInformationError = reason
					window.scrollTo(0, 0)
					throw reason
				})
				.finally(() => {
					createStoreVue.loadingCreateNewStore = false
				})
		},
		/**
		 * To check if the store meta data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateStoreMetaData () {
			var createStoreVue = this
			return new Promise(function (resolve, reject) {
				if (createStoreVue.newStoreMeta.opening_soon === 1) {
					resolve('Hurray')
				} else if (
					createStoreVue.newStoreMeta.external_online_ordering_enabled &&
					!createStoreVue.newStoreMeta.external_online_ordering_url
				) {
					reject('The external order link is required')
				} else if (createStoreVue.newStoreMeta.merchant_id === null) {
					reject('Merchant ID cannot be blank')
				} else if (createStoreVue.newStoreMeta.merchant_key === null) {
					reject('Merchant Key cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create meta for the newly created store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createStoreMeta () {
			var createStoreVue = this
			createStoreVue.clearError('storeMetaError')

			return createStoreVue
				.validateStoreMetaData()
				.then(response => {
					createStoreVue.savingStoreMeta = true
					if (createStoreVue.newStoreMeta.opening_soon === 1) {
						if (!createStoreVue.newStoreMeta.merchant_id) {
							createStoreVue.newStoreMeta.merchant_id = 0
						}
						if (!createStoreVue.newStoreMeta.merchant_key) {
							createStoreVue.newStoreMeta.merchant_key = 0
						}
					}

					StoresFunctions.createStoreMeta(
						createStoreVue.newStoreId,
						createStoreVue.newStoreMeta,
						createStoreVue.$root.appId,
						createStoreVue.$root.appSecret,
						createStoreVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								createStoreVue.activeTab = 2
								createStoreVue.steps.step1_status = 'success'
								createStoreVue.steps.step2_status = 'finish'
								createStoreVue.createStoreMode = 'hours'
							} else {
								createStoreVue.storeMetaError = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not save the store information',
								errorName: 'storeMetaError',
								vue: createStoreVue
							})
						})
						.finally(() => {
							createStoreVue.savingStoreMeta = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					createStoreVue.storeMetaError = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To check if the store data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateStoreHours () {
			var createStoreVue = this
			return new Promise(function (resolve, reject) {
				let hoursMissing = false
				let regex = new RegExp('[0-2][0-9]:[0-5][0-9]')
				createStoreVue.newStoreHours.forEach(day => {
					if (!regex.test(day.open_time) || !regex.test(day.close_time)) {
						hoursMissing = true
						return
					}
				})
				if (hoursMissing) {
					reject(
						'Opening and Closing Times cannot be empty. Enter 00:00 for days when the Store is closed.'
					)
				}
				resolve('Hurray')
			})
		},
		/**
		 * To set hours of operation for the newly created store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createStoreHours () {
			var createStoreVue = this
			createStoreVue.clearError('storeHoursError')

			return createStoreVue
				.validateStoreHours()
				.then(response => {
					createStoreVue.savingStoreHours = true
					StoresFunctions.createStoreHours(
						createStoreVue.newStoreId,
						createStoreVue.newStoreHours,
						createStoreVue.$root.appId,
						createStoreVue.$root.appSecret,
						createStoreVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								createStoreVue.showHoursAlert()
							} else {
								createStoreVue.storeHoursError = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: `We could not save store hours`,
								errorName: 'storeHoursError',
								vue: createStoreVue
							})
						})
						.finally(() => {
							createStoreVue.savingStoreHours = false
						})
				})
				.catch(reason => {
					createStoreVue.storeHoursError = reason
					window.scrollTo(0, 0)
				})
		},
		/**
		 * To ask the user if they want to set up other features.
		 * @function
		 * @returns {undefined}
		 */
		showHoursAlert () {
			this.showHoursAlertModal = true
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeHoursAlert () {
			this.showHoursAlertModal = false
		},
		/**
		 * To reset the store create form to blank.
		 * @function
		 * @returns {undefined}
		 */
		imDone () {
			this.closeHoursAlert()
			this.resetForm()
			this.activeTab = 0
			this.createStoreMode = 'info'
			window.scrollTo(0, 0)
		},
		/**
		 * To set the create form to add Holiday Hours.
		 * @function
		 * @returns {undefined}
		 */
		setUpHolidayHours () {
			this.closeHoursAlert()
			this.activeTab = 3
			this.steps.step2_status = 'success'

			this.steps.step3_status === 'wait'
				? (this.steps.step3_status = 'finish')
				: (this.steps.step3_status = this.steps.step3_status)

			this.steps.step4_status === 'wait'
				? (this.steps.step4_status = 'process')
				: (this.steps.step4_status = this.steps.step4_status)

			this.createStoreMode = 'optionals'
		},
		/**
		 * To to set the create form to add Images.
		 * @function
		 * @returns {undefined}
		 */
		addImages () {
			this.closeHoursAlert()
			this.activeTab = 4
			this.steps.step2_status = 'success'

			this.steps.step3_status === 'wait'
				? (this.steps.step3_status = 'process')
				: (this.steps.step3_status = this.steps.step3_status)

			this.steps.step4_status === 'wait'
				? (this.steps.step4_status = 'finish')
				: (this.steps.step4_status = this.steps.step4_status)
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showHolidayHoursAlert (payload = {}) {
			let title = 'Success'
			let html = `
				<div>
					The Holiday Hours have been created
					<br/><br/>
					<strong>
						Do you want to add store images?
					</strong>
				</div>`
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				html = `
					<div>
						The Holiday Hours have been sent for approval
					</div>`
				type = 'info'
			}

			this.$swal({
				title,
				html,
				type,
				showCancelButton: true,
				confirmButtonText: 'Yes',
				cancelButtonText: 'No'
			}).then(
				() => {
					this.addImages()
				},
				dismiss => {
					this.imDone()
				}
			)
		},
		/**
		 * To set the selected location and get its details.
		 * @function
		 * @param {object} location - The selected location object.
		 * @returns {undefined}
		 */
		selectLocation (location) {
			var commaIndex = location.description.indexOf(',')
			var locationSubString = location.description.substring(0, commaIndex)
			this.newStore.address_line_1 = locationSubString
			this.getGoogleLocationDetails(location.place_id)
		},
		/**
		 * To get complete details of a particular location using the google places API.
		 * @function
		 * @param {string} placeId - To google placeId of the selected location.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGoogleLocationDetails (placeId) {
			var createStoreVue = this
			AppFunctions.getGoogleLocationDetails(
				placeId,
				createStoreVue.$root.appId,
				createStoreVue.$root.appSecret
			)
				.then(response => {
					createStoreVue.locationDetails = response
					createStoreVue.newStore.latitude =
						createStoreVue.locationDetails.geometry.location.lat
					createStoreVue.newStore.longitude =
						createStoreVue.locationDetails.geometry.location.lng

					// empty all fields initially
					createStoreVue.newStore.country = ''
					createStoreVue.newStore.province = ''
					createStoreVue.newStore.city = ''
					createStoreVue.newStore.postal_code = ''

					// save new search location details
					for (
						var i = 0;
						i < createStoreVue.locationDetails.address_components.length;
						i++
					) {
						var item = createStoreVue.locationDetails.address_components[i]
						for (var j = 0; j < item.types.length; j++) {
							var subItem = item.types[j]
							if (
								subItem === 'postal_code' ||
								subItem === 'postal_code_prefix'
							) {
								createStoreVue.newStore.postal_code = item.long_name
							} else if (subItem === 'country') {
								createStoreVue.newStore.country = item.long_name
							} else if (subItem === 'administrative_area_level_1') {
								createStoreVue.newStore.province = item.long_name
							} else if (subItem === 'locality') {
								createStoreVue.newStore.city = item.long_name
							}
						}
					}
					createStoreVue.newStore.postal_code
						? (createStoreVue.placesApi.postal_code = true)
						: (createStoreVue.placesApi.postal_code = false)
					createStoreVue.newStore.country
						? (createStoreVue.placesApi.country = true)
						: (createStoreVue.placesApi.country = false)
					createStoreVue.newStore.city
						? (createStoreVue.placesApi.city = true)
						: (createStoreVue.placesApi.city = false)
					createStoreVue.newStore.province
						? (createStoreVue.placesApi.province = true)
						: (createStoreVue.placesApi.province = false)
				})
				.catch(reason => {})
		},
		/**
		 * To add holiday hours emitted by the child modal, to the list of holiday hours and submits the same to the backend.
		 * @function
		 * @param {object} val - The object emitted by the child.
		 * @returns {undefined}
		 */
		addHolidayHours (val) {
			this.newHolidayHours.push(val)
			this.createHolidayHours(val)
		},
		/**
		 * To submit the holiday hours (that are oassed in a parameter) to the backend.
		 * @function
		 * @param {object} val - The object emitted by the child.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createHolidayHours (val) {
			this.savingHolidayHours = true
			var createStoreVue = this

			StoresFunctions.createHolidayHours(
				val,
				createStoreVue.$root.appId,
				createStoreVue.$root.appSecret,
				createStoreVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						createStoreVue.steps.step3_status = 'success'
						createStoreVue.showHolidayHoursAlert(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not add the hours',
						errorName: 'storeHoursError',
						vue: createStoreVue
					})
				})
				.finally(() => {
					createStoreVue.savingHolidayHours = false
				})
		},
		/**
		 * To get results based off google's places search API.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		querySearch: debounce(function (string, cb) {
			var createStoreVue = this
			if (createStoreVue.newStore.address_line_1.length >= 3) {
				AppFunctions.getGoogleLocationSearchResults(
					createStoreVue.newStore.address_line_1,
					createStoreVue.$root.appId,
					createStoreVue.$root.appSecret
				)
					.then(response => {
						response.forEach(result => {
							result.value = result.description
						})
						cb(response)
					})
					.catch(reason => {
						if (reason.responseJSON) {
						}
						throw reason
					})
			}
		}, 500),
		/**
		 * To raise the autocomplete label.
		 * @function
		 * @returns {undefined}
		 */
		focusAutocomplete () {
			this.autocompleteFocused = true
		},
		/**
		 * To lower the autocomplete label.
		 * @function
		 * @returns {undefined}
		 */
		blurAutocomplete () {
			this.autocompleteFocused = false
		},
		/**
		 * To confirm abandonment of partially filled form.
		 * @function
		 * @param {object} del - An object with an exists propery set to true if the store needs to be removed from database
		 * @param {object} next - The function to call after store is deleted
		 * @returns {undefined}
		 */
		showDiscardWarning (del, next) {
			this.$swal({
				title: 'Discard Store?',
				text: 'This Store will not be saved if you leave this page.',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Discard',
				cancelButtonText: 'Cancel'
			}).then(
				() => {
					let createStoreVue = this
					if (del.exists) {
						StoresFunctions.deleteStore(
							createStoreVue.newStoreId,
							createStoreVue.$root.appId,
							createStoreVue.$root.appSecret,
							createStoreVue.$root.userToken
						)
							.then(response => {
								next()
							})
							.catch(reason => {
								next()
							})
					} else {
						next()
					}
				},
				dismiss => {}
			)
		},
		...mapMutations({
			setStoreLocations: 'SET_STORE_LOCATIONS'
		})
	},
	beforeRouteLeave (to, from, next) {
		let createStoreVue = this
		if (
			this.activeTab === 0 &&
			!isEqual(createStoreVue.newStore, createStoreVue.blankNewStore())
		) {
			this.showDiscardWarning({ exists: false }, next)
		} else if (
			this.activeTab !== 0 &&
			this.steps.step2_status !== 'finish' &&
			this.steps.step2_status !== 'success'
		) {
			this.showDiscardWarning({ exists: true }, next)
		} else {
			next()
		}
	},
	components: {
		Breadcrumb,
		AddHolidayHours,
		Modal,
		StoreImages
	},
	directives: {
		mask
	}
}
</script>

<style scoped>
.dropdown-menu {
  max-height: 150px;
  overflow: auto;
}
.align-middle {
  vertical-align: middle;
}
.md-autocomplete {
  width: 100%;
  height: 100%;
}
div.autocomplete-wrapper {
  margin-top: 35px;
  height: 45px;
  position: relative;
  width: 100%;
}
.fake-md-label {
  position: absolute;
  top: 4px;
  left: 0;
  color: #999;
  margin-bottom: 0;
  font-size: 14px;
  z-index: 2;
  pointer-events: none;
  transition-property: top, font-size, font-color, border-bottom-color;
  transition-duration: 0.2s;
  transition-timing-function: ease;
}
.fake-md-label.raised {
  font-size: 13px;
  top: -21px;
}
</style>
<style>
div.el-autocomplete.inline-input.md-autocomplete > div.el-input {
  height: 100%;
}
div.el-autocomplete.inline-input.md-autocomplete
  > div.el-input
  > input.el-input__inner {
  border-top-width: 0px;
  border-right-width: 0px;
  border-bottom-color: rgb(194, 202, 216);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-left-width: 0px;
  border-bottom: 1px solid #c2cad8;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgb(194, 202, 216);
  padding: 6px 0;
  border-radius: 0;
  height: 30px;
  margin-bottom: 10px;
  transition-property: border-bottom-color, border-bottom-width;
  transition-duration: 0.2s;
  transition-timing-function: ease;
}
div.el-autocomplete.inline-input.md-autocomplete.raised
  > div.el-input
  > input.el-input__inner {
  border-bottom-color: #36c6d3;
  border-bottom-width: 2px;
}
div.el-autocomplete.inline-input.md-autocomplete
  > div.el-input
  > input.el-input__inner::placeholder {
  color: #999;
}
</style>

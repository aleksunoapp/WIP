<template>
	<div>
		<div class="sideways-page-one">
			<!-- BEGIN PAGE BAR -->
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<!-- END PAGE BAR -->
			<!-- BEGIN PAGE TITLE-->
			<h1 class="page-title">Promo codes</h1>
			<!-- END PAGE TITLE -->

			<div class="note note-info">
				<p>Add and manage an application's promo codes.</p>
			</div>

			<!-- BEGIN CREATE NEW PROMO CODE -->
			<div class="portlet box blue-hoki"
			     v-if="$root.permissions['promocodes create']">
				<div class="portlet-title bg-blue-chambray"
				     @click="toggleCreatePromoCodePanel()">
					<div class="caption">
						<i class="fa fa-2x fa-plus-circle"></i>
						Create a New Promo Code
					</div>
					<div class="tools">
						<a :class="{'expand': !createNewPromoCodeCollapse, 'collapse': createNewPromoCodeCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body"
				     :class="{'display-hide': createNewPromoCodeCollapse}">
					<form role="form"
					      @submit.prevent="createNewPromoCode()">
						<div class="form-body row">
							<div class="col-md-12">
								<div class="alert alert-danger"
								     v-show="createErrorMessage"
								     ref="createErrorMessage">
									<button class="close"
									        @click.prevent="clearError('createErrorMessage')"></button>
									<span>{{ createErrorMessage }}</span>
								</div>
							</div>
							<div class="col-xs-9 col-md-5">
								<div class="form-group form-md-line-input form-md-floating-label">
									<div class="input-icon right">
										<input type="text"
										       class="form-control input-sm  text-uppercase"
										       :class="{'edited': newPromoCode.codes.length}"
										       id="form_control_1"
										       v-model="newPromoCode.codes">
										<i class="fa fa-magic clickable"
										   @click.prevent="setRandomCode(newPromoCode)"
										   aria-hidden="true"></i>
									</div>
									<label for="form_control_1">Enter a Code</label>
								</div>
								<div class="side-by-side-wrapper center">
									<div class="form-group form-md-line-input form-md-floating-label side-by-side-item margin-right-10">
										<input type="text"
										       class="form-control input-sm"
										       :class="{'edited': newPromoCode.value}"
										       id="form_control_2"
										       v-model="newPromoCode.value">
										<label for="form_control_2">Value of Promo Code</label>
									</div>
									<el-dropdown trigger="click"
									             @command="updateNewPromoCodeValueType"
									             size="small"
									             :show-timeout="50"
									             :hide-timeout="50">
										<el-button size="small">
											{{ newPromoCodeValueTypeLabel }}
											<i class="el-icon-arrow-down el-icon--right"></i>
										</el-button>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item command="percentage">%</el-dropdown-item>
											<el-dropdown-item command="dollar">$</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</div>
								<div class="side-by-side-wrapper center">
									<el-select v-model="newPromoCode.apply_on"
									           placeholder="Discount is applied to"
									           size="small">
										<el-option label="Menu Items"
										           value="items"></el-option>
										<el-option label="Delivery Fee"
										           value="delivery"></el-option>
									</el-select>
									<button v-if="newPromoCode.apply_on === 'items'"
									        type="submit"
									        class="btn blue btn-outline margin-left-5 mb-0"
									        @click="displayMenuTreeModal($event)">
										<span v-if="!newPromoCode.sku.length">Select</span>
										<span v-else>Add</span> items
									</button>
								</div>
								<p class="grey-label margin-left-5"
								   v-if="newPromoCode.sku.length">Selected
									<span>{{ newPromoCode.sku.length }}</span> item
									<span v-if="newPromoCode.sku.length !== 1">s</span>
								</p>
								<div class="margin-top-15">
									<el-dropdown trigger="click"
									             @command="updateNewPromoCodeType"
									             size="small"
									             :show-timeout="50"
									             :hide-timeout="50">
										<el-button size="small">
											{{ newPromoCodeTypeLabel }}
											<i class="el-icon-arrow-down el-icon--right"></i>
										</el-button>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item command="single_use">Single</el-dropdown-item>
											<el-dropdown-item command="multi_use">Multi</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       :class="{'edited': newPromoCode.max_use_per_person.length}"
									       id="form_control_3"
									       v-model="newPromoCode.max_use_per_person">
									<label for="form_control_3">Maximum Redemptions Per User</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label narrow-input">
									<input type="text"
									       class="form-control input-sm"
									       :class="{'edited': newPromoCode.max_use.length}"
									       id="form_control_4"
									       v-model="newPromoCode.max_use">
									<label for="form_control_4">Total Redemptions Permitted</label>
								</div>
							</div>
							<div class="col-xs-9 col-md-5">
								<div class="form-group form-md-line-input form-md-floating-label">
									<p class="date-label">Start Date</p>
									<el-date-picker v-model="newPromoCode.start_from"
									                format="yyyy-MM-dd"
									                value-format="yyyy-MM-dd"
									                :clearable="false"
									                placeholder="Select start date">
									</el-date-picker>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<p class="date-label">End Date</p>
									<el-date-picker v-model="newPromoCode.end_on"
									                format="yyyy-MM-dd"
									                value-format="yyyy-MM-dd"
									                :clearable="false"
									                placeholder="Select end date">
									</el-date-picker>
								</div>
								<div>
									<p class="inline margin-right-10">Availability</p>
									<button type="submit"
									        class="btn blue btn-outline"
									        @click="selectLocations(newPromoCode, $event, 'new')">Select stores</button>
									<p class="grey-label"
									   v-if="newPromoCode.locations.length">Selected
										<span v-if="newPromoCode.locations === 'all'">all</span>
										<span v-else>{{ newPromoCode.locations.length }}</span> store
										<span v-if="newPromoCode.locations.length !== 1">s</span>
									</p>
								</div>
							</div>
						</div>
						<div class="form-actions right margin-top-20">
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
			<!-- END CREATE NEW PROMO CODE -->

			<!-- BEGIN DISPLAY PROMO CODES -->
			<loading-screen :show="displayPromoCodesData"
			                :color="'#2C3E50'"
			                :display="'inline'"></loading-screen>
			<div v-if="!displayPromoCodesData">
				<div class="portlet light portlet-fit bordered margin-top-20"
				     id="promoCodes-container">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-default bold uppercase">Promo Codes</span>
							<div v-if="$root.permissions['promocodes update'] || $root.permissions['promocodes delete']"
							     class="caption-desc font-grey-cascade">Click on a promo code to edit or delete it.</div>
							<div v-if="$root.permissions['promocodes read'] && !$root.permissions['promocodes update']"
							     class="caption-desc font-grey-cascade">Click on a promo code to view it.</div>
						</div>
					</div>
					<div class="col-md-12">
						<div class="alert alert-danger"
						     v-show="assignErrorMessage"
						     ref="assignErrorMessage">
							<button class="close"
							        @click="clearError('assignErrorMessage')"></button>
							<span>{{ assignErrorMessage }}</span>
						</div>
					</div>
					<div class="portlet-body">
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
						<div class="mt-element-list margin-top-15"
						     v-if="promoCodes.length">
							<div class="mt-list-container list-news ext-1 no-border">
								<ul>
									<li class="mt-list-item actions-at-left margin-top-15"
									    :class="{'animated' : animated === `promoCode-${promoCode.id}`}"
									    v-for="promoCode in promoCodes"
									    :id="'promoCode-' + promoCode.id"
									    :key="`promoCode-${promoCode.id}`">
										<div class="list-item-actions">
											<el-tooltip v-if="$root.permissions['promocodes read'] && !$root.permissions['promocodes update']"
											            content="View"
											            effect="light"
											            placement="right">
												<a class="btn btn-circle btn-icon-only btn-default"
												   @click="editPromoCode(promoCode, $event)">
													<i class="fa fa-lg fa-eye"></i>
												</a>
											</el-tooltip>
											<el-tooltip v-if="$root.permissions['promocodes update']"
											            content="Edit"
											            effect="light"
											            placement="right">
												<a class="btn btn-circle btn-icon-only btn-default"
												   @click="editPromoCode(promoCode, $event)">
													<i class="fa fa-lg fa-pencil"></i>
												</a>
											</el-tooltip>
											<el-tooltip v-if="$root.permissions['promocodes delete']"
											            content="Delete"
											            effect="light"
											            placement="right">
												<a class="btn btn-circle btn-icon-only btn-default"
												   @click="deletePromoCode(promoCode, $event)">
													<i class="fa fa-lg fa-trash"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="list-item-content height-mod">
											<div class="col-sm-4">
												<div class="bold uppercase font-red">
													<span>{{ promoCode.codes }}</span>
												</div>
												<div>
													<strong>Value:</strong>
													<span v-if="promoCode.value_type === 'dollar'">$</span>
													<span>{{ promoCode.value }}</span>
													<span v-if="promoCode.value_type === 'percentage'">%</span>
												</div>
												<div>
													<strong>Applies to:</strong>
													<span>{{ promoCode.apply_on }}</span>
												</div>
											</div>
											<div class="col-sm-4">
												<div class="">
													<strong>Type:</strong>
													<span>{{ promoCode.type }}</span>
												</div>
												<div>
													<strong>Total Redemptions:</strong>
													<span>{{ promoCode.max_use }}</span>
												</div>
												<div>
													<strong>Max Per User:</strong>
													<span>{{ promoCode.max_use_per_person }}</span>
												</div>
											</div>
											<div class="col-sm-4">
												<div>
													<strong>Start:</strong>
													<span>{{ promoCode.start_from }}</span>
												</div>
												<div>
													<strong>End:</strong>
													<span>{{ promoCode.end_on }}</span>
												</div>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<div class="margin-top-20"
						     v-if="!promoCodes.length && !displayPromoCodesData">
							<no-results :show="!promoCodes.length"
							            :type="'promo codes'"></no-results>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- END DISPLAY PROMO CODES -->

		<!-- MENU ITEM PICKER MODAL START -->
		<modal :show="showMenuTreeModal"
		       effect="fade"
		       @closeOnEscape="closeMenuTreeModal"
		       :width="900">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeMenuTreeModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Select Items</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<menu-item-picker :previouslySelected="newPromoCode.sku"
				                  @update="itemsSelected">
				</menu-item-picker>
			</div>
			<div slot="modal-footer"
			     class="modal-footer">
				<button type="button"
				        class="btn btn-primary"
				        @click="closeMenuTreeModal()">Save</button>
			</div>
		</modal>
		<!-- MENU ITEM PICKER MODAL END -->

		<select-location v-if="showSelectLocationModal"
		                 :promoCode="passedPromoCode"
		                 @closeSelectLocationModal="closeSelectLocationModal">
		</select-location>

		<edit-promoCode v-if="showEditPromoCodeModal"
		                :promoCodeId="passedPromoCode.id"
		                @updatePromoCode="updatePromoCode"
		                @closeEditPromoCodeModal="closeEditPromoCodeModal">
		</edit-promoCode>

		<delete-promoCode v-if="deletePromoCodeModalActive"
		                  :selectedPromoCodeId="selectedPromoCodeId"
		                  @closeDeletePromoCodeModal="closeDeletePromoCodeModal"
		                  @deletePromoCodeAndCloseModal="deletePromoCodeAndCloseModal">
		</delete-promoCode>
	</div>
</template>

<script>
import Breadcrumb from '../modules/Breadcrumb'
import LoadingScreen from '../modules/LoadingScreen'
import PromoCodesFunctions from '../../controllers/PromoCodes'
import Modal from '../modules/Modal'
import Dropdown from '../modules/Dropdown'
import NoResults from '../modules/NoResults'
import EditPromoCode from './PromoCodes/EditPromoCode'
import DeletePromoCode from './PromoCodes/DeletePromoCode'
import SelectLocation from './PromoCodes/SelectLocation'
import $ from 'jquery'
import { debounce } from 'lodash'
import MenuItemPicker from '@/components/modules/MenuItemPicker'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Promo codes', link: false }],
			displayPromoCodesData: false,
			promoCodes: [],
			createErrorMessage: '',
			listErrorMessage: '',
			assignErrorMessage: '',
			createNewPromoCodeCollapse: true,
			creating: false,
			newPromoCode: {
				apply_on: '',
				codes: '',
				end_on: '',
				locations: [],
				max_use: '',
				max_use_per_person: '',
				sku: [],
				start_from: '',
				type: '',
				value: '',
				value_type: ''
			},
			editedPromoCode: {},
			showGalleryModal: false,
			showEditPromoCodeModal: false,
			selectedPromoCodeId: 0,
			deletePromoCodeModalActive: false,
			showSidewaysPageTwo: false,
			passedPromoCode: {},
			animated: '',
			showSelectLocationModal: false,
			showMenuTreeModal: false
		}
	},
	computed: {
		newPromoCodeValueTypeLabel () {
			if (this.newPromoCode.value_type === 'percentage') {
				return '%'
			} else if (this.newPromoCode.value_type === 'dollar') {
				return '$'
			} else {
				return 'Select value type'
			}
		},
		newPromoCodeTypeLabel () {
			if (this.newPromoCode.type === 'single_use') {
				return 'Single'
			} else if (this.newPromoCode.type === 'multi_use') {
				return 'Multi'
			} else {
				return 'Single or Multi Use?'
			}
		}
	},
	created () {
		let selectLocationVue = this

		$(window).on(
			'resize',
			debounce(() => {
				if (selectLocationVue.showSidewaysPageTwo) {
					selectLocationVue.computeHeight()
				}
			}, 200)
		)
	},
	mounted () {
		this.getAllPromoCodes()
	},
	methods: {
		/**
		 * To update selection of items
		 * @function
		 * @param {array} items - Array of items selected by user
		 * @returns {undefined}
		 */
		itemsSelected (items) {
			this.newPromoCode.sku = items.map(item => item.sku)
		},
		/**
		 * To generate a random string from the characters provided
		 * @function
		 * @param {ingeger} length - The length of the string provided]
		 * @param {string} chars - All the characters allowed in the string
		 * @returns {string} A random string of the length provided
		 */
		randomString (length, chars) {
			var result = ''
			for (var i = length; i > 0; --i) {
				result += chars[Math.floor(Math.random() * chars.length)]
			}
			return result
		},
		/**
		 * To set the promo code to a random 6 digit all caps alphanumeric string
		 * @function
		 * @param {object} code - The code object to modify
		 * @returns {undefined}
		 */
		setRandomCode (code) {
			code.codes = this.randomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')
		},
		/**
		 * To update the value_type property of newPromoCode.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateNewPromoCodeValueType (value) {
			this.newPromoCode.value_type = value
		},
		/**
		 * To update the type property of newPromoCode.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateNewPromoCodeType (value) {
			this.newPromoCode.type = value
		},
		/**
		 * To display the modal to select items.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayMenuTreeModal (event) {
			event.preventDefault()
			if (!this.$root.activeLocation.id) {
				this.showLocationAlert()
				return
			}
			this.showMenuTreeModal = true
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
			}).then(
				() => {
					// do nothing
				},
				dismiss => {
					// do nothing
				}
			)
		},
		/**
		 * To close the menu tree modal.
		 * @function
		 * @param {object} items - An object containing the selected items
		 * @returns {undefined}
		 */
		closeMenuTreeModal (items) {
			this.showMenuTreeModal = false
		},
		/**
		 * To close anything active in the side panel
		 * @function
		 * @param {object} selectedLocations - The array of selected locations
		 * @returns {undefined}
		 */
		closeSelectLocationModal (selectedLocations) {
			if (selectedLocations) {
				this.newPromoCode.locations = selectedLocations
			}
			this.showSelectLocationModal = false
		},
		/**
		 * To activate the right half panel which lists the store locations.
		 * @function
		 * @param {object} promoCode - The selected promoCode
		 * @param {object} event - The click event that triggered the function
		 * @returns {undefined}
		 */
		selectLocations (promoCode, event) {
			event.preventDefault()
			this.passedPromoCode = promoCode
			this.showSelectLocationModal = true
		},
		/**
		 * To display the modal for deleting a promoCode.
		 * @function
		 * @param {object} promoCode - The selected promoCode
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		deletePromoCode (promoCode, event) {
			event.stopPropagation()
			this.selectedPromoCodeId = promoCode.id
			this.deletePromoCodeModalActive = true
		},
		/**
		 * To close the modal for deleting a promoCode.
		 * @function
		 * @returns {undefined}
		 */
		closeDeletePromoCodeModal () {
			this.deletePromoCodeModalActive = false
		},
		/**
		 * To close the modal for deleting a promoCode and remove that promoCode from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deletePromoCodeAndCloseModal () {
			this.deletePromoCodeModalActive = false
			for (var i = 0; i < this.promoCodes.length; i++) {
				if (
					parseInt(this.promoCodes[i].id) === parseInt(this.selectedPromoCodeId)
				) {
					this.promoCodes.splice(i, 1)
					break
				}
			}
		},
		/**
		 * To show the modal to edit a promo code's details.
		 * @function
		 * @param {object} promoCode - The selected promo code object.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editPromoCode (promoCode, event) {
			event.stopPropagation()
			if (!this.$root.activeLocation.id) {
				this.showLocationAlert()
				return
			}
			this.passedPromoCode = promoCode
			this.showEditPromoCodeModal = true
		},
		/**
		 * To get a list of all promoCodes.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllPromoCodes () {
			this.displayPromoCodesData = true
			this.promoCodes = []
			var promoCodesVue = this
			return PromoCodesFunctions.getAllPromoCodes(
				promoCodesVue.$root.appId,
				promoCodesVue.$root.appSecret,
				promoCodesVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						promoCodesVue.displayPromoCodesData = false
						promoCodesVue.promoCodes = response.payload
						for (var i = 0; i < promoCodesVue.promoCodes.length; i++) {
							promoCodesVue.$set(promoCodesVue.promoCodes[i], 'selected', false)
						}
					} else {
						promoCodesVue.displayPromoCodesData = false
					}
				})
				.catch(reason => {
					promoCodesVue.displayPromoCodesData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch promocodes',
						errorName: 'listErrorMessage',
						vue: promoCodesVue
					})
				})
		},
		/**
		 * To close the modal for editing a promoCode.
		 * @function
		 * @returns {undefined}
		 */
		closeEditPromoCodeModal () {
			this.showEditPromoCodeModal = false
		},
		/**
		 * To clear the new promoCode form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewPromoCode () {
			this.newPromoCode = {
				apply_on: '',
				codes: '',
				end_on: '',
				locations: [],
				max_use: '',
				max_use_per_person: '',
				sku: [],
				start_from: '',
				type: '',
				value: '',
				value_type: ''
			}
		},
		/**
		 * To check if a date is in the past.
		 * @function
		 * @param {string} date - The date string to verify.
		 * @returns {boolean} True if date is in the past, false if not
		 */
		isPast (date) {
			let input = new Date(date)
			input.setMinutes(input.getMinutes() + input.getTimezoneOffset())
			let today = new Date()
			let inputDay = input.getDate()
			if (inputDay < 10) {
				inputDay = '0' + inputDay
			}
			let inputMonth = input.getMonth()
			if (inputMonth < 10) {
				inputMonth = '0' + inputMonth
			}
			let inputYear = input.getFullYear()
			let todayDay = today.getDate()
			if (todayDay < 10) {
				todayDay = '0' + todayDay
			}
			let todayMonth = today.getMonth()
			if (todayMonth < 10) {
				todayMonth = '0' + todayMonth
			}
			let todayYear = today.getFullYear()

			return (
				`${todayYear}-${todayMonth}-${todayDay}` >
				`${inputYear}-${inputMonth}-${inputDay}`
			)
		},
		/**
		 * To check if the promo code data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validatePromoCodeData () {
			var promoCodesVue = this
			return new Promise(function (resolve, reject) {
				if (!promoCodesVue.newPromoCode.codes.length) {
					reject('Code cannot be blank')
				} else if (
					!/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(
						promoCodesVue.newPromoCode.value
					)
				) {
					reject('Value Of Promo Code cannot be blank and must be a number')
				} else if (!promoCodesVue.newPromoCode.value_type.length) {
					reject('Value Type cannot be blank')
				} else if (!promoCodesVue.newPromoCode.apply_on.length) {
					reject('Discount Is Applied To cannot be blank')
				} else if (
					promoCodesVue.newPromoCode.apply_on === 'items' &&
					promoCodesVue.newPromoCode.sku.length === 0
				) {
					reject('Select at least one item')
				} else if (!promoCodesVue.newPromoCode.type.length) {
					reject('Single or Multi Use cannot be blank')
				} else if (
					!/^\+?(0|[1-9]\d*)$/.test(
						promoCodesVue.newPromoCode.max_use_per_person
					)
				) {
					reject(
						'Maximum Redemptions Per User cannot be blank and must be a number'
					)
				} else if (
					!/^\+?(0|[1-9]\d*)$/.test(promoCodesVue.newPromoCode.max_use)
				) {
					reject(
						'Total Redemptions Permitted cannot be blank and must be a number'
					)
				} else if (!promoCodesVue.newPromoCode.apply_on.length) {
					reject('Applies to cannot be blank')
				} else if (!promoCodesVue.newPromoCode.start_from.length) {
					reject('Please select Start Date')
				} else if (
					promoCodesVue.isPast(promoCodesVue.newPromoCode.start_from)
				) {
					reject('Start Date cannot be in the past')
				} else if (!promoCodesVue.newPromoCode.end_on.length) {
					reject('Please select End Date')
				} else if (promoCodesVue.isPast(promoCodesVue.newPromoCode.end_on)) {
					reject('End Date cannot be in the past')
				} else if (
					new Date(promoCodesVue.newPromoCode.end_on) <
					new Date(promoCodesVue.newPromoCode.start_from)
				) {
					reject('End Date cannot be before Start Date')
				} else if (!promoCodesVue.newPromoCode.locations.length) {
					reject('Select at least one location')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new promoCode.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createNewPromoCode () {
			var promoCodesVue = this
			promoCodesVue.clearError('createErrorMessage')

			return promoCodesVue
				.validatePromoCodeData()
				.then(response => {
					promoCodesVue.creating = true
					let newPromoCode = promoCodesVue.newPromoCode
					newPromoCode.codes = newPromoCode.codes.toUpperCase()
					newPromoCode.locations = newPromoCode.locations.toString()
					newPromoCode.sku = newPromoCode.sku.toString()
					PromoCodesFunctions.createNewPromoCode(
						promoCodesVue.newPromoCode,
						promoCodesVue.$root.appId,
						promoCodesVue.$root.appSecret,
						promoCodesVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								promoCodesVue.getAllPromoCodes()
								promoCodesVue.showAlert()
							} else {
								promoCodesVue.createErrorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add the promocode',
								errorName: 'createErrorMessage',
								vue: promoCodesVue
							})
						})
						.finally(() => {
							promoCodesVue.creating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					promoCodesVue.createErrorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To alert the user that the promoCode has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text:
					"PromoCode '" +
					this.newPromoCode.codes +
					"' has been successfully added!",
				type: 'success',
				confirmButtonText: 'OK'
			}).then(
				() => {
					this.clearNewPromoCode()
				},
				dismiss => {
					// do nothing
				}
			)
		},
		/**
		 * To update the promoCode info.
		 * @function
		 * @param {object} promoCode - The promoCode object that is to be updated.
		 * @returns {undefined}
		 */
		updatePromoCode (promoCode) {
			this.displayEditPromoCodeModal = false
			for (var i = 0; i < this.promoCodes.length; i++) {
				if (this.promoCodes[i].id === promoCode.id) {
					this.promoCodes[i] = promoCode
				}
			}
			this.animated = `promoCode-${promoCode.id}`
			let promoCodesVue = this
			window.setTimeout(() => {
				promoCodesVue.animated = ''
			}, 3000)
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
		toggleCreatePromoCodePanel () {
			this.createNewPromoCodeCollapse = !this.createNewPromoCodeCollapse
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
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.showGalleryModal = false
			this.newPromoCode.image = val.image_url
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		Modal,
		NoResults,
		EditPromoCode,
		DeletePromoCode,
		Dropdown,
		SelectLocation,
		MenuItemPicker
	}
}
</script>

<style scoped>
.sideways-page-one.disabled {
  overflow: hidden;
}
.sideways-page-two {
  overflow-y: scroll;
}
.dropdown {
  margin-bottom: 10px;
}
.side-by-side-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.side-by-side-wrapper.start {
  align-items: flex-start;
}
.side-by-side-wrapper.center {
  align-items: center;
}
.side-by-side-item {
  max-width: 45%;
}
.dropdown.side-by-side-item {
  margin-left: 10px;
}
.date-label {
  color: rgb(136, 136, 136);
  font-size: 13px;
  margin-bottom: 5px;
}
.grey-label {
  color: rgb(153, 153, 153);
}
.mb-0 {
  margin-bottom: 0;
}
.mt-element-list
  .list-news.ext-1.mt-list-container
  ul
  > .mt-list-item
  > .list-datetime,
.mt-element-list
  .list-news.ext-1.mt-list-container
  ul
  > .mt-list-item
  > .list-item-content {
  padding-left: 20px;
}
.animated {
  animation: listItemHighlight 1s 2 ease-in-out both;
}
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover {
  background-color: white;
}
</style>

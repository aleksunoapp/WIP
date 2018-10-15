<template>
	<modal :show="showEditPromoCodeModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       :width="modalWidth">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title">
				<span v-if="!selectLocationsMode">Update Promo Code</span>
				<h4 v-else-if="selectLocationsMode"
				    class="modal-title center">
					<i class="fa fa-chevron-left clickable pull-left back-button"
					   @click="closeModal()"></i> Select Stores</h4>
			</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<loading-screen :show="displaySpinner"
			                :color="'#2C3E50'"
			                :display="'inline'">
			</loading-screen>

			<form v-show="!selectItemsMode && !selectLocationsMode && !displaySpinner"
			      role="form"
			      @submit.prevent="createNewpromoCode()">
				<div class="form-body row">
					<div class="col-md-12">
						<div class="alert alert-danger"
						     v-if="errorMessage.length">
							<button class="close"
							        data-close="alert"
							        @click="clearError('errorMessage')"></button>
							<span>{{ errorMessage }}</span>
						</div>
					</div>
					<div class="col-xs-7">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input ref="codes"
							       type="text"
							       class="form-control input-sm  text-uppercase"
							       :class="{'edited': promoCode.codes.length}"
							       id="form_control_1"
							       v-model="promoCode.codes"
										 :disabled="!can('promocodes update')">
							<label for="form_control_1">Enter a Code</label>
						</div>
						<div class="side-by-side-wrapper">
							<div class="form-group form-md-line-input form-md-floating-label side-by-side-item">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': promoCode.value}"
								       id="form_control_2"
								       v-model="promoCode.value"
											 :disabled="!can('promocodes update')">
								<label for="form_control_2">Value of Promo Code</label>
							</div>
							<el-select v-model="promoCode.value_type"
							           placeholder="Select type"
							           size="mini"
							           class="margin-bottom-15"
												 :disabled="!can('promocodes update')">
								<el-option label="%"
								           value="percentage">
								</el-option>
								<el-option label="$"
								           value="dollar">
								</el-option>
							</el-select>
						</div>
						<div>
							<el-select v-model="promoCode.apply_on"
							           placeholder="Discount is applied to"
							           size="mini"
							           class="margin-bottom-15"
												 :disabled="!can('promocodes update')">
								<el-option label="Menu Items"
								           value="items">
								</el-option>
								<el-option label="Delivery Fee"
								           value="delivery">
								</el-option>
								<el-option label="Cart"
								           value="cart">
								</el-option>
							</el-select>
							<button v-if="promoCode.apply_on === 'items'"
							        type="submit"
							        class="btn blue btn-outline select-items-button"
							        @click="displayMenuTreeModal($event)">
								Select items
							</button>
							<p class="grey-label"
							   v-if="promoCode.sku_array.length">Selected {{ promoCode.sku_array.length }}
								<span v-if="promoCode.sku_array.length !== 1">items</span>
								<span v-else>item</span>
							</p>
						</div>
						<div>
							<el-select v-model="promoCode.type"
							           placeholder="Single or Multi Use?"
							           size="mini"
							           class="margin-bottom-15"
												 :disabled="!can('promocodes update')">
								<el-option label="Single Use"
								           value="single_use">
								</el-option>
								<el-option label="Multi Use"
								           value="multi_use">
								</el-option>
							</el-select>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm"
							       :class="{'edited': promoCode.max_use_per_person !== ''}"
							       id="form_control_3"
							       v-model="promoCode.max_use_per_person"
										 :disabled="!can('promocodes update')">
							<label for="form_control_3">Maximum Redemptions Per User</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label narrow-input">
							<input type="text"
							       class="form-control input-sm"
							       :class="{'edited': promoCode.max_use  !== ''}"
							       id="form_control_4"
							       v-model="promoCode.max_use"
										 :disabled="!can('promocodes update')">
							<label for="form_control_4">Total Redemptions Permitted</label>
						</div>
						<div class="form-group">
							<p class="date-label">Start Date</p>
							<el-date-picker v-model="promoCode.start_from"
							                format="yyyy-MM-dd"
							                value-format="yyyy-MM-dd"
							                :clearable="false"
							                placeholder="Select start date"
															:disabled="!can('promocodes update')">
							</el-date-picker>
						</div>
						<div class="form-group">
							<p class="date-label">End Date</p>
							<el-date-picker v-model="promoCode.end_on"
							                format="yyyy-MM-dd"
							                value-format="yyyy-MM-dd"
							                :clearable="false"
							                placeholder="Select end date"
															:disabled="!can('promocodes update')">
							</el-date-picker>
						</div>
						<div>
							<p class="inline margin-right-10">Availability</p>
							<button type="submit"
							        class="btn blue btn-outline"
							        @click="selectLocations($event, 'new')">{{can('update promocode') ? 'Select' : 'View'}} Stores</button>
							<p class="grey-label margin-top-10"
							   v-if="promoCode.locations.length">Selected
								<span v-if="promoCode.locations === 'all'">all</span>
								<span v-else>{{ promoCode.locations.length }}</span>
								<span v-if="promoCode.locations.length !== 1">locations</span>
								<span v-else>location</span>
							</p>
						</div>
					</div>
				</div>
				<div class="form-actions right margin-top-20">
				</div>
			</form>

			<menu-item-picker v-if="selectItemsMode"
			                  :previouslySelected="promoCode.sku_array"
			                  @update="itemsSelected">
			</menu-item-picker>

			<select-locations-popup v-if="!displaySpinner && !selectItemsMode && selectLocationsMode"
			                        @closeSelectLocationsPopup='selectStores'
															:editable="can('update promocode')"
			                        :previouslySelected="promoCode.locations">
			</select-locations-popup>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button v-if="selectItemsMode"
			        type="button"
			        class="btn btn-primary"
			        @click="closeItemSelector()">
				Done
			</button>
			<button v-if="!selectItemsMode && !selectLocationsMode && !selectItemsMode && can('promocodes update')"
			        type="button"
			        class="btn btn-primary"
			        @click="updatePromoCode()">
				Update
			</button>
			<button v-if="!selectItemsMode && !selectLocationsMode && !selectItemsMode && !can('promocodes update')"
			        type="button"
			        class="btn btn-primary"
			        @click="closeEditPromoCodeModal()">
				Close
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import PromoCodesFunctions from '../../../controllers/PromoCodes'
import App from '../../../controllers/App'
import Dropdown from '../../modules/Dropdown'
import LoadingScreen from '../../modules/LoadingScreen'
import SelectLocationsPopup from '../../modules/SelectLocationsPopup'
import MenuItemPicker from '@/components/modules/MenuItemPicker'
import { mapGetters } from 'vuex'

export default {
	data () {
		return {
			showEditPromoCodeModal: false,
			errorMessage: '',
			selectLocationsMode: false,
			selectItemsMode: false,
			locations: [],
			selectAllSelected: false,
			selectAllLocationsSelected: false,
			showMenuTreeModal: false,
			menus: [],
			categories: [],
			items: [],
			isMenuSelected: false,
			isCategorySelected: false,
			activeMenu: {},
			activeCategory: {},
			promoCode: {
				apply_on: '',
				codes: '',
				end_on: '',
				locations: [],
				max_use: '',
				max_use_per_person: '',
				sku: [],
				sku_array: [],
				start_from: '',
				type: '',
				value: '',
				value_type: ''
			},
			displaySpinner: false
		}
	},
	computed: {
		modalWidth () {
			if (this.selectItemsMode) {
				return 900
			} else {
				return null
			}
		},
		...mapGetters(['can', 'canAny'])
	},
	props: {
		promoCodeId: {
			type: Number
		}
	},
	mounted () {
		this.getAllPromoCodeDetails()
		this.promoCode.locations === 'all'
			? (this.selectAllLocationsSelected = true)
			: (this.selectAllLocationsSelected = false)
		this.getPaginatedStoreLocations()
	},
	methods: {
		/**
		 * To update selection of items
		 * @function
		 * @param {array} items - Array of items selected by user
		 * @returns {undefined}
		 */
		itemsSelected (items) {
			if (this.can('promocodes update')) {
				this.promoCode.sku_array = items.map(item => item.sku)
			}
		},
		/**
		 * To keep the select all checkbox in sync with the list
		 * @function
		 * @param {boolean} selected - State of the just-modified checkbox
		 * @returns {undefined}
		 */
		syncSelectAll (selected) {
			if (!selected) {
				this.selectAllSelected = false
			}
			this.selectAllSelected = !this.items.some(item => !item.selected)
		},
		/**
		 * To get details of the promo code being edited.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllPromoCodeDetails () {
			this.displaySpinner = true
			var editPromoCodeVue = this
			return PromoCodesFunctions.getAllPromoCodeDetails(
				editPromoCodeVue.$root.appId,
				editPromoCodeVue.$root.appSecret,
				editPromoCodeVue.$root.activeLocation.id,
				editPromoCodeVue.promoCodeId
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						if (!response.payload.hasOwnProperty('sku_array')) {
							response.payload.sku_array = response.payload.sku.split(
								','
							)
						}

						if (response.payload.locations !== 'all') {
							response.payload.locations = response.payload.locations
								.split(',')
								.map(id => parseInt(id))
						}

						editPromoCodeVue.promoCode = response.payload
						editPromoCodeVue.displaySpinner = false
						editPromoCodeVue.$nextTick(function () {
							editPromoCodeVue.$refs.codes.focus()
						})
						editPromoCodeVue.showEditPromoCodeModal = true
					}
				})
				.catch(reason => {
					editPromoCodeVue.showEditPromoCodeModal = true
					if (
						reason.responseJSON.code === 401 &&
						reason.responseJSON.status === 'unauthorized'
					) {
						editPromoCodeVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
					}
					editPromoCodeVue.displaySpinner = false
					throw reason
				})
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
		selectAll () {
			var menuTreeVue = this
			for (var i = 0; i < menuTreeVue.items.length; i++) {
				var item = menuTreeVue.items[i]
				menuTreeVue.$set(
					item,
					'selected',
					this.selectAllLocationsSelected
				)
			}
		},
		/**
		 * To close the item selector
		 * @function
		 * @returns {undefined}
		 */
		closeItemSelector () {
			this.selectItemsMode = false
		},
		/**
		 * To display the modal to select items.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayMenuTreeModal (event) {
			event.preventDefault()
			this.selectItemsMode = true
		},
		/**
		 * To check if a date is in the past.
		 * @function
		 * @param {string} date - The date string to verify.
		 * @returns {boolean} True if date is in the past, false if not
		 */
		isPast (date) {
			let input = new Date(date)
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
		 * To record the selected locations in the new or edited promo code object.
		 * @function
		 * @param {array} selectedStores - An array of ids of the stores selected
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		selectStores (selectedStores) {
			if (this.can('promocodes update')) {
				this.promoCode.locations = selectedStores
			}
			this.selectLocationsMode = false
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
		selectAllLocations () {
			this.selectAllSelected = !this.selectAllSelected
			for (var i = 0; i < this.locations.length; i++) {
				this.locations[i].selected = this.selectAllSelected
			}
		},
		/**
		 * To get a list of location for the current application/business.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPaginatedStoreLocations () {
			var editPromoCodeVue = this
			let paginationPreferences = {
				brand_id: this.$root.brandId
			}
			App.getPaginatedStoreLocations(
				editPromoCodeVue.$root.appId,
				editPromoCodeVue.$root.appSecret,
				editPromoCodeVue.$root.userToken,
				paginationPreferences
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						response.payload.forEach(location => {
							if (
								editPromoCodeVue.promoCode.locations === 'all'
							) {
								location.selected = true
							} else {
								location.selected = editPromoCodeVue.promoCode.locations.includes(
									parseInt(location.id)
								)
							}
						})
						editPromoCodeVue.locations = response.payload
					}
				})
				.catch(reason => {
					if (
						reason.responseJSON.code === 401 &&
						reason.responseJSON.status === 'unauthorized'
					) {
						editPromoCodeVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
					}
					throw reason
				})
		},
		/**
		 * To toggle select location mode on.
		 * @function
		 * @param {object} event - The event that triggered the action
		 * @returns {undefined}
		 */
		selectLocations (event) {
			event.preventDefault()
			this.selectLocationsMode = true
		},
		/**
		 * To check if the promo code data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validatePromoCodeData () {
			var promoCodesVue = this
			return new Promise(function (resolve, reject) {
				if (!promoCodesVue.promoCode.codes.length) {
					reject('Code cannot be blank')
				} else if (
					!/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(
						promoCodesVue.promoCode.value
					)
				) {
					reject(
						'Value Of Promo Code cannot be blank and must be a number'
					)
				} else if (!promoCodesVue.promoCode.value_type.length) {
					reject('Value Type cannot be blank')
				} else if (!promoCodesVue.promoCode.apply_on.length) {
					reject('Discount Is Applied To cannot be blank')
				} else if (
					promoCodesVue.promoCode.apply_on === 'items' &&
					!promoCodesVue.promoCode.sku_array.length
				) {
					reject('Select at least one item')
				} else if (!promoCodesVue.promoCode.type.length) {
					reject('Single or Multi Use cannot be blank')
				} else if (
					!/^\+?(0|[1-9]\d*)$/.test(
						promoCodesVue.promoCode.max_use_per_person
					)
				) {
					reject(
						'Maximum Redemptions Per User cannot be blank and must be a number'
					)
				} else if (
					!/^\+?(0|[1-9]\d*)$/.test(promoCodesVue.promoCode.max_use)
				) {
					reject(
						'Total Redemptions Permitted cannot be blank and must be a number'
					)
				} else if (!promoCodesVue.promoCode.apply_on.length) {
					reject('Applies to cannot be blank')
				} else if (
					typeof new Date(promoCodesVue.promoCode.start_from)
						.getMonth !== 'function'
				) {
					reject('Please select Start Date and Time')
				} else if (
					typeof new Date(promoCodesVue.promoCode.end_on).getMonth !==
					'function'
				) {
					reject('Please select End Date and Time')
				} else if (
					promoCodesVue.isPast(promoCodesVue.promoCode.end_on)
				) {
					reject('End Date cannot be in the past')
				} else if (
					new Date(promoCodesVue.promoCode.end_on) <
					new Date(promoCodesVue.promoCode.start_from)
				) {
					reject('End Date cannot be before Start Date')
				} else if (!promoCodesVue.promoCode.locations.length) {
					reject('Select at least one location')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To format a date object into a string.
		 * @function
		 * @param {object} date - The date object that is to be formatted.
		 * @returns {string} A string formatted YYYY-MM-DD HH:MM:SS
		 */
		formatDateTimeForApi (date) {
			date = new Date(date)
			let year = date.getFullYear()
			let month = date.getMonth() + 1
			let day = date.getDate()

			if (month < 10) {
				month = '0' + month
			}
			if (day < 10) {
				day = '0' + day
			}

			return `${year}-${month}-${day}`
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
		 * To update an existing promoCode.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updatePromoCode () {
			var editPromoCodeVue = this
			editPromoCodeVue.clearError()

			return editPromoCodeVue
				.validatePromoCodeData()
				.then(response => {
					let promoCode = editPromoCodeVue.promoCode
					promoCode.sku = editPromoCodeVue.promoCode.sku_array.toString()
					promoCode.locations = editPromoCodeVue.promoCode.locations.toString()
					if (editPromoCodeVue.promoCode.locations.length === 1) {
						editPromoCodeVue.promoCode.locations = editPromoCodeVue.promoCode.locations[0].toString()
					}

					PromoCodesFunctions.updatePromoCode(
						promoCode,
						editPromoCodeVue.$root.appId,
						editPromoCodeVue.$root.appSecret,
						editPromoCodeVue.$root.userToken
					)
						.then(response => {
							if (
								response.code === 200 &&
								response.status === 'ok'
							) {
								this.showEditSuccess(response.payload)
								this.closeModalAndUpdate()
							} else {
								editPromoCodeVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							if (
								reason.responseJSON.code === 401 &&
								reason.responseJSON.status === 'unauthorized'
							) {
								editPromoCodeVue.$router.push('/login/expired')
								return
							}
							editPromoCodeVue.errorMessage = reason
							window.scrollTo(0, 0)
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					editPromoCodeVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showEditSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Promocode has been saved'
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
		 * To close the modal and emit the updated promoCode object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updatePromoCode', this.promoCode)
			this.$emit('closeEditPromoCodeModal')
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			if (this.selectLocationsMode) {
				this.selectLocationsMode = false
			} else if (this.selectItemsMode) {
				this.selectItemsMode = false
			} else {
				this.$emit('closeEditPromoCodeModal')
			}
		}
	},
	components: {
		Modal,
		Dropdown,
		LoadingScreen,
		SelectLocationsPopup,
		MenuItemPicker
	}
}
</script>

<style scoped>
.dropdown {
	margin-bottom: 10px;
}
.side-by-side-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-end;
}
.side-by-side-item {
	max-width: 45%;
}
.dropdown.side-by-side-item {
	margin-left: 10px;
}
@media (max-width: 1150px) {
	.side-by-side-wrapper {
		flex-direction: column;
		align-items: flex-start;
	}
	.side-by-side-item {
		max-width: 100%;
	}
	.dropdown.side-by-side-item {
		margin-left: 0px;
	}
}
.date-label {
	color: rgb(136, 136, 136);
	font-size: 13px;
	margin: 0 0 5px 0;
}
.grey-label {
	margin-top: 5px;
	color: rgb(153, 153, 153);
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
.select-items-button {
	margin: 0 0 10px 10px;
}
.modal-body {
	min-height: 200px;
	max-height: calc(100vh - 200px);
	overflow-x: hidden;
	overflow-y: auto;
	margin-bottom: 20px;
}
</style>
<style>
.el-select-dropdown.el-popper {
	z-index: 10501 !important;
}
</style>

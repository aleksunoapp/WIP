<template>
	<modal :show="showEditPromoCodeModal" effect="fade" @closeOnEscape="closeModal" :width="modalWidth">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title">
				<span v-if="!selectLocationsMode && !selectItemsMode && $root.permissions['promocodes update']">Update Promo Code</span>
				<span v-if="!selectLocationsMode && !selectItemsMode && $root.permissions['promocodes read'] && !$root.permissions['promocodes update']">View Promo Code</span>
				<h4 v-else-if="selectLocationsMode" class="modal-title center"><i class="fa fa-chevron-left clickable pull-left back-button" @click="closeModal()"></i> Select Stores</h4>
				<span v-else-if="selectItemsMode">Select Items</span>
			</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<loading-screen :show="displaySpinner" :color="'#2C3E50'" :display="'inline'"></loading-screen>
  			<form v-show="!displaySpinner" role="form" @submit.prevent="createNewpromoCode()" v-if="!selectLocationsMode && !selectItemsMode">
					<fieldset :disabled="!$root.permissions['promocodes update']">
	  				<div class="form-body row">
	  					<div class="col-md-12">
		        		<div class="alert alert-danger" v-if="errorMessage.length">
	        		    <button class="close" data-close="alert" @click="clearError('errorMessage')"></button>
	        		    <span>{{ errorMessage }}</span>
		        		</div>
		        	</div>
	        		<div class="col-xs-7">
	        			<div class="form-group form-md-line-input form-md-floating-label">
        			    <input ref="codes" type="text" class="form-control input-sm  text-uppercase" :class="{'edited': promoCode.codes.length}" id="form_control_1" v-model="promoCode.codes">
        			    <label for="form_control_1">Enter a Code</label>
	        			</div>
	        			<div class="side-by-side-wrapper">
									<div class="form-group form-md-line-input form-md-floating-label side-by-side-item">
								    <input type="text" class="form-control input-sm" :class="{'edited': promoCode.value}" id="form_control_2" v-model="promoCode.value">
								    <label for="form_control_2">Value of Promo Code</label>
									</div>
	            		<el-select
										v-model="promoCode.value_type"
										placeholder="Select type"
										size="mini"
										class="margin-bottom-15"
										:disabled="!$root.permissions['promocodes update']"
									>
										<el-option
											label="%"
											value="percentage">
										</el-option>
										<el-option
											label="$"
											value="dollar">
										</el-option>
									</el-select>
								</div>
	        			<div>
	            		<el-select
										v-model="promoCode.apply_on"
										placeholder="Discount is applied to"
										size="mini"
										class="margin-bottom-15"
										:disabled="!$root.permissions['promocodes update']"
									>
										<el-option
											label="Menu Items"
											value="items">
										</el-option>
										<el-option
											label="Delivery Fee"
											value="delivery">
										</el-option>
	            		</el-select>
									<button v-if="promoCode.apply_on === 'items'" type="submit" class="btn blue btn-outline select-items-button" @click="displayMenuTreeModal($event)">
										<span v-if="!promoCode.sku_array.length">Select</span><span v-else>Add</span> items
									</button>
									<p class="grey-label" v-if="promoCode.sku_array.length">Selected <span v-if="promoCode.sku === 'all'">all</span><span v-else>{{ promoCode.sku_array.length }}</span> item<span v-if="promoCode.sku.length !== 1">s</span></p>
								</div>
								<div>
	            		<el-select
										v-model="promoCode.type"
										placeholder="Single or Multi Use?"
										size="mini"
										class="margin-bottom-15"
										:disabled="!$root.permissions['promocodes update']"
									>
										<el-option
											label="Single Use"
											value="single_use">
										</el-option>
										<el-option
											label="Multi Use"
											value="multi_use">
										</el-option>
	            		</el-select>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" :class="{'edited': promoCode.max_use_per_person !== ''}" id="form_control_3" v-model="promoCode.max_use_per_person">
							    <label for="form_control_3">Maximum Redemptions Per User</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label narrow-input">
							    <input type="text" class="form-control input-sm" :class="{'edited': promoCode.max_use  !== ''}" id="form_control_4" v-model="promoCode.max_use">
							    <label for="form_control_4">Total Redemptions Permitted</label>
								</div>
	        			<div class="form-group">
	        				<p class="date-label">Start Date</p>
	        				<el-date-picker
	        					v-model="promoCode.start_from"
	        					format="yyyy-MM-dd"
	        					value-format="yyyy-MM-dd"
	        					:picker-options="{disabledDate: afterToday}"
	        					:clearable="false"
	        					placeholder="Select start date"
										:disabled="!$root.permissions['promocodes update']"
									>
        					</el-date-picker>
	        			</div>
	        			<div class="form-group">
	        				<p class="date-label">End Date</p>
		        			<el-date-picker
		        				v-model="promoCode.end_on"
		        				format="yyyy-MM-dd"
		        				value-format="yyyy-MM-dd"
		        				:picker-options="{disabledDate: afterStartFrom}"
		        				:clearable="false"
		        				placeholder="Select end date"
										:disabled="!$root.permissions['promocodes update']"
									>
	        				</el-date-picker>
	        			</div>
	        			<div>
									<p class="inline margin-right-10">Availability</p>
	        				<button type="submit" class="btn blue btn-outline" @click="selectLocations($event, 'new')">Select Stores</button>
	        				<p class="grey-label margin-top-10" v-if="promoCode.locations.length">Selected <span v-if="promoCode.locations === 'all'">all</span><span v-else>{{ promoCode.locations.length }}</span> location<span v-if="promoCode.locations.length !== 1">s</span></p>
	        			</div>
	        		</div>
	        	</div>
	  				<div class="form-actions right margin-top-20">
						</div>
					</fieldset>
				</form>
			<div v-show="!displaySpinner" class="row" v-if="selectItemsMode">
				<div class="col-md-4">
					<h4>Menus</h4>
					<div class="dd" id="nestable_list_1" v-if="menus.length">
	        	<ol class="dd-list">
	          	<li class="dd-item" v-for="menu in menus" :data-id="menu.id" @click="selectMenu(menu)">
              	<div class="dd-handle" :class="{'active': menu.id === activeMenu.id}"> {{ menu.name }}
              	<span class="pull-right"><i class="fa fa-chevron-right"></i></span>
              	</div>
	          	</li>
	        	</ol>
	    		</div>
        	<div v-else>
	      		<div class="alert alert-warning">
							<span>There are no menus to display.</span>
						</div>
        	</div>
				</div>
				<div class="col-md-4" v-if="isMenuSelected">
					<h4>{{ activeMenu.name }} - Categories</h4>
					<div class="dd" id="nestable_list_2" v-if="categories.length">
	          <ol class="dd-list">
	            <li class="dd-item" v-for="category in categories" :data-id="category.id" @click="selectCategory(category)">
	              <div class="dd-handle" :class="{'active': category.id === activeCategory.id}"> {{ category.name }}
                  <span class="pull-right"><i class="fa fa-chevron-right"></i></span>
	              </div>
	            </li>
	          </ol>
			    </div>
			    <div v-else>
			    	<div class="alert alert-warning">
           		<span>There are no categories in the menu '{{ activeMenu.name }}'.</span>
		        </div>
			    </div>
				</div>
				<div class="col-md-4" v-if="isCategorySelected">
					<h4><input type="checkbox" @click="selectAll()" class="md-check" v-model="selectAllSelected"> {{ activeCategory.name }} - Items</h4>
					<div class="dd" id="nestable_list_3" v-if="items.length">
		        <ol class="dd-list">
	            <li class="dd-item" v-for="item in items" :data-id="item.id">
	              <div class="dd-handle">
	                <span class="pull-left">
										<input
											type="checkbox"
											:id="'item_checkbox_' + item.id" class="md-check"
											v-model="item.selected"
											:disabled="!$root.permissions['promocodes update']"
										>
										&emsp;
									</span>
									{{ item.name }}
	              </div>
	            </li>
		        </ol>
			    </div>
			    <div v-else>
		        <div class="alert alert-warning">
	           	<span>There are no items in the category '{{ activeCategory.name }}'.</span>
		        </div>
			    </div>
				</div>
			</div>
			<select-locations-popup v-if="!displaySpinner && selectLocationsMode" @closeSelectLocationsPopup='selectStores' :previouslySelected="promoCode.locations"></select-locations-popup>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="applySelectedItems()" v-if="selectItemsMode && $root.permissions['promocodes update']">Save</button>
			<button type="button" class="btn btn-primary" @click="updatePromoCode()" v-if="!selectLocationsMode && !selectItemsMode && $root.permissions['promocodes update']">Update</button>
			<button type="button" class="btn btn-primary" @click="updatePromoCode()" v-if="!selectLocationsMode && !selectItemsMode && !$root.permissions['promocodes update']">Close</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import PromoCodesFunctions from '../../../controllers/PromoCodes'
import App from '../../../controllers/App'
import Dropdown from '../../modules/Dropdown'
import MenusFunctions from '../../../controllers/Menus'
import CategoriesFunctions from '../../../controllers/Categories'
import ItemsFunctions from '../../../controllers/Items'
import LoadingScreen from '../../modules/LoadingScreen'
import SelectLocationsPopup from '../../modules/SelectLocationsPopup'

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
				'apply_on': '',
				'codes': '',
				'end_on': '',
				'locations': [],
				'max_use': '',
				'max_use_per_person': '',
				'sku': [],
				'sku_array': [],
				'start_from': '',
				'type': '',
				'value': '',
				'value_type': ''
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
		}
	},
	props: {
		promoCodeId: {
			type: Number
		}
	},
	mounted () {
		this.getAllPromoCodeDetails()
		this.getMenus()
		this.promoCode.locations === 'all' ? this.selectAllLocationsSelected = true : this.selectAllLocationsSelected = false
		this.getPaginatedStoreLocations()
		this.showEditPromoCodeModal = true
	},
	methods: {
		/**
		 * To disable dates up to and including today
		 * @function
		 * @param {string} date - The date to evaluate
		 * @returns {boolean} false if date should not be disabled, true if it should
		 */
		afterToday (date) {
			try {
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

				return `${inputYear}-${inputMonth}-${inputDay}` <= `${todayYear}-${todayMonth}-${todayDay}`
			} catch (err) {
				return false
			}
		},
		/**
		 * To disable dates up to and including the start date
		 * @function
		 * @param {string} date - The date to evaluate
		 * @returns {boolean} false if date should not be disabled, true if it should
		 */
		afterStartFrom (date) {
			try {
				// wait for start date to be selected
				if (this.promoCode.start_from === '' || this.promoCode.start_from === null || this.afterToday(this.promoCode.start_from)) return true

				let input = new Date(date)
				input.setMinutes(input.getMinutes() + input.getTimezoneOffset())
				let compare = new Date(this.promoCode.start_from)
				compare.setMinutes(compare.getMinutes() + compare.getTimezoneOffset())

				let inputDay = input.getDate()
				if (inputDay < 10) {
					inputDay = '0' + inputDay
				}
				let inputMonth = input.getMonth()
				if (inputMonth < 10) {
					inputMonth = '0' + inputMonth
				}
				let inputYear = input.getFullYear()

				let compareDay = compare.getDate()
				if (compareDay < 10) {
					compareDay = '0' + compareDay
				}
				let compareMonth = compare.getMonth()
				if (compareMonth < 10) {
					compareMonth = '0' + compareMonth
				}
				let compareYear = compare.getFullYear()

				return `${inputYear}-${inputMonth}-${inputDay}` <= `${compareYear}-${compareMonth}-${compareDay}`
			} catch (err) {
				return false
			}
		},
		/**
		 * To get details of the promo code being edited.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllPromoCodeDetails () {
			this.displaySpinner = true
			var editPromoCodeVue = this
			return PromoCodesFunctions.getAllPromoCodeDetails(editPromoCodeVue.$root.appId, editPromoCodeVue.$root.appSecret, editPromoCodeVue.$root.activeLocation.id, editPromoCodeVue.promoCodeId).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					if (!response.payload.hasOwnProperty('sku_array')) {
						response.payload.sku_array = response.payload.sku.split(',')
					}
					response.payload.locations = response.payload.locations.split(',').map(id => parseInt(id))

					editPromoCodeVue.promoCode = response.payload
					editPromoCodeVue.displaySpinner = false
					editPromoCodeVue.$nextTick(function () {
						editPromoCodeVue.$refs.codes.focus()
					})
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
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
		 * To get a list of all categories for the current active menu.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCategoriesForActiveMenu () {
			var menuTreeVue = this
			menuTreeVue.categories = []
			return CategoriesFunctions.getMenuCategories(menuTreeVue.activeMenu.id, menuTreeVue.$root.appId, menuTreeVue.$root.appSecret, menuTreeVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					menuTreeVue.categories = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					menuTreeVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get a list of all item for the current active category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemsForActiveCategory () {
			var menuTreeVue = this
			menuTreeVue.items = []
			return ItemsFunctions.getCategoryItemsFull(menuTreeVue.activeCategory.id, menuTreeVue.$root.appId, menuTreeVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					response.payload.forEach((item) => {
						if (menuTreeVue.promoCode.sku === 'all') {
							item.selected = true
						} else {
							item.selected = menuTreeVue.promoCode.sku_array.includes(item.sku)
						}
					})
					menuTreeVue.items = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					menuTreeVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To clear the categories array and also the active category.
		 * @function
		 * @returns {undefined}
		 */
		clearActiveCategory () {
			this.activeCategory = {}
			this.categories = []
		},
		/**
		 * To set the value of the variable 'activeMenu' as the selected menu object.
		 * @function
		 * @param {object} menu - The selected menu.
		 * @returns {undefined}
		 */
		selectMenu (menu) {
			this.activeMenu = menu
			this.isMenuSelected = true
			if (this.isCategorySelected) {
				this.isCategorySelected = false
			}
			this.clearActiveCategory()
			this.getCategoriesForActiveMenu()
		},
		/**
		 * To set the value of the variable 'activeCategory' as the selected category object.
		 * @function
		 * @param {object} category - The selected category.
		 * @returns {undefined}
		 */
		selectCategory (category) {
			this.activeCategory = category
			this.isCategorySelected = true
			this.getItemsForActiveCategory()
			this.selectAllSelected = false
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
				menuTreeVue.$set(item, 'selected', this.selectAllLocationsSelected)
			}
		},
		applySelectedItems () {
			var selectedItems = []
			var unselectedItems = []
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].selected) {
					selectedItems.push(this.items[i].sku)
				} else {
					unselectedItems.push(this.items[i].sku)
				}
			}
			selectedItems.forEach((item) => {
				if (!this.promoCode.sku_array.includes(item)) {
					this.promoCode.sku_array.push(item)
				}
			})
			this.selectItemsMode = false
		},
		/**
		 * To get a list of all menus for the current active location.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getMenus () {
			this.menus = []
			var editPromoCodeVue = this
			return MenusFunctions.getStoreMenus(editPromoCodeVue.$root.appId, editPromoCodeVue.$root.appSecret, editPromoCodeVue.$root.activeLocation.id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editPromoCodeVue.menus = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editPromoCodeVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
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

			return `${todayYear}-${todayMonth}-${todayDay}` > `${inputYear}-${inputMonth}-${inputDay}`
		},
		/**
		 * To record the selected locations in the new or edited promo code object.
		 * @function
		 * @param {array} selectedStores - An array of ids of the stores selected
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		selectStores (selectedStores) {
			this.promoCode.locations = selectedStores
			this.selectLocationsMode = false
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @param {boolean} value - The value of the checkbox
		 * @returns {undefined}
		 */
		syncSelectAll (value) {
			if (!value) {
				this.selectAllLocationsSelected = false
			}
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
				'brand_id': this.$root.brandId
			}
			App.getPaginatedStoreLocations(editPromoCodeVue.$root.appId, editPromoCodeVue.$root.appSecret, editPromoCodeVue.$root.userToken, paginationPreferences).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					response.payload.forEach((location) => {
						if (editPromoCodeVue.promoCode.locations === 'all') {
							location.selected = true
						} else {
							location.selected = editPromoCodeVue.promoCode.locations.includes(parseInt(location.id))
						}
					})
					editPromoCodeVue.locations = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editPromoCodeVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
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
				} else if (!(/^\+?(0|[1-9]\d*)$/.test(promoCodesVue.promoCode.value))) {
					reject('Value Of Promo Code cannot be blank and must be a number')
				} else if (!promoCodesVue.promoCode.value_type.length) {
					reject('Value Type cannot be blank')
				} else if (!promoCodesVue.promoCode.apply_on.length) {
					reject('Discount Is Applied To cannot be blank')
				} else if (promoCodesVue.promoCode.apply_on === 'items' && !promoCodesVue.promoCode.sku_array.length) {
					reject('Select at least one item')
				} else if (!promoCodesVue.promoCode.type.length) {
					reject('Single or Multi Use cannot be blank')
				} else if (!(/^\+?(0|[1-9]\d*)$/.test(promoCodesVue.promoCode.max_use_per_person))) {
					reject('Maximum Redemptions Per User cannot be blank and must be a number')
				} else if (!(/^\+?(0|[1-9]\d*)$/.test(promoCodesVue.promoCode.max_use))) {
					reject('Total Redemptions Permitted cannot be blank and must be a number')
				} else if (!promoCodesVue.promoCode.apply_on.length) {
					reject('Applies to cannot be blank')
				} else if (typeof new Date(promoCodesVue.promoCode.start_from).getMonth !== 'function') {
					reject('Please select Start Date and Time')
				} else if (typeof new Date(promoCodesVue.promoCode.end_on).getMonth !== 'function') {
					reject('Please select End Date and Time')
				} else if (promoCodesVue.isPast(promoCodesVue.promoCode.end_on)) {
					reject('End Date cannot be in the past')
				} else if (new Date(promoCodesVue.promoCode.end_on) < new Date(promoCodesVue.promoCode.start_from)) {
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

			return editPromoCodeVue.validatePromoCodeData()
			.then(response => {
				let promoCode = editPromoCodeVue.promoCode
				promoCode.start_from = editPromoCodeVue.formatDateTimeForApi(promoCode.start_from)
				promoCode.end_on = editPromoCodeVue.formatDateTimeForApi(promoCode.end_on)
				promoCode.sku = editPromoCodeVue.promoCode.sku_array.toString()
				promoCode.locations = editPromoCodeVue.promoCode.locations.toString()
				if (editPromoCodeVue.promoCode.locations.length === 1) {
					editPromoCodeVue.promoCode.locations = editPromoCodeVue.promoCode.locations[0].toString()
				}

				PromoCodesFunctions.updatePromoCode(promoCode, editPromoCodeVue.$root.appId, editPromoCodeVue.$root.appSecret, editPromoCodeVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editPromoCodeVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editPromoCodeVue.$router.push('/login/expired')
						return
					}
					editPromoCodeVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editPromoCodeVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
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
		SelectLocationsPopup
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
.mt-element-list .list-news.ext-1.mt-list-container ul>.mt-list-item>.list-datetime, .mt-element-list .list-news.ext-1.mt-list-container ul>.mt-list-item>.list-item-content {
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
	z-index: 10501!important;
}
</style>

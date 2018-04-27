<template>
	<div>
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<h1 class='page-title'>{{ $root.activeUser.name }} Stores</h1>
		<div class="note note-info">
            <p>A list of stores for this application.</p>
        </div>

        <!-- SEARCH START -->
        <div class="margin-top-20" v-if="$root.accountType === 'store_admin'">
			<div class="portlet box blue-hoki">
				<div class="portlet-title" @click="toggleStoreSearchPanel()">
					<div class="caption">
						<i class="fa fa-search"></i>
						Search Panel
					</div>
					<div class="tools">
						<a :class="{'expand': !storeSearchCollapse, 'collapse': storeSearchCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" :class="{'display-hide': storeSearchCollapse}">
					<form role="form" @submit.prevent="advancedSearch()">
						<div class="form-body row">
							<div class="col-md-12">
								<div class="alert alert-danger" v-if="searchError.length">
	                                <button class="close" data-close="alert" @click.prevent="clearSearchError()"></button>
	                                <span>{{searchError}}</span>
	                            </div>
							</div>
							<div class="col-md-6">
        						<div class="form-group form-md-line-input form-md-floating-label">
              						<input type="text" class="form-control input-sm" :class="{'edited': searchTerm.length}" v-model="searchTerm">
              						<label for="search_options_search">Search</label>
              						<span class="help-block persist">Search by Store Name or Store Address.</span>
              					</div>
							</div>
						</div>
						<div class="form-actions right margin-top-20">
							<button type="button" class="btn btn-default" @click.prevent="resetStoreSearch()"> Reset Search</button>
							<button type="submit" class="btn blue">Search</button>
						</div>
					</form>
      			</div>
      		</div>
        </div>
        <div class="margin-top-20" v-if="$root.accountType === 'application_admin'">
			<div class="portlet box blue-hoki">
				<div class="portlet-title" @click="toggleStoreSearchPanel()">
					<div class="caption">
						<i class="fa fa-search"></i>
						Search Panel
					</div>
					<div class="tools">
						<a :class="{'expand': !storeSearchCollapse, 'collapse': storeSearchCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" :class="{'display-hide': storeSearchCollapse}">
					<form role="form" @submit.prevent="getV3Locations()">
						<div class="form-body row">
							<div class="col-md-12">
								<div class="alert alert-danger" v-show="searchError.length" ref="searchError">
	                                <button class="close" data-close="alert" @click.prevent="clearSearchError()"></button>
	                                <span>{{searchError}}</span>
	                            </div>
							</div>
							<div class="col-md-6">
        						<div class="form-group form-md-line-input form-md-floating-label">
              						<input type="text" class="form-control input-sm" :class="{'edited': v3Locations.searchQuery.length}" v-model="v3Locations.searchQuery">
              						<label for="search_options_search">Search</label>
              						<span class="help-block persist">Search by store name.</span>
              					</div>
							</div>
						</div>
						<div class="form-actions right margin-top-20">
							<button type="button" class="btn btn-default" @click.prevent="resetV3Search()"> Reset Search</button>
							<button type="submit" class="btn blue">Search</button>
						</div>
					</form>
      			</div>
      		</div>
        </div>
        <!-- SEARCH END -->

        <!-- LIST START -->
	    <div v-if="$root.accountType === 'store_admin'">
	    	<loading-screen :show="displayStoreData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
			<div v-if="stores.length && !displayStoreData && !filteredResults.length">
			    <div class="portlet light portlet-fit bordered">
			        <div class="portlet-title bg-blue-chambray">
			        	<div class="menu-image-main">
			        		<img src="../../../../static/client_logo.png">
			        	</div>
			            <div class="caption">
			                <span class="caption-subject font-green bold uppercase">Stores</span>
			                <div class="caption-desc font-grey-cascade">Click on a store to edit it.</div>
			            </div>
			        </div>
			        <div class="portlet-body">
						<div class="clearfix margin-bottom-10">
							<el-dropdown trigger="click" @command="updateSortByOrder" size="mini" :show-timeout="50" :hide-timeout="50">
								<el-button size="mini">
									Sort by
									<span>
										<i class="fa fa-sort-alpha-asc" v-if="sortBy.order === 'ASC'"></i>
										<i class="fa fa-sort-alpha-desc" v-if="sortBy.order === 'DESC'"></i>
									</span>
									<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="ASC"><i class="fa fa-sort-alpha-asc"></i></el-dropdown-item>
									<el-dropdown-item command="DESC"><i class="fa fa-sort-alpha-desc"></i></el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
			  				<page-results class="pull-right" :totalResults="stores.length" :activePage="activePage" @pageResults="pageResultsUpdate"></page-results>
			  			</div>
			            <div class="mt-element-list">
			                <div class="mt-list-container list-news">
			                    <ul>
			                        <li id="parent" class="mt-list-item actions-at-left margin-top-15 clickable" v-for="store in currentActivePageItems" @click="editStore(store)">
			                        	<div class="list-item-actions">
			                        		<a class="btn btn-circle btn-icon-only btn-default">
			                                    <i class="fa fa-lg fa-pencil"></i>
			                                </a>
			                        	</div>
			                        	<div class="list-icon-container">
			                                <i class="fa fa-angle-right"></i>
			                            </div>
			                            <div class="list-datetime bold uppercase font-red">
			                            	<span>{{ store.display_name }}</span>
			                            </div>
			                            <div class="list-item-content height-mod">
			                            	<div class="col-md-8">
			                            		<span v-if="store.address_line_1.length">{{ store.address_line_1 }} {{ store.address_line_2 }}</span><br>
			                            		<span v-if="store.city.length">{{ store.city }},</span>
			                            		<span v-if="store.province.length">{{ store.province }},</span>
			                            		<span v-if="store.country.length">{{ store.country }}</span>
			                            	</div>
			                            </div>
			                        </li>
			                    </ul>
			                </div>
				            <div class="clearfix" v-if="numPages > 1">
				            	<pagination :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
				            </div>
			            </div>
			        </div>
			    </div>
			</div>
			<div v-if="stores.length && !displayStoreData && filteredResults.length">
			    <div class="portlet light portlet-fit bordered">
			        <div class="portlet-title bg-blue-chambray">
			        	<div class="menu-image-main">
			        		<img src="../../../../static/client_logo.png">
			        	</div>
			            <div class="caption">
			                <span class="caption-subject font-green bold uppercase">Stores</span>
			                <div class="caption-desc font-grey-cascade">Click on a store to edit it.</div>
			            </div>
			        </div>
			        <div class="portlet-body">
						<div class="clearfix margin-bottom-10">
							<el-dropdown trigger="click" @command="updateSortByOrder" size="mini" :show-timeout="50" :hide-timeout="50">
								<el-button size="mini">
									Sort by
									<span>
										<i class="fa fa-sort-alpha-asc" v-if="sortBy.order === 'ASC'"></i>
										<i class="fa fa-sort-alpha-desc" v-if="sortBy.order === 'DESC'"></i>
									</span>
									<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="ASC"><i class="fa fa-sort-alpha-asc"></i></el-dropdown-item>
									<el-dropdown-item command="DESC"><i class="fa fa-sort-alpha-desc"></i></el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
			  				<page-results class="pull-right" :totalResults="filteredResults.length" :activePage="searchActivePage" @pageResults="activeSearchPageUpdate"></page-results>
			  			</div>
			            <div class="mt-element-list">
			                <div class="mt-list-container list-news">
			                    <ul>
			                        <li id="parent" class="mt-list-item actions-at-left margin-top-15 clickable" v-for="store in currentActiveSearchPageItems" @click="editStore(store)">
			                        	<div class="list-item-actions">
			                        		<a class="btn btn-circle btn-icon-only btn-default">
			                                    <i class="fa fa-lg fa-pencil"></i>
			                                </a>
			                        	</div>
			                        	<div class="list-icon-container">
			                                <i class="fa fa-angle-right"></i>
			                            </div>
			                            <div class="list-datetime bold uppercase font-red">
			                            	<span>{{ store.display_name }}</span>
			                            </div>
			                            <div class="list-item-content height-mod">
			                            	<div class="col-md-8">
			                            		<span v-if="store.address_line_1">{{ store.address_line_1 }} {{ store.address_line_2 }}</span><br>
			                            		<span v-if="store.city">{{ store.city }},</span>
			                            		<span v-if="store.province">{{ store.province }},</span>
			                            		<span v-if="store.country">{{ store.country }}</span>
			                            	</div>
			                            </div>
			                        </li>
			                    </ul>
			                </div>
				            <div class="clearfix" v-if="searchNumPages > 1">
				            	<pagination :passedPage="searchActivePage" :numPages="searchNumPages" @activePageChange="activeSearchPageUpdate"></pagination>
				            </div>
			            </div>
			        </div>
			    </div>
			</div>
			<div v-if="!stores.length && !displayStoreData">
				<no-results :show="!stores.length" :type="'stores'"></no-results>
			</div>	    	
	    </div>
	    <div v-if="$root.accountType === 'application_admin'">
	    	<div>
	    	    <div class="portlet light portlet-fit bordered">
	    	        <div class="portlet-title bg-blue-chambray">
	    	        	<div class="menu-image-main">
	    	        		<img src="../../../../static/client_logo.png">
	    	        	</div>
	    	            <div class="caption">
	    	                <span class="caption-subject font-green bold uppercase">Stores</span>
	    	                <div class="caption-desc font-grey-cascade">Click on a store to edit it.</div>
	    	            </div>
	    	        </div>
	    	        <div class="portlet-body relative-block">
						<div class="alert alert-danger" v-show="v3Locations.locationsError.length" ref="locationsError">
                            <button class="close" data-close="alert" @click="clearLocationsError()"></button>
                            <span>{{v3Locations.locationsError}}</span>
                        </div>
	    	        	<div v-if="v3Locations.locations.length && !loadingV3Locations">
		    				<div class="clearfix margin-bottom-10">
		    					<el-dropdown trigger="click" @command="updateV3SortOrder" size="mini" :show-timeout="50" :hide-timeout="50">
		    						<el-button size="mini">
		    							Sort by
		    							<span>
		    								<i class="fa fa-sort-alpha-asc" v-show="v3Locations.sortOrder === 'asc'"></i>
		    								<i class="fa fa-sort-alpha-desc" v-show="v3Locations.sortOrder === 'desc'"></i>
		    							</span>
		    							<i class="el-icon-arrow-down el-icon--right"></i>
		    						</el-button>
		    						<el-dropdown-menu slot="dropdown">
		    							<el-dropdown-item command="asc"><i class="fa fa-sort-alpha-asc"></i></el-dropdown-item>
		    							<el-dropdown-item command="desc"><i class="fa fa-sort-alpha-desc"></i></el-dropdown-item>
		    						</el-dropdown-menu>
		    					</el-dropdown>
		    	  				<page-results class="pull-right" :totalResults="v3Locations.locations.length" :activePage="v3Locations.currentPage" @pageResults="updateV3ResultsPerPage"></page-results>
		    	  			</div>
		    	            <div class="mt-element-list">
		    	                <div class="mt-list-container list-news">
		    	                    <ul>
		    	                        <li id="parent" class="mt-list-item actions-at-left margin-top-15 clickable" v-for="store in v3Locations.locations" @click="checkV3Location(store)">
		    	                        	<div class="list-item-actions">
		    	                        		<a class="btn btn-circle btn-icon-only btn-default">
		    	                                    <i class="fa fa-lg fa-pencil"></i>
		    	                                </a>
		    	                        	</div>
		    	                        	<div class="list-icon-container">
		    	                                <i class="fa fa-angle-right"></i>
		    	                            </div>
		    	                            <div class="list-datetime bold uppercase font-red">
		    	                            	<span>{{ store.location_name }}</span>
		    	                            </div>
		    	                            <div class="list-item-content height-mod">
		    	                            	<div class="col-md-8">
		    	                            		<span v-if="store.address_line_1">{{ store.address_line_1 }} {{ store.address_line_2 }}</span><br>
		    	                            		<span v-if="store.city">{{ store.city }},</span>
		    	                            		<span v-if="store.province">{{ store.province }},</span>
		    	                            		<span v-if="store.country">{{ store.country }}</span>
		    	                            	</div>
		    	                            </div>
		    	                        </li>
		    	                    </ul>
		    	                </div>
		    		            <div class="clearfix" v-if="v3Locations.lastPage > 1">
		    		            	<pagination :passedPage="v3Locations.currentPage" :numPages="v3Locations.lastPage" @activePageChange="updateV3CurrentPage"></pagination>
		    		            </div>
		    	            </div>
	    	        	</div>
	    	            <no-results :show="!v3Locations.locations.length && !loadingV3Locations" :type="'stores'"></no-results>
	    	        </div>
	    	    </div>
	    	</div>
	    </div>
        <!-- LIST END -->
    </div>
</template>

<script>
import App from '../../../controllers/App'
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import LoadingScreen from '../../modules/LoadingScreen'
import Dropdown from '../../modules/Dropdown'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Store Manager', link: false},
				{name: 'Stores', link: false}
			],
			displayStoreData: false,
			stores: [],
			storeSearchCollapse: true,
			searchError: '',
			searchTerm: '',
			loadingSearchResults: false,
			activePage: 1,
			resultsPerPage: 25,
			sortBy: {
				order: 'ASC'
			},
			searchActivePage: 1,
			filteredResults: [],
			loadingV3Locations: false,
			v3Locations: {
				locationsError: '',
				locations: [],
				searchError: '',
				searchQuery: '',
				currentPage: 1,
				lastPage: 1,
				recordsPerPage: 25,
				sortOrder: 'asc'
			}
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.stores.length / this.resultsPerPage)
		},
		currentActivePageItems () {
			return this.userSort(this.stores).slice(this.resultsPerPage * (this.activePage - 1), this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage)
		},
		searchNumPages () {
			return Math.ceil(this.filteredResults.length / this.resultsPerPage)
		},
		currentActiveSearchPageItems () {
			return this.userSort(this.filteredResults).slice(this.resultsPerPage * (this.searchActivePage - 1), this.resultsPerPage * (this.searchActivePage - 1) + this.resultsPerPage)
		}
	},
	mounted () {
		if (this.$root.accountType === 'store_admin') {
			this.getStores()
		} else if (this.$root.accountType === 'application_admin') {
			this.getV3Locations()
		}
	},
	methods: {
		/**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateSortByOrder (value) {
			this.sortBy.order = value
			this.filteredResults.length ? this.activeSearchPageUpdate(1) : this.activePageUpdate(1)
		},
		/**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateV3SortOrder (value) {
			this.v3Locations.sortOrder = value
			this.getV3Locations()
		},
		/**
		 * To catch updates from the PageResults component when the number of page results is updated.
		 * @function
		 * @param {integer} val - The number of page results to be returned.
		 * @returns {undefined}
		 */
		pageResultsUpdate (val) {
			if (parseInt(this.resultsPerPage) !== parseInt(val)) {
				this.resultsPerPage = val
				this.filteredResults.length ? this.activeSearchPageUpdate(1) : this.activePageUpdate(1)
			}
		},
		/**
		 * To catch updates from the PageResults component when the number of page results is updated.
		 * @function
		 * @param {integer} val - The number of page results to be returned.
		 * @returns {undefined}
		 */
		updateV3ResultsPerPage (val) {
			if (parseInt(this.v3Locations.recordsPerPage) !== parseInt(val)) {
				this.v3Locations.recordsPerPage = val
				this.v3Locations.currentPage = 1
				this.getV3Locations()
			}
		},
		/**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
		activePageUpdate (val) {
			if (parseInt(this.activePage) !== parseInt(val)) {
				this.activePage = val
				window.scrollTo(0, 0)
			}
		},
		/**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
		activeSearchPageUpdate (val) {
			if (parseInt(this.searchActivePage) !== parseInt(val)) {
				this.searchActivePage = val
				window.scrollTo(0, 0)
			}
		},
		/**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
		updateV3CurrentPage (val) {
			if (parseInt(this.v3Locations.currentPage) !== parseInt(val)) {
				this.v3Locations.currentPage = val
				this.getV3Locations()
				window.scrollTo(0, 0)
			}
		},
		/**
		 * To sort the stores list.
		 * @function
		 * @param {array} stores - The array of stores.
		 * @returns {array} - The sorted array of stores
		 */
		userSort (stores) {
			let input = stores
			function asc (a, b) {
				if ((a.display_name).toLowerCase() < (b.display_name).toLowerCase()) {
					return -1
				} else if ((a.display_name).toLowerCase() > (b.display_name).toLowerCase()) {
					return 1
				} else {
					if (a.id > b.id) {
						return -1
					} else if (a.id < b.id) {
						return 1
					} else {
						return 0
					}
				}
			}

			function desc (a, b) {
				if ((a.display_name).toLowerCase() > (b.display_name).toLowerCase()) {
					return -1
				} else if ((a.display_name).toLowerCase() < (b.display_name).toLowerCase()) {
					return 1
				} else {
					if (a.id > b.id) {
						return -1
					} else if (a.id < b.id) {
						return 1
					} else {
						return 0
					}
				}
			}

			if (this.sortBy.order === 'ASC') {
				return input.sort(asc)
			} else {
				return input.sort(desc)
			}
		},
		/**
		 * To toggle the search panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleStoreSearchPanel () {
			this.storeSearchCollapse = !this.storeSearchCollapse
		},
		/**
		 * To clear the current search error.
		 * @function
		 * @returns {undefined}
		 */
		clearSearchError () {
			this.searchError = ''
		},
		/**
		 * To clear the current search error.
		 * @function
		 * @returns {undefined}
		 */
		clearLocationsError () {
			this.v3Locations.locationsError = ''
		},
		/**
		 * To clear the current store search criteria.
		 * @function
		 * @returns {undefined}
		 */
		resetStoreSearch () {
			this.searchTerm = ''
			this.filteredResults = []
			this.clearSearchError()
		},
		/**
		 * To clear the current store search.
		 * @function
		 * @returns {undefined}
		 */
		resetV3Search () {
			this.v3Locations.searchQuery = ''
			this.getV3Locations()
			this.clearSearchError()
		},
		/**
		 * To filter the stores based on the search term.
		 * @function
		 * @returns {undefined}
		 */
		advancedSearch () {
			this.clearSearchError()
			this.filteredResults = []
			if (this.searchTerm.length) {
				if (this.searchTerm.length < 3) {
					this.searchError = 'In order to use the search field your term must be at least 3 characters.'
				} else {
					for (var i = 0; i < this.stores.length; i++) {
						if ((this.stores[i].display_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) || (this.stores[i].address_line_1.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)) {
							this.filteredResults.push(this.stores[i])
						}
					}
					if (!this.filteredResults.length) {
						this.searchError = 'There are no matching records. Please try again.'
					}
				}
			}
		},
		/**
		 * To get a list of store for the current application/business.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStores () {
			this.displayStoreData = true
			var storeListVue = this
			App.getPaginatedStoreLocations(storeListVue.$root.appId, storeListVue.$root.appSecret, storeListVue.$root.userToken, {'brand_id': storeListVue.$root.brandId}).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					storeListVue.stores = response.payload
					storeListVue.displayStoreData = false
				} else {
					storeListVue.displayStoreData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					storeListVue.$router.push('/login/expired')
					return
				}
				storeListVue.displayStoreData = false
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To get a list of store locations for the current application.
		 * @function
		 * @returns {undefined}
		 */
		getV3Locations () {
			this.loadingV3Locations = true
			var _this = this
			let paginationPreferences = {
				business_id: Number(this.$root.businessId),
				records_per_page: this.v3Locations.recordsPerPage,
				page_number: this.v3Locations.currentPage,
				sort_by: 'name',
				sort_order: this.v3Locations.sortOrder
			}
			if (this.v3Locations.searchQuery) {
				paginationPreferences.search_query = this.v3Locations.searchQuery
				paginationPreferences.search_in = 'name'
			}
			App.getV3StoreLocations(_this.$root.v3Token, paginationPreferences).then(response => {
				if (response.declaration === 'locations_found') {
					_this.v3Locations.locations = response.payload.locations
					_this.v3Locations.lastPage = response.payload.locations.number_of_pages
				}
				this.loadingV3Locations = false
			}).catch(reason => {
				this.loadingV3Locations = false
				if (paginationPreferences.search_query) {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not find results',
						errorName: 'searchError',
						vue: _this
					})
				}
			})
		},
		/**
		 * To edit a store's details.
		 * @function
		 * @param {object} store - The store object to be edited.
		 * @returns {undefined}
		 */
		editStore (store) {
			this.$router.push('/app/store_manager/edit_store/' + store.id)
		},
		/**
		 * To check if a location exists in ecomm
		 * @function
		 * @param {object} location - The location to verify
		 * @returns {undefined}
		 */
		checkV3Location (location) {
			var _this = this
			App.checkV3Location(_this.$root.appId, _this.$root.appSecret, _this.$root.userToken, _this.$root.v3Token, location.location_id)
			.then(response => {
				_this.editStore(response.payload)
			})
			.catch(reason => {
				if (reason.responseJSON && reason.responseJSON.code === 404 && reason.responseJSON.status === 'notfound') {
					_this.promptCreateStore(location)
				} else {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not get details of this store to edit',
						errorName: 'locationsError',
						vue: _this
					})
				}
			})
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @param {object} location - The v3 location to create
		 * @returns {undefined}
		 */
		promptCreateStore (location) {
			this.$swal({
				title: 'Store not in Ecomm',
				html: '<div>This store does not yet exist in Ecomm.<br/><br/>Do you want to create it now?</div>',
				type: 'info',
				confirmButtonText: 'OK',
				showCancelButton: true,
				cancelButtonText: 'Cancel'
			}).then(() => {
				this.$router.push({path: '/app/store_manager/create_new', query: {v3Location: true, ...location}})
			})
		}
	},
	watch: {
		'searchTerm' () {
			if (!this.searchTerm.length) {
				this.filteredResults = []
			}
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		NoResults,
		Dropdown,
		Pagination,
		PageResults
	}
}
</script>

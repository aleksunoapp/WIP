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
		<div class="margin-top-20">
			<div class="portlet box blue-hoki">
				<div class="portlet-title"
				     @click="toggleStoreSearchPanel()">
					<div class="caption">
						<i class="fa fa-search"></i>
						Search Panel
					</div>
					<div class="tools">
						<a :class="{'expand': !storeSearchCollapse, 'collapse': storeSearchCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body"
				     :class="{'display-hide': storeSearchCollapse}">
					<form role="form"
					      @submit.prevent="advancedSearch()">
						<div class="form-body row">
							<div class="col-md-12">
								<div class="alert alert-danger"
								     v-if="searchError.length">
									<button class="close"
									        data-close="alert"
									        @click.prevent="clearSearchError()"></button>
									<span>{{searchError}}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       :class="{'edited': searchTerm.length}"
									       v-model="searchTerm">
									<label for="search_options_search">Search</label>
									<span class="help-block persist">Search by name, address or internal ID.</span>
								</div>
							</div>
						</div>
						<div class="form-actions right margin-top-20">
							<button type="button"
							        class="btn btn-default"
							        @click.prevent="resetStoreSearch()"> Reset Search</button>
							<button type="submit"
							        class="btn blue">Search</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		<!-- SEARCH END -->

		<!-- LIST START -->
		<loading-screen :show="displayStoreData"
		                :color="'#2C3E50'"
		                :display="'inline'"></loading-screen>
		<div v-if="stores.length && !displayStoreData && !filteredResults.length">
			<div class="portlet light portlet-fit bordered">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image-main">
						<img src="../../../../static/client_logo.png">
					</div>
					<div class="caption">
						<span class="caption-subject font-default bold uppercase">Stores</span>
						<div class="caption-desc font-grey-cascade">Click on a store to edit it.</div>
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
					<div class="clearfix margin-bottom-10">
						<el-dropdown trigger="click"
						             @command="updateSortByOrder"
						             size="mini"
						             :show-timeout="50"
						             :hide-timeout="50">
							<el-button size="mini">
								Sort by
								<span>
									<i class="fa fa-sort-alpha-asc"
									   v-if="sortBy.order === 'ASC'"></i>
									<i class="fa fa-sort-alpha-desc"
									   v-if="sortBy.order === 'DESC'"></i>
								</span>
								<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="ASC">
									<i class="fa fa-sort-alpha-asc"></i>
								</el-dropdown-item>
								<el-dropdown-item command="DESC">
									<i class="fa fa-sort-alpha-desc"></i>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<page-results class="pull-right"
						              :totalResults="stores.length"
						              :activePage="activePage"
						              @pageResults="pageResultsUpdate"></page-results>
					</div>
					<div class="mt-element-list">
						<div class="mt-list-container list-news">
							<ul>
								<li id="parent"
								    class="mt-list-item actions-at-left margin-top-15"
								    v-for="store in currentActivePageItems"
								    @click="editStore(store)"
								    :key="store.id">
									<div class="list-item-actions">

										<el-tooltip v-if="$root.permissions['stores info read'] && !$root.permissions['stores info update']"
										            content="View"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="editStore(store)">
												<i class="fa fa-lg fa-eye"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['stores info update']"
										            content="Edit"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="editStore(store)">
												<i class="fa fa-lg fa-pencil"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['stores info delete']"
										            content="Delete"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="confirmDelete(store)">
												<i class="fa fa-lg fa-trash"></i>
											</a>
										</el-tooltip>
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
						<div class="clearfix"
						     v-if="numPages > 1">
							<pagination :passedPage="activePage"
							            :numPages="numPages"
							            @activePageChange="activePageUpdate"></pagination>
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
						<span class="caption-subject font-default bold uppercase">Stores</span>
						<div class="caption-desc font-grey-cascade">Click on a store to edit it.</div>
					</div>
				</div>
				<div class="portlet-body">
					<div class="clearfix margin-bottom-10">
						<el-dropdown trigger="click"
						             @command="updateSortByOrder"
						             size="mini"
						             :show-timeout="50"
						             :hide-timeout="50">
							<el-button size="mini">
								Sort by
								<span>
									<i class="fa fa-sort-alpha-asc"
									   v-if="sortBy.order === 'ASC'"></i>
									<i class="fa fa-sort-alpha-desc"
									   v-if="sortBy.order === 'DESC'"></i>
								</span>
								<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="ASC">
									<i class="fa fa-sort-alpha-asc"></i>
								</el-dropdown-item>
								<el-dropdown-item command="DESC">
									<i class="fa fa-sort-alpha-desc"></i>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<page-results class="pull-right"
						              :totalResults="filteredResults.length"
						              :activePage="searchActivePage"
						              @pageResults="pageResultsUpdate"></page-results>
					</div>
					<div class="mt-element-list">
						<div class="mt-list-container list-news">
							<ul>
								<li id="parent"
								    class="mt-list-item actions-at-left margin-top-15"
								    v-for="store in currentActiveSearchPageItems"
								    :key="store.id">
									<div class="list-item-actions">
										<el-tooltip v-if="$root.permissions['stores info update']"
										            content="Edit"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="editStore(store)">
												<i class="fa fa-lg fa-pencil"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['stores info delete']"
										            content="Delete"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="confirmDelete(store)">
												<i class="fa fa-lg fa-trash"></i>
											</a>
										</el-tooltip>
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
						<div class="clearfix"
						     v-if="searchNumPages > 1">
							<pagination :passedPage="searchActivePage"
							            :numPages="searchNumPages"
							            @activePageChange="activeSearchPageUpdate"></pagination>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!stores.length && !displayStoreData">
			<no-results :show="!stores.length"
			            :type="'stores'"></no-results>
		</div>
		<!-- LIST END -->

		<!-- DELETE MODAL START -->
		<modal :show="showDeleteModal"
		       effect="fade"
		       @closeOnEscape="closeDeleteModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Store</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<div class="alert alert-danger"
				     v-show="deleteErrorMessage.length"
				     ref="deleteErrorMessage">
					<button class="close"
					        data-close="alert"
					        @click="clearError('deleteErrorMessage')"></button>
					<span>{{deleteErrorMessage}}</span>
				</div>
				<p>Are you sure you want to delete {{storeToDelete.display_name}}</p>
			</div>
			<div slot="modal-footer"
			     class="modal-footer">
				<button type="button"
				        class="btn btn-primary"
				        @click="deleteStore()">Delete</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->
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
import StoresFunctions from '@/controllers/Stores'
import ajaxErrorHandler from '@/controllers/ErrorController'
import Modal from '@/components/modules/Modal'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Store Manager', link: false },
				{ name: 'Stores', link: false }
			],
			displayStoreData: false,
			stores: [],
			storeSearchCollapse: true,
			searchError: '',
			searchTerm: '',
			loadingSearchResults: false,
			listErrorMessage: '',
			activePage: 1,
			resultsPerPage: 25,
			sortBy: {
				order: 'ASC'
			},
			searchActivePage: 1,
			filteredResults: [],
			storeToDelete: {},
			showDeleteModal: false,
			deleteErrorMessage: ''
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.stores.length / this.resultsPerPage)
		},
		currentActivePageItems () {
			return this.userSort(this.stores).slice(
				this.resultsPerPage * (this.activePage - 1),
				this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage
			)
		},
		searchNumPages () {
			return Math.ceil(this.filteredResults.length / this.resultsPerPage)
		},
		currentActiveSearchPageItems () {
			let begin = this.resultsPerPage * (this.searchActivePage - 1)
			let end = this.resultsPerPage * (this.searchActivePage - 1) + this.resultsPerPage
			return this.userSort(this.filteredResults).slice(
				begin,
				end
			)
		}
	},
	mounted () {
		if (this.$root.accountType === 'application_admin') {
			this.getStores()
		} else if (this.$root.accountType === 'store_admin') {
			this.stores = this.$root.storeLocations
		}
	},
	methods: {
		/**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} store - Store the user clicked on
		 * @returns {undefined}
		 */
		confirmDelete (store) {
			this.storeToDelete = {
				...store
			}
			this.showDeleteModal = true
		},
		/**
		 * To close the delete modal
		 * @function
		 * @param {object} store - Store the user clicked on
		 * @returns {undefined}
		 */
		closeDeleteModal (store) {
			this.showDeleteModal = false
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showDeleteSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Store has been deleted'
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
		 * To delete store from the database
		 * @function
		 * @returns {undefined}
		 */
		deleteStore () {
			var storesVue = this
			StoresFunctions.deleteStore(storesVue.storeToDelete.id)
				.then(response => {
					storesVue.getStores()
					storesVue.closeDeleteModal()
					storesVue.showDeleteSuccess(response.payload)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not delete store',
						errorName: 'deleteErrorMessage',
						vue: storesVue
					})
				})
		},
		/**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateSortByOrder (value) {
			this.sortBy.order = value
			this.filteredResults.length
				? this.activeSearchPageUpdate(1)
				: this.activePageUpdate(1)
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
				this.filteredResults.length
					? this.activeSearchPageUpdate(1)
					: this.activePageUpdate(1)
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
		 * To sort the stores list.
		 * @function
		 * @param {array} stores - The array of stores.
		 * @returns {array} - The sorted array of stores
		 */
		userSort (stores) {
			let input = stores
			function asc (a, b) {
				if (a.display_name.toLowerCase() < b.display_name.toLowerCase()) {
					return -1
				} else if (
					a.display_name.toLowerCase() > b.display_name.toLowerCase()
				) {
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
				if (a.display_name.toLowerCase() > b.display_name.toLowerCase()) {
					return -1
				} else if (
					a.display_name.toLowerCase() < b.display_name.toLowerCase()
				) {
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
		 * To clear an error.
		 * @function
		 * @param {string} name - Name of the error variable
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
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
		 * To filter the stores based on the search term.
		 * @function
		 * @returns {undefined}
		 */
		advancedSearch () {
			this.clearSearchError()
			this.filteredResults = []
			if (this.searchTerm.length) {
				if (this.searchTerm.length < 3) {
					this.searchError =
						'In order to use the search field your term must be at least 3 characters.'
				} else {
					for (var i = 0; i < this.stores.length; i++) {
						let searchArea =
							this.stores[i].display_name.toLowerCase() +
							this.stores[i].address_line_1.toLowerCase() +
							this.stores[i].city.toLowerCase() +
							this.stores[i].internal_id.toLowerCase()
						if (searchArea.indexOf(this.searchTerm.toLowerCase()) > -1) {
							this.filteredResults.push(this.stores[i])
						}
					}
					if (!this.filteredResults.length) {
						this.searchError =
							'There are no matching records. Please try again.'
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
			App.getPaginatedStoreLocations(
				storeListVue.$root.appId,
				storeListVue.$root.appSecret,
				storeListVue.$root.userToken,
				{ brand_id: storeListVue.$root.brandId }
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						storeListVue.stores = response.payload
						storeListVue.displayStoreData = false
					} else {
						storeListVue.displayStoreData = false
					}
				})
				.catch(reason => {
					storeListVue.displayStoreData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch stores',
						errorName: 'listErrorMessage',
						vue: storeListVue
					})
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
		}
	},
	watch: {
		searchTerm () {
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
		PageResults,
		Modal
	}
}
</script>

<style scoped>
.mt-element-list .list-news.mt-list-container ul > .mt-list-item:hover {
  background-color: #fff;
}
</style>

<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
	    <h1 class="page-title">Users</h1>
	    <!-- END PAGE TITLE-->
		<div class="note note-info">
            <p>Search and view Application Users.</p>
        </div>

        <!-- SEARCH START -->
        <div class="margin-top-20" v-if="users.length">
			<div class="portlet box blue-hoki">
				<div class="portlet-title" @click="toggleSearchPanel()">
					<div class="caption">
						<i class="fa fa-search"></i>
						Search Panel
					</div>
					<div class="tools">
						<a :class="{'expand': !searchCollapse, 'collapse': searchCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" :class="{'display-hide': searchCollapse}">
					<form role="form">
						<div class="form-body">
							<div class="row">
								<div class="col-md-12">
									<div class="alert alert-danger" v-if="searchError.length">
		                                <button class="close" data-close="alert" @click="clearSearchError()"></button>
		                                <span>{{searchError}}</span>
		                            </div>
								</div>
								<div class="col-md-4">
	        						<div class="form-group form-md-line-input form-md-floating-label">
	              						<input type="text" class="form-control input-sm" :class="{'edited': search.first_name.length}" v-model="search.first_name">
	              						<label for="search_options_search">First name</label>
	              					</div>
								</div>
								<div class="col-md-4">
	        						<div class="form-group form-md-line-input form-md-floating-label">
	              						<input type="text" class="form-control input-sm" :class="{'edited': search.last_name.length}" v-model="search.last_name">
	              						<label for="search_options_search">Last name</label>
	              					</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-4">
	        						<div class="form-group form-md-line-input form-md-floating-label">
	              						<input type="text" class="form-control input-sm" :class="{'edited': search.email.length}" v-model="search.email">
	              						<label for="search_options_search">Email</label>
	              					</div>
								</div>
								<div class="col-md-4">
	        						<div class="form-group form-md-line-input form-md-floating-label">
	              						<input type="text" class="form-control input-sm" :class="{'edited': search.phone.length}" v-model="search.phone">
	              						<label for="search_options_search">Phone</label>
	              					</div>
								</div>								
							</div>
						</div>
						<div class="form-actions right margin-top-20">
							<button type="button" class="btn btn-default" @click="resetSearch()"> Reset Search</button>
							<button type="button" class="btn blue" @click="searchUsers($event)">Search</button>
						</div>
					</form>
      			</div>
      		</div>
        </div>
        <!-- SEARCH END -->

	    <loading-screen :show="displayUserData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
        <div class="margin-top-20" v-if="users.length && !searchResults.length">
	        <div class="relative-block">
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
	  				<page-results class="pull-right" :totalResults="totalResults" :activePage="activePage" @pageResults="resultsPerPageUpdate"></page-results>
				</div>
	  			<div class="margin-top-30 search-content-4">
      				<div class="search-table table-responsive">
      					<table class="table table-bordered table-striped table-condensed table-hover">
      						<thead class="bg-blue-chambray">
      							<tr>
      								<th></th>
      								<th><a class="no-click">Name</a></th>
      								<th><a class="no-click">Email</a></th>
      								<th><a class="no-click">Phone</a></th>
									<th><a class="no-click">City</a></th>
									<th><a class="no-click">Province</a></th>
									<th><a class="no-click">Total orders</a></th>
									<th><a class="no-click">Total spent</a></th>
									<th><a class="no-click">Sign Up Date</a></th>
      							</tr>
      						</thead>
      						<tbody>
      							<tr v-for="user in users" @click="openUserProfile(user)" class="clickable">
      								<td class="profile-image-table-row">
      									<div class="missing-profile-image">
		      								<span v-if="user.first_name || user.last_name">{{ user.first_name.toUpperCase().substring(0, 1) }}{{ user.last_name.toUpperCase().substring(0, 1) }}</span>
		      								<span v-else>{{ user.email.toUpperCase().substring(0, 1) }}</span>
		      							</div>
      								</td>
      								<td>
      									<h3 v-if="user.first_name.length && user.last_name.length">{{ user.first_name }} {{ user.last_name }}</h3>
      								</td>
      								<td> {{ user.email }} </td>
									<td> {{ formatPhone(user.phone) }} </td>
									<td> {{ user.city }} </td>
									<td> {{ user.province }} </td>
									<td> {{ user.total_orders }} </td>
									<td> ${{ user.total_spent }} </td>
      								<td> {{ user.created_at.substring(0,10) }} </td>
      							</tr>
      						</tbody>
      					</table>
      				</div>
      				<div class="clearfix" v-if="users.length && numPages > 1">
      					<pagination :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
      				</div>
      			</div>
	        </div>
	    </div>

        <div class="margin-top-20" v-if="users.length && searchResults.length">
	        <div class="relative-block">
				<div class="clearfix margin-bottom-10" v-if="users.length">
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
	  				<page-results class="pull-right" :totalResults="totalResults" :activePage="searchActivePage" @pageResults="resultsPerPageUpdate"></page-results>
				</div>
	  			<div class="margin-top-30 search-content-4">
      				<div class="search-table table-responsive">
      					<table class="table table-bordered table-striped table-condensed">
      						<thead class="bg-blue-chambray">
      							<tr>
      								<th></th>
      								<th><a class="no-click">Name</a></th>
      								<th><a class="no-click">Email</a></th>
      								<th><a class="no-click">Phone</a></th>
									<th><a class="no-click">City</a></th>
									<th><a class="no-click">Province</a></th>
									<th><a class="no-click">Total orders</a></th>
									<th><a class="no-click">Total spent</a></th>
									<th><a class="no-click">Sign Up Date</a></th>
      							</tr>
      						</thead>
      						<tbody>
      							<tr v-for="user in searchResults">
      								<td class="profile-image-table-row">
      									<div class="missing-profile-image">
		      								<span v-if="user.first_name || user.last_name">{{ user.first_name.toUpperCase().substring(0, 1) }}{{ user.last_name.toUpperCase().substring(0, 1) }}</span>
		      								<span v-else>{{ user.email.toUpperCase().substring(0, 1) }}</span>
		      							</div>
      								</td>
      								<td @click="openUserProfile(user)" class="clickable">
      									<h3 v-if="user.first_name.length && user.last_name.length">{{ user.first_name }} {{ user.last_name }}</h3>
      								</td>
      								<td> {{ user.email }} </td>
									<td> {{ formatPhone(user.phone) }} </td>
									<td> {{ user.city }} </td>
									<td> {{ user.province }} </td>
									<td> {{ user.total_orders }} </td>
									<td> ${{ user.total_spent }} </td>
      								<td> {{ user.created_at.substring(0,10) }} </td>
      							</tr>
      						</tbody>
      					</table>
      				</div>
      				<div class="clearfix" v-if="searchResults.length && searchNumPages > 1">
      					<pagination :passedPage="searchActivePage" :numPages="searchNumPages" @activePageChange="activeSearchPageUpdate"></pagination>
      				</div>
      			</div>
	        </div>
	    </div>
		<div>
			<no-results :show="!users.length && !displayUserData" :type="'users'"></no-results>
		</div>
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import PageResults from '../../modules/PageResults'
import Pagination from '../../modules/Pagination'
import NoResults from '../../modules/NoResults'
import Dropdown from '../../modules/Dropdown'
import Modal from '../../modules/Modal'
import UsersFunctions from '../../../controllers/Users'
import LoadingScreen from '../../modules/LoadingScreen'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Users Manager', link: false},
				{name: 'Users', link: false}
			],
			displayUserData: false,
			userSearchCollapse: true,
			users: [],
			searchCollapse: true,
			search: {
				'first_name': '',
				'last_name': '',
				'email': '',
				'phone': ''
			},
			searchError: '',
			searchResults: [],
			resultsPerPage: 50,
			totalResults: 0,
			sortBy: {
				order: 'ASC'
			},
			activePage: 1,
			numPages: 1,
			searchActivePage: 1,
			searchNumPages: 1
		}
	},
	watch: {
		activePage () {
			this.getUsers()
		}
	},
	mounted () {
		this.getUsers()
	},
	methods: {
		/**
		 * To format a phone number
		 * @function
		 * @param {string} phone - The phone number to format
		 * @returns {string} The formatted phone string
		 */
		formatPhone (phone) {
			try {
				let digits = phone.replace(/\D/g, '')
				return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
			} catch (err) {
				console.log('formatPhone', err)
				return '--'
			}
		},
		/**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateSortByOrder (value) {
			this.sortBy.order = value
			this.searchResults.length ? this.activeSearchPageUpdate(1) : this.activePageUpdate(1)
		},
		/**
		 * To catch updates from the PageResults component when the number of page results is updated.
		 * @function
		 * @param {integer} val - The number of page results to be returned.
		 * @returns {undefined}
		 */
		resultsPerPageUpdate (val) {
			if (parseInt(this.resultsPerPage) !== parseInt(val)) {
				this.resultsPerPage = val
				this.searchResults.length ? this.activeSearchPageUpdate(1) : this.activePageUpdate(1)
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
				this.getUsers()
			} else {
				this.getUsers()
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
				this.searchUsers()
			} else {
				this.searchUsers()
			}
		},
		/**
		 * To toggle the search panel
		 * @function
		 * @returns {undefined}
		 */
		toggleSearchPanel () {
			this.searchCollapse = !this.searchCollapse
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
		 * To clear the current search criteria.
		 * @function
		 * @returns {undefined}
		 */
		resetSearch () {
			this.search = {
				'first_name': '',
				'last_name': '',
				'email': '',
				'phone': ''
			}
			this.searchResults = []
			this.searchActivePage = 1
			this.getUsers()
		},
		/**
		 * To toggle the search panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleUserSearchPanel () {
			this.userSearchCollapse = !this.userSearchCollapse
		},
		/**
		 * To navigate to the profile page of a user.
		 * @function
		 * @param {object} user - The selected user.
		 * @returns {undefined}
		 */
		openUserProfile (user) {
			this.$router.push('/app/user_manager/users/' + user.id)
		},
		/**
		 * To get a list of users.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUsers () {
			this.displayUserData = true
			var usersVue = this
			let paginationPreferences = {
				page: this.activePage,
				order: this.sortBy.order,
				per_page: this.resultsPerPage
			}
			UsersFunctions.getUsers(usersVue.$root.appId, usersVue.$root.appSecret, usersVue.$root.userToken, paginationPreferences).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					usersVue.numPages = response.payload.last_page
					usersVue.totalResults = response.payload.total
					usersVue.users = response.payload.data
					window.scrollTo(0, 0)
					usersVue.displayUserData = false
				} else {
					usersVue.displayUserData = false
				}
			}).catch(reason => {
				usersVue.displayUserData = false
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					usersVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To check if the search data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateSearchData () {
			var userListVue = this
			return new Promise(function (resolve, reject) {
				if (!userListVue.search.first_name && !userListVue.search.last_name && !userListVue.search.email && !userListVue.search.phone) {
					reject('Enter at least one search term')
				} else if ((userListVue.search.first_name && userListVue.search.first_name.length < 3) || (userListVue.search.last_name && userListVue.search.last_name.length < 3) || (userListVue.search.email && userListVue.search.email.length < 3) || (userListVue.search.phone && userListVue.search.phone.length < 3)) {
					reject('Search terms must be at least 3 characters long')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To call the endpoint to create a new location group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		searchUsers () {
			var userListVue = this
			userListVue.clearSearchError()
			return userListVue.validateSearchData()
			.then(response => {
				let searchParams = {}
				searchParams.first_name = this.search.first_name
				searchParams.last_name = this.search.last_name
				searchParams.email = this.search.email
				searchParams.phone = this.search.phone
				searchParams.order = this.sortBy.order
				searchParams.per_page = this.resultsPerPage
				searchParams.page = this.searchActivePage

				UsersFunctions.searchUsers(userListVue.$root.appId, userListVue.$root.appSecret, userListVue.$root.userToken, searchParams).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						userListVue.searchNumPages = response.payload.last_page
						userListVue.totalResults = response.payload.total
						if (response.payload.data.length === 0) {
							userListVue.searchError = 'No results found'
						}
						userListVue.searchResults = response.payload.data
						window.scrollTo(0, 0)
					} else {
						userListVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						userListVue.$router.push('/login/expired')
						return
					}
					userListVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				userListVue.searchError = reason
				window.scrollTo(0, 0)
				throw reason
			})
		}
	},
	components: {
		Breadcrumb,
		PageResults,
		Pagination,
		Dropdown,
		Modal,
		NoResults,
		LoadingScreen
	}
}
</script>
<style>
.search-content-4 .search-table td.profile-image-table-row {
	width:75px;
	padding-right: 15px;
	padding-left: 15px;
}
.missing-profile-image {
	position: relative;
	display: inline-block;
	color: #fff;
	background-color: rgba(44, 62, 80, 0.5);
	width: 100%;
	height: 0;
	padding-right:50px;
	padding: 50% 0;
	border-radius: 50%;
	text-align: center;
	font-size: 15px;
	line-height: 0;
}
</style>

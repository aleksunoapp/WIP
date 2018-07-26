<template>
	<div>
		<div>
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<h1 class='page-title'>Permissions</h1>
			<div class="note note-info">
				<p>Create and manage user permissions.</p>
			</div>

			<!-- CREATE NEW START -->
			<div class="portlet box blue-hoki margin-top-20" v-if="$root.permissions['create permission']">
				<div class="portlet-title bg-blue-chambray" @click="toggleCreatePermissionPanel()">
					<div class="caption">
						<i class="fa fa-plus-circle"></i>
						Create New Permission
					</div>
					<div class="tools">
						<a :class="{'expand': !createCollapse, 'collapse': createCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" v-show="!createCollapse">
					<form role="form" @submit.prevent="createPermission()">
						<div class="row">
							<div class="col-md-12">
								<div class="alert alert-danger" v-show="createErrorMessage.length" ref="createErrorMessage">
									<button class="close" data-close="alert" @click.prevent="clearCreateError()"></button>
									<span>{{createErrorMessage}}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input ref="newPermissionName" type="text" class="form-control input-sm" id="form_control_name" v-model="newPermission.name" :class="{'edited': newPermission.name.length}">
									<label for="form_control_name">Name</label>
								</div>
								<button type="submit" class="btn blue pull-right">Create</button>	
							</div>
						</div>
					</form>
				</div>
			</div>
			<!-- CREATE NEW END -->

			<!-- SEARCH START -->
			<div class="margin-top-20" v-if="permissions.length">
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
					<div class="portlet-body" v-show="!searchCollapse">
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
										<input ref="search" type="text" class="form-control input-sm" :class="{'edited': searchTerm.length}" v-model="searchTerm">
										<label for="search_options_search">Search</label>
										<span class="help-block persist">Search by name.</span>
									</div>
								</div>
							</div>
							<div class="form-actions right margin-top-20">
								<button type="button" class="btn btn-default" @click.prevent="resetSearch()"> Reset Search</button>
								<button type="submit" class="btn blue">Search</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<!-- SEARCH END -->

			<!-- LIST START -->
			<loading-screen :show="loading" :color="'#2C3E50'" :display="'inline'"></loading-screen>
			<div v-if="permissions.length && !loading && !filteredResults.length">
				<div class="portlet light portlet-fit bordered margin-top-20">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-green bold uppercase">Permissions</span>
							<div class="caption-desc font-grey-cascade">Click on the edit button to edit a permission.</div>
						</div>
					</div>
					<div class="portlet-body">
						<div class="clearfix margin-bottom-10" v-if="permissions.length">
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
							<page-results class="pull-right" :totalResults="permissions.length" :activePage="activePage" @pageResults="pageResultsUpdate"></page-results>
						</div>
						<div class="mt-element-list">
							<div class="mt-list-container list-news">
								<ul>
									<li class="mt-list-item actions-at-left margin-top-15" v-for="permission in currentActivePageItems" :id="'permission-' + permission.id" :class="{'animated' : animated === `permission-${permission.id}`}" :key="permission.id">
										<div class="list-item-actions">
											<el-tooltip 
												v-if="$root.permissions['update permission']"
												content="Edit" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editPermission(permission)">
													<i class="fa fa-pencil" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['list permission'] && !$root.permissions['update permission']"
												content="View" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editPermission(permission)">
													<i class="fa fa-eye" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['delete permission']"
												content="Delete" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="showDeleteModal(permission)">
													<i class="fa fa-trash" aria-hidden="true"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="list-datetime bold uppercase font-red">
											<span>{{ permission.name }}</span>
										</div>
									</li>
								</ul>
							</div>
							<div class="clearfix" v-if="permissions.length && numPages > 1">
								<pagination :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
							</div>
						</div>
						<div class="alert alert-danger" v-show="listErrorMessage.length" ref="listErrorMessage">
							<button class="close" data-close="alert" @click="clearListError()"></button>
							<span>{{listErrorMessage}}</span>
						</div>
					</div>
				</div>
			</div>
			<div v-if="permissions.length && !loading && filteredResults.length">
				<div class="portlet light portlet-fit bordered margin-top-20">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-green bold uppercase">Search Results</span>
							<div class="caption-desc font-grey-cascade">Click on the edit button to edit a permission.</div>
						</div>
					</div>
					<div class="portlet-body">
						<div class="clearfix margin-bottom-10" v-if="filteredResults.length">
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
							<page-results class="pull-right" :totalResults="filteredResults.length" :activePage="searchActivePage" @pageResults="pageResultsUpdate"></page-results>
						</div>
						<div class="mt-element-list">
							<div class="mt-list-container list-news">
								<ul>
									<li class="mt-list-item actions-at-left margin-top-15" v-for="permission in currentActiveSearchPageItems" :id="'permission-' + permission.id" :class="{'animated' : animated === `permission-${permission.id}`}" :key="permission.id">
										<div class="list-item-actions">
											<el-tooltip 
												v-if="$root.permissions['update permission']"
												content="Edit" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editPermission(permission)">
													<i class="fa fa-pencil" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['list permission'] && !$root.permissions['update permission']"
												content="View" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editPermission(permission)">
													<i class="fa fa-eye" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['delete permission']"
												content="Delete" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="showDeleteModal(permission)">
													<i class="fa fa-trash" aria-hidden="true"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="list-datetime bold uppercase font-red">
											<span>{{ permission.name }}</span>
										</div>
									</li>
								</ul>
							</div>
							<div class="clearfix" v-if="filteredResults.length && searchNumPages > 1">
								<pagination :passedPage="searchActivePage" :numPages="searchNumPages" @activePageChange="activeSearchPageUpdate"></pagination>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="!permissions.length && !loading">
				<no-results :show="!permissions.length" :type="'permissions'"></no-results>
			</div>
		</div>
		<!-- LIST END -->

		<!-- EDIT MODAL START -->
		<modal :show="showEditPermissionModal" effect="fade" @closeOnEscape="closeEditPermissionModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditPermissionModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Permission</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="editErrorMessage.length" ref="editErrorMessage">
					<button class="close" data-close="alert" @click="clearEditError()"></button>
					<span>{{editErrorMessage}}</span>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input 
						:disabled="$root.permissions['list permission'] && !$root.permissions['update permission']"
						type="text" 
						class="form-control input-sm" 
						id="form_control_edited_name" 
						v-model="permissionToEdit.name" 
						:class="{'edited': permissionToEdit.name.length}">
					<label for="form_control_edited_name">Name</label>
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button 
					v-if="$root.permissions['list permission'] && !$root.permissions['update permission']"
					type="button" 
					class="btn btn-primary" 
					@click="closeEditPermissionModal()">
					Close
				</button>
				<button 
					v-else
					type="button" 
					class="btn btn-primary" 
					@click="updatePermission()">
					Save
				</button>
			</div>
		</modal>
		<!-- EDIT MODAL END -->

		<!-- DELETE MODAL START -->
		<modal :show="showDeletePermissionModal" effect="fade" @closeOnEscape="closeDeletePermissionModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeletePermissionModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Permission</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="deleteErrorMessage.length" ref="deleteErrorMessage">
					<button class="close" data-close="alert" @click="clearDeleteError()"></button>
					<span>{{deleteErrorMessage}}</span>
				</div>
				<p>Are you sure you want to delete this permission?</p>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-primary" @click="deletePermission()">Delete</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->

	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import PermissionsFunctions from '../../../controllers/Permissions'
import Modal from '../../modules/Modal'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Admin Manager', link: false},
				{name: 'Permissions', link: false}
			],
			createCollapse: true,
			createErrorMessage: '',
			newPermission: {
				name: '',
				guard_name: 'admin',
				permissions: []
			},
			editErrorMessage: '',
			permissionToEdit: {
				name: '',
				guard_name: 'admin',
				permissions: []
			},
			loading: false,
			permissions: [],
			showEditPermissionModal: false,
			animated: '',
			searchCollapse: true,
			searchError: '',
			filteredResults: [],
			searchTerm: '',
			activePage: 1,
			resultsPerPage: 25,
			sortBy: {
				order: 'ASC'
			},
			searchActivePage: 1,
			showDeletePermissionModal: false,
			permissionToDelete: {
				name: ''
			},
			listErrorMessage: '',
			deleteErrorMessage: ''
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.permissions.length / this.resultsPerPage)
		},
		currentActivePageItems () {
			return this.userSort(this.permissions).slice(this.resultsPerPage * (this.activePage - 1), this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage)
		},
		searchNumPages () {
			return Math.ceil(this.filteredResults.length / this.resultsPerPage)
		},
		currentActiveSearchPageItems () {
			return this.userSort(this.filteredResults).slice(this.resultsPerPage * (this.searchActivePage - 1), this.resultsPerPage * (this.searchActivePage - 1) + this.resultsPerPage)
		}
	},
	created () {
		this.getAllPermissions()
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
				return ''
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
			this.filteredResults.length ? this.activeSearchPageUpdate(1) : this.activePageUpdate(1)
		},
		/**
		 * To sort the orders list.
		 * @function
		 * @param {array} orders - The array of orders.
		 * @returns {array} - The sorted array of orders
		 */
		userSort (orders) {
			let input = orders
			function asc (a, b) {
				if (a.name.toLowerCase() < b.name.toLowerCase()) {
					return -1
				} else if (a.name.toLowerCase() > b.name.toLowerCase()) {
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
				if (a.name.toLowerCase() > b.name.toLowerCase()) {
					return -1
				} else if (a.name.toLowerCase() < b.name.toLowerCase()) {
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
		 * To toggle the search panel
		 * @function
		 * @returns {undefined}
		 */
		toggleSearchPanel () {
			this.searchCollapse = !this.searchCollapse
			this.$nextTick(function () {
				if (!this.searchCollapse) {
					this.$refs.search.focus()
				}
			})
		},
		/**
		 * To filter the results based on the search term.
		 * @function
		 * @returns {undefined}
		 */
		advancedSearch () {
			this.clearSearchError()
			this.filteredResults = []
			if (this.searchTerm.length) {
				if (this.searchTerm.length < 3) {
					this.searchError = 'Search term must be at least 3 characters.'
				} else {
					for (var i = 0; i < this.permissions.length; i++) {
						if (this.permissions[i].name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
							this.filteredResults.push(this.permissions[i])
						}
					}
					if (!this.filteredResults.length) {
						this.searchError = 'There are no matching records. Please try again.'
					}
				}
			} else {
				this.$refs.search.focus()
			}
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
			this.searchTerm = ''
			this.filteredResults = []
			this.activePage = 1
			this.searchActivePage = 1
			this.clearSearchError()
		},
		/**
		 * To display the edit modal
		 * @function
		 * @param {object} permission - The permission object to be edited
		 * @returns {undefined}
		 */
		editPermission (permission) {
			this.permissionToEdit = {...permission}
			this.showEditPermissionModal = true
		},
		/**
		 * To display the delete modal
		 * @function
		 * @param {object} permission - The permission object to be edited
		 * @returns {undefined}
		 */
		showDeleteModal (permission) {
			this.permissionToDelete = {...permission}
			this.showDeletePermissionModal = true
		},
		/**
		 * To close the delete modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		closeDeletePermissionModal () {
			this.clearDeleteError()
			this.showDeletePermissionModal = false
		},
		/**
		 * To delete a permission.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deletePermission () {
			this.loading = true
			this.clearDeleteError()
			var permissionsVue = this
			return PermissionsFunctions.deletePermission(permissionsVue.permissionToDelete)
			.then(response => {
				permissionsVue.getAllPermissions()
				permissionsVue.closeDeletePermissionModal()
				permissionsVue.showDeleteSuccess()
				permissionsVue.resetDeleteForm()
			}).catch(reason => {
				permissionsVue.loading = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not delete permission',
					errorName: 'deleteErrorMessage',
					vue: permissionsVue
				})
			})
		},
		/**
		 * To close the edit modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		closeEditPermissionModal () {
			this.clearEditError()
			this.showEditPermissionModal = false
		},
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllPermissions () {
			this.loading = true
			this.clearListError()
			var permissionsVue = this
			return PermissionsFunctions.getAllPermissions()
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					permissionsVue.loading = false
					permissionsVue.permissions = response.payload
				} else {
					permissionsVue.loading = false
				}
			}).catch(reason => {
				permissionsVue.loading = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not get permissions',
					errorName: 'listErrorMessage',
					vue: permissionsVue
				})
			})
		},
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createPermission () {
			var permissionsVue = this

			return this.validateNewPermissionData()
			.then((response) => {
				permissionsVue.clearCreateError()
				return PermissionsFunctions.createPermission(permissionsVue.newPermission)
				.then(response => {
					permissionsVue.getAllPermissions()
					permissionsVue.resetCreateForm()
					permissionsVue.showCreateSuccess()
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not get create permission',
						errorName: 'createErrorMessage',
						vue: permissionsVue
					})
				})
			}).catch(reason => {
				permissionsVue.createErrorMessage = reason
				permissionsVue.$scrollTo(permissionsVue.$refs.createErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetCreateForm () {
			this.newPermission = {
				name: '',
				guard_name: 'admin',
				permissions: []
			}
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetEditForm () {
			this.permissionToEdit = {
				name: '',
				guard_name: 'admin',
				permissions: []
			}
		},
		/**
		 * To reset the delete form.
		 * @function
		 * @returns {undefined}
		 */
		resetDeleteForm () {
			this.permissionToDelete = {
				name: ''
			}
		},
		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		showCreateSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Permission successfully created',
				type: 'success'
			})
		},
		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		showEditSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Permission saved',
				type: 'success'
			})
		},
		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		showDeleteSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Permission deleted',
				type: 'success'
			})
		},
		/**
		 * To toggle the create new panel.
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePermissionPanel () {
			this.createCollapse = !this.createCollapse
			this.$nextTick(function () {
				if (!this.createCollapse) {
					this.$refs.newPermissionName.focus()
				}
			})
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearCreateError () {
			this.createErrorMessage = ''
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearEditError () {
			this.editErrorMessage = ''
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearListError () {
			this.listErrorMessage = ''
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
		 * To update a permission.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updatePermission () {
			var permissionsVue = this

			return this.validateEditedPermissionData()
			.then((response) => {
				permissionsVue.clearEditError()
				return PermissionsFunctions.updatePermission(permissionsVue.permissionToEdit)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						permissionsVue.closeEditPermissionModal()
						permissionsVue.showEditSuccess()
						for (var i = 0; i < permissionsVue.permissions.length; i++) {
							if (permissionsVue.permissions[i].id === response.payload.id) {
								permissionsVue.permissions[i].name = response.payload.name
							}
						}
						permissionsVue.animated = `permission-${response.payload.id}`
						permissionsVue.resetEditForm()
						window.setTimeout(() => {
							permissionsVue.animated = ''
						}, 3000)
					} else {
						console.log('threw me')
						let me = new Error(response)
						throw me
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not get save permission',
						errorName: 'editErrorMessage',
						vue: permissionsVue
					})
				})
			}).catch(reason => {
				permissionsVue.editErrorMessage = reason
				permissionsVue.$scrollTo(permissionsVue.$refs.editErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewPermissionData () {
			var permissionsVue = this
			return new Promise(function (resolve, reject) {
				if (!permissionsVue.newPermission.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedPermissionData () {
			var permissionsVue = this
			return new Promise(function (resolve, reject) {
				if (!permissionsVue.permissionToEdit.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		}
	},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		Modal,
		Pagination,
		PageResults
	}
}
</script>

<style scoped>
.animated {
	animation: listItemHighlight 1s 2 ease-in-out both;
}
.mt-element-list .list-news.mt-list-container ul>.mt-list-item:hover {
	background-color: white;
}
.mt-element-list .list-news.mt-list-container ul>.mt-list-item {
	min-height: 80px;
}
</style>

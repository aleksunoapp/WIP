<template>
	<div>
		<div>
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<h1 class='page-title'>Roles</h1>
			<div class="note note-info">
				<p>Create and manage user roles.</p>
			</div>

			<!-- CREATE NEW START -->
			<div class="portlet box blue-hoki margin-top-20" v-if="$root.permissions['create role']">
				<div class="portlet-title bg-blue-chambray" @click="toggleCreateRolePanel()">
					<div class="caption">
						<i class="fa fa-plus-circle"></i>
						Create New Role
					</div>
					<div class="tools">
						<a :class="{'expand': !createCollapse, 'collapse': createCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" v-show="!createCollapse">
					<form role="form" @submit.prevent="createRole()">
						<div class="row">
							<div class="col-md-12">
								<div class="alert alert-danger" v-show="createErrorMessage.length" ref="createErrorMessage">
									<button 
										class="close" 
										data-close="alert" 
										@click.prevent="clearCreateError()"></button>
									<span>{{createErrorMessage}}</span>
								</div>
							</div>
							<div class="col-xs-12">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input ref="newRoleName" type="text" class="form-control input-sm" id="form_control_name" v-model="newRole.name" :class="{'edited': newRole.name.length}">
									<label for="form_control_name">Name</label>
								</div>
								<el-tree 
									:data="roleTree" 
									:highlight-current="true"
									:props="{'label': 'name', 'children': 'combined'}"
									:check-on-click-node="true"
									:expand-on-click-node="false"
									@check-change="setNewRolePermission"
									show-checkbox 
								>
									<span 
										slot-scope="{ node, data }"
										:class="{'module': data.module_id === undefined}"
									>
										{{data.name}}
									</span>
								</el-tree>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-6">
								<button type="submit" class="btn blue pull-right">Create</button>	
							</div>
						</div>
					</form>
				</div>
			</div>
			<!-- CREATE NEW END -->

			<!-- SEARCH START -->
			<div class="margin-top-20" v-if="roles.length">
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
										<button class="close" data-close="alert" @click="clearSearchError()"></button>
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
			<div v-if="roles.length && !loading && !filteredResults.length">
				<div class="portlet light portlet-fit bordered margin-top-20">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-green bold uppercase">Roles</span>
							<div class="caption-desc font-grey-cascade">Click on the edit button to edit a role and change the permissions it contains.</div>
						</div>
					</div>
					<div class="portlet-body">
						<div class="clearfix margin-bottom-10" v-if="roles.length">
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
							<page-results class="pull-right" :totalResults="roles.length" :activePage="activePage" @pageResults="pageResultsUpdate"></page-results>
						</div>
						<div class="mt-element-list">
							<div class="mt-list-container list-news">
								<ul>
									<li class="mt-list-item actions-at-left margin-top-15" v-for="role in currentActivePageItems" :id="'role-' + role.id" :class="{'animated' : animated === `role-${role.id}`}" :key="role.id">
										<div class="list-item-actions">
											<el-tooltip 
												v-if="$root.permissions['update role']"
												content="Edit" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editRole(role)">
													<i class="fa fa-pencil" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['create role'] && !$root.permissions['update role']"
												content="View" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editRole(role)">
													<i class="fa fa-eye" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['delete role']"
												content="Delete" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="openDeleteModal(role)">
													<i class="fa fa-trash" aria-hidden="true"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="list-datetime bold uppercase font-red">
											<span>{{ role.name }}</span>
										</div>
									</li>
								</ul>
							</div>
							<div class="clearfix" v-if="roles.length && numPages > 1">
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
			<div v-if="roles.length && !loading && filteredResults.length">
				<div class="portlet light portlet-fit bordered margin-top-20">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-green bold uppercase">Search Results</span>
							<div class="caption-desc font-grey-cascade">Click on the edit button to edit a role and change the permissions it contains.</div>
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
									<li class="mt-list-item actions-at-left margin-top-15" v-for="role in currentActiveSearchPageItems" :id="'role-' + role.id" :class="{'animated' : animated === `role-${role.id}`}" :key="role.id">
										<div class="list-item-actions">
											<el-tooltip 
												v-if="$root.permissions['update role']"
												content="Edit" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editRole(role)">
													<i class="fa fa-pencil" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['create role'] && !$root.permissions['update role']"
												content="View" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editRole(role)">
													<i class="fa fa-eye" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['delete role']"
												content="Delete" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="openDeleteModal(role)">
													<i class="fa fa-trash" aria-hidden="true"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="list-datetime bold uppercase font-red">
											<span>{{ role.name }}</span>
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
			<div v-if="!roles.length && !loading">
				<no-results :show="!roles.length" :type="'roles'"></no-results>
			</div>
		</div>
		<!-- LIST END -->

		<!-- EDIT MODAL START -->
		<modal 
			:width="900"
			:show="showEditRoleModal" 
			effect="fade" 
			@closeOnEscape="closeEditRoleModal" 
			ref="editModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditRoleModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Role</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="editErrorMessage.length" ref="editErrorMessage">
					<button class="close" data-close="alert" @click="clearEditError()"></button>
					<span>{{editErrorMessage}}</span>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm" id="form_control_edited_name" v-model="roleToEdit.name" :class="{'edited': roleToEdit.name.length}">
					<label for="form_control_edited_name">Name</label>
				</div>
				<el-tree 
					v-if="showEditRoleModal"
					:data="roleTree" 
					:highlight-current="true"
					:props="{'label': 'name', 'children': 'combined', 'disabled': 'disabled'}"
					:check-on-click-node="true"
					:expand-on-click-node="false"
					@check-change="setEditedRolePermission"
					show-checkbox 
					node-key="nodeId"
					:default-checked-keys="roleToEdit.previouslySelected"
				>
					<span 
						slot-scope="{ node, data }"
						:class="{'module': data.module_id === undefined}"
					>
						{{data.name}}
					</span>
				</el-tree>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button 
					v-if="$root.permissions['create role'] && !$root.permissions['update role']"
					type="button" 
					class="btn btn-primary" 
					@click="closeEditRoleModal()">
					Close
				</button>
				<button 
					v-else
					type="button" 
					class="btn btn-primary" 
					@click="updateRole()">
					Save
				</button>
			</div>
		</modal>
		<!-- EDIT MODAL END -->

		<!-- DELETE MODAL START -->
		<modal :show="showDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Role</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="deleteErrorMessage.length" ref="deleteErrorMessage">
					<button class="close" data-close="alert" @click="clearDeleteError()"></button>
					<span>{{deleteErrorMessage}}</span>
				</div>
				<p>Do you want to delete <strong>{{roleToDelete.name}}</strong>?</p>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-primary" @click="deleteRole()">Delete</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->

	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import RolesFunctions from '../../../controllers/Roles'
import PermissionsPicker from './PermissionsPicker'
import Modal from '../../modules/Modal'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import ModulesFunctions from '../../../controllers/Modules'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Admin Manager', link: false},
				{name: 'Roles', link: false}
			],
			createCollapse: true,
			createErrorMessage: '',
			newRole: {
				name: '',
				guard_name: 'admin',
				permissions: []
			},
			editErrorMessage: '',
			roleToEdit: {
				name: '',
				guard_name: 'admin',
				permissions: []
			},
			loading: false,
			roles: [],
			showEditRoleModal: false,
			showDeleteModal: false,
			deleteErrorMessage: '',
			roleToDelete: {},
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
			roleTree: [],
			cleanRoleTree: [],
			modules: []
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.roles.length / this.resultsPerPage)
		},
		currentActivePageItems () {
			return this.userSort(this.roles).slice(this.resultsPerPage * (this.activePage - 1), this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage)
		},
		searchNumPages () {
			return Math.ceil(this.filteredResults.length / this.resultsPerPage)
		},
		currentActiveSearchPageItems () {
			return this.userSort(this.filteredResults).slice(this.resultsPerPage * (this.searchActivePage - 1), this.resultsPerPage * (this.searchActivePage - 1) + this.resultsPerPage)
		}
	},
	created () {
		this.getRoles()
		this.getModules()
	},
	methods: {
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModules () {
			this.loading = true
			this.clearListError()
			var rolesVue = this
			return ModulesFunctions.getFullModules()
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					rolesVue.loading = false

					let role = rolesVue.listToTree(response.payload, response.payload.filter(mod => mod.parent_module === 0)[0])

					for (let mod of role) {
						rolesVue.combinePermissionsAndModules(mod)
					}

					rolesVue.cleanRoleTree = role
					rolesVue.roleTree = role

					rolesVue.modules = response.payload
				} else {
					rolesVue.loading = false
				}
			}).catch(reason => {
				rolesVue.loading = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not get modules',
					errorName: 'listErrorMessage',
					vue: rolesVue
				})
			})
		},
		/**
		 * To convert a flat list of nodes into a tree.
		 * @function
		 * @param {array} arr - The flat array
		 * @param {parent} parent - The root node
		 * @returns {array} - An array of nested nodes
		 */
		listToTree (arr, parent) {
			try {
				let tree = []
				let mappedArr = {}
				let arrElem
				let mappedElem

				// First map the nodes of the array to an object -> create a hash table.
				for (var i = 0, len = arr.length; i < len; i++) {
					arrElem = arr[i]
					mappedArr[arrElem.id] = arrElem
				}

				for (var id in mappedArr) {
					if (mappedArr.hasOwnProperty(id)) {
						mappedElem = mappedArr[id]
						// If the element is not at the root level, add it to its parent array of children.
						if (mappedElem.parent_module) {
							mappedArr[mappedElem['parent_module']]['sub_modules'].push(mappedElem)
						// If the element is at the root level, add it to first level elements array.
						} else {
							mappedElem.disabled = this.$root.permissions['update role'] === undefined
							tree.push(mappedElem)
						}
					}
				}
				return tree
			} catch (e) {
				console.log(e)
			}
		},
		/**
		 * To combine permissions and sub_modules into a field for the tree component to display
		 * @function
		 * @param {object} current - The tree node to process
		 * @returns {undefined}
		 */
		combinePermissionsAndModules (current) {
			try {
				const _this = this
				let ownPermissions = current.permissions.filter(permission => this.$root.permissions[permission.name])
				current.combined = [...ownPermissions, ...current.sub_modules]
				current.combined = current.combined.map(item => {
					item.nodeId = item.module_id === undefined ? `m${item.id}` : `p${item.id}`
					item.disabled = _this.$root.permissions['update role'] === undefined
					return item
				})

				var children = current.sub_modules
				for (var i = 0; i < children.length; i++) {
					_this.combinePermissionsAndModules(children[i])
				}
			} catch (e) {
				console.log(e)
			}
		},
		/**
		 * To update the permissions selection when editing a role
		 * @function
		 * @param {object} node - The node object being selected
		 * @param {boolean} selected - The status of the node
		 * @returns {undefined}
		 */
		setEditedRolePermission (node, selected) {
			if (node.module_id !== undefined) {
				let index = this.roleToEdit.permissions.indexOf(node.id)
				if (selected) {
					if (index === -1) {
						this.roleToEdit.permissions.push(node.id)
					}
				} else {
					if (index !== -1) {
						this.roleToEdit.permissions = this.roleToEdit.permissions.filter(x => x !== node.id)
					}
				}
			}
		},
		/**
		 * To update the permissions selection when creating a role
		 * @function
		 * @param {object} node - The node object being selected
		 * @param {boolean} selected - The status of the node
		 * @returns {undefined}
		 */
		setNewRolePermission (node, selected) {
			if (node.module_id !== undefined) {
				let index = this.newRole.permissions.indexOf(node.id)
				if (selected) {
					if (index === -1) {
						this.newRole.permissions.push(node.id)
					}
				} else {
					if (index !== -1) {
						this.newRole.permissions = this.newRole.permissions.filter(x => x !== node.id)
					}
				}
			}
		},
		/**
		 * To update permissions based on user's selection
		 * @function
		 * @param {array} permissions - An array of permission ids
		 * @returns {undefined}
		 */
		updateNewRolePermissions (permissions) {
			this.newRole.permissions = permissions
		},
		/**
		 * To update permissions based on user's selection
		 * @function
		 * @param {array} permissions - An array of permission ids
		 * @returns {undefined}
		 */
		updateEditedRolePermissions (permissions) {
			this.roleToEdit.permissions = [...permissions]
		},
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
					for (var i = 0; i < this.roles.length; i++) {
						if (this.roles[i].name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
							this.filteredResults.push(this.roles[i])
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
		 * @param {object} role - The role object to be edited
		 * @returns {undefined}
		 */
		editRole (role) {
			let rolesVue = this
			this.listRolePermissions(role)
			.then(permissions => {
				rolesVue.roleToEdit = {
					...role,
					permissions,
					previouslySelected: permissions.map(id => `p${id}`)
				}
			}).catch(err => {
				rolesVue.roleToEdit = {
					...role,
					permissions: []
				}
				console.log(err)
			}).finally(() => {
				rolesVue.showEditRoleModal = true
			})
		},
		/**
		 * To fetch permissions for a role
		 * @function
		 * @param {object} role - The role to fetch permissions for
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		listRolePermissions (role) {
			return RolesFunctions.listRolePermissions(role)
			.then(response => {
				return response.payload.permissions.map(permission => permission.id)
			}).catch(reason => {
				return []
			})
		},
		/**
		 * To close the edit modal
		 * @function
		 * @returns {undefined}
		 */
		closeEditRoleModal () {
			this.showEditRoleModal = false
		},
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getRoles () {
			this.loading = true
			this.clearListError()
			var rolesVue = this
			return RolesFunctions.getRoles()
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					rolesVue.loading = false
					rolesVue.roles = response.payload
				} else {
					rolesVue.loading = false
				}
			}).catch(reason => {
				rolesVue.loading = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not get roles',
					errorName: 'listErrorMessage',
					vue: rolesVue
				})
			})
		},
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createRole () {
			var rolesVue = this

			return this.validateNewRoleData()
			.then((response) => {
				rolesVue.clearCreateError()
				return RolesFunctions.createRole(rolesVue.newRole)
				.then(response => {
					rolesVue.getRoles()
					rolesVue.resetCreateForm()
					rolesVue.showCreateSuccess()
				}).catch(reason => {
					console.log(reason)
					ajaxErrorHandler({
						reason,
						errorText: 'Could not create role',
						errorName: 'createErrorMessage',
						vue: rolesVue
					})
				})
			}).catch(reason => {
				rolesVue.createErrorMessage = reason
				rolesVue.$scrollTo(rolesVue.$refs.createErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetCreateForm () {
			this.createCollapse = true
			this.newRole = {
				name: '',
				guard_name: 'admin',
				permissions: []
			}
			this.roleTree = [...this.cleanRoleTree]
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetEditForm () {
			this.roleToEdit = {
				name: '',
				guard_name: 'admin',
				permissions: []
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
				text: 'Role successfully created',
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
				text: 'Role saved',
				type: 'success'
			})
		},
		/**
		 * To toggle the create new panel.
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateRolePanel () {
			this.createCollapse = !this.createCollapse
			this.$nextTick(function () {
				if (!this.createCollapse) {
					this.$refs.newRoleName.focus()
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
		 * To update a role.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateRole () {
			var rolesVue = this

			return this.validateEditedRoleData()
			.then((response) => {
				rolesVue.clearEditError()
				return RolesFunctions.updateRole(rolesVue.roleToEdit)
				.then(response => {
					rolesVue.closeEditRoleModal()
					rolesVue.showEditSuccess()
					for (var i = 0; i < rolesVue.roles.length; i++) {
						if (rolesVue.roles[i].id === rolesVue.roleToEdit.id) {
							rolesVue.roles[i].name = response.payload.name
						}
					}
					rolesVue.animated = `role-${rolesVue.roleToEdit.id}`
					rolesVue.resetEditForm()
					window.setTimeout(() => {
						rolesVue.animated = ''
					}, 3000)
				}).catch(reason => {
					rolesVue.$refs.editModal.$el.scrollTop = 0
					ajaxErrorHandler({
						reason,
						errorText: 'Could not save role',
						errorName: 'editErrorMessage',
						vue: rolesVue
					})
				})
			}).catch(reason => {
				rolesVue.editErrorMessage = reason
				rolesVue.$refs.editModal.$el.scrollTop = 0
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewRoleData () {
			var rolesVue = this
			return new Promise(function (resolve, reject) {
				if (!rolesVue.newRole.name.length) {
					reject('Name cannot be blank')
				} else if (!rolesVue.newRole.permissions.length) {
					reject('Select at least one permission')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedRoleData () {
			var rolesVue = this
			return new Promise(function (resolve, reject) {
				if (!rolesVue.roleToEdit.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To open the delete modal
		 * @function
		 * @param {object} role - The role to delete
		 * @returns {undefined}
		 */
		openDeleteModal (role) {
			this.roleToDelete = {...role}
			this.showDeleteModal = true
		},
		/**
		 * To close the delete modal
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.showDeleteModal = false
			this.resetDeleteForm()
		},
		/**
		 * To clear the delete form
		 * @function
		 * @returns {undefined}
		 */
		resetDeleteForm () {
			this.roleToDelete = {}
		},
		/**
		 * To clear the delete error
		 * @function
		 * @returns {undefined}
		 */
		clearDeleteError () {
			this.deleteErrorMessage = ''
		},
		/**
		 * To confirm deletion
		 * @function
		 * @param {array} permissions - An array of permission ids
		 * @returns {undefined}
		 */
		showDeleteSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Role deleted',
				type: 'success'
			})
		},
		/**
		 * To delete a role
		 * @function
		 * @returns {undefined}
		 */
		deleteRole () {
			this.clearDeleteError()
			var rolesVue = this
			return RolesFunctions.deleteRole(rolesVue.roleToDelete)
			.then(response => {
				rolesVue.getRoles()
				rolesVue.closeDeleteModal()
				rolesVue.showDeleteSuccess()
				rolesVue.resetDeleteForm()
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'Could not delete role',
					errorName: 'deleteErrorMessage',
					vue: rolesVue
				})
			})
		}
	},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		Modal,
		Pagination,
		PageResults,
		PermissionsPicker
	}
}
</script>

<style scoped>
.animated {
	animation: listItemHighlight 1s 2 ease-in-out both;
}
.mt-element-list .list-news.mt-list-container ul>.mt-list-item {
	min-height: 80px;
}
.mt-element-list .list-news.mt-list-container ul>.mt-list-item:hover {
	background-color: white;
}
.module {
	font-weight: bold;
}
</style>

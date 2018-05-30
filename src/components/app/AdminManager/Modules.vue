<template>
	<div>
		<div>
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<h1 class='page-title'>Modules</h1>
			<div class="note note-info">
				<p>Create and manage permission modules.</p>
			</div

			<!-- CREATE NEW START -->
			<div class="portlet box blue-hoki margin-top-20">
				<div class="portlet-title bg-blue-chambray" @click="toggleCreateModulePanel()">
					<div class="caption">
						<i class="fa fa-plus-circle"></i>
						Create New Module
					</div>
					<div class="tools">
						<a :class="{'expand': !createCollapse, 'collapse': createCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" v-show="!createCollapse">
					<form role="form" @submit.prevent="createModule()">
						<div class="row">
							<div class="col-md-12">
								<div class="alert alert-danger" v-show="createErrorMessage.length" ref="createErrorMessage">
									<button class="close" data-close="alert" @click.prevent="clearCreateError()"></button>
									<span>{{createErrorMessage}}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input ref="newModuleName" type="text" class="form-control input-sm" id="form_control_name" v-model="newModule.name" :class="{'edited': newModule.name.length}">
									<label for="form_control_name">Name</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" id="form_control_sort_order" v-model="newModule.sort_order" :class="{'edited': newModule.sort_order.length}">
									<label for="form_control_sort_order">Sort order</label>
								</div>
								<p v-show="modules.length">Place inside:</p>
								<el-tree 
									:data="moduleTree" 
									:default-expand-all="true"
									:highlight-current="true"
									:expand-on-click-node="false"
									:props="{'label': 'name', 'children': 'sub_modules'}" 
									@node-click="setParentModule"
								>
								</el-tree>
								<button type="submit" class="btn blue pull-right">Create</button>	
							</div>
						</div>
					</form>
				</div>
			</div>
			<!-- CREATE NEW END -->

			<!-- SEARCH START -->
			<div class="margin-top-20" v-if="modules.length">
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
			<div v-if="modules.length && !loading && !filteredResults.length">
				<div class="portlet light portlet-fit bordered margin-top-20">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-green bold uppercase">Modules</span>
							<div class="caption-desc font-grey-cascade">Click on the edit button to edit a module.</div>
						</div>
					</div>
					<div class="portlet-body">
						<div class="clearfix margin-bottom-10" v-if="modules.length">
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
							<page-results class="pull-right" :totalResults="modules.length" :activePage="activePage" @pageResults="pageResultsUpdate"></page-results>
						</div>
						<div class="alert alert-danger" v-show="listErrorMessage.length" ref="listErrorMessage">
							<button class="close" data-close="alert" @click="clearListError()"></button>
							<span>{{listErrorMessage}}</span>
						</div>
						<div class="mt-element-list">
							<div class="mt-list-container list-news">
								<ul>
									<li class="mt-list-item actions-at-left margin-top-15" v-for="mod in currentActivePageItems" :id="'module-' + mod.id" :class="{'animated' : animated === `module-${mod.id}`}" :key="mod.id">
										<div class="list-item-actions">
											<el-tooltip content="Edit" effect="light" placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editModule(mod)">
													<i class="fa fa-pencil" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip content="Permissions" effect="light" placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editModulePermissions(mod)">
													<i class="fa fa-ban" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip content="Delete" effect="light" placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="showDeleteModal(mod)">
													<i class="fa fa-trash" aria-hidden="true"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="list-datetime bold uppercase font-red">
											<span>{{ mod.name }}</span>
										</div>
									</li>
								</ul>
							</div>
							<div class="clearfix" v-if="modules.length && numPages > 1">
								<pagination :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="modules.length && !loading && filteredResults.length">
				<div class="portlet light portlet-fit bordered margin-top-20">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-green bold uppercase">Search Results</span>
							<div class="caption-desc font-grey-cascade">Click on the edit button to edit a module.</div>
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
									<li class="mt-list-item actions-at-left margin-top-15" v-for="mod in currentActiveSearchPageItems" :id="'module-' + mod.id" :class="{'animated' : animated === `module-${mod.id}`}" :key="mod.id">
										<div class="list-item-actions">
											<a class="btn btn-circle btn-icon-only btn-default" @click="editModule(mod)">
												<el-tooltip content="Edit" effect="light" placement="right">
													<i class="fa fa-pencil" aria-hidden="true"></i>
												</el-tooltip>
											</a>
											<el-tooltip content="Permissions" effect="light" placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="editModulePermissions(mod)">
													<i class="fa fa-ban" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip content="Delete" effect="light" placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="showDeleteModal(mod)">
													<i class="fa fa-trash" aria-hidden="true"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="list-datetime bold uppercase font-red">
											<span>{{ mod.name }}</span>
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
			<div v-if="!modules.length && !loading">
				<no-results :show="!modules.length" :type="'modules'"></no-results>
			</div>
		</div>
		<!-- LIST END -->

		<!-- EDIT MODAL START -->
		<modal :show="showEditModuleModal" effect="fade" @closeOnEscape="closeEditModuleModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditModuleModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Module</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="editErrorMessage.length" ref="editErrorMessage">
					<button class="close" data-close="alert" @click="clearEditError()"></button>
					<span>{{editErrorMessage}}</span>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm" id="form_control_edited_name" v-model="moduleToEdit.name" :class="{'edited': moduleToEdit.name.length}">
					<label for="form_control_edited_name">Name</label>
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-primary" @click="updateModule()">Save</button>
			</div>
		</modal>
		<!-- EDIT MODAL END -->

		<!-- PERMISSIONS MODAL START -->
		<modal :show="showEditModulePermissionsModal" effect="fade" @closeOnEscape="closeEditModulePermissionsModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditModulePermissionsModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Permissions for {{moduleToEditApplyPermissionsTo.name}} Module</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="editPermissionsErrorMessage.length" ref="editPermissionsErrorMessage">
					<button class="close" data-close="alert" @click="clearPermissionsEditError()"></button>
					<span>{{editPermissionsErrorMessage}}</span>
				</div>
				<permissions-picker
					v-if="showEditModulePermissionsModal"
					:previouslySelected="moduleToEditApplyPermissionsTo.permissions.map(p => p.id)"
					@permissionsSelected="updateNewRolePermissions"
				>
				</permissions-picker>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-primary" @click="updateModulePermissions()">Save</button>
			</div>
		</modal>
		<!-- PERMISSIONS MODAL END -->

		<!-- DELETE MODAL START -->
		<modal :show="showDeleteModuleModal" effect="fade" @closeOnEscape="closeDeleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Module</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="deleteErrorMessage.length" ref="deleteErrorMessage">
					<button class="close" data-close="alert" @click="clearDeleteError()"></button>
					<span>{{deleteErrorMessage}}</span>
				</div>
				<p>Are you sure you want to delete this module?</p>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-primary" @click="deleteModule()">Delete</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import ModulesFunctions from '../../../controllers/Modules'
import Modal from '../../modules/Modal'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import PermissionsPicker from './PermissionsPicker'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Admin Manager', link: false},
				{name: 'Modules', link: false}
			],
			createCollapse: true,
			createErrorMessage: '',
			newModule: {
				name: '',
				parent_module: null,
				sort_order: '1'
			},
			editErrorMessage: '',
			moduleToEdit: {
				id: null,
				name: '',
				parent_module: null,
				sort_order: 1,
				permissions: [],
				sub_modules: []
			},
			loading: false,
			modules: [],
			showEditModuleModal: false,
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
			moduleTree: [],
			moduleToEditApplyPermissionsTo: {
				name: ''
			},
			showEditModulePermissionsModal: false,
			editPermissionsErrorMessage: '',
			showDeleteModuleModal: false,
			moduleToDelete: {
				name: ''
			},
			deleteErrorMessage: ''
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.modules.length / this.resultsPerPage)
		},
		currentActivePageItems () {
			return this.userSort(this.modules).slice(this.resultsPerPage * (this.activePage - 1), this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage)
		},
		searchNumPages () {
			return Math.ceil(this.filteredResults.length / this.resultsPerPage)
		},
		currentActiveSearchPageItems () {
			return this.userSort(this.filteredResults).slice(this.resultsPerPage * (this.searchActivePage - 1), this.resultsPerPage * (this.searchActivePage - 1) + this.resultsPerPage)
		}
	},
	created () {
		this.getModules()
	},
	methods: {
		/**
		 * To show the modal
		 * @function
		 * @param {object} mod - The module to delete
		 * @returns {undefined}
		 */
		showDeleteModal (mod) {
			this.moduleToDelete = {...mod}
			this.showDeleteModuleModal = true
		},
		/**
		 * To close the modal
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.showDeleteModuleModal = false
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
		 * To confirm deletion
		 * @function
		 * @param {array} permissions - An array of permission ids
		 * @returns {undefined}
		 */
		showDeleteSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Module deleted',
				type: 'success'
			})
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetDeleteForm () {
			this.moduleToDelete = {
				name: ''
			}
		},
		/**
		 * To delete the module
		 * @function
		 * @returns {object} - A promise
		 */
		deleteModule () {
			this.clearDeleteError()
			var modulesVue = this
			return ModulesFunctions.deleteModule(modulesVue.moduleToDelete)
			.then(response => {
				modulesVue.getModules()
				modulesVue.closeDeleteModal()
				modulesVue.showDeleteSuccess()
				modulesVue.resetDeleteForm()
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'Could not delete module',
					errorName: 'deleteErrorMessage',
					vue: modulesVue
				})
			})
		},
		/**
		 * To update permissions based on user's selection
		 * @function
		 * @param {array} permissions - An array of permission ids
		 * @returns {undefined}
		 */
		updateNewRolePermissions (permissions) {
			this.moduleToEditApplyPermissionsTo.permissions = permissions
		},
		/**
		 * To update parent module based on user's selection
		 * @function
		 * @param {object} mod - The module to set as parent
		 * @returns {undefined}
		 */
		setParentModule (mod) {
			this.newModule.parent_module = mod.id
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
					for (var i = 0; i < this.modules.length; i++) {
						if (this.modules[i].name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
							this.filteredResults.push(this.modules[i])
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
		 * @param {object} module - The module object to be edited
		 * @returns {undefined}
		 */
		editModule (module) {
			this.moduleToEdit = {...module}
			this.showEditModuleModal = true
		},
		/**
		 * To display the edit modal
		 * @function
		 * @param {object} module - The module object to be edited
		 * @returns {undefined}
		 */
		editModulePermissions (module) {
			this.moduleToEditApplyPermissionsTo = {...module}
			this.showEditModulePermissionsModal = true
		},
		/**
		 * To close the edit modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		closeEditModuleModal () {
			this.showEditModuleModal = false
		},
		/**
		 * To close the edit modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		closeEditModulePermissionsModal () {
			this.showEditModulePermissionsModal = false
		},
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getModules () {
			this.loading = true
			this.clearListError()
			var modulesVue = this
			return ModulesFunctions.getFullModules()
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					modulesVue.loading = false
					if (!response.payload.length) {
						modulesVue.newModule.parent_module = 0
					} else {
						modulesVue.moduleTree = modulesVue.listToTree(response.payload, response.payload.filter(mod => mod.parent_module === 0)[0])
						modulesVue.modules = response.payload
					}
				} else {
					modulesVue.loading = false
				}
			}).catch(reason => {
				modulesVue.loading = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not get modules',
					errorName: 'listErrorMessage',
					vue: modulesVue
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
					mappedArr[arrElem.id]['sub_modules'] = []
				}

				for (var id in mappedArr) {
					if (mappedArr.hasOwnProperty(id)) {
						mappedElem = mappedArr[id]
						// If the element is not at the root level, add it to its parent array of children.
						if (mappedElem.parent_module) {
							mappedArr[mappedElem['parent_module']]['sub_modules'].push(mappedElem)
						// If the element is at the root level, add it to first level elements array.
						} else {
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
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createModule () {
			var modulesVue = this

			return this.validateNewModuleData()
			.then((response) => {
				modulesVue.clearCreateError()
				return ModulesFunctions.createModule(modulesVue.newModule)
				.then(response => {
					modulesVue.getModules()
					modulesVue.resetCreateForm()
					modulesVue.showCreateSuccess()
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not get create module',
						errorName: 'createErrorMessage',
						vue: modulesVue
					})
				})
			}).catch(reason => {
				modulesVue.createErrorMessage = reason
				modulesVue.$scrollTo(modulesVue.$refs.createErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetCreateForm () {
			this.newModule = {
				name: '',
				parent_module: null,
				sort_order: '1'
			}
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetEditForm () {
			this.moduleToEdit = {
				id: null,
				name: '',
				parent_module: null,
				sort_order: 1,
				permissions: [],
				sub_modules: []
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
				text: 'Module successfully created',
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
				text: 'Module saved',
				type: 'success'
			})
		},
		/**
		 * To toggle the create new panel.
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateModulePanel () {
			this.createCollapse = !this.createCollapse
			this.$nextTick(function () {
				if (!this.createCollapse) {
					this.$refs.newModuleName.focus()
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
		 * To update a module.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateModule () {
			var modulesVue = this

			return this.validateEditedModuleData()
			.then((response) => {
				modulesVue.clearEditError()
				return ModulesFunctions.updateModule(modulesVue.moduleToEdit)
				.then(response => {
					modulesVue.closeEditModuleModal()
					modulesVue.showEditSuccess()
					for (var i = 0; i < modulesVue.modules.length; i++) {
						if (modulesVue.modules[i].id === modulesVue.moduleToEdit.id) {
							modulesVue.modules[i] = {...modulesVue.moduleToEdit}
						}
					}
					modulesVue.resetEditForm()
					modulesVue.animated = `module-${modulesVue.moduleToEdit.id}`
					window.setTimeout(() => {
						modulesVue.animated = ''
					}, 3000)
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not get save module',
						errorName: 'editErrorMessage',
						vue: modulesVue
					})
				})
			}).catch(reason => {
				modulesVue.editErrorMessage = reason
				modulesVue.$scrollTo(modulesVue.$refs.editErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To clear the error
		 * @function
		 * @returns {undefined}
		 */
		clearPermissionsEditError () {
			this.editPermissionsErrorMessage = ''
		},
		/**
		 * To validate data before submitting to the backend
		 * @function
		 * @returns {object} - A promise
		 */
		validateModulePermissions () {
			// var modulesVue = this
			return new Promise(function (resolve, reject) {
				resolve('Hurray')
			})
		},
		/**
		 * To update permissions assigned to a module
		 * @function
		 * @returns {object} - A promise
		 */
		updateModulePermissions () {
			var modulesVue = this

			return this.validateModulePermissions()
			.then((response) => {
				modulesVue.clearPermissionsEditError()
				return ModulesFunctions.assignPermissionsToModule(modulesVue.moduleToEditApplyPermissionsTo)
				.then(response => {
					modulesVue.closeEditModulePermissionsModal()
					modulesVue.animated = `module-${modulesVue.moduleToEdit.id}`
					window.setTimeout(() => {
						modulesVue.animated = ''
					}, 3000)
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not assign permissions',
						errorName: 'editPermissionsErrorMessage',
						vue: modulesVue
					})
				})
			}).catch(reason => {
				modulesVue.editPermissionsErrorMessage = reason
				modulesVue.$scrollTo(modulesVue.$refs.editPermissionsErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewModuleData () {
			var modulesVue = this
			return new Promise(function (resolve, reject) {
				if (!modulesVue.newModule.name.length) {
					reject('Name cannot be blank')
				} else if (!$.isNumeric(modulesVue.newModule.sort_order)) {
					reject('Sort order must be a number')
				} else if (modulesVue.newModule.parent_module === null) {
					reject('Select a parent module')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedModuleData () {
			var modulesVue = this
			return new Promise(function (resolve, reject) {
				if (!modulesVue.moduleToEdit.name.length) {
					reject('Name cannot be blank')
				} else if (!$.isNumeric(modulesVue.moduleToEdit.sort_order)) {
					reject('Sort order must be a number')
				} else if (modulesVue.moduleToEdit.parent_module === null) {
					reject('Select a parent module')
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
		PageResults,
		PermissionsPicker
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
	min-height: 120px;
}
</style>

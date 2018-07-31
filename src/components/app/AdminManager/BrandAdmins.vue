<template>
	<div>
		<div>
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<h1 class='page-title'>Brand Admins</h1>
			<div class="note note-info">
	            <p>Create and manage Brand Admin accounts.</p>
	        </div>

  			<!-- CREATE NEW START -->
			<div class="portlet box blue-hoki margin-top-20" v-if="$root.permissions['admin brand_admins create']">
				<div class="portlet-title bg-blue-chambray" @click="toggleCreateBrandAdminPanel()">
					<div class="caption">
						<i class="fa fa-plus-circle"></i>
						Create New Brand Admin
					</div>
					<div class="tools">
						<a :class="{'expand': !createBrandAdminCollapse, 'collapse': createBrandAdminCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" v-show="!createBrandAdminCollapse">
	      			<form role="form" @submit.prevent="createBrandAdmin()">
	      				<div class="row">
	      					<div class="col-md-12">
		      					<div class="alert alert-danger" v-if="createErrorMessage.length">
		      					    <button class="close" data-close="alert" @click.prevent="clearCreateError()"></button>
		      					    <span>{{createErrorMessage}}</span>
		      					</div>
	      					</div>
	      					<div class="col-md-6">
	      						<div class="form-group form-md-line-input form-md-floating-label">
	      						    <input ref="newBrandAdminName" type="text" class="form-control input-sm" id="form_control_name" v-model="newBrandAdmin.name" :class="{'edited': newBrandAdmin.name.length}">
	      						    <label for="form_control_name">Name</label>
	      						</div>
	      						<div class="form-group form-md-line-input form-md-floating-label">
	      						    <input type="text" class="form-control input-sm" id="form_control_phone" v-model="newBrandAdmin.phone" :class="{'edited': newBrandAdmin.phone.length}">
	      						    <label for="form_control_phone">Phone</label>
	      						</div>
	      						<div class="form-group form-md-line-input form-md-floating-label">
	      						    <input type="text" class="form-control input-sm" id="form_control_email" v-model="newBrandAdmin.email" :class="{'edited': newBrandAdmin.email.length}">
	      						    <label for="form_control_email">Email</label>
	      						</div>
      						</div>
      						<div class="col-md-6">
	      						<div class="form-group form-md-line-input form-md-floating-label">
	      							<div class="input-group" v-show="passwordMasked">
		      						    <input type="password" class="form-control input-sm" id="form_control_password_masked" v-model="newBrandAdmin.password" :class="{'edited': newBrandAdmin.password.length}">
		      						    <label for="form_control_password_masked">Password</label>
	      								<span class="input-group-addon clickable" @click="flipPasswordMask()">
	      									<i class="fa fa-eye"></i>
	      								</span>
	      							</div>
									<span class="help-block persist" v-show="passwordMasked">
										Minimum 8 characters. English letters only. Include at least one capital and one number.
									</span>
	      							<div class="input-group" v-show="!passwordMasked">
		      						    <input type="text" class="form-control input-sm" id="form_control_password" v-model="newBrandAdmin.password" :class="{'edited': newBrandAdmin.password.length}">
		      						    <label for="form_control_password">Password</label>
	      								<span class="input-group-addon clickable" @click="flipPasswordMask()">
	      									<i class="fa fa-eye-slash"></i>
	      								</span>
	      							</div>
									<span class="help-block persist" v-show="!passwordMasked">
										Minimum 8 characters. English letters only. Include at least one capital and one number.
									</span>
	      						</div>
	      						<div class="form-group form-md-line-input form-md-floating-label">
	      							<div class="input-group" v-show="passwordMasked">
		      						    <input type="password" class="form-control input-sm" id="form_control_confirm_masked" v-model="passwordCheck" :class="{'edited': passwordCheck}">
		      						    <label for="form_control_confirm_masked">Confirm password</label>
	      								<span class="input-group-addon clickable" @click="flipPasswordMask()">
	      									<i class="fa fa-eye"></i>
	      								</span>
	      							</div>
	      							<div class="input-group" v-show="!passwordMasked">
		      						    <input type="text" class="form-control input-sm" id="form_control_confirm" v-model="passwordCheck" :class="{'edited': passwordCheck}">
		      						    <label for="form_control_confirm">Confirm password</label>
	      								<span class="input-group-addon clickable" @click="flipPasswordMask()">
	      									<i class="fa fa-eye-slash"></i>
	      								</span>
	      							</div>
	      						</div>
	      					</div>
	      				</div>
	      				<div class="row">
	      					<div class="col-md-12">
	      						<button type="submit" class="btn blue pull-right">Create</button>	
	      					</div>
	      				</div>
	      			</form>
	      		</div>
	      	</div>
	      	<!-- CREATE NEW END -->

	        <!-- SEARCH START -->
            <div class="margin-top-20" v-if="brandAdmins.length">
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
                  						<span class="help-block persist">Search by Name or Email.</span>
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
	        <loading-screen :show="loadingBrandAdminsData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
	        <div v-if="brandAdmins.length && !loadingBrandAdminsData && !filteredResults.length">
			    <div class="portlet light portlet-fit bordered margin-top-20">
			        <div class="portlet-title bg-blue-chambray">
			        	<div class="menu-image-main">
			        		<img src="../../../../static/client_logo.png">
			        	</div>
			            <div class="caption">
			                <span class="caption-subject font-default bold uppercase">Brand Admins</span>
	                        <div class="caption-desc font-grey-cascade">Click on the edit icon to edit a brand admin.</div>
			            </div>
			        </div>
			        <div class="portlet-body">
        				<div class="clearfix margin-bottom-10" v-if="brandAdmins.length">
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
        	  				<page-results class="pull-right" :totalResults="brandAdmins.length" :activePage="activePage" @pageResults="pageResultsUpdate"></page-results>
        				</div>
			            <div class="mt-element-list">
			                <div class="mt-list-container list-news">
			                    <ul>
			                        <li class="mt-list-item actions-at-left margin-top-15" v-for="brandAdmin in currentActivePageItems" :id="'brandAdmin-' + brandAdmin.id" :class="{'animated' : animated === `brandAdmin-${brandAdmin.id}`}" :key="brandAdmin.id">
			                        	<div class="list-item-actions">
			                        		<el-tooltip 
												v-if="$root.permissions['admin brand_admins update']"
												content="Edit" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editBrandAdmin(brandAdmin)">
	                                                <i class="fa fa-pencil" aria-hidden="true"></i>
	                                            </a>
			                        		</el-tooltip>
			                        		<el-tooltip 
												v-if="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']"
												content="View" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editBrandAdmin(brandAdmin)">
	                                                <i class="fa fa-eye" aria-hidden="true"></i>
	                                            </a>
			                        		</el-tooltip>
			                        		<el-tooltip 
												v-if="$root.permissions['admin brand_admins update']"
												content="Roles" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="openRolesModal(brandAdmin)">
	                                                <i class="fa fa-id-badge" aria-hidden="true"></i>
	                                            </a>
			                        		</el-tooltip>
			                        	</div>
			                            <div class="list-datetime bold uppercase font-red">
			                            	<span>{{ brandAdmin.name }}</span>
			                            </div>
			                            <div class="list-item-content height-mod">
			                            	<div class="col-md-4">
			                            		<span>{{ brandAdmin.email }}</span>
			                            	</div>
			                            	<div class="col-md-4">
			                            		<span>{{ formatPhone(brandAdmin.phone) }}</span>
			                            	</div>
			                            	<div class="col-md-4">
			                            		<span v-if="brandAdmin.active === 1">ACTIVE</span>
			                            		<span v-else>DISABLED</span>
			                            	</div>
			                            </div>
			                        </li>
			                    </ul>
			                </div>
			                <div class="clearfix" v-if="brandAdmins.length && numPages > 1">
			                	<pagination :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
			                </div>
			            </div>
			        </div>
			    </div>
	        </div>
	        <div v-if="brandAdmins.length && !loadingBrandAdminsData && filteredResults.length">
			    <div class="portlet light portlet-fit bordered margin-top-20">
			        <div class="portlet-title bg-blue-chambray">
			        	<div class="menu-image-main">
			        		<img src="../../../../static/client_logo.png">
			        	</div>
			            <div class="caption">
			                <span class="caption-subject font-default bold uppercase">Search Results</span>
	                        <div class="caption-desc font-grey-cascade">Click on the edit icon to edit a brand admin.</div>
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
			                        <li class="mt-list-item actions-at-left margin-top-15" v-for="brandAdmin in currentActiveSearchPageItems" :id="'brandAdmin-' + brandAdmin.id" :class="{'animated' : animated === `brandAdmin-${brandAdmin.id}`}" :key="brandAdmin.id">
			                        	<div class="list-item-actions">
			                        		<el-tooltip 
												v-if="$root.permissions['admin brand_admins update']"
												content="Edit" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editBrandAdmin(brandAdmin)">
	                                                <i class="fa fa-pencil" aria-hidden="true"></i>
	                                            </a>
			                        		</el-tooltip>
			                        		<el-tooltip 
												v-if="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']"
												content="View" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editBrandAdmin(brandAdmin)">
	                                                <i class="fa fa-eye" aria-hidden="true"></i>
	                                            </a>
			                        		</el-tooltip>
			                        		<el-tooltip 
												v-if="$root.permissions['admin brand_admins update']"
												content="Roles" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="openRolesModal(brandAdmin)">
	                                                <i class="fa fa-id-badge" aria-hidden="true"></i>
	                                            </a>
			                        		</el-tooltip>
			                        	</div>
			                            <div class="list-datetime bold uppercase font-red">
			                            	<span>{{ brandAdmin.name }}</span>
			                            </div>
			                            <div class="list-item-content height-mod">
			                            	<div class="col-md-4">
			                            		<span>{{ brandAdmin.email }}</span>
			                            	</div>
			                            	<div class="col-md-4">
			                            		<span>{{ formatPhone(brandAdmin.phone) }}</span>
			                            	</div>
			                            	<div class="col-md-4">
			                            		<span v-if="brandAdmin.active === 1">ACTIVE</span>
			                            		<span v-else>DISABLED</span>
			                            	</div>
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
	        <div v-if="!brandAdmins.length && !loadingBrandAdminsData">
	        	<no-results :show="!brandAdmins.length" :type="'brand admins'"></no-results>
	        </div>
		</div>
		<!-- LIST END -->

		<!-- EDIT MODAL START -->
		<modal :show="showEditBrandAdminModal" effect="fade" @closeOnEscape="closeEditBrandAdminModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditBrandAdminModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Brand Admin</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-if="editErrorMessage.length">
				    <button class="close" data-close="alert" @click="clearEditError()"></button>
				    <span>{{editErrorMessage}}</span>
				</div>
				<fieldset :disabled="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']">
					<div class="form-group form-md-line-input form-md-floating-label">
						<input type="text" class="form-control input-sm" id="form_control_edited_name" v-model="brandAdminToBeEdited.name" :class="{'edited': brandAdminToBeEdited.name.length}">
						<label for="form_control_edited_name">Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
						<input type="text" class="form-control input-sm" id="form_control_edited_phone" v-model="brandAdminToBeEdited.phone" :class="{'edited': brandAdminToBeEdited.phone.length}">
						<label for="form_control_edited_phone">Phone</label>
					</div>
				</fieldset>
				<div class="form-group form-md-line-input form-md-floating-label">
				    <label>Status</label><br>
				    <el-switch
						:disabled="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']"
				    	v-model="brandAdminToBeEdited.active"
				    	active-color="#0c6"
				    	inactive-color="#ff4949"
				    	:active-value="1"
				    	:inactive-value="0"
				    	active-text="Active"
				    	inactive-text="Disabled">
				    </el-switch>
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button 
					v-if="$root.permissions['admin brand_admins read'] && !$root.permissions['admin brand_admins update']"
					type="button" 
					class="btn btn-primary" 
					@click="closeEditBrandAdminModal()">
					Close
				</button>
				<button 
					v-else
					type="button" 
					class="btn btn-primary" 
					@click="updateBrandAdmin()">
					Save
				</button>
			</div>
		</modal>
		<!-- EDIT MODAL END -->

		<!-- ROLES MODAL START -->
		<modal :show="showAssignRolesModal" effect="fade" @closeOnEscape="closeRolesModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeRolesModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Assign Roles</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="assignRolesErrorMessage.length" ref="assignRolesErrorMessage">
				    <button class="close" data-close="alert" @click="clearRolesError()"></button>
				    <span>{{assignRolesErrorMessage}}</span>
				</div>
				<roles-picker
					v-if="showAssignRolesModal"
					@rolesSelected="updateRoles"
					:previouslySelected="brandAdminToAssignRolesTo.roles"
				></roles-picker>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-primary" @click="assignRoles()">Save</button>
			</div>
		</modal>
		<!-- ROLES MODAL END -->

	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import AdminManagerFunctions from '../../../controllers/AdminManager'
import Modal from '../../modules/Modal'
import Dropdown from '../../modules/Dropdown'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import RolesPicker from '@/components/app/ApprovalsManager/RolesPicker'
import ajaxErrorHandler from '../../../controllers/ErrorController'

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
				{name: 'Admin Manager', link: false},
				{name: 'Brand Admins', link: false}
			],
			createBrandAdminCollapse: true,
			createErrorMessage: '',
			newBrandAdmin: {
				name: '',
				phone: '',
				email: '',
				password: '',
				type: 'admin',
				active: 1,
				created_by: this.$root.createdBy
			},
			editErrorMessage: '',
			brandAdminToBeEdited: {
				name: '',
				phone: '',
				active: 1,
				type: 'admin'
			},
			loadingBrandAdminsData: false,
			brandAdmins: [],
			showEditBrandAdminModal: false,
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
			passwordMasked: true,
			passwordCheck: '',
			brandAdminToAssignRolesTo: {},
			showAssignRolesModal: false,
			assignRolesErrorMessage: ''
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.brandAdmins.length / this.resultsPerPage)
		},
		currentActivePageItems () {
			return this.userSort(this.brandAdmins).slice(this.resultsPerPage * (this.activePage - 1), this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage)
		},
		searchNumPages () {
			return Math.ceil(this.filteredResults.length / this.resultsPerPage)
		},
		currentActiveSearchPageItems () {
			return this.userSort(this.filteredResults).slice(this.resultsPerPage * (this.searchActivePage - 1), this.resultsPerPage * (this.searchActivePage - 1) + this.resultsPerPage)
		}
	},
	mounted () {
		this.getAllBrandAdmins()
	},
	methods: {
		/**
		 * To format a phone number
		 * @function
		 * @param {string} phone - The phone number to format
		 * @returns {string} The formatted phone string
		 */
		formatPhone (phone) {
			let digits = phone.replace(/\D/g, '')
			return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
		},
		/**
		 * To switch bewteen masked and unmasked password fields.
		 * @function
		 * @returns {undefined}
		 */
		flipPasswordMask () {
			this.passwordMasked = !this.passwordMasked
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
					for (var i = 0; i < this.brandAdmins.length; i++) {
						if ((this.brandAdmins[i].name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) || (this.brandAdmins[i].email.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)) {
							this.filteredResults.push(this.brandAdmins[i])
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
		 * To get roles already assigned to the user
		 * @function
		 * @param {object} user - The user to fetch roles for
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserRoles (user) {
			return AdminManagerFunctions.getUserRoles(user)
			.then(response => {
				return response.payload.map(role => role.id)
			}).catch(reason => {
				return []
			})
		},
		/**
		 * To update the roles based on user's selection
		 * @function
		 * @param {array} roles - An array of role ids
		 * @returns {undefined}
		 */
		updateRoles (roles) {
			this.brandAdminToAssignRolesTo.roles = roles
		},
		/**
		 * To validate data before submitting to the backend
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		validateRoles () {
			var brandAdminsVue = this
			return new Promise(function (resolve, reject) {
				if (!brandAdminsVue.brandAdminToAssignRolesTo.roles.length) {
					reject('Select at least one role')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To assign roles to a user
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		assignRoles () {
			var brandAdminsVue = this

			return this.validateRoles()
			.then((response) => {
				brandAdminsVue.clearRolesError()
				return AdminManagerFunctions.assignRoles(brandAdminsVue.brandAdminToAssignRolesTo, brandAdminsVue.$root.appId, brandAdminsVue.$root.appSecret, brandAdminsVue.$root.userToken)
				.then(response => {
					brandAdminsVue.closeRolesModal()
					brandAdminsVue.showRolesSuccess()
					this.animated = `brandAdmin-${brandAdminsVue.brandAdminToBeEdited.id}`
					window.setTimeout(() => {
						brandAdminsVue.animated = ''
					}, 3000)
					brandAdminsVue.resetRolesForm()
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not assign roles',
						errorName: 'assignRolesErrorMessage',
						vue: brandAdminsVue
					})
				})
			}).catch(reason => {
				brandAdminsVue.assignRolesErrorMessage = reason
				brandAdminsVue.$scrollTo(brandAdminsVue.$refs.assignRolesErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To open the roles modal
		 * @function
		 * @param {object} brandAdmin - The selected brand admin
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		openRolesModal (brandAdmin) {
			let brandAdminsVue = this
			this.getUserRoles(brandAdmin)
			.then(roles => {
				brandAdminsVue.brandAdminToAssignRolesTo = {
					...brandAdmin,
					roles
				}
			}).catch(err => {
				brandAdminsVue.brandAdminToAssignRolesTo = {
					...brandAdmin,
					roles: []
				}
				console.log(err)
			}).finally(() => {
				brandAdminsVue.showAssignRolesModal = true
			})
		},
		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @returns {undefined}
		 */
		showRolesSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Roles saved',
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To close the modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		closeRolesModal () {
			this.clearRolesError()
			this.showAssignRolesModal = false
		},
		/**
		 * To reset the roles form
		 * @function
		 * @returns {undefined}
		 */
		resetRolesForm () {
			this.brandAdminToAssignRolesTo = {}
		},
		/**
		 * To display the edit modal
		 * @function
		 * @param {object} brandAdmin - The brand admin object to be edited
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		editBrandAdmin (brandAdmin) {
			this.brandAdminToBeEdited.name = brandAdmin.name
			this.brandAdminToBeEdited.phone = brandAdmin.phone
			this.brandAdminToBeEdited.active = brandAdmin.active
			this.brandAdminToBeEdited.id = brandAdmin.id
			this.showEditBrandAdminModal = true
		},
		/**
		 * To close the edit modal
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		closeEditBrandAdminModal () {
			this.clearEditError()
			this.showEditBrandAdminModal = false
		},
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllBrandAdmins () {
			this.loadingBrandAdminsData = true
			var brandAdminsVue = this
			return AdminManagerFunctions.getAllAdmins(brandAdminsVue.$root.appId, brandAdminsVue.$root.appSecret, brandAdminsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					brandAdminsVue.loadingBrandAdminsData = false
					let filtered = []
					response.payload.forEach((admin) => {
						if (admin.type === 'admin') {
							filtered.push(admin)
						}
					})
					brandAdminsVue.brandAdmins = filtered
				} else {
					brandAdminsVue.loadingBrandAdminsData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					brandAdminsVue.$router.push('/login/expired')
					return
				}
				brandAdminsVue.loadingBrandAdminsData = false
				if (reason.responseJSON) {
					console.log(reason.responseJSON.message)
				}
			})
		},
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createBrandAdmin () {
			var brandAdminsVue = this

			return this.validateNewBrandAdminData()
			.then((response) => {
				brandAdminsVue.clearCreateError()
				return AdminManagerFunctions.createAdmin(brandAdminsVue.newBrandAdmin, brandAdminsVue.$root.appId, brandAdminsVue.$root.appSecret, brandAdminsVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						brandAdminsVue.getAllBrandAdmins()
						brandAdminsVue.resetCreateForm()
						brandAdminsVue.showCreateSuccess()
					} else {
						brandAdminsVue.createErrorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						brandAdminsVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
						brandAdminsVue.createErrorMessage = reason.responseJSON.message
						window.scrollTo(0, 0)
					}
				})
			}).catch(reason => {
				// If validation fails then display the error message
				if (reason.responseJSON) {
					brandAdminsVue.createErrorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				} else {
					brandAdminsVue.createErrorMessage = reason
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetCreateForm () {
			this.newBrandAdmin = {
				name: '',
				phone: '',
				email: '',
				password: '',
				type: 'admin',
				active: 1,
				created_by: this.$root.createdBy
			}
			this.passwordCheck = ''
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {undefined}
		 */
		resetEditForm () {
			this.brandAdminToBeEdited = {
				name: '',
				phone: '',
				active: 1,
				type: 'admin'
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
				text: 'Brand Admin successfully created',
				type: 'success',
				confirmButtonText: 'OK'
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
				text: 'Brand Admin successfully updated',
				type: 'success',
				confirmButtonText: 'OK',
				allowEnterKey: true,
				allowOutsideClick: true,
				allowEscapeKey: true
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To toggle the create new panel.
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateBrandAdminPanel () {
			this.createBrandAdminCollapse = !this.createBrandAdminCollapse
			this.$nextTick(function () {
				if (!this.createBrandAdminCollapse) {
					this.$refs.newBrandAdminName.focus()
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
		clearRolesError () {
			this.assignRolesErrorMessage = ''
		},
		/**
		 * To update the brand admin object.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateBrandAdmin () {
			var brandAdminsVue = this

			return this.validateEditedBrandAdminData()
			.then((response) => {
				brandAdminsVue.clearEditError()
				return AdminManagerFunctions.updateAdmin(brandAdminsVue.brandAdminToBeEdited, brandAdminsVue.$root.appId, brandAdminsVue.$root.appSecret, brandAdminsVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						brandAdminsVue.closeEditBrandAdminModal()
						brandAdminsVue.showEditSuccess()
						for (var i = 0; i < this.brandAdmins.length; i++) {
							if (this.brandAdmins[i].id === brandAdminsVue.brandAdminToBeEdited.id) {
								this.brandAdmins[i].name = brandAdminsVue.brandAdminToBeEdited.name
								this.brandAdmins[i].phone = brandAdminsVue.brandAdminToBeEdited.phone
								this.brandAdmins[i].active = brandAdminsVue.brandAdminToBeEdited.active
							}
						}
						brandAdminsVue.resetEditForm()
						this.animated = `brandAdmin-${brandAdminsVue.brandAdminToBeEdited.id}`
						window.setTimeout(() => {
							brandAdminsVue.animated = ''
						}, 3000)
					} else {
						brandAdminsVue.editErrorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						brandAdminsVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
						brandAdminsVue.editErrorMessage = reason.responseJSON.message
						window.scrollTo(0, 0)
					}
				})
			}).catch(reason => {
				// If validation fails then display the error message
				if (reason.responseJSON) {
					brandAdminsVue.editErrorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				} else {
					brandAdminsVue.editErrorMessage = reason
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewBrandAdminData () {
			var brandAdminsVue = this
			const passwordRegex = new RegExp(/^((?=\S*?[A-Z])(?=\S*?[0-9]).{7,})\S$/)
			return new Promise(function (resolve, reject) {
				if (!brandAdminsVue.newBrandAdmin.name.length) {
					reject('Name cannot be blank')
				} else if (brandAdminsVue.newBrandAdmin.phone.replace(/\D/g, '').length < 10) {
					reject('Phone number should have at least 10 digits')
				} else if (!brandAdminsVue.newBrandAdmin.email.length) {
					reject('Email cannot be blank')
				} else if (!emailPattern.test(brandAdminsVue.newBrandAdmin.email)) {
					reject('Please enter a valid email')
				} else if (!passwordRegex.test(brandAdminsVue.newBrandAdmin.password)) {
					reject('Password should: be at least 8 characters long, contain only English letters and numbers, contain at least one uppercase letter and one number')
				} else if (brandAdminsVue.newBrandAdmin.password !== brandAdminsVue.passwordCheck) {
					reject('Passwords do not match')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedBrandAdminData () {
			var brandAdminsVue = this
			return new Promise(function (resolve, reject) {
				if (!brandAdminsVue.brandAdminToBeEdited.name.length) {
					reject('Name cannot be blank')
				} else if (brandAdminsVue.brandAdminToBeEdited.phone.replace(/\D/g, '').length < 10) {
					reject('Phone number should have at least 10 digits')
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
		Dropdown,
		Pagination,
		PageResults,
		RolesPicker
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
</style>

<template>
	<div>
		<div>
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<h1 class='page-title'>OMA Users</h1>
			<div class="note note-info">
	            <p>Create and manage OMA User accounts.</p>
	        </div>

  			<!-- CREATE NEW START -->
			<div class="portlet box blue-hoki margin-top-20" v-if="$root.permissions['admin oma_users create']">
				<div class="portlet-title bg-blue-chambray" @click="toggleCreateOMAUserPanel()">
					<div class="caption">
						<i class="fa fa-plus-circle"></i>
						Create New OMA User
					</div>
					<div class="tools">
						<a :class="{'expand': !createOMAUserCollapse, 'collapse': createOMAUserCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" v-show="!createOMAUserCollapse">
	      			<form @submit.native.prevent role="form">
	      				<div class="row">
	      					<div class="col-md-12">
		      					<div class="alert alert-danger" v-if="createErrorMessage.length">
		      					    <button class="close" data-close="alert" @click.prevent="clearCreateError()"></button>
		      					    <span>{{createErrorMessage}}</span>
		      					</div>
	      					</div>
	      					<div class="col-md-6">
	      						<el-select v-model="newOMAUser.type" placeholder="Select type" size="small" class="margin-bottom-15" ref="newOMAUserType">
	      							<el-option label="Admin" :value="1"></el-option>
	      							<el-option label="Coach" :value="3"></el-option>
	      							<el-option label="Manager" :value="4"></el-option>
	      							<el-option label="Staff" :value="5"></el-option>
	      							<el-option label="Line Staff" :value="6"></el-option>
	      						</el-select>
	      						<div class="form-group form-md-line-input form-md-floating-label">
	      						    <input type="text" class="form-control input-sm" id="form_control_email" v-model="newOMAUser.email" :class="{'edited': newOMAUser.email.length}">
	      						    <label for="form_control_email">Email</label>
	      						</div>
	      						<div class="form-group form-md-line-input form-md-floating-label">
	      						    <input type="text" class="form-control input-sm" id="form_control_phone" v-model="newOMAUser.phone" :class="{'edited': newOMAUser.phone.length}">
	      						    <label for="form_control_phone">Phone</label>
	      						</div>
	      					</div>
	      					<div class="col-md-6">
	      						<div class="form-group form-md-line-input form-md-floating-label">
	      							<div class="input-group" v-show="passwordMasked">
		      						    <input type="password" class="form-control input-sm" id="form_control_password_masked" v-model="newOMAUser.password" :class="{'edited': newOMAUser.password.length}">
		      						    <label for="form_control_password_masked">Password</label>
	      								<span class="input-group-addon clickable" @click="flipPasswordMask()">
	      									<i class="fa fa-eye"></i>
	      								</span>
	      							</div>
	      							<div class="input-group" v-show="!passwordMasked">
		      						    <input type="text" class="form-control input-sm" id="form_control_password" v-model="newOMAUser.password" :class="{'edited': newOMAUser.password.length}">
		      						    <label for="form_control_password">Password</label>
	      								<span class="input-group-addon clickable" @click="flipPasswordMask()">
	      									<i class="fa fa-eye-slash"></i>
	      								</span>
	      							</div>
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
			        			<div class="margin-bottom-15">		        				
			        				<button type="button" class="btn blue btn-outline" @click="assignStoreToOMAUser(newOMAUser, 'new')">Select a location</button>
			        				<p class="grey-label margin-top-10" v-if="newOMAUser.locations.length">Selected {{newOMAUser.locations.length}} location<span v-if="newOMAUser.locations.length > 1">s</span></p>
			        			</div>
	      					</div>
	      				</div>
	      				<div class="row">
	      					<div class="col-md-12">
	      						<button type="button" @click="createOMAUser()" class="btn blue pull-right">Create</button>
	      					</div>
	      				</div>
	      			</form>
	      		</div>
	      	</div>
	      	<!-- CREATE NEW END -->
			
  			<!-- ASSIGN STORES MODAL START -->
  			<modal :show="showAssignStoresModal" effect="fade" @closeOnEscape="closeAssignStoresModal">
  				<div slot="modal-header" class="modal-header center">
  					<button type="button" class="close" @click="closeAssignStoresModal()">
  						<span>&times;</span>
  					</button>
  					<h4 class="modal-title center">Select Stores</h4>
  				</div>
  				<div slot="modal-body" class="modal-body">
					<div class="alert alert-danger" v-if="assignErrorMessage.length">
					    <button class="close" data-close="alert" @click.prevent="clearAssignError()"></button>
	                    <span>{{ assignErrorMessage }}</span>
					</div>
					<select-locations-popup 
						v-if="showAssignStoresModal"
						@selectedLocations="selectedLocations" 
						:previouslySelected="newOMAUser.locations" 
						:withButton="false">
					</select-locations-popup>
  				</div>
  				<div slot="modal-footer" class="modal-footer">
  					<button type="button" class="btn blue" @click="assignStores($event)">Select</button>
  				</div>
  			</modal>
  			<!-- ASSIGN STORES MODAL START -->

	        <!-- SEARCH START -->
            <div class="margin-top-20" v-if="OMAUsers.length">
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
                  						<span class="help-block persist">Search by Email.</span>
                  					</div>
    							</div>
    						</div>
    						<div class="form-actions right margin-top-20">
    							<button type="button" class="btn btn-default" @click="resetSearch()"> Reset Search</button>
    							<button type="submit" class="btn blue">Search</button>
    						</div>
    					</form>
          			</div>
          		</div>
            </div>
            <!-- SEARCH END -->

	        <!-- MESSAGE START -->
            <div class="margin-top-20" v-if="OMAUsers.length">
    			<div class="portlet box blue-hoki">
    				<div class="portlet-title clickable" @click="toggleMessageModal(true)">
    					<div class="caption">
    						<i class="fa fa-envelope-o"></i>
    						Message
    					</div>
    				</div>
          		</div>
            </div>
            <!-- MESSAGE END -->

			<!-- LIST START -->
	        <loading-screen :show="loadingOMAUsersData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
	        <div v-if="OMAUsers.length && !loadingOMAUsersData && ! filteredResults.length">
			    <div class="portlet light portlet-fit bordered margin-top-20">
			        <div class="portlet-title bg-blue-chambray">
			        	<div class="menu-image-main">
			        		<img src="../../../../static/client_logo.png">
			        	</div>
			            <div class="caption">
			                <span class="caption-subject font-default bold uppercase">OMA Users</span>
	                        <div class="caption-desc font-grey-cascade">Click on an OMA user to edit store locations assigned to them or to delete the user.</div>
			            </div>
			        </div>
			        <div class="portlet-body">
        				<div class="clearfix margin-bottom-10" v-if="OMAUsers.length">
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
        	  				<page-results class="pull-right" :totalResults="OMAUsers.length" :activePage="activePage" @pageResults="pageResultsUpdate"></page-results>
        				</div>
			            <div class="mt-element-list">
			                <div class="mt-list-container list-news">
			                    <ul>
			                        <li 
										class="mt-list-item actions-at-left margin-top-15" 
										v-for="OMAUser in currentActivePageItems" 
										:id="'OMAUser-' + OMAUser.id" 
										:class="{'animated' : animated === `OMAUser-${OMAUser.id}`}"
										:key="OMAUser.id">
			                        	<div class="list-item-actions">
        	                        		<el-tooltip 
												v-if="$root.permissions['admin oma_users update']"
												content="Edit" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editOMAUser(OMAUser)">
	                                                <i class="fa fa-pencil" aria-hidden="true"></i>
	                                            </a>
        	                        		</el-tooltip>
        	                        		<el-tooltip 
												v-if="$root.permissions['admin oma_users read'] && !$root.permissions['admin oma_users update']"
												content="View" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editOMAUser(OMAUser)">
	                                                <i class="fa fa-eye" aria-hidden="true"></i>
	                                            </a>
        	                        		</el-tooltip>
        	                        		<el-tooltip 
												v-if="$root.permissions['admin oma_users delete']"
												content="Delete" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="showDeleteModal(OMAUser)">
	                                                <i class="fa fa-trash" aria-hidden="true"></i>
	                                            </a>
        	                        		</el-tooltip>
			                        	</div>
			                            <div class="list-item-content height-mod">
			                            	<div class="col-md-4">
			                            		<span>{{ OMAUser.email }}</span>
			                            	</div>
			                            	<div class="col-md-4">
			                            		<span>{{ formatPhone(OMAUser.phone) }}</span>
			                            	</div>
			                            </div>
			                        </li>
			                    </ul>
			                </div>
			                <div class="clearfix" v-if="OMAUsers.length && numPages > 1">
			                	<pagination :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
			                </div>
			            </div>
			        </div>
			    </div>
	        </div>
	        <div v-if="OMAUsers.length && !loadingOMAUsersData && filteredResults.length">
			    <div class="portlet light portlet-fit bordered margin-top-20">
			        <div class="portlet-title bg-blue-chambray">
			        	<div class="menu-image-main">
			        		<img src="../../../../static/client_logo.png">
			        	</div>
			            <div class="caption">
			                <span class="caption-subject font-default bold uppercase">Search Results</span>
	                        <div class="caption-desc font-grey-cascade">Click on an OMA user to edit store locations assigned to them or to delete the user.</div>
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
			                        <li 
										class="mt-list-item actions-at-left margin-top-15" 
										v-for="OMAUser in currentActiveSearchPageItems" 
										:id="'OMAUser-' + OMAUser.id" 
										:class="{'animated' : animated === `OMAUser-${OMAUser.id}`}"
										:key="OMAUser.id">
			                        	<div class="list-item-actions">
        	                        		<el-tooltip 
												v-if="$root.permissions['admin oma_users update']"
												content="Edit" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editOMAUser(OMAUser)">
	                                                <i class="fa fa-pencil" aria-hidden="true"></i>
	                                            </a>
        	                        		</el-tooltip>
        	                        		<el-tooltip 
												v-if="$root.permissions['admin oma_users read'] && !$root.permissions['admin oma_users update']"
												content="View" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editOMAUser(OMAUser)">
	                                                <i class="fa fa-eye" aria-hidden="true"></i>
	                                            </a>
        	                        		</el-tooltip>
        	                        		<el-tooltip 
												v-if="$root.permissions['admin oma_users delete']"
												content="Delete" 
												effect="light" 
												placement="right">
	        	                        		<a class="btn btn-circle btn-icon-only btn-default" @click="showDeleteModal(OMAUser)">
	                                                <i class="fa fa-trash" aria-hidden="true"></i>
	                                            </a>
        	                        		</el-tooltip>
			                        	</div>
			                            <div class="list-item-content height-mod">
			                            	<div class="col-md-4">
			                            		<span>{{ OMAUser.email }}</span>
			                            	</div>
			                            	<div class="col-md-4">
			                            		<span>{{ formatPhone(OMAUser.phone) }}</span>
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
	        <div v-if="!OMAUsers.length && !loadingOMAUsersData">
	        	<no-results :show="!OMAUsers.length" :type="'OMA users'"></no-results>
	        </div>
		</div>
		<!-- LIST END -->

		<!-- EDIT MODAL START -->
		<modal :show="showEditOMAUserModal" effect="fade" @closeOnEscape="closeEditOMAUserModal">
			<div slot="modal-header" class="modal-header">
				<transition name="fade" mode="out-in">
					<div v-if="!editLocationMode">
						<button type="button" class="close" @click="closeEditOMAUserModal()">
							<span>&times;</span>
						</button>
						<h4 class="modal-title center">Edit OMA User</h4>
					</div>
					<div v-if="editLocationMode">
						<button type="button" class="close" @click="closeEditOMAUserModal()">
							<span>&times;</span>
						</button>
						<h4 class="modal-title center">
							<i class="fa fa-chevron-left clickable pull-left back-button" @click="closeEditLocationMode()"></i>
							Select Stores
						</h4>
					</div>
				</transition>
			</div>
			<div slot="modal-body" class="modal-body">
				<transition name="fade" mode="out-in">
					<div v-if="!editLocationMode">
						<div class="alert alert-danger" v-if="editErrorMessage.length">
						    <button class="close" data-close="alert" @click="clearEditError()"></button>
						    <span>{{editErrorMessage}}</span>
						</div>
						<el-select 
							:disabled="$root.permissions['admin oma_users read'] && !$root.permissions['admin oma_users update']"
							v-model="OMAUserToBeEdited.type" 
							placeholder="Select type" 
							size="small" 
							class="margin-bottom-15" 
							ref="editedOMAUserType">
							<el-option label="Admin" :value="1"></el-option>
							<el-option label="Coach" :value="3"></el-option>
							<el-option label="Manager" :value="4"></el-option>
							<el-option label="Staff" :value="5"></el-option>
							<el-option label="Line Staff" :value="6"></el-option>
						</el-select>
						<fieldset :disabled="$root.permissions['admin oma_users read'] && !$root.permissions['admin oma_users update']">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" id="form_control_edited_email" v-model="OMAUserToBeEdited.email" :class="{'edited': OMAUserToBeEdited.email.length}">
								<label for="form_control_edited_email">Email</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" id="form_control_edited_phone" v-model="OMAUserToBeEdited.phone" :class="{'edited': OMAUserToBeEdited.phone.length}">
								<label for="form_control_edited_phone">Phone</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" id="form_control_edited_password" v-model="OMAUserToBeEdited.password" :class="{'edited': OMAUserToBeEdited.password.length}">
								<label for="form_control_edited_password">Password</label>
							</div>
						</fieldset>
	        			<div class="margin-bottom-15">
	        				<button type="button" class="btn blue btn-outline" @click="assignStoreToOMAUser(OMAUserToBeEdited, 'existing')">Select a location</button>
	        				<p class="grey-label margin-top-10" v-if="OMAUserToBeEdited.locations.length">Selected {{OMAUserToBeEdited.locations.length}} location<span v-if="OMAUserToBeEdited.locations.length > 1">s</span></p>
	        			</div>
					</div>
					<form v-if="editLocationMode" role="form" novalidate>
						<div class="alert alert-danger" v-if="assignErrorMessage.length">
						    <button class="close" data-close="alert" @click.prevent="clearAssignError()"></button>
		                    <span>{{ assignErrorMessage }}</span>
						</div>
						<select-locations-popup 
							v-if="editLocationMode"
							@selectedLocations="selectedLocations" 
							:previouslySelected="selectedOMAUser.locations.map(x => parseInt(x))" 
							:withButton="false">
						</select-locations-popup>
					</form>
				</transition>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button 
					v-if="editLocationMode && $root.permissions['admin oma_users update']" 
					type="button" 
					class="btn btn-primary" 
					@click="assignStores($event)">
					Select
				</button>
				<button 
					v-if="editLocationMode && !$root.permissions['admin oma_users update']" 
					type="button" 
					class="btn btn-primary" 
					@click="closeEditLocationMode()">
					Back
				</button>
				<button 
					v-if="!editLocationMode && $root.permissions['admin oma_users update']"
					type="button" 
					class="btn btn-primary" 
					@click="updateOMAUser()">
					Save
				</button>
				<button 
					v-if="!editLocationMode && !$root.permissions['admin oma_users update']"
					type="button" 
					class="btn btn-primary" 
					@click="closeEditOMAUserModal()">
					Close
				</button>
			</div>
		</modal>
		<!-- EDIT MODAL END -->

		<!-- DELETE MODAL START -->
		<modal :show="showDeleteOMAUserModal" effect="fade" @closeOnEscape="closeDeleteOMAUserModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteOMAUserModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete OMA User</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<p>Delete this user?</p>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-primary" @click="deleteOMAUser()">Delete</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->

		<!-- MESSAGE MODAL START -->
		<OMAUsersMessage
			:isOpen="showMessageModal"
			:users="OMAUsers"
			@closeMessageModal="toggleMessageModal"
		>
		</OMAUsersMessage>
		<!-- MESSAGE MODAL END -->
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
import SelectLocationsPopup from '../../modules/SelectLocationsPopup'
import OMAUsersMessage from './OMAUsersMessage'

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
				{name: 'OMA Users', link: false}
			],
			createOMAUserCollapse: true,
			createErrorMessage: '',
			newOMAUser: {
				email: '',
				password: '',
				phone: '',
				type: null,
				locations: []
			},
			editErrorMessage: '',
			OMAUserToBeEdited: {
				email: '',
				password: '',
				phone: '',
				type: null,
				locations: []
			},
			selectedOMAUser: {
				email: '',
				location_id: 0,
				is_active: 1
			},
			selectedLocationId: 1,
			selectedOMAUserType: '',
			loadingOMAUsersData: false,
			assignErrorMessage: '',
			OMAUsers: [],
			showAssignStoresModal: false,
			showEditOMAUserModal: false,
			animated: '',
			editLocationMode: false,
			showDeleteOMAUserModal: false,
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
			showMessageModal: false
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.OMAUsers.length / this.resultsPerPage)
		},
		currentActivePageItems () {
			return this.userSort(this.OMAUsers).slice(this.resultsPerPage * (this.activePage - 1), this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage)
		},
		searchNumPages () {
			return Math.ceil(this.filteredResults.length / this.resultsPerPage)
		},
		currentActiveSearchPageItems () {
			return this.userSort(this.filteredResults).slice(this.resultsPerPage * (this.searchActivePage - 1), this.resultsPerPage * (this.searchActivePage - 1) + this.resultsPerPage)
		},
		newPreviouslySelected () {
			return this.newOMAUser.locations.map(x => x.id) || []
		}
	},
	mounted () {
		this.getAllOMAUsers()
	},
	methods: {
		toggleMessageModal (value) {
			this.showMessageModal = value
		},
		/**
		 * To update the locations selected in the child component
		 * @function
		 * @param {array} locations - Arrray of store ids
		 * @returns {undefined}
		 */
		selectedLocations (locations) {
			this.selectedOMAUserType === 'new' ? this.newOMAUser.selectedLocations = locations : this.OMAUserToBeEdited.selectedLocations = locations
		},
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
				if (a.email.toLowerCase() < b.email.toLowerCase()) {
					return -1
				} else if (a.email.toLowerCase() > b.email.toLowerCase()) {
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
				if (a.email.toLowerCase() > b.email.toLowerCase()) {
					return -1
				} else if (a.email.toLowerCase() < b.email.toLowerCase()) {
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
					for (var i = 0; i < this.OMAUsers.length; i++) {
						if (this.OMAUsers[i].email.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
							this.filteredResults.push(this.OMAUsers[i])
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
		 * To return to the main edit modal.
		 * @function
		 * @returns {undefined}
		 */
		closeEditLocationMode () {
			this.editLocationMode = false
		},
		/**
		 * To display the delete modal.
		 * @function
		 * @param {object} user - The user to delete
		 * @returns {undefined}
		 */
		showDeleteModal (user) {
			this.selectedOMAUser.id = user.id
			this.showDeleteOMAUserModal = true
		},
		/**
		 * To close the delete modal.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteOMAUserModal () {
			this.showDeleteOMAUserModal = false
		},
		/**
		 * To assign the selected stores to the current user.
		 * @function
		 * @param {object} event - The event that initiated the action
		 * @returns {undefined}
		 */
		assignStores (event) {
			event.preventDefault()
			if (this.selectedOMAUserType === 'new') {
				this.newOMAUser.locations = [...this.newOMAUser.selectedLocations]
				this.selectedLocationId = null
				this.selectedOMAUserType = ''
				this.showAssignStoresModal = false
			} else if (this.selectedOMAUserType === 'existing') {
				this.OMAUserToBeEdited.locations = [...this.OMAUserToBeEdited.selectedLocations]
				this.selectedLocationId = null
				this.selectedOMAUserType = ''
				this.editLocationMode = false
			}
		},
		/**
		 * To display the edit modal
		 * @function
		 * @param {object} OMAUser - The OMA user object to be edited
		 * @returns {undefined}
		 */
		editOMAUser (OMAUser) {
			this.OMAUserToBeEdited.email = OMAUser.email
			this.OMAUserToBeEdited.password = OMAUser.password || ''
			this.OMAUserToBeEdited.phone = OMAUser.phone
			this.OMAUserToBeEdited.type = OMAUser.privilege_id
			this.OMAUserToBeEdited.locations = OMAUser.locations
			this.OMAUserToBeEdited.id = OMAUser.id
			this.OMAUserToBeEdited.selectedLocations = []
			this.showEditOMAUserModal = true
			this.$nextTick(function () {
				this.$refs.editedOMAUserType.$children[0].$el.focus()
			})
		},
		/**
		 * To close the edit modal
		 * @function
		 * @returns {undefined}
		 */
		closeEditOMAUserModal () {
			this.closeEditLocationMode()
			this.showEditOMAUserModal = false
		},
		/**
		 * To sync the value of the switch with the state.
		 * @function
		 * @param {number} value - The value of the switch
		 * @returns {undefined}
		 */
		updateNewOMAUserActive (value) {
			this.newOMAUser.is_active = value
		},
		/**
		 * To sync the value of the switch with the state.
		 * @function
		 * @param {number} value - The value of the switch
		 * @returns {undefined}
		 */
		updateEditedOMAUserActive (value) {
			this.OMAUserToBeEdited.is_active = value
		},
		/**
		 * To get a list of OMA users.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllOMAUsers () {
			this.loadingOMAUsersData = true
			var OMAUsersVue = this
			return AdminManagerFunctions.getAllOMAUsers(OMAUsersVue.$root.appId, OMAUsersVue.$root.appSecret, OMAUsersVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					OMAUsersVue.loadingOMAUsersData = false
					OMAUsersVue.OMAUsers = response.payload.user
				} else {
					OMAUsersVue.loadingOMAUsersData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					OMAUsersVue.$router.push('/login/expired')
					return
				}
				OMAUsersVue.loadingOMAUsersData = false
				if (reason.responseJSON) {
					console.log(reason.responseJSON.message)
				}
			})
		},
		/**
		 * To get a list of OMA users.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createOMAUser () {
			var OMAUsersVue = this

			return this.validateNewOMAUserData()
			.then((response) => {
				OMAUsersVue.clearCreateError()
				return AdminManagerFunctions.createOMAUser(OMAUsersVue.newOMAUser, OMAUsersVue.$root.appId, OMAUsersVue.$root.appSecret, OMAUsersVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						OMAUsersVue.getAllOMAUsers()
						OMAUsersVue.resetCreateForm()
						OMAUsersVue.showCreateSuccess()
					} else {
						OMAUsersVue.createErrorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						OMAUsersVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
						OMAUsersVue.createErrorMessage = reason.responseJSON.message
						window.scrollTo(0, 0)
					}
				})
			}).catch(reason => {
				// If validation fails then display the error message
				if (reason.responseJSON) {
					OMAUsersVue.createErrorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				} else {
					OMAUsersVue.createErrorMessage = reason
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewOMAUserData () {
			var OMAUsersVue = this
			return new Promise(function (resolve, reject) {
				if (!OMAUsersVue.newOMAUser.type) {
					reject('Please select a type')
				} else if (!OMAUsersVue.newOMAUser.email.length) {
					reject('Email cannot be blank')
				} else if (!emailPattern.test(OMAUsersVue.newOMAUser.email)) {
					reject('Please enter a valid email')
				} else if (OMAUsersVue.newOMAUser.phone.replace(/\D/g, '').length < 10) {
					reject('Phone number should have at least 10 digits')
				} else if (OMAUsersVue.newOMAUser.password !== OMAUsersVue.passwordCheck) {
					reject('Passwords do not match')
				} else if (!OMAUsersVue.newOMAUser.locations.length) {
					reject('Please select at least one location')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		resetCreateForm () {
			this.newOMAUser = {
				name: '',
				email: '',
				password: '',
				phone: '',
				type: null,
				locations: []
			}
			this.passwordCheck = ''
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		resetAssignForm () {
			this.selectedOMAUser = {
				email: '',
				location_id: 0,
				is_active: 1
			}
		},
		/**
		 * To reset the create new form.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		resetEditForm () {
			this.OMAUserToBeEdited = {
				email: '',
				password: '',
				phone: '',
				type: null,
				locations: [],
				selectedLocations: []
			}
		},

		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		showAssignSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Stores successfully assigned',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		showCreateSuccess () {
			this.$swal({
				title: 'Success',
				text: 'OMA User successfully created',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
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
				text: 'OMA User successfully updated',
				type: 'success',
				confirmButtonText: 'OK'
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
		toggleCreateOMAUserPanel () {
			this.createOMAUserCollapse = !this.createOMAUserCollapse
			this.$nextTick(function () {
				if (!this.createOMAUserCollapse) {
					this.$refs.newOMAUserType.focus()
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
		clearAssignError () {
			this.assignErrorMessage = ''
		},
		/**
		 * To activate the right half panel which lists the store locations.
		 * @function
		 * @param {object} user - The user a store is selected for
		 * @param {string} type - The type of use (new or existing)
		 * @returns {undefined}
		 */
		assignStoreToOMAUser (user, type) {
			this.selectedOMAUser = user
			this.selectedOMAUserType = type
			if (type === 'existing') {
				this.editLocationMode = true
			} else {
				this.showAssignStoresModal = true
			}
		},
		/**
		 * To close the store selection modal
		 * @function
		 * @returns {undefined}
		 */
		closeAssignStoresModal () {
			this.showAssignStoresModal = false
		},
		/**
		 * To update the OMA user object.
		 * @function
		 * @returns {undefined}
		 */
		updateOMAUser () {
			var OMAUsersVue = this

			return this.validateEditedOMAUserData()
			.then((response) => {
				OMAUsersVue.clearCreateError()
				let payload = {
					email: OMAUsersVue.OMAUserToBeEdited.email,
					password: OMAUsersVue.OMAUserToBeEdited.password,
					phone: OMAUsersVue.OMAUserToBeEdited.phone,
					type: OMAUsersVue.OMAUserToBeEdited.type,
					locations_edit: OMAUsersVue.OMAUserToBeEdited.locations,
					id: OMAUsersVue.OMAUserToBeEdited.id
				}
				return AdminManagerFunctions.updateOMAUser(payload, OMAUsersVue.$root.appId, OMAUsersVue.$root.appSecret, OMAUsersVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						OMAUsersVue.closeEditOMAUserModal()
						OMAUsersVue.showEditSuccess()
						OMAUsersVue.getAllOMAUsers()
						this.animated = `OMAUser-${OMAUsersVue.OMAUserToBeEdited.id}`
						window.setTimeout(() => {
							OMAUsersVue.animated = ''
						}, 3000)
						OMAUsersVue.resetEditForm()
					} else {
						OMAUsersVue.editErrorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						OMAUsersVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
						OMAUsersVue.editErrorMessage = reason.responseJSON.message
						window.scrollTo(0, 0)
					}
				})
			}).catch(reason => {
				// If validation fails then display the error message
				if (reason.responseJSON) {
					OMAUsersVue.editErrorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				} else {
					OMAUsersVue.editErrorMessage = reason
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedOMAUserData () {
			this.clearEditError()
			var OMAUsersVue = this
			return new Promise(function (resolve, reject) {
				if (!OMAUsersVue.OMAUserToBeEdited.type) {
					reject('Please select a type')
				} else if (!OMAUsersVue.OMAUserToBeEdited.email.length) {
					reject('Email cannot be blank')
				} else if (!emailPattern.test(OMAUsersVue.OMAUserToBeEdited.email)) {
					reject('Please enter a valid email')
				} else if (OMAUsersVue.OMAUserToBeEdited.phone.replace(/\D/g, '').length < 10) {
					reject('Phone number should have at least 10 digits')
				} else if (!OMAUsersVue.OMAUserToBeEdited.locations.length) {
					reject('Please select at least one location')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To delete the OMA user.
		 * @function
		 * @returns {undefined}
		 */
		deleteOMAUser () {
			var OMAUsersVue = this

			return AdminManagerFunctions.deleteOMAUser(OMAUsersVue.selectedOMAUser.id, OMAUsersVue.$root.appId, OMAUsersVue.$root.appSecret, OMAUsersVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					OMAUsersVue.closeDeleteOMAUserModal()
					OMAUsersVue.getAllOMAUsers()
					OMAUsersVue.showDeleteSuccess()
					OMAUsersVue.resetAssignForm()
				} else {
					OMAUsersVue.editErrorMessage = response.message
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					OMAUsersVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					OMAUsersVue.editErrorMessage = reason.responseJSON.message
					window.scrollTo(0, 0)
				}
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
				text: 'OMA User successfully deleted',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
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
		SelectLocationsPopup,
		OMAUsersMessage
	}
}
</script>

<style scoped>
.animated {
	animation: listItemHighlight 1s 2 ease-in-out both;
}
.modal-content {
	max-height: calc(100vh - 60px);
}
.modal-body {
	overflow-y: auto;
	max-height: calc(100vh - 180px);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
.mt-element-list .list-news.mt-list-container ul>.mt-list-item:hover {
	background-color: white;
}
</style>

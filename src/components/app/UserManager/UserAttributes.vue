<template>
	<div>
		<!-- PAGE BAR START -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- PAGE BAR END -->

		<!-- HEADER SART -->
		<h1 class="page-title">User Attributes</h1>
		<div class="note note-info">
			<p>Create, view, edit and delete User Attributes. View or edit what Item Attributes the User Attribute is associated with.</p>
		</div>
		<!-- HEADER END -->
		
		<!-- CREATE START -->
		<div class="portlet box blue-hoki">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-plus-circle"></i>
					Create A New User Attribute
				</div>
				<div class="tools">
					<a :class="{'expand': expandCreateForm, 'collapse': !expandCreateForm}"></a>
				</div>
			</div>
			<div class="portlet-body" v-show="expandCreateForm">
				<form role="form" @submit="createUserAttribute()">
					<div class="row" v-show="createErrorMessage.length">
						<div class="col-md-6">
							<div class="alert alert-danger">
								<button class="close" @click.prevent="clearError('createErrorMessage')"></button>
								<span>{{createErrorMessage}}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" id="form_control_2" :class="{'edited': newUserAttribute.name.length}" v-model="newUserAttribute.name" @keyup.enter.stop="createUserAttribute()">
								<label for="form_control_2">User Attribute Name</label>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<button type="submit" class="btn blue pull-right">Create</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<!-- CREATE END -->

		<!-- SEARCH START -->
		<div class="margin-top-20" v-show="userAttributes.length">
			<div class="portlet box blue-hoki">
				<div class="portlet-title" @click="toggleSearchPanel()">
					<div class="caption">
						<i class="fa fa-search"></i>
						Search
					</div>
					<div class="tools">
						<a :class="{'expand': expandSearchPanel, 'collapse': !expandSearchPanel}"></a>
					</div>
				</div>
				<div class="portlet-body" v-show="expandSearchPanel">
					<form role="form">
						<div class="row">
							<div class="col-md-6">
								<div class="alert alert-danger" v-show="searchErrorMessage.length">
									<button class="close" @click="clearError('searchErrorMessage')"></button>
									<span>{{searchErrorMessage}}</span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 margin-bottom-20">
								<div class="form-group form-md-line-input form-md-floating-label">
									<div class="input-icon right">
										<input 
											ref="search" 
											type="text" 
											placeholder="Search by name" 
											class="form-control input-sm" 
											:class="{'edited': searchTerm.length}" 
											v-model="searchTerm" 
											id="search_options_search"
										>
										<i class="fa fa-times-circle-o clickable" @click.prevent="resetSearch()" aria-hidden="true"></i>
										<span class="help-block persist">
											At least 3 characters.
										</span>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
		<!-- SEARCH END -->

		<!-- LIST START -->
		<div class="portlet light portlet-fit bordered margin-top-20">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-green bold uppercase">User Attributes</span>
					<div class="caption-desc font-grey-cascade">
						<span v-show="searchTerm.length < 3">All User Attributes</span>
						<span v-show="searchTerm.length > 2">Search results</span>
					</div>
				</div>
			</div>
			<div class="portlet-body">
				<div class="clearfix margin-bottom-10" v-show="searchResults.length">
					<el-dropdown trigger="click" @command="updateSortByOrder" size="mini" :show-timeout="50" :hide-timeout="50">
						<el-button size="mini">
							Sort by
							<span>
								<i class="fa fa-sort-alpha-asc" v-show="sortBy.order === 'ASC'"></i>
								<i class="fa fa-sort-alpha-desc" v-show="sortBy.order === 'DESC'"></i>
							</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="ASC"><i class="fa fa-sort-alpha-asc"></i></el-dropdown-item>
							<el-dropdown-item command="DESC"><i class="fa fa-sort-alpha-desc"></i></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<page-results class="pull-right" :totalResults="userAttributes.length" :activePage="activePage" @pageResults="pageResultsUpdate"></page-results>
				</div>
				<div class="spinner" v-show="!searchResults.length && loadingUserAttributes">
					<div>
						<i class="fa fa-spinner fa-spin"></i>
					</div>
				</div>
				<div class="mt-element-list margin-top-15" :show="searchResults.length && !loadingUserAttributes">
					<div class="mt-list-container list-news ext-1 no-border">
						<ul>
							<li 
								v-for="userAttribute in searchResults"
								:key="userAttribute.id"
								class="mt-list-item margin-top-15" 
								:class="{'animated' : animatedId === userAttribute.id}"
							>
								<div class="margin-bottom-15 actions-on-top">
									<el-tooltip content="Edit" effect="light" placement="top">
										<a class="btn btn-circle btn-icon-only btn-default" @click="openEditModal(userAttribute)">
											<i class="fa fa-lg fa-pencil"></i>
										</a>
									</el-tooltip>
									<el-tooltip content="Apply to Item Attributes" effect="light" placement="top">
										<a class="btn btn-circle btn-icon-only btn-default" @click="openAssignItemAttributesModal(userAttribute)">
											<i class="icon-layers"></i>
										</a>
									</el-tooltip>
									<el-tooltip content="Delete" effect="light" placement="top">
										<a class="btn btn-circle btn-icon-only btn-default" @click="openDeleteModal(userAttribute)">
											<i class="fa fa-lg fa-trash"></i>
										</a>
									</el-tooltip>
								</div>
								<div class="list-datetime bold uppercase font-red">
									<span>{{ userAttribute.name }}</span>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="clearfix margin-top-20" v-show="searchResults.length && numPages > 1">
					<pagination :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
				</div>
				<no-results :show="!searchResults.length && !loadingUserAttributes" :type="'User Attributes'"></no-results>
			</div>
		</div>
		<!-- LIST END -->

		<!-- EDIT START -->
		<modal :show="showEditModal" effect="fade" @closeOnEscape="closeEditModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit User Attribute</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="row" v-show="updateErrorMessage.length">
					<div class="col-md-6">
						<div class="alert alert-danger">
							<button class="close" @click.prevent="clearError('updateErrorMessage')"></button>
							<span>{{updateErrorMessage}}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm" id="form_control_2" :class="{'edited': userAttributeToEdit.name.length}" v-model="userAttributeToEdit.name">
							<label for="form_control_2">User Attribute Name</label>
						</div>
					</div>
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<div class="row">
					<div class="col-md-12">
						<button @click="updateUserAttribute()" type="button" class="btn blue pull-right">Save</button>
					</div>
				</div>
			</div>
		</modal>
		<!-- EDIT END -->

		<!-- ASSIGN ITEM ATTRIBUTES START -->
		<modal :show="showAssignItemAttributesModal" effect="fade" @closeOnEscape="closeAssignItemAttributesModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeAssignItemAttributesModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Apply <i>{{userAttributeToAssignItemAttributesTo.name}}</i> to Multiple Item Attributes</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="row" v-show="assignItemAttributesErrorMessage.length">
					<div class="col-md-12">
						<div class="alert alert-danger">
							<button class="close" @click.prevent="clearError('assignItemAttributesErrorMessage')"></button>
							<span>{{assignItemAttributesErrorMessage}}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<table class="table">
							<thead>
								<tr>
									<th class="table-column--checkboxes">
										<div class="md-checkbox has-success" @change="selectAll()">
											<input type="checkbox" id="locations-promocodes" class="md-check" v-model="selectAllSelected">
											<label for="locations-promocodes">
												<span class="inc"></span>
												<span class="check"></span>
												<span class="box"></span>
											</label>
										</div>
									</th>
									<th> Name </th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="itemAttribute in itemAttributes" :key="itemAttribute.id" >
									<td  class="table-column--names">
										<div class="md-checkbox has-success">
											<input type="checkbox" class="md-check" v-model="itemAttribute.selected" @change="syncSelectAll(itemAttribute.selected)" :id="`ia-${itemAttribute.id}`">
											<label :for="`ia-${itemAttribute.id}`">
												<span class="inc"></span>
												<span class="check"></span>
												<span class="box"></span>
											</label>
										</div>
									</td>
									<td> {{ itemAttribute.name }} </td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<div class="row">
					<div class="col-md-12">
						<button @click="assignItemAttributesToUserAttributes()" type="button" class="btn blue pull-right">Save</button>
					</div>
				</div>
			</div>
		</modal>
		<!-- ASSIGN ITEM ATTRIBUTES END -->

		<!-- DELETE START -->
		<modal :show="showDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Confirm Delete</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="row">
					<div class="col-md-12">
						Are you sure you want to delete <i>{{userAttributeToDelete.name}}</i>?
					</div>
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<div class="row">
					<div class="col-md-12">
						<button @click="deleteUserAttribute()" type="button" class="btn blue pull-right">Delete</button>
					</div>
				</div>
			</div>
		</modal>
		<!-- DELETE END -->
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import Modal from '../../modules/Modal'
import NoResults from '../../modules/NoResults'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'
import ItemAttributesFunctions from '../../../controllers/ItemAttributes'
import UserAttributesFunctions from '../../../controllers/UserAttributes'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'User Manager', link: false},
				{name: 'User Attributes', link: false}
			],
			loadingUserAttributes: false,
			createErrorMessage: '',
			updateErrorMessage: '',
			deleteErrorMessage: '',
			searchErrorMessage: '',
			assignItemAttributesErrorMessage: '',
			expandCreateForm: false,
			expandSearchPanel: false,
			animatedId: null,
			showDeleteModal: false,
			showEditModal: false,
			showAssignItemAttributesModal: false,
			newUserAttribute: {
				name: ''
			},
			userAttributes: [],
			sortBy: {
				order: 'ASC'
			},
			activePage: 1,
			resultsPerPage: 25,
			numPages: 1,
			searchTerm: '',
			currentSearchPage: 1,
			itemsPerSearchPage: 25,
			userAttributeToEdit: {
				id: null,
				name: ''
			},
			userAttributeToDelete: {
				id: null
			},
			itemAttributes: [],
			selectAllSelected: false,
			itemAttributesOfUserAttribute: [],
			userAttributeToAssignItemAttributesTo: {}
		}
	},
	mounted () {
		this.listUserAttributes()
	},
	computed: {
		searchResults () {
			if (this.searchTerm.length > 2) {
				let filtered = this.searchUserAttributes()
				this.numPages = Math.ceil(this.filtered.length / this.resultsPerPage)
				return this.sortUserAttributes(filtered).slice(this.resultsPerPage * (this.activePage - 1), this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage)
			} else {
				this.numPages = Math.ceil(this.userAttributes.length / this.resultsPerPage)
				return this.sortUserAttributes(this.userAttributes).slice(this.resultsPerPage * (this.activePage - 1), this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage)
			}
		}
	},
	methods: {
		/**
		 * To open or close the create form
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePanel () {
			this.expandCreateForm = !this.expandCreateForm
		},
		/**
		 * To clear an error
		 * @function
		 * @param {string} name - The variable name of the error to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To validate data in the create form
		 * @function
		 * @returns {undefined}
		 */
		validateNewUserAttribute () {
			this.clearError('createErrorMessage')
			const attributesVue = this
			return new Promise(function (resolve, reject) {
				if (!attributesVue.newUserAttribute.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To make the API call to the create endpoint
		 * @function
		 * @returns {undefined}
		 */
		createUserAttribute () {
			const attributesVue = this

			return this.validateNewUserAttribute()
			.then((response) => {
				attributesVue.clearError('createErrorMessage')
				return UserAttributesFunctions.createUserAttribute(attributesVue.$root.appId, attributesVue.$root.appSecret, attributesVue.$root.userToken, attributesVue.newUserAttribute)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						attributesVue.confirmCreated(response.payload)
					} else {
						attributesVue.createErrorMessage = response.message || 'Something went wrong ...'
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						attributesVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
						attributesVue.createErrorMessage = reason.responseJSON.message || 'Something went wrong ...'
						window.scrollTo(0, 0)
					} else {
						attributesVue.createErrorMessage = reason.message || 'Something went wrong ...'
					}
				})
			}).catch(reason => {
				// Catch validation error
				attributesVue.createErrorMessage = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To confirm User Attribute was created
		 * @function
		 * @param {object} userAttribute - ID of the User Attribute created
		 * @returns {undefined}
		 */
		confirmCreated (userAttribute) {
			this.$swal({
				title: 'Success',
				html: `<div><i>${userAttribute.name}</i> created</div>`,
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.userAttributes.push(userAttribute)
				this.animatedId = userAttribute.id
				this.resetNewUserAttribute()
				window.setTimeout(() => {
					this.animatedId = null
				}, 3000)
			})
		},
		/**
		 * To reset the create form
		 * @function
		 * @returns {undefined}
		 */
		resetNewUserAttribute () {
			this.newUserAttribute = {
				name: ''
			}
		},
		/**
		 * To open or close the search form
		 * @function
		 * @returns {undefined}
		 */
		toggleSearchPanel () {
			this.expandSearchPanel = !this.expandSearchPanel
		},
		/**
		 * To reset the search form
		 * @function
		 * @returns {undefined}
		 */
		resetSearch () {
			this.searchTerm = ''
		},
		/**
		 * To get a list of existing User Attributes
		 * @function
		 * @returns {undefined}
		 */
		listUserAttributes () {
			this.loadingUserAttributes = true
			const attributesVue = this

			return UserAttributesFunctions.listUserAttributes(attributesVue.$root.appId, attributesVue.$root.appSecret, attributesVue.$root.userToken)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					attributesVue.userAttributes = response.payload
					attributesVue.loadingUserAttributes = false
				} else {
					attributesVue.loadingUserAttributes = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					attributesVue.$router.push('/login/expired')
					return
				}
				attributesVue.loadingUserAttributes = false
			})
		},
		/**
		 * To filter the display list
		 * @function
		 * @returns {array} An array of User Attributes
		 */
		searchUserAttributes () {
			return this.userAttributes.filter((userAttribute) => {
				return userAttribute.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		},
		/**
		 * To sort the display list
		 * @function
		 * @param {array} attributes - The list to sort
		 * @returns {array} An array of User Attributes
		 */
		sortUserAttributes (attributes) {
			const asc = function (a, b) {
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
			const desc = function (a, b) {
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

			return this.sortBy.order === 'ASC' ? attributes.sort(asc) : attributes.sort(desc)
		},
		/**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateSortByOrder (value) {
			this.sortBy.order = value
			this.activePageUpdate(1)
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
				this.activePageUpdate(1)
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
		 * To open the edit modal
		 * @function
		 * @param {object} userAttribute - The User Attribute to edit
		 * @returns {undefined}
		 */
		openEditModal (userAttribute) {
			this.userAttributeToEdit.id = userAttribute.id
			this.userAttributeToEdit.name = userAttribute.name
			this.showEditModal = true
		},
		/**
		 * To open the edit modal
		 * @function
		 * @param {string} userAttribute - The User Attribute to edit
		 * @returns {undefined}
		 */
		validateUserAttributeToEdit () {
			this.clearError('updateErrorMessage')
			const attributesVue = this
			return new Promise(function (resolve, reject) {
				if (!attributesVue.userAttributeToEdit.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To make the API call to the update endpoint
		 * @function
		 * @returns {undefined}
		 */
		updateUserAttribute () {
			const attributesVue = this

			return this.validateUserAttributeToEdit()
			.then((response) => {
				attributesVue.clearError('updateErrorMessage')
				return UserAttributesFunctions.updateUserAttribute(attributesVue.$root.appId, attributesVue.$root.appSecret, attributesVue.$root.userToken, attributesVue.userAttributeToEdit)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						let edited = attributesVue.userAttributes.findIndex((userAttribute) => {
							return userAttribute.id === attributesVue.userAttributeToEdit.id
						})
						attributesVue.userAttributes[edited].name = attributesVue.userAttributeToEdit.name
						attributesVue.closeEditModal()
						attributesVue.confirmUpdated()
					} else {
						attributesVue.updateErrorMessage = response.message || 'Something went wrong ...'
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						attributesVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
						attributesVue.updateErrorMessage = reason.responseJSON.message || 'Something went wrong ...'
						window.scrollTo(0, 0)
					} else {
						attributesVue.updateErrorMessage = reason.message || 'Something went wrong ...'
					}
				})
			}).catch(reason => {
				// Catch validation error
				attributesVue.createErrorMessage = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To close the edit modal
		 * @function
		 * @param {string} userAttribute - The User Attribute to edit
		 * @returns {undefined}
		 */
		closeEditModal () {
			this.clearError('updateErrorMessage')
			this.showEditModal = false
		},
		/**
		 * To confirm User Attribute was updated
		 * @function
		 * @returns {undefined}
		 */
		confirmUpdated () {
			this.$swal({
				title: 'Success',
				html: `<div><i>${this.userAttributeToEdit.name}</i> updated</div>`,
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.animatedId = this.userAttributeToEdit.id
				this.resetUserAttributeToEdit()
				window.setTimeout(() => {
					this.animatedId = null
				}, 3000)
			})
		},
		/**
		 * To reset edit
		 * @function
		 * @returns {undefined}
		 */
		resetUserAttributeToEdit () {
			this.userAttributeToEdit = {
				id: null,
				name: ''
			}
		},
		/**
		 * To open the assign Item Attributes modal
		 * @function
		 * @param {object} userAttribute - The User Attribute to assign to
		 * @returns {undefined}
		 */
		openAssignItemAttributesModal (userAttribute) {
			this.userAttributeToAssignItemAttributesTo.id = userAttribute.id
			this.userAttributeToAssignItemAttributesTo.name = userAttribute.name
			this.listItemAttributes()
		},
		/**
		 * To get a list of existing Item Attributes
		 * @function
		 * @returns {undefined}
		 */
		listItemAttributes () {
			const attributesVue = this

			return ItemAttributesFunctions.listItemAttributes(attributesVue.$root.appId, attributesVue.$root.appSecret, attributesVue.$root.userToken)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					attributesVue.itemAttributes = response.payload.map((itemAttribute) => {
						itemAttribute.selected = false
						return itemAttribute
					})
					attributesVue.listItemAttributesofUserAttribute()
				} else {
					attributesVue.assignItemAttributesErrorMessage = 'Something went wrong ...'
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					attributesVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					attributesVue.assignItemAttributesErrorMessage = reason.responseJSON.message || 'Something went wrong ...'
				} else {
					attributesVue.assignItemAttributesErrorMessage = reason.message || 'Something went wrong ...'
				}
			})
		},
		/**
		 * To get a list of Item Attributes assigned to a User Attribute
		 * @function
		 * @returns {undefined}
		 */
		listItemAttributesofUserAttribute () {
			const attributesVue = this
			return UserAttributesFunctions.listItemAttributesofUserAttribute(attributesVue.$root.appId, attributesVue.$root.appSecret, attributesVue.$root.userToken, attributesVue.userAttributeToAssignItemAttributesTo.id)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					for (let r = 0; r < attributesVue.itemAttributes.length; r++) {
						if (response.payload.attributes_userattributes.length) {
							for (let s = 0; s < response.payload.attributes_userattributes.length; s++) {
								let itemAttribute = attributesVue.itemAttributes[r]
								if (itemAttribute.id === response.payload.attributes_userattributes[s].id) {
									itemAttribute.selected = true
									break
								} else {
									itemAttribute.selected = false
								}
							}
						}
					}
					let notAll = attributesVue.itemAttributes.some((itemAttribute) => {
						return itemAttribute.selected === false
					})
					notAll ? attributesVue.selectAllSelected = false : attributesVue.selectAllSelected = true
					attributesVue.showAssignItemAttributesModal = true
				} else {
					attributesVue.assignItemAttributesErrorMessage = 'Something went wrong ...'
					attributesVue.showAssignItemAttributesModal = true
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					attributesVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					attributesVue.assignItemAttributesErrorMessage = reason.responseJSON.message
					attributesVue.showAssignItemAttributesModal = true
				} else {
					attributesVue.assignItemAttributesErrorMessage = reason.message || 'Something went wrong ...'
					attributesVue.showAssignItemAttributesModal = true
				}
			})
		},
		/**
		 * To select all or deselect all
		 * @function
		 * @returns {undefined}
		 */
		selectAll () {
			for (var i = 0; i < this.itemAttributes.length; i++) {
				this.itemAttributes[i].selected = this.selectAllSelected
			}
		},
		/**
		 * To sync Select All checkbox
		 * @function
		 * @param {boolean} value - The value of the checkbox
		 * @returns {undefined}
		 */
		syncSelectAll (value) {
			if (!value) {
				this.selectAllSelected = false
			} else {
				this.selectAllSelected = this.itemAttributes.every((itemAttribute) => {
					return itemAttribute.selected === true
				})
			}
		},
		/**
		 * To assign Item Attributes to an User Attribute
		 * @function
		 * @returns {undefined}
		 */
		assignItemAttributesToUserAttributes () {
			let payload = {
				attribute: []
			}
			this.itemAttributes.forEach((itemAttribute) => {
				if (itemAttribute.selected) {
					payload.attribute.push({
						id: itemAttribute.id,
						created_by: itemAttribute.created_by
					})
				}
			})
			const attributesVue = this
			return UserAttributesFunctions.assignItemAttributesToUserAttributes(attributesVue.$root.appId, attributesVue.$root.appSecret, attributesVue.$root.userToken, attributesVue.userAttributeToAssignItemAttributesTo.id, payload)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					attributesVue.closeAssignItemAttributesModal()
					attributesVue.confirmAssignItemAttributes()
				} else {
					window.scrollTo(0, 0)
					attributesVue.assignItemAttributesErrorMessage = 'Something went wrong ...'
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					attributesVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					attributesVue.assignItemAttributesErrorMessage = reason.responseJSON.message || 'Something went wrong ...'
				} else {
					window.scrollTo(0, 0)
					attributesVue.assignItemAttributesErrorMessage = reason.message || 'Something went wrong ...'
				}
			})
		},
		/**
		 * To close the assign Item Attributes modal
		 * @function
		 * @returns {undefined}
		 */
		closeAssignItemAttributesModal () {
			this.clearError('assignItemAttributesErrorMessage')
			this.showAssignItemAttributesModal = false
		},
		/**
		 * To confirm Item Attributes were assigned
		 * @function
		 * @returns {undefined}
		 */
		confirmAssignItemAttributes () {
			this.$swal({
				title: 'Success',
				html: `<div>Item Attributes assigned to <i>${this.userAttributeToAssignItemAttributesTo.name}</i></div>`,
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.animatedId = this.userAttributeToAssignItemAttributesTo.id
				this.resetAssignItemAttributes()
				window.setTimeout(() => {
					this.animatedId = null
				}, 3000)
			})
		},
		/**
		 * To reset assign Item Attributes
		 * @function
		 * @returns {undefined}
		 */
		resetAssignItemAttributes () {
			this.userAttributeToAssignItemAttributesTo = {
				id: null,
				name: ''
			}
			this.itemAttributesOfUserAttribute = []
		},
		/**
		 * To open the delete modal
		 * @function
		 * @param {object} userAttribute - The User Attribute to delete
		 * @returns {undefined}
		 */
		openDeleteModal (userAttribute) {
			this.userAttributeToDelete.id = userAttribute.id
			this.userAttributeToDelete.name = userAttribute.name
			this.showDeleteModal = true
		},
		/**
		 * To make the API call to the delete endpoint
		 * @function
		 * @returns {undefined}
		 */
		deleteUserAttribute () {
			const attributesVue = this

			return UserAttributesFunctions.deleteUserAttribute(attributesVue.$root.appId, attributesVue.$root.appSecret, attributesVue.$root.userToken, attributesVue.userAttributeToDelete)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					attributesVue.userAttributes = attributesVue.userAttributes.filter((userAttribute) => {
						return userAttribute.id !== attributesVue.userAttributeToDelete.id
					})
					attributesVue.closeDeleteModal()
					attributesVue.confirmDelete()
				} else {
					attributesVue.deleteErrorMessage = response.message || 'Something went wrong ...'
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					attributesVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					attributesVue.deleteErrorMessage = reason.responseJSON.message || 'Something went wrong ...'
					window.scrollTo(0, 0)
				} else {
					attributesVue.deleteErrorMessage = reason.message || 'Something went wrong ...'
				}
			})
		},
		/**
		 * To close the delete modal
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.clearError('deleteErrorMessage')
			this.showDeleteModal = false
		},
		/**
		 * To confirm User Attribute was deleted
		 * @function
		 * @returns {undefined}
		 */
		confirmDelete () {
			this.$swal({
				title: 'Success',
				html: `<div><i>${this.userAttributeToDelete.name}</i> deleted</div>`,
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.userAttributeToDelete.id = null
				this.userAttributeToDelete.name = ''
			})
		}
	},
	components: {
		Breadcrumb,
		NoResults,
		Modal,
		Pagination,
		PageResults
	}
}
</script>

<style scoped>
.spinner {
	display: flex;
	justify-content: center;
	align-content: center;
	width: 100%;
	height: 100px;
	font-size: 400%;
}
.actions-on-top {
	margin-top: -5px;
}
.mt-list-container.list-news.ext-1.no-border ul>.mt-list-item:hover {
	background-color: white;
}
.animated {
	animation: listItemHighlight 1s 2 ease-in-out both;
}
.table-column--checkboxes {
	width: 50px;
}
</style>

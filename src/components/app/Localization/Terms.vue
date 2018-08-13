<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Terms</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage terms.</p>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki" v-if="$root.permissions['localization terms create']">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a new Term
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body relative-block" :class="{'display-hide': createNewCollapse}">
				<div class="col-md-12" v-show="activeLocationId === undefined">
					<div class="alert center alert-info">
						<h4>No Store Selected</h4>
						<p>Please select a store from the stores panel on the right to create a term.</p>
					</div>
				</div>
				<form role="form" @submit.prevent="createTerm()" v-show="activeLocationId !== undefined">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger" v-show="createErrorMessage.length" ref="createErrorMessage">
								<button class="close" data-close="alert" @click.prevent="clearError('createErrorMessage')"></button>
								<span>{{ createErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" :class="{'edited': newTerm.term.length}" id="form_control_1" v-model="newTerm.term">
								<label for="form_control_1">Term</label>
							</div>
							<button 
								type="submit" 
								class="btn blue pull-right"
								:disabled="creating">
								Create
								<i 
									v-show="creating"
									class="fa fa-spinner fa-pulse fa-fw">
								</i>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE -->

		<!-- SEARCH START -->
		<div class="margin-top-20" v-if="activeLocationId !== undefined">
			<div class="portlet box blue-hoki">
				<div class="portlet-title" @click="toggleSearchPanel()">
					<div class="caption">
						<i class="fa fa-search"></i>
						Search
					</div>
					<div class="tools">
						<a :class="{'expand': !searchCollapse, 'collapse': searchCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" v-show="!searchCollapse">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger" v-show="searchError.length" ref="searchError">
								<button class="close" @click="clearError('searchError')"></button>
								<span>{{searchError}}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label form-md-line-input-trimmed">
								<div class="input-icon right">
									<input  
										type="text" 
										ref="search"
										placeholder="Term" 
										class="form-control input-sm" 
										:class="{'edited': searchTerm.length}" 
										v-model="searchTerm" 
										id="search_terms"
									>
									<i class="fa fa-times-circle-o clickable" @click.prevent="resetSearch()" aria-hidden="true"></i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- SEARCH END -->

		<!-- BEGIN LIST -->
		<div v-if="activeLocationId === undefined">
			<div class="alert center alert-info">
				<h4>No Store Selected</h4>
				<p>Please select a store from the stores panel on the right to view terms for it.</p>
			</div>
		</div>
		<div v-else>
			<div class="portlet light portlet-fit bordered margin-top-20" id="terms-container">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image-main">
						<img src="../../../../static/client_logo.png">
					</div>
					<div class="caption">
						<span class="caption-subject font-green bold uppercase">Terms</span>
						<div class="caption-desc font-grey-cascade">Create, edit or delete terms.</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="alert alert-danger" v-show="listErrorMessage.length" ref="listErrorMessage">
						<button class="close" data-close="alert" @click="clearError('listErrorMessage')"></button>
						<span>{{ listErrorMessage }}</span>
					</div>
				</div>
				<div class="portlet-body relative-block">
					<loading-screen 
						:show="loadingTerms && activeLocationId !== undefined" 
						:color="'#2C3E50'" 
						:display="'inline'">
					</loading-screen>
					<div class="mt-element-list margin-top-15" v-if="terms.length && !loadingTerms">
						<div class="mt-list-container list-news ext-1 no-border">
							<ul>
								<li 
									class="mt-list-item actions-at-left margin-top-15 three-vertical-actions" 
									v-for="term in terms" 
									:id="'term-' + term.id" 
									:key="term.id">
									<div class="list-item-actions">
										<el-tooltip 
											v-if="$root.permissions['localization terms update']"
											content="Edit" 
											effect="light" 
											placement="right">
											<a class="btn btn-circle btn-icon-only btn-default" @click="editTerm(term, $event)">
												<i class="fa fa-lg fa-pencil"></i>
											</a>
										</el-tooltip>
										<el-tooltip 
											v-if="$root.permissions['localization terms read'] && !$root.permissions['localization terms update']"
											content="View" 
											effect="light" 
											placement="right">
											<a class="btn btn-circle btn-icon-only btn-default" @click="editTerm(term, $event)">
												<i class="fa fa-lg fa-eye"></i>
											</a>
										</el-tooltip>
										<el-tooltip 
											v-if="$root.permissions['localization terms delete']"
											content="Delete" 
											effect="light" 
											placement="right">
											<a class="btn btn-circle btn-icon-only btn-default" @click="confirmDelete(term, $event)">
												<i class="fa fa-lg fa-trash"></i>
											</a>
										</el-tooltip>
									</div>
									<div class="col-md-12 bold uppercase font-red">
										<span>{{ term.term }}</span>
									</div>
									<div class="col-md-6">
										<strong></strong>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div class="clearfix margin-top-20" v-if="lastPage > 1">
						<pagination :passedPage="currentPage" :numPages="lastPage" @activePageChange="changePage"></pagination>
					</div>
					<div class="margin-top-20">
						<no-results :show="!terms.length && !loadingTerms" :type="'terms'"></no-results>
					</div>
				</div>
			</div>
		</div>
		<!-- END LIST -->

		<!-- START EDIT -->
		<modal :show="showEditModal" effect="fade" @closeOnEscape="closeEditModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Term</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<form role="form">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger" v-show="editErrorMessage.length" ref="editErrorMessage">
								<button class="close" data-close="alert" @click.prevent="clearError('editErrorMessage')"></button>
								<span>{{ editErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-12">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input 
									:disabled="!$root.permissions['localization terms update']"
									type="text" 
									class="form-control input-sm" 
									:class="{'edited': termToEdit.term.length}" 
									id="form_control_1" 
									v-model="termToEdit.term">
								<label for="form_control_1">Term</label>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<button 
					v-if="!$root.permissions['localization terms update']"
					@click="closeEditModal()" 
					type="button" 
					class="btn blue">
					Close
				</button>				
				<button 
					v-else
					@click="updateTerm()" 
					type="submit" 
					class="btn blue"
					:disabled="updating">
					Save
					<i 
						v-show="updating"
						class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- END EDIT -->

		<!-- START DELETE -->
		<modal :show="showDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Confirm Delete</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<p>Are you sure you want to delete {{termToDelete.term}}?</p>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<button 
					type="button" 
					class="btn blue" 
					@click="deleteTerm()"
					:disabled="deleting">
					Delete
					<i 
						v-show="deleting"
						class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- START DELETE -->
	</div>
</template>

<script>
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import TermsFunctions from '@/controllers/Terms'
import Modal from '@/components/modules/Modal'
import Pagination from '@/components/modules/Pagination'
import NoResults from '@/components/modules/NoResults'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Terms', link: false}
			],

			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newTerm: {
				term: ''
			},

			searchCollapse: true,
			searchTerm: '',
			searchError: '',
			currentPage: 1,
			itemsPerPage: 10,

			loadingTerms: false,
			listErrorMessage: '',
			allTerms: [],

			showEditModal: false,
			updating: false,
			editErrorMessage: '',
			termToEdit: {
				term: ''
			},

			showDeleteModal: false,
			deleting: false,
			deleteErrorMessage: '',
			termToDelete: {
				term: ''
			}
		}
	},
	computed: {
		activeLocationId: function () {
			return this.$root.activeLocation.id
		},
		terms: function () {
			const searchResult = this.allTerms.filter(term => {
				return term.term.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
			})
			searchResult.sort((a, b) => a.term > b.term)

			let begin = ((this.currentPage - 1) * this.itemsPerPage)
			let end = (this.currentPage * this.itemsPerPage)

			return searchResult.slice(begin, end)
		},
		lastPage: function () {
			this.currentPage = 1
			return this.searchTerm ? Math.ceil(this.terms.length / this.itemsPerPage) : Math.ceil(this.allTerms.length / this.itemsPerPage)
		}
	},
	watch: {
		activeLocationId: function (newId) {
			if (newId !== undefined) {
				this.getTerms()
			}
		}
	},
	mounted () {
		this.getTerms()
	},
	methods: {
		/**
		 * To toggle the create tier panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePanel () {
			this.createNewCollapse = !this.createNewCollapse
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {object} errorMessageName - The error message to be cleared.
		 * @returns {undefined}
		 */
		clearError (errorMessageName) {
			this[errorMessageName] = ''
		},
		/**
		 * To check if the term data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewTermData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.newTerm.term.length) {
					reject('Term cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new term.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createTerm () {
			var _this = this
			_this.clearError('createErrorMessage')

			return _this.validateNewTermData()
			.then(response => {
				_this.creating = true
				TermsFunctions.createTerm(_this.newTerm)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.showCreateSuccess()
						_this.getTerms()
					} else {
						_this.createErrorMessage = response.message
						_this.$scrollTo(_this.$refs.createErrorMessage, 1000, { offset: -50 })
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not create the term',
						errorName: 'createErrorMessage',
						vue: _this
					})
				}).finally(() => {
					_this.creating = false
				})
			}).catch(reason => {
				_this.createErrorMessage = reason
				_this.$scrollTo(_this.$refs.createErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To alert the user that the term has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showCreateSuccess () {
			this.$swal({
				title: 'Success!',
				text: 'Term \'' + this.newTerm.term + '\' has been successfully added!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.clearNewTerm()
			})
		},
		/**
		 * To clear the new term form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewTerm () {
			this.newTerm = {
				term: ''
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
		 * To reset the search.
		 * @function
		 * @returns {undefined}
		 */
		resetSearch () {
			this.clearError('searchError')
			this.searchTerm = ''
		},
		/**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
		changePage (val) {
			if (parseInt(this.currentPage) !== parseInt(val)) {
				this.currentPage = val
				window.scrollTo(0, 0)
			}
		},
		/**
		 * To get a list of all terms.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getTerms () {
			this.clearError('listErrorMessage')
			this.loadingTerms = true
			this.allTerms = []
			var _this = this
			return TermsFunctions.listTerms()
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					_this.loadingTerms = false
					_this.allTerms = response.payload
				} else {
					_this.loadingTerms = false
				}
			}).catch(reason => {
				_this.loadingTerms = false
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch the list of terms',
					errorName: 'listErrorMessage',
					vue: _this
				})
			})
		},
		/**
		 * To show the modal to edit an term details.
		 * @function
		 * @param {object} term - The selected term.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editTerm (term, event) {
			event.stopPropagation()
			this.termToEdit = {...term}
			this.showEditModal = true
		},
		/**
		 * To check if the term data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedTermData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.termToEdit.term.length) {
					reject('Term cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a term.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updateTerm () {
			var _this = this
			_this.clearError('editErrorMessage')
			let payload = {...this.termToEdit}

			return _this.validateEditedTermData()
			.then(response => {
				_this.updating = true
				TermsFunctions.updateTerm(payload).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.getTerms()
						_this.closeEditModal()
						_this.showEditSuccess()
						_this.resetEdit()
					} else {
						_this.editErrorMessage = response.message
						_this.$scrollTo(_this.$refs.editErrorMessage, 1000, { offset: -50 })
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the term',
						errorName: 'editErrorMessage',
						vue: _this
					})
				}).finally(() => {
					_this.updating = false
				})
			}).catch(reason => {
				_this.editErrorMessage = reason
				_this.$scrollTo(_this.$refs.editErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To display notification that terms were successfully saved.
		 * @function
		 * @returns {undefined}
		 */
		showEditSuccess () {
			this.$swal({
				title: 'Success!',
				text: `${this.termToEdit.term} updated`,
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To close the modal for editing a promotion.
		 * @function
		 * @returns {undefined}
		 */
		closeEditModal () {
			this.clearError('editErrorMessage')
			this.showEditModal = false
		},
		/**
		 * To reset the edit form
		 * @function
		 * @returns {undefined}
		 */
		resetEdit () {
			this.termToEdit = {
				term: ''
			}
		},
		/**
		 * To display the modal for deleting an term.
		 * @function
		 * @param {object} term - The selected term
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		confirmDelete (term, event) {
			event.stopPropagation()
			this.termToDelete = {...term}
			this.showDeleteModal = true
		},
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteTerm () {
			this.deleting = true
			var _this = this
			return TermsFunctions.deleteTerm(_this.termToDelete)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					_this.getTerms()
					_this.closeDeleteModal()
					_this.showDeleteSuccess()
				}
			})
			.catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: `We could not delete ${this.termToDelete.term}`,
					errorName: 'deleteErrorMessage',
					vue: _this
				})
			}).finally(() => {
				_this.deleting = false
			})
		},
		/**
		 * To display notification that terms were successfully saved.
		 * @function
		 * @returns {undefined}
		 */
		showDeleteSuccess () {
			this.$swal({
				title: 'Success!',
				text: `${this.termToDelete.term} was deleted`,
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To close the delete modal.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.clearError('deleteErrorMessage')
			this.showDeleteModal = false
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		Modal,
		NoResults,
		Pagination
	}
}
</script>

<style scoped>
.mt-element-list .list-news.ext-1.mt-list-container ul>.mt-list-item:hover {
	background-color: white;
}
.three-vertical-actions {
	min-height: 124px;
}
</style>

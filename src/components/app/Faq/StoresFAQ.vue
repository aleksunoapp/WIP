<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Frequently Asked Questions - Stores</h1>
		<!-- END PAGE TITLE-->
		<div class="note note-info">
			<p>Create and manage store FAQs.</p>
		</div>

		<!-- CREATE START -->
		<div class="portlet box blue-hoki margin-top-20"
		     v-if="$root.permissions['faq store create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreateFAQPanel()">
				<div class="caption">
					<i class="fa fa-plus-circle"></i>
					Post A Question
				</div>
				<div class="tools">
					<a :class="{'expand': !createFAQCollapse, 'collapse': createFAQCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body fixed-height"
			     :class="{'display-hide': createFAQCollapse}">
				<form role="form"
				      @submit.prevent="createStoreFAQ($event)">
					<div class="alert alert-danger"
					     v-show="createFAQError"
						 ref="createFAQError">
						<button class="close"
						        @click.prevent="clearError('createFAQError')"></button>
						<span>{{createFAQError}}</span>
					</div>
					<div class="col-md-6">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm"
							       id="form_control_1"
							       v-model="newFAQ.question"
							       :class="{'edited': newFAQ.question.length}">
							<label for="form_control_1">Question</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<textarea class="form-control input-sm"
							          rows="5"
							          v-model="newFAQ.answer"
							          :class="{'edited': newFAQ.answer.length}"
							          id="form_control_2"></textarea>
							<label for="form_control_2">Answer</label>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm"
							       id="form_control_3"
							       v-model="newFAQ.external_link"
							       :class="{'edited': newFAQ.external_link.length}">
							<label for="form_control_3">External Link</label>
						</div>
						<div class="margin-top-20">
							<label>
								Country:
								<el-select v-model="newFAQ.country_id"
											placeholder="Select a country"
											size="small"
											no-data-text="No countries"
											remote
											:loading="loadingCountries">
									<el-option v-for="country in countries"
												:label="country.name"
												:value="country.id"
												:key="country.id">
									</el-option>
								</el-select>
							</label>
						</div>
						<div class="margin-top-20">
							<label>
								Platform:
								<el-select v-model="newFAQ.platform_id"
											placeholder="Select a platform"
											size="small"
											no-data-text="No platforms"
											remote
											:loading="loadingPlatforms">
									<el-option v-for="platform in platforms"
												:label="platform.name"
												:value="platform.id"
												:key="platform.id">
									</el-option>
								</el-select>
							</label>
						</div>
					</div>
					<div class="clear form-actions right">
						<button type="button"
						        class="btn btn-default"
						        @click="resetForm()"> Reset Form</button>
						<button type="submit"
						        class="btn blue"
						        :disabled="creating">
							Save
							<i v-show="creating"
							   class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
				</form>
			</div>
		</div>
		<!-- CREATE END -->

		<div class="margin-top-20">
			<div class="relative-block">
				<div class="portlet light portlet-fit bordered">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-default bold uppercase">Store FAQs</span>
							<div class="caption-desc font-grey-cascade">Click on the edit button to edit the questions and answers.</div>
						</div>
					</div>
					<loading-screen :show="displayStoresFAQData"
		                :color="'#2C3E50'"
		                :display="'inline'"></loading-screen>
					<div class="portlet-body">
						<div class="alert alert-danger"
						     v-show="!faqs.length && errorMessage"
						     ref="errorMessage">
							<button class="close"
							        @click="clearError('errorMessage')"></button>
							<span>{{errorMessage}}</span>
						</div>
						<div class="timeline"
						     v-if="faqs.length">
							<div class="timeline-item"
							     v-for="faq in faqs"
							     :key="faq.id">
								<div class="timeline-badge">
									<div class="timeline-icon">
										<i class="font-blue-sharp icon-bubbles"></i>
									</div>
								</div>
								<div class="timeline-body"
								     :id="'faq-' + faq.id">
									<div class="timeline-body-arrow"> </div>
									<div class="timeline-body-head">
										<div class="timeline-body-head-caption">
											<a class="timeline-body-title font-blue-madison">{{ faq.question }}</a>
										</div>
										<div class="timeline-body-head-actions">
											<div class="btn-group">
												<button v-if="$root.permissions['faq store update']"
												        class="btn blue btn-sm"
												        type="button"
												        @click="editFAQ(faq)">
													Edit
												</button>
												<button v-if="$root.permissions['faq store read'] && !$root.permissions['faq store update']"
												        class="btn blue btn-sm"
												        type="button"
												        @click="editFAQ(faq)">
													View
												</button>
												<button v-if="$root.permissions['faq store delete']"
												        class="btn blue btn-sm margin-left-5"
												        type="button"
												        @click="confirmDelete(faq)">
													Delete
												</button>
											</div>
										</div>
									</div>
									<div class="timeline-body-content">
										<span class="font-grey-cascade">{{ faq.answer }}</span>
									</div>
								</div>
							</div>
						</div>
						<div v-else>
							<no-results :show="!faqs.length && !displayStoresFAQData"
							            :type="'store FAQs'"></no-results>
						</div>
					</div>
				</div>
			</div>
		</div>
		<edit-store-faq v-if="showEditFAQModal"
		                :faqId="selectedFAQId"
		                @closeEditStoreFAQModal="closeEditStoreFAQModal"
		                @updateFAQ="updateFAQ"></edit-store-faq>

		<!-- START DELETE -->
		<modal :show="showDeleteModal"
		       effect="fade"
		       @closeOnEscape="closeDeleteModal"
					 ref="deleteModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Confirm Delete</h4>
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
				<p>Are you sure you want to delete?</p>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<button type="button"
				        class="btn blue"
				        @click="deleteFAQ()"
				        :disabled="deleting">
					Delete
					<i v-show="deleting"
					   class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- END DELETE -->
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import FAQFunctions from '../../../controllers/FAQ'
import EditStoreFaq from './EditStoreFaq'
import ajaxErrorHandler from '@/controllers/ErrorController'
import LoadingScreen from '@/components/modules/LoadingScreen'
import Modal from '@/components/modules/Modal'
import CountriesFunctions from '@/controllers/Countries'
import PlatformsFunctions from '@/controllers/Platforms'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'FAQ', link: false },
				{ name: 'Stores FAQ', link: false }
			],
			createFAQCollapse: true,
			creating: false,
			createFAQError: '',
			newFAQ: {
				question: '',
				answer: '',
				external_link: '',
				status: 1,
				user_id: this.$root.createdBy,
				country_id: null,
				platform_id: null
			},
			faqs: [],
			errorMessage: '',
			showEditFAQModal: false,
			selectedFAQId: 0,
			displayStoresFAQData: false,
			loadingCountries: false,
			countries: [],
			loadingPlatforms: false,
			platforms: [],
			deleteErrorMessage: '',
			faqToDelete: {},
			showDeleteModal: false,
			deleting: false
		}
	},
	created () {
		this.getStoreFAQs()
		this.getCountries()
		this.getPlatforms()
	},
	methods: {
		/**
		 * To get the FAQs for stores.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreFAQs () {
			this.displayStoresFAQData = true
			this.faqs = []
			var storesFAQVue = this
			return FAQFunctions.getStoreFAQs(
				storesFAQVue.$root.appId,
				storesFAQVue.$root.appSecret
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						storesFAQVue.faqs = response.payload
					} else {
						storesFAQVue.errorMessage = response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch FAQs',
						errorName: 'errorMessage',
						vue: storesFAQVue
					})
				}).finally(() => {
					storesFAQVue.displayStoresFAQData = false
				})
		},
		/**
		 * To get a list of all countries.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCountries () {
			this.clearError('errorMessage')
			this.loadingCountries = true
			this.countries = []
			var _this = this
			return CountriesFunctions.listCountries()
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.loadingCountries = false
						_this.countries = response.payload
					} else {
						_this.loadingCountries = false
					}
				})
				.catch(reason => {
					_this.loadingCountries = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of countries',
						errorName: 'errorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To get a list of all platforms.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPlatforms () {
			this.clearError('errorMessage')
			this.loadingPlatforms = true
			this.platforms = []
			var _this = this
			return PlatformsFunctions.listPlatforms()
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.loadingPlatforms = false
						_this.platforms = response.payload
					} else {
						_this.loadingPlatforms = false
					}
				})
				.catch(reason => {
					_this.loadingPlatforms = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of platforms',
						errorName: 'errorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To toggle the create faq panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateFAQPanel () {
			this.createFAQCollapse = !this.createFAQCollapse
		},
		/**
		 * To clear an error.
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To clear the create faq form.
		 * @function
		 * @returns {undefined}
		 */
		resetForm () {
			this.newFAQ = {
				question: '',
				answer: '',
				external_link: '',
				status: 1,
				user_id: this.$root.createdBy,
				country_id: null,
				platform_id: null
			}
			this.clearError('createFAQError')
		},
		/**
		 * To check if the faq information are valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateFAQData () {
			var storesFAQVue = this
			return new Promise(function (resolve, reject) {
				if (!storesFAQVue.newFAQ.question.length) {
					reject('Question cannot be blank')
				} else if (!storesFAQVue.newFAQ.answer.length) {
					reject('Answer cannot be blank')
				} else if (!storesFAQVue.newFAQ.external_link.length) {
					reject('External link cannot be blank')
				} else if (storesFAQVue.newFAQ.country_id === null) {
					reject('Select a country')
				} else if (storesFAQVue.newFAQ.platform_id === null) {
					reject('Select a platform')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To prompt the backend call that creates a new FAQ.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		createStoreFAQ (event) {
			var storesFAQVue = this

			this.clearError('createFAQError')
			return storesFAQVue
				.validateFAQData()
				.then(response => {
					storesFAQVue.creating = true
					FAQFunctions.createStoreFAQ(
						storesFAQVue.newFAQ,
						storesFAQVue.$root.appId,
						storesFAQVue.$root.appSecret,
						storesFAQVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								storesFAQVue.newFAQ.id = response.payload.new_faq_id
								storesFAQVue.faqs.push(storesFAQVue.newFAQ)
								storesFAQVue.showAlert(response.payload)
								storesFAQVue.resetForm()
							} else {
								storesFAQVue.createFAQError = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create the FAQ',
								errorName: 'createFAQError',
								vue: storesFAQVue
							})
						})
						.finally(() => {
							storesFAQVue.creating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					storesFAQVue.createFAQError = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAlert (payload = {}) {
			let title = 'Success'
			let text = 'The Store FAQ has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Store FAQ has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To prompt the backend call that updates a store FAQ.
		 * @function
		 * @param {object} faq - The selected FAQ object.
		 * @returns {undefined}
		 */
		editFAQ (faq) {
			this.showEditFAQModal = true
			this.selectedFAQId = faq.id
		},
		/**
		 * To close the modal to edit store FAQs.
		 * @function
		 * @returns {undefined}
		 */
		closeEditStoreFAQModal () {
			this.showEditFAQModal = false
		},
		/**
		 * To close the modal and highlight the recently updated store faq.
		 * @function
		 * @param {object} val - The recently updated FAQ object.
		 * @returns {undefined}
		 */
		updateFAQ (val) {
			this.getStoreFAQs()
			this.showEditFAQModal = false
		},
		/**
		 * To open the modal to delete an FAQs.
		 * @function
		 * @param {object} faq - The selected FAQ
		 * @returns {undefined}
		 */
		confirmDelete (faq) {
			this.faqToDelete = faq
			this.showDeleteModal = true
		},
		/**
		 * To close the modal to delete an FAQs.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.showDeleteModal = false
			this.clearError('deleteErrorMessage')
			this.faqToDelete = {}
		},
		/**
		 * To prompt the backend call that deletes an FAQ.
		 * @function
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		deleteFAQ () {
			this.deleting = true
			this.clearError('deleteErrorMessage')
			var storesFAQVue = this
			return FAQFunctions.deleteStoreFAQ(
				storesFAQVue.faqToDelete.id
			)
				.then(response => {
					storesFAQVue.getStoreFAQs()
					storesFAQVue.closeDeleteModal()
					storesFAQVue.showDeleteSuccess(response.payload)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not delete the FAQ',
						errorName: 'deleteErrorMessage',
						vue: storesFAQVue,
						containerRef: 'deleteModal'
					})
				})
				.finally(() => {
					storesFAQVue.deleting = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showDeleteSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Store FAQ has been deleted'
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
		}
	},
	components: {
		Breadcrumb,
		EditStoreFaq,
		NoResults,
		LoadingScreen,
		Modal
	}
}
</script>
<style scoped>
.fixed-height {
  height: 300px;
}
</style>

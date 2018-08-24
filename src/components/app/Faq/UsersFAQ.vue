<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Frequently Asked Questions - Users</h1>
		<!-- END PAGE TITLE-->
		<div class="note note-info">
			<p>Create and manage user FAQs.</p>
		</div>

		<!-- CREATE START -->
		<div class="portlet box blue-hoki margin-top-20"
		     v-if="$root.permissions['faq user create']">
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
			<div class="portlet-body"
			     :class="{'display-hide': createFAQCollapse}">
				<form role="form"
				      @submit.prevent="createUserFAQ($event)">
					<div class="row">
						<div class="col-xs-12">
							<div class="alert alert-danger"
							     v-if="createFAQError.length">
								<button class="close"
								        data-close="alert"
								        @click="clearCreateFAQError()"></button>
								<span>{{createFAQError}}</span>
							</div>
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
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       id="form_control_3"
								       v-model="newFAQ.external_link"
								       :class="{'edited': newFAQ.external_link.length}">
								<label for="form_control_3">External Link</label>
							</div>
							<div>
								<p class="grey-label">Call to action type</p>
								<el-select v-model="newFAQ.cta_type"
								           placeholder="Select type"
								           size="small"
								           class="margin-bottom-15"
								           id="form_control_cta_type">
									<el-option label="none"
									           value=""></el-option>
									<el-option label="email"
									           value="email"></el-option>
									<el-option label="locations"
									           value="locations"></el-option>
									<el-option label="orders"
									           value="orders"></el-option>
									<el-option label="profile"
									           value="profile"></el-option>
									<el-option label="payment"
									           value="payment"></el-option>
									<el-option label="menus"
									           value="menus"></el-option>
									<el-option label="rewards"
									           value="rewards"></el-option>
									<el-option label="call"
									           value="call"></el-option>
									<el-option label="web"
									           value="web"></el-option>
									<el-option label="feedback"
									           value="feedback"></el-option>
								</el-select>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       id="form_control_cta_value"
								       v-model="newFAQ.cta_value"
								       :class="{'edited': newFAQ.cta_value.length}">
								<label for="form_control_cta_value">Call to action value</label>
							</div>
						</div>
						<div class="col-md-12">
							<button type="submit"
							        class="btn blue pull-right"
							        :disabled="creating">
								Save
								<i v-show="creating"
								   class="fa fa-spinner fa-pulse fa-fw">
								</i>
							</button>
						</div>
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
							<span class="caption-subject font-default bold uppercase">User FAQs</span>
							<div class="caption-desc font-grey-cascade">Click on the edit button to edit the questions and answers.</div>
						</div>
					</div>
					<loading-screen :show="displayUserFAQData"
		                :color="'#2C3E50'"
		                :display="'inline'"></loading-screen>
					<div class="portlet-body">
						<div class="alert alert-danger"
						     v-show="!faqs.length && errorMessage"
						     ref="errorMessage">
							<button class="close"
							        @click="clearError()"></button>
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
												<button v-if="$root.permissions['faq user update']"
												        class="btn blue btn-sm"
												        type="button"
												        @click="editFAQ(faq)">
													Edit
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
							<no-results :show="!faqs.length && !displayUserFAQData"
							            :type="'user FAQs'"></no-results>
						</div>
					</div>
				</div>
			</div>
		</div>
		<edit-user-faq v-if="showEditFAQModal"
		               :faqId="selectedFAQId"
		               @closeEditStoreFAQModal="closeEditStoreFAQModal"
		               @highlightFAQ="highlightFAQ"></edit-user-faq>
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import GlobalFunctions from '../../../global'
import FAQFunctions from '../../../controllers/FAQ'
import EditUserFaq from './EditUserFaq'
import ajaxErrorHandler from '@/controllers/ErrorController'
import LoadingScreen from '@/components/modules/LoadingScreen'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'FAQ', link: false },
				{ name: 'Users FAQ', link: false }
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
				cta_type: '',
				cta_value: ''
			},
			faqs: [],
			errorMessage: '',
			showEditFAQModal: false,
			selectedFAQId: 0,
			displayUserFAQData: false
		}
	},
	created () {
		this.getUserFAQs()
	},
	methods: {
		/**
		 * To get the FAQs for stores.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserFAQs () {
			this.displayUserFAQData = true
			this.faqs = []
			var usersFAQVue = this
			return FAQFunctions.getUserFAQs(
				usersFAQVue.$root.appId,
				usersFAQVue.$root.appSecret
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						usersFAQVue.faqs = response.payload
					} else {
						usersFAQVue.errorMessage = response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch FAQs',
						errorName: 'errorMessage',
						vue: usersFAQVue
					})
				}).finally(() => {
					usersFAQVue.displayUserFAQData = false
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
		 * To clear the current faq error.
		 * @function
		 * @returns {undefined}
		 */
		clearCreateFAQError () {
			this.createFAQError = ''
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
				cta_type: '',
				cta_value: ''
			}
			this.clearCreateFAQError()
		},
		/**
		 * To check if the faq information are valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateFAQData () {
			var usersFAQVue = this
			return new Promise(function (resolve, reject) {
				if (!usersFAQVue.newFAQ.question.length) {
					reject('Question cannot be blank')
				} else if (!usersFAQVue.newFAQ.answer.length) {
					reject('Answer cannot be blank')
				} else if (!usersFAQVue.newFAQ.external_link.length) {
					reject('External link cannot be blank')
				} else if (
					usersFAQVue.newFAQ.cta_type &&
					!usersFAQVue.newFAQ.cta_value
				) {
					reject('Call to action value cannot be blank')
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
		createUserFAQ (event) {
			var disabledButton = GlobalFunctions.disableButton(event)
			var usersFAQVue = this

			this.clearCreateFAQError()
			return usersFAQVue
				.validateFAQData()
				.then(response => {
					usersFAQVue.creating = true
					FAQFunctions.createUserFAQ(
						usersFAQVue.newFAQ,
						usersFAQVue.$root.appId,
						usersFAQVue.$root.appSecret,
						usersFAQVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								usersFAQVue.newFAQ.id = response.payload.new_faq_id
								usersFAQVue.faqs.push(usersFAQVue.newFAQ)
								usersFAQVue.showAlert()
								usersFAQVue.resetForm()
								disabledButton.complete()
							} else {
								usersFAQVue.createFAQError = response.message
								disabledButton.cancel()
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create the FAQ',
								errorName: 'createFAQError',
								vue: usersFAQVue
							})
						})
						.finally(() => {
							usersFAQVue.creating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					usersFAQVue.createFAQError = reason
					window.scrollTo(0, 0)
					disabledButton.cancel()
					throw reason
				})
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'User FAQ has been successfully added!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(
				() => {
					// do nothing
				},
				dismiss => {
					// do nothing
				}
			)
		},
		/**
		 * To prompt the backend call that updates a user FAQ.
		 * @function
		 * @param {object} faq - The selected FAQ object.
		 * @returns {undefined}
		 */
		editFAQ (faq) {
			this.showEditFAQModal = true
			this.selectedFAQId = faq.id
		},
		/**
		 * To close the modal to edit user FAQs.
		 * @function
		 * @returns {undefined}
		 */
		closeEditStoreFAQModal () {
			this.showEditFAQModal = false
		},
		/**
		 * To close the modal and highlight the recently updated user faq.
		 * @function
		 * @returns {undefined}
		 */
		highlightFAQ () {
			this.getUserFAQs()
			this.showEditFAQModal = false
			this.$swal({
				title: 'Success',
				text: 'Question saved',
				type: 'success',
				confirmButtonText: 'OK'
			})
		}
	},
	components: {
		Breadcrumb,
		EditUserFaq,
		NoResults,
		LoadingScreen
	}
}
</script>
<style scoped>
.grey-label {
  color: rgb(136, 136, 136);
  font-size: 13px;
  margin-bottom: 5px;
}
.animated {
  animation: listItemHighlight 1s 2 ease-in-out both;
}
</style>

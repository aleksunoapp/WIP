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
        <div class="margin-top-20">
			<div class="portlet box blue-hoki">
				<div class="portlet-title bg-blue-chambray" @click="toggleCreateFAQPanel()">
					<div class="caption">
						<i class="fa fa-plus-circle"></i>
						Post A Question
					</div>
					<div class="tools">
						<a :class="{'expand': !createFAQCollapse, 'collapse': createFAQCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body fixed-height" :class="{'display-hide': createFAQCollapse}">
	      			<form role="form" @submit.prevent="createUserFAQ($event)">
	      				<div class="alert alert-danger" v-if="createFAQError.length">
	      				    <button class="close" data-close="alert" @click="clearCreateFAQError()"></button>
	      				    <span>{{createFAQError}}</span>
	      				</div>
	      				<div class="col-md-6">
	      					<div class="form-group form-md-line-input form-md-floating-label">
	      					    <input type="text" class="form-control input-sm" id="form_control_1" v-model="newFAQ.question" :class="{'edited': newFAQ.question.length}">
	      					    <label for="form_control_1">Question</label>
	      					</div>
	      					<div class="form-group form-md-line-input form-md-floating-label">
	      					    <textarea class="form-control input-sm" rows="5" v-model="newFAQ.answer" :class="{'edited': newFAQ.answer.length}" id="form_control_2"></textarea>
	      					    <label for="form_control_2">Answer</label>
	      					</div>
	      				</div>
	      				<div class="col-md-6">
	      					<div class="form-group form-md-line-input form-md-floating-label">
	      					    <input type="text" class="form-control input-sm" id="form_control_3" v-model="newFAQ.external_link" :class="{'edited': newFAQ.external_link.length}">
	      					    <label for="form_control_3">External Link</label>
	      					</div>
	      				</div><br>
	      				<div class="clear form-actions right">
	      					<button type="button" class="btn btn-default" @click="resetForm()"> Reset Form</button>
	      					<button type="submit" class="btn blue">Save</button>
	      				</div>
	      			</form>
	      		</div>
	      	</div>
        </div>
        <div class="margin-top-20">
	        <div class="relative-block">
  				<div class="portlet light portlet-fit bordered">
                    <div class="portlet-title bg-blue-chambray">
    		        	<div class="menu-image-main">
    		        		<img src="../../../../static/client_logo.png">
    		        	</div>
    		            <div class="caption">
    		                <span class="caption-subject font-green bold uppercase">User FAQs</span>
                            <div class="caption-desc font-grey-cascade">Click on the edit button to edit the questions and answers.</div>
    		            </div>
    		        </div>
                    <div class="portlet-body">
                        <div class="timeline" v-if="faqs.length">
                            <div class="timeline-item" v-for="faq in faqs">
                                <div class="timeline-badge">
                                    <div class="timeline-icon">
            							<i class="font-blue-sharp icon-bubbles"></i>
            						</div>
                                </div>
                                <div class="timeline-body" :id="'faq-' + faq.id">
                                    <div class="timeline-body-arrow"> </div>
                                    <div class="timeline-body-head">
                                        <div class="timeline-body-head-caption">
                                            <a class="timeline-body-title font-blue-madison">{{ faq.question }}</a>
                                        </div>
                                        <div class="timeline-body-head-actions">
                                        	<div class="btn-group">
                                                <button class="btn blue btn-sm" type="button" @click="editFAQ(faq)"> Edit</button>
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
                        	<no-results :show="!faqs.length" :type="'user FAQs'"></no-results>
                        </div>
                    </div>
                    <div class="alert alert-danger" v-if="!faqs.length && errorMessage.length">
                        <button class="close" data-close="alert" @click="clearError()"></button>
                        <span>{{errorMessage}}</span>
                    </div>
                </div>
	        </div>
	    </div>
	    <edit-user-faq v-if="showEditFAQModal" :faqId="selectedFAQId" @closeEditStoreFAQModal="closeEditStoreFAQModal" @highlightFAQ="highlightFAQ"></edit-user-faq>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import GlobalFunctions from '../../../global'
import FAQFunctions from '../../../controllers/FAQ'
import EditUserFaq from './EditUserFaq'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'FAQ', link: false},
				{name: 'Users FAQ', link: false}
			],
			createFAQCollapse: true,
			createFAQError: '',
			newFAQ: {
				question: '',
				answer: '',
				external_link: '',
				status: 1,
				user_id: this.$root.createdBy
			},
			faqs: [],
			errorMessage: '',
			showEditFAQModal: false,
			selectedFAQId: 0
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
			this.faqs = []
			var usersFAQVue = this
			return FAQFunctions.getUserFAQs(usersFAQVue.$root.appId, usersFAQVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					usersFAQVue.faqs = response.payload
				} else {
					usersFAQVue.errorMessage = response.message
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					usersFAQVue.$router.push('/login/expired')
					return
				}
				usersFAQVue.errorMessage = reason
				window.scrollTo(0, 0)
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
				user_id: this.$root.createdBy
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
			return usersFAQVue.validateFAQData()
			.then(response => {
				FAQFunctions.createUserFAQ(usersFAQVue.newFAQ, usersFAQVue.$root.appId, usersFAQVue.$root.appSecret, usersFAQVue.$root.userToken).then(response => {
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
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						usersFAQVue.$router.push('/login/expired')
						return
					}
					disabledButton.cancel()
					throw reason
				})
			}).catch(reason => {
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
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
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
		 * @param {object} val - The recently updated FAQ object.
		 * @returns {undefined}
		 */
		highlightFAQ (val) {
			this.showEditFAQModal = false
			for (var i = 0; i < this.faqs.length; i++) {
				if (this.faqs[i].id === val.id) {
					this.faqs[i] = val
				}
			}
			$('#faq-' + val.id).addClass('highlight')
			setTimeout(function () {
				$('#faq-' + val.id).removeClass('highlight')
			}, 2000)
		}
	},
	components: {
		Breadcrumb,
		EditUserFaq,
		NoResults
	}
}
</script>
<style scoped>
.fixed-height {
	height: 300px;
}
</style>

<template>
	<modal v-bind:show="showEditFAQModal" effect="fade" @closeOnEscape="closeModal" ref="editModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit FAQ</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-show="errorMessage" ref="errorMessage">
				<button class="close" @click="clearError()"></button>
				<span>{{errorMessage}}</span>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
				<input type="text" class="form-control input-sm edited" id="form_control_1" v-model="faqToBeEdited.question">
				<label for="form_control_1">Question</label>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
				<textarea rows="4" class="form-control edited" id="form_control_2" v-model="faqToBeEdited.answer"></textarea>
				<label for="form_control_2">Answer</label>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
				<input type="text" class="form-control input-sm edited" id="form_control_2" v-model="faqToBeEdited.external_link">
				<label for="form_control_2">External Link</label>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button 
				type="button" 
				class="btn btn-primary" 
				@click="saveEditedStoreFAQ()"
				:disabled="updating">
				Save
				<i 
					v-show="updating"
					class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import FAQFunctions from '../../../controllers/FAQ'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showEditFAQModal: false,
			updating: false,
			faqToBeEdited: {},
			errorMessage: ''
		}
	},
	props: {
		faqId: {
			type: Number,
			default: 0
		}
	},
	created () {
		// get category details by category id passed as route param
		this.getStoreFAQDetails()
	},
	mounted () {
		this.showEditFAQModal = true
	},
	methods: {
		/**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateFAQData () {
			var editFAQVue = this
			return new Promise(function (resolve, reject) {
				if (!editFAQVue.faqToBeEdited.question.length) {
					reject('Question cannot be blank')
				} else if (!editFAQVue.faqToBeEdited.answer.length) {
					reject('Answer cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To get the details of the category to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreFAQDetails () {
			var editFAQVue = this
			FAQFunctions.getStoreFAQDetails(editFAQVue.faqId, editFAQVue.$root.appId, editFAQVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editFAQVue.faqToBeEdited = response.payload
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch FAQ info',
					errorName: 'errorMessage',
					vue: editFAQVue,
					containerRef: 'editModal'
				})
			})
		},
		/**
		 * To prompt the backend call that updates a news feed.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		saveEditedStoreFAQ () {
			var editFAQVue = this
			editFAQVue.clearError()

			return editFAQVue.validateFAQData()
			.then(response => {
				editFAQVue.updating = true
				editFAQVue.faqToBeEdited.user_id = editFAQVue.$root.createdBy
				FAQFunctions.saveEditedStoreFAQ(editFAQVue.faqToBeEdited, editFAQVue.$root.appId, editFAQVue.$root.appSecret, editFAQVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editFAQVue.closeModalAndUpdate()
					} else {
						editFAQVue.errorMessage = response.message
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not save the FAQ',
						errorName: 'errorMessage',
						vue: editFAQVue,
						containerRef: 'editModal'
					})
				}).finally(() => {
					editFAQVue.updating = false
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editFAQVue.errorMessage = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeEditStoreFAQModal')
		},
		/**
		 * To close the modal and update the edited faq.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('highlightFAQ', this.faqToBeEdited)
		}
	},
	components: {
		Modal
	}
}
</script>

<template>
	<modal v-bind:show="showEditFAQModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit FAQ</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
				<button class="close" data-close="alert" @click="clearError()"></button>
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
				<input type="text" class="form-control input-sm edited" id="form_control_3" v-model="faqToBeEdited.external_link">
				<label for="form_control_3">External Link</label>
			</div>
			<div>
				<p class="grey-label">Call to action type</p>
				<el-select v-model="faqToBeEdited.cta_type" placeholder="Select type" size="small" class="margin-bottom-15" id="form_control_cta_type">
					<el-option label="none" value=""></el-option>
					<el-option label="hyperlink" value="hyperlink"></el-option>
					<el-option label="menu item" value="menu_item"></el-option>
					<el-option label="promo code" value="promo_code"></el-option>
					<el-option label="camera" value="camera"></el-option>
					<el-option label="call" value="call"></el-option>
					<el-option label="SMS" value="sms"></el-option>
					<el-option label="video" value="video"></el-option>
				</el-select>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
				<input type="text" class="form-control input-sm" id="form_control_cta_value" v-model="faqToBeEdited.cta_value" :class="{'edited': faqToBeEdited.cta_value.length}">
				<label for="form_control_cta_value">Call to action value</label>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="saveEditedUserFAQ()">Save</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import FAQFunctions from '../../../controllers/FAQ'

export default {
	data () {
		return {
			showEditFAQModal: false,
			faqToBeEdited: {
				question: '',
				answer: '',
				external_link: '',
				cta_type: '',
				cta_value: ''
			},
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
		this.getUserFAQDetails()
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
				} else if (!editFAQVue.faqToBeEdited.external_link.length) {
					reject('External link cannot be blank')
				} else if (editFAQVue.faqToBeEdited.cta_type && !editFAQVue.faqToBeEdited.cta_value) {
					reject('Call to action value cannot be blank')
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
		getUserFAQDetails () {
			var editFAQVue = this
			FAQFunctions.getUserFAQDetails(editFAQVue.faqId, editFAQVue.$root.appId, editFAQVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editFAQVue.faqToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editFAQVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To prompt the backend call that updates a news feed.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		saveEditedUserFAQ () {
			var editFAQVue = this
			editFAQVue.clearError()

			return editFAQVue.validateFAQData()
			.then(response => {
				editFAQVue.faqToBeEdited.user_id = editFAQVue.$root.createdBy
				FAQFunctions.saveEditedUserFAQ(editFAQVue.faqToBeEdited, editFAQVue.$root.appId, editFAQVue.$root.appSecret, editFAQVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editFAQVue.closeModalAndUpdate()
					} else {
						editFAQVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editFAQVue.$router.push('/login/expired')
						return
					}
					editFAQVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editFAQVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
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

<template>
  <modal
    ref="editModal"
    :show="showEditFAQModal"
    effect="fade"
    @closeOnEscape="closeModal"
  >
    <div
      slot="modal-header"
      class="modal-header"
    >
      <button
        type="button"
        class="close"
        @click="closeModal()"
      >
        <span>&times;</span>
      </button>
      <h4 class="modal-title center">
        Edit FAQ
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <div
        v-show="errorMessage"
        ref="errorMessage"
        class="alert alert-danger"
      >
        <button
          class="close"
          @click="clearError()"
        />
        <span>{{ errorMessage }}</span>
      </div>
      <div class="form-group form-md-line-input form-md-floating-label">
        <input
          id="form_control_1"
          v-model="faqToBeEdited.question"
          type="text"
          class="form-control input-sm edited"
        >
        <label for="form_control_1">
          Question
        </label>
      </div>
      <div class="form-group form-md-line-input form-md-floating-label">
        <textarea
          id="form_control_2"
          v-model="faqToBeEdited.answer"
          rows="4"
          class="form-control edited"
        />
        <label for="form_control_2">
          Answer
        </label>
      </div>
      <div class="form-group form-md-line-input form-md-floating-label">
        <input
          id="form_control_3"
          v-model="faqToBeEdited.external_link"
          type="text"
          class="form-control input-sm edited"
        >
        <label for="form_control_3">
          External Link
        </label>
      </div>
      <div>
        <p class="grey-label">
          Call to action type
        </p>
        <el-select
          id="form_control_cta_type"
          v-model="faqToBeEdited.cta_type"
          placeholder="Select type"
          size="small"
          class="margin-bottom-15"
        >
          <el-option
            label="none"
            value=""
          />
          <el-option
            label="email"
            value="email"
          />
          <el-option
            label="locations"
            value="locations"
          />
          <el-option
            label="orders"
            value="orders"
          />
          <el-option
            label="profile"
            value="profile"
          />
          <el-option
            label="payment"
            value="payment"
          />
          <el-option
            label="menus"
            value="menus"
          />
          <el-option
            label="rewards"
            value="rewards"
          />
          <el-option
            label="call"
            value="call"
          />
          <el-option
            label="web"
            value="web"
          />
          <el-option
            label="feedback"
            value="feedback"
          />
        </el-select>
      </div>
      <div class="form-group form-md-line-input form-md-floating-label">
        <input
          id="form_control_cta_value"
          v-model="faqToBeEdited.cta_value"
          type="text"
          class="form-control input-sm"
          :class="{'edited': faqToBeEdited.cta_value.length}"
        >
        <label for="form_control_cta_value">
          Call to action value
        </label>
      </div>
      <div
        v-if="!loadingCountries"
        class="margin-top-20"
      >
        <label>
          Country:
          <el-select
            v-model="faqToBeEdited.country_id"
            placeholder="Select a country"
            size="small"
            no-data-text="No countries"
            remote
            :loading="loadingCountries"
          >
            <el-option
              v-for="country in countries"
              :key="country.id"
              :label="country.name"
              :value="country.id"
            />
          </el-select>
        </label>
      </div>
      <div class="margin-top-20">
        <label>
          Platform:
          <el-select
            v-model="faqToBeEdited.platform_id"
            placeholder="Select a platform"
            size="small"
            no-data-text="No platforms"
            remote
            :loading="loadingPlatforms"
          >
            <el-option
              v-for="platform in platforms"
              :key="platform.id"
              :label="platform.name"
              :value="platform.id"
            />
          </el-select>
        </label>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        type="button"
        class="btn btn-primary"
        :disabled="updating"
        @click="saveEditedUserFAQ()"
      >
        Save
        <i
          v-show="updating"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from '../../modules/Modal'
import FAQFunctions from '../../../controllers/FAQ'
import ajaxErrorHandler from '@/controllers/ErrorController'
import CountriesFunctions from '@/controllers/Countries'
import PlatformsFunctions from '@/controllers/Platforms'

export default {
	components: {
		Modal
	},
	props: {
		faqId: {
			type: Number,
			default: 0
		}
	},
	data () {
		return {
			showEditFAQModal: false,
			updating: false,
			faqToBeEdited: {
				question: '',
				answer: '',
				external_link: '',
				cta_type: '',
				cta_value: ''
			},
			errorMessage: '',
			loadingCountries: false,
			countries: [],
			loadingPlatforms: false,
			platforms: []
		}
	},
	created () {
		// get category details by category id passed as route param
		this.getUserFAQDetails()
		this.getCountries()
		this.getPlatforms()
	},
	mounted () {
		this.showEditFAQModal = true
	},
	methods: {
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
						_this.countries = response.payload
						_this.$nextTick(function () {
							_this.loadingCountries = false
						})
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
						vue: _this,
						containerRef: 'editModal'
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
						vue: _this,
						containerRef: 'editModal'
					})
				})
		},
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
				} else if (
					editFAQVue.faqToBeEdited.cta_type &&
					!editFAQVue.faqToBeEdited.cta_value
				) {
					reject('Call to action value cannot be blank')
				} else if (editFAQVue.faqToBeEdited.country_id === null) {
					reject('Select a country')
				} else if (editFAQVue.faqToBeEdited.platform_id === null) {
					reject('Select a platform')
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
			FAQFunctions.getUserFAQDetails(
				editFAQVue.faqId,
				editFAQVue.$root.appId,
				editFAQVue.$root.appSecret
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editFAQVue.faqToBeEdited = response.payload
					}
				})
				.catch(reason => {
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
		saveEditedUserFAQ () {
			var editFAQVue = this
			editFAQVue.clearError()

			return editFAQVue
				.validateFAQData()
				.then(response => {
					editFAQVue.updating = true
					editFAQVue.faqToBeEdited.user_id = editFAQVue.$root.createdBy
					FAQFunctions.saveEditedUserFAQ(
						editFAQVue.faqToBeEdited,
						editFAQVue.$root.appId,
						editFAQVue.$root.appSecret,
						editFAQVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								editFAQVue.closeModalAndUpdate(response.payload)
							} else {
								editFAQVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not save the FAQ',
								errorName: 'errorMessage',
								vue: editFAQVue,
								containerRef: 'editModal'
							})
						})
						.finally(() => {
							editFAQVue.updating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					editFAQVue.errorMessage = reason
					editFAQVue.$scrollTo(
						editFAQVue.$refs.errorMessage,
						1000,
						{
							container: editFAQVue.$refs.editModal.$el
						}
					)
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
		 * @param {object} payload - Payload of the update response
		 * @returns {undefined}
		 */
		closeModalAndUpdate (payload = {}) {
			this.$emit('highlightFAQ', payload)
		}
	}
}
</script>

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
          id="form_control_2"
          v-model="faqToBeEdited.external_link"
          type="text"
          class="form-control input-sm edited"
        >
        <label for="form_control_2">
          External Link
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
        @click="saveEditedStoreFAQ()"
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
      faqToBeEdited: {},
      errorMessage: '',
      loadingCountries: false,
      countries: [],
      loadingPlatforms: false,
      platforms: []
    }
  },
  created () {
    // get category details by category id passed as route param
    this.getStoreFAQDetails()
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
		 * To check if the data is valid before submitting to the backend.
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
    getStoreFAQDetails () {
      var editFAQVue = this
      FAQFunctions.getStoreFAQDetails(
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
    saveEditedStoreFAQ () {
      var editFAQVue = this
      editFAQVue.clearError()

      return editFAQVue
        .validateFAQData()
        .then(response => {
          editFAQVue.updating = true
          editFAQVue.faqToBeEdited.user_id = editFAQVue.$root.createdBy
          FAQFunctions.saveEditedStoreFAQ(
            editFAQVue.faqToBeEdited,
            editFAQVue.$root.appId,
            editFAQVue.$root.appSecret,
            editFAQVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                editFAQVue.closeModalAndUpdate()
                editFAQVue.showEditSuccess(response.payload)
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
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showEditSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Store FAQ has been saved'
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
		 * To close the modal and update the edited faq.
		 * @function
		 * @returns {undefined}
		 */
    closeModalAndUpdate () {
      this.$emit('updateFAQ')
    }
  }
}
</script>

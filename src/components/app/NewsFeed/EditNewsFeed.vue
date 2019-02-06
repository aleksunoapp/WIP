<template>
  <modal
    ref="modal"
    :show="showEditFeedModal"
    effect="fade"
    @closeOnEscape="closeModal"
  >
    <div
      slot="modal-header"
      class="modal-header center"
    >
      <button
        type="button"
        class="close"
        @click="closeModal()"
      >
        <span>&times;</span>
      </button>
      <h4
        v-if="!selectImageMode"
        class="modal-title center"
      >
        Edit News Feed
      </h4>
      <h4
        v-else
        class="modal-title center"
      >
        Select An Image
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <div class="col-xs-12">
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
        <div :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
          <resource-picker
            :image-button="true"
            :image-url="newsToBeEdited.image"
            class="margin-top-15"
            @open="goToPageTwo()"
            @close="goToPageOne()"
            @selected="updateImage"
          />
        </div>
        <div
          v-show="!selectImageMode"
          class="col-md-12"
        >
          <fieldset :disabled="$root.permissions['news_feed read'] && !$root.permissions['news_feed update']">
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_1"
                v-model="newsToBeEdited.title"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_1">
                News Feed Title
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_2"
                v-model="newsToBeEdited.short_description"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_2">
                Short Description
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_external_url_edit"
                v-model="newsToBeEdited.external_url"
                type="text"
                class="form-control input-sm edited"
              >
              <label for="form_control_external_url_edit">
                Link
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <textarea
                id="form_control_3"
                v-model="newsToBeEdited.body"
                rows="5"
                class="form-control edited"
              />
              <label for="form_control_3">
                News Feed Body
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-if="!selectImageMode && $root.permissions['news_feed read'] && !$root.permissions['news_feed update']"
        type="button"
        class="btn btn-primary"
        @click="closeModal()"
      >
        Close
      </button>
      <button
        v-if="!selectImageMode && $root.permissions['news_feed update']"
        type="button"
        class="btn btn-primary"
        :disabled="updating"
        @click="saveEditedFeed()"
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
import NewsFeedFunctions from '../../../controllers/NewsFeed'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal,
    ResourcePicker
  },
  props: {
    selectedFeedId: {
      type: Number
    }
  },
  data () {
    return {
      showEditFeedModal: false,
      newsToBeEdited: {
        image: ''
      },
      updating: false,
      errorMessage: '',
      selectImageMode: false
    }
  },
  created () {
    // get category details by category id passed as route param
    this.getNewsFeedDetails()
  },
  mounted () {
    this.showEditFeedModal = true
  },
  methods: {
    /**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateFeedData () {
      var editNewsFeedVue = this
      return new Promise(function (resolve, reject) {
        if (!editNewsFeedVue.newsToBeEdited.title.length) {
          reject('News Feed title cannot be blank')
        } else if (!editNewsFeedVue.newsToBeEdited.short_description.length) {
          reject('News Feed description cannot be blank')
        } else if (!editNewsFeedVue.newsToBeEdited.image.length) {
          reject('News Feed image URL cannot be blank')
        } else if (!editNewsFeedVue.newsToBeEdited.body.length) {
          reject('News Feed body cannot be blank')
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
    getNewsFeedDetails () {
      var editNewsFeedVue = this
      NewsFeedFunctions.getNewsFeedDetails(
        editNewsFeedVue.selectedFeedId,
        editNewsFeedVue.$root.userToken,
        editNewsFeedVue.$root.appId,
        editNewsFeedVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            editNewsFeedVue.newsToBeEdited = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch feed info',
            errorName: 'errorMessage',
            vue: editNewsFeedVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To prompt the backend call that updates a news feed.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    saveEditedFeed () {
      var editNewsFeedVue = this
      editNewsFeedVue.clearError()

      return editNewsFeedVue
        .validateFeedData()
        .then(response => {
          editNewsFeedVue.updating = true
          NewsFeedFunctions.saveEditedFeed(
            editNewsFeedVue.newsToBeEdited,
            editNewsFeedVue.$root.userToken,
            editNewsFeedVue.$root.appId,
            editNewsFeedVue.$root.appSecret
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                editNewsFeedVue.showEditSuccess(response.payload)
                editNewsFeedVue.closeModalAndUpdate()
              } else {
                editNewsFeedVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the news feed',
                errorName: 'errorMessage',
                vue: editNewsFeedVue,
                containerRef: 'modal'
              })
            })
            .finally(() => {
              editNewsFeedVue.updating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          editNewsFeedVue.errorMessage = reason
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
    showEditSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The News Feed has been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The changes have been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeEditFeedModal')
    },
    closeModalAndUpdate () {
      this.$emit('updateNewsFeed', this.newsToBeEdited)
    },
    /**
		 * To change the page to the gallery view on the modal.
		 * @function
		 * @returns {undefined}
		 */
    goToPageTwo () {
      this.selectImageMode = true
    },
    /**
		 * To change the page to the main/form view on the modal.
		 * @function
		 * @returns {undefined}
		 */
    goToPageOne () {
      this.selectImageMode = false
    },
    /**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
    updateImage (val) {
      this.goToPageOne()
      this.newsToBeEdited.image = val.image_url
    }
  }
}
</script>

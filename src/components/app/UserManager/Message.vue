<template>
  <modal
    ref="modal"
    :show="messageModalDisplayed"
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
        New Notification
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <div class="row">
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
        </div>
        <div
          v-show="!selectImageMode"
          class="col-xs-12"
        >
          <div class="form-group form-md-line-input form-md-floating-label">
            <label
              class="btn blue btn-outline"
              for="push_notification"
              :class="{'active': message.notification_type === 'push'}"
            >
              <input
                id="push_notification"
                v-model="message.notification_type"
                type="radio"
                class="toggle"
                value="push"
              > Push Notification
            </label>
            <label
              class="btn blue btn-outline"
              for="inapp_notification"
              :class="{'active': message.notification_type === 'inapp'}"
            >
              <input
                id="inapp_notification"
                v-model="message.notification_type"
                type="radio"
                class="toggle"
                value="inapp"
              > In App Notification
            </label>
            <!-- <label class="btn blue btn-outline"
						       for="sms_notification"
						       :class="{'active': message.notification_type === 'sms'}">
							<input type="radio"
							       class="toggle"
							       id="sms_notification"
							       value="sms"
							       v-model="message.notification_type"> SMS
						</label> -->
          </div>
        </div>
        <div
          v-if="message.notification_type === 'inapp'"
          :class="{'col-xs-4 col-xs-offset-4' : !selectImageMode, 'col-xs-12' : selectImageMode}"
        >
          <resource-picker
            :image-button="true"
            :image-url="message.media_path"
            class="margin-top-15"
            @open="toggleImageMode()"
            @close="toggleImageMode()"
            @selected="updateIcon"
          />
        </div>
        <div
          v-show="!selectImageMode"
          class="col-xs-12"
        >
          <div
            v-if="message.notification_type === 'push'"
            class="form-group form-md-line-input form-md-floating-label"
          >
            <input
              id="form_control_1"
              v-model="message.title"
              type="text"
              class="form-control input-sm"
              :class="{'edited': message.title.length}"
            >
            <label for="form_control_1">
              Title
            </label>
          </div>
          <div
            v-if="message.notification_type === 'push'"
            class="form-group form-md-line-input form-md-floating-label"
          >
            <input
              id="form_control_2"
              v-model="message.message"
              type="text"
              class="form-control input-sm"
              :class="{'edited': message.message.length}"
            >
            <label for="form_control_2">
              Message
            </label>
          </div>
          <div
            v-if="message.notification_type === 'inapp'"
            class="form-group form-md-line-input form-md-floating-label"
          >
            <input
              id="form_control_3"
              v-model="message.title"
              type="text"
              class="form-control input-sm"
              :class="{'edited': message.title.length}"
            >
            <label for="form_control_3">
              Title
            </label>
          </div>
          <div
            v-if="message.notification_type === 'inapp'"
            class="form-group form-md-line-input form-md-floating-label"
          >
            <input
              id="form_control_4"
              v-model="message.push_message"
              type="text"
              class="form-control input-sm"
              :class="{'edited': message.push_message.length}"
            >
            <label for="form_control_4">
              Push message
            </label>
          </div>
          <div
            v-if="message.notification_type === 'inapp'"
            class="form-group form-md-line-input form-md-floating-label"
          >
            <input
              id="form_control_5"
              v-model="message.message"
              type="text"
              class="form-control input-sm"
              :class="{'edited': message.message.length}"
            >
            <label for="form_control_5">
              Body
            </label>
          </div>
          <div
            v-if="message.notification_type === 'push'"
            class="form-group form-md-line-input form-md-floating-label"
          >
            <el-date-picker
              v-model="message.expire_at"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="false"
              placeholder="Expires on"
            />
          </div>
          <el-dropdown
            v-if="message.notification_type === 'inapp'"
            size="mini"
            :show-timeout="50"
            :hide-timeout="50"
            class="margin-top-15"
            @command="updateCallToAction"
          >
            <el-button size="mini">
              {{ selectedCallLabel }}
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="action in omaActions"
                :key="action.id"
                :command="action.id"
              >
                {{ action.value }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div
            v-if="message.call_to_action === 'CALL' || message.call_to_action === 'GOTO_LINK'"
            class="form-group form-md-line-input form-md-floating-label margin-top-10"
          >
            <input
              id="form_control_6"
              v-model="message.action_value"
              type="text"
              class="form-control input-sm edited"
            >
            <label for="form_control_6">
              {{ numberOrUrl }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-if="!selectImageMode && message.notification_type.length"
        type="button"
        class="btn btn-primary"
        :disabled="sending"
        @click="sendMessage()"
      >
        Send
        <i
          v-show="sending"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../modules/Modal'
import MessageFunctions from '../../../controllers/Message'
import ButtonGroup from '../../modules/ButtonGroup'
import Checkbox from '../../modules/Checkbox'
import Dropdown from '../../modules/Dropdown'
import ResourcePicker from '../../modules/ResourcePicker'
import GlobalFunctions from '../../../global.js'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	components: {
		Modal,
		ButtonGroup,
		Checkbox,
		ResourcePicker,
		Dropdown
	},
	props: ['userId'],
	data () {
		return {
			messageModalDisplayed: false,
			errorMessage: '',
			message: {
				notification_type: '',
				push_message: '',
				title: '',
				message: '',
				payload: {},
				is_sdk_notification: '1',
				media_id: '',
				media_path: '',
				mime_type: 'image/jpg',
				call_to_action: '',
				app_action_id: '',
				action_value: '',
				expire_at: null
			},
			selectImageMode: false,
			sending: false,
			imageMode: {
				newMenu: false
			},
			omaActions: GlobalFunctions.messageAction
		}
	},
	computed: {
		numberOrUrl () {
			if (this.message.call_to_action === 'CALL') {
				return 'Enter number'
			} else if (this.message.call_to_action === 'GOTO_LINK') {
				return 'Enter link'
			}
		},
		selectedCallLabel () {
			if (this.message.call_to_action === '') {
				return 'Choose call to action'
			} else if (this.message.call_to_action === 'GOTO_LINK') {
				return 'Website'
			} else if (this.message.call_to_action === 'CAMERA') {
				return 'Camera'
			} else if (this.message.call_to_action === 'CALL') {
				return 'Call'
			} else if (this.message.call_to_action === 'CLOSE') {
				return 'Close'
			} else if (this.message.call_to_action === 'RATE_US') {
				return 'Rate Us'
			}
		}
	},
	mounted () {
		this.messageModalDisplayed = true
		$('body').off('click', '.el-date-editor')
		$('body').on('click', '.el-date-editor', function () {
			$('.el-date-picker').css('z-index', '10501')
			$('.el-time-panel').css('z-index', '10501')
			$('.time-select').css('z-index', '10501')
		})
	},
	methods: {
		/**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @returns {undefined}
		 */
		toggleImageMode () {
			this.selectImageMode = !this.selectImageMode
		},
		/**
		 * To reset the message form
		 * @function
		 * @returns {undefined}
		 */
		resetForm () {
			this.message.notification_type = ''
			this.message.push_message = ''
			this.message.title = ''
			this.message.message = ''
			this.message.payload = {}
			this.message.is_sdk_notification = '1'
			this.message.media_id = ''
			this.message.media_path = ''
			this.message.mime_type = 'image/jpg'
			this.message.call_to_action = ''
			this.message.app_action_id = ''
			this.message.action_value = ''
		},
		/**
		 * To check if the message information is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateMessageData () {
			var messageVue = this
			return new Promise(function (resolve, reject) {
				if (!messageVue.message.notification_type) {
					reject('Please choose notification type')
				} else if (
					messageVue.message.notification_type === 'push' &&
					!messageVue.message.title
				) {
					reject('Title cannot be blank')
				} else if (
					messageVue.message.notification_type === 'push' &&
					!messageVue.message.message
				) {
					reject('Message cannot be blank')
				} else if (
					messageVue.message.notification_type === 'inapp' &&
					!messageVue.message.title
				) {
					reject('Title cannot be blank')
				} else if (
					messageVue.message.notification_type === 'inapp' &&
					!messageVue.message.push_message
				) {
					reject('Message cannot be blank')
				} else if (
					messageVue.message.notification_type === 'inapp' &&
					!messageVue.message.message
				) {
					reject('Body cannot be blank')
				} else if (
					!messageVue.userId.length &&
					!messageVue.userId.toString().length
				) {
					reject('Please select at least one user')
				} else if (
					messageVue.message.notification_type === 'inapp' &&
					!messageVue.message.call_to_action
				) {
					reject('Please select a call to action')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To prompt the backend call that sends the message.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		sendMessage (event) {
			var messageVue = this
			this.errorMessage = ''
			return messageVue
				.validateMessageData()

				.then(response => {
					if (messageVue.sending) {
						return
					}
					messageVue.sending = true
					MessageFunctions.sendMessage(
						{
							...messageVue.message,
							user_alias: messageVue.userId
						},
						GlobalFunctions.messageAppToken
					)
						.then(response => {
							if (
								response.code === 200 &&
								response.status === 'ok'
							) {
								messageVue.closeModal()
								messageVue.showAlert(response.payload.warnings)
							} else {
								messageVue.createFAQError = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not send the notification',
								errorName: 'errorMessage',
								vue: messageVue,
								containerRef: 'modal'
							})
						})
						.finally(() => {
							messageVue.sending = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					messageVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
		},
		updateCallToAction (id) {
			let type
			this.omaActions.forEach(function (action) {
				if (id === action.id) {
					type = action.type
				}
			})
			this.message.call_to_action = type
			this.message.app_action_id = id
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateIcon (val) {
			this.message.media_path = val.image_url
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
		 * To return to the main form
		 * @function
		 * @returns {undefined}
		 */
		exitImageMode () {
			this.selectImageMode = false
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeMessageModal')
			this.resetForm()
		},
		/**
		 * To generate alert text
		 * @function
		 * @param {array} warnings - The array of warnings received after message was sent.
		 * @returns {undefined}
		 */
		alertText (warnings) {
			if (warnings.length) {
				let messageVue = this
				if (!Array.isArray(messageVue.userId)) {
					return 'This user has no device. The message was not delivered.'
				} else {
					return 'Some users in the recipient list have no device and did not receive the message.'
				}
			} else {
				return 'Message sent'
			}
		},
		/**
		 * To alert the user that the message has been successfully sent.
		 * @function
		 * @param {array} warnings - The array of warnings received after message was sent.
		 * @returns {undefined}
		 */
		showAlert (warnings) {
			let alertTitle = warnings.length ? 'Warning' : 'Success!'
			let alertText = this.alertText(warnings)
			let alertType = warnings.length ? 'warning' : 'success'

			this.$swal({
				title: alertTitle,
				text: alertText,
				type: alertType,
				confirmButtonText: 'OK'
			}).then(
				() => {
					// do nothing
				},
				dismiss => {
					// do nothing
				}
			)
		}
	}
}
</script>

<style>
.form-md-floating-label .active {
	background-color: white;
}
.el-dropdown-menu.el-popper.el-dropdown-menu--mini {
	z-index: 10501 !important;
}
</style>

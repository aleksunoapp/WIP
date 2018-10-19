<template>
	<modal :show="isOpen"
	       effect="fade"
	       @closeOnEscape="closeModal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center"
			    v-if="!selectImageMode">New Notification</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div v-if="selectUsersMode">
				<div class="form-group form-md-line-input form-md-floating-label">
					<div class="input-icon right">
						<input v-model="searchString"
						       type="text"
						       class="form-control input-sm"
						       :class="{'edited': searchString.length}"
						       id="form_control_search">
						<i class="fa fa-times-circle-o clickable"
						   @click.stop.prevent="clearSearch()"
						   aria-hidden="true"></i>
						<label for="form_control_search">Search</label>
					</div>
				</div>
				<table class="table">
					<thead>
						<tr>
							<th class="th-checkboxes">
								<div class="md-checkbox">
									<input type="checkbox"
									       v-model="allUsersSelected"
									       :id="`user-all`"
									       class="md-check"
									       @change="toggleSelectAll(allUsersSelected)">
									<label :for="`user-all`">
										<span class="inc"></span>
										<span class="check"></span>
										<span class="box"></span>
									</label>
								</div>
							</th>
							<th class="th-email"> Email </th>
							<th class="th-phone"> Phone </th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="user in usersOnCurrentPage"
						    :key="user.id">
							<td class="td-checkboxes">
								<div class="md-checkbox">
									<input type="checkbox"
									       v-model="user.selected"
									       :id="`user-${user.id}`"
									       class="md-check"
									       :value="user.id"
									       @change="syncSelectAll(user.selected)">
									<label :for="`user-${user.id}`">
										<span class="inc"></span>
										<span class="check"></span>
										<span class="box"></span>
									</label>
								</div>
							</td>
							<td class="td-email"> {{ user.email }} </td>
							<td class="td-phone"> {{ formatPhone(user.phone) }} </td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="page-one"
			     v-if="!selectUsersMode">
				<div class="alert alert-danger"
				     v-if="errorMessage.length">
					<button class="close"
					        data-close="alert"
					        @click="clearError()"></button>
					<span>{{errorMessage}}</span>
				</div>
				<p>Message will be sent to
					<a @click="showUserSelect()">{{message.user_alias.length}} user<span v-show="message.user_alias.length !== 1">s</span>
					</a>.</p>
				<div class="form-group form-md-line-input form-md-floating-label">
					<label class="btn blue btn-outline"
					       for="push_notification"
					       :class="{'active': message.notification_type === 'push'}">
						<input type="radio"
						       class="toggle"
						       id="push_notification"
						       value="push"
						       v-model="message.notification_type"> Push Notification
					</label>
					<label class="btn blue btn-outline"
					       for="inapp_notification"
					       :class="{'active': message.notification_type === 'inapp'}">
						<input type="radio"
						       class="toggle"
						       id="inapp_notification"
						       value="inapp"
						       v-model="message.notification_type"> In App Notification
					</label>
				</div>
				<div class="row"
				     v-if="message.notification_type === 'inapp'">
					<div :class="{'col-xs-4 col-xs-offset-4' : !selectImageMode, 'col-xs-12' : selectImageMode}">
						<resource-picker @open="toggleImageMode('selectImageMode', true)"
						                 @close="toggleImageMode('selectImageMode', false)"
						                 @selected="updateIcon"
						                 :imageButton="true"
						                 :imageUrl="message.media_path"
						                 class="margin-top-15">
						</resource-picker>
					</div>
				</div>
				<div v-show="!selectImageMode">
					<div v-if="message.notification_type === 'push'"
					     class="form-group form-md-line-input form-md-floating-label">
						<input type="text"
						       class="form-control input-sm"
						       :class="{'edited': message.title.length}"
						       id="form_control_1"
						       v-model="message.title">
						<label for="form_control_1">Title</label>
					</div>
					<div v-if="message.notification_type === 'push'"
					     class="form-group form-md-line-input form-md-floating-label">
						<input type="text"
						       class="form-control input-sm"
						       :class="{'edited': message.message.length}"
						       id="form_control_2"
						       v-model="message.message">
						<label for="form_control_2">Message</label>
					</div>
					<div v-if="message.notification_type === 'inapp'"
					     class="form-group form-md-line-input form-md-floating-label">
						<input type="text"
						       class="form-control input-sm"
						       :class="{'edited': message.title.length}"
						       id="form_control_3"
						       v-model="message.title">
						<label for="form_control_3">Title</label>
					</div>
					<div v-if="message.notification_type === 'inapp'"
					     class="form-group form-md-line-input form-md-floating-label">
						<input type="text"
						       class="form-control input-sm"
						       :class="{'edited': message.push_message.length}"
						       id="form_control_4"
						       v-model="message.push_message">
						<label for="form_control_4">Push message</label>
					</div>
					<div v-if="message.notification_type === 'inapp'"
					     class="form-group form-md-line-input form-md-floating-label">
						<input type="text"
						       class="form-control input-sm"
						       :class="{'edited': message.message.length}"
						       id="form_control_5"
						       v-model="message.message">
						<label for="form_control_5">Body</label>
					</div>
					<div v-if="message.notification_type === 'push'"
					     class="form-group form-md-line-input form-md-floating-label">
						<el-date-picker v-model="message.expire_at"
						                type="date"
						                format="yyyy-MM-dd"
						                value-format="yyyy-MM-dd"
						                :clearable="false"
						                placeholder="Expires on">
						</el-date-picker>
					</div>
					<el-dropdown v-if="message.notification_type === 'inapp'"
					             @command="updateCallToAction"
					             size="mini"
					             :show-timeout="50"
					             :hide-timeout="50"
					             class="margin-top-15">
						<el-button size="mini">
							{{ selectedCallLabel }}
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command="29">
								Call
							</el-dropdown-item>
							<el-dropdown-item :command="26">
								Website
							</el-dropdown-item>
							<el-dropdown-item :command="25">
								Close
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<div v-if="message.call_to_action === 'CALL' || message.call_to_action === 'GOTO_LINK'"
					     class="form-group form-md-line-input form-md-floating-label margin-top-10">
						<input type="text"
						       class="form-control input-sm edited"
						       id="form_control_6"
						       v-model="message.action_value">
						<label for="form_control_6">{{ numberOrUrl }}</label>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<div class="footer-wrapper"
			     v-if="selectUsersMode">
				<el-pagination class="inline-block pagination-center"
				               small
				               layout="prev, pager, next"
				               :page-count="Math.ceil(users.length / 10)"
				               @current-change="changeCurrentPage">
				</el-pagination>
				<button type="button"
				        class="btn blue"
				        @click="selectUsers()">Select</button>
			</div>
			<button v-if="!selectUsersMode && !selectImageMode && message.notification_type.length"
			        type="button"
			        class="btn btn-primary"
			        @click="sendMessage()">Send</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import MessageFunctions from '../../../controllers/Message'
import ButtonGroup from '../../modules/ButtonGroup'
import Checkbox from '../../modules/Checkbox'
import Dropdown from '../../modules/Dropdown'
import ResourcePicker from '../../modules/ResourcePicker'
import GlobalFunctions from '../../../global.js'

export default {
	data () {
		return {
			selectUsersMode: true,
			selectImageMode: false,
			errorMessage: '',
			message: {
				user_alias: [],
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
			sending: false,
			currentPage: 1,
			allUsersSelected: false,
			searchString: ''
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
			}
		},
		searchedUsers () {
			if (this.searchString) {
				return this.users.filter(user => {
					return (
						user.email.includes(this.searchString) ||
						user.phone.replace(/\D/g, '').includes(this.searchString)
					)
				})
			} else {
				return this.users
			}
		},
		usersOnCurrentPage () {
			let begin = (this.currentPage - 1) * 10
			let end = this.currentPage * 10
			return this.searchedUsers.slice(begin, end)
		}
	},
	props: {
		isOpen: {
			type: Boolean,
			required: true,
			default: () => false
		},
		users: {
			type: Array,
			required: true,
			default: () => []
		}
	},
	methods: {
		/**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @param {string} object - The name of the object the image is for
		 * @param {object} value - The open / closed value of the picker
		 * @returns {undefined}
		 */
		toggleImageMode (object, value) {
			this[object] = value
		},
		/**
		 * To clear the user search
		 * @function
		 * @returns {undefined}
		 */
		clearSearch () {
			this.searchString = ''
		},
		/**
		 * To display the user selection view
		 * @function
		 * @returns {undefined}
		 */
		showUserSelect () {
			this.selectUsersMode = true
			this.currentPage = 1
		},
		/**
		 * To select the users to send the message to
		 * @function
		 * @returns {undefined}
		 */
		selectUsers () {
			this.selectUsersMode = false
			this.message.user_alias = [
				...this.users.filter(user => user.selected).map(user => user.id)
			]
		},
		/**
		 * To de/select all items
		 * @function
		 * @param {boolean} value - The value of the selection
		 * @returns {undefined}
		 */
		toggleSelectAll (value) {
			this.users.forEach(user => {
				user.selected = value
			})
			this.allUsersSelected = value
		},
		/**
		 * To update the Select All checkbox status.
		 * @function
		 * @param {boolean} value - The value of the checkbox being manipulated
		 * @returns {undefined}
		 */
		syncSelectAll (value) {
			if (!value) {
				this.allUsersSelected = false
			} else if (!this.users.filter(user => !user.selected).length) {
				this.allUsersSelected = true
			}
		},
		/**
		 * To update the current page.
		 * @function
		 * @param {integer} page - The new current page number
		 * @returns {undefined}
		 */
		changeCurrentPage (page) {
			if (this.currentPage !== page) {
				this.currentPage = page
			}
		},
		/**
		 * To format a phone number
		 * @function
		 * @param {string} phone - The phone number to format
		 * @returns {string} The formatted phone string
		 */
		formatPhone (phone) {
			try {
				let digits = phone.replace(/\D/g, '')
				return (
					digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
				)
			} catch (err) {
				return 'n/a'
			}
		},
		/**
		 * To reset the message form
		 * @function
		 * @returns {undefined}
		 */
		resetForm () {
			this.users.forEach(user => {
				user.selected = false
			})
			this.selectUsersMode = true
			this.message.user_alias = []
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
				} else if (!messageVue.message.user_alias.length) {
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
					let payload = { ...this.message }
					if (Array.isArray(payload.user_alias)) {
						payload.user_alias = payload.user_alias.toString()
					}
					MessageFunctions.sendMessage(
						payload,
						GlobalFunctions.OMAUsersMessageAppToken
					)
						.then(response => {
							messageVue.sending = false
							if (response.code === 200 && response.status === 'ok') {
								messageVue.closeModal()
								messageVue.showAlert(response.payload.warnings)
							} else {
								messageVue.createFAQError = response.message
							}
						})
						.catch(reason => {
							messageVue.sending = false
							messageVue.errorMessage =
								'Sorry, we could not send the notification'
							window.scrollTo(0, 0)
						})
				})
				.catch(reason => {
					messageVue.sending = false
					messageVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
		},
		/**
		 * To update the call to action
		 * @function
		 * @param {integer} id - The id of the selected call to action
		 * @returns {undefined}
		 */
		updateCallToAction (id) {
			let type
			if (id === 29) {
				type = 'CALL'
			} else if (id === 26) {
				type = 'GOTO_LINK'
			} else if (id === 25) {
				type = 'CLOSE'
			} else if (id === 15) {
				type = 'CAMERA'
			}
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
			this.selectImageMode = !this.selectImageMode
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
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.resetForm()
			this.$emit('closeMessageModal', false)
		},
		/**
		 * To generate alert text
		 * @function
		 * @param {array} warnings - The array of warnings received after message was sent.
		 * @returns {undefined}
		 */
		alertText (warnings) {
			if (warnings.length) {
				if (this.message.user_alias.length < 2) {
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
			})
		}
	},
	components: {
		Modal,
		ButtonGroup,
		Checkbox,
		ResourcePicker,
		Dropdown
	}
}
</script>

<style scoped>
.form-md-floating-label .active {
  background-color: white;
}
.el-dropdown-menu.el-popper.el-dropdown-menu--mini {
  z-index: 10501 !important;
}
.footer-wrapper {
  display: flex;
  justify-content: space-between;
}
.th-checkboxes,
.td-checkboxes {
  max-width: 25px;
}
.th-email,
.td-email {
  width: 300px;
}
.th-phone,
.td-phone {
  max-width: 150px;
}
</style>

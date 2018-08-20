<template>
	<modal :show="showEditGroupModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="modal">
		<div slot="modal-header"
		     class="modal-header">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit User Group</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<form role="form">
				<div class="row">
					<div class="col-md-12">
						<div class="alert alert-danger"
						     v-show="errorMessage"
						     ref="errorMessage">
							<button class="close"
							        @click="clearError()"></button>
							<span>{{errorMessage}}</span>
						</div>
					</div>
					<div class="col-md-12">
						<fieldset :disabled="!$root.permissions['user_manager user_groups update']">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       id="form_control_1"
								       v-model="groupToBeEdited.name"
								       :class="{'edited': groupToBeEdited.name.length}">
								<label for="form_control_1">Group Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       id="form_control_2"
								       v-model="groupToBeEdited.description"
								       :class="{'edited': groupToBeEdited.description.length}">
								<label for="form_control_2">Group Description</label>
							</div>
							<h4 class="margin-top-20">All users with:</h4>
							<div>
								<el-dropdown trigger="click"
								             @command="updateSignUpDate"
								             size="mini"
								             :show-timeout="50"
								             :hide-timeout="50"
								             class="margin-top-15">
									<el-button size="mini">
										{{ selectedSignUpDate }}
										<i class="el-icon-arrow-down el-icon--right"></i>
									</el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item :command="7">
											Signed up in the last 7 days
										</el-dropdown-item>
										<el-dropdown-item :command="14">
											Signed up in the last 14 days
										</el-dropdown-item>
										<el-dropdown-item :command="30">
											Signed up in the last 30 days
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
							<div>
								<el-dropdown trigger="click"
								             @command="updateTotalOrders"
								             size="mini"
								             :show-timeout="50"
								             :hide-timeout="50"
								             class="margin-top-15">
									<el-button size="mini">
										{{ selectedTotalOrders }}
										<i class="el-icon-arrow-down el-icon--right"></i>
									</el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item :command="[10, '<']">
											Less than 10 orders
										</el-dropdown-item>
										<el-dropdown-item :command="[25, '>']">
											More than 25 orders
										</el-dropdown-item>
										<el-dropdown-item :command="[50, '>']">
											More than 50 orders
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
							<div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_3"
									       v-model="city"
									       :class="{'edited': city.length}"
									       v-on:change="addRule('city')">
									<label for="form_control_3">City</label>
								</div>
							</div>
							<div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_4"
									       v-model="province"
									       :class="{'edited': province.length}"
									       v-on:change="addRule('province')">
									<label for="form_control_4">Province</label>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
			</form>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button v-if="!$root.permissions['user_manager user_groups update']"
			        type="button"
			        class="btn btn-primary"
			        @click="closeModal()">
				Close
			</button>
			<button v-else
			        type="button"
			        class="btn btn-primary"
			        @click="updateGroup()"
			        :disabled="updating">
				Save
				<i v-show="updating"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import Dropdown from '../../modules/Dropdown'
import UserGroupsFunctions from '../../../controllers/UserGroups'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showEditGroupModal: false,
			errorMessage: '',
			updating: false,
			city: '',
			province: '',
			groupToBeEdited: {
				brand_id: 0,
				created_at: '',
				created_by: 0,
				description: '',
				id: 0,
				name: '',
				rules: [],
				updated_at: '',
				updated_by: 0
			}
		}
	},
	computed: {
		selectedSignUpDate () {
			let text = 'Select sign-up date'
			if (this.groupToBeEdited.rules.length) {
				for (let i = 0; i < this.groupToBeEdited.rules.length; i++) {
					if (this.groupToBeEdited.rules[i].parameter === 'sign-up-date') {
						text = this.groupToBeEdited.rules[i].text
					}
				}
			}
			return text
		},
		selectedTotalOrders () {
			let text = 'Select total orders'
			if (this.groupToBeEdited.rules.length) {
				for (let i = 0; i < this.groupToBeEdited.rules.length; i++) {
					if (this.groupToBeEdited.rules[i].parameter === 'total-orders') {
						text = this.groupToBeEdited.rules[i].text
					}
				}
			}
			return text
		}
	},
	props: {
		passedGroup: {
			type: Object
		}
	},
	mounted () {
		this.groupToBeEdited.brand_id = this.passedGroup.brand_id
		this.groupToBeEdited.created_at = this.passedGroup.created_at
		this.groupToBeEdited.created_by = this.passedGroup.created_by
		this.groupToBeEdited.description = this.passedGroup.description
		this.groupToBeEdited.id = this.passedGroup.id
		this.groupToBeEdited.name = this.passedGroup.name
		this.groupToBeEdited.rules = this.passedGroup.rules
		this.groupToBeEdited.updated_at = this.passedGroup.updated_at
		this.groupToBeEdited.updated_by = this.passedGroup.updated_by

		this.groupToBeEdited.rules = []
		this.showEditGroupModal = true
	},
	methods: {
		/**
		 * To update the total orders rule of the group.
		 * @function
		 * @param {integer} days - The number of days
		 * @returns {undefined}
		 */
		updateSignUpDate (days) {
			if (!this.$root.permissions['user_manager user_groups update']) {
				let rule = {
					parameter: 'sign-up-date',
					value: this.daysBeforeToday(days),
					operator: '>',
					text: `Signed up in the last ${days} days`
				}

				for (let i = 0; i < this.groupToBeEdited.rules.length; i++) {
					if (this.groupToBeEdited.rules[i].parameter === 'sign-up-date') {
						this.groupToBeEdited.rules.splice(i, 1)
					}
				}

				this.groupToBeEdited.rules.push(rule)
			}
		},
		/**
		 * To update the total orders rule of the group.
		 * @function
		 * @param {array} argsArray - An array of [integer, string] where integer is the number of orders and string is the operator
		 * @returns {undefined}
		 */
		updateTotalOrders (argsArray) {
			if (!this.$root.permissions['user_manager user_groups update']) {
				let rule = {
					parameter: 'total-orders',
					value: argsArray[0],
					operator: argsArray[1],
					text: `${argsArray[1] === '<' ? 'Less' : 'More'} than ${
						argsArray[0]
					} orders`
				}

				for (let i = 0; i < this.groupToBeEdited.rules.length; i++) {
					if (this.groupToBeEdited.rules[i].parameter === 'total-orders') {
						this.groupToBeEdited.rules.splice(i, 1)
					}
				}

				this.groupToBeEdited.rules.push(rule)
			}
		},
		daysBeforeToday (days) {
			let date = new Date(new Date().setDate(new Date().getDate() - days))
			let year = date.getFullYear()
			let day = date.getDate()
			let month = date.getMonth() + 1
			if (month < 10) {
				month = '0' + month
			}
			if (day < 10) {
				day = '0' + day
			}
			return year + '-' + month + '-' + day
		},
		updateRule (parameter, value, operator, text) {
			let val = ''
			if (parameter === 'sign-up-date') {
				val = this.daysBeforeToday(value)
			} else {
				val = value
			}
			let rule = {
				parameter: parameter,
				value: val,
				operator: operator,
				text: text
			}

			for (let i = 0; i < this.groupToBeEdited.rules.length; i++) {
				if (this.groupToBeEdited.rules[i].parameter === parameter) {
					this.groupToBeEdited.rules.splice(i, 1)
				}
			}

			this.groupToBeEdited.rules.push(rule)
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateGroupData () {
			var editGroupVue = this
			return new Promise(function (resolve, reject) {
				if (!editGroupVue.groupToBeEdited.name.length) {
					reject('Group name cannot be blank')
				} else if (!editGroupVue.groupToBeEdited.description.length) {
					reject('Group description cannot be blank')
				} else if (!editGroupVue.groupToBeEdited.rules.length) {
					reject('Select at least one rule')
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
		 * To update the group and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateGroup () {
			var editGroupVue = this
			editGroupVue.clearError()

			return editGroupVue
				.validateGroupData()
				.then(response => {
					editGroupVue.updating = true
					UserGroupsFunctions.updateGroup(
						editGroupVue.groupToBeEdited,
						editGroupVue.$root.appId,
						editGroupVue.$root.appSecret,
						editGroupVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								this.closeModalAndUpdate()
							} else {
								editGroupVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the group',
								errorName: 'errorMessage',
								vue: editGroupVue,
								containerRef: 'modal'
							})
						})
						.finally(() => {
							editGroupVue.updating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					editGroupVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeEditGroupModal')
		},
		/**
		 * To close the modal and emit the updated folder object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateGroup', this.groupToBeEdited)
		}
	},
	components: {
		Modal,
		Dropdown
	}
}
</script>

<template>
	<div>
		<div>
			<!-- HEADER START -->
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<h1 class="page-title">Base Rule</h1>
			<div class="note note-info">
				<p>Create and manage the Base Rule.</p>
			</div>
			<!-- HEADER END -->

			<!-- CREATE NEW START -->
			<div class="portlet box blue-hoki margin-top-20" v-if="$root.permissions['loyalty base_rule create']">
				<div class="portlet-title bg-blue-chambray" @click="toggleCreateNew()">
					<div class="caption">
						<i class="fa fa-plus-circle"></i>
						Create Base Rule
					</div>
					<div class="tools">
						<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
					</div>
				</div>
				<div class="portlet-body" v-show="!createNewCollapse">
					<div class="alert alert-info center margin-top-20" v-show="rules.length && !loading">
					    <h4>Base Rule exists</h4>
					    <p>Only one base rule can be created. You can edit the existing rule below or delete it and create a new rule.</p>
					</div>
					<form role="form" @submit.prevent="createRule()" v-show="!rules.length && !loading">
						<div class="row">
							<div class="col-md-12">
								<div class="alert alert-danger" v-show="createErrorMessage.length" ref="createErrorMessage">
									<button class="close" data-close="alert" @click.prevent="clearError('createErrorMessage')"></button>
									<span>{{createErrorMessage}}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input ref="newName" type="text" class="form-control input-sm" v-model="newRule.name" :class="{'edited': newRule.name.length}">
									<label for="form_control_name">Name</label>
								</div>
								<el-select v-model="newRule.type" placeholder="Select type" size="small" class="margin-bottom-15">
									<el-option label="points per dollars spent" value="dollar-to-points"></el-option>
									<el-option label="points per transaction" value="transactions-to-points"></el-option>
								</el-select>
								<div class="form-group form-md-line-input form-md-floating-label" v-show="newRule.type === 'dollar-to-points'">
									<input type="text" class="form-control input-sm" v-model="newRule.base_counter" :class="{'edited': newRule.base_counter.length}">
									<label for="form_control_name">Amount to award points for</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" v-model="newRule.min_amount" :class="{'edited': newRule.min_amount.length}">
									<label for="form_control_name">Minimum purchase amount</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text" class="form-control input-sm" v-model="newRule.points" :class="{'edited': newRule.points.length}">
									<label for="form_control_name">Points to award</label>
								</div>
							</div>
						</div>
						<div class="form-actions right">
							<button 
								type="submit" 
								class="btn blue"
								:disabled="creating">
								Create
								<i 
									v-show="creating"
									class="fa fa-spinner fa-pulse fa-fw">
								</i>
							</button>
						</div>
					</form>
				</div>
			</div>
			<!-- CREATE NEW END -->

			<!-- LIST START -->
			<div>
				<div class="portlet light portlet-fit bordered margin-top-20">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-default bold uppercase">Base Rule</span>
							<div class="caption-desc font-grey-cascade">View, edit or delete the base rule.</div>
						</div>
					</div>
					<div class="portlet-body relative-block">
						<loading-screen :show="loading" color="#2C3E50" display="inline"></loading-screen>
						<div class="alert alert-danger" v-show="listErrorMessage.length" ref="listErrorMessage">
							<button class="close" @click.prevent="clearError('listErrorMessage')"></button>
							<span>{{listErrorMessage}}</span>
						</div>
						<div class="mt-element-list" v-if="rules.length && !loading">
							<div class="mt-list-container list-news">
								<ul>
									<li 
										v-for="rule in rules"
										:id="`rule-${rule.id}`"
										class="mt-list-item actions-at-left margin-top-15"
										:class="{'animated' : animated === `rule-${rule.id}`}"
										:key="rule.id">
										<div class="list-item-actions">
											<el-tooltip 
												v-if="$root.permissions['loyalty base_rule update']"
												content="Edit" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="openEditModal(rule)">
													<i class="fa fa-pencil" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['loyalty base_rule read'] && !$root.permissions['loyalty base_rule update']"
												content="View" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="openEditModal(rule)">
													<i class="fa fa-eye" aria-hidden="true"></i>
												</a>
											</el-tooltip>
											<el-tooltip 
												v-if="$root.permissions['loyalty base_rule delete']"
												content="Delete" 
												effect="light" 
												placement="right">
												<a class="btn btn-circle btn-icon-only btn-default" @click="openDeleteModal(rule)">
													<i class="fa fa-trash" aria-hidden="true"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="list-datetime bold uppercase font-red">
											<span>{{ rule.name }}</span>
										</div>
										<div class="list-item-content height-mod">
											<div class="col-md-4">
												<strong>Points awarded: </strong>
												<span v-if="rule.type === 'dollar-to-points'">per dollar spent</span>
												<span v-if="rule.type === 'transactions-to-points'">per transaction</span>
											</div>
											<div class="col-md-4" v-if="rule.type === 'dollar-to-points'">
												<strong>Points for every: </strong>
												<span>${{rule.base_counter}}</span>
											</div>
											<div class="col-md-4">
												<strong>Minimum purchase amount: </strong>
												<span>${{rule.min_amount}}</span>
											</div>
											<div class="col-md-4">
												<strong>Points awarded: </strong>
												<span>{{rule.points}}</span>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<no-results :show="!rules.length && !loading" type="rules"></no-results>
					</div>
				</div>
			</div>
		</div>
		<!-- LIST END -->

		<!-- EDIT MODAL START -->
		<modal :show="showEditModal" effect="fade" @closeOnEscape="closeEditModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Rule</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="row">
					<div class="col-xs-12">
						<div class="alert alert-danger" v-show="editErrorMessage.length" ref="editErrorMessage">
							<button class="close" data-close="alert" @click="clearError('editErrorMessage')"></button>
							<span>{{editErrorMessage}}</span>
						</div>						
					</div>
					<div class="col-xs-6">
						<fieldset :disabled="!$root.permissions['loyalty base_rule update']">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input 
									ref="editedName" 
									type="text" 
									class="form-control input-sm" 
									v-model="ruleToEdit.name" 
									:class="{'edited': ruleToEdit.name.length}">
								<label for="form_control_name">Name</label>
							</div>
							<el-select 
								v-model="ruleToEdit.type" 
								:disabled="true" 
								placeholder="Select type" 
								size="small" 
								class="margin-bottom-15">
								<el-option label="points per dollars spent" value="dollar-to-points"></el-option>
								<el-option label="points per transaction" value="transactions-to-points"></el-option>
							</el-select>
							<div class="form-group form-md-line-input form-md-floating-label" v-show="ruleToEdit.type === 'dollar-to-points'">
								<input type="text" class="form-control input-sm" v-model="ruleToEdit.base_counter" :class="{'edited': ruleToEdit.base_counter.length}">
								<label for="form_control_name">Amount to award points for</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" v-model="ruleToEdit.min_amount" :class="{'edited': ruleToEdit.min_amount.length}">
								<label for="form_control_name">Minimum purchase amount</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" v-model="ruleToEdit.points" :class="{'edited': ruleToEdit.points.length}">
								<label for="form_control_name">Points to award</label>
							</div>
						</fieldset>
					</div>				
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button 
					v-if="!$root.permissions['loyalty base_rule update']"
					type="button" 
					class="btn btn-primary" 
					@click="closeEditModal()">
					Close
				</button>
				<button 
					v-else
					type="button" 
					class="btn btn-primary" 
					@click="updateRule()"
					:disabled="updating">
					Save
					<i 
						v-show="updating"
						class="fa fa-spinner fa-pulse fa-fw">
					</i>

				</button>
			</div>
		</modal>
		<!-- EDIT MODAL END -->

		<!-- DELETE MODAL START -->
		<modal :show="showDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Rule</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="deleteErrorMessage.length" ref="deleteErrorMessage">
					<button class="close" @click="clearError('deleteErrorMessage')"></button>
					<span>{{deleteErrorMessage}}</span>
				</div>
				<p>Are you sure you want to delete {{ruleToDelete.name}}?</p>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button 
					type="button" 
					class="btn btn-primary" 
					@click="deleteRule()"
					:disabled="deleting">
					Delete
					<i 
						v-show="deleting"
						class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import LoyaltyFunctions from '../../../controllers/Loyalty'
import Modal from '../../modules/Modal'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import globalFunctions from '../../../global'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Loyalty', link: false},
				{name: 'Base Rule', link: false}
			],
			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newRule: {
				name: '',
				type: '', // "dollar-to-points", "transactions-to-points"
				base_counter: '', // for every X dollars, does not apply to transaction to points (pass 1 anyway)
				min_amount: '', // minimum number of dollars spent? (0 if does not apply)
				points: '' // no of points awarded
			},
			listErrorMessage: '',
			loading: false,
			rules: [],
			animated: '',
			showEditModal: false,
			updating: false,
			ruleToEdit: {
				id: null,
				name: '',
				type: '',
				base_counter: '',
				min_amount: '',
				points: ''
			},
			editErrorMessage: '',
			showDeleteModal: false,
			deleting: false,
			ruleToDelete: {
				name: ''
			},
			deleteErrorMessage: ''
		}
	},
	mounted () {
		this.getRules()
	},
	methods: {
		/**
		 * To toggle the create new panel.
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateNew () {
			this.createNewCollapse = !this.createNewCollapse
			this.$nextTick(function () {
				if (!this.createNewCollapse) {
					this.$refs.newName.focus()
				}
			})
		},
		/**
		 * To clear the error.
		 * @param {string} errorName - The name of the variable to clear
		 * @function
		 * @returns {undefined}
		 */
		clearError (errorName) {
			this[errorName] = ''
		},
		/**
		 * To check if the data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewRule () {
			var rulesVue = this
			return new Promise(function (resolve, reject) {
				if (!rulesVue.newRule.name.length) {
					reject('Name cannot be blank')
				} else if (rulesVue.newRule.type === '') {
					reject('Select type')
				} else if (rulesVue.newRule.type === 'dollar-to-points' && !$.isNumeric(rulesVue.newRule.base_counter)) {
					reject('Amount to award points for must be a number')
				} else if (!$.isNumeric(rulesVue.newRule.min_amount)) {
					reject('Minimum purchase amount must be a number')
				} else if (!$.isNumeric(rulesVue.newRule.points)) {
					reject('Points must be a number')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a rule
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createRule () {
			if (this.newRule.type === 'transactions-to-points') {
				this.newRule.base_counter = '1'
			}
			const rulesVue = this

			return this.validateNewRule()
			.then((response) => {
				rulesVue.creating = true
				rulesVue.clearError('createErrorMessage')
				return LoyaltyFunctions.createRule(globalFunctions.loyaltyAppId, globalFunctions.loyaltyAppSecret, rulesVue.newRule)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						rulesVue.getRules()
						rulesVue.showCreateSuccess()
					} else {
						rulesVue.createErrorMessage = response.message
						rulesVue.$scrollTo(rulesVue.$refs.createErrorMessage, 1000, { offset: -50 })
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not create the rule',
						errorName: 'createErrorMessage',
						vue: rulesVue
					})
				}).finally(() => {
					rulesVue.creating = false
				})
			}).catch(reason => {
				rulesVue.createErrorMessage = reason
				rulesVue.$scrollTo(rulesVue.$refs.createErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To notify that create succeeded
		 * @function
		 * @returns {undefined}
		 */
		showCreateSuccess () {
			this.$swal({
				title: 'Success',
				text: `${this.newRule.name} successfully created`,
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.resetCreateForm()
			})
		},
		/**
		 * To reset the create form
		 * @function
		 * @returns {undefined}
		 */
		resetCreateForm () {
			this.newRule = {
				name: '',
				type: '',
				base_counter: '',
				min_amount: '',
				points: ''
			}
		},
		/**
		 * To get a list of rules
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getRules () {
			this.loading = true
			const rulesVue = this
			return LoyaltyFunctions.getRules(globalFunctions.loyaltyAppId, globalFunctions.loyaltyAppSecret)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					rulesVue.rules = response.payload
					rulesVue.loading = false
				} else {
					rulesVue.loading = false
					rulesVue.listErrorMessage = response.message
					rulesVue.$scrollTo(rulesVue.$refs.listErrorMessage, 1000, { offset: -50 })
				}
			}).catch(reason => {
				rulesVue.loading = false
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch the base rule',
					errorName: 'listErrorMessage',
					vue: rulesVue
				})
			})
		},
		/**
		 * To open the edit modal
		 * @function
		 * @param {object} rule - The rule to edit
		 * @returns {undefined}
		 */
		openEditModal (rule) {
			this.ruleToEdit = {
				...rule,
				base_counter: String(rule.base_counter),
				min_amount: String(rule.min_amount),
				points: String(rule.points)
			}
			this.showEditModal = true
		},
		/**
		 * To check if the data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedRule () {
			var rulesVue = this
			return new Promise(function (resolve, reject) {
				if (!rulesVue.ruleToEdit.name.length) {
					reject('Name cannot be blank')
				} else if (rulesVue.ruleToEdit.type === 'dollar-to-points' && !$.isNumeric(rulesVue.ruleToEdit.base_counter)) {
					reject('Amount to award points for must be a number')
				} else if (!$.isNumeric(rulesVue.ruleToEdit.min_amount)) {
					reject('Minimum purchase amount must be a number')
				} else if (!$.isNumeric(rulesVue.ruleToEdit.points)) {
					reject('Points must be a number')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a rule
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateRule () {
			if (this.ruleToEdit.type === 'transactions-to-points') {
				this.ruleToEdit.base_counter = '1'
			}
			const rulesVue = this

			return this.validateEditedRule()
			.then((response) => {
				rulesVue.updating = true
				rulesVue.clearError('editErrorMessage')
				return LoyaltyFunctions.updateRule(globalFunctions.loyaltyAppId, globalFunctions.loyaltyAppSecret, rulesVue.ruleToEdit)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						rulesVue.getRules()
						rulesVue.closeEditModal()
						rulesVue.showEditSuccess()
					} else {
						rulesVue.editErrorMessage = response.message
						rulesVue.$scrollTo(rulesVue.$refs.editErrorMessage, 1000, { offset: -50 })
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the rule',
						errorName: 'editErrorMessage',
						vue: rulesVue
					})
				}).finally(() => {
					rulesVue.updating = false
				})
			}).catch(reason => {
				rulesVue.editErrorMessage = reason
				rulesVue.$scrollTo(rulesVue.$refs.createErrorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To notify that edit succeeded
		 * @function
		 * @returns {undefined}
		 */
		showEditSuccess () {
			this.$swal({
				title: 'Success',
				text: `${this.ruleToEdit.name} successfully updated`,
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To close the edit modal
		 * @function
		 * @returns {undefined}
		 */
		closeEditModal () {
			this.editErrorMessage = ''
			this.showEditModal = false
		},
		/**
		 * To open the delete modal
		 * @function
		 * @param {object} rule - The rule to delete
		 * @returns {undefined}
		 */
		openDeleteModal (rule) {
			this.ruleToDelete = {...rule}
			this.showDeleteModal = true
		},
		/**
		 * To delete a rule
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteRule () {
			this.deleting = true
			const rulesVue = this
			rulesVue.clearError('deleteErrorMessage')
			return LoyaltyFunctions.deleteRule(globalFunctions.loyaltyAppId, globalFunctions.loyaltyAppSecret, rulesVue.ruleToDelete.id)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					rulesVue.getRules()
					rulesVue.closeDeleteModal()
					rulesVue.showDeleteSuccess()
				} else {
					rulesVue.editErrorMessage = response.message
					rulesVue.$scrollTo(rulesVue.$refs.deleteErrorMessage, 1000, { offset: -50 })
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not delete the rule',
					errorName: 'deleteErrorMessage',
					vue: rulesVue
				})
			}).finally(() => {
				rulesVue.deleting = false
			})
		},
		/**
		 * To notify that delete succeeded
		 * @function
		 * @returns {undefined}
		 */
		showDeleteSuccess () {
			this.$swal({
				title: 'Success',
				text: `${this.ruleToDelete.name} deleted`,
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To close the delete modal
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.deleteErrorMessage = ''
			this.showDeleteModal = false
		}
	},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		Modal
	}
}
</script>

<style scoped>
.mt-element-list .list-news.mt-list-container ul>.mt-list-item:hover {
	background-color: white;
}
</style>

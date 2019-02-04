<template>
	<div>
		<!-- HEADER START -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<h1 class="page-title">Promotion Rules</h1>
		<div class="note note-info">
			<p>Create and manage Promotion Rules.</p>
		</div>
		<!-- HEADER END -->

		<!-- CREATE NEW START -->
		<div class="portlet box blue-hoki margin-top-20"
		     v-if="$root.permissions['loyalty promotion_rules create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreateNew()">
				<div class="caption">
					<i class="fa fa-plus-circle"></i>
					Create New Promotion Rule
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body"
			     v-show="!createNewCollapse">
				<form role="form"
				      @submit.prevent="createRule()">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="createErrorMessage.length"
							     ref="createErrorMessage">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError('createErrorMessage')"></button>
								<span>{{createErrorMessage}}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="col-xs-12 no-gutter">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input ref="newName"
									       type="text"
									       class="form-control input-sm"
									       v-model="newRule.name"
									       :class="{'edited': newRule.name.length}">
									<label for="form_control_name">Name</label>
								</div>
							</div>
							<div class="col-xs-12 no-gutter">
								<label class="grey-label">Start on</label>
								<el-date-picker v-model="newRule.start_from"
								                type="date"
								                format="yyyy-MM-dd"
								                value-format="yyyy-MM-dd"
								                :editable="false"
								                :clearable="false"
								                placeholder="Start date"></el-date-picker>
							</div>
							<div class="col-xs-12 no-gutter margin-top-15">
								<label class="grey-label">End on</label>
								<el-date-picker v-model="newRule.end_on"
								                type="date"
								                format="yyyy-MM-dd"
								                value-format="yyyy-MM-dd"
								                :editable="false"
								                :clearable="false"
								                placeholder="End date"></el-date-picker>
							</div>
							<div class="col-xs-12 no-gutter margin-top-15">
								<label class="grey-label">Points awarded for</label>
								<el-select v-model="newRule.parameter"
								           placeholder="select rule"
								           size="small"
								           class="margin-bottom-15 wide-select">
									<el-option label="total amount spent"
									           value="total-spend"></el-option>
									<el-option label="purchasing specified items"
									           value="sku"></el-option>
									<el-option label="purchases made during specified times"
									           value="time"></el-option>
									<el-option label="purchasing specified items during specified times"
									           value="sku-combination"></el-option>
								</el-select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="col-xs-12 no-gutter">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       v-model="newRule.min_amount"
									       :class="{'edited': newRule.min_amount.length}">
									<label for="form_control_name">Minimum purchase amount</label>
								</div>
							</div>
							<div class="col-xs-12 no-gutter">
								<div class="side-by-side">
									<label class="grey-label">Type of points reward</label>
									<el-select v-model="newRule.bonus_type"
									           placeholder="select type"
									           size="small">
										<el-option label="proportional bonus"
										           value="multiplier"></el-option>
										<el-option label="flat bonus"
										           value="add-on"></el-option>
									</el-select>

								</div>
								<div class="form-group form-md-line-input form-md-floating-label side-by-side">
									<input type="text"
									       class="form-control input-sm"
									       v-model="newRule.bonus"
									       :class="{'edited': newRule.bonus.length}">
									<label v-show="newRule.bonus_type === ''">Bonus type value</label>
									<label v-show="newRule.bonus_type === 'multiplier'">Multiplier for bonus points</label>
									<label v-show="newRule.bonus_type === 'add-on'">Number of bonus points</label>
								</div>
							</div>
							<div class="col-xs-12 no-gutter"
							     v-show="newRule.parameter === 'sku' || newRule.parameter === 'sku-combination'">
								<button class="btn"
								        @click.prevent="selectAllItems(newRule)"
								        :class="{'blue-chambray' : newRule.sku === 'all', 'blue btn-outline' : newRule.sku !== 'all'}">All items</button>
								<button class="btn"
								        @click.prevent="selectItems(newRule)"
								        :class="{'blue-chambray' : newRule.sku !== 'all', 'blue btn-outline' : newRule.sku === 'all'}">Select items</button>
								<label class="grey-label">
									<span v-show="newRule.sku === 'all'">All</span>
									<span v-show="newRule.sku !== 'all'">{{numberOfItemsNew}}</span>
									<span v-if="numberOfItemsNew !== 1 || newRule.sku === 'all'">items</span>
									<span v-else>item</span>
									selected
								</label>
							</div>
							<div class="col-xs-12 no-gutter margin-top-20"
							     v-show="newRule.parameter === 'time' || newRule.parameter === 'sku-combination'">
								<el-time-select v-model="newRule.start"
								                :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
								                placeholder="Set start time"></el-time-select>
								<el-time-select v-model="newRule.end"
								                :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
								                placeholder="Set end time"></el-time-select>
							</div>

						</div>
					</div>
					<div class="form-actions right">
						<button type="submit"
						        class="btn blue"
						        :disabled="creating">
							Create
							<i v-show="creating"
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
						<img src="../../../../public/client_logo.png">
					</div>
					<div class="caption">
						<span class="caption-subject font-default bold uppercase">Rules</span>
						<div class="caption-desc font-grey-cascade">View, edit or delete promotion rules.</div>
					</div>
				</div>
				<div class="portlet-body relative-block">
					<loading-screen :show="loading"
					                color="#2C3E50"
					                display="inline"></loading-screen>
					<div class="alert alert-danger"
					     v-show="listErrorMessage.length"
					     ref="listErrorMessage">
						<button class="close"
						        @click.prevent="clearError('listErrorMessage')"></button>
						<span>{{listErrorMessage}}</span>
					</div>
					<div class="mt-element-list"
					     v-if="rules.length && !loading">
						<div class="mt-list-container list-news">
							<ul>
								<li v-for="rule in rules"
								    :id="`rule-${rule.id}`"
								    class="mt-list-item actions-at-left margin-top-15"
								    :class="{'animated' : animated === `rule-${rule.id}`}"
								    :key="rule.id">
									<div class="list-item-actions">
										<el-tooltip v-if="$root.permissions['loyalty promotion_rules update']"
										            content="Edit"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="openEditModal(rule)">
												<i class="fa fa-pencil"
												   aria-hidden="true"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['loyalty promotion_rules read'] && !$root.permissions['loyalty promotion_rules update']"
										            content="View"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="openEditModal(rule)">
												<i class="fa fa-eye"
												   aria-hidden="true"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['loyalty promotion_rules delete']"
										            content="Delete"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="openDeleteModal(rule)">
												<i class="fa fa-trash"
												   aria-hidden="true"></i>
											</a>
										</el-tooltip>
									</div>
									<div class="list-datetime bold uppercase font-red">
										<span>{{ rule.name }}</span>
									</div>
									<div class="list-item-content height-mod">
										<div class="col-md-4">
											<strong>From: </strong>
											<span>{{rule.start_from}}</span>
										</div>
										<div class="col-md-4">
											<strong>To: </strong>
											<span>{{rule.end_on}}</span>
										</div>
										<div class="col-md-4">
											<strong>Minimum purchase amount: </strong>
											<span>${{rule.min_amount}}</span>
										</div>
										<div class="col-md-8">
											<strong>Points awarded for: </strong>
											<span v-if="rule.parameter === 'total-spend'">total amount spent</span>
											<span v-if="rule.parameter === 'sku'">purchasing specified items</span>
											<span v-if="rule.parameter === 'time'">purchases made during specified times</span>
											<span v-if="rule.parameter === 'sku-combination'">purchasing specified items during specified times</span>
										</div>
										<div class="col-md-4">
											<strong>Bonus type: </strong>
											<span v-show="rule.bonus_type === 'multiplier'">proportional</span>
											<span v-show="rule.bonus_type === 'add-on'">flat</span>
										</div>
										<div class="col-md-4"
										     v-show="rule.parameter === 'sku' || rule.parameter === 'sku-combination'">
											<strong>Applies to: </strong>
											<span v-show="rule.sku === 'all'">all </span>
											<span v-show="rule.sku !== 'all'">{{rule.sku.length}} </span>
											<span v-if="rule.sku.length > 1">items</span>
											<span v-else>item</span>
										</div>
										<div class="col-md-4"
										     v-show="rule.parameter === 'time' || rule.parameter === 'sku-combination'">
											<strong>Starts: </strong>
											<span>{{rule.start}}</span>
										</div>
										<div class="col-md-4"
										     v-show="rule.parameter === 'time' || rule.parameter === 'sku-combination'">
											<strong>Ends: </strong>
											<span>{{rule.end}}</span>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<no-results :show="!rules.length && !loading"
					            type="rules"></no-results>
				</div>
			</div>
		</div>
		<!-- LIST END -->

		<!-- EDIT MODAL START -->
		<modal :show="showEditModal"
		       effect="fade"
		       @closeOnEscape="closeEditModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeEditModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Rule</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<div class="row">
					<div class="col-xs-12">
						<div class="alert alert-danger"
						     v-show="editErrorMessage.length"
						     ref="editErrorMessage">
							<button class="close"
							        data-close="alert"
							        @click="clearError('editErrorMessage')"></button>
							<span>{{editErrorMessage}}</span>
						</div>
					</div>
					<div class="col-md-12">
						<div class="col-xs-12 no-gutter">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input :disabled="!$root.permissions['loyalty promotion_rules update']"
								       ref="newName"
								       type="text"
								       class="form-control input-sm"
								       v-model="ruleToEdit.name"
								       :class="{'edited': ruleToEdit.name.length}">
								<label for="form_control_name">Name</label>
							</div>
						</div>
						<div class="col-xs-12 no-gutter">
							<label class="grey-label">Start on</label>
							<el-date-picker :disabled="!$root.permissions['loyalty promotion_rules update']"
							                v-model="ruleToEdit.start_from"
							                type="date"
							                format="yyyy-MM-dd"
							                value-format="yyyy-MM-dd"
							                :editable="false"
							                :clearable="false"
							                placeholder="Start date"></el-date-picker>
						</div>
						<div class="col-xs-12 no-gutter margin-top-15">
							<label class="grey-label">End on</label>
							<el-date-picker :disabled="!$root.permissions['loyalty promotion_rules update']"
							                v-model="ruleToEdit.end_on"
							                type="date"
							                format="yyyy-MM-dd"
							                value-format="yyyy-MM-dd"
							                :editable="false"
							                :clearable="false"
							                placeholder="End date"></el-date-picker>
						</div>
						<div class="col-xs-12 no-gutter margin-top-15">
							<label class="grey-label">Points awarded for</label>
							<el-select :disabled="!$root.permissions['loyalty promotion_rules update']"
							           v-model="ruleToEdit.parameter"
							           placeholder="select rule"
							           size="small"
							           class="margin-bottom-15 wide-select">
								<el-option label="total amount spent"
								           value="total-spend"></el-option>
								<el-option label="purchasing specified items"
								           value="sku"></el-option>
								<el-option label="purchases made during specified times"
								           value="time"></el-option>
								<el-option label="purchasing specified items during specified times"
								           value="sku-combination"></el-option>
							</el-select>
						</div>
						<div class="col-xs-12 no-gutter">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input :disabled="!$root.permissions['loyalty promotion_rules update']"
								       type="text"
								       class="form-control input-sm"
								       v-model="ruleToEdit.min_amount"
								       :class="{'edited': ruleToEdit.min_amount.length}">
								<label for="form_control_name">Minimum purchase amount</label>
							</div>
						</div>
						<div class="col-xs-12 no-gutter">
							<div class="side-by-side">
								<label class="grey-label">Type of points reward</label>
								<el-select :disabled="!$root.permissions['loyalty promotion_rules update']"
								           v-model="ruleToEdit.bonus_type"
								           placeholder="select type"
								           size="small">
									<el-option label="proportional bonus"
									           value="multiplier"></el-option>
									<el-option label="flat bonus"
									           value="add-on"></el-option>
								</el-select>

							</div>
							<div class="form-group form-md-line-input form-md-floating-label side-by-side">
								<input :disabled="!$root.permissions['loyalty promotion_rules update']"
								       type="text"
								       class="form-control input-sm"
								       v-model="ruleToEdit.bonus"
								       :class="{'edited': ruleToEdit.bonus.length}">
								<label v-show="ruleToEdit.bonus_type === ''">Bonus type value</label>
								<label v-show="ruleToEdit.bonus_type === 'multiplier'">Multiplier for bonus points</label>
								<label v-show="ruleToEdit.bonus_type === 'add-on'">Number of bonus points</label>
							</div>
						</div>
						<div class="col-xs-12 no-gutter"
						     v-show="ruleToEdit.parameter === 'sku' || ruleToEdit.parameter === 'sku-combination'">
							<button class="btn"
							        @click.prevent="selectAllItems(ruleToEdit)"
							        :class="{'blue-chambray' : ruleToEdit.sku === 'all', 'blue btn-outline' : ruleToEdit.sku !== 'all'}">
								All items
							</button>
							<button class="btn"
							        @click.prevent="selectItems(ruleToEdit)"
							        :class="{'blue-chambray' : ruleToEdit.sku !== 'all', 'blue btn-outline' : ruleToEdit.sku === 'all'}">
								Select items
							</button>
							<label class="grey-label">
								<span v-show="ruleToEdit.sku === 'all'">All</span>
								<span v-show="ruleToEdit.sku !== 'all'">{{numberOfItemsEdited}}</span>
								<span v-if="numberOfItemsEdited !== 1 || ruleToEdit.sku === 'all'">items</span>
								<span v-else>item</span>
								selected</label>
						</div>
						<div class="col-xs-12 no-gutter margin-top-20"
						     v-show="ruleToEdit.parameter === 'time' || ruleToEdit.parameter === 'sku-combination'">
							<el-time-select :disabled="!$root.permissions['loyalty promotion_rules update']"
							                v-model="ruleToEdit.start"
							                :picker-options="{ start: '00:00', end: '23:59', step: '00:01' }"
							                placeholder="Set start time">
							</el-time-select>
							<el-time-select :disabled="!$root.permissions['loyalty promotion_rules update']"
							                v-model="ruleToEdit.end"
							                :picker-options="{ start: '00:00', end: '23:59', step: '00:01' }"
							                placeholder="Set end time">
							</el-time-select>
						</div>
					</div>
				</div>
			</div>
			<div slot="modal-footer"
			     class="modal-footer">
				<button v-if="!$root.permissions['loyalty promotion_rules update']"
				        type="button"
				        class="btn btn-primary"
				        @click="closeEditModal()">
					Close
				</button>
				<button v-else
				        type="button"
				        class="btn btn-primary"
				        @click="updateRule()"
				        :disabled="updating">
					Save
					<i v-show="updating"
					   class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- EDIT MODAL END -->

		<!-- DELETE MODAL START -->
		<modal :show="showDeleteModal"
		       effect="fade"
		       @closeOnEscape="closeDeleteModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Rule</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<div class="alert alert-danger"
				     v-show="deleteErrorMessage.length"
				     ref="deleteErrorMessage">
					<button class="close"
					        @click="clearError('deleteErrorMessage')"></button>
					<span>{{deleteErrorMessage}}</span>
				</div>
				<p>Are you sure you want to delete {{ruleToDelete.name}}?</p>
			</div>
			<div slot="modal-footer"
			     class="modal-footer">
				<button type="button"
				        class="btn btn-primary"
				        @click="deleteRule()"
				        :disabled="deleting">
					Delete
					<i v-show="deleting"
					   class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->

		<!-- ITEM SELECT START -->
		<menu-modifier-tree v-if="showMenuModifierTreeModal"
		                    :selectedObject="ruleToSelectSKUsFor"
		                    @closeMenuModifierTreeModal="closeMenuModifierTree"
		                    @closeMenuModifierTreeModalAndUpdate="setSelectedItems">
		</menu-modifier-tree>
		<!-- ITEM SELECT END -->
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
import MenuModifierTree from '../../modules/MenuModifierTree'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Loyalty', link: false },
				{ name: 'Promotion Rules', link: false }
			],
			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newRule: {
				name: '', // name
				start_from: '', // start date
				end_on: '', // end date
				parameter: '', // points awarded for:
				// 'total-spend' - total amount spent
				// 'sku' - purchasing items
				// 'time' - purchases made during specified times
				// 'sku-combination' - purchasing items during specified times
				min_amount: '', // minimum purchase amount
				bonus_type: '', // type of points reward
				// 'multiplier' - proportional bonus
				// 'add-on' - flat-rate bonus
				bonus: '', // multiplier for bonus points / number of bonus points
				sku: '', // apply to all items / select items
				start: '', // from
				end: '' // to
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
				start_from: '',
				end_on: '',
				parameter: '',
				min_amount: '',
				bonus_type: '',
				bonus: '',
				sku: '',
				start: '',
				end: ''
			},
			editErrorMessage: '',
			showDeleteModal: false,
			deleting: false,
			ruleToDelete: {
				name: ''
			},
			deleteErrorMessage: '',
			showMenuModifierTreeModal: false,
			ruleToSelectSKUsFor: {}
		}
	},
	computed: {
		numberOfItemsNew () {
			return this.newRule.sku === ''
				? 0
				: this.newRule.sku.length
		},
		numberOfItemsEdited () {
			return this.ruleToEdit.sku === ''
				? 0
				: this.ruleToEdit.sku.length
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
		 * To select all items for the rule.
		 * @param {object} rule - The rule to modify
		 * @function
		 * @returns {undefined}
		 */
		selectAllItems (rule) {
			rule.sku = 'all'
		},
		/**
		 * To select all items for the rule.
		 * @param {object} rule - The rule to modify
		 * @function
		 * @returns {undefined}
		 */
		selectItems (rule) {
			this.ruleToSelectSKUsFor = rule
			this.showMenuModifierTreeModal = true
		},
		/**
		 * To record the items selected.
		 * @param {object} items - An object containing the selected items
		 * @function
		 * @returns {undefined}
		 */
		setSelectedItems (items) {
			this.ruleToSelectSKUsFor.sku = items.selectedSKUs.toString()
			this.showMenuModifierTreeModal = false
		},
		/**
		 * To close the menu modifier tree modal
		 * @function
		 * @returns {undefined}
		 */
		closeMenuModifierTree () {
			this.showMenuModifierTreeModal = false
		},
		/**
		 * To check if a date is in the past.
		 * @function
		 * @param {string} date - The date string to verify.
		 * @returns {boolean} True if date is in the past, false if not
		 */
		isPast (date) {
			let input = new Date(date)
			input.setMinutes(input.getMinutes() + input.getTimezoneOffset())
			let today = new Date()
			let inputDay = input.getDate()
			if (inputDay < 10) {
				inputDay = '0' + inputDay
			}
			let inputMonth = input.getMonth()
			if (inputMonth < 10) {
				inputMonth = '0' + inputMonth
			}
			let inputYear = input.getFullYear()
			let todayDay = today.getDate()
			if (todayDay < 10) {
				todayDay = '0' + todayDay
			}
			let todayMonth = today.getMonth()
			if (todayMonth < 10) {
				todayMonth = '0' + todayMonth
			}
			let todayYear = today.getFullYear()

			return (
				`${todayYear}-${todayMonth}-${todayDay}` >
				`${inputYear}-${inputMonth}-${inputDay}`
			)
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
				} else if (!rulesVue.newRule.start_from.length) {
					reject('Start date cannot be blank')
				} else if (rulesVue.isPast(rulesVue.newRule.start_from)) {
					reject('Start Date cannot be in the past')
				} else if (!rulesVue.newRule.end_on.length) {
					reject('End date cannot be blank')
				} else if (
					new Date(rulesVue.newRule.end_on) <
					new Date(rulesVue.newRule.start_from)
				) {
					reject('End Date cannot be before Start Date')
				} else if (!rulesVue.newRule.parameter.length) {
					reject('Points awarded for cannot be blank')
				} else if (!rulesVue.newRule.min_amount.length) {
					reject('Minimum purchase amount cannot be blank')
				} else if (rulesVue.newRule.bonus_type === '') {
					reject('Select type of points reward')
				} else if (
					rulesVue.newRule.bonus_type === 'multiplier' &&
					!$.isNumeric(rulesVue.newRule.bonus)
				) {
					reject('Multiplier for bonus points cannot be blank')
				} else if (
					rulesVue.newRule.bonus_type === 'add-on' &&
					!$.isNumeric(rulesVue.newRule.bonus)
				) {
					reject('Number of bonus points cannot be blank')
				} else if (
					(rulesVue.newRule.parameter === 'sku' ||
						rulesVue.newRule.parameter === 'sku') &&
					rulesVue.newRule.parameter.length === 0
				) {
					reject('Select at least one item')
				} else if (
					(rulesVue.newRule.bonus_type === 'time' ||
						rulesVue.newRule.parameter === 'sku-combination') &&
					rulesVue.newRule.start.length === 0
				) {
					reject('Start time cannot be blank')
				} else if (
					(rulesVue.newRule.parameter === 'time' ||
						rulesVue.newRule.parameter === 'sku-combination') &&
					rulesVue.newRule.end.length === 0
				) {
					reject('End time cannot be blank')
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
			const rulesVue = this

			return this.validateNewRule()
				.then(response => {
					rulesVue.creating = true
					let payload = { ...this.newRule }
					if (
						payload.parameter !== 'sku' &&
						payload.parameter !== 'sku-combination'
					) {
						payload.sku = 'all'
					} else {
						payload.sku = payload.sku.toString()
					}
					if (
						payload.parameter !== 'time' &&
						payload.parameter !== 'sku-combination'
					) {
						payload.start = ''
						payload.end = ''
					}
					rulesVue.clearError('createErrorMessage')

					return LoyaltyFunctions.createPromotionRule(payload)
						.then(response => {
							if (
								response.code === 200 &&
								response.status === 'ok'
							) {
								rulesVue.getRules()
								rulesVue.showCreateSuccess(response.payload)
								rulesVue.resetCreateForm()
							} else {
								rulesVue.createErrorMessage = response.message
								rulesVue.$scrollTo(
									rulesVue.$refs.createErrorMessage,
									1000,
									{
										offset: -50
									}
								)
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create the rule',
								errorName: 'createErrorMessage',
								vue: rulesVue
							})
						})
						.finally(() => {
							rulesVue.creating = false
						})
				})
				.catch(reason => {
					rulesVue.createErrorMessage = reason
					rulesVue.$scrollTo(
						rulesVue.$refs.createErrorMessage,
						1000,
						{
							offset: -50
						}
					)
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showCreateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Promotion Rule has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Promotion Rule has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
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
				start_from: '',
				end_on: '',
				parameter: '',
				min_amount: '',
				bonus_type: '',
				bonus: '',
				sku: '',
				start: '',
				end: ''
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
			return LoyaltyFunctions.getPromotionRules()
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						rulesVue.rules = response.payload
						rulesVue.loading = false
					} else {
						rulesVue.loading = false
						rulesVue.listErrorMessage = response.message
						rulesVue.$scrollTo(
							rulesVue.$refs.listErrorMessage,
							1000,
							{
								offset: -50
							}
						)
					}
				})
				.catch(reason => {
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
			let sku
			if (rule.sku === 'all') {
				sku = rule.sku
			} else if (typeof rule.sku === 'string' && rule.sku.length) {
				sku = rule.sku.split(',')
			} else {
				sku = []
			}
			this.ruleToEdit = {
				...rule,
				bonus: String(rule.bonus),
				min_amount: String(rule.min_amount),
				sku,
				start: rule.start.substr(0, 5),
				end: rule.end.substr(0, 5)
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
				} else if (!rulesVue.ruleToEdit.start_from.length) {
					reject('Start date cannot be blank')
				} else if (rulesVue.isPast(rulesVue.ruleToEdit.start_from)) {
					reject('Start Date cannot be in the past')
				} else if (!rulesVue.ruleToEdit.end_on.length) {
					reject('End date cannot be blank')
				} else if (
					new Date(rulesVue.ruleToEdit.end_on) <
					new Date(rulesVue.ruleToEdit.start_from)
				) {
					reject('End Date cannot be before Start Date')
				} else if (!rulesVue.ruleToEdit.parameter.length) {
					reject('Points awarded for cannot be blank')
				} else if (!rulesVue.ruleToEdit.min_amount.length) {
					reject('Minimum purchase amount cannot be blank')
				} else if (rulesVue.ruleToEdit.bonus_type === '') {
					reject('Select type of points reward')
				} else if (
					rulesVue.ruleToEdit.bonus_type === 'multiplier' &&
					!$.isNumeric(rulesVue.ruleToEdit.bonus)
				) {
					reject('Multiplier for bonus points cannot be blank')
				} else if (
					rulesVue.ruleToEdit.bonus_type === 'add-on' &&
					!$.isNumeric(rulesVue.ruleToEdit.bonus)
				) {
					reject('Number of bonus points cannot be blank')
				} else if (
					(rulesVue.ruleToEdit.parameter === 'sku' ||
						rulesVue.ruleToEdit.parameter === 'sku') &&
					rulesVue.ruleToEdit.parameter.length === 0
				) {
					reject('Select at least one item')
				} else if (
					(rulesVue.ruleToEdit.bonus_type === 'time' ||
						rulesVue.ruleToEdit.parameter === 'sku-combination') &&
					rulesVue.ruleToEdit.start.length === 0
				) {
					reject('Start time cannot be blank')
				} else if (
					(rulesVue.ruleToEdit.parameter === 'time' ||
						rulesVue.ruleToEdit.parameter === 'sku-combination') &&
					rulesVue.ruleToEdit.end.length === 0
				) {
					reject('End time cannot be blank')
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
				.then(response => {
					rulesVue.updating = true
					let payload = { ...this.ruleToEdit }
					if (
						payload.parameter !== 'sku' &&
						payload.parameter !== 'sku-combination'
					) {
						payload.sku = 'all'
					} else {
						payload.sku = payload.sku.toString()
					}
					if (
						payload.parameter !== 'time' &&
						payload.parameter !== 'sku-combination'
					) {
						payload.start = ''
						payload.end = ''
					}
					rulesVue.clearError('editErrorMessage')

					return LoyaltyFunctions.updatePromotionRule(payload)
						.then(response => {
							if (
								response.code === 200 &&
								response.status === 'ok'
							) {
								rulesVue.getRules()
								rulesVue.closeEditModal()
								rulesVue.showEditSuccess(response.payload)
							} else {
								rulesVue.editErrorMessage = response.message
								rulesVue.$scrollTo(
									rulesVue.$refs.editErrorMessage,
									1000,
									{
										offset: -50
									}
								)
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the rule',
								errorName: 'editErrorMessage',
								vue: rulesVue
							})
						})
						.finally(() => {
							rulesVue.updating = false
						})
				})
				.catch(reason => {
					rulesVue.editErrorMessage = reason
					rulesVue.$scrollTo(
						rulesVue.$refs.createErrorMessage,
						1000,
						{
							offset: -50
						}
					)
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
			let text = 'The Promotion Rule has been saved'
			let type = 'success'

			if (payload.pending_approval) {
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
			this.ruleToDelete = { ...rule }
			this.showDeleteModal = true
		},
		/**
		 * To delete a rule
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteRule () {
			const rulesVue = this
			rulesVue.clearError('deleteErrorMessage')
			return LoyaltyFunctions.deletePromotionRule(rulesVue.ruleToDelete.id)
				.then(response => {
					rulesVue.deleting = true
					if (response.code === 200 && response.status === 'ok') {
						rulesVue.getRules()
						rulesVue.closeDeleteModal()
						rulesVue.showDeleteSuccess(response.payload)
					} else {
						rulesVue.editErrorMessage = response.message
						rulesVue.$scrollTo(
							rulesVue.$refs.deleteErrorMessage,
							1000,
							{
								offset: -50
							}
						)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not delete the rule',
						errorName: 'deleteErrorMessage',
						vue: rulesVue
					})
				})
				.finally(() => {
					rulesVue.deleting = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showDeleteSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Promotion Rule has been deleted'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The removal has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
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
		Modal,
		MenuModifierTree
	}
}
</script>

<style scoped>
.grey-label {
	padding: 0 5px 0 5px;
	margin-top: 5px;
	color: rgb(153, 153, 153);
}
[class*="col-"] .no-gutter {
	padding-right: 0;
	padding-left: 0;
}
.wide-select {
	width: 100%;
}
.side-by-side {
	display: inline-block;
	width: 49%;
}
.mt-element-list .list-news.mt-list-container ul > .mt-list-item:hover {
	background-color: white;
}
</style>

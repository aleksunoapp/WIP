<template>
	<modal :show="showRewardItemModal"
	       effect="fade"
	       @closeOnEscape="closeModal">
		<div slot="modal-header"
		     class="modal-header">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit Reward Item - {{ passedRewardItem.name }}</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="row">
				<div class="col-md-12">
					<div class="alert alert-danger"
					     v-show="errorMessage.length"
					     ref="errorMessage">
						<button class="close"
						        data-close="alert"
						        @click.prevent="clearError('errorMessage')"></button>
						<span>{{errorMessage}}</span>
					</div>
				</div>
				<div class="col-md-12">
					<fieldset :disabled="!$root.permissions['reward_tiers items update']">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm"
							       :class="{'edited': rewardItemToBeEdited.name.length}"
							       id="form_control_1"
							       v-model="rewardItemToBeEdited.name">
							<label for="form_control_1">Reward Item Name</label>
						</div>
						<div class="side-by-side-item">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': rewardItemToBeEdited.value.length}"
								       id="form_control_2"
								       v-model="rewardItemToBeEdited.value">
								<label for="form_control_2">Reward Item Value</label>
							</div>
						</div>
						<el-select :disabled="!$root.permissions['reward_tiers items update']"
						           class="side-by-side-item margin-top-15"
						           v-model="rewardItemToBeEdited.value_type"
						           placeholder="Select type"
						           size="small">
							<el-option label="$"
							           value="dollar"></el-option>
							<el-option label="%"
							           value="percentage"></el-option>
						</el-select>
						<div class="side-by-side-item margin-top-15">
							from:
							<el-date-picker :disabled="!$root.permissions['reward_tiers items update']"
							                v-model="rewardItemToBeEdited.start_on"
							                type="date"
							                format="yyyy-MM-dd"
							                value-format="yyyy-MM-dd"
							                :clearable="false"
							                placeholder="Select start date">
							</el-date-picker>
						</div>
						<div class="side-by-side-item margin-top-15">
							to:
							<el-date-picker :disabled="!$root.permissions['reward_tiers items update']"
							                v-model="rewardItemToBeEdited.expiry"
							                type="date"
							                format="yyyy-MM-dd"
							                value-format="yyyy-MM-dd"
							                :clearable="false"
							                placeholder="Select end date">
							</el-date-picker>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label margin-top-15">
							<input type="text"
							       class="form-control input-sm"
							       id="form_control_3"
							       :class="{'edited': rewardItemToBeEdited.points.length}"
							       v-model="rewardItemToBeEdited.points">
							<label for="form_control_3">Reward Item Points</label>
						</div>
					</fieldset>
				</div>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button v-if="!$root.permissions['reward_tiers items update']"
			        type="button"
			        class="btn btn-primary"
			        @click="closeModal()">
				Close
			</button>
			<button v-else
			        type="button"
			        class="btn btn-primary"
			        @click="updateRewardItemDetails()">
				Save
				<i v-show="updating"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../modules/Modal'
import RewardsFunctions from '../../../controllers/Rewards'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
	data () {
		return {
			showRewardItemModal: false,
			updating: false,
			rewardItemToBeEdited: {
				id: null,
				sku: [],
				points: '',
				loyalty_reward_id: this.$router.passedTier.loyalty_reward_id,
				name: '',
				value: '',
				expiry: '',
				start_on: '',
				value_type: '', // 'dollar','percentage'
				created_by: this.$root.createdBy
			},
			errorMessage: '',
			expiry: ''
		}
	},
	props: {
		passedRewardItem: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	mounted () {
		this.showRewardItemModal = true
		if (this.passedRewardItem && this.passedRewardItem.id) {
			this.expiry = this.passedRewardItem.expiry
			this.rewardItemToBeEdited = {
				...this.passedRewardItem,
				points: String(this.passedRewardItem.points),
				value: String(this.passedRewardItem.value)
			}
		}
		$(document).off('click', '.el-date-editor')
		$(document).on('click', '.el-date-editor', function () {
			$('.el-picker-panel').css('z-index', '10501')
		})
	},
	methods: {
		/**
		 * To check if the tier data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateRewardItemData () {
			var editRewardItemVue = this
			return new Promise(function (resolve, reject) {
				if (!editRewardItemVue.rewardItemToBeEdited.name) {
					reject('Name cannot be blank')
				} else if (!$.isNumeric(editRewardItemVue.rewardItemToBeEdited.value)) {
					reject('Value should be a number')
				} else if (
					!$.isNumeric(editRewardItemVue.rewardItemToBeEdited.points)
				) {
					reject('Points should be a number')
				} else if (!editRewardItemVue.expiry) {
					reject('Expiry date connot be blank')
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
		 * To return the number code for the name of the month.
		 * @function
		 * @param {string} monthName - The 3 letter string for the name of the month.
		 * @returns {string} - A string representing the number of the input month name.
		 */
		determineMonth (monthName) {
			if (monthName === 'Jan') {
				return '01'
			} else if (monthName === 'Feb') {
				return '02'
			} else if (monthName === 'Mar') {
				return '03'
			} else if (monthName === 'Apr') {
				return '04'
			} else if (monthName === 'May') {
				return '05'
			} else if (monthName === 'Jun') {
				return '06'
			} else if (monthName === 'Jul') {
				return '07'
			} else if (monthName === 'Aug') {
				return '08'
			} else if (monthName === 'Sep') {
				return '09'
			} else if (monthName === 'Oct') {
				return '10'
			} else if (monthName === 'Nov') {
				return '11'
			} else if (monthName === 'Dec') {
				return '12'
			}
		},
		/**
		 * To update the tier and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateRewardItemDetails () {
			var editRewardItemVue = this
			editRewardItemVue.clearError()
			editRewardItemVue.rewardItemToBeEdited.updated_by =
				editRewardItemVue.$root.createdBy
			editRewardItemVue.rewardItemToBeEdited.reward_id =
				editRewardItemVue.$route.params.reward_id
			editRewardItemVue.rewardItemToBeEdited.reward_item_id =
				editRewardItemVue.rewardItemToBeEdited.id
			editRewardItemVue.rewardItemToBeEdited.sku =
				editRewardItemVue.rewardItemToBeEdited.sku_array

			return editRewardItemVue
				.validateRewardItemData()
				.then(response => {
					editRewardItemVue.updating = true
					RewardsFunctions.updateRewardItemDetails(
						editRewardItemVue.rewardItemToBeEdited,
						editRewardItemVue.$root.appId,
						editRewardItemVue.$root.appSecret,
						editRewardItemVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								this.closeModalAndUpdate(response.payload)
							} else {
								editRewardItemVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update this item',
								errorName: 'errorMessage',
								vue: editRewardItemVue
							})
						})
						.finally(() => {
							editRewardItemVue.updating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					editRewardItemVue.errorMessage = reason
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
			this.$emit('closeRewardItemModal')
		},
		/**
		 * To close the modal and emit the updated folder object to the parent.
		 * @function
		 * @param {object} payload - The payload property of the response
		 * @returns {undefined}
		 */
		closeModalAndUpdate (payload = {}) {
			this.$emit('updateRewardItemDetails', {
				val: this.rewardItemToBeEdited,
				payload
			})
		}
	},
	components: {
		Modal
	}
}
</script>
<style scoped>
.side-by-side-item {
  display: inline-block;
  width: 49%;
}
</style>

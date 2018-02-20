<template>
	<modal :show="showRewardItemModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit Reward Item - {{ passedRewardItem.name }}</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="rewardItemToBeEdited.name">
			    <label for="form_control_1">Reward Item Name</label>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="rewardItemToBeEdited.points">
			    <label for="form_control_2">Reward Item Points</label>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="rewardItemToBeEdited.spoonity_reward_id">
			    <label for="form_control_3">Reward Item Spoonity ID</label>
			</div>
			<div class="form-group form-md-line-input form-md-floating-label">
			    <label>Reward Item Expiry</label><br>
			    <el-date-picker 
			    	v-model="expiry" 
			    	type="datetime" 
			    	format="yyyy-MM-dd" 
			    	value-format="yyyy-MM-dd" 
			    	:clearable="false" 
			    	placeholder="Pick an expiry date">
			    </el-date-picker>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="updateRewardItemDetails()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../modules/Modal'
import RewardsFunctions from '../../../controllers/Rewards'

export default {
	data () {
		return {
			showRewardItemModal: false,
			rewardItemToBeEdited: {},
			errorMessage: '',
			expiry: ''
		}
	},
	props: {
		passedRewardItem: {
			type: Object,
			default: () => { return {} }
		}
	},
	mounted () {
		this.showRewardItemModal = true
		if (this.passedRewardItem && this.passedRewardItem.id) {
			this.expiry = this.passedRewardItem.expiry
			this.rewardItemToBeEdited.created_by = this.passedRewardItem.created_by
			this.rewardItemToBeEdited.id = this.passedRewardItem.id
			this.rewardItemToBeEdited.expiry = this.passedRewardItem.expiry
			this.rewardItemToBeEdited.name = this.passedRewardItem.name
			this.rewardItemToBeEdited.percentage = this.passedRewardItem.percentage
			this.rewardItemToBeEdited.points = this.passedRewardItem.points
			this.rewardItemToBeEdited.reward_id = this.passedRewardItem.reward_id
			this.rewardItemToBeEdited.sku = this.passedRewardItem.sku
			this.rewardItemToBeEdited.sku_array = this.passedRewardItem.sku_array
			this.rewardItemToBeEdited.spoonity_reward_id = this.passedRewardItem.spoonity_reward_id
			this.rewardItemToBeEdited.value = this.passedRewardItem.value
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
				} else if (!$.isNumeric(editRewardItemVue.rewardItemToBeEdited.points)) {
					reject('Points should be a number')
				} else if (!editRewardItemVue.rewardItemToBeEdited.spoonity_reward_id) {
					reject('Spoonity ID cannot be blank')
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
			editRewardItemVue.rewardItemToBeEdited.updated_by = editRewardItemVue.$root.createdBy
			editRewardItemVue.rewardItemToBeEdited.reward_id = editRewardItemVue.$route.params.reward_id
			editRewardItemVue.rewardItemToBeEdited.reward_item_id = editRewardItemVue.rewardItemToBeEdited.id
			editRewardItemVue.rewardItemToBeEdited.sku = editRewardItemVue.rewardItemToBeEdited.sku_array

			return editRewardItemVue.validateRewardItemData()
			.then(response => {
				RewardsFunctions.updateRewardItemDetails(editRewardItemVue.rewardItemToBeEdited, editRewardItemVue.$root.appId, editRewardItemVue.$root.appSecret, editRewardItemVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editRewardItemVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editRewardItemVue.$router.push('/login/expired')
						return
					}
					editRewardItemVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
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
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateRewardItemDetails', this.rewardItemToBeEdited)
		}
	},
	components: {
		Modal
	}
}
</script>

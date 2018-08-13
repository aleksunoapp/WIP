<template>
	<modal :show="showEditTierModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit Reward Tier - {{ passedRewardTier.name }}</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<fieldset :disabled="!$root.permissions['reward_tiers update']">
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm edited" id="form_control_1" v-model="rewardTierToBeEdited.name">
					<label for="form_control_1">Tier Name</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm edited" id="form_control_1" v-model="rewardTierToBeEdited.description">
					<label for="form_control_1">Tier Description</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm edited" id="form_control_2" v-model="rewardTierToBeEdited.points">
					<label for="form_control_2">Tier Points</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm edited" id="form_control_3" v-model="rewardTierToBeEdited.stars">
					<label for="form_control_3">Tier Stars</label>
				</div>				
			</fieldset>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button 
				v-if="!$root.permissions['reward_tiers update']"
				type="button" 
				class="btn btn-primary" 
				@click="closeModal()">
				Close
			</button>
			<button 
				v-else
				type="button" 
				class="btn btn-primary" 
				@click="updateRewardTier()"
				:disabled="updating">
				Save
				<i 
					v-show="updating"
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

export default {
	data () {
		return {
			showEditTierModal: false,
			updating: false,
			rewardTierToBeEdited: {},
			errorMessage: ''
		}
	},
	props: {
		passedRewardTier: {
			type: Object,
			default: () => { return {} }
		}
	},
	mounted () {
		this.showEditTierModal = true
		if (this.passedRewardTier && this.passedRewardTier.id) {
			this.rewardTierToBeEdited = {...this.passedRewardTier}
		}
	},
	methods: {
		/**
		 * To check if the tier data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateTierData () {
			var editRewardsTierVue = this
			return new Promise(function (resolve, reject) {
				if (!editRewardsTierVue.rewardTierToBeEdited.name.length) {
					reject('Reward tier name cannot be blank')
				} else if (!editRewardsTierVue.rewardTierToBeEdited.description.length) {
					reject('Reward tier description cannot be blank')
				} else if (!$.isNumeric(editRewardsTierVue.rewardTierToBeEdited.points)) {
					reject('Reward tier points should be a number')
				} else if (!$.isNumeric(editRewardsTierVue.rewardTierToBeEdited.stars)) {
					reject('Reward tier stars should be a number')
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
		 * To update the tier and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateRewardTier () {
			var editRewardsTierVue = this
			editRewardsTierVue.clearError()
			editRewardsTierVue.rewardTierToBeEdited.updated_by = editRewardsTierVue.$root.createdBy
			return editRewardsTierVue.validateTierData()
			.then(response => {
				editRewardsTierVue.updating = true
				RewardsFunctions.updateRewardTier(editRewardsTierVue.rewardTierToBeEdited, editRewardsTierVue.$root.appId, editRewardsTierVue.$root.appSecret, editRewardsTierVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editRewardsTierVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editRewardsTierVue.$router.push('/login/expired')
						return
					}
					editRewardsTierVue.errorMessage = reason
					window.scrollTo(0, 0)
				}).finally(() => {
					editRewardsTierVue.updating = false
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editRewardsTierVue.errorMessage = reason
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
			this.$emit('closeEditTierModal')
		},
		/**
		 * To close the modal and emit the updated folder object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updateRewardTier', this.rewardTierToBeEdited)
		}
	},
	components: {
		Modal
	}
}
</script>

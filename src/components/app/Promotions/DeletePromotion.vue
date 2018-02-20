<template>
	<modal :show="showDeletePromotionModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Delete Promotion</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="col-md-12">
				Are you sure you want to delete this promotion?
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer clear">
			<button type="button" class="btn btn-primary" @click="deletePromotion()">Delete</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import PromotionsFunctions from '../../../controllers/Promotions'

export default {
	data () {
		return {
			showDeletePromotionModal: false,
			errorMessage: '',
			customWidth: 90
		}
	},
	props: {
		selectedPromotionId: {
			type: Number
		}
	},
	mounted () {
		this.showDeletePromotionModal = true
	},
	methods: {
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To delete the promotion and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deletePromotion () {
			var deletePromotionVue = this
			deletePromotionVue.clearError()

			PromotionsFunctions.deletePromotion(deletePromotionVue.selectedPromotionId, deletePromotionVue.$root.appId, deletePromotionVue.$root.appSecret, deletePromotionVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					this.deletePromotionAndCloseModal()
				} else {
					deletePromotionVue.errorMessage = response.message
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					deletePromotionVue.$router.push('/login/expired')
					return
				}
				deletePromotionVue.errorMessage = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDeletePromotionModal')
		},
		/**
		 * To close the modal and delete the promotion.
		 * @function
		 * @returns {undefined}
		 */
		deletePromotionAndCloseModal () {
			this.$emit('deletePromotionAndCloseModal')
		}
	},
	components: {
		Modal
	}
}
</script>
<style>
.image-container {
	border: 1px dotted #c2cad8;
	text-align: center;
}
</style>

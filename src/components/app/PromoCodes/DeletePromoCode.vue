<template>
	<modal :show="showDeletePromoCodeModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Delete Promo Code</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="col-md-12">
				Are you sure you want to delete this promo code?
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer clear">
			<button type="button" class="btn btn-primary" @click="deletePromoCode()">Delete</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import PromoCodesFunctions from '../../../controllers/PromoCodes'

export default {
	data () {
		return {
			showDeletePromoCodeModal: false,
			errorMessage: '',
			customWidth: 90
		}
	},
	props: {
		selectedPromoCodeId: {
			type: Number
		}
	},
	mounted () {
		this.showDeletePromoCodeModal = true
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
		 * To delete the promoCode and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deletePromoCode () {
			var deletePromoCodeVue = this
			deletePromoCodeVue.clearError()

			PromoCodesFunctions.deletePromoCode(deletePromoCodeVue.selectedPromoCodeId, deletePromoCodeVue.$root.appId, deletePromoCodeVue.$root.appSecret, deletePromoCodeVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					this.deletePromoCodeAndCloseModal()
				} else {
					deletePromoCodeVue.errorMessage = response.message
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					deletePromoCodeVue.$router.push('/login/expired')
					return
				}
				deletePromoCodeVue.errorMessage = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDeletePromoCodeModal')
		},
		/**
		 * To close the modal and delete the promoCode.
		 * @function
		 * @returns {undefined}
		 */
		deletePromoCodeAndCloseModal () {
			this.$emit('deletePromoCodeAndCloseModal')
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

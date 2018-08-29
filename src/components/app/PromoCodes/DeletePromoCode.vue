<template>
	<modal :show="showDeletePromoCodeModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="modal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Delete Promo Code</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="alert alert-danger"
			     v-show="errorMessage"
			     ref="errorMessage">
				<button class="close"
				        data-close="alert"
				        @click="clearError()"></button>
				<span>{{errorMessage}}</span>
			</div>
			<div class="col-md-12">
				Are you sure you want to delete this promo code?
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer clear">
			<button type="button"
			        class="btn btn-primary"
			        @click="deletePromoCode()"
			        :disabled="deleting">
				Delete
				<i v-show="deleting"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import PromoCodesFunctions from '../../../controllers/PromoCodes'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showDeletePromoCodeModal: false,
			deleting: false,
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
			this.deleting = true
			var deletePromoCodeVue = this
			deletePromoCodeVue.clearError()

			PromoCodesFunctions.deletePromoCode(
				deletePromoCodeVue.selectedPromoCodeId,
				deletePromoCodeVue.$root.appId,
				deletePromoCodeVue.$root.appSecret,
				deletePromoCodeVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.deletePromoCodeAndCloseModal()
					} else {
						deletePromoCodeVue.errorMessage = response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not delete the promocode',
						errorName: 'errorMessage',
						vue: deletePromoCodeVue,
						containerRef: 'modal'
					})
				})
				.finally(() => {
					deletePromoCodeVue.deleting = false
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

<template>
  <modal
    ref="modal"
    :show="showDeletePromotionModal"
    effect="fade"
    @closeOnEscape="closeModal"
  >
    <div
      slot="modal-header"
      class="modal-header center"
    >
      <button
        type="button"
        class="close"
        @click="closeModal()"
      >
        <span>&times;</span>
      </button>
      <h4 class="modal-title center">
        Delete Promotion
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <div
        v-show="errorMessage"
        ref="errorMessage"
        class="alert alert-danger"
      >
        <button
          class="close"
          @click="clearError()"
        />
        <span>{{ errorMessage }}</span>
      </div>
      <div class="col-md-12">
        Are you sure you want to delete this promotion?
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer clear"
    >
      <button
        type="button"
        class="btn btn-primary"
        :disabled="deleting"
        @click="deletePromotion()"
      >
        Delete
        <i
          v-show="deleting"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from '../../modules/Modal'
import PromotionsFunctions from '../../../controllers/Promotions'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	components: {
		Modal
	},
	props: {
		selectedPromotionId: {
			type: Number
		}
	},
	data () {
		return {
			showDeletePromotionModal: false,
			deleting: false,
			errorMessage: '',
			customWidth: 90
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
			this.deleting = true
			var deletePromotionVue = this
			deletePromotionVue.clearError()

			PromotionsFunctions.deletePromotion(
				deletePromotionVue.selectedPromotionId,
				deletePromotionVue.$root.appId,
				deletePromotionVue.$root.appSecret,
				deletePromotionVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.deletePromotionAndCloseModal()
					} else {
						deletePromotionVue.errorMessage = response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not delete the promotion',
						errorName: 'errorMessage',
						vue: deletePromotionVue,
						containerRef: 'modal'
					})
				})
				.finally(() => {
					deletePromotionVue.deleting = false
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
	}
}
</script>
<style>
.image-container {
  border: 1px dotted #c2cad8;
  text-align: center;
}
</style>

<template>
  <modal
    :show="showSelectLocationModal"
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
        Select Store
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <store-picker
        :previously-selected="promoCode.locations"
        @update="updateSelection"
      />
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <div class="row">
        <div class="col-xs-12">
          <button
            type="button"
            class="btn blue"
            @click="selectStores()"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '../../modules/Modal'
import StorePicker from '@/components/modules/StorePicker'

export default {
	components: {
		Modal,
		StorePicker
	},
	props: {
		promoCode: {
			type: Object
		}
	},
	data () {
		return {
			showSelectLocationModal: false,
			selected: []
		}
	},
	mounted () {
		this.showSelectLocationModal = true
	},
	methods: {
		/**
		 * To record the selected locations in the new or edited promo code object.
		 * @function
		 * @param {array} stores - Array of selected store IDs
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateSelection (stores) {
			this.selected = stores
		},
		/**
		 * To record the selected locations in the new or edited promo code object.
		 * @function
		 * @param {array} stores - Array of selected store IDs
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		selectStores (stores) {
			this.$emit('closeSelectLocationModal', this.selected)
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeSelectLocationModal')
		}
	}
}
</script>

<style scoped>
.modal-body {
  min-height: 200px;
  max-height: calc(100vh - 200px);
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 20px;
}
.form-md-line-input-trimmed {
  padding-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>

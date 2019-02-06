<template>
  <modal
    ref="deleteModal"
    :show="showDeleteItemModal"
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
        Delete Item
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
          data-close="alert"
          @click="clearError()"
        />
        <span>{{ errorMessage }}</span>
      </div>
      <div class="col-md-12">
        Are you sure you want to delete this item?
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
        @click="deleteItem()"
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
import Modal from '../../../modules/Modal'
import ItemsFunctions from '../../../../controllers/Items'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal
  },
  props: {
    passedItemId: {
      type: Number
    }
  },
  data () {
    return {
      showDeleteItemModal: false,
      deleting: false,
      errorMessage: '',
      customWidth: 90
    }
  },
  mounted () {
    this.showDeleteItemModal = true
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
		 * To delete the item and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    deleteItem () {
      this.deleting = true
      var deleteItemVue = this
      deleteItemVue.clearError()

      ItemsFunctions.deleteItem(
        deleteItemVue.passedItemId,
        deleteItemVue.$root.appId,
        deleteItemVue.$root.appSecret,
        deleteItemVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            this.showDeleteSuccess(response.payload)
            this.deleteItemAndCloseModal()
          } else {
            deleteItemVue.errorMessage = response.message
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the item',
            errorName: 'errorMessage',
            vue: deleteItemVue,
            containerRef: 'deleteModal'
          })
        })
        .finally(() => {
          deleteItemVue.deleting = false
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
      let text = 'The Item has been deleted'
      let type = 'success'

      if (payload && payload.pending_approval) {
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
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeDeleteItemModal')
    },
    /**
		 * To close the modal and delete the item.
		 * @function
		 * @returns {undefined}
		 */
    deleteItemAndCloseModal () {
      this.$emit('deleteItemAndCloseModal')
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

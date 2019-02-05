<template>
  <modal
    ref="deleteModal"
    :show="showDeleteModifierItemModal"
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
        Delete Modifier Item
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
        Are you sure you want to delete this modifier item?
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer clear"
    >
      <button
        type="button"
        class="btn btn-primary"
        @click="deleteModifierItem()"
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
import ModifiersFunctions from '../../../../controllers/Modifiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal
  },
  props: {
    itemId: {
      type: Number
    }
  },
  data () {
    return {
      showDeleteModifierItemModal: false,
      errorMessage: '',
      customWidth: 90,
      deleting: false
    }
  },
  mounted () {
    this.showDeleteModifierItemModal = true
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
		 * To delete the modifier item and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    deleteModifierItem () {
      var deleteModifierItemVue = this
      this.deleting = true
      deleteModifierItemVue.clearError()

      ModifiersFunctions.deleteModifierItem(
        deleteModifierItemVue.itemId,
        deleteModifierItemVue.$root.appId,
        deleteModifierItemVue.$root.appSecret,
        deleteModifierItemVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            this.deleteModifierItemAndCloseModal()
            this.showDeleteSuccess(response.payload)
          } else {
            deleteModifierItemVue.errorMessage = response.message
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the modifier item',
            errorName: 'errorMessage',
            vue: deleteModifierItemVue,
            containerRef: 'deleteModal'
          })
        })
        .finally(() => {
          deleteModifierItemVue.deleting = false
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
      let text = 'The Modifier Item has been deleted'
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
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeDeleteModifierItemModal')
    },
    /**
		 * To close the modal and delete the modifier item.
		 * @function
		 * @returns {undefined}
		 */
    deleteModifierItemAndCloseModal () {
      this.$emit('deleteModifierItemAndCloseModal')
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

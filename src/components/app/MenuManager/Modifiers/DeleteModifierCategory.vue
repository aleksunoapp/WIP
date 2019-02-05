<template>
  <modal
    ref="deleteModal"
    :show="showDeleteModifierCategoryModal"
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
        Delete Modifier Category
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
        Are you sure you want to delete this modifier category?
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer clear"
    >
      <button
        type="button"
        class="btn btn-primary"
        @click="deleteModifierCategory()"
      >
        Delete
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
    passedModifierCategoryId: {
      type: Number
    }
  },
  data () {
    return {
      showDeleteModifierCategoryModal: false,
      errorMessage: '',
      customWidth: 90
    }
  },
  mounted () {
    this.showDeleteModifierCategoryModal = true
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
		 * To delete the modifier category and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    deleteModifierCategory () {
      var deleteModifierCategoryVue = this
      deleteModifierCategoryVue.clearError()

      ModifiersFunctions.deleteModifierCategory(
        deleteModifierCategoryVue.passedModifierCategoryId,
        deleteModifierCategoryVue.$root.appId,
        deleteModifierCategoryVue.$root.appSecret,
        deleteModifierCategoryVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            this.deleteModifierCategoryAndCloseModal()
            this.showDeleteSuccess(response.payload)
          } else {
            deleteModifierCategoryVue.errorMessage = response.message
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the modifier',
            errorName: 'errorMessage',
            vue: deleteModifierCategoryVue,
            containerRef: 'deleteModal'
          })
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
      let text = 'The Modifier has been deleted'
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
      this.$emit('closeDeleteModifierCategoryModal')
    },
    /**
		 * To close the modal and delete the modifier category.
		 * @function
		 * @returns {undefined}
		 */
    deleteModifierCategoryAndCloseModal () {
      this.$emit('deleteModifierCategoryAndCloseModal')
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

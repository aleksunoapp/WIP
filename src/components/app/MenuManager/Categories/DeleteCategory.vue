<template>
  <modal
    ref="deleteModal"
    :show="showDeleteCategoryModal"
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
        Delete Category
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
        Are you sure you want to delete this category?
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
        @click="deleteCategory()"
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
import CategoriesFunctions from '../../../../controllers/Categories'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal
  },
  props: {
    passedCategoryId: {
      type: Number
    }
  },
  data () {
    return {
      showDeleteCategoryModal: false,
      deleting: false,
      errorMessage: '',
      customWidth: 90
    }
  },
  mounted () {
    this.showDeleteCategoryModal = true
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
		 * To delete the category and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    deleteCategory () {
      this.deleting = true
      var deleteCategoryVue = this
      deleteCategoryVue.clearError()

      CategoriesFunctions.deleteCategory(
        deleteCategoryVue.passedCategoryId,
        deleteCategoryVue.$root.appId,
        deleteCategoryVue.$root.appSecret,
        deleteCategoryVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            this.showDeleteSuccess(response.payload)
            this.deleteCategoryAndCloseModal()
          } else {
            deleteCategoryVue.errorMessage = response.message
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the category',
            errorName: 'errorMessage',
            vue: deleteCategoryVue,
            containerRef: 'deleteModal'
          })
        })
        .finally(() => {
          deleteCategoryVue.deleting = false
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
      let text = 'The Category has been deleted'
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
      this.$emit('closeDeleteCategoryModal')
    },
    /**
		 * To close the modal and delete the category.
		 * @function
		 * @returns {undefined}
		 */
    deleteCategoryAndCloseModal () {
      this.$emit('deleteCategoryAndCloseModal')
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

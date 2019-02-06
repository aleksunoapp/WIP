<template>
  <modal
    ref="deleteModal"
    :show="showDeleteMenuModal"
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
        Delete Menu
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
        Are you sure you want to delete this menu?
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
        @click="deleteMenu()"
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
import MenusFunctions from '../../../../controllers/Menus'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal
  },
  props: {
    passedMenuId: {
      type: Number
    }
  },
  data () {
    return {
      showDeleteMenuModal: false,
      deleting: false,
      errorMessage: '',
      customWidth: 90
    }
  },
  mounted () {
    this.showDeleteMenuModal = true
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
		 * To delete the menu and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    deleteMenu () {
      this.deleting = true
      var deleteMenuVue = this
      deleteMenuVue.clearError()

      MenusFunctions.deleteMenu(
        deleteMenuVue.passedMenuId,
        deleteMenuVue.$root.appId,
        deleteMenuVue.$root.appSecret,
        deleteMenuVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            this.showDeleteSuccess(response.payload)
            this.deleteMenuAndCloseModal()
          } else {
            deleteMenuVue.errorMessage = response.message
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the menu',
            errorName: 'errorMessage',
            vue: deleteMenuVue,
            containerRef: 'deleteModal'
          })
        })
        .finally(() => {
          deleteMenuVue.deleting = false
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
      let text = 'The Menu has been deleted'
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
      this.$emit('closeDeleteMenuModal')
    },
    /**
		 * To close the modal and delete the menu.
		 * @function
		 * @returns {undefined}
		 */
    deleteMenuAndCloseModal () {
      this.$emit('deleteMenuAndCloseModal')
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

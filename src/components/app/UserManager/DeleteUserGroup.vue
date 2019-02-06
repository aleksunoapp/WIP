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
        Delete Group
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          v-if="!deleted"
          key="a"
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
            Are you sure you want to delete this group?
          </div>
        </div>
        <div
          v-if="deleted"
          key="b"
        >
          <div
            class="swal2-icon swal2-success swal2-animate-success-icon"
            style="display: block;"
          >
            <div
              class="swal2-success-circular-line-left"
              style="background: rgb(255, 255, 255);"
            />
            <span class="swal2-success-line-tip swal2-animate-success-line-tip" />
            <span class="swal2-success-line-long swal2-animate-success-line-long" />
            <div class="swal2-success-ring" />
            <div
              class="swal2-success-fix"
              style="background: rgb(255, 255, 255);"
            />
            <div
              class="swal2-success-circular-line-right"
              style="background: rgb(255, 255, 255);"
            />
          </div>
        </div>
      </transition>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer clear"
    >
      <button
        v-show="!deleted"
        type="button"
        class="btn btn-primary"
        :disabled="deleting"
        @click="deleteGroup()"
      >
        Delete
        <i
          v-show="deleting"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
      <button
        v-show="deleted"
        type="button"
        class="btn btn-default"
        @click="deleteGroupAndCloseModal()"
      >
        Close
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from '../../modules/Modal'
import UserGroupFunctions from '../../../controllers/UserGroups'
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
      customWidth: 90,
      deleted: false
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
    deleteGroup () {
      this.deleting = true
      var deleteGroupVue = this
      deleteGroupVue.clearError()

      UserGroupFunctions.deleteGroup(
        deleteGroupVue.selectedPromotionId,
        deleteGroupVue.$root.appId,
        deleteGroupVue.$root.appSecret,
        deleteGroupVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            deleteGroupVue.deleted = response.payload.pending_approval
            deleteGroupVue.deleteGroupAndCloseModal()
            deleteGroupVue.showDeleteSuccess(response.payload)
          } else {
            deleteGroupVue.errorMessage = response.message
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the group',
            errorName: 'errorMessage',
            vue: deleteGroupVue,
            containerRef: 'modal'
          })
        })
        .finally(() => {
          deleteGroupVue.deleting = false
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
      let text = 'The Country has been deleted'
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
      this.$emit('closeDeleteGroupModal')
    },
    /**
		 * To close the modal and delete the promotion.
		 * @function
		 * @returns {undefined}
		 */
    deleteGroupAndCloseModal () {
      this.$emit('deleteGroupAndCloseModal', this.selectedPromotionId)
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

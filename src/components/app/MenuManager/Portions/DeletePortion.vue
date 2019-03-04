<template>
  <modal
    ref="modal"
    :show="show"
    effect="fade"
    @closeOnEscape="close"
  >
    <div
      slot="modal-header"
      class="modal-header center"
    >
      <button
        type="button"
        class="close"
        @click="close()"
      >
        <span>&times;</span>
      </button>
      <h4
        class="modal-title center"
      >
        Delete
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <div class="col-xs-12">
        <div
          v-show="errorMessage"
          ref="errorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click="clearError('errorMessage')"
          />
          <span>{{ errorMessage }}</span>
        </div>
        <div
          class="col-md-12"
        >
          <p>Are you sure you want to delete {{ portion.name }}?</p>
        </div>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        type="button"
        class="btn btn-primary"
        :disabled="deleting"
        @click="deletePortion()"
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
import Modal from '@/components/modules/Modal'
import PortionsFunctions from '@/controllers/Portions'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  name: 'DeletePortion',
  components: {
    Modal
  },
  props: {
    portion: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      show: false,
      errorMessage: '',
      deleting: false
    }
  },
  mounted () {
    this.show = true
  },
  methods: {
    /**
     * To delete a portion in the database
     * @function
     * @param {object} portion - The portion to delete
     * @returns {undefined}
     */
    deletePortion () {
      this.deleting = true
      const portionsVue = this
      PortionsFunctions.deletePortion(portionsVue.portion)
        .then(response => {
          portionsVue.update()
          portionsVue.close()
          portionsVue.showDeleteSuccess(response.payload)
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the Portion',
            errorName: 'errorMessage',
            vue: portionsVue,
            containerRef: 'deleteModal'
          })
        })
        .finally(() => {
          portionsVue.deleting = false
        })
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    showDeleteSuccess (payload = {}) {
      if (!payload) { payload = {} }
      let title = 'Success'
      let text = 'The Portion has been deleted'
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
     * To clear the current error.
     * @function
     * @param {string} name - Name of the error variable
     * @returns {undefined}
     */
    clearError (name) {
      this[name] = ''
    },
    /**
     * To notify parent the list needs to be re-fetched
     * @function
     * @returns {undefined}
     */
    update () {
      this.$emit('update')
    },
    /**
     * To notify the parent to close the modal
     * @function
     * @returns {undefined}
     */
    close () {
      this.$emit('close')
    }
  }
}
</script>

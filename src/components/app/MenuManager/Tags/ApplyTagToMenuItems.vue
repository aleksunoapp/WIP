<template>
  <modal
    ref="modal"
    :show="show"
    effect="fade"
    :width="900"
    :full-height="true"
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
        Apply Tag {{ tag.name }} To Menu Items
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body height-100"
    >
      <div class="row">
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
        </div>
      </div>
      <div class="alert alert-info">
        The Tag will be applied to <span class="bold">
          all
        </span> Items with SKUs that match SKUs of Items you select.
      </div>
      <menu-item-picker
        :show-sku="true"
        @update="itemsSelected"
      />
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        type="button"
        class="btn btn-primary"
        @click="close()"
      >
        Close
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="save()"
      >
        Save
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/modules/Modal'
import MenuItemPicker from '@/components/modules/MenuItemPicker'
import TagsFunctions from '@/controllers/Tags'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal,
    MenuItemPicker
  },
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      show: false,
      errorMessage: '',
      selected: []
    }
  },
  mounted () {
    this.show = true
  },
  methods: {
    /**
     * To save current selection of items
     * @function
     * @param selected - Array of selected SKUs
     * @returns {undefined}
     */
    itemsSelected (selected) {
      this.selected = selected.map(item => item.sku)
    },
    /**
     * To clear the current error.
     * @function
     * @param name - Name of the error variable
     * @returns {undefined}
     */
    clearError (name) {
      this[name] = ''
    },
    /**
     * To create a new tag.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    save () {
      this.clearError('errorMessage')

      const _this = this
      if (!_this.selected.length) {
        _this.errorMessage = 'Select at least one item'
        return
      }
      TagsFunctions.applyTagToMenuItems({
        itemSkus: _this.selected,
        tagId: _this.tag.id
      })
        .then(response => {
          _this.close()
          _this.confirm(response.payload)
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not apply the Tag',
            errorName: 'errorMessage',
            vue: _this,
            containerRef: 'modal'
          })
        })
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    confirm (payload = {}) {
      let title = 'Success'
      let text = 'The Tag has been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The changes have been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
     * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
     * @function
     * @returns {undefined}
     */
    close () {
      this.$emit('close')
    }
  }
}
</script>

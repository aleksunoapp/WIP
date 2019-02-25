<template>
  <modal
    ref="modal"
    :show="show"
    effect="fade"
    @closeOnEscape="close"
  >
    <div
      slot="modal-header"
      class="modal-header"
    >
      <button
        type="button"
        class="close"
        @click="close()"
      >
        <span>&times;</span>
      </button>
      <h4 class="modal-title center">
        Select Permissions for {{ discount.name }}
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <form role="form">
        <div class="row">
          <div class="col-md-12">
            <div
              v-show="errorMessage.length"
              ref="errorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                @click.prevent="clearError('errorMessage')"
              />
              <span>{{ errorMessage }}</span>
            </div>
          </div>
          <div class="col-md-12 picker">
            <loading-screen :show="loading" />
            <permissions-picker
              v-if="!loading"
              :previously-selected="previous"
              @selected="update"
            />
          </div>
        </div>
      </form>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer clear"
    >
      <button
        v-if="!$root.permissions['stores discounts permission sync']"
        type="button"
        class="btn blue"
        @click="close()"
      >
        Close
      </button>
      <button
        v-else
        type="submit"
        class="btn blue"
        :disabled="saving"
        @click="save()"
      >
        Save
        <i
          v-show="saving"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>

<script>
import ajaxErrorHandler from '@/controllers/ErrorController'
import DiscountsFunctions from '@/controllers/Discounts'
import LoadingScreen from '@/components/modules/LoadingScreen'
import Modal from '@/components/modules/Modal'
import PermissionsPicker from '@/components/app/ApprovalsManager/PermissionsPicker'

export default {
  name: 'AssignPermissionsToDiscount',
  components: {
    LoadingScreen,
    Modal,
    PermissionsPicker
  },
  props: {
    discount: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    errorMessage: '',
    show: false,
    loading: false,
    saving: false,
    previous: [],
    permissions: []
  }),
  created () {
    this.getPermissions()
  },
  mounted () {
    this.show = true
  },
  methods: {
    /**
     * To clear the current error.
     * @function
     * @param {object} errorMessageName - The error message to be cleared.
     * @returns {undefined}
     */
    clearError (errorMessageName) {
      this[errorMessageName] = ''
    },
    /**
     * To show the modal to edit an discount details.
     * @function
     * @param {object} discount - The selected discount.
     * @param {object} event - The click event that prompted this function.
     * @returns {undefined}
     */
    editDiscount (discount, event) {
      event.stopPropagation()
      this.discountToEdit = { ...discount }
      this.show = true
    },
    /**
     * To save user's selection of permissions.
     * @function
     * @param {object} selection - The selected permissions.
     * @returns {undefined}
     */
    update (selection) {
      this.permissions = selection
    },
    /**
     * To check if the discount data is valid before submitting to the backend.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    validate () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.permissions.length) {
          reject('Select at least one permission')
        }
        resolve('Hurray')
      })
    },
    /**
     * To update a discount.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    getPermissions () {
      this.loading = true
      var _this = this
      DiscountsFunctions.getPermissionsOfDiscount(this.discount.id)
        .then(response => {
          this.previous = response.payload.permissions.map(permission => permission.id)
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not update the discount',
            errorName: 'errorMessage',
            vue: _this,
            containerRef: 'modal'
          })
        })
        .finally(() => {
          _this.loading = false
        })
    },
    /**
     * To update a discount.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    save () {
      var _this = this
      _this.clearError('errorMessage')

      return _this
        .validate()
        .then(response => {
          this.saving = true

          DiscountsFunctions.assignPermissionsToDiscount({
            id: this.discount.id,
            data: { permissions: this.permissions }
          })
            .then(response => {
              _this.close()
              _this.showSuccess(response.payload)
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the discount',
                errorName: 'errorMessage',
                vue: _this,
                containerRef: 'modal'
              })
            })
            .finally(() => {
              _this.saving = false
            })
        })
        .catch(reason => {
          console.log({ reason })
          _this.errorMessage = reason
          _this.$scrollTo(
            _this.$refs.errorMessage,
            1000,
            {
              force: false
            }
          )
        })
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    showSuccess (payload = {}) {
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'Saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'Sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
     * To close the modal for editing a promotion.
     * @function
     * @returns {undefined}
     */
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
.picker {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

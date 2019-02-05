<template>
  <modal
    ref="editModal"
    :show="showEditTierModal"
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
        Edit Menu Tier
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body height-mod"
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
        <fieldset :disabled="!$root.permissions['menu_manager tiers update']">
          <div class="form-group form-md-line-input form-md-floating-label">
            <input
              id="form_control_1"
              v-model="menuTierToBeEdited.name"
              type="text"
              class="form-control input-sm edited"
            >
            <label for="form_control_1">
              Menu Tier Name
            </label>
          </div>
          <div class="form-group form-md-line-input form-md-floating-label">
            <input
              id="form_control_2"
              v-model="menuTierToBeEdited.description"
              type="text"
              class="form-control input-sm edited"
            >
            <label for="form_control_2">
              Menu Tier Description
            </label>
          </div>
        </fieldset>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer clear"
    >
      <button
        v-if="!$root.permissions['menu_manager tiers update']"
        type="button"
        class="btn btn-primary"
        @click="closeModal()"
      >
        Close
      </button>
      <button
        v-else
        type="button"
        class="btn btn-primary"
        @click="updateMenuTier()"
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
import Modal from '../../../modules/Modal'
import MenuTiersFunctions from '../../../../controllers/MenuTiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal
  },
  props: {
    passedTierId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showEditTierModal: false,
      menuTierToBeEdited: {
        image_url: ''
      },
      errorMessage: '',
      saving: false
    }
  },
  created () {
    // get menu tier details
    this.getMenuTierDetails()
  },
  mounted () {
    this.showEditTierModal = true
  },
  methods: {
    /**
		 * To check if the menu data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateTierData () {
      var editMenuTierVue = this
      return new Promise(function (resolve, reject) {
        if (!editMenuTierVue.menuTierToBeEdited.name.length) {
          reject('Menu tier name cannot be blank')
        } else if (!editMenuTierVue.menuTierToBeEdited.description.length) {
          reject('Menu tier description cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
    clearError () {
      this.errorMessage = ''
    },
    /**
		 * To get the details of the menu tier to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getMenuTierDetails () {
      var editMenuTierVue = this
      MenuTiersFunctions.getMenuTierDetails(
        editMenuTierVue.passedTierId,
        editMenuTierVue.$root.appId,
        editMenuTierVue.$root.appSecret,
        editMenuTierVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            editMenuTierVue.menuTierToBeEdited = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch tier info',
            errorName: 'errorMessage',
            vue: editMenuTierVue,
            containerRef: 'editModal'
          })
        })
    },
    /**
		 * To update the menu and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    updateMenuTier () {
      var editMenuTierVue = this

      return editMenuTierVue
        .validateTierData()
        .then(response => {
          editMenuTierVue.saving = true
          MenuTiersFunctions.updateMenuTier(
            editMenuTierVue.menuTierToBeEdited,
            editMenuTierVue.$root.appId,
            editMenuTierVue.$root.appSecret,
            editMenuTierVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                this.closeModalAndUpdate()
                this.showCreateSuccess(response.payload)
              } else {
                editMenuTierVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the tier',
                errorName: 'errorMessage',
                vue: editMenuTierVue,
                containerRef: 'editModal'
              })
            })
            .finally(() => {
              editMenuTierVue.saving = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          editMenuTierVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showCreateSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Menu Tier has been saved'
      let type = 'success'

      if (payload.pending_approval) {
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
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeEditTierModal')
    },
    /**
		 * To close the modal and update the menu details.
		 * @function
		 * @returns {undefined}
		 */
    closeModalAndUpdate () {
      this.$emit('updateMenuTier')
    }
  }
}
</script>
<style scoped>
.height-mod {
  height: 160px;
}
</style>

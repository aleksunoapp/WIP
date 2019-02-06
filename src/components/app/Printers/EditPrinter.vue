<template>
  <modal
    ref="modal"
    :show="showEditPrinterModal"
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
        Edit Printer
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
      <fieldset :disabled="!$root.permissions['printers update']">
        <div class="form-group form-md-line-input form-md-floating-label">
          <input
            id="form_control_1"
            v-model="printerToBeEdited.printer_name"
            type="text"
            class="form-control input-sm edited"
          >
          <label for="form_control_1">
            Printer Name
          </label>
        </div>
        <div class="form-group form-md-line-input form-md-floating-label">
          <input
            id="form_control_2"
            v-model="printerToBeEdited.printer_key"
            type="text"
            class="form-control input-sm edited"
          >
          <label for="form_control_2">
            Printer Key
          </label>
        </div>
        <div class="form-group form-md-line-input form-md-floating-label">
          <input
            id="form_control_3"
            v-model="printerToBeEdited.printer_serialno"
            type="text"
            class="form-control input-sm edited"
          >
          <label for="form_control_3">
            Printer Serial Number
          </label>
        </div>
        <div class="form-group form-md-line-input form-md-floating-label">
          <input
            id="form_control_4"
            v-model="printerToBeEdited.copies"
            type="text"
            class="form-control input-sm edited"
          >
          <label for="form_control_4">
            Copies
          </label>
        </div>
      </fieldset>
      <div class="side-by-side-wrapper">
        <p class="paper-width-label">
          Paper width:
        </p>
        <el-select
          v-model="printerToBeEdited.paper_width"
          placeholder="select"
          size="mini"
          :disabled="!$root.permissions['printers update']"
        >
          <el-option
            label="58mm"
            value="58"
          />
          <el-option
            label="80mm"
            value="80"
          />
        </el-select>
      </div>

      <div class="side-by-side-wrapper">
        <p class="paper-width-label">
          Version:
        </p>
        <el-select
          v-model="printerToBeEdited.version"
          placeholder="select"
          size="mini"
          :disabled="!$root.permissions['printers update']"
        >
          <el-option
            label="1"
            value="1"
          />
          <el-option
            label="2"
            value="2"
          />
        </el-select>
      </div>

      <div class="side-by-side-wrapper">
        <p class="side-by-side-item status-label">
          Status:
        </p>
        <el-switch
          v-model="printerToBeEdited.status"
          :disabled="!$root.permissions['printers update']"
          active-color="#0c6"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
          active-text="Enabled"
          inactive-text="Disabled"
        />
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-if="!$root.permissions['printers update']"
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
        :disabled="updating"
        @click="updatePrinter()"
      >
        Save
        <i
          v-show="updating"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from '../../modules/Modal'
import PrintersFunctions from '../../../controllers/Printers'
import Dropdown from '../../modules/Dropdown'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal,
    Dropdown
  },
  props: {
    printerId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      showEditPrinterModal: false,
      updating: false,
      printerToBeEdited: {
        location_id: '',
        printer_serialno: '',
        printer_key: '',
        printer_name: '',
        created_by: '',
        paper_width: '',
        copies: '1',
        status: 0,
        version: ''
      },
      errorMessage: ''
    }
  },
  created () {
    // get printer details by printer id passed as route param
    this.getPrinterDetails()
  },
  mounted () {
    this.showEditPrinterModal = true
  },
  methods: {
    /**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validatePrinterData () {
      var addPrinterVue = this
      return new Promise(function (resolve, reject) {
        if (!addPrinterVue.printerToBeEdited.printer_name.length) {
          reject('Printer name cannot be blank')
        } else if (!addPrinterVue.printerToBeEdited.printer_key.length) {
          reject('Printer key cannot be blank')
        } else if (!addPrinterVue.printerToBeEdited.printer_serialno.length) {
          reject('Printer serial number cannot be blank')
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
		 * To get the details of the category to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getPrinterDetails () {
      var editPrinterVue = this
      PrintersFunctions.getPrinterDetails(
        editPrinterVue.printerId,
        editPrinterVue.$root.appId,
        editPrinterVue.$root.appSecret,
        editPrinterVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            editPrinterVue.printerToBeEdited = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch printer info',
            errorName: 'errorMessage',
            vue: editPrinterVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To update the category and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    updatePrinter () {
      var editPrinterVue = this
      editPrinterVue.clearError()
      editPrinterVue.printerToBeEdited.updated_by =
				editPrinterVue.$root.createdBy

      return editPrinterVue
        .validatePrinterData()
        .then(response => {
          editPrinterVue.updating = true
          PrintersFunctions.updatePrinter(
            editPrinterVue.printerToBeEdited,
            editPrinterVue.$root.appId,
            editPrinterVue.$root.appSecret,
            editPrinterVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                this.closeModalAndUpdate()
                this.showEditSuccess(response.payload)
              } else {
                editPrinterVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the printer',
                errorName: 'errorMessage',
                vue: editPrinterVue,
                containerRef: 'modal'
              })
            })
            .finally(() => {
              editPrinterVue.updating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          editPrinterVue.errorMessage = reason
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
    showEditSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Printer has been saved'
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
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeEditPrinterModal')
    },
    /**
		 * To close the modal and emit the updated category object to the parent.
		 * @function
		 * @returns {undefined}
		 */
    closeModalAndUpdate () {
      this.$emit('updatePrinter', this.printerToBeEdited)
    }
  }
}
</script>

<style scoped>
.side-by-side-wrapper {
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.side-by-side-item {
  max-width: 45%;
}
.paper-width-label {
  margin: 0;
  padding: 0.5rem 1rem 0.5rem 0;
  color: rgb(153, 153, 153);
}
.dropdown.side-by-side-item {
  margin-left: 10px;
}
.status-label {
  margin: 0 5px 0 0;
  color: rgb(153, 153, 153);
}
</style>

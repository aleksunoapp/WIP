<template>
	<modal :show="showEditPrinterModal" effect="fade" @closeOnEscape="closeModal" ref="modal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Edit Printer</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-show="errorMessage" ref="errorMessage">
			    <button class="close" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<fieldset :disabled="!$root.permissions['printers update']">
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm edited" id="form_control_1" v-model="printerToBeEdited.printer_name">
					<label for="form_control_1">Printer Name</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm edited" id="form_control_2" v-model="printerToBeEdited.printer_key">
					<label for="form_control_2">Printer Key</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm edited" id="form_control_3" v-model="printerToBeEdited.printer_serialno">
					<label for="form_control_3">Printer Serial Number</label>
				</div>
				<div class="form-group form-md-line-input form-md-floating-label">
					<input type="text" class="form-control input-sm edited" id="form_control_4" v-model="printerToBeEdited.copies">
					<label for="form_control_4">Copies</label>
				</div>
			</fieldset>
			<div class="side-by-side-wrapper">
				<p class="paper-width-label">Paper width:</p>
				<el-dropdown trigger="click" @command="updatePrinterToBeEditedPaperWidth" size="mini" :show-timeout="50" :hide-timeout="50">
					<el-button size="mini">
						{{ printerToBeEdited.paper_width }}mm
						<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="58">58mm</el-dropdown-item>
						<el-dropdown-item command="80">80mm</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			<div class="side-by-side-wrapper">
				<p class="side-by-side-item status-label">Status:</p>
				<el-switch
					:disabled="!$root.permissions['printers update']"
					v-model="printerToBeEdited.status"
					active-color="#0c6"
					inactive-color="#ff4949"
					:active-value="1"
					:inactive-value="0"
					active-text="Enabled"
					inactive-text="Disabled">
				</el-switch>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button 
				v-if="!$root.permissions['printers update']"
				type="button" 
				class="btn btn-primary" 
				@click="closeModal()">
				Close
			</button>
			<button 
				v-else
				type="button" 
				class="btn btn-primary" 
				@click="updatePrinter()"
				:disabled="updating">
				Save
				<i 
					v-show="updating"
					class="fa fa-spinner fa-pulse fa-fw">
				</i>
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
				status: 0
			},
			errorMessage: ''
		}
	},
	props: {
		printerId: {
			type: Number,
			required: true
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
		 * To update the paper_width property of printerToBeEdited.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updatePrinterToBeEditedPaperWidth (value) {
			if (this.$root.permissions['printers update']) {
				this.printerToBeEdited.paper_width = value
			}
		},
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
			PrintersFunctions.getPrinterDetails(editPrinterVue.printerId, editPrinterVue.$root.appId, editPrinterVue.$root.appSecret, editPrinterVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editPrinterVue.printerToBeEdited = response.payload
				}
			}).catch(reason => {
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
			editPrinterVue.printerToBeEdited.updated_by = editPrinterVue.$root.createdBy

			return editPrinterVue.validatePrinterData()
			.then(response => {
				editPrinterVue.updating = true
				PrintersFunctions.updatePrinter(editPrinterVue.printerToBeEdited, editPrinterVue.$root.appId, editPrinterVue.$root.appSecret, editPrinterVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editPrinterVue.errorMessage = response.message
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the printer',
						errorName: 'errorMessage',
						vue: editPrinterVue,
						containerRef: 'modal'
					})
				}).finally(() => {
					editPrinterVue.updating = false
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editPrinterVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
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
	},
	components: {
		Modal,
		Dropdown
	}
}
</script>

<style scoped>
.side-by-side-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-end;
	margin-bottom: 20px;
}
.side-by-side-item {
	max-width: 45%;
}
.paper-width-label {
	margin-bottom: 0.5rem;
	margin-right: 0.5rem;
	color: rgb(153, 153, 153);
}
.dropdown.side-by-side-item {
	margin-left: 10px;
}
@media (max-width: 1150px) {
	.side-by-side-wrapper {
		flex-direction: column;
		align-items: center;
	}
	.side-by-side-item {
		max-width: 100%;
	}
	.dropdown.side-by-side-item {
		margin-left: 0px;
	}
}
.status-label {
	margin: 0 5px 0 0;
	color: rgb(153, 153, 153);
}
</style>

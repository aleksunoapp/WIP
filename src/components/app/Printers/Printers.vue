<template>
	<div>
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<h1 class='page-title'>Printers</h1>
		<div class="note note-info">
			<p>Create and manage printers for your store.</p>
		</div>

		<!-- BEGIN CREATE NEW PRINTER-->
		<div class="portlet box blue-hoki"
		     v-if="$root.activeLocation && $root.activeLocation.id && $root.permissions['printers create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleNewPrinterPanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Set Up a New Printer
				</div>
				<div class="tools">
					<a :class="{'expand': !newPrinterCollapse, 'collapse': newPrinterCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body"
			     :class="{'display-hide': newPrinterCollapse}">
				<form role="form"
				      @submit.prevent="createNewPrinter()">
					<div class="form-body row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="errorMessage"
							     ref="errorMessage">
								<button class="close"
								        @click="clearError('errorMessage')"></button>
								<span>{{errorMessage}}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newPrinter.printer_name.length}"
								       id="form_control_1"
								       v-model="newPrinter.printer_name">
								<label for="form_control_1">Printer Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newPrinter.printer_key.length}"
								       id="form_control_2"
								       v-model="newPrinter.printer_key">
								<label for="form_control_2">Printer Key</label>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newPrinter.printer_serialno.length}"
								       id="form_control_3"
								       v-model="newPrinter.printer_serialno">
								<label for="form_control_3">Printer Serial Number</label>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newPrinter.copies.length}"
								       id="form_control_4"
								       v-model="newPrinter.copies">
								<label for="form_control_4">Copies</label>
							</div>
						</div>
						<div class="col-md-6">
							<div class="side-by-side-wrapper">
								<p class="paper-width-label">Paper width:</p>
								<el-dropdown trigger="click"
								             @command="updateNewPrinterPaperWidth"
								             size="mini"
								             :show-timeout="50"
								             :hide-timeout="50">
									<el-button size="mini">
										{{ newPrinter.paper_width }}
										<span v-if="newPrinter.paper_width !== 'Select'">mm</span>
										<i class="el-icon-arrow-down el-icon--right"></i>
									</el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="58">58mm</el-dropdown-item>
										<el-dropdown-item command="80">80mm</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
						<div class="col-md-6">
							<div class="side-by-side-wrapper">
								<p class="side-by-side-item status-label">Status:</p>
								<el-switch v-model="newPrinter.status"
								           active-color="#0c6"
								           inactive-color="#ff4949"
								           :active-value="1"
								           :inactive-value="0"
								           active-text="Enabled"
								           inactive-text="Disabled">
								</el-switch>
							</div>
						</div>
					</div>
					<div class="form-actions right margin-top-20">
						<button type="submit"
						        class="btn blue"
						        :disabled="creating">
							Create
							<i v-show="creating"
							   class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE NEW PRINTER-->

		<loading-screen :show="displayPrinters"
		                :color="'#2C3E50'"
		                :display="'inline'"></loading-screen>
		<div class="alert alert-info center margin-top-20"
		     v-if="!$root.activeLocation.id">
			<h4>No Store Selected</h4>
			<p>Please select a store from the location panel on the right to view its printers</p>
		</div>
		<div v-if="$root.activeLocation && $root.activeLocation.id && storePrinters.length && !displayPrinters">
			<div class="portlet light portlet-fit bordered margin-top-20">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image-main">
						<img src="../../../../static/client_logo.png">
					</div>
					<div class="caption">
						<span class="caption-subject font-default bold uppercase">Printers</span>
						<div class="caption-desc font-grey-cascade">View and manage printers for the selected store.</div>
					</div>
				</div>
				<div class="portlet-body">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="listErrorMessage"
							     ref="listErrorMessage">
								<button class="close"
								        @click="clearError('listErrorMessage')"></button>
								<span>{{listErrorMessage}}</span>
							</div>
						</div>
					</div>
					<div class="mt-element-list">
						<div class="mt-list-container list-news">
							<ul>
								<li class="mt-list-item actions-at-left margin-top-15"
								    v-for="printer in storePrinters"
								    :id="'printer-' + printer.id"
								    :key="printer.id">
									<div class="list-item-actions">
										<el-tooltip v-if="$root.permissions['printers update']"
										            content="Edit"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="editPrinter(printer)">
												<i class="fa fa-lg fa-pencil"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['printers read'] && !$root.permissions['printers update']"
										            content="View"
										            effect="light"
										            placement="right">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="editPrinter(printer)">
												<i class="fa fa-lg fa-eye"></i>
											</a>
										</el-tooltip>
									</div>
									<div class="list-datetime bold uppercase font-red">
										<span>{{ printer.printer_name }}</span>
									</div>
									<div class="list-item-content height-mod">
										<div class="col-md-5">
											<span>
												<strong>Printer Serial Number: </strong>{{ printer.printer_serialno }}
											</span><br>
											<span>
												<strong>Paper Width: </strong>{{ printer.paper_width }}mm
											</span><br>
										</div>
										<div class="col-md-5">
											<span>
												<strong>Status: </strong>
												<span v-if="printer.status === 1">ON</span>
												<span v-else>OFF</span>
											</span><br>
											<span>
												<strong>Copies: </strong>{{ printer.copies }}
											</span><br>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="$root.activeLocation.id && !storePrinters.length && !displayPrinters">
			<no-results :show="true"
			            :type="'printers'"></no-results>
		</div>
		<edit-printer v-if="showEditPrinterModal"
		              @closeEditPrinterModal="closeEditPrinterModal"
		              @updatePrinter="updatePrinter"
		              :printerId="selectedPrinterId"></edit-printer>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import PrintersFunctions from '../../../controllers/Printers'
import LoadingScreen from '../../modules/LoadingScreen'
import EditPrinter from './EditPrinter'
import Dropdown from '../../modules/Dropdown'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Printers', link: false }],
			displayPrinters: false,
			listErrorMessage: '',
			storePrinters: [],
			showEditPrinterModal: false,
			selectedPrinterId: 0,
			creating: false,
			newPrinter: {
				printer_serialno: '',
				printer_key: '',
				printer_name: '',
				created_by: this.$root.createdBy,
				paper_width: 'Select',
				copies: '1',
				status: 1
			},
			errorMessage: '',
			newPrinterCollapse: true
		}
	},
	computed: {
		activeLocationId: function () {
			return this.$root.activeLocation.id
		}
	},
	watch: {
		activeLocationId: function () {
			if (this.$root.activeLocation.id) {
				this.getStorePrinters()
			}
		}
	},
	mounted () {
		if (this.$root.activeLocation && this.$root.activeLocation.id) {
			this.getStorePrinters()
		}
	},
	methods: {
		/**
		 * To update the paper_width property of newPrinter.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateNewPrinterPaperWidth (value) {
			this.newPrinter.paper_width = value
		},
		/**
		 * To reset the create form.
		 * @function
		 * @returns {undefined}
		 */
		resetForm () {
			this.newPrinter.printer_serialno = ''
			this.newPrinter.printer_key = ''
			this.newPrinter.printer_name = ''
			this.newPrinter.paper_width = 'Select'
			this.newPrinter.copies = '1'
			this.newPrinter.status = 1
		},
		/**
		 * To get the printers for a store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStorePrinters () {
			this.displayPrinters = true
			var printersVue = this
			PrintersFunctions.getStorePrinters(
				printersVue.$root.activeLocation.id,
				printersVue.$root.appId,
				printersVue.$root.appSecret,
				printersVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						printersVue.storePrinters = response.payload
						printersVue.displayPrinters = false
					} else {
						printersVue.displayPrinters = false
					}
				})
				.catch(reason => {
					printersVue.displayPrinters = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not delete the modifier',
						errorName: 'listErrorMessage',
						vue: printersVue
					})
				})
		},
		/**
		 * To show the modal to edit printer details.
		 * @function
		 * @param {object} printer - The selected printer.
		 * @returns {undefined}
		 */
		editPrinter (printer) {
			this.showEditPrinterModal = true
			this.selectedPrinterId = printer.id
		},
		/**
		 * To add the newly created printer to the printers list.
		 * @function
		 * @param {object} val - The printer object to be added to the list.
		 * @returns {undefined}
		 */
		addPrinter (val) {
			this.storePrinters = [...this.storePrinters, val]
		},
		/**
		 * To close the modal to edit printer details and update the selected printer on the printers list.
		 * @function
		 * @param {object} val - The printer object to be updated on the list.
		 * @returns {undefined}
		 */
		updatePrinter (val) {
			this.showEditPrinterModal = false
			for (var i = 0; i < this.storePrinters.length; i++) {
				if (this.storePrinters[i].id === val.id) {
					this.storePrinters[i] = val
				}
			}
			$('#printer-' + val.id).addClass('highlight')
			setTimeout(function () {
				$('#printer-' + val.id).removeClass('highlight')
			}, 2000)
		},
		/**
		 * To close the modal to edit printer details.
		 * @function
		 * @returns {undefined}
		 */
		closeEditPrinterModal () {
			this.showEditPrinterModal = false
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validatePrinterData () {
			var addPrinterVue = this
			return new Promise(function (resolve, reject) {
				if (!addPrinterVue.newPrinter.printer_name.length) {
					reject('Printer name cannot be blank')
				} else if (!addPrinterVue.newPrinter.printer_key.length) {
					reject('Printer key cannot be blank')
				} else if (!addPrinterVue.newPrinter.printer_serialno.length) {
					reject('Printer serial number cannot be blank')
				} else if (
					!addPrinterVue.newPrinter.paper_width.length ||
					addPrinterVue.newPrinter.paper_width === 'Select'
				) {
					reject('Select paper width')
				} else if (!/^\+?(0|[1-9]\d*)$/.test(addPrinterVue.newPrinter.copies)) {
					reject('Select number of copies')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To add the new category to the menu and close the modal and redirect to the menus page.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createNewPrinter () {
			var addPrinterVue = this
			addPrinterVue.clearError('errorMessage')

			return addPrinterVue
				.validatePrinterData()
				.then(response => {
					addPrinterVue.creating = true
					addPrinterVue.newPrinter.location_id = this.$root.activeLocation.id
					PrintersFunctions.createNewPrinter(
						addPrinterVue.newPrinter,
						addPrinterVue.$root.appId,
						addPrinterVue.$root.appSecret,
						addPrinterVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								addPrinterVue.newPrinter.id = response.payload.new_printer_id
								addPrinterVue.addPrinter({ ...addPrinterVue.newPrinter })
								addPrinterVue.resetForm()
								addPrinterVue.showAlert(response.payload)
							} else {
								addPrinterVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add the printer',
								errorName: 'errorMessage',
								vue: addPrinterVue
							})
						})
						.finally(() => {
							addPrinterVue.creating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					addPrinterVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To toggle the create printer panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleNewPrinterPanel () {
			this.newPrinterCollapse = !this.newPrinterCollapse
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAlert (payload = {}) {
			let title = 'Success'
			let text = 'The Printer has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Printer has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		EditPrinter,
		NoResults,
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
.mt-element-list .list-news.mt-list-container ul > .mt-list-item:hover {
  background-color: rgb(255, 255, 255);
}
</style>

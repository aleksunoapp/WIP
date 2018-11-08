<template>
	<div>
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Portions</h1>
		<!-- END PAGE TITLE-->
		<div class="note note-info">
			<p>Create and manage portions for modifier items.</p>
		</div>
		<!-- BEGIN CREATE NEW MENU-->
		<div class="portlet box blue-hoki"
		     v-if="$root.permissions['menu_manager portions create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreatePortionPanel()">
				<div class="custom tools">
					<a :class="{'expand': !createPortionCollapse, 'collapse': createPortionCollapse}"></a>
				</div>
				<div class="caption">
					&emsp;Create A New Portion
				</div>
			</div>
			<div class="portlet-body"
			     :class="{'display-hide': createPortionCollapse}">
				<form role="form"
				      @submit.prevent="createPortion()">
					<div class="form-body row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="errorMessage">
								<button class="close"
								        @click.prevent="clearError('errorMessage')"></button>
								<span>{{errorMessage}}</span>
							</div>
						</div>
						<div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
							<resource-picker @open="toggleImageMode('newMenu', true)"
							                 @close="toggleImageMode('newMenu', false)"
							                 @selected="updateImage"
							                 :imageButton="true"
							                 :imageUrl="newPortion.icon_url"
							                 class="margin-top-15">
							</resource-picker>
						</div>
						<div class="col-md-5"
						     v-show="!imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newPortion.name.length}"
								       id="form_control_1"
								       v-model="newPortion.name">
								<label for="form_control_1">Portion Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newPortion.multiplier}"
								       id="form_control_2"
								       v-model="newPortion.multiplier">
								<label for="form_control_2">Portion Multiplier</label>
							</div>
						</div>
						<div class="col-md-5"
						     v-show="!imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
								<input type="number"
								       class="form-control input-sm"
								       :class="{'edited': newPortion.order}"
								       id="form_control_3"
								       v-model="newPortion.order">
								<label for="form_control_3">Portion Order</label>
							</div>
						</div>
					</div>
					<div class="form-actions right margin-top-20"
					     v-show="!imageMode.newMenu">
						<button type="submit"
						        class="btn blue">Create</button>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE NEW MENU-->
		<loading-screen :show="loadingPortionsData"
		                :color="'#2C3E50'"
		                :display="'inline'"></loading-screen>
		<div class="portlet light portlet-fit bordered margin-top-20"
		     v-if="!loadingPortionsData">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Portions</span>
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
				<div class="mt-element-list margin-top-15"
				     v-if="portions.length">
					<div class="mt-list-container list-news ext-1 no-border">
						<ul>
							<li class="mt-list-item actions-at-left margin-top-15"
							    v-for="portion in portions"
							    :id="'portion-' + portion.id"
							    :key="portion.id">
								<div class="list-item-actions">
									<el-tooltip v-if="$root.permissions['menu_manager portions update']"
									            content="Edit"
									            effect="light"
									            placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
										   @click="editPortion(portion)">
											<i class="fa fa-lg fa-pencil"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['menu_manager portions read'] && !$root.permissions['menu_manager portions update']"
									            content="View"
									            effect="light"
									            placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
										   @click="editPortion(portion)">
											<i class="fa fa-lg fa-eye"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['menu_manager portions add modifier items']"
									            content="Apply to multiple"
									            effect="light"
									            placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
										   @click="displayMenuTreeModal(portion, $event)">
											<i class="icon-layers"></i>
										</a>
									</el-tooltip>
								</div>
								<div class="list-thumb">
									<a v-if="portion.icon_url.length">
										<img alt=""
										     :src="portion.icon_url" />
									</a>
									<a v-else>
										<img src="../../../assets/img/app/image-placeholder.png">
									</a>
								</div>
								<div class="list-datetime bold uppercase font-red">
									<span>{{ portion.name }}</span>
								</div>
								<div class="list-item-content height-mod">
									<strong>Multipler:</strong>
									<span>{{ portion.multiplier }}</span>
								</div>

							</li>
						</ul>
					</div>
				</div>
				<div class="margin-top-20"
				     v-else>
					<no-results :show="!portions.length"
					            :type="'portions'"></no-results>
				</div>
			</div>
		</div>
		<edit-portion v-if="showEditPortionModal"
		              :selectedPortionId="selectedPortionId"
		              @updatePortion="updatePortion"
		              @closeEditPortionModal="closeEditPortionModal"></edit-portion>
		<modifier-tree v-if="showModifierTreeModal"
		               :selectedObject="selectedPortion"
		               :headerText="headerText"
		               :updateType="'portion'"
		               @closeModifierTreeModal="closeModifierTreeModal"></modifier-tree>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import Dropdown from '../../modules/Dropdown'
import NoResults from '../../modules/NoResults'
import Modal from '../../modules/Modal'
import LoadingScreen from '../../modules/LoadingScreen'
import PortionsFunctions from '../../../controllers/Portions'
import EditPortion from './Portions/EditPortion'
import ModifierTree from '../../modules/ModifierTree'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Menu Manager', link: false },
				{ name: 'Portions', link: false }
			],
			createPortionCollapse: true,
			errorMessage: '',
			loadingPortionsData: false,
			listErrorMessage: '',
			newPortion: {
				name: '',
				multiplier: '',
				icon_url: '',
				order: null
			},
			portions: [],
			showEditPortionModal: false,
			selectedPortionId: 0,
			showModifierTreeModal: false,
			selectedPortion: {},
			headerText: '',
			imageMode: {
				newMenu: false
			}
		}
	},
	mounted () {
		// get the list of available portions
		this.getPortions()
	},
	methods: {
		/**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @param {string} object - The name of the object the image is for
		 * @param {object} value - The open / closed value of the picker
		 * @returns {undefined}
		 */
		toggleImageMode (object, value) {
			this.imageMode[object] = value
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.newPortion.icon_url = val.image_url
		},
		/**
		 * To display the modal to apply a portion to multiple modifier items.
		 * @function
		 * @param {object} portion - The selected portion.
		 * @returns {undefined}
		 */
		displayMenuTreeModal (portion) {
			this.selectedPortion = portion
			this.headerText = "Portion '" + this.selectedPortion.name + "'"
			this.showModifierTreeModal = true
		},
		/**
		 * To close the menu tree modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModifierTreeModal () {
			this.showModifierTreeModal = false
		},
		/**
		 * To toggle the create portion panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePortionPanel () {
			this.createPortionCollapse = !this.createPortionCollapse
		},
		/**
		 * To get the list of available portions.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPortions () {
			this.loadingPortionsData = true
			var portionsVue = this
			portionsVue.portions = []
			PortionsFunctions.getPortions(
				portionsVue.$root.appId,
				portionsVue.$root.appSecret,
				portionsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						portionsVue.loadingPortionsData = false
						portionsVue.portions = response.payload
					} else {
						portionsVue.loadingPortionsData = false
					}
				})
				.catch(reason => {
					portionsVue.loadingPortionsData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch portions',
						errorName: 'listErrorMessage',
						vue: portionsVue
					})
				})
		},
		/**
		 * To check if the portion data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validatePortionData () {
			var portionsVue = this
			return new Promise(function (resolve, reject) {
				if (!portionsVue.newPortion.name.length) {
					reject('Portion name cannot be blank')
				} else if (!portionsVue.newPortion.icon_url.length) {
					reject('Portion icon URL cannot be blank')
				} else if (!$.isNumeric(portionsVue.newPortion.order)) {
					reject('Portion order should be numerical')
				} else if (!$.isNumeric(portionsVue.newPortion.multiplier)) {
					reject('Portion multiplier should be numerical')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new portion type.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createPortion () {
			var portionsVue = this
			portionsVue.clearError('errorMessage')

			return portionsVue
				.validatePortionData()
				.then(response => {
					PortionsFunctions.createPortion(
						portionsVue.newPortion,
						portionsVue.$root.appId,
						portionsVue.$root.appSecret,
						portionsVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								portionsVue.newPortion.id = response.payload.new_portion_id
								if (response.payload && response.payload.pending_approval !== true) {
									portionsVue.addPortion(portionsVue.newPortion)
								}
								portionsVue.showAlert(response.payload)
								portionsVue.clearNewPortion()
							} else {
								portionsVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add the portion',
								errorName: 'errorMessage',
								vue: portionsVue
							})
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					portionsVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To clear the new menu form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewPortion () {
			this.newPortion = {
				name: '',
				multiplier: '',
				icon_url: '',
				order: null
			}
		},
		/**
		 * To close the modal to create tags and add the newly created tag to the list.
		 * @function
		 * @param {object} val - The tag object to be added to the list.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		addPortion (val) {
			if (parseInt(val.order) > 0) {
				var done = false
				for (var i = 0; i < this.portions.length; i++) {
					if (parseInt(this.portions[i].order) < parseInt(val.order)) {
						this.portions.splice(i, 0, val)
						done = true
						break
					}
				}
				if (!done) {
					this.portions.push(val)
				}
			} else {
				this.portions.push(val)
			}
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAlert (payload = {}) {
			let title = 'Success'
			let text = 'The Portion has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Portion has been sent for approval'
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
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To show the modal to edit portion details.
		 * @function
		 * @param {object} portion - The selected portion object.
		 * @returns {undefined}
		 */
		editPortion (portion) {
			this.selectedPortionId = portion.id
			this.showEditPortionModal = true
		},
		/**
		 * To close the modal to edit portion details.
		 * @function
		 * @returns {undefined}
		 */
		closeEditPortionModal () {
			this.showEditPortionModal = false
		},
		/**
		 * To close the modal to edit portion details and update the selected portion on the portions list.
		 * @function
		 * @param {object} val - The portion object to be updated on the list.
		 * @returns {undefined}
		 */
		updatePortion (val) {
			this.showEditPortionModal = false
			this.getPortions()
		}
	},
	components: {
		Breadcrumb,
		Modal,
		LoadingScreen,
		NoResults,
		Dropdown,
		EditPortion,
		ModifierTree,
		ResourcePicker
	}
}
</script>
<style scoped>
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover,
.mt-element-list .list-news.ext-2.mt-list-container ul > .mt-list-item:hover {
  background-color: #fff;
}
.image-container {
  border: 1px dotted #c2cad8;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100px;
  max-height: 100px;
  overflow: hidden;
}
.gallery-thumb {
  max-width: 100%;
  max-height: 100%;
}
</style>

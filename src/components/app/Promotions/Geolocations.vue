<template>
	<div>
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<h1 class='page-title'>Geolocations</h1>
		<div class="note note-info">
			<p>Create and manage geolocations.</p>
		</div>

		<!-- BEGIN CREATE NEW -->
        <div class="portlet box blue-hoki" v-if="$root.permissions['promotions geolocations create']">
			<div class="portlet-title bg-blue-chambray" @click="toggleNewPanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create New Geolocation
				</div>
				<div class="tools">
					<a :class="{'expand': !newCollapse, 'collapse': newCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': newCollapse}">
				<div class="form-group form-md-line-input form-md-floating-label">
	      			<form role="form" @submit.prevent="createNewGeolocation()">
	      				<div class="row">
	      					<div class="col-md-12">
	      						<div class="alert alert-danger" v-show="createErrorMessage" ref="createErrorMessage">
		    					    <button class="close" @click.prevent="clearError('createErrorMessage')"></button>
		    					    <span>{{createErrorMessage}}</span>
		    					</div>
	      					</div>
			        		<div class="col-md-6">
		    					<div class="form-group form-md-line-input form-md-floating-label">
		    					    <input type="text" class="form-control input-sm" :class="{'edited': newGeolocation.name.length}" id="form_control_1" v-model="newGeolocation.name">
		    					    <label for="form_control_1">Name</label>
		    					</div>
								<map-area
									v-if="!newCollapse"
									:lat="latitude"
									:lng="longitude"
									:key="this.mapComponentKey"
									width="100%"
									height="500px"
									@polygonEmitted="updateNewPolygon"
								>
								</map-area>
			        		</div>
			        	</div>
			        	<div class="row">
			        		<div class="col-md-6">
			        			<el-tooltip content="Delete area" effect="light" placement="right">
			        				<button type="submit" class="btn btn-circle btn-icon-only btn-default clickable margin-top-20" @click.prevent="reloadMap()"><i class="fa fa-trash" aria-hidden="true"></i></button>
			        			</el-tooltip>
			        			<button 
									type="submit" 
									class="btn blue pull-right margin-top-20"
									:disabled="creating">
									Create
									<i 
										v-show="creating"
										class="fa fa-spinner fa-pulse fa-fw">
									</i>
								</button>
			        		</div>
			        	</div>
	      			</form>
				</div>
  			</div>
        </div>
        <!-- END CREATE NEW -->
	
		<!-- LIST START -->
		<div class="portlet light portlet-fit bordered margin-top-20">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Geolocations</span>
					<div class="caption-desc font-grey-cascade">See and edit geolocations</div>
				</div>
			</div>
			<div class="portlet-body relative-block">
				<div class="row">
					<div class="col-md-12">
						<div class="alert alert-danger" v-show="listErrorMessage" ref="listErrorMessage">
							<button class="close" @click="clearError('listErrorMessage')"></button>
							<span>{{listErrorMessage}}</span>
						</div>
					</div>
				</div>

				<loading-screen :show="loadingGeolocations" :color="'#2C3E50'" :display="'inline'"></loading-screen>

				<div class="mt-element-list">
					<div class="mt-list-container list-news">
						<ul>
							<li class="mt-list-item actions-at-left margin-top-15" :class="{'animated' : animated === gl.id}" v-for="gl in geolocations" :key="gl.id">
								<div class="list-item-actions">
									<el-tooltip 
										v-if="$root.permissions['promotions geolocations update']"
										content="Edit" 
										effect="light" 
										placement="right">
		                        		<a class="btn btn-circle btn-icon-only btn-default clickable" @click="editGeolocation(gl)">
	                                        <i class="fa fa-lg fa-pencil"></i>
	                                    </a>
	                                </el-tooltip>
									<el-tooltip 
										v-if="$root.permissions['promotions geolocations read'] && !$root.permissions['promotions geolocations update']"
										content="View" 
										effect="light" 
										placement="right">
		                        		<a class="btn btn-circle btn-icon-only btn-default clickable" @click="editGeolocation(gl)">
	                                        <i class="fa fa-lg fa-eye"></i>
	                                    </a>
	                                </el-tooltip>
									<el-tooltip 
										v-if="$root.permissions['promotions geolocations delete']"
										content="Delete" 
										effect="light" 
										placement="right">
		                        		<a class="btn btn-circle btn-icon-only btn-default clickable" @click="openDelete(gl)">
	                                        <i class="fa fa-lg fa-trash"></i>
	                                    </a>
	                                </el-tooltip>
	                        	</div>
	                            <div class="list-datetime bold uppercase font-red">
	                            	<span>{{ gl.name }}</span>
	                            </div>
	                            <div class="list-item-content height-mod">
	                            </div>
							</li>
						</ul>
					</div>
				</div>
				<div v-if="!loadingGeolocations && !geolocations.length">
		        	<no-results :show="true" :type="'printers'"></no-results>
		        </div>
			</div>
		</div>
		<!-- LIST END -->

		<!-- EDIT MODAL START -->
		<modal :show="showEditModal" effect="fade" @closeOnEscape="closeEditModal" ref="editModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeEditModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Geolocation</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="editErrorMessage" ref="editErrorMessage">
				    <button class="close" @click="clearError('editErrorMessage')"></button>
				    <span>{{editErrorMessage}}</span>
				</div>
				<div class="row">
					<div class="col-md-6">
						<div class="form-group form-md-line-input form-md-floating-label">
						    <input 
								:disabled="!$root.permissions['promotions geolocations update']"
								type="text" 
								class="form-control input-sm" 
								:class="{'edited': editedGeolocation.name.length}" 
								id="form_control_1" 
								v-model="editedGeolocation.name">
						    <label for="form_control_1">Geolocation Name</label>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<map-area
							v-if="showEditModal"
							:polygonToEdit="editedGeolocation.polygon"
							width="100%"
							height="500px"
							@polygonEmitted="updateEditedPolygon"
						>
						</map-area>
					</div>
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer">
					<button 
						v-if="!$root.permissions['promotions geolocations update']"
						type="button" 
						class="btn btn-primary" 
						@click="closeEditModal()">
						Close
					</button>
					<button 
						v-else
						type="button" 
						class="btn btn-primary" 
						@click="updateGeolocation()"
						:disabled="updating">
						Save
						<i 
							v-show="updating"
							class="fa fa-spinner fa-pulse fa-fw">
						</i>
					</button>
			</div>
		</modal>
		<!-- EDIT MODAL END -->

		<!-- DELETE MODAL START -->
		<modal :show="showDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal" ref="deleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Geolocation</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="deleteErrorMessage" ref="deleteErrorMessage">
				    <button class="close" @click="clearError('deleteErrorMessage')"></button>
				    <span>{{deleteErrorMessage}}</span>
				</div>
				<div class="col-md-12">
					Are you sure you want to delete '{{selectedGeolocation.name}}'?
				</div>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button 
					type="button" 
					class="btn btn-primary" 
					@click="deleteGeolocation()"
					:disabled="deleting">
					Delete
					<i 
						v-show="deleting"
						class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- DELETE MODAL END -->

	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import PromotionsFunctions from '../../../controllers/Promotions'
import Modal from '../../modules/Modal'
import MapArea from '../../modules/MapArea'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Geolocations', link: false}
			],
			newCollapse: true,
			creating: false,
			newGeolocation: {
				name: '',
				polygon: []
			},
			createErrorMessage: '',
			loadingGeolocations: false,
			listErrorMessage: '',
			geolocations: [],
			showEditModal: false,
			updating: false,
			editErrorMessage: '',
			editedGeolocation: {
				name: '',
				id: 0
			},
			animated: null,
			showDeleteModal: false,
			selectedGeolocation: {
				name: '',
				id: 0
			},
			deleting: false,
			deleteErrorMessage: '',
			mapComponentKey: 1
		}
	},
	computed: {
		latitude () {
			if (this.$root.activeLocation.latitude !== null && this.$root.activeLocation.latitude !== undefined) {
				return Number(this.$root.activeLocation.latitude)
			} else {
				return 43.6532
			}
		},
		longitude () {
			if (this.$root.activeLocation.longitude !== null && this.$root.activeLocation.longitude !== undefined) {
				return Number(this.$root.activeLocation.longitude)
			} else {
				return -79.3832
			}
		}
	},
	watch: {
		'$root.activeLocation' () {
			this.mapComponentKey += 1
		}
	},
	mounted () {
		this.getGeolocations()
	},
	methods: {
		reloadMap () {
			this.mapComponentKey += 1
		},
		/**
		 * To update map area when user creates or edits it
		 * @function
		 * @param {array} pathsArray - An array of arrays containing coordinates of vertices in the format [lat, lng]
		 * @returns {undefined}
		 */
		updateEditedPolygon (pathsArray) {
			this.editedGeolocation.polygon = pathsArray
		},
		/**
		 * To update map area when user creates or edits it
		 * @function
		 * @param {array} pathsArray - An array of arrays containing coordinates of vertices in the format [lat, lng]
		 * @returns {undefined}
		 */
		updateNewPolygon (pathsArray) {
			this.newGeolocation.polygon = pathsArray
		},
		/**
		 * To toggle the create new panel
		 * @function
		 * @returns {undefined}
		 */
		toggleNewPanel () {
			this.newCollapse = !this.newCollapse
		},
		/**
		 * To get a list of geolocations.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGeolocations () {
			this.loadingGeolocations = true
			var geolocationsVue = this
			PromotionsFunctions.getGeolocations(geolocationsVue.$root.appId, geolocationsVue.$root.appSecret, geolocationsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					geolocationsVue.geolocations = response.payload
					geolocationsVue.loadingGeolocations = false
				} else {
					geolocationsVue.loadingGeolocations = false
				}
			}).catch(reason => {
				geolocationsVue.loadingGeolocations = false
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch geolocations',
					errorName: 'listErrorMessage',
					vue: geolocationsVue
				})
			})
		},
		/**
		 * To check if the data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateGeolocationData () {
			var geolocationsVue = this
			return new Promise(function (resolve, reject) {
				if (!geolocationsVue.newGeolocation.name.length) {
					reject('Geolocation name cannot be blank')
				} else if (!geolocationsVue.newGeolocation.polygon.length) {
					reject('Please draw an area on the map.')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a geolocation.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createNewGeolocation () {
			var geolocationsVue = this
			return this.validateGeolocationData()
			.then(response => {
				geolocationsVue.creating = true
				PromotionsFunctions.createGeolocation(geolocationsVue.$root.appId, geolocationsVue.$root.appSecret, geolocationsVue.$root.userToken, geolocationsVue.newGeolocation).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						geolocationsVue.geolocations.push(response.payload)
						geolocationsVue.resetForm()
						geolocationsVue.confirmCreated()
					} else {
						geolocationsVue.createErrorMessage = 'Something went wrong ...'
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not add the geolocations',
						errorName: 'createErrorMessage',
						vue: geolocationsVue
					})
				}).finally(() => {
					geolocationsVue.creating = false
				})
			})
			.catch(reason => {
				geolocationsVue.createErrorMessage = reason
			})
		},
		/**
		 * To alert the user whether the printer was successfully added.
		 * @function
		 * @param {string} input - The input string.
		 * @returns {undefined}
		 */
		confirmCreated () {
			this.$swal({
				title: 'Success!',
				text: 'Geolocation created',
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To clear the error.
		 * @function
		 * @param {string} type - The type of error to clear
		 * @returns {undefined}
		 */
		clearError (type) {
			this[type] = ''
		},
		/**
		 * To reset the create form.
		 * @function
		 * @returns {undefined}
		 */
		resetForm () {
			this.newCollapse = true
			this.newGeolocation = {
				name: '',
				polygon: []
			}
		},
		/**
		 * To close the edit modal
		 * @function
		 * @returns {undefined}
		 */
		closeEditModal () {
			this.editedGeolocation.name = ''
			this.editedGeolocation.id = 0
			this.showEditModal = false
		},
		/**
		 * To check if the data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedData () {
			var geolocationsVue = this
			return new Promise(function (resolve, reject) {
				if (!geolocationsVue.editedGeolocation.name.length) {
					reject('Geolocation name cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update the geolocation
		 * @function
		 * @returns {undefined}
		 */
		updateGeolocation () {
			var geolocationsVue = this
			return this.validateEditedData()
			.then(response => {
				geolocationsVue.updating = true
				PromotionsFunctions.updateGeolocation(geolocationsVue.$root.appId, geolocationsVue.$root.appSecret, geolocationsVue.$root.userToken, geolocationsVue.editedGeolocation).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						geolocationsVue.geolocations.forEach((gl) => {
							if (gl.id === response.payload.id) {
								gl.name = response.payload.name
								gl.polygon = response.payload.polygon
							}
						})
						geolocationsVue.resetEdited()
						geolocationsVue.closeEditModal()
						geolocationsVue.animated = response.payload.id
						window.setTimeout(() => {
							geolocationsVue.animated = null
						}, 3000)
					} else {
						throw response
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the geolocation',
						errorName: 'editErrorMessage',
						vue: geolocationsVue,
						containerRef: 'editModal'
					})
				}).finally(() => {
					geolocationsVue.updating = false
				})
			}).catch(reason => {
				geolocationsVue.createErrorMessage = reason.responseJSON.message
			})
		},
		/**
		 * To open the edit modal
		 * @function
		 * @param {object} geolocation - The geolocation to edit
		 * @returns {undefined}
		 */
		editGeolocation (geolocation) {
			this.editedGeolocation.name = geolocation.name
			this.editedGeolocation.polygon = geolocation.polygon
			this.editedGeolocation.id = geolocation.id
			this.showEditModal = true
		},
		/**
		 * To clear the edited geolocation
		 * @function
		 * @returns {undefined}
		 */
		resetEdited () {
			this.editedGeolocation.name = ''
			this.editedGeolocation.id = 0
		},
		/**
		 * To clear the selected geolocation
		 * @function
		 * @returns {undefined}
		 */
		resetSelected () {
			this.selectedGeolocation.name = ''
			this.selectedGeolocation.id = 0
		},
		/**
		 * To close the delte modal
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteModal () {
			this.showDeleteModal = false
		},
		/**
		 * To open the delete modal
		 * @function
		 * @param {object} geolocation - The selected geolocation
		 * @returns {undefined}
		 */
		openDelete (geolocation) {
			this.selectedGeolocation.name = geolocation.name
			this.selectedGeolocation.id = geolocation.id
			this.showDeleteModal = true
		},
		/**
		 * To update the geolocation
		 * @function
		 * @returns {undefined}
		 */
		deleteGeolocation () {
			this.deleting = true
			let geolocationsVue = this
			PromotionsFunctions.deleteGeolocation(geolocationsVue.$root.appId, geolocationsVue.$root.appSecret, geolocationsVue.$root.userToken, geolocationsVue.selectedGeolocation).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					console.log('selected', geolocationsVue.selectedGeolocation.id, typeof geolocationsVue.selectedGeolocation.id)
					console.log('deleted', response.payload.id, typeof response.payload.id)
					let index = geolocationsVue.geolocations.findIndex((gl) => {
						return gl.id === geolocationsVue.selectedGeolocation.id
					})
					console.log('index', index)
					geolocationsVue.geolocations.splice(index, 1)
					geolocationsVue.resetSelected()
					geolocationsVue.closeDeleteModal()
					geolocationsVue.confirmDeleted()
				} else {
					geolocationsVue.deleteErrorMessage = 'Something went wrong ...'
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not delete the geolocation',
					errorName: 'deleteErrorMessage',
					vue: geolocationsVue,
					containerRef: 'deleteModal'
				})
			}).finally(() => {
				geolocationsVue.deleting = false
			})
		},
		/**
		 * To alert the user whether the printer was successfully added.
		 * @function
		 * @param {string} input - The input string.
		 * @returns {undefined}
		 */
		confirmDeleted () {
			this.$swal({
				title: 'Success!',
				text: 'Geolocation deleted',
				type: 'success',
				confirmButtonText: 'OK'
			})
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		NoResults,
		Modal,
		MapArea
	}
}
</script>

<style scoped>
.animated {
	animation: listItemHighlight 1s 2 ease-in-out both;
}
.mt-element-list .list-news.mt-list-container ul>.mt-list-item:hover {
	background-color: rgb(255, 255, 255);
}
</style>

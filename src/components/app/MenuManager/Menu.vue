<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
	    <h1 class="page-title">Menus</h1>
	    <!-- END PAGE TITLE-->
		<div class="note note-info">
            <p>Manage a store's menus.</p>
        </div>
        <!-- BEGIN CREATE NEW MENU-->
        <div class="portlet box blue-hoki" v-if="$root.activeLocation && $root.activeLocation.id">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreateMenuPanel()">
				<div class="custom tools">
					<a :class="{'expand': !createMenuCollapse, 'collapse': createMenuCollapse}"></a>
				</div>
				<div class="caption">
					&emsp;Create A New Menu
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': createMenuCollapse}">
      			<form role="form" @submit.prevent="createNewMenu($event)">
      				<div class="form-body row">
      					<div class="col-md-12">
      						<div class="alert alert-danger" v-if="errorMessage.length">
      						    <button class="close" data-close="alert" @click="clearError()"></button>
      						    <span>{{errorMessage}}</span>
      						</div>
      					</div>
		        		<div class="col-md-6">
		        			<label for="form_control_1">Menu Image</label>
		        			<div class="image-container" v-if="!newMenu.image_url.length">
		        				<img width="100" height="80" src="../../../assets/img/app/image-placeholder.png">
		        			</div>
		        			<div class="image-container" v-else>
		        				<img width="100" height="80" :src="newMenu.image_url">
		        			</div>
		        			<resource-picker @selected="updateImage" buttonText="Select Image" class="margin-top-15"></resource-picker>

							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" id="form_control_2" :class="{'edited': newMenu.name.length}" v-model="newMenu.name">
							    <label for="form_control_2">Menu Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="number" class="form-control input-sm" id="form_control_3" :class="{'edited': newMenu.order !== null}" v-model="newMenu.order">
							    <label for="form_control_3">Menu Order</label>
							</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" id="form_control_4" :class="{'edited': newMenu.desc.length}" v-model="newMenu.desc">
							    <label for="form_control_4">Menu Description</label>
							</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" id="form_control_5" :class="{'edited': newMenu.sku.length}" v-model="newMenu.sku">
							    <label for="form_control_5">Menu SKU</label>
							</div>
		        		</div>
		        		<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
				                <label>Menu Status:</label><br>
				                <el-switch
				                	v-model="newMenu.status"
				                	active-color="#0c6"
				                	inactive-color="#ff4949"
				                	:active-value="1"
				                	:inactive-value="0"
				                	active-text="Active"
				                	inactive-text="Sold Out">
				                </el-switch>
				            </div>
	            			<div class="form-group form-md-line-input form-md-floating-label">
	                            <label>Menu Type:</label><br>
	                            <el-switch
	                            	v-model="newMenu.catering"
	                            	active-color="#0c6"
	                            	inactive-color="#ff4949"
	                            	:active-value="1"
	                            	:inactive-value="0"
	                            	active-text="Catering"
	                            	inactive-text="Regular">
	                            </el-switch>
	                        </div>
	            			<div class="form-group form-md-line-input form-md-floating-label margin-bottom-20">
	                            <label>Is an Add-on Menu:</label><br>
	                            <el-switch
	                            	v-model="newMenu.addon"
	                            	active-color="#0c6"
	                            	inactive-color="#ff4949"
	                            	:active-value="1"
	                            	:inactive-value="0"
	                            	active-text="Yes"
	                            	inactive-text="No">
	                            </el-switch>
	                        </div>
							<el-date-picker 
								v-model="newMenu.start_from" 
								:editable="false"
								type="date" 
								format="yyyy-MM-dd" 
								value-format="yyyy-MM-dd" 
								placeholder="From"></el-date-picker>
							-
							<el-date-picker 
								v-model="newMenu.stop_on" 
								:editable="false"
								type="date" 
								format="yyyy-MM-dd" 
								value-format="yyyy-MM-dd" 
								placeholder="To"></el-date-picker>
							<button v-if="newMenu.addon === 1" type="submit" class="btn blue btn-outline" @click="selectAddOnCategories(newMenu, $event)">Select add-on categories</button>
							<p class="grey-label margin-top-10" v-if="newMenu.add_on.length">Selected {{newMenu.add_on.length}} <span v-if="newMenu.add_on.length === 1">category</span><span v-else>categories</span></p>
                			<div v-if="newMenu.catering" class="form-group form-md-line-input form-md-floating-label">
        					    <input type="text" class="form-control input-sm" id="form_control_6" :class="{'edited': newMenu.min.length}" v-model="newMenu.min">
        					    <label for="form_control_6">Minimum order value</label>
        					</div>
		        			<div v-if="newMenu.catering" class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" id="form_control_7" :class="{'edited': newMenu.max.length}" v-model="newMenu.max">
							    <label for="form_control_7">Maximum order value</label>
							</div>
		        		</div>
		        	</div>
      				<div class="form-actions right margin-top-20">
						<button type="submit" class="btn blue">Create</button>
					</div>
      			</form>
  			</div>
        </div>
        <!-- END CREATE NEW MENU-->
        <loading-screen :show="displayMenuData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
        <div class="alert alert-info center margin-top-20" v-if="!$root.activeLocation.id">
            <h4>No Store Selected</h4>
            <p>Please select a store from the stores panel on the right to view its menus</p>
        </div>
        <!-- BEGIN MENUS LIST-->
        <div v-if="$root.activeLocation && $root.activeLocation.id">
		    <div class="portlet light portlet-fit bordered margin-top-20">
		        <div class="portlet-title bg-blue-chambray">
		        	<div class="menu-image-main">
		        		<img src="../../../../static/client_logo.png">
		        	</div>
		            <div class="caption">
		                <span class="caption-subject font-green bold uppercase">Menus</span>
                        <div class="caption-desc font-grey-cascade">Click on a menu to view its categories.</div>
		            </div>
					<div class="btn-group-vertical pull-right" data-toggle="buttons">
						<label class="btn blue btn-xs" :class="{'active': menuFilter === '0', 'btn-outline': menuFilter !== '0'}">
						<input type="radio" class="toggle" v-model="menuFilter" value="0"> Regular Menus </label>
						<label class="btn blue btn-xs" :class="{'active': menuFilter === '1', 'btn-outline': menuFilter !== '1'}">
						<input type="radio" class="toggle" v-model="menuFilter" value="1"> Catering Menus </label>
						<label class="btn blue btn-xs" :class="{'active': menuFilter === '2', 'btn-outline': menuFilter !== '2'}">
						<input type="radio" class="toggle" v-model="menuFilter" value="2"> Add-on Menus </label>
					</div>
		        </div>
		        <div class="portlet-body" v-if="$root.activeLocation && $root.activeLocation.id && storeMenus.length && !displayMenuData">
		            <div class="mt-element-list margin-top-15">
		                <div class="mt-list-container list-news ext-1 no-border">
		                    <ul>
		                        <li id="parent" class="mt-list-item margin-top-15 clickable" :class="{'animated' : animated === `menu-${menu.id}`}" v-for="menu in storeMenus" :id="'menu-' + menu.id" @click="viewMenuCategories(menu)" :key="menu.id">
		                        	<div class="margin-bottom-15 actions-on-top">
		                        		<el-tooltip content="Edit" effect="light" placement="top">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="editMenu(menu, $event)">
		                                        <i class="fa fa-lg fa-pencil"></i>
		                                    </a>
	                                    </el-tooltip>
	                                    <el-tooltip content="Menu Hours" effect="light" placement="top">
		                                    <a class="btn btn-circle btn-icon-only btn-default" @click="showMenuHours(menu, $event)">
		                                        <i class="fa fa-lg fa-clock-o"></i>
		                                    </a>
	                                    </el-tooltip>
	                                    <el-tooltip content="Apply Add-on Category" effect="light" placement="top">
		                                    <a class="btn btn-circle btn-icon-only btn-default" @click="applyAddOnCategories(menu, $event)" v-if="menuFilter !== '2'">
		                                        <i class="icon-layers"></i>
		                                    </a>
	                                    </el-tooltip>
	                                    <el-tooltip content="Delete" effect="light" placement="top">
			                        		<a class="btn btn-circle btn-icon-only btn-default" @click="deleteMenu(menu, $event)">
		                                        <i class="fa fa-lg fa-trash"></i>
		                                    </a>
	                                    </el-tooltip>
		                        	</div>
		                        	<div class="list-icon-container">
                                        <i class="fa fa-angle-right"></i>
                                    </div>
		                            <div class="list-thumb">
		                                <a v-if="menu.image_url.length">
		                                    <img alt="" :src="menu.image_url" />
		                                </a>
		                                <a v-else>
		                                	<img src="../../../assets/img/app/image-placeholder.png">
		                                </a>
		                            </div>
		                            <div class="list-datetime bold uppercase font-red">
		                            	<span>{{ menu.name }}</span>
		                            </div>
		                            <div class="list-item-content row">
		                            	<div class="col-md-4">
		                            		<strong>Description:</strong>
		                            		<span>{{ menu.desc }}</span><br>
		                            		<strong>Status:</strong>
		                            		<span v-if="menu.status == 1">Available</span>
		                            		<span v-if="menu.status == 0">Sold Out</span>
		                            	</div>
		                            	<div class="col-md-4" v-show="menu.start_from || menu.stop_on">
		                            		<strong>From:</strong>
		                            		<span>{{ menu.start_from }}</span><br>
		                            		<strong>To:</strong>
		                            		<span>{{ menu.stop_on }}</span><br>
		                            	</div>
		                            </div>
		                        </li>
		                    </ul>
		                </div>
		            </div>
		        </div>
		        <div v-if="$root.activeLocation.id && !storeMenus.length && !displayMenuData">
		        	<no-results v-if="$root.accountType === 'application_admin'" :show="!storeMenus.length" :type="'menus'"></no-results>
		            <no-results v-if="$root.accountType === 'store_admin'" :show="!storeMenus.length" :type="'menus'" :custom="true" :text="customText"></no-results>
		        </div>
		    </div>
        </div>
        <!-- END MENUS LIST-->

        <apply-add-on-categories v-if="addOnCategoriesModalActive" :passedMenu="passedMenu" @closeAddOnCategoriesModal="closeAddOnCategoriesModal" @updateAddOnCategories="updateAddOnCategories"></apply-add-on-categories>
        <edit-menu v-if="editMenuModalActive" :passedMenuId="passedMenuId" @closeEditMenuModal="closeEditMenuModal" @updateMenu="updateMenu"></edit-menu>
		<menu-hours v-if="menuHoursModalActive" @closeHoursModal="closeMenuHoursModal" :menu="menuToAssignHoursTo"></menu-hours>
        <delete-menu v-if="deleteMenuModalActive" :passedMenuId="passedMenuId" @closeDeleteMenuModal="closeDeleteMenuModal" @deleteMenuAndCloseModal="deleteMenuAndCloseModal"></delete-menu>
        <modal :show="showGalleryModal" effect="fade" @closeOnEscape="closeGalleryModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeGalleryModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Select An Image</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<resource-picker @selected="updateImage" buttonText="Select Image" class="margin-top-15"></resource-picker>
			</div>
			<div slot="modal-footer" class="modal-footer clear"></div>
		</modal>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import Modal from '../../modules/Modal'
import NoResults from '../../modules/NoResults'
import LoadingScreen from '../../modules/LoadingScreen'
import MenusFunctions from '../../../controllers/Menus'
import Categories from './Categories'
import EditMenu from './Menus/EditMenu'
import ApplyAddOnCategories from './Menus/ApplyAddOnCategories'
import DeleteMenu from './Menus/DeleteMenu'
import MenuHours from './Menus/MenuHours'
import GalleryPopup from '../../modules/GalleryPopup'
import ResourcePicker from '../../modules/ResourcePicker'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Menu Manager', link: false},
				{name: 'Menus', link: false}
			],
			storeMenus: [],
			displayMenuData: false,
			errorMessage: '',
			editMenuModalActive: false,
			deleteMenuModalActive: false,
			addOnCategoriesModalActive: false,
			customText: 'No menus found for this location.',
			passedMenuId: 0,
			passedMenu: {},
			newMenu: {
				id: 'new',
				name: '',
				desc: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				addon: 0,
				catering: 0,
				min: '',
				max: '',
				sku: '',
				order: null,
				start_from: '',
				stop_on: '',
				add_on: []
			},
			createMenuCollapse: true,
			showGalleryModal: false,
			menuHoursModalActive: false,
			promptForLocation: false,
			menuFilter: '0',
			animated: '',
			menuToAssignHoursTo: {}
		}
	},
	watch: {
		'$root.activeLocation' () {
			this.getStoreMenus()
		},
		menuFilter () {
			this.getStoreMenus()
		}
	},
	mounted () {
		if (this.$root.activeLocation && this.$root.activeLocation.id) {
			this.getStoreMenus()
		}
	},
	methods: {
		/**
		 * To display the add-on categories modal
		 * @function
		 * @param {object} menu - The menu to apply the category to
		 * @param {object} event - The click event that initiated the action
		 * @returns {undefined}
		 */
		selectAddOnCategories (menu, event) {
			event.stopPropagation()
			event.preventDefault()
			this.passedMenu = menu
			this.addOnCategoriesModalActive = true
		},
		/**
		 * To display the add-on categories modal
		 * @function
		 * @param {object} menu - The menu to apply the category to
		 * @param {object} event - The click event that initiated the action
		 * @returns {undefined}
		 */
		applyAddOnCategories (menu, event) {
			event.stopPropagation()
			event.preventDefault()
			this.passedMenu = menu
			this.addOnCategoriesModalActive = true
		},
		/**
		 * To get a list of menus for the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreMenus () {
			this.displayMenuData = true
			this.storeMenus = []
			var menusVue = this
			let params = {
				catering: this.menuFilter === '1' ? 1 : 0,
				addon: this.menuFilter === '2' ? 1 : 0
			}
			return MenusFunctions.getStoreMenus(menusVue.$root.appId, menusVue.$root.appSecret, menusVue.$root.activeLocation.id, params).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					menusVue.displayMenuData = false
					menusVue.storeMenus = response.payload
				} else {
					menusVue.displayMenuData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					menusVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To route to the categories page for the selected menu.
		 * @function
		 * @param {object} menu - The selected menu
		 * @returns {undefined}
		 */
		viewMenuCategories (menu) {
			this.$root.activeMenuId = menu.id
			this.$router.push('categories/' + menu.id)
		},
		/**
		 * To display the modal for editing menus.
		 * @function
		 * @param {object} menu - The selected menu
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editMenu (menu, event) {
			event.stopPropagation()
			this.passedMenuId = menu.id
			this.editMenuModalActive = true
		},
		/**
		 * To display the modal for menus hours.
		 * @function
		 * @param {object} menu - The selected menu
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		showMenuHours (menu, event) {
			event.stopPropagation()
			this.menuToAssignHoursTo = menu
			this.menuHoursModalActive = true
		},
		/**
		 * To display the modal for deleting menu.
		 * @function
		 * @param {object} menu - The selected menu
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		deleteMenu (menu, event) {
			event.stopPropagation()
			this.passedMenuId = menu.id
			this.deleteMenuModalActive = true
		},
		/**
		 * To close the modal for editing menus.
		 * @function
		 * @returns {undefined}
		 */
		closeEditMenuModal () {
			this.editMenuModalActive = false
		},
		/**
		 * To close the modal for menu hours.
		 * @function
		 * @returns {undefined}
		 */
		closeMenuHoursModal () {
			this.menuHoursModalActive = false
		},
		/**
		 * To close the modal for deleting menus.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteMenuModal () {
			this.deleteMenuModalActive = false
		},
		/**
		 * To close the modal for adding add-on categories.
		 * @function
		 * @returns {undefined}
		 */
		closeAddOnCategoriesModal () {
			this.addOnCategoriesModalActive = false
		},
		/**
		 * To close the modal for deleting menus and remove menu from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteMenuAndCloseModal () {
			this.deleteMenuModalActive = false
			for (var i = 0; i < this.storeMenus.length; i++) {
				if (parseInt(this.storeMenus[i].id) === parseInt(this.passedMenuId)) {
					this.storeMenus.splice(i, 1)
					break
				}
			}
		},
		/**
		 * To close the gallery popup.
		 * @function
		 * @returns {undefined}
		 */
		closeGalleryModal () {
			this.showGalleryModal = false
		},
		/**
		 * To clear the new menu form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewMenu () {
			this.newMenu = {
				id: 'new',
				name: '',
				desc: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				addon: 0,
				catering: 0,
				min: '',
				max: '',
				sku: '',
				order: null,
				start_from: '',
				stop_on: '',
				add_on: []
			}
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Menu has been successfully created!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To update the menu object emitted by the child.
		 * @function
		 * @param {object} val - The updated menu object
		 * @returns {undefined}
		 */
		updateMenu (val) {
			this.editMenuModalActive = false
			for (let i = 0; i < this.storeMenus.length; i++) {
				if (this.storeMenus[i].id === val.id) {
					this.storeMenus.splice(i, 1)
					break
				}
			}
			var done = false
			for (let i = 0; i < this.storeMenus.length; i++) {
				if (parseInt(this.storeMenus[i].order) < parseInt(val.order) || (parseInt(this.storeMenus[i].order) === parseInt(val.order) && parseInt(this.storeMenus[i].id) > parseInt(val.id))) {
					this.storeMenus.splice(i, 0, val)
					done = true
					break
				}
			}
			if (!done) {
				this.storeMenus.push(val)
			}
			setTimeout(function () {
				$('#menu-' + val.id).addClass('highlight')
				setTimeout(function () {
					$('#menu-' + val.id).removeClass('highlight')
				}, 2000)
			}, 10)
		},
		/**
		 * To update the add on categories.
		 * @function
		 * @param {object} val - The updated categories
		 * @returns {undefined}
		 */
		updateAddOnCategories (val) {
			if (this.passedMenu.id === 'new') {
				val.forEach((item) => this.newMenu.addon.push(item.addon_category_id))
			} else {
				this.storeMenus.forEach((menu) => {
					if (menu.id === this.passedMenu.id) {
						menu.add_on = val
					}
				})
				this.animated = `menu-${this.passedMenu.id}`
				let menusVue = this
				window.setTimeout(() => {
					menusVue.animated = ''
				}, 3000)
			}
			this.addOnCategoriesModalActive = false
			this.passedMenu = {}
		},
		/**
		 * To check if the menu data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateMenuData () {
			var createMenuVue = this
			return new Promise(function (resolve, reject) {
				if (!createMenuVue.newMenu.image_url.length) {
					reject('Menu image cannot be blank')
				} else if (!createMenuVue.newMenu.name.length) {
					reject('Menu name cannot be blank')
				} else if (!$.isNumeric(createMenuVue.newMenu.order)) {
					reject('Menu order should be a number')
				} else if (!createMenuVue.newMenu.desc.length) {
					reject('Menu description cannot be blank')
				} else if (!createMenuVue.newMenu.sku.length) {
					reject('Menu SKU cannot be blank')
				} else if (createMenuVue.newMenu.start_from.length && !createMenuVue.newMenu.stop_on.length) {
					reject('Please provide an end date')
				} else if (!createMenuVue.newMenu.start_from.length && createMenuVue.newMenu.stop_on.length) {
					reject('Please provide a start date')
				} else if (createMenuVue.newMenu.catering && !createMenuVue.newMenu.min) {
					reject('Minimum order value cannot be blank')
				} else if (createMenuVue.newMenu.catering && !createMenuVue.newMenu.max) {
					reject('Maximum order value cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new menu.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createNewMenu (event) {
			var createMenuVue = this
			createMenuVue.clearError()

			return createMenuVue.validateMenuData()
			.then(response => {
				createMenuVue.newMenu.location_id = createMenuVue.$root.activeLocation.id
				MenusFunctions.createNewMenu(createMenuVue.newMenu, createMenuVue.$root.appId, createMenuVue.$root.appSecret, createMenuVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						createMenuVue.getStoreMenus()
						createMenuVue.clearNewMenu()
						createMenuVue.showAlert()
					} else {
						createMenuVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						createMenuVue.$router.push('/login/expired')
						return
					}
					createMenuVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				createMenuVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
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
		 * To open the gallery modal.
		 * @function
		 * @returns {undefined}
		 */
		openGalleryPopup () {
			this.showGalleryModal = true
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			console.log('updateImage', val)
			this.showGalleryModal = false
			this.newMenu.image_url = val.image_url
		},
		/**
		 * To toggle the create menu panel, initially set to opened
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateMenuPanel () {
			this.createMenuCollapse = !this.createMenuCollapse
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		Categories,
		ApplyAddOnCategories,
		EditMenu,
		DeleteMenu,
		NoResults,
		Modal,
		GalleryPopup,
		MenuHours,
		ResourcePicker
	}
}
</script>

<style scoped>
.height-mod {
	min-height: 60px;
}
.mt-element-list .list-news.mt-list-container.no-border {
	border: none;
}
.clickable {
	cursor: pointer;
}
.green {
	color: rgba(46, 204, 64, .8);
}
.portlet>.portlet-title>.tools.custom {
	float: left;
}
.actions-on-top {
	margin-top: -5px;
}
.animated {
	animation: listItemHighlight 1s 2 ease-in-out both;
}
.grey-label {
	margin-top: 5px;
	color: rgb(153, 153, 153);
}
</style>

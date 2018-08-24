<template>
	<div>
		<div class="sideways-page-one">
			<!-- BEGIN PAGE BAR -->
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<!-- END PAGE BAR -->
			<!-- BEGIN PAGE TITLE-->
			<h1 class="page-title">Menu Tiers</h1>
			<!-- END PAGE TITLE-->
			<div class="note note-info">
				<p>Manage a store's menu tiers.</p>
			</div>
			<!-- BEGIN CREATE NEW TIER-->
			<div class="row"
			     v-if="$root.permissions['menu_manager tiers create']">
				<div class="col-xs-12">
					<div class="alert alert-info"
					     v-if="noCorporateStore">
						A Corporate Store is required to use Menu Tiers.
						<span v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/store_manager/stores">Make one of your Stores the corporate store in the Stores Manager</router-link> before using Menu Tiers.
						</span>
						<span v-else>
							Your Brand Admin can set a Store to be corporate.
						</span>
					</div>
				</div>
			</div>
			<div class="portlet box blue-hoki"
			     v-if="!noCorporateStore && $root.permissions['menu_manager tiers create']">
				<div class="portlet-title bg-blue-chambray"
				     @click="toggleCreateMenuTierPanel()">
					<div class="custom tools">
						<a :class="{'expand': !createMenuTierCollapse, 'collapse': createMenuTierCollapse}"></a>
					</div>
					<div class="caption">
						&emsp;Create A New Menu Tier
					</div>
				</div>
				<div class="portlet-body"
				     :class="{'display-hide': createMenuTierCollapse}">
					<form role="form"
					      @submit.prevent="createNewMenuTier($event)">
						<div class="form-body row">
							<div class="col-md-12">
								<div class="alert alert-danger"
								     v-show="errorMessage"
								     ref="errorMessage">
									<button class="close"
									        @click="clearError()"></button>
									<span>{{errorMessage}}</span>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_1"
									       :class="{'edited': newMenuTier.name.length}"
									       v-model="newMenuTier.name">
									<label for="form_control_1">Menu Tier Name</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_2"
									       :class="{'edited': newMenuTier.description.length}"
									       v-model="newMenuTier.description">
									<label for="form_control_2">Menu Tier Description</label>
								</div>
							</div>
						</div>
						<div class="form-actions right margin-top-20">
							<button type="submit"
							        class="btn blue">Create</button>
						</div>
					</form>
				</div>
			</div>
			<!-- END CREATE NEW TIER-->

			<!-- BEGIN MENUS LIST-->
			<div v-if="!noCorporateStore">
				<div class="portlet light portlet-fit bordered margin-top-20">
					<div class="portlet-title bg-blue-chambray">
						<div class="menu-image-main">
							<img src="../../../../static/client_logo.png">
						</div>
						<div class="caption">
							<span class="caption-subject font-default bold uppercase">Menu Tiers</span>
							<div class="caption-desc font-grey-cascade">Click on a menu tier to edit it.</div>
						</div>
					</div>
					<loading-screen :show="displayMenuTiersData"
			                :color="'#2C3E50'"
			                :display="'inline'"></loading-screen>
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
						<no-results :show="!menuTiers.length  && !displayMenuTiersData"
						            :type="'menu tiers'"></no-results>
						<div class="mt-element-list margin-top-15">
							<div class="mt-list-container list-news">
								<ul>
									<li class="mt-list-item actions-at-left margin-top-15 clickable"
									    v-for="tier in menuTiers"
									    :id="'tier-' + tier.id"
									    @click="assignMenusToTier(tier)"
									    :key="tier.id">
										<div class="list-item-actions">
											<el-tooltip v-if="$root.permissions['menu_manager tiers update']"
											            content="Edit"
											            effect="light"
											            placement="right">
												<a class="btn btn-circle btn-icon-only btn-default"
												   @click="editMenuTier(tier, $event)">
													<i class="fa fa-lg fa-pencil"></i>
												</a>
											</el-tooltip>
											<el-tooltip v-if="$root.permissions['menu_manager tiers read'] && !$root.permissions['menu_manager tiers update']"
											            content="Edit"
											            effect="light"
											            placement="right">
												<a class="btn btn-circle btn-icon-only btn-default"
												   @click="editMenuTier(tier, $event)">
													<i class="fa fa-lg fa-eye"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="list-icon-container">
											<i class="fa fa-angle-right"></i>
										</div>
										<div class="list-datetime bold uppercase font-red">
											<span>{{ tier.name }}</span>
										</div>
										<div class="list-item-content height-mod">
											<div class="col-md-8">
												<strong>Description:</strong>
												<span>{{ tier.description }}</span>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- END MENUS LIST-->
		</div>
		<assign-menus v-if="showAssignMenusModal"
		              :passedTierId="passedTierId"
		              @closeAssignMenusModal="closeAssignMenusModal"></assign-menus>
		<edit-menu-tier v-if="showEditTierModal"
		                :passedTierId="passedTierId"
		                @closeEditTierModal="closeEditTierModal"
		                @updateMenuTier="updateMenuTier"></edit-menu-tier>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import Modal from '../../modules/Modal'
import NoResults from '../../modules/NoResults'
import LoadingScreen from '../../modules/LoadingScreen'
import MenuTiersFunctions from '../../../controllers/MenuTiers'
import EditMenuTier from './MenuTiers/EditMenuTier'
import AssignMenus from './MenuTiers/AssignMenus'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Menu Manager', link: false },
				{ name: 'Menu Tiers', link: false }
			],
			menuTiers: [],
			displayMenuTiersData: false,
			errorMessage: '',
			createMenuTierCollapse: true,
			passedTierId: 0,
			showEditTierModal: false,
			showAssignMenusModal: false,
			newMenuTier: {
				name: '',
				description: '',
				location_id: this.$root.corporateStoreId
			},
			noCorporateStore: false,
			listErrorMessage: ''
		}
	},
	created () {
		if (this.$root.corporateStoreId !== null) {
			this.getMenuTiers()
		} else {
			this.noCorporateStore = true
		}
	},
	methods: {
		/**
		 * To close anything active in the side panel
		 * @function
		 * @returns {undefined}
		 */
		closeAssignMenusModal () {
			this.showAssignMenusModal = false
			this.passedTierId = 0
		},
		/**
		 * To activate the right half panel which lists the menus.
		 * @function
		 * @param {object} tier - The selected tier.
		 * @returns {undefined}
		 */
		assignMenusToTier (tier) {
			this.showAssignMenusModal = true
			this.passedTierId = tier.id
		},
		/**
		 * To get a list of menu tiers.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getMenuTiers () {
			this.displayMenuTiersData = true
			this.menuTiers = []
			var menuTiersVue = this
			return MenuTiersFunctions.getMenuTiers(
				menuTiersVue.$root.corporateStoreId,
				menuTiersVue.$root.appId,
				menuTiersVue.$root.appSecret,
				menuTiersVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						menuTiersVue.displayMenuTiersData = false
						menuTiersVue.menuTiers = response.payload
					} else {
						menuTiersVue.displayMenuTiersData = false
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch menu tiers',
						errorName: 'listErrorMessage',
						vue: menuTiersVue
					})
				})
		},
		/**
		 * To display the modal for editing menu tiers.
		 * @function
		 * @param {object} tier - The selected menu tier.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editMenuTier (tier, event) {
			event.stopPropagation()
			this.passedTierId = tier.id
			this.showEditTierModal = true
		},
		/**
		 * To close the modal for editing menu tiers.
		 * @function
		 * @returns {undefined}
		 */
		closeEditTierModal () {
			this.showEditTierModal = false
		},
		/**
		 * To clear the new menu tier form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewMenuTier () {
			this.newMenuTier = {
				name: '',
				description: '',
				location_id: this.$root.corporateStoreId
			}
		},
		/**
		 * To add the newly created menu to the list.
		 * @function
		 * @param {object} val - The new menu object
		 * @returns {undefined}
		 */
		addMenuTier (val) {
			this.menuTiers.push(val)
			this.clearNewMenuTier()
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Menu tier has been successfully created!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(
				() => {
					// do nothing
				},
				dismiss => {
					// do nothing
				}
			)
		},
		/**
		 * To update the menu object emitted by the child.
		 * @function
		 * @param {object} val - The updated menu object
		 * @returns {undefined}
		 */
		updateMenuTier (val) {
			this.showEditTierModal = false
			for (var i = 0; i < this.menuTiers.length; i++) {
				if (this.menuTiers[i].id === val.id) {
					this.menuTiers[i] = val
				}
			}
			$('#tier-' + val.id).addClass('highlight')
			setTimeout(function () {
				$('#tier-' + val.id).removeClass('highlight')
			}, 2000)
		},
		/**
		 * To check if the menu data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateMenuTierData () {
			var menuTiersVue = this
			return new Promise(function (resolve, reject) {
				if (!menuTiersVue.newMenuTier.name.length) {
					reject('Menu tier name cannot be blank')
				} else if (!menuTiersVue.newMenuTier.description.length) {
					reject('Menu tier description cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new menu tier.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createNewMenuTier (event) {
			var menuTiersVue = this
			menuTiersVue.clearError()

			return menuTiersVue
				.validateMenuTierData()
				.then(response => {
					MenuTiersFunctions.createNewMenuTier(
						menuTiersVue.newMenuTier,
						menuTiersVue.$root.appId,
						menuTiersVue.$root.appSecret,
						menuTiersVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								menuTiersVue.showAlert()
								menuTiersVue.newMenuTier.id = response.payload.id
								menuTiersVue.addMenuTier(menuTiersVue.newMenuTier)
							} else {
								menuTiersVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create the tier',
								errorName: 'errorMessage',
								vue: menuTiersVue
							})
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					menuTiersVue.errorMessage = reason
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
		 * To toggle the create menu panel, initially set to opened
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateMenuTierPanel () {
			this.createMenuTierCollapse = !this.createMenuTierCollapse
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		NoResults,
		Modal,
		EditMenuTier,
		AssignMenus
	}
}
</script>

<style>
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
  color: rgba(46, 204, 64, 0.8);
}
.portlet > .portlet-title > .tools.custom {
  float: left;
}
</style>

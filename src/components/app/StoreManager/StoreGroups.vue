<template>
	<div>
		<div class="sideways-page-one">
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<h1 class='page-title'>Store Groups</h1>
			<div class="note note-info">
	            <p>A list of store groups for PitaPit.</p>
	        </div>
	        <div class="margin-top-20">
	  			<!-- SEARCH PANEL START -->
					<div class="portlet box blue-hoki">
						<div class="portlet-title bg-blue-chambray" @click="toggleCreateGroupPanel()">
							<div class="caption">
								<i class="fa fa-plus-circle"></i>
								Create New Group
							</div>
							<div class="tools">
								<a :class="{'expand': !createGroupCollapse, 'collapse': createGroupCollapse}"></a>
							</div>
						</div>
						<div class="portlet-body" :class="{'display-hide': createGroupCollapse}">
		      			<form role="form" @submit.prevent="createNewGroup()">
		      				<div class="row">
		      					<div class="col-md-12">
			      					<div class="alert alert-danger" v-if="errorMessage.length">
			      					    <button class="close" data-close="alert" @click="clearError()"></button>
			      					    <span>{{errorMessage}}</span>
			      					</div>
		      					</div>
		      					<div class="col-md-6">
		      						<div class="form-group form-md-line-input form-md-floating-label">
		      						    <input type="text" class="form-control input-sm" id="form_control_1" v-model="newGroup.name" :class="{'edited': newGroup.name.length}">
		      						    <label for="form_control_1">Group Name</label>
		      						</div>
		      						<div class="form-group form-md-line-input form-md-floating-label">
		      						    <input type="text" class="form-control input-sm" id="form_control_2" v-model="newGroup.description" :class="{'edited': newGroup.description.length}">
		      						    <label for="form_control_2">Group Description</label>
		      						</div>
		      					</div>
		      				</div>
		      				<div class="form-actions right">
		      					<button type="submit" class="btn blue">Create</button>
		      				</div>
		      			</form>
		      		</div>
		      	</div>
		      	<!-- SEARCH PANEL END -->
	        </div>
	        <loading-screen :show="loadingGroupsData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
	        <div v-if="groups.length && !loadingGroupsData">
			    <div class="portlet light portlet-fit bordered margin-top-20">
			        <div class="portlet-title bg-blue-chambray">
			        	<div class="menu-image-main">
			        		<img src="../../../../static/client_logo.png">
			        	</div>
			            <div class="caption">
			                <span class="caption-subject font-green bold uppercase">Store Groups</span>
	                        <div class="caption-desc font-grey-cascade">Click on a group to view the store locations assigned to it and assign more.</div>
			            </div>
			        </div>
			        <div class="portlet-body">
			            <div class="mt-element-list">
			                <div class="mt-list-container list-news">
			                    <ul>
			                        <li class="mt-list-item actions-at-left margin-top-15 clickable" v-for="group in groups" @click="assignStoresToGroup(group)" :id="'group-' + group.id">
			                        	<div class="list-item-actions">
			                        		<el-tooltip content="Edit" effect="light" placement="right">
				                        		<a class="btn btn-circle btn-icon-only btn-default" @click="displayEditGroupModal(group, $event)">
			                                        <i class="fa fa-lg fa-pencil"></i>
			                                    </a>
			                        		</el-tooltip>
			                        	</div>
			                        	<div class="list-icon-container">
	                                        <i class="fa fa-angle-right"></i>
	                                    </div>
			                            <div class="list-datetime bold uppercase font-red">
			                            	<span>{{ group.name }}</span>
			                            </div>
			                            <div class="list-item-content height-mod">
			                            	<div class="col-md-8">
			                            		<span>{{ group.description }}</span>
			                            	</div>
			                            </div>
			                        </li>
			                    </ul>
			                </div>
			            </div>
			        </div>
			    </div>
	        </div>
	        <div v-if="!groups.length && !loadingGroupsData">
	        	<no-results :show="!groups.length" :type="'store groups'"></no-results>
	        </div>
		</div>
    	<assign-stores v-if="showAssignStoresModal" :passedGroupId="selectedGroupId" @closeAssignStoresModal="closeAssignStoresModal"></assign-stores>
	    <edit-store-group v-if="showEditGroupModal" :passedGroupId="passedGroupId" @closeEditGroupModal="closeEditGroupModal" @updateGroup="updateGroup"></edit-store-group>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import AssignStores from './AssignStores'
import EditStoreGroup from './EditStoreGroup'
import StoreGroupsFunctions from '../../../controllers/StoreGroups'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Store Manager', link: false},
				{name: 'Store Groups', link: false}
			],
			createGroupCollapse: true,
			errorMessage: '',
			loadingGroupsData: false,
			groups: [],
			computedHeight: 0,
			selectedGroupId: 0,
			showEditGroupModal: false,
			passedGroupId: 0,
			newGroup: {
				name: '',
				description: '',
				status: 1,
				created_by: this.$root.createdBy
			},
			showAssignStoresModal: false
		}
	},
	mounted () {
		this.getGroups()
	},
	methods: {
		/**
		 * To get a list of store groups.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroups () {
			this.loadingGroupsData = true
			var storeGroupsVue = this
			storeGroupsVue.groups = []
			return StoreGroupsFunctions.getGroups(storeGroupsVue.$root.appId, storeGroupsVue.$root.appSecret, storeGroupsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					storeGroupsVue.loadingGroupsData = false
					storeGroupsVue.groups = response.payload
				} else {
					storeGroupsVue.loadingGroupsData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					storeGroupsVue.$router.push('/login/expired')
					return
				}
				storeGroupsVue.loadingGroupsData = false
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To compute height to display based on window height and navbar.
		 * @function
		 * @returns {undefined}
		 */
		computeHeight () {
			const height = $(window).height() - 50
			this.computedHeight = height + 'px'
		},
		/**
		 * To toggle the create group panel, initially set to closed.
		 * @function
		 * @returns {undefined}
		 * @memberof Users
		 * @version 0.0.4
		 */
		toggleCreateGroupPanel () {
			this.createGroupCollapse = !this.createGroupCollapse
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
		 * To activate the right half panel which lists the store locations.
		 * @function
		 * @param {object} group - The selected group.
		 * @returns {undefined}
		 */
		assignStoresToGroup (group) {
			this.showAssignStoresModal = true
			this.selectedGroupId = group.id
		},
		/**
		 * To close anything active in the side panel
		 * @function
		 * @returns {undefined}
		 */
		closeAssignStoresModal () {
			this.showAssignStoresModal = false
		},
		/**
		 * To display the edit group modal.
		 * @function
		 * @param {object} group - The selected group.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayEditGroupModal (group, event) {
			event.stopPropagation()
			this.showEditGroupModal = true
			this.passedGroupId = group.id
		},
		/**
		 * To close the edit group modal.
		 * @function
		 * @returns {undefined}
		 */
		closeEditGroupModal () {
			this.showEditGroupModal = false
		},
		/**
		 * To update the group object emitted by the child.
		 * @function
		 * @param {object} val - The passed group object
		 * @returns {undefined}
		 */
		updateGroup (val) {
			this.showEditGroupModal = false
			for (var i = 0; i < this.groups.length; i++) {
				if (this.groups[i].id === val.id) {
					this.groups[i] = val
				}
			}
			$('#group-' + val.id).addClass('highlight')
			setTimeout(function () {
				$('#group-' + val.id).removeClass('highlight')
			}, 2000)
		},
		/**
		 * To clear the new group form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewGroup () {
			this.newGroup = {
				name: '',
				description: '',
				status: 1,
				created_by: this.$root.createdBy
			}
		},
		/**
		 * To append the new group to the groups list.
		 * @function
		 * @param {object} newGroup - The new group object
		 * @returns {undefined}
		 */
		addGroup (newGroup) {
			this.groups.push(newGroup)
			this.clearNewGroup()
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateGroupData () {
			var storeGroupsVue = this
			return new Promise(function (resolve, reject) {
				if (!storeGroupsVue.newGroup.name.length) {
					reject('Group name cannot be blank')
				} else if (!storeGroupsVue.newGroup.description.length) {
					reject('Group description cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To call the endpoint to create a new location group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createNewGroup () {
			var storeGroupsVue = this
			storeGroupsVue.clearError()

			return storeGroupsVue.validateGroupData()
			.then(response => {
				StoreGroupsFunctions.createNewGroup(storeGroupsVue.newGroup, storeGroupsVue.$root.appId, storeGroupsVue.$root.appSecret, storeGroupsVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						storeGroupsVue.newGroup.id = response.payload.id
						storeGroupsVue.addGroup(storeGroupsVue.newGroup)
						storeGroupsVue.confirmCreated()
					} else {
						storeGroupsVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						storeGroupsVue.$router.push('/login/expired')
						return
					}
					storeGroupsVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				storeGroupsVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To confirm creation.
		 * @function
		 * @returns {undefined}
		 */
		confirmCreated () {
			this.$swal({
				title: 'Success!',
				text: 'Group created',
				type: 'success',
				confirmButtonText: 'OK'
			})
		}
	},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		AssignStores,
		EditStoreGroup
	}
}
</script>

<template>
  <div>
    <div class="sideways-page-one">
      <div class="page-bar">
        <breadcrumb :crumbs="breadcrumbArray" />
      </div>
      <h1 class="page-title">
        Store Groups
      </h1>
      <div class="note note-info">
        <p>A list of store groups.</p>
      </div>
      <!-- CREATE START -->
      <div
        v-if="$root.permissions['stores groups create']"
        class="portlet box blue-hoki margin-top-20"
      >
        <div
          class="portlet-title bg-blue-chambray"
          @click="toggleCreateGroupPanel()"
        >
          <div class="caption">
            <i class="fa fa-plus-circle" />
            Create New Group
          </div>
          <div class="tools">
            <a :class="{'expand': !createGroupCollapse, 'collapse': createGroupCollapse}" />
          </div>
        </div>
        <div
          class="portlet-body"
          :class="{'display-hide': createGroupCollapse}"
        >
          <form
            role="form"
            @submit.prevent="createNewGroup()"
          >
            <div class="row">
              <div class="col-md-12">
                <div
                  v-show="errorMessage"
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
              <div class="col-md-6">
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_1"
                    v-model="newGroup.name"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newGroup.name.length}"
                  >
                  <label for="form_control_1">
                    Group Name
                  </label>
                </div>
                <div class="form-group form-md-line-input form-md-floating-label">
                  <input
                    id="form_control_2"
                    v-model="newGroup.description"
                    type="text"
                    class="form-control input-sm"
                    :class="{'edited': newGroup.description.length}"
                  >
                  <label for="form_control_2">
                    Group Description
                  </label>
                </div>
              </div>
            </div>
            <div class="form-actions right">
              <button
                type="submit"
                class="btn blue"
                :disabled="creating"
              >
                Create
                <i
                  v-show="creating"
                  class="fa fa-spinner fa-pulse fa-fw"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- CREATE END -->
      <loading-screen
        :show="loadingGroupsData"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <div v-if="groups.length && !loadingGroupsData">
        <div class="portlet light portlet-fit bordered margin-top-20">
          <div class="portlet-title bg-blue-chambray">
            <div class="menu-image-main">
              <img src="../../../../public/client_logo.png">
            </div>
            <div class="caption">
              <span class="caption-subject font-default bold uppercase">
                Store Groups
              </span>
              <div class="caption-desc font-grey-cascade">
                Click on a group to view the store locations assigned to it and assign more.
              </div>
            </div>
          </div>
          <div class="portlet-body">
            <div class="row">
              <div class="col-md-12">
                <div
                  v-show="listErrorMessage"
                  ref="listErrorMessage"
                  class="alert alert-danger"
                >
                  <button
                    class="close"
                    @click="clearError('listErrorMessage')"
                  />
                  <span>{{ listErrorMessage }}</span>
                </div>
              </div>
            </div>
            <div class="mt-element-list">
              <div class="mt-list-container list-news">
                <ul>
                  <li
                    v-for="group in groups"
                    :id="'group-' + group.id"
                    :key="group.id"
                    class="mt-list-item actions-at-left margin-top-15"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="!$root.permissions['stores groups update'] && $root.permissions['stores groups read']"
                        content="View"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="displayEditGroupModal(group, $event)"
                        >
                          <i class="fa fa-lg fa-eye" />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['stores groups update']"
                        content="Edit"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="displayEditGroupModal(group, $event)"
                        >
                          <i class="fa fa-lg fa-pencil" />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['stores groups assign stores']"
                        content="Select stores"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="assignStoresToGroup(group)"
                        >
                          <i class="fa fa-lg fa-home" />
                        </a>
                      </el-tooltip>
                      <el-tooltip
                        v-if="$root.permissions['stores groups update']"
                        content="Apply Menu Tiers"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click.stop="displayTiersModal(group)"
                        >
                          <i class="fa fa-lg fa-cutlery" />
                        </a>
                      </el-tooltip>
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
        <no-results
          :show="!groups.length"
          :type="'store groups'"
        />
      </div>
    </div>
    <assign-stores
      v-if="showAssignStoresModal"
      :passed-group-id="selectedGroupId"
      @closeAssignStoresModal="closeAssignStoresModal"
    />
    <edit-store-group
      v-if="showEditGroupModal"
      :passed-group-id="passedGroupId"
      @closeEditGroupModal="closeEditGroupModal"
      @updateGroup="updateGroup"
    />
    <modal
      ref="applyToStoreGroupModal"
      :show="showTiersModal"
      @closeOnEscape="closeTiersModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeTiersModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Apply Menu Tier to Store Group
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div class="row">
          <div class="col-xs-12">
            <div
              v-show="tiersErrorMessage.length"
              ref="tiersErrorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                data-close="alert"
                @click="clearError('tiersErrorMessage')"
              />
              <span>{{ tiersErrorMessage }}</span>
            </div>
            <menu-tiers-picker
              v-if="showTiersModal"
              @tiersSelect="updateTier"
            />
          </div>
          <div class="col-xs-12">
            <p>Replace existing menus?</p>
            <el-switch
              v-model="groupToAssignMenuTiersTo.replaceExisting"
              active-color="#0c6"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              active-text="Yes"
              inactive-text="No"
            />
          </div>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="button"
          class="btn btn-primary"
          :disabled="assigning"
          @click="assignMenuTiers()"
        >
          Save
          <i
            v-show="assigning"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
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
import MenuTiersPicker from '@/components/app/MenuManager/MenuTiers/MenuTiersPicker.vue'
import Modal from '@/components/modules/Modal'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		AssignStores,
		EditStoreGroup,
		MenuTiersPicker,
		Modal
	},
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Store Manager', link: false },
				{ name: 'Store Groups', link: false }
			],
			createGroupCollapse: true,
			errorMessage: '',
			loadingGroupsData: false,
			listErrorMessage: '',
			groups: [],
			computedHeight: 0,
			selectedGroupId: 0,
			showEditGroupModal: false,
			passedGroupId: 0,
			creating: false,
			newGroup: {
				name: '',
				description: '',
				status: 1,
				created_by: this.$root.createdBy
			},
			showAssignStoresModal: false,
			assigning: false,
			groupToAssignMenuTiersTo: {},
			showTiersModal: false,
			tiersErrorMessage: ''
		}
	},
	mounted () {
		this.getGroups()
	},
	methods: {
		/**
		 * To get the list of locations that belong to the current group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroupLocations () {
			var storeGroupsVue = this

			StoreGroupsFunctions.getGroupLocations(
				storeGroupsVue.groupToAssignMenuTiersTo.id
			)
				.then(response => {
					storeGroupsVue.groupToAssignMenuTiersTo.locations = response.payload.locations.map(
						location => location.id
					)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not get tier details',
						errorName: 'tiersErrorMessage',
						vue: storeGroupsVue
					})
				})
		},
		/**
		 * To update the selected tier in the storage object
		 * @function
		 * @param {integer} id - ID of the tier selected
		 * @returns {undefined}
		 */
		updateTier (id) {
			this.groupToAssignMenuTiersTo.tier = id
		},
		/**
		 * To close the Assign Tiers To Group modal
		 * @function
		 * @returns {undefined}
		 */
		closeTiersModal () {
			this.showTiersModal = false
			this.groupToAssignMenuTiersTo = {
				tier: null,
				replaceExisting: 0,
				locations: []
			}
		},
		/**
		 * To init a storage object and display Assign Tiers modal
		 * @function
		 * @param {object} group - Group the user clicked
		 * @returns {undefined}
		 */
		displayTiersModal (group) {
			this.clearError('tiersErrorMessage')
			this.groupToAssignMenuTiersTo = {
				...group,
				tier: null,
				replaceExisting: 0,
				locations: []
			}
			this.getGroupLocations()
			this.showTiersModal = true
		},
		/**
		 * To save the assignment
		 * @function
		 * @returns {undefined}
		 */
		assignMenuTiers () {
			let storeGroupsVue = this
			this.assigning = true
			let payload = {
				tier: this.groupToAssignMenuTiersTo.tier,
				replace_existing: this.groupToAssignMenuTiersTo.replaceExisting,
				locations: this.groupToAssignMenuTiersTo.locations
			}
			StoreGroupsFunctions.assignMenuTiersToGroup(
				payload,
				storeGroupsVue.$root.appId,
				storeGroupsVue.$root.appSecret,
				storeGroupsVue.$root.userToken
			)
				.then(response => {
					storeGroupsVue.closeTiersModal()
					storeGroupsVue.showAssignTiersSuccess(response.payload)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not get tier details',
						errorName: 'tiersErrorMessage',
						vue: storeGroupsVue,
						containerRef: 'applyToStoreGroupModal'
					})
				})
				.finally(() => {
					storeGroupsVue.assigning = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAssignTiersSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Menu Tiers have been saved'
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
		 * To get a list of store groups.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroups () {
			this.loadingGroupsData = true
			var storeGroupsVue = this
			storeGroupsVue.groups = []
			return StoreGroupsFunctions.getGroups(
				storeGroupsVue.$root.appId,
				storeGroupsVue.$root.appSecret,
				storeGroupsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						storeGroupsVue.loadingGroupsData = false
						storeGroupsVue.groups = response.payload
					} else {
						storeGroupsVue.loadingGroupsData = false
					}
				})
				.catch(reason => {
					storeGroupsVue.loadingGroupsData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch store groups',
						errorName: 'listErrorMessage',
						vue: storeGroupsVue
					})
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
		 * @param {string} name - Name of the error variable
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
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
		 * @param {object} group - The passed group object
		 * @param {object} payload - The payload property of the server response
		 * @returns {undefined}
		 */
		updateGroup ({group, payload}) {
			this.showEditGroupModal = false
			if (!payload.pending_approval) {
				this.getGroups()
			}
			this.confirmUpdated(payload)
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		confirmUpdated (payload = {}) {
			let title = 'Success'
			let text = 'The Store Group has been updated'
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
			storeGroupsVue.clearError('errorMessage')

			return storeGroupsVue
				.validateGroupData()
				.then(response => {
					storeGroupsVue.creating = true
					StoreGroupsFunctions.createNewGroup(
						storeGroupsVue.newGroup,
						storeGroupsVue.$root.appId,
						storeGroupsVue.$root.appSecret,
						storeGroupsVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								storeGroupsVue.newGroup.id = response.payload.id
								if (response.payload && response.payload.pending_approval !== true) {
									storeGroupsVue.getGroups()
								}
								storeGroupsVue.clearNewGroup()
								storeGroupsVue.confirmCreated(response.payload)
							} else {
								storeGroupsVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add the group',
								errorName: 'errorMessage',
								vue: storeGroupsVue
							})
						})
						.finally(() => {
							storeGroupsVue.creating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					storeGroupsVue.errorMessage = reason
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
		confirmCreated (payload = {}) {
			let title = 'Success'
			let text = 'The Store Group has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Store Group has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		}
	}
}
</script>

<style scoped>
.mt-list-item:hover {
  background-color: white !important;
}
</style>

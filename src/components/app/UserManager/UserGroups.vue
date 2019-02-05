<template>
  <div>
    <div class="sideways-page-one">
      <div class="page-bar">
        <breadcrumb :crumbs="breadcrumbArray" />
      </div>
      <h1 class="page-title">
        User Groups
      </h1>
      <div class="note note-info">
        <p>A list of user groups.</p>
      </div>

      <!-- CREATE GROUP PANEL START -->
      <div
        v-if="$root.permissions['user_manager user_groups create']"
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
                    data-close="alert"
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
                <h4 class="margin-top-20">
                  All users with:
                </h4>
                <div>
                  <el-dropdown
                    trigger="click"
                    size="mini"
                    :show-timeout="50"
                    :hide-timeout="50"
                    class="margin-top-15"
                    @command="updateSignUpDate"
                  >
                    <el-button size="mini">
                      {{ selectedSignUpDate }}
                      <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="7">
                        Signed up in the last 7 days
                      </el-dropdown-item>
                      <el-dropdown-item :command="14">
                        Signed up in the last 14 days
                      </el-dropdown-item>
                      <el-dropdown-item :command="30">
                        Signed up in the last 30 days
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div>
                  <el-dropdown
                    trigger="click"
                    size="mini"
                    :show-timeout="50"
                    :hide-timeout="50"
                    class="margin-top-15"
                    @command="updateTotalOrders"
                  >
                    <el-button size="mini">
                      {{ selectedTotalOrders }}
                      <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="[10, '<']">
                        Less than 10 orders
                      </el-dropdown-item>
                      <el-dropdown-item :command="[25, '>']">
                        More than 25 orders
                      </el-dropdown-item>
                      <el-dropdown-item :command="[50, '>']">
                        More than 50 orders
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div>
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      id="form_control_3"
                      v-model="city"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': city.length}"
                      @change="addRule('city')"
                    >
                    <label for="form_control_3">
                      City
                    </label>
                  </div>
                </div>
                <div>
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      id="form_control_4"
                      v-model="province"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': province.length}"
                      @change="addRule('province')"
                    >
                    <label for="form_control_4">
                      Province
                    </label>
                  </div>
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
      <!-- CREATE GROUP PANEL END -->

      <!-- LIST START -->
      <div>
        <div class="portlet light portlet-fit bordered margin-top-20">
          <div class="portlet-title bg-blue-chambray">
            <div class="menu-image-main">
              <img src="../../../../public/client_logo.png">
            </div>
            <div class="caption">
              <span class="caption-subject font-default bold uppercase">
                User Groups
              </span>
              <div class="caption-desc font-grey-cascade">
                Click on a group to send a message to its members.
              </div>
            </div>
          </div>
          <div class="portlet-body relative-block">
            <div class="mt-element-list">
              <div class="clearfix margin-bottom-10">
                <el-dropdown
                  trigger="click"
                  size="mini"
                  :show-timeout="50"
                  :hide-timeout="50"
                  @command="updateSortByOrder"
                >
                  <el-button size="mini">
                    Sort by
                    <span>
                      <i
                        v-if="sortBy.order === 'ASC'"
                        class="fa fa-sort-alpha-asc"
                      />
                      <i
                        v-if="sortBy.order === 'DESC'"
                        class="fa fa-sort-alpha-desc"
                      />
                    </span>
                    <i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="ASC">
                      <i class="fa fa-sort-alpha-asc" />
                    </el-dropdown-item>
                    <el-dropdown-item command="DESC">
                      <i class="fa fa-sort-alpha-desc" />
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <page-results
                  class="pull-right"
                  :total-results="totalResults"
                  :active-page="activePage"
                  @pageResults="resultsPerPageUpdate"
                />
              </div>
              <div class="mt-list-container list-news">
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
                <loading-screen
                  :show="loadingGroupsData"
                  :color="'#2C3E50'"
                  :display="'inline'"
                />
                <ul v-show="groups.length && !loadingGroupsData">
                  <li
                    v-for="group in sortedGroups"
                    :id="'group-' + group.id"
                    :key="group.id"
                    class="mt-list-item actions-at-left margin-top-15"
                    :class="{'clickable' : can('user_manager user_groups message')}"
                    @click="sendMessageToGroup(group)"
                  >
                    <div class="list-item-actions">
                      <el-tooltip
                        v-if="$root.permissions['user_manager user_groups update']"
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
                        v-if="$root.permissions['user_manager user_groups read'] && !$root.permissions['user_manager user_groups update']"
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
                        v-if="$root.permissions['user_manager user_groups delete']"
                        content="Delete"
                        effect="light"
                        placement="right"
                      >
                        <a
                          class="btn btn-circle btn-icon-only btn-default"
                          @click="deleteGroup(group, $event)"
                        >
                          <i class="fa fa-lg fa-trash" />
                        </a>
                      </el-tooltip>
                    </div>
                    <div
                      v-if="can('user_manager user_groups message')"
                      class="list-icon-container"
                    >
                      <i class="fa fa-angle-right" />
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
              <div
                v-show="numPages > 1"
                class="clearfix"
              >
                <pagination
                  :passed-page="activePage"
                  :num-pages="numPages"
                  @activePageChange="activePageUpdate"
                />
              </div>
            </div>
            <div v-if="!groups.length && !loadingGroupsData">
              <no-results
                :show="!groups.length"
                :type="'store groups'"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- LIST END -->
    </div>

    <!-- PANEL COMPONENTS END -->
    <select-users
      v-if="showSelectUsersModal"
      :passed-group-id="selectedGroupId"
      :passed-group-name="passedGroupName"
      @closeSelectUsersModal="closeSelectUsersModal"
    />

    <message
      v-if="messageModalDisplayed"
      :user-id="selectedUsers"
      @closeMessageModal="closeMessageModal"
    />

    <delete-user-group
      v-if="deleteGroupModalActive"
      :selected-promotion-id="groupToBeDeletedId"
      @closeDeleteGroupModal="closeDeleteGroupModal"
      @deleteGroupAndCloseModal="deleteGroupAndCloseModal"
    />

    <edit-user-group
      v-if="showEditGroupModal"
      :passed-group="groupToBeEdited"
      @closeEditGroupModal="closeEditGroupModal"
      @updateGroup="updateGroup"
    />
  </div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import { debounce } from 'lodash'
import DeleteUserGroup from './DeleteUserGroup'
import SelectUsers from './SelectUsers'
import EditUserGroup from './EditUserGroup'
import Message from './Message'
import UserGroupsFunctions from '../../../controllers/UserGroups'
import Dropdown from '../../modules/Dropdown'
import PageResults from '../../modules/PageResults'
import Pagination from '../../modules/Pagination'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      breadcrumbArray: [
        { name: 'Users Manager', link: false },
        { name: 'Users', link: false }
      ],
      createGroupCollapse: true,
      errorMessage: '',
      loadingGroupsData: false,
      listErrorMessage: '',
      groups: [],
      computedHeight: 0,
      selectedGroupId: 0,
      showMenusList: false,
      showEditGroupModal: false,
      showSelectUsersModal: false,
      passedGroupId: 0,
      passedGroupName: '',
      city: '',
      province: '',
      creating: false,
      newGroup: {
        id: '',
        name: '',
        description: '',
        rules: []
      },
      showSidewaysPageTwo: false,
      groupToBeDeletedId: 0,
      deleteGroupModalActive: false,
      groupToBeEdited: {
        name: '',
        description: '',
        rules: []
      },
      messageModalDisplayed: false,
      selectedUsers: [],
      resultsPerPage: 50,
      totalResults: 0,
      sortBy: {
        order: 'ASC'
      },
      activePage: 1,
      numPages: 1
    }
  },
  computed: {
    sortedGroups () {
      return [...this.groups.sort((a, b) => {
        if (this.sortBy.order.toLowerCase() === 'asc') {
          return a.name > b.name
        } else {
          return a.name < b.name
        }
      })]
    },
    selectedSignUpDate () {
      let text = 'Select sign-up date'
      for (let i = 0; i < this.newGroup.rules.length; i++) {
        if (this.newGroup.rules[i].parameter === 'sign-up-date') {
          text = this.newGroup.rules[i].text
        }
      }
      return text
    },
    selectedTotalOrders () {
      let text = 'Select number of orders'
      for (let i = 0; i < this.newGroup.rules.length; i++) {
        if (this.newGroup.rules[i].parameter === 'total-orders') {
          text = this.newGroup.rules[i].text
        }
      }
      return text
    },
    ...mapGetters(['can'])
  },
  created () {
    let usersVue = this

    this.computeHeight()

    $(window).on(
      'resize',
      debounce(() => {
        usersVue.computeHeight()
      }, 200)
    )
  },
  mounted () {
    this.getGroups()
  },
  methods: {
    /**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
    updateSortByOrder (value) {
      this.sortBy.order = value
    },
    /**
		 * To catch updates from the PageResults component when the number of page results is updated.
		 * @function
		 * @param {integer} val - The number of page results to be returned.
		 * @returns {undefined}
		 */
    resultsPerPageUpdate (val) {
      if (parseInt(this.resultsPerPage) !== parseInt(val)) {
        this.resultsPerPage = val
        this.activePageUpdate(1)
      }
    },
    /**
		 * To update the current page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
    activePageUpdate (val) {
      this.activePage = val
      this.getGroups()
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showAlert (payload = {}) {
      let title = 'Success'
      let text = 'The User Group has been created'
      let type = 'success'

      if (payload.pending_approval) {
        title = 'Approval Required'
        text = 'The User Group has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To display the modal for deleting a promotion.
		 * @function
		 * @param {object} group - The selected promotion
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    deleteGroup (group, event) {
      event.stopPropagation()
      this.groupToBeDeletedId = group.id
      this.deleteGroupModalActive = true
    },
    /**
		 * To add a rule to the ruleset of a group.
		 * @function
		 * @param {string} type - The type of rule to be added
		 * @returns {undefined}
		 */
    addRule (type) {
      if (type === 'city' && this.city.length) {
        let rule = {
          parameter: 'city',
          value: this.city,
          operator: '='
        }

        for (let i = 0; i < this.newGroup.rules.length; i++) {
          if (this.newGroup.rules[i].parameter === 'city') {
            this.newGroup.rules.splice(i, 1)
          }
        }
        this.newGroup.rules.push(rule)
      } else if (type === 'province' && this.province.length) {
        let rule = {
          parameter: 'province',
          value: this.province,
          operator: '='
        }
        for (let i = 0; i < this.newGroup.rules.length; i++) {
          if (this.newGroup.rules[i].parameter === 'province') {
            this.newGroup.rules.splice(i, 1)
          }
        }
        this.newGroup.rules.push(rule)
      }
    },
    /**
		 * To check if the new group information is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateMessageData () {
      var newGroupVue = this
      return new Promise(function (resolve, reject) {
        if (!newGroupVue.newGroup.name.length) {
          reject('Name cannot be blank')
        } else if (!newGroupVue.newGroup.description.length) {
          reject('Description cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To update the total orders rule of the group.
		 * @function
		 * @param {integer} days - The number of days
		 * @returns {undefined}
		 */
    updateSignUpDate (days) {
      let rule = {
        parameter: 'sign-up-date',
        value: this.daysBeforeToday(days),
        operator: '>',
        text: `Signed up in the last ${days} days`
      }

      for (let i = 0; i < this.newGroup.rules.length; i++) {
        if (this.newGroup.rules[i].parameter === 'sign-up-date') {
          this.newGroup.rules.splice(i, 1)
        }
      }

      this.newGroup.rules.push(rule)
    },
    /**
		 * To update the total orders rule of the group.
		 * @function
		 * @param {array} argsArray - An array of [integer, string] where integer is the number of orders and string is the operator
		 * @returns {undefined}
		 */
    updateTotalOrders (argsArray) {
      let rule = {
        parameter: 'total-orders',
        value: argsArray[0],
        operator: argsArray[1],
        text: `${argsArray[1] === '<' ? 'Less' : 'More'} than ${
          argsArray[0]
        } orders`
      }

      for (let i = 0; i < this.newGroup.rules.length; i++) {
        if (this.newGroup.rules[i].parameter === 'total-orders') {
          this.newGroup.rules.splice(i, 1)
        }
      }

      this.newGroup.rules.push(rule)
    },
    /**
		 * To calculate a date a number of days before current date.
		 * @function
		 * @param {number} days - The number of days to deduct from current date
		 * @returns {string} - A YYYY-MM-DD date string
		 */
    daysBeforeToday (days) {
      let date = new Date(new Date().setDate(new Date().getDate() - days))
      let year = date.getFullYear()
      let day = date.getDate()
      let month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      return year + '-' + month + '-' + day
    },
    /**
		 * To get a list of store groups.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getGroups () {
      this.loadingGroupsData = true
      var userGroupsVue = this
      let paginationPreferences = {
        page: this.activePage,
        order: this.sortBy.order,
        per_page: this.resultsPerPage
      }
      userGroupsVue.groups = []
      return UserGroupsFunctions.getGroups(
        userGroupsVue.$root.appId,
        userGroupsVue.$root.appSecret,
        userGroupsVue.$root.userToken,
        paginationPreferences
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            userGroupsVue.totalResults = response.payload.total
            userGroupsVue.numPages = response.payload.last_page
            userGroupsVue.groups = response.payload.data
            userGroupsVue.loadingGroupsData = false
          } else {
            userGroupsVue.loadingGroupsData = false
          }
        })
        .catch(reason => {
          userGroupsVue.loadingGroupsData = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch user groups',
            errorName: 'listErrorMessage',
            vue: userGroupsVue
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
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
    clearError (name) {
      this[name] = ''
    },
    /**
		 * To activate the right half panel which lists the users in the group.
		 * @function
		 * @param {object} group - The selected group.
		 * @returns {undefined}
		 */
    sendMessageToGroup (group) {
      if (!this.can('user_manager user_groups message')) return
      this.showSelectUsersModal = true
      this.selectedGroupId = group.id
      this.passedGroupName = group.name
    },
    /**
		 * To close anything active in the side panel
		 * @function
		 * @param {array} users - The selected users.
		 * @returns {undefined}
		 */
    closeMessageModal () {
      this.messageModalDisplayed = false
    },
    /**
		 * To close anything active in the side panel
		 * @function
		 * @param {array} users - The selected users.
		 * @returns {undefined}
		 */
    closeSelectUsersModal (users) {
      if (users && users.length) {
        this.selectedUsers = users
        this.showSelectUsersModal = false
        this.messageModalDisplayed = true
      } else {
        this.showSelectUsersModal = false
      }
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
      this.groupToBeEdited = group
      this.showEditGroupModal = true
    },
    /**
		 * To close the edit group modal.
		 * @function
		 * @returns {undefined}
		 */
    closeEditGroupModal () {
      this.showEditGroupModal = false
    },
    deleteGroupAndCloseModal (id) {
      this.deleteGroupModalActive = false
      this.getGroups()
    },
    /**
		 * To close the delete group modal.
		 * @function
		 * @returns {undefined}
		 */
    closeDeleteGroupModal () {
      this.deleteGroupModalActive = false
    },
    /**
		 * To update the group object emitted by the child.
		 * @function
		 * @param {object} val - The passed group object
		 * @returns {undefined}
		 */
    updateGroup (val) {
      this.showEditGroupModal = false
      this.getGroups()
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
        rules: [],
        id: ''
      }
      this.city = ''
      this.province = ''
      this.createGroupCollapse = true
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
        } else if (!storeGroupsVue.newGroup.rules.length) {
          reject('Select at least one rule')
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
      var userGroupsVue = this
      userGroupsVue.clearError()

      return userGroupsVue
        .validateGroupData()
        .then(response => {
          userGroupsVue.creating = true
          UserGroupsFunctions.createNewGroup(
            userGroupsVue.newGroup,
            userGroupsVue.$root.appId,
            userGroupsVue.$root.appSecret,
            userGroupsVue.$root.userToken
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                userGroupsVue.showAlert(response.payload)
                userGroupsVue.clearNewGroup()
                userGroupsVue.getGroups()
              } else {
                userGroupsVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not add the group',
                errorName: 'errorMessage',
                vue: userGroupsVue
              })
            })
            .finally(() => {
              userGroupsVue.creating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          userGroupsVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
        })
    }
  },
  components: {
    Breadcrumb,
    NoResults,
    LoadingScreen,
    EditUserGroup,
    Dropdown,
    SelectUsers,
    DeleteUserGroup,
    Message,
    PageResults,
    Pagination
  }
}
</script>

<style scoped>
.inlined {
	display: inline-block;
	padding-right: 5px;
}
</style>

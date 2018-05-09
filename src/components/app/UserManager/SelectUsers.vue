<template>
	<modal :show="showSelectUsersModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Select Users To Send Notification To</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<form role="form" novalidate>
				<div class="alert alert-danger" v-if="errorMessage.length">
				    <button class="close" data-close="alert" @click="clearError()"></button>
                    <span>{{ errorMessage }}</span>
				</div>
				<div class="form-body invite-user-form height-mod">
			        <table class="table">
			            <thead>
			                <tr>
			                	<th> 
			                		<div class="md-checkbox has-success" @click="selectAll()">
		                                <input type="checkbox" :id="`group-${passedGroupId}`" class="md-check" v-model="selectAllSelected">
		                                <label :for="`group-${passedGroupId}`">
		                                    <span class="inc"></span>
		                                    <span class="check"></span>
		                                    <span class="box"></span>
		                                </label>
		                            </div>
								</th>
			                	<th> Name </th>
			                	<th> Email </th>
			                	<th> City, Province, Country </th>
			                </tr>
			            </thead>
			            <tbody>
			                <tr v-for="user in users">
			                	<td>
			                		<div class="md-checkbox has-success">
		                                <input type="checkbox" :id="`store-${user.id}`" class="md-check" v-model="user.selected"  @change="checkBox(user)">
		                                <label :for="`store-${user.id}`">
		                                    <span class="inc"></span>
		                                    <span class="check"></span>
		                                    <span class="box"></span>
		                                </label>
		                            </div>
			                	</td>
			                    <td> {{ user.first_name }} {{ user.last_name }} </td>
			                    <td> {{ user.email }} </td>
			                    <td> {{ user.city }}<span v-if="user.city">,</span> {{ user.province }}<span v-if="user.province">,</span> {{ user.country }} </td>
			                </tr>
			            </tbody>
			        </table>
			        <p v-if="!users.length" class="text-center">There are no users in this group.</p>
				</div>
			</form>
		</div>
		<div slot="modal-footer" class="modal-footer center">
			<div class="footer-wrapper">
				<el-pagination
					class="inline-block pagination-center"
					small
				    layout="prev, pager, next"
				    :page-count="pageCount"
				    @current-change="changeCurrentPage">
				  </el-pagination>
				<button type="button" class="btn blue" @click="selectUsers()">Select</button>
			</div>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import UserGroupsFunctions from '../../../controllers/UserGroups'

export default {
	data () {
		return {
			errorMessage: '',
			users: [],
			selectedUsers: [],
			selectAllSelected: false,
			showSelectUsersModal: false,
			pageCount: 1,
			currentPage: 1
		}
	},
	props: {
		passedGroupId: {
			type: Number
		},
		passedGroupName: {
			type: String
		}
	},
	mounted () {
		this.getGroupDetails()
		this.showSelectUsersModal = true
	},
	methods: {
		/**
		 * To add or remove selected user and sync up the Select All checkbox.
		 * @function
		 * @param {integer} user - The user being un/selected
		 * @returns {undefined}
		 */
		checkBox (user) {
			let i = this.selectedUsers.indexOf(user.id)
			if (!user.selected && i !== -1) {
				this.selectAllSelected = false
				this.selectedUsers.splice(i, 1)
			} else if (user.selected && i === -1) {
				this.selectedUsers.push(user.id)
			}
		},
		/**
		 * To update the current page.
		 * @function
		 * @param {integer} page - The new current page number
		 * @returns {undefined}
		 */
		changeCurrentPage (page) {
			this.currentPage = page
			this.getGroupDetails()
		},
		/**
		 * To record the selected users in the new or edited promo code object.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		selectUsers () {
			if (this.selectedUsers.length === 0) {
				this.errorMessage = 'You have not selected any users'
				this.$el.scrollTop = 0
				return
			}
			this.$emit('closeSelectUsersModal', this.selectedUsers)
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @param {boolean} value - The value of the checkbox
		 * @returns {undefined}
		 */
		syncSelectAll (value) {
			if (!value) {
				this.selectAllSelected = false
			}
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
		selectAll () {
			this.selectAllSelected = !this.selectAllSelected
			this.users.forEach(user => {
				user.selected = this.selectAllSelected
				this.checkBox(user)
			})
		},
		/**
		 * To get the details of the selected group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroupDetails () {
			var selectUsersVue = this
			let paginationPreferences = {
				page: this.currentPage
			}

			UserGroupsFunctions.getGroupDetails(paginationPreferences, selectUsersVue.passedGroupId, selectUsersVue.$root.appId, selectUsersVue.$root.appSecret, selectUsersVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					selectUsersVue.pageCount = response.payload.last_page

					let selectedUsers = selectUsersVue.selectedUsers
					let allUsers = response.payload.data
					for (var i = 0; i < selectedUsers.length; i++) {
						for (var j = 0; j < allUsers.length; j++) {
							if (selectedUsers[i] === allUsers[j].id) {
								allUsers[j].selected = true
							} else if (allUsers[j].selected !== true) {
								allUsers[j].selected = false
							}
						}
					}
					if (allUsers.some((user) => { return user.selected === false || user.selected === undefined })) {
						selectUsersVue.selectAllSelected = false
					} else {
						selectUsersVue.selectAllSelected = true
					}
					selectUsersVue.users = allUsers
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					selectUsersVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
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
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeSelectUsersModal')
		}
	},
	components: {
		Modal
	}
}
</script>
<style scoped>
	.modal-body {
		min-height: 200px;
		max-height: calc(100vh - 200px);
		overflow-x: hidden;
		overflow-y: auto;
		margin-bottom: 20px;
	}
	.footer-wrapper {
		display: flex;
		justify-content: space-between;
	}
</style>

<template>
	<div>
		<div>
			<div class="page-bar">
				<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
			</div>
			<h1 class='page-title'>Approvals</h1>
			<div class="note note-info">
				<p>Approve or reject pending requests.</p>
			</div>

			<div class="portlet light portlet-fit bordered min-height-200">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image-main">
						<img src="../../../../static/client_logo.png">
					</div>
					<div class="caption">
						<span class="caption-subject font-default bold uppercase">Approval</span>
						<div class="caption-desc font-grey-cascade">Review and approve or reject pending change requests.</div>
					</div>
				</div>

				<div class="portlet-body relative-block">
					<div class="alert alert-danger"
					     v-show="errorMessage"
					     ref="errorMessage">
						<span>{{errorMessage}}</span>
						<button class="close"
						        @click="clearError('errorMessage')"></button>
					</div>

					<loading-screen :show="loading"></loading-screen>

					<no-results :show="noResults"
					            :custom="true"
					            text="There are no changes to review">
					</no-results>

					<div v-show="! loading && !noResults">
						<div v-show="view === 'list'">
							<div class="row bold padding-y-20">
								<div class="col-xs-3">
									<p>Type</p>
								</div>
								<div class="col-xs-3">
									<p>Submitted by</p>
								</div>
								<div class="col-xs-3">
									<p>Created</p>
								</div>
							</div>

							<div class="row padding-y-10 border-bottom-light clickable hover-highlight v-center"
							     :class="{'transparent' : loading}"
							     v-for="(request, index) in requests"
							     :key="index"
							     @click="viewRequest(request)">
								<div class="col-xs-3">
									{{request.action}}
								</div>
								<div class="col-xs-3 break-long">
									<p>{{request.created_by_name}}</p>
								</div>
								<div class="col-xs-3">
									{{request.formattedDate}}
								</div>
								<div class="col-xs-4">
									<button class="btn btn-danger btn-sm third-width"
									        @click.stop="rejectRequest(request)">
										Reject
									</button>
									<button @click.stop="approveRequest(request)"
									        class="btn blue btn-sm third-width">
										Approve
									</button>
									<button class="btn blue btn-outline btn-sm third-width">
										Details
									</button>
								</div>
							</div>
							<div class="row margin-top-20">
								<div class="col-xs-12">
									<pagination :passedPage="activePage"
									            :numPages="total"
									            @activePageChange="activePageUpdate">
									</pagination>
								</div>
							</div>
						</div>

						<div v-show="view === 'single'"
						     ref="request">

							<div class="row bold padding-y-20">
								<div class="col-xs-2">
									<p>Field</p>
								</div>
								<div class="col-xs-5">
									<p>Current</p>
								</div>
								<div class="col-xs-5">
									<p>After approval</p>
								</div>
							</div>

							<div class="row padding-y-10 border-bottom-light"
							     v-for="(field, index) in request"
							     :key="index"
							     :class="{'changed' : field.existing !== field.modified}">
								<div class="col-xs-2">
									<p>{{field.label}}</p>
								</div>
								<div class="col-xs-5 break-long">
									<span v-if="field.label === 'Location'">{{field.existing.display_name}}</span>
									<span v-else>{{field.existing}}</span>
								</div>
								<div class="col-xs-5">
									<span v-if="field.label === 'Location'">{{field.modified.display_name}}</span>
									<span v-else>{{field.modified}}</span>
								</div>
							</div>

							<div class="row margin-top-20"
							     v-if="$root.permissions['approvals update']">
								<div class="col-xs-4 col-xs-offset-8">
									<button class="btn btn-danger third-width"
									        @click="rejectRequest(selectedRequest)"
									        :disabled="rejecting">
										Reject
									</button>
									<button @click="approveRequest(selectedRequest)"
									        class="btn blue third-width"
									        :disabled="approving">
										Approve
									</button>
									<button v-show="total !== activePage"
									        class="btn blue btn-outline third-width"
									        @click="viewList()">
										List
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- LIST END -->

	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LoadingScreen from '../../modules/LoadingScreen'
import NoResults from '../../modules/NoResults'
import ApprovalsFunctions from '../../../controllers/Approvals'
import Pagination from '../../modules/Pagination'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import FieldLabels from '@/components/app/ApprovalsManager/FieldLabels.js'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Admin Manager', link: false },
				{ name: 'Approvals', link: false }
			],
			view: 'list',
			requests: [],
			selectedRequest: {},
			errorMessage: '',
			loading: false,
			approving: false,
			rejecting: false,
			noResults: false,
			activePage: 1,
			total: 0,
			recordsPerPage: 10
		}
	},
	computed: {
		request () {
			if (this.selectedRequest._id !== undefined) {
				const keys = Object.keys(this.selectedRequest.new_values)
				return keys.map(key => {
					let label
					let display
					if (FieldLabels[key] === undefined) {
						label = key.replace(/_/g, ' ')
						label = label.charAt(0).toUpperCase() + label.slice(1)
						display = true
					} else {
						label = FieldLabels[key].label
						display = FieldLabels[key].display
					}
					return {
						label,
						existing: this.selectedRequest.existing_values[key],
						modified: this.selectedRequest.new_values[key],
						display
					}
				})
			} else {
				return []
			}
		}
	},
	mounted () {
		this.getRequests()
	},
	methods: {
		/**
		 * To approve a request
		 * @function
		 * @param {object} request - The selected request
		 * @returns {undefined}
		 */
		approveRequest (request) {
			this.approving = true
			this.selectedRequest = request
			this.submitApproval(true)
		},
		/**
		 * To reject a request
		 * @function
		 * @param {object} request - The selected request
		 * @returns {undefined}
		 */
		rejectRequest (request) {
			this.rejecting = false
			this.selectedRequest = request
			this.submitApproval(false)
		},
		/**
		 * To switch to the list view
		 * @function
		 * @returns {undefined}
		 */
		viewList () {
			this.selectedRequest = {}
			this.view = 'list'
		},
		/**
		 * To view the details of the selected request
		 * @function
		 * @param {object} request - The request to preview
		 * @returns {undefined}
		 */
		viewRequest (request) {
			this.selectedRequest = request
			this.view = 'single'
		},
		/**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
		activePageUpdate (val) {
			if (parseInt(this.activePage) !== parseInt(val)) {
				this.activePage = val
				this.getRequests()
			}
		},
		/**
		 * To clear the error.
		 * @function
		 * @param {string} name - The name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To get a list of pending requests.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getRequests () {
			this.loading = true
			var approvalsVue = this
			let pagination = {
				page: this.activePage,
				records_per_page: this.recordsPerPage,
				status: 0 // only show requests that have not yet been approved
			}
			return ApprovalsFunctions.getRequests(pagination)
				.then(response => {
					approvalsVue.requests = response.payload.docs.map(request => {
						try {
							let date = new Date(request.createdAt)
							let formattedDate =
								date.toLocaleDateString('en-US') +
								' ' +
								date.toLocaleTimeString('en-US')
							return {
								...request,
								action: request.action ? request.action : '(unavailable)',
								date,
								formattedDate
							}
						} catch (e) {
							return request
						}
					})
					approvalsVue.total = Math.ceil(
						response.payload.total / approvalsVue.recordsPerPage
					)
					if (!response.payload.docs.length) {
						approvalsVue.noResults = true
						approvalsVue.$root.requestsPending = false
					}
					approvalsVue.loading = false
				})
				.catch(reason => {
					approvalsVue.loading = false
					console.log(reason)
					ajaxErrorHandler({
						reason,
						errorText: 'Could not fetch changes to approve',
						errorName: 'errorMessage',
						vue: approvalsVue
					})
				})
		},
		/**
		 * To approve or reject a request
		 * @function
		 * @param {boolean} approved - Approval status
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		submitApproval (approved) {
			var approvalsVue = this
			let review = {
				approve: approved ? 1 : 0,
				approved_by: this.$root.activeUser.id,
				approved_by_name: this.$root.activeUser.name
			}
			return ApprovalsFunctions.approveRequest(
				approvalsVue.selectedRequest,
				review
			)
				.then(response => {
					approvalsVue.view = 'list'
					approvalsVue.getRequests()
					approvalsVue.showApproveSuccess(approved)
					approvalsVue.approving = false
					approvalsVue.rejecting = false
				})
				.catch(reason => {
					approvalsVue.approving = false
					approvalsVue.rejecting = false
					ajaxErrorHandler({
						reason,
						errorText: 'Could not fetch changes to approve',
						errorName: 'errorMessage',
						vue: approvalsVue
					})
				})
		},
		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @param {boolean} approved - Status of the approval
		 * @returns {undefined}
		 */
		showApproveSuccess (approved) {
			this.$swal({
				title: 'Success',
				text: approved ? 'Changes approved' : 'Changes rejected',
				type: 'success',
				confirmButtonText: 'OK'
			})
		}
	},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		Pagination
	}
}
</script>
<style scoped>
.min-height-200 {
  min-height: 300px;
}
.break-long {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
.changed {
  background-color: #fcf8e3;
}
.padding-y-20 {
  padding-top: 20px;
  padding-bottom: 20px;
}
.padding-y-10 {
  padding-top: 10px;
  padding-bottom: 10px;
}
p {
  margin: 0;
}
.border-bottom-light {
  border-bottom: 1px solid #f2f2f2;
}
.third-width {
  width: 30%;
}
.transparent {
  opacity: 0;
}
.hover-highlight:hover {
  background-color: #e5e5e5;
  transition: background-color 0.5s;
}
.v-center {
  display: flex;
  align-items: center;
}
</style>

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
						<div class="caption-desc font-grey-cascade">Review and approve or reject the changes below.</div>
					</div>
				</div>

				<div class="portlet-body relative-block">
					<div class="alert alert-danger" v-show="errorMessage" ref="errorMessage">
						<span>{{errorMessage}}</span>
						<button class="close" @click="clearError('errorMessage')"></button>
					</div>

					<loading-screen 
						:show="loading" 
					></loading-screen>

					<no-results 
						:show="noResults" 
						:custom="true" 
						text="There are no changes to review"
					>
					</no-results>

					<div 
						ref="request"
						v-show="!loading && !noResults && requests.length">

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

						<div 
							class="row padding-y-10 border-bottom-light"
							v-for="(field, index) in request" 
							:key="index"
							:class="{'changed' : field.existing !== field.modified}">
								<div class="col-xs-2">
									{{field.label}}	
								</div>
								<div class="col-xs-5 break-long">
									<p>{{field.existing}}</p>
								</div>
								<div class="col-xs-5">
									{{field.modified}}
								</div>
						</div>
						<div class="row margin-top-20">
							<div class="col-xs-12">
								<pagination 
									:passedPage="activePage" 
									:numPages="total" 
									@activePageChange="activePageUpdate">
								</pagination>
								<div class="pull-right" v-if="$root.permissions['approvals update']">
									<button 
										v-show="total !== activePage"
										class="btn blue btn-outline margin-right-10"
										@click="skip(1)"
									>
										Skip
									</button>
									<button 
										class="btn btn-danger margin-right-10"
										@click="approveRequest(false)"
									>
										Reject
									</button>
									<button 
										@click="approveRequest(true)"
										class="btn blue"
									>
										Approve
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
				{name: 'Admin Manager', link: false},
				{name: 'Approvals', link: false}
			],
			requests: [],
			errorMessage: '',
			loading: false,
			noResults: false,
			activePage: 1,
			total: 0
		}
	},
	computed: {
		request () {
			if (this.requests[0]) {
				const keys = Object.keys(this.requests[0].existing_values)
				return keys.map(key => {
					let label
					let display = true
					if (FieldLabels[key] === undefined) {
						label = key.replace(/_/g, ' ')
						label = label.charAt(0).toUpperCase() + label.slice(1)
					} else {
						label = FieldLabels[key].label
						display = FieldLabels[key].display
					}
					return {
						label,
						existing: this.requests[0].existing_values[key],
						modified: this.requests[0].new_values[key],
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
		 * To skip items
		 * @function
		 * @param {integer} num - An integer representing how many to skip
		 * @returns {undefined}
		 */
		skip (num) {
			this.clearError('errorMessage')
			this.activePageUpdate(this.activePage + num)
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
				window.scrollTo(0, 0)
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
				records_per_page: 1,
				status: 0 // only show requests that have not yet been approved
			}
			return ApprovalsFunctions.getRequests(pagination)
			.then(response => {
				approvalsVue.requests = response.payload.docs
				approvalsVue.total = response.payload.total
				if (!response.payload.docs.length) {
					approvalsVue.noResults = true
					approvalsVue.$root.requestsPending = false
				}
				approvalsVue.loading = false
			}).catch(reason => {
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
		approveRequest (approved) {
			var approvalsVue = this
			let review = {
				approve: approved ? 1 : 0,
				approved_by: this.$root.activeUser.id,
				approved_by_name: this.$root.activeUser.name
			}
			return ApprovalsFunctions.approveRequest(approvalsVue.requests[0], review)
			.then(response => {
				approvalsVue.getRequests()
				approvalsVue.showApproveSuccess(approved)
			}).catch(reason => {
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
</style>

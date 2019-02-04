<template>
  <div>
    <div>
      <div class="page-bar">
        <breadcrumb :crumbs="breadcrumbArray" />
      </div>
      <h1 class="page-title">
        Approvals
      </h1>
      <div class="note note-info">
        <p>Approve or reject pending requests.</p>
      </div>

      <div class="portlet light portlet-fit bordered min-height-200">
        <div class="portlet-title bg-blue-chambray">
          <div class="menu-image-main">
            <img src="../../../../public/client_logo.png">
          </div>
          <div class="caption">
            <span class="caption-subject font-default bold uppercase">
              Approvals
            </span>
            <div class="caption-desc font-grey-cascade">
              Review and approve or reject pending change requests.
            </div>
          </div>
        </div>

        <div class="portlet-body relative-block">
          <div
            v-show="errorMessage"
            ref="errorMessage"
            class="alert alert-danger"
          >
            <span>{{ errorMessage }}</span>
            <button
              class="close"
              @click="clearError('errorMessage')"
            />
          </div>

          <loading-screen :show="loading" />

          <no-results
            :show="noResults"
            :custom="true"
            text="There are no changes to review"
          />

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

              <div
                v-for="(request, index) in requests"
                :key="index"
                class="row padding-y-10 border-bottom-light clickable hover-highlight v-center break-long"
                :class="{'transparent' : loading}"
                @click="viewRequest(request)"
              >
                <div class="col-xs-3">
                  {{ request.action }}
                </div>
                <div class="col-xs-3">
                  <p>{{ request.created_by_name }}</p>
                </div>
                <div class="col-xs-3">
                  {{ request.formattedDate }}
                </div>
                <div class="col-xs-4">
                  <button
                    class="btn blue btn-sm third-width"
                    @click.stop="approveRequest(request)"
                  >
                    Approve
                  </button>
                  <button class="btn blue btn-outline btn-sm third-width">
                    Details
                  </button>
                </div>
              </div>
              <div class="row margin-top-20">
                <div class="col-xs-12">
                  <pagination
                    :passed-page="activePage"
                    :num-pages="total"
                    @activePageChange="activePageUpdate"
                  />
                </div>
              </div>
            </div>

            <div
              v-show="view === 'single'"
              ref="request"
            >
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
                v-for="(field, index) in request"
                :key="index"
                class="row padding-y-10 border-bottom-light break-long"
                :class="{'changed' : field.existing !== field.modified}"
              >
                <div class="col-xs-2">
                  <p>{{ field.label }}</p>
                </div>
                <div class="col-xs-5">
                  {{ field.existing }}
                </div>
                <div class="col-xs-5">
                  {{ field.modified }}
                </div>
              </div>

              <div class="row margin-top-20">
                <div class="col-xs-12 col-md-6">
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <textarea
                      id="approvals_message"
                      v-model="selectedRequest.message"
                      rows="4"
                      class="form-control edited"
                    />
                    <label for="approvals_message">
                      Message
                    </label>
                  </div>
                </div>
              </div>

              <div
                v-if="$root.permissions['approvals update']"
                class="row margin-top-20"
              >
                <div class="col-xs-4 col-xs-offset-8">
                  <button
                    class="btn btn-danger third-width"
                    :disabled="rejecting"
                    @click="submitApproval(false)"
                  >
                    Reject
                  </button>
                  <button
                    class="btn blue third-width"
                    :disabled="approving"
                    @click="submitApproval(true)"
                  >
                    Approve
                  </button>
                  <button
                    v-show="total !== activePage"
                    class="btn blue btn-outline third-width"
                    @click="viewList()"
                  >
                    Back
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
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		Pagination
	},
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Admin Manager', link: false },
				{ name: 'Approvals', link: false }
			],
			view: 'list',
			requests: [],
			selectedRequest: {
				action: ''
			},
			message: '',
			errorMessage: '',
			loading: false,
			approving: false,
			rejecting: false,
			noResults: false,
			activePage: 1,
			total: 0,
			recordsPerPage: 10,
			weekdayNames: {
				'0': 'Sunday',
				'1': 'Monday',
				'2': 'Tuesday',
				'3': 'Wednesday',
				'4': 'Thursday',
				'5': 'Friday',
				'6': 'Saturday'
			}
		}
	},
	computed: {
		request () {
			if (this.selectedRequest._id !== undefined) {
				const keys = Object.keys(this.selectedRequest.new_values)
				const mappedKeys = keys.map(key => {
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
				}).filter(key => key.display)

				if (this.selectedRequest.action.startsWith('add store holiday hours')) {
					const index = mappedKeys.findIndex(key => key.label === 'Holiday Hours')
					const week = mappedKeys[index]
					mappedKeys.splice(index, 1)
					this.addHours(week.modified, mappedKeys)
				}
				if (this.selectedRequest.action.startsWith('add store hours')) {
					const index = mappedKeys.findIndex(key => key.label === 'Hours')
					const week = mappedKeys[index]
					mappedKeys.splice(index, 1)
					this.addHours(week.modified, mappedKeys)
				}
				if (this.selectedRequest.action.startsWith('add store delivery hours')) {
					const index = mappedKeys.findIndex(key => key.label === 'Deliveryhour')
					const week = mappedKeys[index]
					mappedKeys.splice(index, 1)
					this.addHours(week.modified, mappedKeys)
				}
				if (this.selectedRequest.action.startsWith('add menu hours')) {
					const index = mappedKeys.findIndex(key => key.label === 'Hours')
					const week = mappedKeys[index]
					mappedKeys.splice(index, 1)
					this.addHours(week.modified, mappedKeys)
				}
				if (this.selectedRequest.action.startsWith('add category hours')) {
					const index = mappedKeys.findIndex(key => key.label === 'Category hours')
					const week = mappedKeys[index]
					mappedKeys.splice(index, 1)
					this.addHours(week.modified, mappedKeys)
				}

				return mappedKeys
			} else {
				return []
			}
		}
	},
	mounted () {
		this.getRequests()
	},
	methods: {
		addHours (input, output) {
			input.forEach(weekday => {
				output.push({
					label: this.weekdayNames[weekday.day],
					existing: '',
					modified: `${weekday.open_time} - ${weekday.close_time} (${weekday.open ? 'open' : 'closed'})`,
					display: true
				})
			})
		},
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
			this.selectedRequest = {
				...request,
				message: ''
			}
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
			if (!approved) {
				if (!this.selectedRequest.message) {
					this.errorMessage = 'Please provide a reason in the message field'
					return
				}
				review.message = this.selectedRequest.message
			}
			return ApprovalsFunctions.approveRequest(
				approvalsVue.selectedRequest,
				review
			)
				.then(response => {
					approvalsVue.view = 'list'
					approvalsVue.getRequests()
					approvalsVue.showApproveSuccess(approved)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `Could not ${approved ? 'approve' : 'reject'} the request`,
						errorName: 'errorMessage',
						vue: approvalsVue
					})
				}).finally(() => {
					approvalsVue.approving = false
					approvalsVue.rejecting = false
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

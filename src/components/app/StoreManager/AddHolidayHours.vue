<template>
	<div>
		<div>
			<div class="alert alert-danger" v-if="errorMessage.length">
		    <button class="close" data-close="alert" @click="clearError()"></button>
		    <span>{{ errorMessage }}</span>
    	</div>
  		<div class="row">
  			<div class="col-md-4">
  				<div class="form-group form-md-line-input form-md-floating-label">
      	    <input
              type="text"
              class="form-control input-sm"
              id="form_control_1"
              v-model="holidayHourDetails.name"
              :disabled="!$root.permissions['stores holiday_hours update']? true : false"
            >
	         <label for="form_control_1">Holiday Name</label>
        	</div>
  			</div>
  		</div>
    		<div class="row margin-top-20">
    			<div class="col-md-2">
    				<label>Start Date:</label><br>
    				<el-date-picker
    					v-model="holidayHourDetails.start_date"
    					type="date"
    					format="yyyy-MM-dd"
    					value-format="yyyy-MM-dd"
    					:clearable="false"
    					placeholder="Pick a start date"
		            	:disabled="!$root.permissions['stores holiday_hours update']? true : false"
            >
            </el-date-picker>
    			</div>
    			<div class="col-md-2 col-md-offset-1">
    				<label>End Date:</label><br>
    				<el-date-picker
    					v-model="holidayHourDetails.end_date"
    					type="date"
    					format="yyyy-MM-dd"
    					value-format="yyyy-MM-dd"
    					:clearable="false"
    					placeholder="Pick an end date"
			            :disabled="!$root.permissions['stores holiday_hours update']? true : false"
            >
            </el-date-picker>
    			</div>
    		</div>
			<div class="portlet margin-top-20 clear">
				<div class="portlet-body">
          <table class="table">
            <thead>
              <tr>
              	<th>Day</th>
              	<th>Opening Time</th>
                <th>Closing Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hour in holidayHourDetails.holidayhour" :key="hour.id">
              	<td class="align-middle" v-if="hour.day === 0"> Sunday </td>
              	<td class="align-middle" v-if="hour.day === 1"> Monday </td>
              	<td class="align-middle" v-if="hour.day === 2"> Tuesday </td>
              	<td class="align-middle" v-if="hour.day === 3"> Wednesday </td>
              	<td class="align-middle" v-if="hour.day === 4"> Thursday </td>
              	<td class="align-middle" v-if="hour.day === 5"> Friday </td>
              	<td class="align-middle" v-if="hour.day === 6"> Saturday </td>
                <td class="align-middle">
                	<el-time-select
                    v-model="hour.open_time"
                    :picker-options="{ start: '00:00', end: '23:59', step: '00:01' }"
                    :clearable="false"
                    placeholder="Opening time"
                    class="narrow-picker"
                    :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                  >
                  </el-time-select>
                	<button
                    data-toggle="tooltip"
                    title="Copy to all"
                    class="btn btn-icon-only btn-outline blue"
                    @click="applyOpeningTimeToAll(hour.open_time)"
                    :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                  >
                		<i class="fa fa-clone" aria-hidden="true"></i>
                	</button>
                </td>
                <td class="align-middle">
                	<el-time-select
                    v-model="hour.close_time"
                    :picker-options="{ start: '00:00', end: '23:59', step: '00:01' }"
                    :clearable="false"
                    placeholder="Closing time"
                    class="narrow-picker"
                    :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                  >
                  </el-time-select>
                	<button
                    data-toggle="tooltip"
                    title="Copy to all"
                    class="btn btn-icon-only btn-outline blue"
                    @click="applyClosingTimeToAll(hour.close_time)"
                    :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                  >
                		<i class="fa fa-clone" aria-hidden="true"></i>
                	</button>
                </td>
                <td class="align-middle">
                	<el-switch
                		v-model="hour.open"
                		active-color="#0c6"
                		inactive-color="#ff4949"
                		:active-value="1"
                		:inactive-value="0"
                		active-text="Open"
                		inactive-text="Closed"
	                    :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                  >
                	</el-switch>
                </td>
              </tr>
            </tbody>
          </table>
				</div>
			</div>
			<button
				type="button"
				class="btn btn-primary"
				@click="addHolidayHours()"
				:disabled="!$root.permissions['stores holiday_hours update'] || savingHolidayHours">
				Add
				<i 
					v-show="savingHolidayHours"
					class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</div>
</template>

<script>

export default {
	data () {
		return {
			showHolidayHoursModal: false,
			errorMessage: '',
			holidayHourDetails: {
				location_id: this.selectedLocationId,
				created_by: this.$root.createdBy,
				start_date: '',
				end_date: '',
				name: '',
				holidayhour: [
					{
						day: 1,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 2,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 3,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 4,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 5,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 6,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 0,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					}
				]
			}
		}
	},
	props: {
		selectedLocationId: {
			type: Number,
			default: 0
		},
		savingHolidayHours: {
			type: Boolean,
			default: () => false
		}
	},
	mounted () {
		this.showHolidayHoursModal = true
	},
	methods: {
		/**
		 * To copy the time to other days.
		 * @function
		 * @param {string} time - The time to copy
		 * @returns {undefined}
		 */
		applyOpeningTimeToAll (time) {
			this.holidayHourDetails.holidayhour.forEach(day => {
				day.open_time = time
			})
		},
		/**
		 * To copy the time to other days.
		 * @function
		 * @param {string} time - The time to copy
		 * @returns {undefined}
		 */
		applyClosingTimeToAll (time) {
			this.holidayHourDetails.holidayhour.forEach(day => {
				day.close_time = time
			})
		},
		/**
		 * To clear the error
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To emit the holiday hour details to the parent.
		 * @function
		 * @returns {undefined}
		 */
		addHolidayHours () {
			this.holidayHourDetails.location_id = this.selectedLocationId
			let hoursMissing = false
			let regex = new RegExp('[0-2][0-9]:[0-5][0-9]')
			this.holidayHourDetails.holidayhour.forEach((day) => {
				if (!regex.test(day.open_time) || !regex.test(day.close_time)) {
					hoursMissing = true
					return
				}
			})
			if (!this.holidayHourDetails.name.length) {
				this.errorMessage = 'Holiday name is required.'
			} else if (!this.holidayHourDetails.start_date) {
				this.errorMessage = 'Start Date cannot be blank.'
			} else if (!this.holidayHourDetails.end_date) {
				this.errorMessage = 'End Date cannot be blank.'
			} else if (this.holidayHourDetails.start_date > this.holidayHourDetails.end_date) {
				this.errorMessage = 'Start Date cannot be after End Date.'
			} else if (hoursMissing) {
				this.errorMessage = 'Opening and Closing Times cannot be empty. Enter 00:00 for days when the Store is closed.'
			} else {
				this.$emit('addHolidayHours', this.holidayHourDetails)
				this.resetForm()
			}
		},
		/**
		 * To reset the form.
		 * @function
		 * @returns {undefined}
		 */
		resetForm () {
			this.errorMessage = ''
			this.holidayHourDetails = {
				location_id: this.selectedLocationId,
				created_by: this.$root.createdBy,
				start_date: '',
				end_date: '',
				name: '',
				holidayhour: [
					{
						day: 1,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 2,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 3,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 4,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 5,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 6,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					},
					{
						day: 0,
						open: 1,
						open_time: '00:00',
						close_time: '00:00',
						status: 1
					}
				]
			}
		}
	}
}
</script>

<style scoped>
.el-date-editor.el-input.narrow-picker {
	width: 150px;
}
.align-middle {
	vertical-align: middle;
}
</style>

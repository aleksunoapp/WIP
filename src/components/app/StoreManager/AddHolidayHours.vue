<template>
  <div>
    <div>
      <div
        v-if="errorMessage.length"
        class="alert alert-danger"
      >
        <button
          class="close"
          data-close="alert"
          @click="clearError()"
        />
        <span>{{ errorMessage }}</span>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="form-group form-md-line-input form-md-floating-label">
            <input
              id="form_control_1"
              v-model="holidayHourDetails.name"
              type="text"
              class="form-control input-sm"
              :disabled="!$root.permissions['stores holiday_hours update']? true : false"
            >
            <label for="form_control_1">
              Holiday Name
            </label>
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
          />
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
          />
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
              <tr
                v-for="hour in holidayHourDetails.holidayhour"
                :key="hour.id"
              >
                <td
                  v-if="hour.day === 0"
                  class="align-middle"
                >
                  Sunday
                </td>
                <td
                  v-if="hour.day === 1"
                  class="align-middle"
                >
                  Monday
                </td>
                <td
                  v-if="hour.day === 2"
                  class="align-middle"
                >
                  Tuesday
                </td>
                <td
                  v-if="hour.day === 3"
                  class="align-middle"
                >
                  Wednesday
                </td>
                <td
                  v-if="hour.day === 4"
                  class="align-middle"
                >
                  Thursday
                </td>
                <td
                  v-if="hour.day === 5"
                  class="align-middle"
                >
                  Friday
                </td>
                <td
                  v-if="hour.day === 6"
                  class="align-middle"
                >
                  Saturday
                </td>
                <td class="align-middle">
                  <el-time-select
                    v-model="hour.open_time"
                    :picker-options="{ start: '00:00', end: '23:59', step: '00:01' }"
                    :clearable="false"
                    placeholder="Opening time"
                    class="narrow-picker"
                    :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                  />
                  <button
                    data-toggle="tooltip"
                    title="Copy to all"
                    class="btn btn-icon-only btn-outline blue"
                    :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                    @click="applyOpeningTimeToAll(hour.open_time)"
                  >
                    <i
                      class="fa fa-clone"
                      aria-hidden="true"
                    />
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
                  />
                  <button
                    data-toggle="tooltip"
                    title="Copy to all"
                    class="btn btn-icon-only btn-outline blue"
                    :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                    @click="applyClosingTimeToAll(hour.close_time)"
                  >
                    <i
                      class="fa fa-clone"
                      aria-hidden="true"
                    />
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
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!$root.permissions['stores holiday_hours update'] || savingHolidayHours"
        @click="addHolidayHours()"
      >
        Add
        <i
          v-show="savingHolidayHours"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </div>
</template>

<script>
export default {
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
      this.holidayHourDetails.holidayhour.forEach(day => {
        if (!regex.test(day.open_time) || !regex.test(day.close_time)) {
          hoursMissing = true
        }
      })
      if (!this.holidayHourDetails.name.length) {
        this.errorMessage = 'Holiday name is required.'
      } else if (!this.holidayHourDetails.start_date) {
        this.errorMessage = 'Start Date cannot be blank.'
      } else if (!this.holidayHourDetails.end_date) {
        this.errorMessage = 'End Date cannot be blank.'
      } else if (
        this.holidayHourDetails.start_date > this.holidayHourDetails.end_date
      ) {
        this.errorMessage = 'Start Date cannot be after End Date.'
      } else if (hoursMissing) {
        this.errorMessage =
					'Opening and Closing Times cannot be empty. Enter 00:00 for days when the Store is closed.'
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

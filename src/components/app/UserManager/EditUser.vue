<template>
  <div class="portlet box blue-hoki">
    <div class="portlet-title bg-blue-chambray">
      <div class="caption">
        Edit User Information
      </div>
    </div>
    <div class="portlet-body">
      <form
        role="form"
        @submit.prevent="save()"
      >
        <div class="form-body row">
          <div class="col-xs-12">
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
          <div class="col-xs-12 col-md-6 col-lg-4">
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="first_name"
                v-model="first_name"
                type="text"
                class="form-control input-sm"
                :class="{'edited': first_name.length}"
              >
              <label for="first_name">
                First Name
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="last_name"
                v-model="last_name"
                type="text"
                class="form-control input-sm"
                :class="{'edited': last_name.length}"
              >
              <label for="last_name">
                Last Name
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="phone"
                v-model="maskedPhone"
                type="text"
                class="form-control input-sm"
                :class="{'edited': maskedPhone.length}"
              >
              <label for="phone">
                Phone
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="address"
                v-model="address"
                type="text"
                class="form-control input-sm"
                :class="{'edited': address.length}"
              >
              <label for="address">
                Address Line 1
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="address2"
                v-model="address2"
                type="text"
                class="form-control input-sm"
                :class="{'edited': address2.length}"
              >
              <label for="address2">
                Address Line 2
              </label>
            </div>
          </div>
          <div class="col-xs-12 col-md-6 col-lg-4">
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="city"
                v-model="city"
                type="text"
                class="form-control input-sm"
                :class="{'edited': city.length}"
              >
              <label for="city">
                City
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="province"
                v-model="province"
                type="text"
                class="form-control input-sm"
                :class="{'edited': province.length}"
              >
              <label for="province">
                Province
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="postal_code"
                v-model="postal_code"
                type="text"
                class="form-control input-sm"
                :class="{'edited': postal_code.length}"
              >
              <label for="postal_code">
                Postal Code
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="country"
                v-model="country"
                type="text"
                class="form-control input-sm"
                :class="{'edited': country.length}"
              >
              <label for="country">
                Country
              </label>
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="ref_code"
                v-model="ref_code"
                type="text"
                class="form-control input-sm"
                :class="{'edited': ref_code.length}"
              >
              <label for="ref_code">
                Referral Code
              </label>
            </div>
          </div>
          <div class="col-xs-12 col-md-6 col-lg-4">
            <div class="form-group form-md-line-input form-md-floating-label">
              <p class="grey-label">
                Date Of Birth
              </p>
              <el-date-picker
                v-model="date_of_birth"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :clearable="true"
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
          <div class="col-xs-12 col-md-6 col-lg-4">
            <div class="form-group form-md-line-input form-md-floating-label">
              <label>Send notifications?</label><br>
              <el-switch
                v-model="send_notification"
                active-color="#0c6"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                active-text="Yes"
                inactive-text="No"
              />
            </div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <label>Send emails?</label><br>
              <el-switch
                v-model="send_email"
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

        <div class="form-actions right margin-top-20">
          <div class="row">
            <div class="col-xs-12">
              <button
                type="submit"
                class="btn blue"
                :disabled="saving"
              >
                Save
                <i
                  v-show="saving"
                  class="fa fa-spinner fa-pulse fa-fw"
                />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { editUser } from '@/controllers/Users.js'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  data: () => ({
    errorMessage: '',
    saving: false
  }),
  computed: {
    user () {
      return this.$store.state.users.user
    },
    first_name: {
      get () {
        return this.$store.state.users.user.first_name || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          first_name: val
        })
      }
    },
    last_name: {
      get () {
        return this.$store.state.users.user.last_name || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          last_name: val
        })
      }
    },
    phone: {
      get () {
        return this.$store.state.users.user.phone || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          phone: val
        })
      }
    },
    maskedPhone: {
      set (value) {
        this.phone = value.replace(/\D/g, '')
      },
      get () {
        if (String(this.phone).length === 0) {
          return ''
        } else {
          let formatted = String(this.phone).split('')
          if (formatted.length > 0) {
            formatted.splice(0, 0, '(')
          }
          if (formatted.length > 4) {
            formatted.splice(4, 0, ') ')
          }
          if (formatted.length > 8) {
            formatted.splice(8, 0, '-')
          }
          if (formatted.length > 13) {
            formatted.splice(13, 0, '-')
          }
          return formatted.join('')
        }
      }
    },
    address: {
      get () {
        return this.$store.state.users.user.address || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          address: val
        })
      }
    },
    address2: {
      get () {
        return this.$store.state.users.user.address2 || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          address2: val
        })
      }
    },
    city: {
      get () {
        return this.$store.state.users.user.city || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          city: val
        })
      }
    },
    province: {
      get () {
        return this.$store.state.users.user.province || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          province: val
        })
      }
    },
    postal_code: {
      get () {
        return this.$store.state.users.user.postal_code || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          postal_code: val
        })
      }
    },
    country: {
      get () {
        return this.$store.state.users.user.country || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          country: val
        })
      }
    },
    date_of_birth: {
      get () {
        return this.$store.state.users.user.date_of_birth || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          date_of_birth: val
        })
      }
    },
    ref_code: {
      get () {
        return this.$store.state.users.user.ref_code || ''
      },
      set (val) {
        this.setUser({
          ...this.user,
          ref_code: val
        })
      }
    },
    send_notification: {
      get () {
        return this.$store.state.users.user.send_notification
      },
      set (val) {
        this.setUser({
          ...this.user,
          send_notification: val
        })
      }
    },
    send_email: {
      get () {
        return this.$store.state.users.user.send_email
      },
      set (val) {
        this.setUser({
          ...this.user,
          send_email: val
        })
      }
    }
  },
  beforeDestroy () {
    this.clearUser()
  },
  methods: {
    ...mapMutations({
      setUser: 'users/SET_USER',
      clearUser: 'users/CLEAR_USER'
    }),
    clearError (name) {
      this[name] = ''
    },
    /**
		 * To validate data before submitting to the backend
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    validate () {
      const _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.first_name) {
          reject('Please enter First Name')
        } else if (!_this.last_name) {
          reject('Please enter Last Name')
          // } else if (!_this.phone) {
          // 	reject('Please enter Phone')
        } else if (_this.maskedPhone && _this.maskedPhone.length < 13) {
          reject('Phone must be at least 10 digits')
          // } else if (!_this.address) {
          // 	reject('Please enter Addrress Line 1')
          // } else if (!_this.address2) {
          // 	reject('Please enter Addrress Line 2')
          // } else if (!_this.city) {
          // 	reject('Please enter City')
          // } else if (!_this.province) {
          // 	reject('Please enter Province')
        } else if (!_this.postal_code) {
          reject('Please enter Postal Code')
        } else if (!_this.country) {
          // 	reject('Please enter Country')
          // } else if (!_this.ref_code) {
          // 	reject('Please enter Referral Code')
        } else if (!_this.date_of_birth) {
          reject('Please enter date_of_birth')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To call the database.
		 * @function
		 * @returns {object} - A promise
		 */
    save () {
      var _this = this
      return this.validate()
        .then(response => {
          this.saving = true

          let payload = {
            id: this.user.id,
            email: this.user.email,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            phone: this.user.phone,
            address: this.user.address,
            address2: this.user.address2,
            city: this.user.city,
            province: this.user.province,
            postal_code: this.user.postal_code,
            country: this.user.country,
            ref_code: this.user.ref_code,
            date_of_birth: this.user.date_of_birth,
            send_notification: this.user.send_notification,
            send_email: this.user.send_email
          }
          editUser(payload)
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                _this.showAddSuccess(response.payload)
                _this.$router.push({
                  name: 'UserProfile',
                  params: {
                    id: payload.id,
                    name: `${payload.first_name} ${payload.last_name}`
                  }
                })
                _this.clearUser()
              } else {
                throw Error('Something went wrong')
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not save the User',
                errorName: 'errorMessage',
                vue: _this
              })
            })
            .finally(() => {
              _this.saving = false
            })
        })
        .catch(reason => {
          console.log({ reason })
          _this.errorMessage = reason
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showAddSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The User has been saved'
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
    }
  }
}
</script>

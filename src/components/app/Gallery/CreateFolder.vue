<template>
  <div class="portlet box blue-hoki margin-top-20">
    <div class="portlet-title bg-blue-chambray">
      <div class="caption">
        <i class="fa fa-plus-circle" />
        Create Resource Folder
      </div>
      <div class="tools">
        <a class="expand" />
      </div>
    </div>
    <div class="portlet-body">
      <form
        role="form"
        @submit.prevent="createFolder()"
      >
        <div class="row">
          <div class="col-xs-12">
            <div
              v-show="errorMessage.length"
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
          <div class="col-xs-12 col-md-6">
            <div class="form-group form-md-line-input form-md-floating-label">
              <input
                id="form_control_name"
                v-model="newFolder.name"
                type="text"
                class="form-control input-sm"
              >
              <label for="form_control_name">
                Name
              </label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-6">
            <button
              type="submit"
              class="btn blue pull-right"
              :disabled="creating"
            >
              Create
              <i
                v-show="creating"
                class="fa fa-spinner fa-pulse fa-fw"
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ResourcesFunctions from '@/controllers/Resources'
import GlobalVariables from '@/global.js'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			errorMessage: '',
			creating: false,
			newFolder: {
				name: '',
				is_shared: 1
			}
		}
	},
	methods: {
		/**
		 * To validate that all information is accurate before allowing the user to proceed.
		 * @function
		 * @returns {object} A promise that will either return an error message or display the success screen.
		 * @memberof CreateFolder
		 * @version 0.0.9
		 */
		validateFormData () {
			let _this = this

			return new Promise((resolve, reject) => {
				if (!_this.newFolder.name.length) {
					reject('Folder name cannot be blank.')
				}
				resolve()
			})
		},
		/**
		 * To clear an error.
		 * @function
		 * @param {string} name - Name of the error variable
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To send the details of the new folder to the backend.
		 * @function
		 * @returns {object} A promise that will either return an error message or display the success screen.
		 * @memberof CreateFolder
		 * @version 0.0.9
		 */
		createFolder () {
			let _this = this

			return _this
				.validateFormData()
				.then(response => {
					_this.creating = true
					_this.clearError('errorMessage')
					const businessId = GlobalVariables.resourcesBusinessId

					ResourcesFunctions.createFolder(
						businessId,
						undefined,
						_this.newFolder,
						_this.$route.params.parent_id
					)
						.then(response => {
							_this.showCreateSuccess(response.payload)
						})
						.catch(reason => {
							let errorText = 'Could not create folder'
							if (reason.responseJSON && reason.responseJSON.declaration === 'already_exists') {
								errorText = 'Folder with this name already exists'
							}
							ajaxErrorHandler({
								reason,
								errorText,
								errorName: 'errorMessage',
								vue: _this
							})
						})
						.finally(() => {
							_this.creating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					if (reason) {
						_this.errorMessage = reason
					}
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showCreateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Folder has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Folder has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			}).then(
				() => {
					this.$router.push({ name: 'Gallery' })
				}
			)
		},
		/**
		 * To clear the object 'newFolder'.
		 * @function
		 * @returns {undefined}
		 * @memberof CreateFolder
		 * @version 0.0.9
		 */
		clearForm () {
			this.newFolder = {
				name: '',
				is_shared: false
			}
		}
	}
}
</script>

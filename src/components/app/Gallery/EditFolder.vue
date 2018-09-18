<template>
	<div class="portlet box blue-hoki margin-top-20">
		<div class="portlet-title bg-blue-chambray">
			<div class="caption">
				<i class="fa fa-plus-circle"></i>
				Create Resource Folder
			</div>
			<div class="tools">
				<a class="expand"></a>
			</div>
		</div>
		<div class="portlet-body">
			<form role="form"
			      @submit.prevent="updateFolder()">
				<div class="row">
					<div class="col-md-12">
						<div class="alert alert-danger"
						     v-if="errorMessage.length">
							<button class="close"
							        data-close="alert"
							        @click.prevent="clearError('errorMessage')"></button>
							<span>{{errorMessage}}</span>
						</div>
					</div>
					<div class="col-xs-12 col-md-6">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text"
							       class="form-control input-sm"
							       :class="{'edited' : folder.name}"
							       id="form_control_name"
							       v-model="folder.name">
							<label for="form_control_name">Name</label>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12 col-md-6">
						<button type="submit"
						        class="btn blue pull-right"
						        :disabled="updating">
							Save
							<i v-show="updating"
							   class="fa fa-spinner fa-pulse fa-fw">
							</i>
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

export default {
	data () {
		return {
			errorMessage: '',
			updating: false,
			newFolder: {
				name: '',
				is_shared: 1
			},
			folder: {}
		}
	},
	created () {
		this.folder = JSON.parse(this.$route.params.folder)
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
				if (!_this.folder.name.length) {
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
		 * To send the details of the updated folder to the backend.
		 * @function
		 * @returns {object} A promise that will either return an error message or display the success screen.
		 * @memberof CreateFolder
		 * @version 0.0.9
		 */
		updateFolder () {
			let _this = this

			return _this
				.validateFormData()
				.then(response => {
					_this.updating = true
					_this.clearError('errorMessage')
					const businessId = GlobalVariables.resourcesBusinessId
					let folderName = _this.folder.name

					ResourcesFunctions.updateFolder(
						businessId,
						undefined,
						_this.folder.id,
						folderName,
						_this.folder.is_shared
					)
						.then(response => {
							_this.showUpdateSuccess(response.payload)
						})
						.catch(err => {
							err
						})
						.finally(() => {
							_this.updating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					_this.errorMessage = reason
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showUpdateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Folder has been saved'
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
		}
	}
}
</script>

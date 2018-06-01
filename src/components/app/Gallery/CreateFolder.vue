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
			<form role="form" @submit.prevent="createFolder()">
				<div class="row">
					<div class="col-xs-12">
						<div class="alert alert-danger" v-if="errorMessage.length">
							<button class="close" data-close="alert" @click.prevent="clearError('errorMessage')"></button>
							<span>{{errorMessage}}</span>
						</div>
					</div>
					<div class="col-xs-12 col-md-6">
						<div class="form-group form-md-line-input form-md-floating-label">
							<input 
								type="text" 
								class="form-control input-sm" 
								id="form_control_name" 
								v-model="newFolder.name"
							>
							<label for="form_control_name">Name</label>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12 col-md-6">
						<button type="submit" class="btn blue pull-right">Create</button>	
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

			return _this.validateFormData().then(response => {
				_this.clearError('errorMessage')
				const businessId = GlobalVariables.businessId

				ResourcesFunctions.createFolder(businessId, undefined, _this.newFolder, _this.$route.params.parent_id)
				.then(response => {
					_this.showCreateSuccess()
				}).catch(err => {
					console.log(err)
				})
			}).catch(reason => {
				console.log(reason)
				// If validation fails then display the error message
				if (reason) {
					_this.errorMessage = reason
				}
			})
		},
		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		showCreateSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Folder created',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				this.$router.push({name: 'Gallery'})
			}, dismiss => {
				this.$router.push({name: 'Gallery'})
			})
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

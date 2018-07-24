<template>
	<div>
		<div>
			<h1 class='page-title'>Profile</h1>
			<div class="note note-info">
      		<p>View your account information and change your password.</p>
		</div>

		<div class="row">
			<div class="col-xs-12">
				<p>Name: {{$root.activeUser.name}}</p>
				<p>Email: {{$root.activeUser.email}}</p>
				<p>Assigned: {{userLocationCount}} store<span v-if="userLocationCount !== 0">s</span></p>
				<p>Roles: </p>
				<ul>
					<li v-for="(role, index) in $root.roles" :key="index">{{role}}</li>
				</ul>
			</div>
		</div>
		<div class="row margin-top-20">
			<div class="col-xs-12">
				<form role="form" @submit.prevent="changePassword()">
					<div class="row">
						<div class="col-md-6">
							<div class="alert alert-info">
								<span>
									Your new password must be at least 8 characters long, 
									contain English letters only 
									and include at least one capital and one number.
								</span>
							</div>

							<div class="alert alert-danger" v-show="errorMessage.length">
								<button class="close" @click.prevent="clearError('errorMessage')"></button>
								<span>{{errorMessage}}</span>
							</div>

							<div class="form-group form-md-line-input form-md-floating-label" v-show="passwordMasked">
								<div class="input-group">
									<input 
										type="password" 
										class="form-control input-sm" 
										id="current_masked" 
										v-model="currentPassword" 
										:class="{'edited': currentPassword.length}">
									<label for="current_masked">Current password</label>
									<span class="input-group-addon clickable" @click="flipPasswordMask()">
										<i class="fa fa-eye"></i>
									</span>
								</div>
								<div class="input-group">
									<input 
										type="password" 
										class="form-control input-sm" 
										id="new_masked" 
										v-model="newPassword" 
										:class="{'edited': newPassword.length}">
									<label for="new_masked">New password</label>
									<span class="input-group-addon clickable" @click="flipPasswordMask()">
										<i class="fa fa-eye"></i>
									</span>
								</div>
								<div class="input-group">
									<input 
										type="password" 
										class="form-control input-sm" 
										id="confirm_masked" 
										v-model="newPasswordConfirmation" 
										:class="{'edited': newPasswordConfirmation.length}">
									<label for="confirm_masked">Confirm password</label>
									<span class="input-group-addon clickable" @click="flipPasswordMask()">
										<i class="fa fa-eye"></i>
									</span>
								</div>
							</div>

							<div class="form-group form-md-line-input form-md-floating-label" v-show="!passwordMasked">
								<div class="input-group">
									<input 
										type="text" 
										class="form-control input-sm" 
										id="current_unmasked" 
										v-model="currentPassword" 
										:class="{'edited': currentPassword}">
									<label for="current_unmasked">Current password</label>
									<span class="input-group-addon clickable" @click="flipPasswordMask()">
										<i class="fa fa-eye-slash"></i>
									</span>
								</div>
								<div class="input-group ">
									<input 
										type="text" 
										class="form-control input-sm" 
										id="new_unmasked" 
										v-model="newPassword" 
										:class="{'edited': newPassword}">
									<label for="new_unmasked">New password</label>
									<span class="input-group-addon clickable" @click="flipPasswordMask()">
										<i class="fa fa-eye-slash"></i>
									</span>
								</div>
								<div class="input-group">
									<input 
										type="text" 
										class="form-control input-sm" 
										id="confirm_unmasked" 
										v-model="newPasswordConfirmation" 
										:class="{'edited': newPasswordConfirmation}">
									<label for="confirm_unmasked">Confirm password</label>
									<span class="input-group-addon clickable" @click="flipPasswordMask()">
										<i class="fa fa-eye-slash"></i>
									</span>
								</div>
							</div>

							<button 
								@click="changePassword()"
								type="submit" 
								class="btn blue pull-right">
								Change
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>

		</div>
	</div>
</template>

<script>
import LoginFunctions from '@/controllers/Login'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			errorMessage: '',
			passwordMasked: true,
			currentPassword: '',
			newPassword: '',
			newPasswordConfirmation: ''
		}
	},
	computed: {
		userLocationCount () {
			let count = this.$root.storeLocations.length
			if (this.$root.activeLocation.id !== undefined) {
				return count + 1
			} else {
				return count
			}
		}
	},
	methods: {
		/**
		 * To switch bewteen masked and unmasked password fields.
		 * @function
		 * @returns {undefined}
		 */
		flipPasswordMask () {
			this.passwordMasked = !this.passwordMasked
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateResetData () {
			var profileVue = this
			const passwordRegex = new RegExp(/^((?=\S*?[A-Z])(?=\S*?[0-9]).{7,})\S$/)
			return new Promise(function (resolve, reject) {
				if (!profileVue.currentPassword) {
					reject('Please enter your current password')
				} else if (!passwordRegex.test(profileVue.newPassword)) {
					reject('Password should: be at least 8 characters long, contain only English letters and numbers, contain at least one uppercase letter and one number')
				} else if (profileVue.newPassword !== profileVue.newPasswordConfirmation) {
					reject('Passwords do not match')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To prompt the backend call that resets the user's password.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		changePassword () {
			var loginVue = this
			this.clearError('errorMessage')
			return loginVue.validateResetData()
			.then(response => {
				LoginFunctions.change(loginVue.currentPassword, loginVue.newPassword, loginVue.newPasswordConfirmation).then(response => {
					loginVue.resetForm()
					loginVue.showCreateSuccess()
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not change your password',
						errorName: 'errorMessage',
						vue: loginVue
					})
				})
			}).catch(reason => {
				loginVue.errorMessage = reason
				loginVue.$scrollTo(loginVue.$refs.errorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To reset the form
		 * @function
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		resetForm () {
			this.currentPassword = ''
			this.newPassword = ''
			this.newPasswordConfirmation = ''
			this.passwordMasked = true
		},
		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		showCreateSuccess () {
			this.$swal({
				title: 'Success',
				text: 'Password changed. Please log in again.',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// eslint-disable-next-line
				localStorage.clear()
				// eslint-disable-next-line
				sessionStorage.clear()
				this.$root.clearGlobalVariables()
				this.$router.push('/')
			})
		},
		/**
		 * To clear an error
		 * @function
		 * @param {string} name - Name of the error variable
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		}
	}
}
</script>

<style scoped>
.input-group {
	margin-top: 30px;
}
</style>


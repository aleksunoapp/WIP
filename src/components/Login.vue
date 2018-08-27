<template>
	<div id="login"
	     class="login">
		<div class="user-login-5">
			<div class="row bs-reset">
				<div class="col-md-6 bs-reset mt-login-5-bsfix">
					<div class="login-bg">
						<img class="login-logo"
						     src="../assets/img/app/unoapp-commerce-logo.png" />
					</div>
				</div>
				<div class="col-md-6 login-container bs-reset mt-login-5-bsfix">
					<div class="login-content"
					     v-if="(this.$route.name === 'Login' || this.$route.name === 'LoginExpired') && forgotPassword === false">
						<h1>UNOapp Commerce Login</h1>
						<form class="login-form"
						      @submit.prevent="login($event)"
						      novalidate>
							<div class="alert alert-danger"
							     v-show="errorMessage.length"
							     ref="errorMessage">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError()"></button>
								<span>{{errorMessage}}</span>
							</div>
							<div class="row">
								<div class="col-sm-6">
									<input ref="email"
									       class="form-control form-control-solid placeholder-no-fix form-group"
									       type="email"
									       placeholder="Email"
									       name="email"
									       v-model="user.email"
									       @keyup.enter="focusPassword" />
								</div>
								<div class="col-sm-6">
									<input ref="password"
									       class="form-control form-control-solid placeholder-no-fix form-group"
									       type="password"
									       placeholder="Password"
									       name="password"
									       v-model="user.password"
									       @keyup.enter="login" />
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12 text-right">
									<button class="btn green"
									        type="submit">Login</button>
									<a class="forgot-link forgot-link-text"
									   @click="showForgotPassword()">Forgot your password?</a>
								</div>
							</div>
						</form>
					</div>
					<div class="login-content"
					     v-if="this.$route.name === 'ForgotPassword' && resetPassword === false">
						<h1>UNOapp Commerce Forgotten Password</h1>
						<form v-if="!emailSent"
						      class="login-form"
						      @submit.prevent="forgot($event)"
						      novalidate>
							<div class="alert alert-danger"
							     v-show="errorMessage.length"
							     ref="errorMessage">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError()"></button>
								<span>{{errorMessage}}</span>
							</div>
							<div class="row">
								<div class="col-sm-6-wide">
									<input ref="email"
									       class="form-control form-control-solid placeholder-no-fix form-group"
									       type="email"
									       placeholder="Email"
									       name="email"
									       v-model="user.email"
									       @keyup.enter="focusPassword" />
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12 text-right">
									<button class="btn green"
									        type="submit">Send</button>
								</div>
							</div>
						</form>
						<div v-if="emailSent">
							<p>{{forgotMessage}}</p>
							<div class="row">
								<div class="col-sm-12 text-right">
									<button class="btn green"
									        type="submit"
									        @click="goBack()">Okay</button>
								</div>
							</div>
						</div>
					</div>
					<div class="login-content"
					     v-if="this.$route.name === 'ForgotPassword' && resetPassword === true">
						<h1>UNOapp Commerce Reset Password</h1>
						<form class="form reset-form"
						      @submit.prevent="reset($event)"
						      novalidate>
							<div class="row">
								<div class="col-md-12">
									<div class="alert alert-danger"
									     v-show="errorMessage.length"
									     ref="errorMessage">
										<button class="close"
										        data-close="alert"
										        @click.prevent="clearError()"></button>
										<span>{{errorMessage}}</span>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<p>
										Your new password must be at least 8 characters long, contain English letters only and include at least one capital letter and one number.
									</p>
								</div>
							</div>
							<div class="col-md-6-wide">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       id="form_control_email"
									       v-model="user.email"
									       :class="{'edited': user.email.length}">
									<label for="form_control_email">Email</label>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<div class="input-group"
									     v-show="passwordMasked">
										<input type="password"
										       class="form-control input-sm"
										       id="form_control_password_masked"
										       v-model="newPassword"
										       :class="{'edited': newPassword.length}">
										<label for="form_control_password_masked">Password</label>
										<span class="input-group-addon clickable"
										      @click="flipPasswordMask()">
											<i class="fa fa-eye"></i>
										</span>
									</div>
									<div class="input-group"
									     v-show="!passwordMasked">
										<input type="text"
										       class="form-control input-sm"
										       id="form_control_password"
										       v-model="newPassword"
										       :class="{'edited': newPassword.length}">
										<label for="form_control_password">Password</label>
										<span class="input-group-addon clickable"
										      @click="flipPasswordMask()">
											<i class="fa fa-eye-slash"></i>
										</span>
									</div>
								</div>
								<div class="form-group form-md-line-input form-md-floating-label">
									<div class="input-group"
									     v-show="passwordConfirmMasked">
										<input type="password"
										       class="form-control input-sm"
										       id="form_control_confirm_masked"
										       v-model="passwordCheck"
										       :class="{'edited': passwordCheck}">
										<label for="form_control_confirm_masked">Confirm password</label>
										<span class="input-group-addon clickable"
										      @click="flipPasswordConfirmMask()">
											<i class="fa fa-eye"></i>
										</span>
									</div>
									<div class="input-group"
									     v-show="!passwordConfirmMasked">
										<input type="text"
										       class="form-control input-sm"
										       id="form_control_confirm"
										       v-model="passwordCheck"
										       :class="{'edited': passwordCheck}">
										<label for="form_control_confirm">Confirm password</label>
										<span class="input-group-addon clickable"
										      @click="flipPasswordConfirmMask()">
											<i class="fa fa-eye-slash"></i>
										</span>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12 text-right">
									<button class="btn green"
									        type="submit">Reset</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
var img1 = require('../assets/img/app/login/bg1.jpg')
var img2 = require('../assets/img/app/login/bg2.jpg')
var img3 = require('../assets/img/app/login/bg3.jpg')

/**
 * @module Login
 */

import $ from 'jquery'
import GlobalFunctions from '../global'
import LoginFunctions from '../controllers/Login'
import Dropdown from './modules/Dropdown'
import { BackgroundRotator } from '../assets/scripts/backgroundRotator'
import ajaxErrorHandler from '../controllers/ErrorController'
import { routes } from '@/router'
import { mapMutations } from 'vuex'

/**
 * Define the email pattern to check for valid emails.
 * @var {regex}
 * @memberof Login
 */
var emailPattern = /^.+@.+\..+$/

export default {
	name: 'login',
	data () {
		return {
			forgotPassword: false,
			user: {
				email: '',
				password: ''
			},
			errorMessage: '',
			emailSent: false,
			forgotMessage: '',
			resetPassword: false,
			passwordMasked: true,
			passwordConfirmMasked: true,
			passwordCheck: '',
			newPassword: '',
			test: false,
			token: ''
		}
	},
	/**
	 * Run on `mounted` to initialize the background rotator.
	 * @function
	 * @returns {undefined}
	 */
	mounted () {
		if (this.$route.params.expired === 'expired') {
			this.errorMessage = 'Your session has expired. Please log back in.'
		}

		$('body').removeClass()

		var elm = $('.login-bg')
		var images = [img1, img2, img3]

		var options = { fade: 1000, duration: 6000 }

		BackgroundRotator(elm, images, options).init()

		this.$refs.email.focus()
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
		 * To switch bewteen masked and unmasked password fields.
		 * @function
		 * @returns {undefined}
		 */
		flipPasswordConfirmMask () {
			this.passwordConfirmMasked = !this.passwordConfirmMasked
		},
		/**
		 * To focus the password field
		 * @function
		 * @returns {undefined}
		 */
		focusPassword () {
			this.$refs.password.focus()
		},
		/**
		 * To show the forgot password form.
		 * @function
		 * @returns {undefined}
		 */
		showForgotPassword () {
			this.forgotPassword = true
			this.$router.push('forgot-password')
			this.clearError()
		},
		/**
		 * To go to reset password form.
		 * @function
		 * @returns {undefined}
		 */
		goReset () {
			this.forgotPassword = true
			this.emailSent = false
			this.resetPassword = true
			this.clearError()
		},
		/**
		 * To hide the forgot password form.
		 * @function
		 * @returns {undefined}
		 */
		goBack () {
			this.forgotPassword = false
			this.emailSent = false
			this.clearError()
			this.$router.push('login')
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To check if the email and password are valid before submitting to the backend for login.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateLoginData () {
			var loginVue = this
			return new Promise(function (resolve, reject) {
				if (!loginVue.user.email.length) {
					reject('Your email cannot be blank')
				} else if (!loginVue.user.password.length) {
					reject('Your password cannot be blank')
				} else if (!emailPattern.test(loginVue.user.email)) {
					reject('Please enter a valid email')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To check if the email is valid before submitting to the backend for forgot password.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateForgotData () {
			var loginVue = this
			return new Promise(function (resolve, reject) {
				if (!loginVue.user.email.length) {
					reject('Your email cannot be blank')
				} else if (!emailPattern.test(loginVue.user.email)) {
					reject('Please enter a valid email')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To check if the email is valid before submitting to the backend for forgot password.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateResetData () {
			var loginVue = this
			return new Promise(function (resolve, reject) {
				if (loginVue.newPassword.length < 8) {
					reject('Your new password must be at least 8 characters')
				} else if (loginVue.newPassword !== loginVue.passwordCheck) {
					reject('Passwords do not match')
				} else if (!emailPattern.test(loginVue.user.email)) {
					reject('Please enter a valid email')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To prompt the backend call that logs the user in.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		login (event) {
			var disabledButton = GlobalFunctions.disableButton(event)
			var loginVue = this

			this.clearError()
			return loginVue
				.validateLoginData()
				.then(response => {
					/* eslint-disable no-undef */
					LoginFunctions.login(
						loginVue.user.email,
						loginVue.user.password
					)
						.then(response => {
							if (response.payload.show_password_reset === 1) {
								loginVue.token = response.payload.password
								// temporary login
								loginVue.goReset()
								loginVue.$router.push('forgot-password')
								// show password reset form
							} else {
								// not temporary log in, just a regular log in:
								disabledButton.complete()
								// set active user name
								loginVue.$root.activeUser = response.payload
								localStorage.setItem(
									'activeUser',
									JSON.stringify(loginVue.$root.activeUser)
								)
								// set userToken
								loginVue.$root.userToken =
									response.session.token
								localStorage.setItem(
									'userToken',
									loginVue.$root.userToken
								)
								// set appId
								loginVue.$root.appId = response.App.app_id
								localStorage.setItem(
									'appId',
									loginVue.$root.appId
								)
								// set appSecret
								loginVue.$root.appSecret =
									response.App.app_secret
								localStorage.setItem(
									'appSecret',
									loginVue.$root.appSecret
								)
								// set createdBy
								loginVue.$root.createdBy =
									response.session.admin_id
								localStorage.setItem(
									'createdBy',
									loginVue.$root.createdBy
								)
								// set roles
								let userRoles = response.payload.roles.map(
									role => role.name
								)
								loginVue.$root.roles = userRoles
								localStorage.setItem(
									'roles',
									JSON.stringify(loginVue.$root.roles)
								)
								// set permissions
								let userPermissions = {}
								response.payload.assigned_permissions.forEach(
									permission => {
										userPermissions[permission.name] = true
									}
								)
								loginVue.setPermissions(userPermissions)
								loginVue.$root.permissions = userPermissions
								localStorage.setItem(
									'permissions',
									JSON.stringify(loginVue.$root.permissions)
								)

								// set account type && locations for Location Managers
								if (response.payload.type === 'admin') {
									loginVue.$root.accountType =
										'application_admin'
									localStorage.setItem(
										'accountType',
										loginVue.$root.accountType
									)
								} else if (
									response.payload.type === 'restricted'
								) {
									loginVue.$root.accountType = 'store_admin'
									loginVue.$root.storeLocations =
										response.payload.locations
									localStorage.setItem(
										'accountType',
										loginVue.$root.accountType
									)
								}

								// redirect
								let appRoutes = routes.filter(
									route => route.path === '/app'
								)[0].children
								let accessible = false
								for (let i = 0; i < appRoutes.length; i++) {
									const route = appRoutes[i]
									accessible = route.meta.permissions.some(
										permission =>
											this.$root.permissions[permission]
									)
									if (accessible) {
										this.$router.push({
											path: `/app/${route.path}`
										})
										break
									}
								}
								if (!accessible) {
									this.$router.push('/app/unauthorized')
								}
							}

							disabledButton.complete()
						})
						.catch(reason => {
							console.log(reason)
							disabledButton.cancel()
							ajaxErrorHandler({
								reason,
								errorText: 'We could not log you in',
								errorName: 'errorMessage',
								vue: loginVue
							})
							this.$refs.email.focus()
						})
				})
				.catch(reason => {
					disabledButton.cancel()
					// If validation fails then display the error message
					loginVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
		},
		/**
		 * To prompt the backend call that resets the user's password.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		reset (event) {
			// var disabledButton = GlobalFunctions.disableButton(event)
			var loginVue = this
			this.clearError()
			return loginVue
				.validateResetData()
				.then(response => {
					/* eslint-disable no-undef */
					LoginFunctions.reset(
						loginVue.token,
						loginVue.user.email,
						loginVue.newPassword,
						loginVue.passwordCheck
					)
						.then(response => {
							loginVue.user.password = loginVue.newPassword
							loginVue.login(event)
							// on successfull password reset, call loginVue.login
						})
						.catch(reason => {
							// disabledButton.cancel()
							ajaxErrorHandler({
								reason,
								errorText: 'We could not log you in',
								errorName: 'errorMessage',
								vue: loginVue
							})
							this.$refs.email.focus()
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					loginVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
		},
		/**
		 * To prompt the backend call that sends the user a password reset after forgetting password.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		forgot (event) {
			// var disabledButton = GlobalFunctions.disableButton(event)
			var loginVue = this
			this.clearError()
			return loginVue
				.validateForgotData()
				.then(response => {
					/* eslint-disable no-undef */
					LoginFunctions.forgot(loginVue.user.email)
						.then(response => {
							// disabledButton.complete()
							this.emailSent = true
							this.forgotMessage = response.message
							this.test = true
							this.$forceUpdate()
						})
						.catch(reason => {
							// disabledButton.cancel()
							ajaxErrorHandler({
								reason,
								errorText: 'Something went wrong',
								errorName: 'errorMessage',
								vue: loginVue
							})
							this.$refs.email.focus()
						})
				})
				.catch(reason => {
					// disabledButton.cancel()
					// If validation fails then display the error message
					loginVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
		},
		...mapMutations({
			setPermissions: 'SET_PERMISSIONS'
		})
	},
	components: {
		Dropdown
	}
}
</script>

<style>
.login-content {
	margin-bottom: 60px;
}
.reset-form {
	margin-top: 80px;
}
.forgot-link-text {
	display: block;
	margin-top: 10px;
}
.forgot-link {
	cursor: pointer;
}
.forgot-link:hover {
	color: #2499a3;
}
.col-sm-6-wide {
	width: 100%;
	padding: 0 15px;
}
.col-md-6-wide {
	width: 100%;
	padding: 0 15px;
}
.user-login-5 .alert-email-error {
	margin-top: 0px;
}
.user-login-5 .forget-form .alert {
	margin-top: 0px;
}
</style>

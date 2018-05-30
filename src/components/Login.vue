<template>
	<div id="login" class="login">
		<div class="user-login-5">
			<div class="row bs-reset">
				<div class="col-md-6 bs-reset mt-login-5-bsfix">
                    <div class="login-bg">
                    	<img class="login-logo" src="../assets/img/app/unoapp-commerce-logo.png" />
                    </div>
                </div>
                <div class="col-md-6 login-container bs-reset mt-login-5-bsfix">
                	<div class="login-content" v-if="!forgotPassword">
                		<h1>UNOapp Commerce Login</h1>
                		<form class="login-form" @submit.prevent="login($event)" novalidate>
                            <div class="alert alert-danger" v-show="errorMessage.length" ref="errorMessage">
                                <button class="close" data-close="alert" @click.prevent="clearError()"></button>
                                <span>{{errorMessage}}</span>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <input 
                                    	ref="email" 
                                    	class="form-control form-control-solid placeholder-no-fix form-group"
                                    	type="email"
                                    	placeholder="Email" 
                                    	name="email" 
                                    	v-model="user.email"
                                    	@keyup.enter="focusPassword"
                                    />
                               	</div>
                                <div class="col-sm-6">
                                    <input 
                                    	ref="password"
                                    	class="form-control form-control-solid placeholder-no-fix form-group"
                                    	type="password" 
                                    	placeholder="Password" 
                                    	name="password"
                                    	v-model="user.password"
                                    	@keyup.enter="login"
                                    /> 
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 text-right">
                                    <button class="btn green" type="submit">Login</button>
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
import {BackgroundRotator} from '../assets/scripts/backgroundRotator'
import ajaxErrorHandler from '../controllers/ErrorController'

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
			emailSent: false
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
		var images = [
			img1,
			img2,
			img3
		]

		var options = {fade: 1000, duration: 6000}

		BackgroundRotator(elm, images, options).init()

		this.$refs.email.focus()
	},
	methods: {
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
		 * To check if the email and password are valid before submitting to the backend.
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
		 * To prompt the backend call that logs the user in.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		login (event) {
			var disabledButton = GlobalFunctions.disableButton(event)
			var loginVue = this

			this.clearError()
			return loginVue.validateLoginData()
			.then(response => {
				/* eslint-disable no-undef */
				LoginFunctions.login(loginVue.user.email, loginVue.user.password).then(response => {
					disabledButton.complete()

					// set active user name
					loginVue.$root.activeUser = response.payload
					localStorage.setItem('activeUser', JSON.stringify(loginVue.$root.activeUser))
					// set userToken
					loginVue.$root.userToken = response.session.token
					localStorage.setItem('userToken', loginVue.$root.userToken)
					// set appId
					loginVue.$root.appId = response.App.app_id
					localStorage.setItem('appId', loginVue.$root.appId)
					// set appSecret
					loginVue.$root.appSecret = response.App.app_secret
					localStorage.setItem('appSecret', loginVue.$root.appSecret)
					// set createdBy
					loginVue.$root.createdBy = response.session.admin_id
					localStorage.setItem('createdBy', loginVue.$root.createdBy)
					// set account type && locations for Location Managers
					if (response.payload.type === 'admin') {
						loginVue.$root.accountType = 'application_admin'
						localStorage.setItem('accountType', loginVue.$root.accountType)
						loginVue.$router.push('/app')
					} else if (response.payload.type === 'restricted') {
						loginVue.$root.accountType = 'store_admin'
						loginVue.$root.storeLocations = response.payload.locations
						localStorage.setItem('accountType', loginVue.$root.accountType)
						loginVue.$router.push('/app/store_manager/stores')
					}
				}).catch(reason => {
					disabledButton.cancel()
					ajaxErrorHandler({
						reason,
						errorText: 'We could not log you in',
						errorName: 'errorMessage',
						vue: loginVue
					})
					throw reason
				})
			}).catch(reason => {
				disabledButton.cancel()
				// If validation fails then display the error message
				loginVue.errorMessage = reason
				window.scrollTo(0, 0)
			})
		}
	},
	components: {
		Dropdown
	}
}
</script>

<style>
	.user-login-5 .alert-email-error {
		margin-top: 0px;
	}
	.user-login-5 .forget-form .alert {
		margin-top: 0px;
	}
</style>

<template>
	<div id="login" class="login">
        <div class="alert alert-danger" v-if="errorMessage.length">
	        <button class="close" data-close="alert" @click.prevent="clearError()"></button>
	        <span>{{errorMessage}}</span>
	    </div>
	</div>
</template>

<script>
/**
 * @module Login
 */

import GlobalFunctions from '../global'
import LoginFunctions from '../controllers/Login'
import ajaxErrorHandler from '../controllers/ErrorController'

export default {
	name: 'login',
	data () {
		return {
			errorMessage: ''
		}
	},
	created () {
		if (this.$route.query.business_id !== undefined && this.$route.query.account_token !== undefined) {
			this.login()
		} else {
			/* eslint-disable no-undef */
			var appId = localStorage.getItem('appId')
			var appSecret = localStorage.getItem('appSecret')
			var userToken = localStorage.getItem('userToken')
			var createdBy = localStorage.getItem('createdBy')
			var accountType = localStorage.getItem('accountType')
			var activeUser = localStorage.getItem('activeUser')
			var accountToken = localStorage.getItem('accountToken')
			var businessId = localStorage.getItem('businessId')
			let routePath = sessionStorage.getItem('routePath')
			/* eslint-enable no-undef */

			if (!appId || !appSecret || !userToken || !createdBy || !accountType || !activeUser || !accountToken || !businessId) {
				window.location.href = `${GlobalFunctions.accountsUrl}/?redirect_to=ecomm`
			} else {
				this.$root.activeUser = activeUser
				this.$root.userToken = userToken
				this.$root.appId = appId
				this.$root.appSecret = appSecret
				this.$root.createdBy = createdBy
				this.$root.accountType = accountType
				this.$root.accountToken = accountToken
				this.$root.businessId = businessId
			}

			this.$router.push(routePath || '/app')
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
	},
	methods: {
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To prompt the backend call that logs the user in.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		login (event) {
			const loginVue = this

			// if query params missing redirect to accounts

			let data = {
				business_id: this.$route.query.business_id,
				v3_token: this.$route.query.account_token
			}

			/* eslint-disable no-undef */
			LoginFunctions.login(data).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					// set account type && locations for Location Managers
					if (response.payload.type === 'admin') {
						loginVue.$root.accountType = 'application_admin'
					} else if (response.payload.type === 'restricted') {
						loginVue.$root.accountType = 'store_admin'
						loginVue.$root.storeLocations = response.payload.locations
					}
					localStorage.setItem('accountType', this.$root.accountType)
					// set active user name
					loginVue.$root.activeUser = response.payload.name
					localStorage.setItem('activeUser', loginVue.$root.activeUser)
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
					// set accountToken
					loginVue.$root.accountToken = loginVue.$route.query.account_token
					localStorage.setItem('accountToken', loginVue.$route.query.account_token)
					// set v3 business id
					loginVue.$root.businessId = loginVue.$route.query.business_id
					localStorage.setItem('businessId', loginVue.$route.query.business_id)

					// set account type && locations for Location Managers
					if (response.payload.type === 'admin') {
						loginVue.$router.push('/app')
					} else if (response.payload.type === 'restricted') {
						loginVue.$router.push('/app/store_manager/stores')
					}

					// disabledButton.complete()
				} else {
					loginVue.errorMessage = response.message
					disabledButton.cancel()
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason
				})
			})
		}
	}
}
</script>

<style>

</style>

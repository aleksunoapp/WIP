<template>
	<div id="app">
		<router-view v-if="computedMeta"></router-view>
		<error-message v-if="showErrorMessage" @closeErrorModal="closeErrorModal()"></error-message>
	</div>
</template>

<script>
import $ from 'jquery'
import ENV from './environment'
import { isEmpty } from 'lodash'
import ErrorMessage from './components/ErrorMessage'
import authenticateToken from './mixins/authenticateToken.js'

export default {
	name: 'app',
	/**
	 * Run on `created` to pull all of the data.
	 * @function
	 * @returns {undefined}
	 */
	created () {
		if (this.$route.params.uniqueUrl) {
			this.$root.token = this.$route.params.uniqueUrl
			this.$root.userActivity.clientId = this.$route.params.uniqueUrl
		}

		// Check if device is mobile (for hiding call/text buttons)
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			this.$root.mobile = true
		}

		// If url is from a dealer, authenticate right away
		if (this.$route.query.secret) {
			this.$root.dealer = true
			this.verificationCode = this.$route.query.secret
			this.authenticateToken()
		}

		this.getMetaData()
	},
	data () {
		return {
			showErrorMessage: false,
			verificationCode: ''
		}
	},
	computed: {
		/**
		 * To compute whether the meta data object is empty
		 * @function
		 * @returns {boolean} - Whether the meta data object is empty or not
		 */
		computedMeta () {
			return !isEmpty(this.$root.meta)
		}
	},
	methods: {
		/**
		 * To retreive services and meta data from api
		 * @function
		 * @returns {undefined}
		 */
		getMetaData () {
			let _this = this

			// Since we are repulling the data, the user should not be able to get past the verification screen
			if (this.$route.name !== 'code') {
				this.$router.push({name: 'code'})
			}

			$.getJSON(ENV.production_url + '/metadata/' + this.$root.token).done((response, textStatus, xhr) => {
				if (xhr.status === 200) {
					if (response.local === 'en-US') {
						response.local = 'en'
					} else {
						response.local = 'fr'
					}

					_this.$root.meta = Object.assign({}, response)
					delete _this.$root.meta.serviceCategories
					_this.$root.serviceCategories = response.serviceCategories
				} else {
					this.showErrorMessage = true
				}
			})
		},
		/**
		 * To close the error modal
		 * @function
		 * @returns {undefined}
		 */
		closeErrorModal () {
			this.showErrorMessage = false
		}
	},
	components: {
		ErrorMessage
	},
	mixins: [authenticateToken]
}
</script>

/**
 * @module Global
 */
import $ from 'jquery'
import { App } from './main.js'
import environment from './environment'
const { production, staging, development } = environment

export default {
	urls: {
		approvals: (function () {
			if (production) {
				return 'https://approval.api.unoapp.io'
			} else if (staging) {
				return 'https://approval.beta.api.unoapp.io'
			} else {
				return 'https://approval.dev.api.unoapp.io'
			}
		})()
	},
	headers: {
		approvals: (function () {
			if (production) {
				return {
					appId: '3jJIMoDLAJW2qzQk0DmFCVxhbRzVIL4Qn',
					appSecret: 'cgLb2aWAyY1k3TBmquEjjbOjWxZRc6iw2'
				}
			} else if (staging) {
				return {
					appId: '46c9485f92a0f8ac29d66570893a3805',
					appSecret: '0276a6fd79282e1b73cdd209540cdfcd'
				}
			} else {
				return {
					appId: '46c9485f92a0f8ac29d66570893a3805',
					appSecret: '0276a6fd79282e1b73cdd209540cdfcd'
				}
			}
		})()
	},
	/**
	 * app_id for the Approvals API
	 */
	approvalsAppId: (function () {
		if (production) {
			return '5b60a158baf2d10681b79cd1'
		} else if (staging) {
			return '5b291f11dc35e663e8847981'
		} else {
			return '5b291f11dc35e663e8847981'
		}
	})(),
	/**
	 * business id to identify the business aka brand aka customer (2 is Freshii)
	 */
	businessId: 2,
	/**
	 * base url for UNOapp accounts frontend, with # if accounts router is in hash mode
	 */
	// development
	accountsUrl: development
		? 'http://localhost:8002/#'
		: 'http://accounts.beta.unoapp.io/#',
	/**
	 * base url for API calls, other than Message calls
	 */
	baseUrl: (function () {
		if (production) {
			return 'https://freshii.api.unoapp.io'
		} else if (staging) {
			return 'https://freshii.beta.api.unoapp.io'
		} else {
			return 'http://dev.api.unoapp.io/freshii'
		}
	})(),
	/**
	 * base url for Resources API calls
	 */
	resourcesBaseUrl: (function () {
		if (production) {
			return 'https://resources.api.unoapp.io'
		} else if (staging) {
			return 'https://resources.dev.api.unoapp.io'
		} else {
			return 'https://resources.dev.api.unoapp.io'
		}
	})(),
	/**
	 * business ID to use for the Resources API
	 */
	resourcesBusinessId: 2,
	/**
	 * base url for API calls to send Messages
	 */
	messageBaseUrl: (function () {
		if (production) {
			return 'https://notifications.api.unoapp.io'
		} else if (staging) {
			return 'https://notifications.beta.api.unoapp.io'
		} else {
			return 'https://notifications.dev.api.unoapp.io'
		}
	})(),
	/**
	 * app token for API calls to send Messages
	 */
	messageAppToken: (function () {
		if (production) {
			return ''
		} else if (staging) {
			return 'bearer e3e7f5af3c458aa04b3722dc77c4020a'
		} else {
			return 'bearer bed62ee5c3cc97a2d5297f973af1c15e'
		}
	})(),
	/**
	 * app token for API calls to send Messages to OMA users
	 */
	OMAUsersMessageAppToken: (function () {
		if (production) {
			return ''
		} else if (staging) {
			return 'bearer 39d270dc380d5ac331f0affc7a4ddb59'
		} else {
			return 'bearer 6b1642515315f527604919b430fe79de'
		}
	})(),
	/**
	 * base url for API calls to Loyalty endpoints
	 */
	loyaltyUrl: (function () {
		if (production) {
			return 'https://loyalty.api.unoapp.io'
		} else if (staging) {
			return 'https://loyalty.beta.api.unoapp.io'
		} else {
			return 'https://loyalty.dev.api.unoapp.io'
		}
	})(),
	/**
	 * app id for API calls to Loyalty endpoints
	 */
	loyaltyAppId: (function () {
		if (production) {
			return ''
		} else if (staging) {
			return '0CA0D7Lk9D6jZvgeklHiBTX99PYbTDIs'
		} else {
			return '0CA0D7Lk9D6jZvgeklHiBTX99PYbTDIs'
		}
	})(),
	/**
	 * app secret for API calls to Loyalty endpoints
	 */
	loyaltyAppSecret: (function () {
		if (production) {
			return ''
		} else if (staging) {
			return 'JnJqjxCKnVpvgO5cWGWSkfesTQWaiP46'
		} else {
			return 'JnJqjxCKnVpvgO5cWGWSkfesTQWaiP46'
		}
	})(),
	/**
	 * API key for Google Maps Javascript API
	 */
	googleMapsJavascriptApiKey: 'AIzaSyAweYWedKzekUFGNFf-Qb1Ox7ce6Pul2xQ', // aleks@unoapp.com
	/**
	 * Ajax wrapper for making backend calls.
	 * @function
	 * @param {object} options - Options for the ajax call being made.
	 * @param {boolean} api - The api to call
	 * @returns {undefined}
	 */
	$ajax: function (options, api) {
		var localhost = this.baseUrl + '/api'

		if (api === 'approvals') {
			options.url = this.urls[api] + options.url
			const headers = this.headers

			options.beforeSend = function (xhr) {
				xhr.setRequestHeader('app-id', headers[api].appId)
				xhr.setRequestHeader('app-secret', headers[api].appSecret)
				xhr.setRequestHeader('auth-token', App.userToken)
			}
		} else {
			options.url = localhost + options.url
			options.beforeSend = function (xhr) {
				xhr.setRequestHeader('app-id', App.appId)
				xhr.setRequestHeader('app-secret', App.appSecret)
				xhr.setRequestHeader('auth-token', App.userToken)
			}
		}

		if (
			options.method.toLowerCase() === 'post' ||
			options.method.toLowerCase() === 'put'
		) {
			options.contentType = 'application/json'
			options.data = JSON.stringify(options.data)
		}

		$.ajax(options)
	},
	/**
	 * Global function for disabling buttons when a request is made.
	 * To use: Set up a variable `my_variable` that calls this function
	 *		   When the backend call is a success call my_variable.complete()
	 *		   When the backend call is an error call my_variable.cancel()
	 * @function
	 * @param {object} event - The click event that triggered this function.
	 * @returns {object} An object of functions for manipulating the selected button
	 */
	disableButton: function (event) {
		var button
		if (event.type === 'submit') {
			button = $(event.target).find('button[type=submit]')
		} else {
			button = $(event.target)
		}

		var originalText

		// For bypassing the DOM when unit testing
		if (!button[0]) {
			originalText = 'This is for save testing.'
		} else {
			originalText = button[0].textContent
		}
		var originalColor = button.css('background-color')
		var whileDisabled, complete

		button.addClass('background-animate')

		if (originalText.toLowerCase().indexOf('save') !== -1) {
			whileDisabled = 'saving'
			complete = 'complete'
		}

		if (whileDisabled) {
			button.text(whileDisabled)
		}

		button.prop('disabled', true)
		return {
			complete: function () {
				setTimeout(function () {
					if (complete) {
						button.text(complete)
						button.css({ 'background-color': '#5cb85c' })
					}
					button.prop('disabled', false)

					setTimeout(function () {
						button.css({ 'background-color': originalColor })
						button.text(originalText)
					}, 1000)
				}, 100)
			},
			cancel: function () {
				setTimeout(function () {
					button.text(originalText)
					button.prop('disabled', false)
				}, 100)
			}
		}
	}
}

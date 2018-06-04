/**
 * @module Global
 */
import $ from 'jquery'
import {App} from './main.js'
import environment from './environment'
const { production, staging, development } = environment

export default {
	urls: {
		approvals: (function () {
			if (production) {
				return ''
			} else if (staging) {
				return 'https://approval.beta.api.unoapp.io'
			} else {
				return 'https://approval.dev.api.unoapp.io'
			}
		}())
	},
	/**
	 * business id to identify the business aka brand aka customer (2 is Freshii)
	 */
	businessId: 2,
	/**
	 * base url for UNOapp accounts frontend, with # if accounts router is in hash mode
	 */
	// development
	accountsUrl: development ? 'http://localhost:8002/#' : 'http://accounts.beta.unoapp.io/#',
	/**
	 * base url for API calls, other than Message calls
	 */
	baseUrl: (function () {
		if (production) {
			return ''
		} else if (staging) {
			return 'https://freshii.beta.api.unoapp.io'
		} else {
			return 'https://freshii.dev.api.unoapp.io'
		}
	}()),
	/**
	 * base url for API calls, other than Message calls
	 */
	v3BaseUrl: 'https://resources.dev.api.unoapp.io',
	/**
	 * base url for API calls to send Messages
	 */
	messageBaseUrl: 'https://notifications.dev.api.unoapp.io',
	/**
	 * app token for API calls to send Messages
	 */
	messageAppToken: 'bearer bed62ee5c3cc97a2d5297f973af1c15e',
	/**
	 * app token for API calls to send Messages to OMA users
	 */
	OMAUsersMessageAppToken: 'bearer 6b1642515315f527604919b430fe79de',
	/**
	 * base url for API calls to Loyalty endpoints
	 */
	loyaltyUrl: 'https://loyalty.dev.api.unoapp.io',
	/**
	 * app id for API calls to Loyalty endpoints
	 */
	loyaltyAppId: '0CA0D7Lk9D6jZvgeklHiBTX99PYbTDIs',
	/**
	 * app secret for API calls to Loyalty endpoints
	 */
	loyaltyAppSecret: 'JnJqjxCKnVpvgO5cWGWSkfesTQWaiP46',
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

		if (api) {
			options.url = this.urls[api] + options.url
		} else {
			options.url = localhost + options.url
		}

		// ecomm API's auth headers
		options.beforeSend = function (xhr) {
			xhr.setRequestHeader('app-id', App.appId)
			xhr.setRequestHeader('app-secret', App.appSecret)
			xhr.setRequestHeader('auth-token', App.userToken)
		}

		if (options.method.toLowerCase() === 'post' || options.method.toLowerCase() === 'put') {
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
						button.css({'background-color': '#5cb85c'})
					}
					button.prop('disabled', false)

					setTimeout(function () {
						button.css({'background-color': originalColor})
						button.text(originalText)
					}, 1000)
				}, 100)
			},
			cancel: function () {
				setTimeout(function () { button.text(originalText); button.prop('disabled', false) }, 100)
			}
		}
	}
}

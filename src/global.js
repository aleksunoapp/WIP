/**
 * @module Global
 */
import $ from 'jquery'
// import environment from './environment'

export default {
	/**
	 * base url for API calls, other than Message calls
	 */
	baseUrl: 'http://freshii2.unoapp.xyz',
	/**
	 * base url for API calls to send Messages
	 */
	messageBaseUrl: 'https://35.162.38.115:8004',
	/**
	 * app token for API calls to send Messages
	 */
	messageAppToken: 'bearer 9fca7d07b567f95d8a682cb4d2ea871e',
	/**
	 * base url for API calls to Loyalty endpoints
	 */
	loyaltyUrl: 'http://loyalty.unoapp.xyz',
	/**
	 * app id for API calls to Loyalty endpoints
	 */
	loyaltyAppId: 'TSh5JsOTHx8FKMqS6XnggH0Z5L0pkP1O',
	/**
	 * app secret for API calls to Loyalty endpoints
	 */
	loyaltyAppSecret: 'P6KWcbixUIkxUT4jpmcnCFUBC7hHSGnf',
	/**
	 * Ajax wrapper for making backend calls.
	 * @function
	 * @param {object} options - Options for the ajax call being made.
	 * @param {boolean} noRetry - Used to prevent retrying the call.
	 * @returns {undefined}
	 */
	$ajax: function (options, noRetry) {
		var localhost = this.baseUrl + '/api'

		options.url = localhost + options.url
		if (options.method.toLowerCase() === 'post') {
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

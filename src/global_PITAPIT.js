/**
 * @module Global
 */
import $ from 'jquery'
import environment from './environment'
import store from './store'
const { production, staging, development } = environment

export default {
	urls: {
		approvals: (function () {
			if (production) {
				return 'https://approval.api.unoapp.io'
			} else if (staging) {
				return 'https://approval.beta.api.unoapp.io'
			} else if (development) {
				return 'https://approval.dev.api.unoapp.io'
			}
		})(),
		loyalty: (function () {
			if (production) {
				return 'https://loyalty.api.unoapp.io'
			} else if (staging) {
				return 'https://loyalty.beta.api.unoapp.io'
			} else if (development) {
				return 'https://loyalty.dev.api.unoapp.io'
			}
		})(),
		ecomm: (function () {
			if (production) {
				return 'https://pitapit.api.unoapp.io/api'
			} else if (staging) {
				return 'https://pitapit.beta.api.unoapp.io/api'
			} else if (development) {
				return 'http://pitapit.dev.api.unoapp.io/api'
			}
		})(),
		resources: (function () {
			if (production) {
				return 'https://resources.beta.api.unoapp.io'
			} else if (staging) {
				return 'https://resources.dev.api.unoapp.io'
			} else if (development) {
				return 'https://resources.dev.api.unoapp.io'
			}
		})()
	},
	headers: function () {
		return {
			approvals: (function () {
				if (production) {
					return {
						appId: '',
						appSecret: ''
					}
				} else if (staging) {
					return {
						appId: '',
						appSecret: ''
					}
				} else if (development) {
					return {
						appId: '8xHDsWCRGZ1wzDhPPlaVG3Rfwih7oDN3',
						appSecret: 'otHHmhLOocu9zJIVRV5N4eCse32KmzxL'
					}
				}
			})(),
			loyalty: (function () {
				if (production) {
					return {
						appId: 'KWpZuK0lscFrJ84dkUGsMQVQGDHAtAHv',
						appSecret: 'QVDvjk0cn4jltPnNEQi2hwQlD17pU0dr'
					}
				} else if (staging) {
					return {
						appId: '0CA0D7Lk9D6jZvgeklHiBTX99PYbTDIs',
						appSecret: 'JnJqjxCKnVpvgO5cWGWSkfesTQWaiP46'
					}
				} else if (development) {
					return {
						appId: '0CA0D7Lk9D6jZvgeklHiBTX99PYbTDIs',
						appSecret: 'JnJqjxCKnVpvgO5cWGWSkfesTQWaiP46'
					}
				}
			})(),
			resources: (function () {
				return {
					appId: store.getters.appId,
					appSecret: store.getters.appSecret
				}
			})(),
			ecomm: (function () {
				return {
					appId: store.getters.appId,
					appSecret: store.getters.appSecret
				}
			})()
		}
	},
	/**
	 * app_id for the Approvals API
	 */
	approvalsAppId: (function () {
		if (production) {
			return ''
		} else if (staging) {
			return ''
		} else if (development) {
			return '5b749a88db4a13057f091b12'
		}
	})(),
	/**
	 * business ID to use for the Resources API
	 */
	resourcesBusinessId: 6,
	/**
	 * base url for API calls to send Messages
	 */
	messageBaseUrl: (function () {
		if (production) {
			return 'https://notifications.api.unoapp.io'
		} else if (staging) {
			return 'https://notifications.beta.api.unoapp.io'
		} else if (development) {
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
		} else if (development) {
			return 'bearer ef05c132e7c46e6d40bf4b93975a4b4b'
		}
	})(),
	/**
	 * string to prepend to user's id as alias when messaging OMA users
	 */
	application_name: 'pitapit',
	/**
	 * app token for API calls to send Messages to OMA users
	 */
	OMAUsersMessageAppToken: (function () {
		if (production) {
			return ''
		} else if (staging) {
			return 'bearer '
		} else if (development) {
			return 'bearer 6b1642515315f527604919b430fe79de'
		}
	})(),
	/**
	 * API key for Google Maps Javascript API
	 */
	googleMapsJavascriptApiKey: 'AIzaSyBJs2f0TNNui_OcRHgVRTIsJAvGQ0EB7oA',
	/**
	 * Ajax wrapper for making backend calls.
	 * @function
	 * @param {object} options - Options for the ajax call being made.
	 * @param {boolean} api - The api to call
	 * @returns {undefined}
	 */
	$ajax: function (options, api = 'ecomm') {
		let headers = this.headers()
		options.url = this.urls[api] + options.url

		options.beforeSend = function (xhr) {
			xhr.setRequestHeader('app-id', headers[api].appId)
			xhr.setRequestHeader('app-secret', headers[api].appSecret)
			xhr.setRequestHeader('auth-token', store.getters.userToken)
		}

		if (
			options.processData !== false &&
			(
				options.method.toLowerCase() === 'post' ||
				options.method.toLowerCase() === 'put'
			)
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
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
				return 'https://approval.beta.api.unoapp.io'
			} else if (staging) {
				return 'https://approval.beta.api.unoapp.io'
			} else if (development) {
				return 'https://approval.dev.api.unoapp.io'
			}
		})(),
		loyalty: (function () {
			if (production) {
				return 'https://loyalty.beta.api.unoapp.io'
			} else if (staging) {
				return 'https://loyalty.beta.api.unoapp.io'
			} else if (development) {
				return 'https://loyalty.dev.api.unoapp.io'
			}
		})(),
		ecomm: (function () {
			if (production) {
				return 'https://demo-dfx.api.unoapp.io/api'
			} else if (staging) {
				return 'https://demo-dfx.api.unoapp.io/api'
			} else if (development) {
				return 'http://demo-dfx.api.unoapp.io/api'
			}
		})(),
		resources: (function () {
			if (production) {
				return 'https://resources.beta.api.unoapp.io'
			} else if (staging) {
				return 'https://resources.beta.api.unoapp.io'
			} else if (development) {
				return 'https://resources.beta.api.unoapp.io'
			}
		})()
	},
	headers: function () {
		return {
			approvals: (function () {
				if (production) {
					return {
						appId: 'NbtdJcO8fuLzvzLpEtRih85aadufa9mP',
						appSecret: 'tSYZUyPAxXQkNkEnwVMWdgThncYSqx3U'
					}
				} else if (staging) {
					return {
						appId: 'NbtdJcO8fuLzvzLpEtRih85aadufa9mP',
						appSecret: 'tSYZUyPAxXQkNkEnwVMWdgThncYSqx3U'
					}
				} else if (development) {
					return {
						appId: 'NbtdJcO8fuLzvzLpEtRih85aadufa9mP',
						appSecret: 'tSYZUyPAxXQkNkEnwVMWdgThncYSqx3U'
					}
				}
			})(),
			loyalty: (function () {
				if (production) {
					return {
						appId: 'Z5lAHRApxlL9OxSCO8KAssgw7Dpt4YA8',
						appSecret: 'T0Ov5EpwCEDIcg1EWjondw5ugz8di8Bq'
					}
				} else if (staging) {
					return {
						appId: 'Z5lAHRApxlL9OxSCO8KAssgw7Dpt4YA8',
						appSecret: 'T0Ov5EpwCEDIcg1EWjondw5ugz8di8Bq'
					}
				} else if (development) {
					return {
						appId: 'Z5lAHRApxlL9OxSCO8KAssgw7Dpt4YA8',
						appSecret: 'T0Ov5EpwCEDIcg1EWjondw5ugz8di8Bq'
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
			return '5bda424ce39d933feee07575'
		} else if (staging) {
			return '5bda424ce39d933feee07575'
		} else if (development) {
			return '5bda424ce39d933feee07575'
		}
	})(),
	/**
	 * business ID to use for the Resources API
	 */
	resourcesBusinessId: 3,
	/**
	 * base url for API calls to send Messages
	 */
	messageBaseUrl: (function () {
		if (production) {
			return 'https://notifications.beta.api.unoapp.io'
		} else if (staging) {
			return 'https://notifications.beta.api.unoapp.io'
		} else if (development) {
			return 'https://notifications.beta.api.unoapp.io'
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
			return 'bearer bed62ee5c3cc97a2d5297f973af1c15e'
		}
	})(),
	/**
	 * string to prepend to user's id as alias when messaging OMA users
	 */
	application_name: 'freshii2',
	/**
	 * app token for API calls to send Messages to OMA users
	 */
	OMAUsersMessageAppToken: (function () {
		if (production) {
			return 'bearer 39d270dc380d5ac331f0affc7a4ddb59'
		} else if (staging) {
			return 'bearer 39d270dc380d5ac331f0affc7a4ddb59'
		} else if (development) {
			return 'bearer 39d270dc380d5ac331f0affc7a4ddb59'
		}
	})(),
	/**
	 * OMA Message actions and ID's
	 */
	OMAMessageAction: (function () {
		if (production) {
			return [
				{
					id: 11,
					type: 'CLOSE',
					value: 'Close'
				},
				{
					id: 15,
					type: 'CALL',
					value: 'Call'
				},
				{
					id: 12,
					type: 'GOTO_LINK',
					value: 'Website'
				}
			]
		} else if (staging) {
			return [
				{
					id: 11,
					type: 'CLOSE',
					value: 'Close'
				},
				{
					id: 15,
					type: 'CALL',
					value: 'Call'
				},
				{
					id: 12,
					type: 'GOTO_LINK',
					value: 'Website'
				}
			]
		} else if (development) {
			return [
				{
					id: 21,
					type: 'CLOSE',
					value: 'Close'
				},
				{
					id: 25,
					type: 'CALL',
					value: 'Call'
				},
				{
					id: 22,
					type: 'GOTO_LINK',
					value: 'Website'
				}
			]
		}
	})(),
	/**
	 * API key for Google Maps Javascript API
	 */
	googleMapsJavascriptApiKey: 'AIzaSyBJs2f0TNNui_OcRHgVRTIsJAvGQ0EB7oA', // aleks@unoapp.com
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
